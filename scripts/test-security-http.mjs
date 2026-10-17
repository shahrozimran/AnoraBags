// Production HTTP regression checks. All state is synthetic and isolated from the live store.
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { randomBytes, createHash } from "node:crypto"
import { spawn } from "node:child_process"
import { once } from "node:events"

const directory = fs.mkdtempSync(path.join(process.env.ANORA_TEST_ROOT || os.tmpdir(), "anora-http-"))
const password = randomBytes(32).toString("hex")
const token = randomBytes(32).toString("hex")
const number = "ANR-2026-9001"
const fixture = JSON.parse(fs.readFileSync("data/anora-store.json", "utf8"))
fixture.orders = [{
  id: 9001, orderNumber: number, customerName: "HTTP Test", email: "test@example.com",
  phone: "03123456789", address: "Private HTTP Test Address", city: "Lahore", items: [],
  subtotal: 2499, totalAmount: 2499, shippingFee: 0, currency: "Rs.", orderStatus: "Confirmed",
  paymentMethod: "CASH_ON_DELIVERY", paymentStatus: "Pending Cash on Delivery", refundWindowDays: 7,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  accessTokenHash: createHash("sha256").update(token).digest("hex"),
}]
fixture.adminSessions = []
fixture.subscribers = []
fs.writeFileSync(path.join(directory, "anora-store.json"), JSON.stringify(fixture))
const manifest = JSON.parse(fs.readFileSync(".next/server/server-reference-manifest.json", "utf8"))
const actionId = name => Object.entries(manifest.node).find(([, action]) => action.exportedName === name)?.[0]
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "0"], {
  env: { ...process.env, NODE_ENV: "production", ADMIN_KEY: password, ANORA_DATA_DIR: directory, DATABASE_URL: "", POSTGRES_URL: "", SUPABASE_URL: "" },
  stdio: ["ignore", "pipe", "pipe"],
})
let output = ""
child.stdout.on("data", chunk => { output += chunk.toString() })
child.stderr.on("data", () => {}) // Do not print request/session information.
let base
try {
  for (let i = 0; i < 100; i++) {
    const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/)
    if (match) { base = match[0]; break }
    if (child.exitCode !== null) throw new Error("Production server exited.")
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  assert.ok(base, "Production server started")
  const action = (name, args, cookie = "") => fetch(base + "/admin", {
    method: "POST", headers: { "Next-Action": actionId(name), "Content-Type": "text/plain;charset=UTF-8", Accept: "text/x-component", Origin: base, Cookie: cookie },
    body: JSON.stringify(args),
  })
  const page = await fetch(base)
  assert.equal(page.status, 200)
  assert.equal(page.headers.get("x-frame-options"), "DENY")
  assert.equal(page.headers.get("x-content-type-options"), "nosniff")
  assert.equal(page.headers.get("referrer-policy"), "no-referrer")
  assert.equal(page.headers.get("x-powered-by"), null)
  const csp = page.headers.get("content-security-policy")
  assert.ok(csp?.includes("strict-dynamic"))
  const nonce = csp.match(/'nonce-([^']+)'/)[1]
  const html = await page.text()
  const scripts = html.match(/<script\b[^>]*>/g) || []
  for (const script of scripts.filter(script => !script.includes('type="application/ld+json"'))) assert.ok(script.includes(`nonce="${nonce}"`), "Executable script has request nonce")
  const second = await fetch(base)
  assert.notEqual(second.headers.get("content-security-policy"), csp, "Nonce rotates per request")
  console.log("PASS production headers and per-request script nonces")
  assert.equal((await fetch(base + "/api/orders/all?key=" + password)).status, 401)
  assert.equal((await fetch(base + "/api/orders/all", { headers: { "x-admin-key": password } })).status, 401)
  let response = await action("verifyAdminKeyAction", [password])
  const cookie = response.headers.get("set-cookie")?.split(";")[0]
  assert.ok(cookie?.startsWith("anora_admin_session="), "Staff login sets session cookie")
  assert.match(response.headers.get("set-cookie"), /HttpOnly/i)
  assert.match(response.headers.get("set-cookie"), /Secure/i)
  assert.equal((await fetch(base + "/api/orders/all", { headers: { Cookie: cookie } })).status, 200)
  console.log("PASS production staff login; raw header/query keys denied")
  response = await fetch(base + "/order-confirmation/" + number)
  assert.equal(response.status, 404)
  assert.ok(!(await response.text()).includes("Private HTTP Test Address"))
  response = await fetch(base + "/order-confirmation/" + number, { headers: { Cookie: "anora_order_" + number + "=" + token } })
  assert.equal(response.status, 200)
  assert.ok((await response.text()).includes("Private HTTP Test Address"))
  assert.equal((await fetch(base + "/order-confirmation/" + number, { headers: { Cookie: cookie } })).status, 200)
  console.log("PASS confirmation privacy; purchaser and staff access preserved")
  const track = body => fetch(base + "/api/orders/track", { method: "POST", headers: { "Content-Type": "application/json", Origin: base }, body: JSON.stringify(body) })
  assert.equal((await fetch(base + "/api/orders/track?q=" + number)).status, 405)
  assert.equal((await track({ orderNumber: number, phone: "3456789" })).status, 404)
  response = await track({ orderNumber: number, phone: "+92 312 3456789" })
  assert.equal(response.status, 200)
  const result = await response.json()
  for (const key of ["address", "phone", "email", "accessTokenHash"]) assert.ok(!(key in result.order))
  assert.match(response.headers.get("cache-control"), /no-store/)
  await action("logoutAdminAction", [], cookie)
  assert.equal((await fetch(base + "/api/orders/all", { headers: { Cookie: cookie } })).status, 401)
  console.log("PASS tracking proof, private caching and post-logout replay denial")
} finally {
  const exited = once(child, "exit")
  if (child.exitCode === null) { child.kill(); await exited }
  fs.rmSync(directory, { recursive: true, force: true })
}
