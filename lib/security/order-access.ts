import "server-only"
import { cookies } from "next/headers"
import type { Order } from "@/lib/types"
import { hashToken, safeEqual } from "./crypto"

export const ORDER_NUMBER = /^ANR-\d{4}-\d{4,12}$/
export const orderCookieName = (number: string) => "anora_order_" + number

export async function grantOrderAccess(number: string, token: string) {
  const store = await cookies()
  store.set(orderCookieName(number), token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
    path: "/", maxAge: 30 * 24 * 60 * 60,
  })
}

export async function hasOrderAccess(order: Order): Promise<boolean> {
  const age = Date.now() - new Date(order.createdAt).getTime()
  if (!Number.isFinite(age) || age < 0 || age > 30 * 24 * 60 * 60 * 1000) return false
  const token = (await cookies()).get(orderCookieName(order.orderNumber))?.value
  return !!token && /^[a-f0-9]{64}$/.test(token) && !!order.accessTokenHash && safeEqual(hashToken(token), order.accessTokenHash)
}
