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
const viHome = await get("/vi")
const privacy = await get("/privacy")
const viPrivacy = await get("/vi/privacy")
const fda = await get("/services/fda")
const heading = "Global B2B Digital Infrastructure & Export Acceleration"
const viHeading = "Hạ tầng số B2B toàn cầu & Tăng tốc xuất khẩu"
const siteUrl = "https://www.veximglobal.com"
assert.equal(home("html").attr("lang"), "en")
assert.equal(home("main").first().attr("lang"), "en")
assert.equal(home("h1").text(), heading)
assert.equal(home("h1").length, 1)
assert.equal(home('main header, main footer').length, 0, "Global landmarks should sit outside <main>")
assert.equal(home('head link[rel="canonical"]').attr("href"), "https://www.veximglobal.com")
assert.ok(home('head meta[name="description"]').attr("content")?.includes("B2B export websites"))
assert.equal(home('body meta[name="description"]').length, 0)
assert.equal(home('head link[rel="preload"][as="font"][href="/fonts/inter-home-latin.woff2"]').length, 0, "Optional display font should not delay critical resources")
assert.equal(home('head link[rel="manifest"]').length, 0, "The public homepage is not the admin PWA")
assert.equal(home('meta[property="og:url"]').attr("content"), "https://www.veximglobal.com")
assert.equal(home('meta[property="og:locale"]').attr("content"), "en_US")
assert.equal(home('meta[property="og:image"]').attr("content"), "https://www.veximglobal.com/og-image.jpg")
assert.equal(privacy("html").attr("lang"), "en")
assert.equal(privacy('head link[rel="manifest"]').length, 0)
assert.equal(viHome("html").attr("lang"), "vi")
assert.equal(viHome("main").first().attr("lang"), "vi")
assert.equal(viHome("h1").text(), viHeading)
assert.equal(viHome("h1").length, 1)
assert.equal(viHome('head link[rel="canonical"]').attr("href"), `${siteUrl}/vi`)
assert.equal(viHome('meta[property="og:locale"]').attr("content"), "vi_VN")
assert.equal(viHome('meta[property="og:image"]').attr("content"), `${siteUrl}/og-image-vi.jpg`)
assert.equal(viHome('head link[rel="manifest"]').length, 0)
assert.equal(viPrivacy("html").attr("lang"), "vi")
assert.equal(viPrivacy("main").attr("lang"), "vi")
assert.equal(viPrivacy("h1").text(), "Quyền riêng tư & yêu cầu đánh giá")
assert.equal(viPrivacy('head link[rel="canonical"]').attr("href"), `${siteUrl}/vi/privacy`)
assert.equal(privacy('head link[rel="canonical"]').attr("href"), `${siteUrl}/privacy`)
assert.equal(privacy('title').text(), 'Privacy & Data Requests | Vexim Global')
assert.equal(viPrivacy('title').text(), 'Quyền riêng tư & Yêu cầu dữ liệu | Vexim Global')
for (const [english, vietnamese, path] of [[home, viHome, ""], [privacy, viPrivacy, "/privacy"]]) {
  for (const document of [english, vietnamese]) {
    assert.equal(document('link[rel="alternate"][hreflang="en"]').attr("href"), `${siteUrl}${path}`)
    assert.equal(document('link[rel="alternate"][hreflang="vi"]').attr("href"), `${siteUrl}/vi${path}`)
    assert.equal(document('link[rel="alternate"][hreflang="x-default"]').attr("href"), `${siteUrl}${path}`)
  }
}
assert.equal(fda("html").attr("lang"), "vi")
assert.equal(home("body").hasClass("font-sans"), false)
assert.equal(viHome("body").hasClass("font-sans"), false)
assert.equal(fda("body").hasClass("font-sans"), true, "Existing Vietnamese service font stays unchanged")
assert.equal(fda('link[rel="alternate"][hreflang="en"]').length, 0, "Untranslated legal pages must not advertise an English counterpart")
assert.equal(fda('[data-language-switcher]').length, 0)
assert.equal(fda('head meta[name="description"]').length, 1)
for (const id of ["solutions", "the-gap", "services", "contact"]) {
  assert.equal(home(`#${id}`).length, 1, id)
  assert.equal(viHome(`#${id}`).length, 1, `VI ${id}`)
}
assert.equal(viHome('main section#solutions article').length, 3)
assert.equal(viHome('main section#the-gap article').length, 2)
assert.equal(viHome('main section#services article').length, 3)
assert.equal(viHome('a[href="/vi/privacy"]').length, 1)
assert.equal(viHome('a[href="https://veximtrade.com"]').length >= 2, true)
assert.ok(viHome('main').text().includes('Không cam kết thứ hạng'))
assert.ok(!/90%|Top 1[-–]10|Alibaba|Global Sources/i.test(viHome('main').text()))
assert.equal(home('main section#solutions article').length, 3, "Three editorial solution pillars")
assert.equal(home('main section#the-gap article').length, 2, "Two-column editorial rationale")
assert.equal(home('main section#services article').length, 3, "Product-line engagement scopes")
assert.equal(home('main [class*="dashboardShell"], main [class*="proofConsole"], main [class*="bentoGrid"], main [class*="tierGrid"]').length, 0, "No legacy dashboard, bento or tier cards")
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
for (const [document, language] of [[home, "en"], [viHome, "vi"]]) {
  assert.equal(document('main img[src^="/home/"]').length, 1, `${language} uses one original illustration`)
  assert.equal(document('main img[src="/home/export-atelier.svg"]').length, 1)
  assert.ok(document('main img[src="/home/export-atelier.svg"]').attr('alt')?.length > 25)
  assert.equal(document('main section[aria-labelledby="method-title"] ol > li').length, 3)
  assert.equal(document('main section[class*="pathway"] ol > li').length, 3)
  assert.ok(document('main').text().toLowerCase().includes(language === "en" ? 'concept illustration' : 'minh họa ý tưởng'))
  assert.equal(document('main img[src="/home/export-network.svg"]').length, 0, 'Old homepage artwork must not render')
}
const asset = "export-atelier.svg"
const content = readFileSync(`public/home/${asset}`, "utf8")
assert.ok(content.includes("<svg") && !/<script|<foreignObject|https?:\/\//i.test(content.replace('xmlns="http://www.w3.org/2000/svg"', "")), asset)
assert.ok(Buffer.byteLength(content) < 16_000, `Concept SVG should be lightweight: ${asset}`)
assert.ok(readFileSync("public/og-image.jpg").length < 300_000)
assert.ok(readFileSync("public/og-image-vi.jpg").length < 300_000)
const sitemapResponse = await fetch(`${base}/sitemap.xml`)
assert.equal(sitemapResponse.status, 200)
const sitemap = await sitemapResponse.text()
for (const url of [`${siteUrl}/vi`, `${siteUrl}/vi/privacy`]) assert.ok(sitemap.includes(`<loc>${url}</loc>`), `sitemap ${url}`)
assert.ok(sitemap.includes('hreflang="vi"'))
const serviceSitemapEntry = sitemap.slice(sitemap.indexOf(`<loc>${siteUrl}/services/fda</loc>`), sitemap.indexOf('</url>', sitemap.indexOf(`<loc>${siteUrl}/services/fda</loc>`)))
assert.ok(serviceSitemapEntry.includes(`<loc>${siteUrl}/services/fda</loc>`))
assert.ok(!serviceSitemapEntry.includes('hreflang="en"'), 'Unreviewed service translations must not be in sitemap')
const bad = await fetch(`${base}/api/digital-audit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website: "javascript:alert(1)", company: "Factory", markets: "US", email: "a@example.com" }) })
assert.equal(bad.status, 400)
const injected = await fetch(`${base}/api/digital-audit`, { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://invalid.example" }, body: "{}" })
assert.equal(injected.status, 403)
const honeypot = await fetch(`${base}/api/digital-audit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fax: "filled-by-bot" }) })
assert.deepEqual(await honeypot.json(), { success: true })
console.log("PASS: bilingual redesigned home/privacy SSR, reciprocal hreflang/sitemap, unchanged Vietnamese FDA, schema, original SVG, honest claims and audit endpoint validation")

const executablePath = process.env.BROWSER_EXECUTABLE_PATH
if (!executablePath) { console.log("Set BROWSER_EXECUTABLE_PATH to run interactive Chromium checks."); process.exit(0) }
const { default: puppeteer } = await import("puppeteer-core")
const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
const screenshots = process.env.HOME_TEST_SCREENSHOT_DIR
if (screenshots) mkdirSync(screenshots, { recursive: true })
try {
  for (const [locale, widths] of [["en", [320, 360, 390, 681, 720, 768, 881, 1024, 1440, 1920]], ["vi", [320, 390, 768, 881, 1024, 1440]]]) {
    for (const width of widths) {
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
      await page.goto(`${base}${locale === "vi" ? "/vi" : "/"}`, { waitUntil: "networkidle2", timeout: 90000 })
      await page.evaluate(() => document.fonts.ready)
      const state = await page.evaluate(() => {
        const copy = document.querySelector('[class*="heroCopy"]')
        const visual = document.querySelector('[class*="heroVisual"]')
        const brand = document.querySelector('header a[class*="brand"]')
        const menu = document.querySelector('button[aria-controls="landing-mobile-nav"]')
        const cards = [...document.querySelectorAll('#solutions article')]
        return {
          lang: document.documentElement.lang, h1: document.querySelector('h1')?.textContent,
          width: document.documentElement.scrollWidth, viewport: innerWidth, cls: window.__homeCLS || 0,
          align: getComputedStyle(copy).textAlign, copy: copy.getBoundingClientRect().toJSON(),
          visual: visual.getBoundingClientRect().toJSON(),
          header: getComputedStyle(document.querySelector('header')).position,
          solution: getComputedStyle(document.querySelector('#solutions')).backgroundColor,
          brandRight: brand.getBoundingClientRect().right, menu: menu.getBoundingClientRect().toJSON(),
          menuVisible: getComputedStyle(menu).display !== 'none',
          cards: cards.map(card => ({ top: card.getBoundingClientRect().top, width: card.getBoundingClientRect().width })),
        }
      })
      assert.equal(state.lang, locale)
      assert.equal(state.h1, locale === "vi" ? viHeading : heading)
      assert.equal(state.width, state.viewport, `${locale} horizontal overflow at ${width}px`)
      assert.ok(["left", "start"].includes(state.align), `${locale} headline is left-aligned at ${width}px`)
      if (width > 1020) assert.ok(state.visual.left >= state.copy.right + 10, `${locale} illustration beside copy at ${width}px`)
      else assert.ok(state.visual.top >= state.copy.bottom + 18, `${locale} illustration below copy at ${width}px`)
      assert.ok(state.cls < .01, `${locale} initial layout shift ${state.cls} at ${width}px`)
      assert.equal(state.header, "sticky")
      assert.equal(state.solution, "rgb(255, 255, 255)")
      assert.equal(state.cards.length, 3)
      if (width <= 720) assert.ok(state.cards[1].top > state.cards[0].top, `${locale} service columns stack on mobile`)
      else assert.ok(Math.abs(state.cards[1].top - state.cards[0].top) < 1, `${locale} first two columns share a row`)
      if (width <= 1020) {
        assert.ok(state.menuVisible && state.menu.width >= 42 && state.menu.left >= state.brandRight + 8, `${locale} mobile navigation target fits at ${width}px`)
        const toggle = page.locator('button[aria-controls="landing-mobile-nav"]')
        await toggle.click()
        assert.equal(await page.$eval('button[aria-controls="landing-mobile-nav"]', el => el.getAttribute("aria-expanded")), "true")
        await page.locator(`nav[aria-label="${locale === "vi" ? "Điều hướng di động" : "Mobile navigation"}"] a[href="${locale === "vi" ? "/vi" : "/"}#the-gap"]`).click()
        assert.equal(await page.$eval('button[aria-controls="landing-mobile-nav"]', el => el.getAttribute("aria-expanded")), "false")
      } else assert.equal(state.menuVisible, false, `${locale} desktop should display navigation`)
      const art = await page.$$eval('main img[src^="/home/"]', async images => {
        await Promise.all(images.map(image => image.decode()))
        return images.map(image => [image.naturalWidth, image.naturalHeight])
      })
      assert.equal(art.length, 1)
      assert.ok(art.every(([w, h]) => w > 0 && h > 0 && Math.abs(w / h - 920 / 770) < .05), `${locale} concept art decoded at ${width}px`)
      assert.equal(await page.$('.zalo-chat-widget'), null, `${locale} landing has its own contact flow`)
      if ([390, 1440].includes(width)) {
        await page.evaluate(() => scrollTo({ top: 1000, behavior: "instant" }))
        assert.ok(Math.abs(await page.$eval('header', el => el.getBoundingClientRect().top)) < 1, `${locale} sticky header at ${width}px`)
        if (screenshots) {
          await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
          await page.screenshot({ path: path.join(screenshots, `homepage-${locale}-${width}.png`), fullPage: true })
        }
      }
      assert.deepEqual(errors, [], `${locale} browser errors at ${width}px`)
      console.log(`PASS browser ${locale}: ${width}px, original art, responsive editorial columns, no overflow/hydration errors, CLS=${state.cls.toFixed(4)}`)
      await page.close()
    }
  }
  const languagePage = await browser.newPage()
  await languagePage.setViewport({ width: 1440, height: 900 })
  await languagePage.goto(`${base}/`, { waitUntil: "networkidle2" })
  await languagePage.locator('[class*="desktopLanguage"] summary').click()
  assert.equal(await languagePage.$eval('[class*="desktopLanguage"]', el => el.open), true)
  await languagePage.keyboard.press('Escape')
  assert.equal(await languagePage.$eval('[class*="desktopLanguage"]', el => el.open), false)
  await languagePage.locator('[class*="desktopLanguage"] summary').click()
  await Promise.all([languagePage.waitForNavigation({ waitUntil: 'domcontentloaded' }), languagePage.locator('[class*="desktopLanguage"] a[lang="vi"]').click()])
  assert.equal(new URL(languagePage.url()).pathname, '/vi')
  assert.equal(await languagePage.$eval('html', el => el.lang), 'vi')
  await languagePage.setViewport({ width: 390, height: 844 })
  await languagePage.goto(`${base}/vi`, { waitUntil: 'networkidle2' })
  await languagePage.locator('button[aria-controls="landing-mobile-nav"]').click()
  await languagePage.locator('[class*="mobileLanguage"] summary').click()
  assert.equal(await languagePage.$eval('[class*="mobileLanguage"]', el => el.open), true)
  await Promise.all([languagePage.waitForNavigation({ waitUntil: 'domcontentloaded' }), languagePage.locator('[class*="mobileLanguage"] a[lang="en"]').click()])
  assert.equal(new URL(languagePage.url()).pathname, '/')
  assert.equal(await languagePage.$eval('html', el => el.lang), 'en')
  await languagePage.goto(`${base}/vi/privacy`, { waitUntil: 'networkidle2' })
  await languagePage.locator('button[aria-controls="home-mobile-nav"]').click()
  await languagePage.locator('[class*="mobileLanguage"] summary').click()
  assert.equal(await languagePage.$eval('[class*="mobileLanguage"]', el => el.open), true)
  await Promise.all([languagePage.waitForNavigation({ waitUntil: 'domcontentloaded' }), languagePage.locator('[class*="mobileLanguage"] a[lang="en"]').click()])
  assert.equal(new URL(languagePage.url()).pathname, '/privacy')
  assert.equal(await languagePage.$eval('html', el => el.lang), 'en')
  await languagePage.close()
  console.log('PASS browser: desktop/mobile keyboard-accessible language dropdown, preserved privacy locale context')

  const viAudit = await browser.newPage()
  await viAudit.setViewport({ width: 390, height: 844 })
  await viAudit.goto(`${base}/vi`, { waitUntil: 'networkidle2' })
  await viAudit.setRequestInterception(true)
  let viPosted, viStatus = 200
  viAudit.on('request', request => {
    if (request.url().endsWith('/api/digital-audit')) {
      viPosted = JSON.parse(request.postData())
      void request.respond({ status: viStatus, contentType: 'application/json', body: viStatus === 200 ? '{"success":true}' : '{"error":"Online submission is unavailable."}' })
    } else void request.continue()
  })
  await viAudit.locator('main section[aria-labelledby="hero-title"] button[class*="primaryButton"]').click()
  assert.ok((await viAudit.$eval('[role="dialog"]', el => el.textContent)).includes('Tên công ty'))
  await viAudit.locator('#audit-website').fill('https://nhamay.example')
  await viAudit.locator('#audit-company').fill('Nhà máy thử nghiệm')
  await viAudit.locator('#audit-markets').fill('Nhật Bản')
  await viAudit.locator('#audit-email').fill('sales@nhamay.example')
  await viAudit.locator('button[type="submit"]').click()
  await viAudit.waitForSelector('p[role="status"]')
  assert.equal(viPosted.company, 'Nhà máy thử nghiệm')
  assert.ok((await viAudit.$eval('p[role="status"]', el => el.textContent)).includes('đã được gửi'))
  await viAudit.keyboard.press('Escape')
  await viAudit.waitForFunction(() => !document.querySelector('[role="dialog"]'))
  viStatus = 503
  await viAudit.locator('#services article:nth-child(2) button[class*="scopeButton"]').click()
  assert.ok((await viAudit.$eval('p[class*="scopeNote"]', el => el.textContent)).includes('Global Growth Engine'))
  await viAudit.locator('#audit-website').fill('https://nhamay.example')
  await viAudit.locator('#audit-company').fill('Nhà máy thử nghiệm')
  await viAudit.locator('#audit-markets').fill('Nhật Bản')
  await viAudit.locator('#audit-email').fill('sales@nhamay.example')
  await viAudit.locator('button[type="submit"]').click()
  await viAudit.waitForSelector('p[role="alert"]')
  assert.ok((await viAudit.$eval('p[role="alert"]', el => el.textContent)).includes('Chưa thể gửi trực tuyến'))
  assert.equal(viPosted.scope, 'Global Growth Engine')
  const draftHref = await viAudit.$eval('a[href^="mailto:contact@veximglobal.com?subject="]', el => el.href)
  assert.ok(decodeURIComponent(draftHref).includes('Xin chào Vexim Global'))
  await viAudit.close()
  console.log('PASS browser VI: localized audit success/error and email draft fallback (mocked; no mail sent)')

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
  await page.locator('main section[aria-labelledby="hero-title"] button[class*="primaryButton"]').click()
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
  await page.locator('#services article:nth-child(2) button[class*="scopeButton"]').click()
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
