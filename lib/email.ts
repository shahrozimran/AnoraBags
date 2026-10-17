import "server-only"
import nodemailer from "nodemailer"
import type { Order } from "@/lib/types"
import { generateReceiptPDF } from "@/lib/pdf-receipt"

// ---------------------------------------------------------------------------
// Gmail SMTP transporter
// Requires these env vars in .env.local (never commit):
//   GMAIL_USER=anorabags10@gmail.com
//   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx   ← 16-char App Password from Google
// ---------------------------------------------------------------------------

function createTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    console.warn("[Anora Email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email.")
    return null
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  })
}

// ---------------------------------------------------------------------------
// Admin order-notification email
// ---------------------------------------------------------------------------

export async function sendAdminOrderNotification(order: Order): Promise<void> {
  const transporter = createTransporter()
  if (!transporter) return

  const adminEmail = process.env.GMAIL_USER!

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #E5DCD2;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E5DCD2;">${item.color}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E5DCD2;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E5DCD2;text-align:right;font-weight:600;">
          Rs. ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`
    )
    .join("")

  const addressLines = [
    order.address,
    order.apartment,
    `${order.city}${order.postalCode ? " " + order.postalCode : ""}`,
  ]
    .filter(Boolean)
    .join(", ")

  const placedAt = new Date(order.createdAt).toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    dateStyle: "full",
    timeStyle: "short",
  })

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Order — ${order.orderNumber}</title>
</head>
<body style="margin:0;padding:0;background:#FAF6F1;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF6F1;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E5DCD2;">

          <!-- Header -->
          <tr>
            <td style="background:#23170F;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#ECE2D8;letter-spacing:0.08em;text-transform:uppercase;">New Order Received</p>
              <h1 style="margin:0;font-size:28px;color:#ffffff;font-weight:300;font-style:italic;letter-spacing:-0.01em;">Anora Bags</h1>
              <p style="margin:10px 0 0;font-size:13px;color:#ECE2D8;opacity:0.85;">${placedAt} (PKT)</p>
            </td>
          </tr>

          <!-- Order ID banner -->
          <tr>
            <td style="background:#462F1D;padding:16px 40px;text-align:center;">
              <p style="margin:0;font-size:14px;color:#ECE2D8;">
                Order <strong style="color:#ffffff;font-size:17px;font-family:monospace;">${order.orderNumber}</strong>
                &nbsp;|&nbsp; Cash on Delivery
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">

              <!-- Customer Details -->
              <h2 style="margin:0 0 16px;font-size:16px;color:#23170F;font-weight:600;border-bottom:2px solid #ECE2D8;padding-bottom:8px;">
                🙍 Customer Details
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#462F1D;margin-bottom:28px;">
                <tr>
                  <td style="padding:5px 0;width:140px;color:#8C7A6B;font-weight:500;">Full Name</td>
                  <td style="padding:5px 0;font-weight:600;color:#23170F;">${order.customerName}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#8C7A6B;font-weight:500;">Phone</td>
                  <td style="padding:5px 0;font-weight:600;color:#23170F;">${order.phone}</td>
                </tr>
                <tr>
                  <td style="padding:5px 0;color:#8C7A6B;font-weight:500;">Email</td>
                  <td style="padding:5px 0;">${order.email || "—"}</td>
                </tr>
              </table>

              <!-- Delivery Address -->
              <h2 style="margin:0 0 16px;font-size:16px;color:#23170F;font-weight:600;border-bottom:2px solid #ECE2D8;padding-bottom:8px;">
                📦 Delivery Address
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#462F1D;margin-bottom:28px;">
                <tr>
                  <td style="padding:5px 0;width:140px;color:#8C7A6B;font-weight:500;">Address</td>
                  <td style="padding:5px 0;">${addressLines}</td>
                </tr>
                ${order.deliveryNotes ? `
                <tr>
                  <td style="padding:5px 0;color:#8C7A6B;font-weight:500;">Delivery Notes</td>
                  <td style="padding:5px 0;font-style:italic;">${order.deliveryNotes}</td>
                </tr>` : ""}
              </table>

              <!-- Order Items -->
              <h2 style="margin:0 0 16px;font-size:16px;color:#23170F;font-weight:600;border-bottom:2px solid #ECE2D8;padding-bottom:8px;">
                🛍️ Ordered Items
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;margin-bottom:24px;">
                <thead>
                  <tr style="background:#FAF6F1;">
                    <th style="padding:10px 12px;text-align:left;color:#8C7A6B;font-weight:600;border-bottom:2px solid #E5DCD2;">Product</th>
                    <th style="padding:10px 12px;text-align:left;color:#8C7A6B;font-weight:600;border-bottom:2px solid #E5DCD2;">Shade</th>
                    <th style="padding:10px 12px;text-align:center;color:#8C7A6B;font-weight:600;border-bottom:2px solid #E5DCD2;">Qty</th>
                    <th style="padding:10px 12px;text-align:right;color:#8C7A6B;font-weight:600;border-bottom:2px solid #E5DCD2;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;margin-bottom:28px;">
                <tr>
                  <td style="padding:6px 0;color:#8C7A6B;">Subtotal</td>
                  <td style="padding:6px 0;text-align:right;color:#462F1D;">Rs. ${order.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#8C7A6B;">Shipping</td>
                  <td style="padding:6px 0;text-align:right;color:#462F1D;">Free</td>
                </tr>
                <tr style="border-top:2px solid #E5DCD2;">
                  <td style="padding:12px 0 6px;font-weight:700;color:#23170F;font-size:17px;">Total (COD)</td>
                  <td style="padding:12px 0 6px;text-align:right;font-weight:700;color:#23170F;font-size:20px;">Rs. ${order.totalAmount.toLocaleString()}</td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#FAF6F1;padding:20px 40px;border-top:1px solid #E5DCD2;text-align:center;">
              <p style="margin:0;font-size:12px;color:#8C7A6B;">
                This is an automated notification from <strong>Anora Bags</strong>. Do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  try {
    // Generate PDF receipt in parallel with email construction
    const pdfBuffer = await generateReceiptPDF(order)

    await transporter.sendMail({
      from: `"Anora Bags Orders" <${adminEmail}>`,
      to: adminEmail,
      subject: `🛍️ New Order ${order.orderNumber} — Rs. ${order.totalAmount.toLocaleString()} COD from ${order.customerName}`,
      html,
      attachments: [
        {
          filename: `Anora-Receipt-${order.orderNumber}.pdf`,
          content:  pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    })
    console.log(`[Anora Email] Order notification sent for ${order.orderNumber}`)
  } catch (err) {
    // Never let an email failure block order placement
    console.error("[Anora Email] Failed to send notification:", err)
  }
}
