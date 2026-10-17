import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getOrderByIdOrNumber } from "@/lib/db"
import { ORDER_NUMBER, hasOrderAccess } from "@/lib/security/order-access"
import { normalizePhone } from "@/lib/security/validation"
import { clientKey, consumeLimit } from "@/lib/security/rate-limit"
import { safeEqual } from "@/lib/security/crypto"
import { limitedJson } from "@/lib/security/http"

export const dynamic = "force-dynamic"
const responseHeaders = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" }
const missing = () => NextResponse.json({ success: false, message: "We could not verify that order. Check your order number and full phone number." }, { status: 404, headers: responseHeaders })

export async function GET() {
  return NextResponse.json({ success: false, message: "Use the tracking form with your order number and full phone number." }, { status: 405, headers: { ...responseHeaders, Allow: "POST" } })
}

export async function POST(request: NextRequest) {
  if (!consumeLimit("tracking:" + clientKey(request.headers), 20, 15 * 60 * 1000)) {
    return NextResponse.json({ success: false, message: "Too many attempts. Try again later." }, { status: 429, headers: { ...responseHeaders, "Retry-After": "900" } })
  }
  const origin = request.headers.get("origin")
  if (origin) {
    try {
      const source = new URL(origin)
      const allowed = process.env.APP_ORIGIN ? source.origin === new URL(process.env.APP_ORIGIN).origin
        : ["http:", "https:"].includes(source.protocol) && source.host === request.headers.get("host")
      if (!allowed) return NextResponse.json({ success: false }, { status: 403, headers: responseHeaders })
    } catch {
      return NextResponse.json({ success: false }, { status: 403, headers: responseHeaders })
    }
  }
  try {
    const parsed = z.object({ orderNumber: z.string().trim().toUpperCase().regex(ORDER_NUMBER), phone: z.string().max(30).optional() }).safeParse(await limitedJson(request))
    if (!parsed.success) return missing()
    const order = await getOrderByIdOrNumber(parsed.data.orderNumber)
    if (!order) return missing()
    const phone = normalizePhone(parsed.data.phone || "")
    if (!(await hasOrderAccess(order)) && (!phone || !safeEqual(phone, normalizePhone(order.phone) || ""))) return missing()
    // No address, email, phone, notes, or access capability leaves this boundary.
    const nameParts = order.customerName.trim().split(/\s+/)
    return NextResponse.json({ success: true, order: {
      orderNumber: order.orderNumber, orderStatus: order.orderStatus, paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod, currency: order.currency, totalAmount: order.totalAmount,
      subtotal: order.subtotal, shippingFee: order.shippingFee, items: order.items, city: order.city,
      customerName: nameParts[0] + (nameParts.length > 1 ? " " + nameParts.at(-1)![0] + "." : ""),
      refundWindowDays: order.refundWindowDays, createdAt: order.createdAt, updatedAt: order.updatedAt,
    } }, { headers: responseHeaders })
  } catch {
    return missing()
  }
}
