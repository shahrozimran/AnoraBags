"use server"

import crypto from "node:crypto"
import { cookies } from "next/headers"
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

const EXPECTED_ADMIN_KEY = process.env.ADMIN_KEY || "anora2026"

function getSessionToken(): string {
  return crypto.createHash("sha256").update(`anora_staff_gate:${EXPECTED_ADMIN_KEY}`).digest("hex")
}

async function assertAdminAuth(clientKey?: string): Promise<boolean> {
  if (clientKey && clientKey === EXPECTED_ADMIN_KEY) {
    return true
  }
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("anora_admin_session")?.value
    if (session && session === getSessionToken()) {
      return true
    }
  } catch {}
  return false
}

export async function verifyAdminKeyAction(key: string): Promise<{ success: boolean; message?: string }> {
  if (key === EXPECTED_ADMIN_KEY) {
    try {
      const cookieStore = await cookies()
      cookieStore.set("anora_admin_session", getSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    } catch {}
    return { success: true }
  }
  return { success: false, message: "Invalid security PIN. Access denied." }
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("anora_admin_session")
  } catch {}
  return { success: true }
}

export async function updateOrderStatusAction(
  orderId: number,
  status: Order["orderStatus"],
  clientKey?: string
) {
  if (!(await assertAdminAuth(clientKey))) {
    return { success: false, message: "Unauthorized. Staff security authentication required." }
  }
  const updated = await updateOrderStatus(orderId, status)
  revalidatePath("/admin")
  revalidatePath("/track-order")
  if (updated?.orderNumber) {
    revalidatePath(`/order-confirmation/${updated.orderNumber}`)
  }
  return { success: !!updated, order: updated }
}

export async function fetchAdminOrders(clientKey?: string) {
  if (!(await assertAdminAuth(clientKey))) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return await getOrders()
}

export async function fetchAdminProducts(clientKey?: string) {
  if (!(await assertAdminAuth(clientKey))) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return await getProducts()
}

export async function saveProductAction(productInput: ProductInput, clientKey?: string) {
  if (!(await assertAdminAuth(clientKey))) {
    return { success: false, message: "Unauthorized. Staff security authentication required." }
  }
  try {
    const saved = await saveProduct(productInput)
    revalidatePath("/")
    revalidatePath("/shop")
    revalidatePath(`/product/${saved.id}`)
    revalidatePath("/admin")
    return { success: true, product: saved }
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to save product" }
  }
}

export async function deleteProductAction(productId: string, clientKey?: string) {
  if (!(await assertAdminAuth(clientKey))) {
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
    return { success: false, message: err.message || "Failed to delete product" }
  }
}

export async function toggleProductStockAction(productId: string, clientKey?: string) {
  if (!(await assertAdminAuth(clientKey))) {
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
    return { success: false, message: err.message || "Failed to toggle stock" }
  }
}

export async function fetchSubscribersAction(clientKey?: string) {
  if (!(await assertAdminAuth(clientKey))) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return await getSubscribers()
}

export async function fetchCustomerSummariesAction(clientKey?: string) {
  if (!(await assertAdminAuth(clientKey))) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return await getCustomerSummaries()
}

export async function fetchAdminAnalyticsAction(clientKey?: string) {
  if (!(await assertAdminAuth(clientKey))) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return await getAdminAnalytics()
}

export async function fetchDatabaseStatusAction(clientKey?: string) {
  if (!(await assertAdminAuth(clientKey))) {
    throw new Error("Unauthorized. Staff security authentication required.")
  }
  return await getDatabaseStatus()
}

export async function resetDatabaseAction(clientKey?: string) {
  if (!(await assertAdminAuth(clientKey))) {
    return { success: false, message: "Unauthorized. Staff security authentication required." }
  }
  await resetDatabaseToSeed()
  revalidatePath("/")
  revalidatePath("/shop")
  revalidatePath("/admin")
  return { success: true }
}
