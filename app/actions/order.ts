"use server"

import { headers } from "next/headers"
import { createOrder, getProductById, type OrderItem } from "@/lib/db"
import { canonicalCart, CartValidationError, checkoutSchema } from "@/lib/security/validation"
import { hashToken, randomToken } from "@/lib/security/crypto"
import { grantOrderAccess } from "@/lib/security/order-access"
import { clientKey, consumeLimit } from "@/lib/security/rate-limit"
import { sendAdminOrderNotification } from "@/lib/email"
import { ZodError } from "zod"

export interface PlaceOrderResult {
  success: boolean
  orderNumber?: string
  orderId?: number
  message?: string
}

export async function placeOrderAction(formData: FormData, cartItems: OrderItem[]): Promise<PlaceOrderResult> {
  try {
    if (!consumeLimit("checkout:" + clientKey(await headers()), 5, 15 * 60 * 1000) ||
        !consumeLimit("checkout:global", 200, 60 * 60 * 1000)) return { success: false, message: "Too many order attempts. Please try again later." }
    const details = checkoutSchema.parse(Object.fromEntries(
      ["customerName", "phone", "email", "address", "apartment", "city", "postalCode", "deliveryNotes"].map(key => [key, formData.get(key) ?? ""])
    ))
    const items = await canonicalCart(cartItems, getProductById)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const token = randomToken()
    const order = await createOrder({
      ...details, email: details.email || "guest@anorabags.com", items,
      subtotal, shippingFee: 0, totalAmount: subtotal, accessTokenHash: hashToken(token),
    })
    await grantOrderAccess(order.orderNumber, token)

    // Fire-and-forget: send admin notification email without blocking the response
    sendAdminOrderNotification(order).catch((err) =>
      console.error("[Anora Email] Background notification failed:", err)
    )

    return { success: true, orderNumber: order.orderNumber, orderId: order.id, message: "Order placed successfully via Cash on Delivery!" }
  } catch (error) {
    if (error instanceof CartValidationError) return { success: false, message: error.message }
    if (error instanceof ZodError) return { success: false, message: "Please check your contact details and bag quantities. Use a complete Pakistani mobile number." }
    return { success: false, message: "We could not place your order. Please try again or contact us." }
  }
}

