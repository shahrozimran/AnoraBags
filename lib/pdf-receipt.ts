import "server-only"
import type { Order } from "@/lib/types"

// pdfkit is a CommonJS module — import dynamically to keep ESM compatibility
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require("pdfkit") as typeof import("pdfkit")

// ---------------------------------------------------------------------------
// Colour palette (mirrors the Anora Bags design system)
// ---------------------------------------------------------------------------
const C = {
  dark:   "#23170F",
  brown:  "#462F1D",
  cream:  "#FAF6F1",
  sand:   "#ECE2D8",
  border: "#E5DCD2",
  muted:  "#8C7A6B",
  white:  "#ffffff",
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function fill(doc: PDFKit.PDFDocument, hex: string) {
  doc.fillColor(hexToRgb(hex))
}

function stroke(doc: PDFKit.PDFDocument, hex: string) {
  doc.strokeColor(hexToRgb(hex))
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------
export function generateReceiptPDF(order: Order): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      info: {
        Title:   `Anora Bags — Order ${order.orderNumber}`,
        Author:  "Anora Bags",
        Subject: "Order Receipt",
        Creator: "anorabags.com",
      },
      bufferPages: true,
    })

    const chunks: Buffer[] = []
    doc.on("data",  (c: Buffer) => chunks.push(c))
    doc.on("end",   ()          => resolve(Buffer.concat(chunks)))
    doc.on("error", reject)

    const W  = doc.page.width   // 595
    const ML = 48               // left margin
    const MR = 48               // right margin
    const TW = W - ML - MR     // text/content width  (499)

    // ── HEADER BANNER ────────────────────────────────────────────────────────
    doc.rect(0, 0, W, 130).fill(hexToRgb(C.dark))

    fill(doc, C.sand)
    doc.fontSize(8).font("Helvetica").text("PREMIUM LEATHER HANDBAGS", ML, 24, {
      width: TW, align: "center", characterSpacing: 3,
    })

    fill(doc, C.white)
    doc.fontSize(30).font("Helvetica-Bold").text("ANORA BAGS", ML, 35, {
      width: TW, align: "center", characterSpacing: 1,
    })

    fill(doc, C.sand)
    doc.fontSize(8).font("Helvetica").text("ORDER RECEIPT", ML, 72, {
      width: TW, align: "center", characterSpacing: 4,
    })

    // Order number pill
    const pillW = 180, pillH = 24
    const pillX = (W - pillW) / 2
    doc.roundedRect(pillX, 88, pillW, pillH, 12).fill(hexToRgb(C.brown))
    fill(doc, C.white)
    doc.fontSize(10).font("Helvetica-Bold").text(order.orderNumber, pillX, 95, {
      width: pillW, align: "center",
    })

    // ── META ROW ─────────────────────────────────────────────────────────────
    const placedAt = new Date(order.createdAt).toLocaleString("en-PK", {
      timeZone: "Asia/Karachi", dateStyle: "long", timeStyle: "short",
    })

    fill(doc, C.muted)
    doc.fontSize(8).font("Helvetica").text(
      `Date: ${placedAt} (PKT)   |   Payment: Cash on Delivery   |   Status: Confirmed`,
      ML, 145, { width: TW, align: "center" }
    )

    // Thin divider
    stroke(doc, C.border)
    doc.moveTo(ML, 162).lineTo(W - MR, 162).lineWidth(0.5).stroke()

    // ── TWO-COLUMN INFO ───────────────────────────────────────────────────────
    const colW    = (TW - 16) / 2  // gap = 16
    const leftX   = ML
    const rightX  = ML + colW + 16

    const sectionLabel = (label: string, x: number, y: number) => {
      doc.rect(x, y, colW, 18).fill(hexToRgb(C.sand))
      fill(doc, C.dark)
      doc.fontSize(7.5).font("Helvetica-Bold")
        .text(label, x + 6, y + 5, { width: colW - 12, characterSpacing: 1.5 })
      return y + 24
    }

    const infoRow = (label: string, value: string, x: number, y: number) => {
      fill(doc, C.muted)
      doc.fontSize(7.5).font("Helvetica").text(label, x, y, { width: colW })
      fill(doc, C.dark)
      doc.fontSize(8.5).font("Helvetica-Bold").text(value, x, y + 10, { width: colW })
      return y + 24
    }

    let leftY  = sectionLabel("CUSTOMER DETAILS", leftX,  176)
    let rightY = sectionLabel("DELIVERY ADDRESS", rightX, 176)

    leftY = infoRow("Full Name", order.customerName, leftX, leftY)
    leftY = infoRow("Phone",     order.phone,         leftX, leftY)

    if (order.email && order.email !== "guest@anorabags.com") {
      leftY = infoRow("Email", order.email, leftX, leftY)
    }

    // Delivery lines
    const addrLines = [
      order.address,
      order.apartment,
      `${order.city}${order.postalCode ? " " + order.postalCode : ""}`,
      "Pakistan",
    ].filter(Boolean) as string[]

    rightY = sectionLabel("DELIVERY ADDRESS", rightX, 176) // already drawn above — re-use y
    rightY = 176 + 24
    addrLines.forEach((line) => {
      fill(doc, C.dark)
      doc.fontSize(8.5).font("Helvetica").text(line, rightX, rightY, { width: colW })
      rightY += 13
    })
    if (order.deliveryNotes) {
      rightY += 4
      fill(doc, C.muted)
      doc.fontSize(7.5).font("Helvetica-Oblique")
        .text(`Note: ${order.deliveryNotes}`, rightX, rightY, { width: colW })
      rightY += 14
    }

    // ── ITEMS TABLE ───────────────────────────────────────────────────────────
    const tableY = Math.max(leftY, rightY) + 16

    // Divider
    stroke(doc, C.border)
    doc.moveTo(ML, tableY - 6).lineTo(W - MR, tableY - 6).lineWidth(0.5).stroke()

    // Table header
    const colProduct  = { x: ML,       w: 220 }
    const colShade    = { x: ML + 228, w: 100 }
    const colQty      = { x: ML + 336, w:  50 }
    const colPrice    = { x: ML + 394, w: 105 }

    doc.rect(ML, tableY, TW, 20).fill(hexToRgb(C.dark))
    fill(doc, C.sand)
    doc.fontSize(7.5).font("Helvetica-Bold")
    doc.text("PRODUCT",  colProduct.x + 4,  tableY + 6)
    doc.text("SHADE",    colShade.x,         tableY + 6)
    doc.text("QTY",      colQty.x,           tableY + 6, { width: colQty.w,   align: "center" })
    doc.text("PRICE",    colPrice.x,         tableY + 6, { width: colPrice.w, align: "right" })

    let rowY = tableY + 26

    order.items.forEach((item, i) => {
      const rowH = 26
      if (i % 2 === 0) {
        doc.rect(ML, rowY - 4, TW, rowH).fill(hexToRgb(C.cream))
      }

      fill(doc, C.dark)
      doc.fontSize(9).font("Helvetica-Bold")
        .text(item.name, colProduct.x + 4, rowY, { width: colProduct.w - 4, ellipsis: true })

      fill(doc, C.brown)
      doc.fontSize(8).font("Helvetica")
        .text(item.color, colShade.x, rowY, { width: colShade.w })

      fill(doc, C.dark)
      doc.fontSize(8).font("Helvetica-Bold")
        .text(String(item.quantity), colQty.x, rowY, { width: colQty.w, align: "center" })

      fill(doc, C.dark)
      doc.fontSize(8.5).font("Helvetica-Bold")
        .text(`Rs. ${(item.price * item.quantity).toLocaleString()}`, colPrice.x, rowY, {
          width: colPrice.w, align: "right",
        })

      rowY += rowH
    })

    // ── TOTALS ────────────────────────────────────────────────────────────────
    rowY += 8
    stroke(doc, C.border)
    doc.moveTo(ML, rowY).lineTo(W - MR, rowY).lineWidth(0.5).stroke()
    rowY += 12

    const totX  = ML + TW - 170  // right-align totals block
    const totLW = 100
    const totVW = 70

    const totRow = (label: string, value: string, bold = false, y = rowY) => {
      fill(doc, C.muted)
      doc.fontSize(8).font("Helvetica").text(label, totX, y, { width: totLW })
      fill(doc, C.dark)
      doc.fontSize(8).font(bold ? "Helvetica-Bold" : "Helvetica")
        .text(value, totX + totLW, y, { width: totVW, align: "right" })
      rowY = y + 16
    }

    totRow("Subtotal",         `Rs. ${order.subtotal.toLocaleString()}`)
    totRow("Shipping",         "Free Delivery")
    totRow("Payment Method",   "Cash on Delivery")

    rowY += 4

    // Total box
    const totBoxX = totX - 4
    const totBoxW = totLW + totVW + 8
    doc.rect(totBoxX, rowY, totBoxW, 32).fill(hexToRgb(C.dark))
    fill(doc, C.sand)
    doc.fontSize(7.5).font("Helvetica").text("TOTAL DUE AT DOORSTEP", totBoxX + 8, rowY + 5, {
      width: totBoxW - 16,
    })
    fill(doc, C.white)
    doc.fontSize(13).font("Helvetica-Bold")
      .text(`Rs. ${order.totalAmount.toLocaleString()}`, totBoxX, rowY + 14, {
        width: totBoxW - 8, align: "right",
      })

    rowY += 50

    // ── FOOTER ────────────────────────────────────────────────────────────────
    stroke(doc, C.border)
    doc.moveTo(ML, rowY).lineTo(W - MR, rowY).lineWidth(0.5).stroke()
    rowY += 14

    // 7-day return box
    doc.rect(ML, rowY, TW, 36).fill(hexToRgb(C.sand))
    fill(doc, C.dark)
    doc.fontSize(8).font("Helvetica-Bold")
      .text("7-Day Unconditional Return Privilege", ML + 10, rowY + 6, { width: TW - 20 })
    fill(doc, C.brown)
    doc.fontSize(7.5).font("Helvetica")
      .text(
        "Inspect your parcel at the doorstep. Contact us within 7 days of delivery to arrange free collection for a full refund.",
        ML + 10, rowY + 18, { width: TW - 20 }
      )

    rowY += 50

    fill(doc, C.muted)
    doc.fontSize(7.5).font("Helvetica")
      .text("anorabags.com  •  +92 319 418 6103  •  anorabags10@gmail.com", ML, rowY, {
        width: TW, align: "center",
      })

    rowY += 12
    doc.fontSize(7).text("This is an automatically generated receipt. Please retain for your records.", ML, rowY, {
      width: TW, align: "center",
    })

    doc.end()
  })
}
