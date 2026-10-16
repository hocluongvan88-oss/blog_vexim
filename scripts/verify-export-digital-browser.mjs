// API/analytics are mocked. No real customer lead or SMTP delivery is created.
import assert from "node:assert/strict"
import { mkdirSync } from "node:fs"
import puppeteer from "puppeteer-core"
const base = process.env.SCHEMA_TEST_BASE_URL || "http://127.0.0.1:3000"
const shots = process.env.EXPORT_DIGITAL_SCREENSHOT_DIR
if (shots) mkdirSync(shots, { recursive: true })
assert.ok(process.env.BROWSER_EXECUTABLE_PATH)
const browser = await puppeteer.launch({
  executablePath: process.env.BROWSER_EXECUTABLE_PATH,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
try {
  const page = await browser.newPage(),
    errors = [],
    requests = []
  let mode = "error",
    heldRequest
  page.on("pageerror", (error) => errors.push(error.message))
  await page.evaluateOnNewDocument(() => {
    window.__events = []
    window.gtag = (...args) => window.__events.push(args)
  })
  await page.setRequestInterception(true)
  page.on("request", (request) => {
    if (request.method() === "POST" && new URL(request.url()).pathname === "/api/export-digital-assessment") {
      requests.push({
        body: JSON.parse(request.postData()),
        id: request.headers()["x-request-id"],
      })
      if (mode === "hold") {
        heldRequest = request
        return
      }
      if (mode === "network") return request.abort("failed")
      return request.respond({
        status: mode === "error" ? 503 : 200,
        contentType: mode === "malformed" ? "text/html" : "application/json",
        body:
          mode === "malformed"
            ? "<html>Error</html>"
            : JSON.stringify(
                mode === "error"
                  ? { error: "Lỗi gửi mô phỏng. Vui lòng thử lại." }
                  : mode === "rejected"
                    ? { success: false }
                    : { success: true, requestId: "test-reference" },
              ),
      })
    }
    return request.continue()
  })
  await page.goto(`${base}/services/export-digital`, {
    waitUntil: "networkidle0",
    timeout: 120000,
  })
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewport({ width, height: 1000 })
    const state = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      images: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
      forms: document.querySelectorAll("form").length,
    }))
    assert.ok(state.scroll <= width, `Overflow at ${width}: ${state.scroll}`)
    assert.equal(state.images, true)
    assert.equal(state.forms, 1, "No global chat or second conversion form on focused landing")
    if (shots && [390, 1440].includes(width)) {
      await page.screenshot({ path: `${shots}/${width}-hero.png` })
      await page.screenshot({
        path: `${shots}/${width}-full.png`,
        fullPage: true,
      })
    }
  }
  await page.setViewport({ width: 390, height: 844 })
  await page.click('.ed-checklist input[type="checkbox"]')
  const signals = await page.$$('.ed-checklist input[type="checkbox"]')
  await signals[1].click()
  assert.ok(await page.$eval(".ed-checklist-result", (el) => el.textContent.includes("2/5")))
  assert.equal(await page.evaluate(() => localStorage.length), 0)
  await page.$eval("#cai-gia", (el) => el.scrollIntoView())
  await page.waitForSelector(".ed-mobile-bar.is-visible", { visible: true })
  await page.waitForFunction(
    () => document.querySelector(".ed-mobile-bar").getBoundingClientRect().bottom <= innerHeight + 1,
  )
  const rect = await page.$eval(".ed-mobile-bar", (el) => ({
    bottom: el.getBoundingClientRect().bottom,
    height: innerHeight,
  }))
  assert.ok(rect.bottom <= rect.height + 1)
  const cta = await page.$('#export-hero a[href="#nhan-bao-cao"]')
  await cta.focus()
  await page.keyboard.press("Enter")
  await page.waitForFunction(() => location.hash === "#nhan-bao-cao")
  await page.waitForFunction(() => !document.querySelector(".ed-mobile-bar").classList.contains("is-visible"))
  const form = '[data-testid="export-assessment-form"]'
  await page.click(`${form} button[type="submit"]`)
  assert.equal(requests.length, 0, "Native required validation must block empty submission")
  for (const [name, value] of Object.entries({
    website: "https://internal.local",
    company: "Công ty kiểm thử",
    product: "Hạt điều thử nghiệm",
    name: "Người kiểm thử",
    phone: "0912345678",
  }))
    await page.type(`${form} input[name="${name}"]`, value)
  await page.click(`${form} input[name="markets"][value="Mỹ"]`)
  await page.click(`${form} input[name="markets"][value="EU"]`)
  await page.click(`${form} input[name="channels"][value="Alibaba"]`)
  await page.click(`${form} button[type="submit"]`)
  await page.waitForSelector(".ed-form-error")
  assert.equal(requests.length, 0, "Client schema must block non-public website")
  await page.click(`${form} input[name="noWebsite"]`)
  assert.equal(await page.$eval(`${form} input[name="website"]`, (el) => el.disabled), true)
  await page.click(`${form} button[type="submit"]`)
  await page.waitForFunction(() =>
    document.querySelector(".ed-form-error")?.textContent.includes("Lỗi gửi mô phỏng"),
  )
  assert.equal(requests.length, 1)
  assert.equal(requests[0].body.noWebsite, true)
  assert.equal(requests[0].body.email, "")
  assert.deepEqual(requests[0].body.markets, ["Mỹ", "EU"])
  assert.deepEqual(requests[0].body.channels, ["Alibaba"])
  assert.equal(await page.$eval(`${form} input[name="company"]`, (el) => el.value), "Công ty kiểm thử")
  assert.equal(
    (await page.evaluate(() => window.__events)).filter((event) => event[1] === "generate_lead").length,
    0,
  )
  for (const failure of ["malformed", "rejected", "network"]) {
    mode = failure
    await page.click(`${form} button[type="submit"]`)
    await page.waitForFunction(
      () => !document.querySelector('[type="submit"]').disabled && document.querySelector(".ed-form-error"),
    )
    assert.equal(
      (await page.evaluate(() => window.__events)).filter((event) => event[1] === "generate_lead").length,
      0,
    )
    assert.equal(await page.$eval(`${form} input[name="phone"]`, (el) => el.value), "0912345678")
  }
  // Retry with a real domain and email: no scheme must be accepted; all data remains private.
  await page.click(`${form} input[name="noWebsite"]`)
  await page.$eval(`${form} input[name="website"]`, (el) => el.select())
  await page.type(`${form} input[name="website"]`, "doanhnghiep.com")
  await page.type(`${form} input[name="email"]`, "company@example.com")
  mode = "hold"
  const pending = page.waitForRequest(
    (request) => request.method() === "POST" && request.url().includes("/api/export-digital-assessment"),
  )
  await page.click(`${form} button[type="submit"]`)
  await pending
  await page.waitForFunction(() => document.querySelector('[type="submit"]').disabled)
  assert.equal(await page.$eval(`${form}>fieldset`, (el) => el.disabled), true)
  await page.click(`${form} button[type="submit"]`)
  assert.equal(requests.length, 5)
  assert.ok(
    requests.every((request) => request.id === requests[0].id),
    "Retry should reuse request ID",
  )
  assert.equal(requests[4].body.website, "doanhnghiep.com")
  await heldRequest.respond({
    status: 202,
    contentType: "application/json",
    body: JSON.stringify({ success: true, requestId: "test-reference" }),
  })
  await page.waitForSelector(".ed-form-success")
  assert.equal(await page.$eval(".ed-form-success", (el) => el === document.activeElement), true)
  assert.ok(await page.$eval(".ed-form-success", (el) => el.textContent.includes("2 ngày làm việc")))
  assert.ok(await page.$('.ed-form-success a[href="/services/export-digital/goc-nhin-buyer"]'))
  const events = await page.evaluate(() => window.__events)
  assert.equal(events.filter((event) => event[1] === "generate_lead").length, 1)
  assert.equal(events.filter((event) => event[1] === "assessment_form_start").length, 1)
  assert.ok(
    !/Công ty kiểm thử|Hạt điều thử nghiệm|Người kiểm thử|0912345678|company@example.com|doanhnghiep\.com|Alibaba/.test(
      JSON.stringify(events),
    ),
    "Analytics must not receive lead data or checklist selections",
  )
  await page.$eval("#cai-gia", (el) => el.scrollIntoView())
  assert.ok(!(await page.$(".ed-mobile-bar.is-visible")), "Hide sticky conversion after success")
  const faq = await page.$("#cau-hoi details:nth-child(2) summary")
  await faq.focus()
  await page.keyboard.press("Enter")
  assert.equal(await page.$eval("#cau-hoi details:nth-child(2)", (el) => el.open), true)
  await page.goto(`${base}/services/export-digital/goc-nhin-buyer`, {
    waitUntil: "networkidle0",
  })
  assert.equal(await page.$eval("h1", (el) => el.textContent), "Buyer nhìn website của bạn trong 30 giây đầu")
  assert.ok(await page.$('a[href="/services/export-digital#nhan-bao-cao"]'))
  assert.deepEqual(errors, [])
  console.log(
    "PASS: responsive 320–1440px, images, single form, private checklist, mobile sticky, keyboard CTA/FAQ, optional email/no website/multi-select, real-domain client validation, error/retry/pending/success, one lead without PII, focus and working resource",
  )
} finally {
  await browser.close()
}
