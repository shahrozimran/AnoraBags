import { NextResponse } from "next/server"
import { getOrders } from "@/lib/db"
import { isAdminAuthenticated } from "@/lib/security/admin-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401, headers })
  }
  const orders = (await getOrders()).map(({ accessTokenHash: _privateToken, ...order }) => order)
  return NextResponse.json({ success: true, orders }, { headers })
}
