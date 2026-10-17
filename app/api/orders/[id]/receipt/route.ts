import { NextRequest, NextResponse } from "next/server"
import { getOrderByIdOrNumber } from "@/lib/db"
import { hasOrderAccess, ORDER_NUMBER, getOrderSnapshot, orderCookieName } from "@/lib/security/order-access"
import { isAdminAuthenticated } from "@/lib/security/admin-auth"
import { generateReceiptPDF } from "@/lib/pdf-receipt"
import { cookies } from "next/headers"

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params

  // Validate order number format
  if (!ORDER_NUMBER.test(id)) {
    return NextResponse.json({ error: "Invalid order number." }, { status: 400 })
  }

  // Fetch order — try DB first, fall back to cookie snapshot
  let order = await getOrderByIdOrNumber(id)
  if (!order) {
    order = await getOrderSnapshot(id)
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 })
  }

  // Auth: must have access token cookie OR be admin OR have snapshot cookie
  const adminOk    = await isAdminAuthenticated()
  const accessOk   = await hasOrderAccess(order)
  const jar        = await cookies()
  const snapshotOk = !!jar.get(orderCookieName(id))?.value

  if (!accessOk && !snapshotOk && !adminOk) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 })
  }

  // Generate PDF
  const pdfBuffer = await generateReceiptPDF(order)

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="Anora-Receipt-${order.orderNumber}.pdf"`,
      "Content-Length":      String(pdfBuffer.length),
      // No caching — receipt may be updated (status changes)
      "Cache-Control":       "private, no-store",
    },
  })
}
