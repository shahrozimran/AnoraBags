import { beforeEach, afterEach, describe, expect, it, vi } from "vitest"
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { randomBytes } from "node:crypto"

const context = vi.hoisted(() => ({
  cookies: new Map<string, string>(),
  options: new Map<string, Record<string, unknown>>(),
  headers: new Headers(),
}))
vi.mock("server-only", () => ({}))
vi.mock("next/headers", () => ({
  headers: async () => context.headers,
  cookies: async () => ({
    get: (name: string) => context.cookies.has(name) ? { value: context.cookies.get(name) } : undefined,
    set: (name: string, value: string, options: Record<string, unknown>) => { context.cookies.set(name, value); context.options.set(name, options) },
    delete: (name: string) => context.cookies.delete(name),
  }),
}))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

let directory: string
const password = randomBytes(32).toString("hex")
beforeEach(() => {
  vi.resetModules()
  directory = fs.mkdtempSync(path.join(process.env.ANORA_TEST_ROOT || os.tmpdir(), "anora-security-"))
  vi.stubEnv("ANORA_DATA_DIR", directory)
  vi.stubEnv("ADMIN_KEY", password)
  vi.stubEnv("DATABASE_URL", "")
  vi.stubEnv("POSTGRES_URL", "")
  vi.stubEnv("SUPABASE_URL", "")
  context.cookies.clear()
  context.options.clear()
  context.headers = new Headers()
})
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); fs.rmSync(directory, { recursive: true, force: true }) })

const form = () => {
  const data = new FormData()
  for (const [key, value] of Object.entries({ customerName: "Security Test", phone: "03123456789", email: "qa@example.com", address: "123 Test Street", apartment: "", city: "Lahore", postalCode: "", deliveryNotes: "" })) data.set(key, value)
  return data
}
async function fixture() {
  const db = await import("@/lib/db")
  const products = await db.getProducts()
  return { db, product: products[0], item: { id: products[0].id, color: products[0].colorName, quantity: 1, name: "forged", image: "https://attacker.invalid/pixel", price: 1 } }
}

describe("Admin authentication boundaries", () => {
  it("denies missing configuration, published default, raw key arguments and query/header keys", async () => {
    const actions = await import("@/app/actions/admin")
    vi.stubEnv("ADMIN_KEY", "")
    expect((await actions.verifyAdminKeyAction("anora2026")).success).toBe(false)
    vi.stubEnv("ADMIN_KEY", password)
    await expect((actions.fetchAdminOrders as Function)(password)).rejects.toThrow("Unauthorized")
    context.cookies.set("anora_admin_session", "1".repeat(64))
    const api = await import("@/app/api/orders/all/route")
    expect((await api.GET()).status).toBe(401)
    context.headers = new Headers({ "x-admin-key": password })
    expect((await api.GET()).status).toBe(401)
  })

  it("allows staff via opaque HttpOnly sessions, expires, rotates and revokes copied sessions", async () => {
    const { db } = await fixture()
    const auth = await import("@/lib/security/admin-auth")
    const { hashToken } = await import("@/lib/security/crypto")
    expect((await auth.loginAdmin(password)).success).toBe(true)
    const token = context.cookies.get("anora_admin_session")!
    expect(token).not.toBe(password)
    expect(context.options.get("anora_admin_session")).toMatchObject({ httpOnly: true, sameSite: "strict", maxAge: 28800 })
    expect(await auth.isAdminAuthenticated()).toBe(true)
    const actions = await import("@/app/actions/admin")
    expect((await actions.fetchAdminProducts()).length).toBe(6)
    expect((await actions.fetchAdminAnalyticsAction()).totalOrders).toBe(0)
    expect(await actions.fetchSubscribersAction()).toEqual([])
    expect(await actions.fetchCustomerSummariesAction()).toEqual([])
    expect(await actions.fetchDatabaseStatusAction()).toHaveProperty("engine")
    const api = await import("@/app/api/orders/all/route")
    expect((await api.GET()).status).toBe(200)
    await auth.logoutAdmin()
    context.cookies.set("anora_admin_session", token)
    expect(await auth.isAdminAuthenticated()).toBe(false)
    await db.createAdminSession({ tokenHash: hashToken(token), keyHash: hashToken(password), expiresAt: Date.now() - 1 })
    expect(await auth.isAdminAuthenticated()).toBe(false)
    await auth.loginAdmin(password)
    vi.stubEnv("ADMIN_KEY", randomBytes(32).toString("hex"))
    expect(await auth.isAdminAuthenticated()).toBe(false)
  })

  it("throttles password guessing", async () => {
    const { loginAdmin } = await import("@/lib/security/admin-auth")
    for (let i = 0; i < 5; i++) expect((await loginAdmin("wrong")).success).toBe(false)
    expect((await loginAdmin(password)).message).toContain("Too many")
  })
  it("preserves authorized catalog management and COD status changes while validating writes", async () => {
    const { db, product } = await fixture()
    const auth = await import("@/lib/security/admin-auth")
    await auth.loginAdmin(password)
    const actions = await import("@/app/actions/admin")
    const saved = await actions.saveProductAction({ ...product, id: "security-test-bag", name: "Security Test Bag" })
    expect(saved.success).toBe(true)
    expect((await actions.saveProductAction({ ...product, image: "javascript:alert(1)" })).success).toBe(false)
    expect((await actions.toggleProductStockAction("security-test-bag")).success).toBe(true)
    expect((await db.getProductById("security-test-bag"))?.inStock).toBe(false)
    expect((await actions.deleteProductAction("security-test-bag")).success).toBe(true)
    const order = await db.createOrder({ customerName: "Test", email: "qa@example.com", phone: "03123456789", address: "123 Test Street", city: "Lahore", items: [], subtotal: 100, shippingFee: 0, totalAmount: 100 })
    expect((await actions.updateOrderStatusAction(order.id, "Delivered")).success).toBe(true)
    expect((await db.getOrderByIdOrNumber(order.orderNumber))?.paymentStatus).toBe("Paid Cash on Delivery")
    expect((await actions.updateOrderStatusAction(order.id, "Untrusted" as any)).success).toBe(false)
    await actions.resetDatabaseAction()
    expect(await db.getOrders()).toEqual([])
    expect(await auth.isAdminAuthenticated()).toBe(false)
  })
})

describe("COD checkout and customer privacy", () => {
  it("keeps canonical prices, allows a purchaser reload, denies guessed confirmations, and allows staff", async () => {
    const { db, product, item } = await fixture()
    const { placeOrderAction } = await import("@/app/actions/order")
    const result = await placeOrderAction(form(), [item])
    expect(result.success).toBe(true)
    const order = (await db.getOrderByIdOrNumber(result.orderNumber!))!
    expect(order.totalAmount).toBe(product.price)
    expect(order.items[0]).toMatchObject({ name: product.name, image: product.image, price: product.price })
    expect(order).toMatchObject({ paymentMethod: "CASH_ON_DELIVERY", shippingFee: 0, refundWindowDays: 7 })
    expect(order.accessTokenHash).toMatch(/^[a-f0-9]{64}$/)
    const access = await import("@/lib/security/order-access")
    expect(await access.hasOrderAccess(order)).toBe(true)
    const page = (await import("@/app/order-confirmation/[id]/page")).default
    expect(await page({ params: Promise.resolve({ id: order.orderNumber }) })).toBeTruthy()
    context.cookies.clear()
    expect(await access.hasOrderAccess(order)).toBe(false)
    await expect(page({ params: Promise.resolve({ id: order.orderNumber }) })).rejects.toThrow()
    await expect(page({ params: Promise.resolve({ id: String(order.id) }) })).rejects.toThrow()
    expect(await db.getOrderByIdOrNumber("3456789")).toBeNull()
    const { loginAdmin } = await import("@/lib/security/admin-auth")
    await loginAdmin(password)
    expect(await page({ params: Promise.resolve({ id: order.orderNumber }) })).toBeTruthy()
  })

  it("rejects unknown/out-of-stock goods, invalid variants, non-integers and duplicate overflow", async () => {
    const { db, product, item } = await fixture()
    const { canonicalCart } = await import("@/lib/security/validation")
    for (const invalid of [{ ...item, id: "nonexistent" }, { ...item, color: "invented" }, { ...item, quantity: -1 }, { ...item, quantity: 1.5 }, { ...item, quantity: Infinity }]) {
      await expect(canonicalCart([invalid], db.getProductById)).rejects.toThrow()
    }
    await expect(canonicalCart([{ ...item, quantity: 11 }, { ...item, quantity: 10 }], db.getProductById)).rejects.toThrow()
    await expect(canonicalCart([item], async () => ({ ...product, inStock: false }))).rejects.toThrow()
    await expect(canonicalCart([item], async () => ({ ...product, availableColors: product.availableColors.map(c => ({ ...c, inStock: false })) }))).rejects.toThrow()
    const merged = await canonicalCart([item, item], db.getProductById)
    expect(merged).toHaveLength(1)
    expect(merged[0].quantity).toBe(2)
    expect(await db.getOrders()).toHaveLength(0)
  })

  it("rejects oversized details and does not store or leak internal errors", async () => {
    const { db, item } = await fixture()
    const { placeOrderAction } = await import("@/app/actions/order")
    const data = form(); data.set("customerName", "x".repeat(10001))
    expect((await placeOrderAction(data, [item])).success).toBe(false)
    expect(await db.getOrders()).toEqual([])
  })

  it("requires full matching phone plus exact order number and returns only masked tracking data", async () => {
    const { db, item } = await fixture()
    const { placeOrderAction } = await import("@/app/actions/order")
    const result = await placeOrderAction(form(), [item])
    context.cookies.clear()
    const api = await import("@/app/api/orders/track/route")
    const { NextRequest } = await import("next/server")
    const track = (input: unknown, origin?: string) => api.POST(new NextRequest("http://localhost/api/orders/track", { method: "POST", headers: { "content-type": "application/json", host: "localhost", ...(origin ? { origin } : {}) }, body: JSON.stringify(input) }))
    expect((await api.GET()).status).toBe(405)
    for (const input of [{ orderNumber: result.orderNumber }, { orderNumber: result.orderNumber, phone: "03000000000" }, { orderNumber: result.orderNumber, phone: "3456789" }, { orderNumber: "1001", phone: "03123456789" }]) expect((await track(input)).status).toBe(404)
    const response = await track({ orderNumber: result.orderNumber, phone: "+92 312 3456789" })
    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toContain("no-store")
    const body = await response.json()
    expect(body.order).not.toHaveProperty("phone")
    expect(body.order).not.toHaveProperty("address")
    expect(body.order).not.toHaveProperty("email")
    expect(body.order).not.toHaveProperty("accessTokenHash")
    expect((await track({ orderNumber: result.orderNumber, phone: "03123456789" }, "https://attacker.invalid")).status).toBe(403)
    expect((await db.getOrders()).length).toBe(1)
  })
})

describe("Stored content and abuse controls", () => {
  it("escapes JSON-LD script termination and spreadsheet formulas", async () => {
    const { safeJsonLd, csvCell } = await import("@/lib/security/serialization")
    const value = { name: '</script><script>alert(1)</script>&\u2028' }
    expect(safeJsonLd(value)).not.toContain("<")
    expect(JSON.parse(safeJsonLd(value))).toEqual(value)
    for (const text of ["=1+1", "+SUM(1,1)", "@SUM(1)", "-1+2", "\t=1+1", "  =1+1"]) expect(csvCell(text)).toContain("'")
    expect(csvCell('A, "B"')).toBe('"A, ""B"""')
  })
  it("bounds rate limits and does not trust spoofed forwarded headers by default", async () => {
    const { consumeLimit, clientKey } = await import("@/lib/security/rate-limit")
    expect(consumeLimit("test", 1, 1000, 100)).toBe(true)
    expect(consumeLimit("test", 1, 1000, 101)).toBe(false)
    expect(consumeLimit("test", 1, 1000, 1101)).toBe(true)
    expect(clientKey(new Headers({ "x-forwarded-for": "1.2.3.4" }))).toBe("shared")
  })
  it("rejects oversized JSON and malformed newsletter addresses", async () => {
    const { limitedJson } = await import("@/lib/security/http")
    await expect(limitedJson(new Request("http://localhost", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify("x".repeat(4000)) }))).rejects.toThrow()
    const { subscribeAction } = await import("@/app/actions/newsletter")
    const data = new FormData(); data.set("email", "=SUM(1)@")
    expect((await subscribeAction(data)).success).toBe(false)
    data.set("email", "valid@example.com")
    expect((await subscribeAction(data)).success).toBe(true)
  })
})

describe("Remote persistence boundary", () => {
  it("never falls back to local catalog or accepts orders when the backend fails", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://test:test@db.example.invalid/store")
    const mockedFetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"))
    const db = await import("@/lib/db")
    await expect(db.getProductById("the-anora-noir-geometric-crossbody")).rejects.toThrow()
    await expect(db.getOrders()).rejects.toThrow()
    await expect(db.createAdminSession({ tokenHash: "a".repeat(64), keyHash: "b".repeat(64), expiresAt: Date.now() + 1000 })).rejects.toThrow()
    expect(mockedFetch).toHaveBeenCalled()
    expect(fs.existsSync(path.join(directory, "anora-store.json"))).toBe(false)
  })
  it("does not acknowledge remote writes when persistence fails", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://test:test@db.example.invalid/store")
    vi.stubEnv("NODE_ENV", "production")
    const blocked = path.join(directory, "not-a-directory")
    fs.writeFileSync(blocked, "x")
    vi.stubEnv("ANORA_DATA_DIR", path.join(blocked, "child"))
    const catalog = (await import("@/lib/seed-data")).SEED_PRODUCTS
    vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
      const { query } = JSON.parse(init!.body as string)
      if (query.includes("INSERT INTO anora_store")) throw new Error("Write failed")
      return new Response(JSON.stringify(query.startsWith("SELECT data") ? [{ data: { products: structuredClone(catalog), orders: [], reviews: [], subscribers: [], lastOrderNumber: 1000 } }] : []))
    })
    const db = await import("@/lib/db")
    await expect(db.toggleProductStock(catalog[0].id)).rejects.toThrow()
    expect((await db.getProductById(catalog[0].id))?.inStock).toBe(true)
    expect(fs.existsSync(path.join(directory, "anora-store.json"))).toBe(false)
  })
  it("uses parameterized remote sessions and persists checkout capabilities in the remote store", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://test:test@db.example.invalid/store")
    const sessions = new Map<string, { token_hash: string; key_hash: string; expires_at: number }>()
    let remote: any = null
    vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
      const { query, params } = JSON.parse(init!.body as string)
      let rows: unknown[] = []
      if (query.startsWith("SELECT data")) rows = remote ? [{ data: structuredClone(remote) }] : []
      if (query.includes("INSERT INTO anora_store")) remote = JSON.parse(params[0])
      if (query.startsWith("INSERT INTO anora_admin_sessions")) sessions.set(params[0], { token_hash: params[0], key_hash: params[1], expires_at: params[2] })
      if (query.startsWith("SELECT token_hash")) rows = sessions.has(params[0]) ? [sessions.get(params[0])] : []
      if (query.startsWith("DELETE FROM anora_admin_sessions WHERE token_hash")) sessions.delete(params[0])
      return new Response(JSON.stringify(rows), { headers: { "content-type": "application/json" } })
    })
    const db = await import("@/lib/db")
    const auth = await import("@/lib/security/admin-auth")
    expect((await auth.loginAdmin(password)).success).toBe(true)
    const cookie = context.cookies.get("anora_admin_session")!
    expect(await auth.isAdminAuthenticated()).toBe(true)
    await auth.logoutAdmin()
    context.cookies.set("anora_admin_session", cookie)
    expect(await auth.isAdminAuthenticated()).toBe(false)
    const product = (await db.getProducts())[0]
    const { placeOrderAction } = await import("@/app/actions/order")
    const result = await placeOrderAction(form(), [{ id: product.id, quantity: 1, color: product.colorName } as any])
    expect(result.success).toBe(true)
    expect(remote.orders[0].accessTokenHash).toMatch(/^[a-f0-9]{64}$/)
    expect(await db.getOrderByIdOrNumber("3456789")).toBeNull()
    await db.addSubscriber("remote@example.com")
    expect(remote.subscribers[0].email).toBe("remote@example.com")
    expect(fs.existsSync(path.join(directory, "anora-store.json"))).toBe(false)
  })
})
