import { spawn } from "child_process"
import { setTimeout as sleep } from "timers/promises"
import fs from "fs"

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const PORT = 9224
const BASE_URL = "http://127.0.0.1:3000"

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl
    this.id = 1
    this.callbacks = new Map()
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl)
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve
      this.ws.onerror = reject
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        if (msg.method === "Runtime.exceptionThrown") {
          console.error("CLIENT EXCEPTION:", JSON.stringify(msg.params.exceptionDetails, null, 2))
        }
        if (msg.method === "Runtime.consoleAPICalled") {
          console.log("CONSOLE:", msg.params.type, msg.params.args.map(a => a.value || a.description))
        }
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id)
          this.callbacks.delete(msg.id)
          if (msg.error) reject(msg.error)
          else resolve(msg.result)
        }
      }
    })
  }

  async send(method, params = {}) {
    const id = this.id++
    const msg = JSON.stringify({ id, method, params })
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject })
      this.ws.send(msg)
    })
  }

  close() {
    if (this.ws) this.ws.close()
  }
}

async function run() {
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--user-data-dir=C:\\Users\\Dell\\AppData\\Local\\Temp\\chrome-debug-err-profile"
  ])

  let connected = false
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      if (res.ok) {
        connected = true
        break
      }
    } catch {}
    await sleep(400)
  }

  if (!connected) {
    console.error("Failed to connect to Chrome debugging port.")
    chromeProc.kill()
    process.exit(1)
  }

  const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`)
  const targets = await listRes.json()
  const pageTarget = targets.find(t => t.type === "page") || targets[0]

  const client = new CdpClient(pageTarget.webSocketDebuggerUrl)
  await client.connect()
  await client.send("Page.enable")
  await client.send("Runtime.enable")

  await client.send("Page.navigate", { url: BASE_URL })
  await sleep(3000)

  client.close()
  chromeProc.kill()
}

run().catch(console.error)
