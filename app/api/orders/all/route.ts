import { NextRequest, NextResponse } from "next/server"
import { getOrders } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const adminKey = request.headers.get("x-admin-key") || request.nextUrl.searchParams.get("key")
  const expectedKey = process.env.ADMIN_KEY || "anora2026"

  if (adminKey !== expectedKey) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Admin credentials required." },
      { status: 401 }
    )
  }

  const orders = await getOrders()
  return NextResponse.json({ success: true, orders })
}
