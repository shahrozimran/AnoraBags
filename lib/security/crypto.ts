import { createHash, randomBytes, timingSafeEqual } from "node:crypto"

export const hashToken = (value: string) => createHash("sha256").update(value).digest("hex")
export const randomToken = () => randomBytes(32).toString("hex")
export function safeEqual(left: string, right: string): boolean {
  return timingSafeEqual(Buffer.from(hashToken(left)), Buffer.from(hashToken(right)))
}
