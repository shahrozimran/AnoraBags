"use server"

import { isAdminAuthenticated, loginAdmin, logoutAdmin } from "@/lib/security/admin-auth"
import { orderStatuses, productInputSchema } from "@/lib/security/validation"
import {
  updateOrderStatus,
  getOrders,
  getProducts,
  saveProduct,
  deleteProduct,
  toggleProductStock,
  getSubscribers,
  getCustomerSummaries,
  getAdminAnalytics,
  getDatabaseStatus,
  resetDatabaseToSeed,
  type Order,
  type ProductInput
} from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function verifyAdminKeyAction(key: string) {
  try { return await loginAdmin(key) } catch { return { success: false, message: "Admin sign-in is temporarily unavailable." } }
}

export async function fetchAdminSessionAction() {
  return { authenticated: await isAdminAuthenticated() }
}

export async function logoutAdminAction() {
  await logoutAdmin()
  return { success: true }
}

export async function updateOrderStatusAction(
  orderId: number,
  status: Order["orderStatus"]
) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, message: "Unauthorized. Staff security authentication required." }
  }
  if (!Number.isSafeInteger(orderId) || orderId < 1 || !orderStatuses.safeParse(status).success) return { success: false, message: "Invalid order status." }
  const updated = await updateOrderStatus(orderId, status)
  revalidatePath("/admin")
  revalidatePath("/track-order")
  if (updated?.orderNumber) {
    revalidatePath(`/order-confirmation/${updated.orderNumber}`)
  }
  return { success: !!updated, order: updated }
}

export async function fetchAdminOrders() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return (await getOrders()).map(({ accessTokenHash: _privateToken, ...order }) => order)
}

export async function fetchAdminProducts() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return await getProducts()
}

export async function saveProductAction(productInput: ProductInput) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, message: "Unauthorized. Staff security authentication required." }
  }
  try {
    const parsed = productInputSchema.safeParse(productInput)
    if (!parsed.success) return { success: false, message: "Invalid product details. Check prices, colours, and local image paths." }
    const saved = await saveProduct(parsed.data)
    revalidatePath("/")
    revalidatePath("/shop")
    revalidatePath(`/product/${saved.id}`)
    revalidatePath("/admin")
    return { success: true, product: saved }
  } catch (err: any) {
    return { success: false, message: "Failed to save product" }
  }
}

export async function deleteProductAction(productId: string) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, message: "Unauthorized. Staff security authentication required." }
  }
  try {
    const success = await deleteProduct(productId)
    if (success) {
      revalidatePath("/")
      revalidatePath("/shop")
      revalidatePath("/admin")
      return { success: true }
    }
    return { success: false, message: "Cannot delete the sole remaining product in the store." }
  } catch (err: any) {
    return { success: false, message: "Failed to delete product" }
  }
}

export async function toggleProductStockAction(productId: string) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, message: "Unauthorized. Staff security authentication required." }
  }
  try {
    const updated = await toggleProductStock(productId)
    if (updated) {
      revalidatePath("/")
      revalidatePath("/shop")
      revalidatePath(`/product/${productId}`)
      revalidatePath("/admin")
      return { success: true, inStock: updated.inStock }
    }
    return { success: false, message: "Product not found" }
  } catch (err: any) {
    return { success: false, message: "Failed to toggle stock" }
  }
}

export async function fetchSubscribersAction() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return await getSubscribers()
}

export async function fetchCustomerSummariesAction() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return await getCustomerSummaries()
}

export async function fetchAdminAnalyticsAction() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return await getAdminAnalytics()
}

export async function fetchDatabaseStatusAction() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return await getDatabaseStatus()
}

export async function resetDatabaseAction() {
  if (!(await isAdminAuthenticated())) {
    return { success: false, message: "Unauthorized. Staff security authentication required." }
  }
  await resetDatabaseToSeed()
  revalidatePath("/")
  revalidatePath("/shop")
  revalidatePath("/admin")
  return { success: true }
}
