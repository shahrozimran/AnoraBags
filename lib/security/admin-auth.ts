import "server-only"
import { cookies, headers } from "next/headers"
import { createAdminSession, findAdminSession, revokeAdminSession } from "@/lib/db"
import { hashToken, randomToken, safeEqual } from "./crypto"
import { clientKey, consumeLimit } from "./rate-limit"

const COOKIE = "anora_admin_session"
const SESSION_SECONDS = 8 * 60 * 60
function configuredKey(): string | null {
  const key = process.env.ADMIN_KEY
  return key && key.length >= 24 && key.length <= 256 ? key : null
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const key = configuredKey()
  const token = (await cookies()).get(COOKIE)?.value
  if (!key || !token || !/^[a-f0-9]{64}$/.test(token)) return false
  try {
    const session = await findAdminSession(hashToken(token))
    return !!session && session.expiresAt > Date.now() && safeEqual(session.keyHash, hashToken(key))
  } catch {
    return false
  }
}

export async function loginAdmin(key: unknown) {
  const requestHeaders = await headers()
  if (!consumeLimit("admin-login:" + clientKey(requestHeaders), 5, 15 * 60 * 1000) ||
      !consumeLimit("admin-login:global", 50, 15 * 60 * 1000)) {
    return { success: false, message: "Too many login attempts. Try again in 15 minutes." }
  }
  const expected = configuredKey()
  if (!expected || typeof key !== "string" || key.length > 256 || !safeEqual(key, expected)) {
    return { success: false, message: "Invalid credentials or admin access is not configured." }
  }
  const cookieStore = await cookies()
  const existing = cookieStore.get(COOKIE)?.value
  if (existing) await revokeAdminSession(hashToken(existing))
  const token = randomToken()
  await createAdminSession({ tokenHash: hashToken(token), keyHash: hashToken(expected), expiresAt: Date.now() + SESSION_SECONDS * 1000 })
  cookieStore.set(COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS,
  })
  return { success: true }
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)?.value
  if (token) await revokeAdminSession(hashToken(token))
  cookieStore.delete(COOKIE)
}
