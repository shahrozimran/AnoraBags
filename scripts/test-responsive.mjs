import { spawn } from "child_process"
import { setTimeout as sleep } from "timers/promises"

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const PORT = 9222
const BASE_URL = "http://localhost:3000"

const VIEWPORTS = [
  { name: "320px (iPhone SE / Ultra-compact)", width: 320, height: 568 },
  { name: "360px (Galaxy S series)", width: 360, height: 740 },
  { name: "375px (iPhone 12/13 mini)", width: 375, height: 667 },
  { name: "414px (iPhone Plus / XR)", width: 414, height: 896 },
  { name: "430px (iPhone 16 Pro Max)", width: 430, height: 932 },
  { name: "768px (iPad Portrait)", width: 768, height: 1024 },
  { name: "1024px (iPad Landscape / Tablet)", width: 1024, height: 768 },
  { name: "1280px (Standard Laptop)", width: 1280, height: 800 },
  { name: "1440px (Desktop Display)", width: 1440, height: 900 },
  { name: "1920px (Full HD Display)", width: 1920, height: 1080 }
]

const ROUTES = [
  "/",
  "/shop",
  "/product/the-anora-bordeaux-flap-crossbody",
  "/checkout",
  "/refund-policy",
  "/track-order",
  "/admin"
]

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
  console.log("=== ANORA BAGS MULTI-DEVICE RESPONSIVENESS AUDIT ===")
  console.log("Launching headless Chrome on port", PORT)

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--user-data-dir=C:\\Users\\Dell\\AppData\\Local\\Temp\\chrome-responsive-profile"
  ])

  // Wait for Chrome to bind
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
  await client.send("DOM.enable")

  let totalTests = 0
  let passCount = 0
  let failCount = 0
  const failures = []

  for (const route of ROUTES) {
    const targetUrl = `${BASE_URL}${route}`
    console.log(`\n--------------------------------------------------`)
    console.log(`Auditing Route: ${route}`)
    console.log(`--------------------------------------------------`)

    // Navigate to route
    await client.send("Page.navigate", { url: targetUrl })
    // Wait for network/page idle
    await sleep(1500)

    for (const vp of VIEWPORTS) {
      totalTests++

      // Set device emulation
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 768
      })

      // Give browser brief reflow time
      await sleep(350)

      // Evaluate overflow in the document
      const evalRes = await client.send("Runtime.evaluate", {
        expression: `
          (() => {
            const winWidth = window.innerWidth;
            const docWidth = document.documentElement.clientWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const bodyScrollWidth = document.body ? document.body.scrollWidth : 0;
            const maxScrollWidth = Math.max(scrollWidth, bodyScrollWidth);
            const overflow = maxScrollWidth - winWidth;

            // Find any elements exceeding viewport width
            const overflowingElements = [];
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > winWidth + 1.5 && rect.width > 0 && rect.height > 0) {
                // Ignore script, style, head, hidden elements
                const style = window.getComputedStyle(el);
                if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                  const tag = el.tagName.toLowerCase();
                  const cls = (el.className && typeof el.className === 'string') ? el.className.slice(0, 60) : '';
                  const id = el.id ? '#' + el.id : '';
                  overflowingElements.push({
                    selector: tag + id + (cls ? '.' + cls.split(' ').slice(0, 2).join('.') : ''),
                    right: Math.round(rect.right),
                    winWidth: winWidth,
                    overflow: Math.round(rect.right - winWidth)
                  });
                }
              }
            }

            // Viewport meta check
            const metaVp = document.querySelector('meta[name="viewport"]');
            const metaContent = metaVp ? metaVp.getAttribute('content') : null;

            return {
              winWidth,
              scrollWidth: maxScrollWidth,
              hasOverflow: overflow > 1,
              overflowAmount: Math.max(0, overflow),
              overflowCount: overflowingElements.length,
              sampleOverflows: overflowingElements.slice(0, 3),
              metaContent
            };
          })()
        `,
        returnByValue: true
      })

      const result = evalRes.result.value
      if (!result.hasOverflow) {
        passCount++
        console.log(`  [PASS] ${vp.name.padEnd(36)} -> scrollWidth: ${result.scrollWidth}px / innerWidth: ${result.winWidth}px (Overflow: 0px)`)
      } else {
        failCount++
        console.error(`  [FAIL] ${vp.name.padEnd(36)} -> OVERFLOW DETECTED: +${result.overflowAmount}px (scroll: ${result.scrollWidth}px vs win: ${result.winWidth}px)`)
        if (result.sampleOverflows.length > 0) {
          console.error(`         Overflowing elements:`, JSON.stringify(result.sampleOverflows))
        }
        failures.push({
          route,
          viewport: vp.name,
          overflow: result.overflowAmount,
          elements: result.sampleOverflows
        })
      }
    }
  }

  // Check mobile add-to-cart bar and sticky elements on PDP at 375px
  console.log(`\n--------------------------------------------------`)
  console.log(`Testing Interactive PDP Mobile Features (375px)`)
  console.log(`--------------------------------------------------`)
  await client.send("Page.navigate", { url: `${BASE_URL}/product/the-anora-bordeaux-flap-crossbody` })
  await sleep(1500)
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  })
  await sleep(400)

  const pdpCheck = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const stickyBar = document.querySelector('[data-testid="mobile-sticky-bar"]');
        const accordions = document.querySelectorAll('button[aria-expanded]');
        return {
          hasStickyBar: !!stickyBar,
          stickyBarVisible: stickyBar ? window.getComputedStyle(stickyBar).display !== 'none' : false,
          accordionCount: accordions.length
        };
      })()
    `,
    returnByValue: true
  })
  console.log("  PDP Mobile Sticky Add-to-Cart Bar present:", pdpCheck.result.value.hasStickyBar)
  console.log("  PDP Mobile Accordions present:", pdpCheck.result.value.accordionCount)

  // Clean up
  client.close()
  chromeProc.kill()

  console.log(`\n==================================================`)
  console.log(`AUDIT SUMMARY: ${passCount} PASSED / ${failCount} FAILED (${totalTests} total tests)`)
  console.log(`==================================================`)

  if (failures.length > 0) {
    console.error("FAILURES RECORDED:")
    console.error(JSON.stringify(failures, null, 2))
    process.exit(1)
  } else {
    console.log("ALL VIEWPORTS PASSED WITH ZERO HORIZONTAL OVERFLOW!")
    process.exit(0)
  }
}

run().catch((err) => {
  console.error("Test execution error:", err)
  process.exit(1)
})
