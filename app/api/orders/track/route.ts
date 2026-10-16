import { NextRequest, NextResponse } from "next/server"
import { getOrderByIdOrNumber } from "@/lib/db"

export const dynamic = 'force-dynamic'


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")

  if (!q) {
    return NextResponse.json({ success: false, message: "Missing search query." }, { status: 400 })
  }

  const order = await getOrderByIdOrNumber(q)
  if (!order) {
    return NextResponse.json({ success: false, message: "No order found matching this tracking ID." }, { status: 404 })
  }

  // Sanitize customer PII before sending over public tracking API
  const nameParts = (order.customerName || "Valued Client").trim().split(" ")
  const maskedName = nameParts.length > 1 
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.` 
    : nameParts[0]

  const safeOrder = {
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    currency: order.currency,
    totalAmount: order.totalAmount,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    items: order.items,
    city: order.city,
    customerName: maskedName,
    refundWindowDays: order.refundWindowDays,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  }

  return NextResponse.json({ success: true, order: safeOrder })
}
