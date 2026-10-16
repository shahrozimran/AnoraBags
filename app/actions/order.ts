"use server"

import { createOrder, getProductById, type OrderItem } from "@/lib/db"

export interface PlaceOrderResult {
  success: boolean
  orderNumber?: string
  orderId?: number
  message?: string
}

export async function placeOrderAction(
  formData: FormData,
  cartItems: OrderItem[]
): Promise<PlaceOrderResult> {
  try {
    if (!cartItems || cartItems.length === 0) {
      return { success: false, message: "Your shopping bag is empty." }
    }

    const customerName = formData.get("customerName")?.toString().trim() || ""
    const phone = formData.get("phone")?.toString().trim() || ""
    const email = formData.get("email")?.toString().trim() || ""
    const address = formData.get("address")?.toString().trim() || ""
    const apartment = formData.get("apartment")?.toString().trim() || ""
    const city = formData.get("city")?.toString().trim() || ""
    const postalCode = formData.get("postalCode")?.toString().trim() || ""
    const deliveryNotes = formData.get("deliveryNotes")?.toString().trim() || ""

    if (!customerName || customerName.length < 2) {
      return { success: false, message: "Please provide your full name." }
    }

    // Phone validation for Pakistani mobile networks or standard phone format (10-15 digits)
    const cleanPhoneDigits = phone.replace(/[^0-9]/g, "")
    if (cleanPhoneDigits.length < 10 || cleanPhoneDigits.length > 15) {
      return { success: false, message: "Please enter a valid phone number (e.g. 0300 1234567) so our courier can coordinate doorstep delivery." }
    }

    if (!address || address.length < 5) {
      return { success: false, message: "Please provide a complete street delivery address." }
    }

    if (!city) {
      return { success: false, message: "Please enter your city." }
    }

    // Canonical server-side product lookup to prevent client price tampering
    const safeItems: OrderItem[] = []
    for (const item of cartItems) {
      if (!item || !item.id) continue
      const realProduct = await getProductById(String(item.id))
      const canonicalPrice = realProduct ? realProduct.price : Math.max(1000, Math.round(Number(item.price) || 6990))
      const canonicalName = realProduct ? realProduct.name : String(item.name || "Handcrafted Bag")
      const canonicalImage = realProduct ? realProduct.image : String(item.image || "/images/products/bordeaux-crossbody-hero.jpeg")
      const quantity = Math.max(1, Math.min(20, Math.floor(Number(item.quantity) || 1)))
      
      safeItems.push({
        id: String(item.id),
        name: canonicalName,
        price: canonicalPrice,
        quantity,
        color: String(item.color || (realProduct ? realProduct.colorName : "Rich Bordeaux")),
        image: canonicalImage
      })
    }

    if (safeItems.length === 0) {
      return { success: false, message: "Your shopping bag is empty or contains invalid items." }
    }

    const subtotal = safeItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
    const shippingFee = 0 // Free Express Cash On Delivery nationwide
    const totalAmount = subtotal + shippingFee

    const created = await createOrder({
      customerName,
      phone,
      email: email.trim() || "guest@anorabags.com",
      address,
      apartment,
      city,
      postalCode,
      deliveryNotes,
      items: safeItems,
      subtotal,
      shippingFee,
      totalAmount
    })

    try {
      const { revalidatePath } = await import("next/cache")
      revalidatePath("/admin")
      revalidatePath("/track-order")
    } catch {}

    return {
      success: true,
      orderNumber: created.orderNumber,
      orderId: created.id,
      message: "Order placed successfully via Cash on Delivery!"
    }
  } catch (error: any) {
    console.error("[placeOrderAction] Error placing order:", error)
    return { success: false, message: error.message || "Failed to process order. Please try again." }
  }
}
