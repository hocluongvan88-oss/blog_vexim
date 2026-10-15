// API and analytics are mocked: this is NOT proof of production email delivery.
// BROWSER_EXECUTABLE_PATH=/path/to/chromium npm run test:fda:browser
import assert from "node:assert/strict"
import { mkdirSync } from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const base = process.env.SCHEMA_TEST_BASE_URL || "http://127.0.0.1:3000"
const screenshotDir = process.env.FDA_SCREENSHOT_DIR
assert.ok(process.env.BROWSER_EXECUTABLE_PATH, "Set BROWSER_EXECUTABLE_PATH to a Chromium executable")
if (screenshotDir) mkdirSync(screenshotDir, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: process.env.BROWSER_EXECUTABLE_PATH,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
try {
  const page = await browser.newPage()
  const browserErrors = []
  page.on("pageerror", (error) => browserErrors.push(error.message))
  await page.evaluateOnNewDocument(() => {
    window.__testEvents = []
    window.gtag = (...args) => window.__testEvents.push(args)
  })
  const requests = []
  let mode = "error",
    heldRequest
  await page.setRequestInterception(true)
  page.on("request", (request) => {
    if (request.method() === "POST" && new URL(request.url()).pathname === "/api/consultation") {
      requests.push(JSON.parse(request.postData()))
      if (mode === "hold") {
        heldRequest = request
        return
      }
      if (mode === "network") return request.abort("failed")
      if (mode === "malformed" || mode === "rejected") {
        return request.respond({
          status: 200,
          contentType: mode === "malformed" ? "text/html" : "application/json",
          body: mode === "malformed" ? "<html>Upstream unavailable</html>" : JSON.stringify({ success: false }),
        })
      }
      return request.respond({
        status: mode === "success" ? 200 : 503,
        contentType: "application/json",
        body: JSON.stringify(mode === "success" ? { success: true } : { error: "Lỗi mô phỏng, vui lòng thử lại." }),
      })
    }
    return request.continue()
  })
  await page.goto(`${base}/services/fda`, { waitUntil: "networkidle0", timeout: 120000 })
  assert.equal(await page.$$eval('main [data-testid="fda-lead-form"]', (forms) => forms.length), 2)
  const hero = '[data-form-location="hero"]',
    contact = '[data-form-location="contact"]'
  // Below-the-fold case and logo images are lazy-loaded; load them before checking for broken media.
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map(async (image) => {
        image.loading = "eager"
        await image.decode()
      }),
    )
  })
  assert.equal(await page.$$eval("#documents img, #case-libra img, #partners img", (images) => images.length), 11)
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewport({ width, height: 1000 })
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      broken: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length,
    }))
    assert.ok(layout.scroll <= width, `Horizontal overflow at ${width}px: ${layout.scroll}`)
    assert.equal(layout.broken, 0)
    if (screenshotDir && [390, 1440].includes(width)) {
      await page.screenshot({ path: path.join(screenshotDir, `fda-${width}-full.png`), fullPage: true })
      await page.screenshot({ path: path.join(screenshotDir, `fda-${width}-hero.png`) })
    }
  }
  console.log("PASS: 320/390/768/1440px layouts, photo loading and optional screenshots")

  await page.setViewport({ width: 390, height: 844 })
  const contactLink = await page.$('#fda-hero a[href="#fda-contact"]')
  await contactLink.focus()
  await page.keyboard.press("Enter")
  await page.waitForFunction(() => location.hash === "#fda-contact")
  assert.equal(await page.$('[role="dialog"]'), null, "Landing CTA should lead to inline form, not open old modal")
  await page.click(`${hero} button[type="submit"]`)
  assert.equal(requests.length, 0, "Required fields must block empty submit")
  for (const [name, value] of Object.entries({
    name: "Khách kiểm thử",
    phone: "0912345678",
    email: "test@example.com",
  }))
    await page.type(`${hero} input[name="${name}"]`, value)
  await page.select(`${hero} select[name="product"]`, "Thực phẩm")
  await page.click(`${hero} button[type="submit"]`)
  await page.waitForFunction(() =>
    document.querySelector('[data-form-location="hero"] [role="status"]')?.textContent.includes("Lỗi mô phỏng"),
  )
  assert.equal(requests.length, 1)
  assert.equal(
    (await page.evaluate(() => window.__testEvents)).filter((event) => event[1] === "generate_lead").length,
    0,
  )
  assert.equal(await page.$eval(`${hero} input[name="email"]`, (el) => el.value), "test@example.com")
  assert.equal(await page.$eval(`${hero} a[href^="tel:"]`, (el) => el.textContent.includes("Gọi Vexim")), true)
  mode = "success"
  await page.click(`${hero} button[type="submit"]`)
  await page.waitForFunction(() =>
    document.querySelector('[data-form-location="hero"] [role="status"]')?.textContent.includes("24 giờ"),
  )
  assert.equal(await page.$eval(`${hero} button[type="submit"]`, (el) => el.disabled), true)
  assert.equal(requests.length, 2)
  assert.equal(requests[1].service, "fda")
  assert.equal(requests[1].product, "Thực phẩm")
  let events = await page.evaluate(() => window.__testEvents)
  assert.equal(events.filter((event) => event[1] === "form_start" && event[2].source === "fda_hero").length, 1)
  assert.equal(events.filter((event) => event[1] === "generate_lead").length, 1)
  assert.equal(events.find((event) => event[1] === "generate_lead")[2].source, "fda_hero")
  await page.click(`${hero} button[type="button"]`)
  assert.equal(await page.$eval(`${hero} input[name="name"]`, (el) => el.value), "")
  assert.equal(await page.$eval(`${contact} input[name="name"]`, (el) => el.value), "")
  console.log(
    "PASS: inline CTA keyboard navigation; required inputs; hero error/retry/success; isolated form reset; one lead",
  )

  // The full reference-style form includes company, product, message counter and reset.
  await page.click(`${contact} button[type="submit"]`)
  assert.equal(requests.length, 2)
  for (const [name, value] of Object.entries({
    company: "Doanh nghiệp thử",
    name: "Liên hệ thử",
    phone: "0987654321",
    email: "company@example.com",
  }))
    await page.type(`${contact} input[name="${name}"]`, value)
  await page.select(`${contact} select[name="product"]`, "Mỹ phẩm")
  await page.type(`${contact} textarea`, "M".repeat(510))
  assert.equal(await page.$eval(`${contact} textarea`, (el) => el.value.length), 500)
  assert.ok(await page.$eval(contact, (el) => el.textContent.includes("500/500 ký tự")))
  await page.click(`${contact} button[type="button"]`)
  assert.equal(await page.$eval(`${contact} input[name="company"]`, (el) => el.value), "")
  assert.equal(await page.$eval(`${contact} textarea`, (el) => el.value), "")
  for (const [name, value] of Object.entries({
    company: "Doanh nghiệp thử",
    name: "Liên hệ thử",
    phone: "0987654321",
    email: "company@example.com",
  }))
    await page.type(`${contact} input[name="${name}"]`, value)
  await page.select(`${contact} select[name="product"]`, "Thực phẩm")
  await page.type(`${contact} textarea`, "Tư vấn bánh kẹo xuất khẩu")
  mode = "hold"
  const pendingRequest = page.waitForRequest(
    (request) => request.method() === "POST" && request.url().includes("/api/consultation"),
  )
  await page.click(`${contact} button[type="submit"]`)
  await pendingRequest
  await page.waitForFunction(
    () => document.querySelector('[data-form-location="contact"] button[type="submit"]')?.disabled,
  )
  assert.equal(await page.$eval(`${contact} fieldset`, (el) => el.disabled), true)
  await page.click(`${contact} button[type="submit"]`)
  assert.equal(requests.length, 3, "Pending request must not be duplicated")
  assert.equal(requests[2].description, "Doanh nghiệp: Doanh nghiệp thử\nTư vấn bánh kẹo xuất khẩu")
  assert.equal(requests[2].service, "fda")
  assert.equal(requests[2].honeypot, "")
  await heldRequest.respond({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) })
  await page.waitForFunction(() =>
    document.querySelector('[data-form-location="contact"] [role="status"]')?.textContent.includes("24 giờ"),
  )
  events = await page.evaluate(() => window.__testEvents)
  const leads = events.filter((event) => event[1] === "generate_lead")
  assert.equal(leads.length, 2)
  assert.deepEqual(
    leads.map((event) => event[2].source),
    ["fda_hero", "fda_contact"],
  )
  assert.ok(leads.every((event) => event[2].service === "fda"))
  assert.ok(
    !/Khách kiểm thử|0912345678|test@example.com|Doanh nghiệp thử|Liên hệ thử|0987654321|company@example.com|Tư vấn bánh kẹo/.test(
      JSON.stringify(events),
    ),
  )
  console.log(
    "PASS: full form company/message payload; 500-character limit; reset; pending duplicate protection; contact lead; no PII in analytics",
  )

  for (const [name, value] of Object.entries({
    name: "Khách kiểm thử",
    phone: "0912345678",
    email: "test@example.com",
  }))
    await page.type(`${hero} input[name="${name}"]`, value)
  await page.select(`${hero} select[name="product"]`, "Thực phẩm")
  for (const failureMode of ["malformed", "rejected", "network"]) {
    mode = failureMode
    await page.click(`${hero} button[type="submit"]`)
    await page.waitForFunction(() => {
      const form = document.querySelector('[data-form-location="hero"]')
      return !form.querySelector('button[type="submit"]').disabled && form.querySelector('[role="status"]')
    })
    assert.equal(await page.$eval(`${hero} input[name="email"]`, (el) => el.value), "test@example.com")
    assert.equal(
      (await page.evaluate(() => window.__testEvents)).filter((event) => event[1] === "generate_lead").length,
      2,
    )
  }
  assert.equal(requests.length, 6)
  console.log("PASS: malformed JSON, success:false and network failure preserve inputs and never count leads")

  const summary = await page.$("#faq details summary")
  await summary.focus()
  await page.keyboard.press("Enter")
  assert.equal(await page.$eval("#faq details", (el) => el.open), true)
  await page.keyboard.press("Enter")
  assert.equal(await page.$eval("#faq details", (el) => el.open), false)
  assert.deepEqual(browserErrors, [])
  console.log("PASS: native FAQ keyboard interaction; no page JavaScript errors")

  // Preserve regression coverage for the shared dialog used elsewhere on the site.
  async function clickText(text) {
    for (const button of await page.$$("button")) {
      if ((await button.evaluate((el) => el.textContent)).includes(text)) {
        await button.click()
        return
      }
    }
    throw new Error(`Button not found: ${text}`)
  }
  await page.setViewport({ width: 1440, height: 1000 })
  await page.goto(`${base}/services/us-agent`, { waitUntil: "networkidle0", timeout: 120000 })
  await page.click('button[aria-haspopup="dialog"]')
  await page.waitForSelector('[role="dialog"]', { visible: true })
  await page.keyboard.press("Escape")
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'))
  await clickText("Yêu cầu tư vấn")
  await page.waitForSelector('[role="dialog"]', { visible: true })
  console.log("PASS: existing children-trigger and controlled header-dialog flows")
} finally {
  await browser.close()
}
