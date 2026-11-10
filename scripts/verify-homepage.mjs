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
const heading = "Global B2B Digital Infrastructure & Export Acceleration"
assert.equal(home("html").attr("lang"), "en")
assert.equal(home("main").first().attr("lang"), "en")
assert.equal(home("h1").text(), heading)
assert.equal(home("h1").length, 1)
assert.equal(home('main header, main footer').length, 0, "Global landmarks should sit outside <main>")
assert.equal(home('head link[rel="canonical"]').attr("href"), "https://www.veximglobal.com")
assert.ok(home('head meta[name="description"]').attr("content")?.includes("B2B export websites"))
assert.equal(home('body meta[name="description"]').length, 0)
assert.equal(home('head link[rel="preload"][as="font"][href="/fonts/inter-home-latin.woff2"]').length, 1)
assert.equal(home('head link[rel="manifest"]').length, 0, "The public homepage is not the admin PWA")
assert.equal(home('meta[property="og:url"]').attr("content"), "https://www.veximglobal.com")
assert.equal(home('meta[property="og:locale"]').attr("content"), "en_US")
assert.equal(home('meta[property="og:image"]').attr("content"), "https://www.veximglobal.com/og-image.jpg")
assert.equal(privacy("html").attr("lang"), "en")
assert.equal(privacy('head link[rel="manifest"]').length, 0)
assert.equal(fda("html").attr("lang"), "vi")
assert.equal(fda('head meta[name="description"]').length, 1)
for (const id of ["solutions", "the-gap", "services", "contact"]) assert.equal(home(`#${id}`).length, 1, id)
assert.equal(home('main section#solutions article').length, 3, "Three bento solution pillars")
assert.equal(home('main section#the-gap article').length, 2, "Two-column verification gap")
assert.equal(home('main section#services article').length, 3, "Product-line engagement scopes")
assert.equal(home('main [class*="dashboardShell"], main [class*="proofConsole"]').length, 0, "No legacy technical dashboard")
assert.equal(home('a[href="https://veximtrade.com"]').length >= 2, true)
assert.equal(home('a[href="/privacy"]').length, 1)
for (const href of ["/services/fda", "/services/gacc", "/services/cosmetics/mocra-registration", "/services/us-agent"]) assert.ok(home(`a[href="${href}"]`).length, href)
assert.equal(home('script#home-page-schema[type="application/ld+json"]').length, 1)
const schema = JSON.parse(home("script#home-page-schema").html())
const service = schema["@graph"].find(node => node["@type"] === "Service")
assert.equal(service.name, heading)
assert.equal(service.hasOfferCatalog.itemListElement.length, 3)
assert.equal(schema["@graph"].find(node => node["@type"] === "WebPage").inLanguage, "en")
assert.ok(!/\?lang=vi|90% of factory|Page 1 of Google|instant listing verification|high-volume OEM contracts|Top 1[-–]10|Alibaba|Global Sources/i.test(home("main").text()))
assert.equal(home('a[href*="?lang=vi"]').length, 0)
assert.equal(home('main img[src^="/home/"]').length, 4)
for (const asset of ["export-network.svg", "cloud-architecture.svg", "buyer-intent.svg", "trade-connect.svg"]) {
  const content = readFileSync(`public/home/${asset}`, "utf8")
  assert.ok(content.includes("<svg") && !/<script|<foreignObject|https?:\/\//i.test(content.replace('xmlns="http://www.w3.org/2000/svg"', "")), asset)
  assert.ok(Buffer.byteLength(content) < 16_000, `SVG illustration should be lightweight: ${asset}`)
}
assert.ok(readFileSync("public/og-image.jpg").length < 300_000)
const bad = await fetch(`${base}/api/digital-audit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website: "javascript:alert(1)", company: "Factory", markets: "US", email: "a@example.com" }) })
assert.equal(bad.status, 400)
const injected = await fetch(`${base}/api/digital-audit`, { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://invalid.example" }, body: "{}" })
assert.equal(injected.status, 403)
const honeypot = await fetch(`${base}/api/digital-audit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fax: "filled-by-bot" }) })
assert.deepEqual(await honeypot.json(), { success: true })
console.log("PASS: English bento homepage / privacy, Vietnamese FDA, schema, four local SVGs, honest claims and audit endpoint validation")

const executablePath = process.env.BROWSER_EXECUTABLE_PATH
if (!executablePath) { console.log("Set BROWSER_EXECUTABLE_PATH to run interactive Chromium checks."); process.exit(0) }
const { default: puppeteer } = await import("puppeteer-core")
const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
const screenshots = process.env.HOME_TEST_SCREENSHOT_DIR
if (screenshots) mkdirSync(screenshots, { recursive: true })
try {
  for (const width of [320, 360, 390, 681, 720, 768, 881, 1024, 1440, 1920]) {
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
      solution: getComputedStyle(document.querySelector('#solutions')).backgroundColor,
      header: getComputedStyle(document.querySelector('header')).position,
    }))
    assert.equal(state.lang, "en")
    assert.equal(state.width, state.viewport, `horizontal overflow at ${width}px`)
    assert.equal(state.h1, heading)
    assert.ok(state.cls < 0.01, `initial layout shift ${state.cls} at ${width}px`)
    assert.equal(state.solution, "rgb(255, 255, 255)")
    assert.equal(state.header, "sticky")
    const art = await page.$$eval('main img[src^="/home/"]', async images => {
      await Promise.all(images.map(async image => { image.loading = "eager"; await image.decode() }))
      return images.map(image => ({ width: image.naturalWidth, height: image.naturalHeight }))
    })
    assert.equal(art.length, 4)
    assert.ok(art.every(image => image.width > 0 && image.height > 0), `broken isometric art at ${width}px`)
    if (width < 880) {
      const header = await page.evaluate(() => ({
        brand: document.querySelector('a[class*="brand"]')?.getBoundingClientRect().right,
        menu: document.querySelector('button[aria-controls="home-mobile-nav"]')?.getBoundingClientRect().toJSON(),
      }))
      assert.ok(header.menu.width >= 42 && header.menu.left >= header.brand + 8, `mobile menu target overlaps brand at ${width}px`)
      const toggle = page.locator('button[aria-controls="home-mobile-nav"]')
      await toggle.click()
      assert.equal(await page.$eval('button[aria-controls="home-mobile-nav"]', el => el.getAttribute("aria-expanded")), "true")
      await page.locator('nav[aria-label="Mobile navigation"] a[href="/#the-gap"]').click()
      assert.equal(await page.$eval('button[aria-controls="home-mobile-nav"]', el => el.getAttribute("aria-expanded")), "false")
    }
    const cards = await page.$$eval('#solutions article', items => items.map(item => ({ top: item.getBoundingClientRect().top, width: item.getBoundingClientRect().width })))
    if (width <= 720) assert.ok(cards[1].top > cards[0].top, `bento cards should stack at ${width}px`)
    else assert.ok(Math.abs(cards[1].top - cards[0].top) < 1, `bento pair should share a row at ${width}px`)
    if ([390, 1440].includes(width)) {
      await page.evaluate(() => scrollTo({ top: 900, behavior: "instant" }))
      assert.ok(Math.abs(await page.$eval('header', el => el.getBoundingClientRect().top)) < 1, `sticky header does not follow the viewport at ${width}px`)
      if (screenshots) {
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
        await page.screenshot({ path: path.join(screenshots, `homepage-${width}.png`), fullPage: true })
      }
    }
    assert.deepEqual(errors, [], `browser errors at ${width}px`)
    console.log(`PASS browser: ${width}px, vector art, bento layout, no overflow/hydration errors, initial CLS=${state.cls.toFixed(4)}`)
    await page.close()
  }
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto(`${base}/`, { waitUntil: "networkidle2" })
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
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'))
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
  await page.waitForSelector('p[role="alert"]')
  assert.ok((await page.$eval('p[role="alert"]', el => el.textContent)).includes('unavailable'))
  assert.equal(posted.scope, 'Global Growth Engine')
  await page.close()
  console.log('PASS browser: audit success/failure, tier scope and email fallback (mocked; no mail sent)')
} finally { await browser.close() }
