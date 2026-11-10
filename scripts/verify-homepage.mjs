import assert from "node:assert/strict"
import { readFileSync, mkdirSync } from "node:fs"
import path from "node:path"
import { load } from "cheerio"

const base = (process.env.HOME_TEST_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "")
const get = async (url) => {
  const response = await fetch(`${base}${url}`)
  assert.equal(response.status, 200, url)
  return load(await response.text())
}

const home = await get("/")
const privacy = await get("/privacy")
const fda = await get("/services/fda")
assert.equal(home("html").attr("lang"), "en")
assert.equal(home("main").first().attr("lang"), "en")
assert.equal(home("h1").text(), "Global B2B Digital Infrastructure & Export Acceleration Engine")
assert.equal(home("h1").length, 1)
assert.equal(home('main header, main footer').length, 0, "Global landmarks should sit outside <main>")
assert.equal(home('head link[rel="canonical"]').attr("href"), "https://www.veximglobal.com")
assert.ok(home('head meta[name="description"]').attr("content")?.includes("B2B export websites"))
assert.equal(home('body meta[name="description"]').length, 0, "Do not stream metadata into the body")
assert.equal(home('head link[rel="preload"][as="font"][href="/fonts/inter-home-latin.woff2"]').length, 1)
assert.equal(home('head link[rel="manifest"]').length, 0, "The public homepage is not the admin PWA")
assert.equal(home('meta[property="og:url"]').attr("content"), "https://www.veximglobal.com")
assert.equal(home('meta[property="og:locale"]').attr("content"), "en_US")
assert.equal(home('meta[property="og:image"]').attr("content"), "https://www.veximglobal.com/og-image.jpg")
assert.equal(privacy("html").attr("lang"), "en")
assert.equal(privacy('head link[rel="manifest"]').length, 0)
assert.equal(fda("html").attr("lang"), "vi")
assert.equal(fda('head meta[name="description"]').length, 1)
for (const id of ["the-gap", "solutions", "performance", "services", "contact"]) assert.equal(home(`#${id}`).length, 1, id)
assert.equal(home('a[href="https://veximtrade.com"]').length >= 2, true)
assert.equal(home('a[href="/privacy"]').length, 1)
for (const href of ["/services/fda", "/services/gacc", "/services/cosmetics/mocra-registration", "/services/us-agent"]) assert.ok(home(`a[href="${href}"]`).length, href)
assert.equal(home('script#home-page-schema[type="application/ld+json"]').length, 1)
const schema = JSON.parse(home("script#home-page-schema").html())
const service = schema["@graph"].find(node => node["@type"] === "Service")
assert.equal(service.hasOfferCatalog.itemListElement.length, 3)
assert.equal(schema["@graph"].find(node => node["@type"] === "WebPage").inLanguage, "en")
assert.ok(!/\?lang=vi|Top 1[-–]10|90% of factory|Alibaba|Global Sources/.test(home("main").text()))
assert.equal(home('a[href*="?lang=vi"]').length, 0)
assert.ok(readFileSync("public/og-image.jpg").length < 300_000)
const bad = await fetch(`${base}/api/digital-audit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website: "javascript:alert(1)", company: "Factory", markets: "US", email: "a@example.com" }) })
assert.equal(bad.status, 400)
const injected = await fetch(`${base}/api/digital-audit`, { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://invalid.example" }, body: "{}" })
assert.equal(injected.status, 403)
const honeypot = await fetch(`${base}/api/digital-audit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fax: "filled-by-bot" }) })
assert.deepEqual(await honeypot.json(), { success: true })
console.log("PASS: English homepage / privacy, Vietnamese FDA, metadata, sections, links, schema, no invented rankings, audit endpoint validation")

const executablePath = process.env.BROWSER_EXECUTABLE_PATH
if (!executablePath) { console.log("Set BROWSER_EXECUTABLE_PATH to run interactive Chromium checks."); process.exit(0) }
const { default: puppeteer } = await import("puppeteer-core")
const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
const screenshots = process.env.HOME_TEST_SCREENSHOT_DIR
if (screenshots) mkdirSync(screenshots, { recursive: true })
try {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage()
    const errors = []
    page.on("pageerror", error => errors.push(error.message))
    page.on("console", entry => { if (entry.type() === "error" && !entry.text().includes("favicon")) errors.push(entry.text()) })
    await page.setViewport({ width, height: width < 500 ? 844 : 900, deviceScaleFactor: 1 })
    await page.evaluateOnNewDocument(() => {
      window.__homeCLS = 0
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__homeCLS += entry.value
      }).observe({ type: "layout-shift", buffered: true })
    })
    await page.goto(`${base}/`, { waitUntil: "networkidle2", timeout: 90000 })
    await page.evaluate(() => document.fonts.ready)
    const state = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      width: document.documentElement.scrollWidth, viewport: innerWidth,
      h1: document.querySelector("h1")?.textContent,
      cls: window.__homeCLS || 0,
    }))
    assert.equal(state.lang, "en")
    assert.equal(state.width, state.viewport, `horizontal overflow at ${width}px`)
    assert.equal(state.h1, "Global B2B Digital Infrastructure & Export Acceleration Engine")
    assert.ok(state.cls < 0.01, `initial layout shift ${state.cls} at ${width}px`)
    if (screenshots && [390, 1440].includes(width)) await page.screenshot({ path: path.join(screenshots, `homepage-${width}.png`), fullPage: true })
    if (width < 880) {
      const header = await page.evaluate(() => ({
        brand: document.querySelector('a[class*="brand"]')?.getBoundingClientRect().right,
        menu: document.querySelector('button[aria-controls="home-mobile-nav"]')?.getBoundingClientRect().toJSON(),
      }))
      assert.ok(header.menu.width >= 42 && header.menu.left >= header.brand + 8, `mobile menu target overlaps brand at ${width}px`)
      const toggle = page.locator('button[aria-controls="home-mobile-nav"]')
      await toggle.click()
      assert.equal(await page.$eval('button[aria-controls="home-mobile-nav"]', el => el.getAttribute("aria-expanded")), "true")
      await page.locator('nav[aria-label="Mobile navigation"] a[href="#performance"]').click()
      assert.equal(await page.$eval('button[aria-controls="home-mobile-nav"]', el => el.getAttribute("aria-expanded")), "false")
    }
    if ([390, 1440].includes(width)) {
      const design = await page.evaluate(() => ({
        headingSize: parseFloat(getComputedStyle(document.querySelector('#hero-title')).fontSize),
        solutionBackground: getComputedStyle(document.querySelector('#solutions')).backgroundColor,
        headerPosition: getComputedStyle(document.querySelector('header')).position,
      }))
      assert.ok(design.headingSize >= 40, `hero typography too small at ${width}px`)
      assert.equal(design.solutionBackground, 'rgb(245, 245, 247)', 'the homepage solution surface should remain light')
      assert.equal(design.headerPosition, 'sticky')
      await page.evaluate(() => scrollTo({ top: 900, behavior: 'instant' }))
      assert.ok(Math.abs(await page.$eval('header', el => el.getBoundingClientRect().top)) < 1, `sticky header does not follow the viewport at ${width}px`)
    }
    assert.deepEqual(errors, [], `browser errors at ${width}px`)
    console.log(`PASS browser: ${width}px, no overflow/hydration errors, initial CLS=${state.cls.toFixed(4)}`)
    await page.close()
  }
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto(`${base}/`, { waitUntil: "networkidle2" })
  await page.locator('button[role="tab"][aria-controls="proof-panel-reach"]').click()
  assert.equal(await page.$eval('button[aria-controls="proof-panel-reach"]', el => el.getAttribute("aria-selected")), "true")
  assert.equal(await page.$eval('#proof-panel-reach', el => el.hidden), false)
  assert.equal(await page.$eval('#proof-panel-visibility', el => el.hidden), true)
  await page.keyboard.press("ArrowRight")
  assert.equal(await page.$eval('button[aria-controls="proof-panel-inquiries"]', el => el.getAttribute("aria-selected")), "true")
  await page.setRequestInterception(true)
  let posted
  let mockStatus = 200
  page.on("request", request => {
    if (request.url().endsWith("/api/digital-audit")) {
      posted = JSON.parse(request.postData())
      void request.respond({ status: mockStatus, contentType: "application/json", body: mockStatus === 200 ? '{"success":true}' : '{"error":"Online submission is unavailable. Please send the email draft instead."}' })
    } else void request.continue()
  })
  await page.locator('button[class*="heroPrimary"]').click()
  await page.locator('#audit-website').fill('https://factory.example')
  await page.locator('#audit-company').fill('Example Factory')
  await page.locator('#audit-markets').fill('Japan, EU')
  await page.locator('#audit-email').fill('sales@factory.example')
  await page.locator('button[type="submit"]').click()
  await page.waitForSelector('p[role="status"]')
  assert.equal(posted.company, 'Example Factory')
  assert.equal(posted.email, 'sales@factory.example')
  assert.ok((await page.$eval('p[role="status"]', el => el.textContent)).includes('sent'))
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]')) // Wait for the Radix closing animation/overlay.
  mockStatus = 503
  await page.locator('button[class*="tierButtonFeatured"]').click()
  await page.waitForSelector('p[class*="scopeNote"]')
  assert.ok((await page.$eval('p[class*="scopeNote"]', el => el.textContent)).includes('Global Growth Engine'))
  await page.locator('#audit-website').fill('https://factory.example')
  await page.locator('#audit-company').fill('Example Factory')
  await page.locator('#audit-markets').fill('Japan')
  await page.locator('#audit-email').fill('sales@factory.example')
  await page.locator('button[type="submit"]').click()
  await page.waitForSelector('a[href^="mailto:contact@veximglobal.com?subject="]')
  assert.ok((await page.$eval('p[role="alert"]', el => el.textContent)).includes('unavailable'))
  assert.equal(posted.scope, 'Global Growth Engine')
  await page.close()
  console.log('PASS browser: tab keyboard navigation, audit success/failure and email fallback (mocked; no mail sent)')
} finally { await browser.close() }
