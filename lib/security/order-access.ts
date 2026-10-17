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

// ---------------------------------------------------------------------------
// Order snapshot cookie — allows the confirmation page to render on
// serverless cold starts where the local JSON DB is empty.
// Stored without the security accessTokenHash; expires after 2 hours.
// ---------------------------------------------------------------------------

const snapshotCookieName = (number: string) => "anora_snap_" + number

/** Called from the placeOrderAction right after grantOrderAccess. */
export async function storeOrderSnapshot(order: Order): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accessTokenHash: _drop, ...safe } = order
  const store = await cookies()
  store.set(snapshotCookieName(order.orderNumber), JSON.stringify(safe), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/order-confirmation",
    // 2 hours is plenty to load the confirmation page; keeps cookie storage lean
    maxAge: 2 * 60 * 60,
  })
}

/**
 * Returns the Order stored in the snapshot cookie for `number`, or null.
 * Used as a fallback when the local JSON DB is empty (Vercel cold start).
 */
export async function getOrderSnapshot(number: string): Promise<Order | null> {
  const raw = (await cookies()).get(snapshotCookieName(number))?.value
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Order
    // Basic sanity check
    if (parsed.orderNumber !== number) return null
    return parsed
  } catch {
    return null
  }
}
