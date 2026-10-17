import { hashToken } from "./crypto"
import { isIP } from "node:net"

// Process-local backstop. A shared edge/WAF limiter is also needed for multi-instance hosting.
const buckets = new Map<string, { count: number; expiresAt: number }>()
export function consumeLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  for (const [id, bucket] of buckets) if (bucket.expiresAt <= now) buckets.delete(id)
  const id = hashToken(key)
  const bucket = buckets.get(id)
  if (bucket && bucket.expiresAt > now) {
    if (bucket.count >= limit) return false
    bucket.count++
    return true
  }
  if (buckets.size >= 10000) return false
  buckets.set(id, { count: 1, expiresAt: now + windowMs })
  return true
}

export function clientKey(headers: Headers): string {
  // Only enable behind an ingress that overwrites this header; never trust arbitrary XFF.
  const forwarded = process.env.TRUST_PROXY === "true" ? headers.get("x-forwarded-for")?.split(",")[0]?.trim() : ""
  return forwarded && isIP(forwarded) ? forwarded : "shared"
}
