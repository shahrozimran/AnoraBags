import { randomBytes } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const nonce = randomBytes(16).toString("base64")
  const dev = process.env.NODE_ENV !== "production"
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com https://va.vercel-scripts.com${dev ? " ws: wss:" : ""}`,
    "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
    ...(!dev ? ["upgrade-insecure-requests"] : []),
  ].join("; ")
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)
  requestHeaders.set("Content-Security-Policy", csp)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set("Content-Security-Policy", csp)
  if (/^\/(admin|checkout|order-confirmation|track-order|api)(\/|$)/.test(request.nextUrl.pathname)) {
    response.headers.set("Cache-Control", "private, no-store")
    response.headers.set("X-Robots-Tag", "noindex, nofollow")
  }
  return response
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|icon.svg|apple-icon.png).*)"] }
