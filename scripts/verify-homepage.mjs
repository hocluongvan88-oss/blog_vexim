import assert from "node:assert/strict"
import { readFileSync, mkdirSync } from "node:fs"
import path from "node:path"
import { load } from "cheerio"

const base = (process.env.HOME_TEST_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "")
const get = async (url, language = "vi-VN,vi;q=0.9") => {
  const response = await fetch(`${base}${url}`, { headers: { "accept-language": language } })
  assert.equal(response.status, 200, url)
  return load(await response.text())
}

const viHome = await get("/")
const home = await get("/en", "en-US,en;q=0.9")
const viPrivacy = await get("/privacy")
const privacy = await get("/en/privacy", "en-US,en;q=0.9")
const fda = await get("/services/fda")
const heading = "Your own route to international buyers"
const viHeading = "Con đường riêng để người mua tìm thấy bạn"
const siteUrl = "https://www.veximglobal.com"
assert.equal(home("html").attr("lang"), "en")
assert.equal(home("main").first().attr("lang"), "en")
assert.equal(home("h1").text(), heading)
assert.equal(home("h1").length, 1)
assert.equal(home('main header, main footer').length, 0, "Global landmarks should sit outside <main>")
assert.equal(home('head link[rel="canonical"]').attr("href"), "https://www.veximglobal.com/en")
assert.ok(home('head meta[name="description"]').attr("content")?.includes("B2B platform"))
assert.equal(home('body meta[name="description"]').length, 0)
assert.equal(home('head link[rel="preload"][as="font"][href="/fonts/inter-home-latin.woff2"]').length, 0, "Optional display font should not delay critical resources")
assert.equal(home('head link[rel="manifest"]').length, 0, "The public homepage is not the admin PWA")
assert.equal(home('meta[property="og:url"]').attr("content"), "https://www.veximglobal.com/en")
assert.equal(home('meta[property="og:locale"]').attr("content"), "en_US")
assert.equal(home('meta[property="og:image"]').attr("content"), "https://www.veximglobal.com/og-image.jpg")
assert.equal(privacy("html").attr("lang"), "en")
assert.equal(privacy('head link[rel="manifest"]').length, 0)
assert.equal(viHome("html").attr("lang"), "vi")
assert.equal(viHome("main").first().attr("lang"), "vi")
assert.equal(viHome("h1").text(), viHeading)
assert.equal(viHome("h1").length, 1)
assert.equal(viHome('head link[rel="canonical"]').attr("href"), siteUrl)
assert.equal(viHome('meta[property="og:locale"]').attr("content"), "vi_VN")
assert.equal(viHome('meta[property="og:image"]').attr("content"), `${siteUrl}/og-image-vi.jpg`)
assert.equal(viHome('head link[rel="manifest"]').length, 0)
assert.equal(viPrivacy("html").attr("lang"), "vi")
assert.equal(viPrivacy("main").attr("lang"), "vi")
assert.equal(viPrivacy("h1").text(), "Quyền riêng tư & yêu cầu đánh giá")
assert.equal(viPrivacy('head link[rel="canonical"]').attr("href"), `${siteUrl}/privacy`)
assert.equal(privacy('head link[rel="canonical"]').attr("href"), `${siteUrl}/en/privacy`)
assert.equal(privacy('title').text(), 'Privacy & Data Requests | Vexim Global')
assert.equal(viPrivacy('title').text(), 'Quyền riêng tư & Yêu cầu dữ liệu | Vexim Global')
// Tiếng Việt là mặc định ở URL gốc; /en là bản tiếng Anh. x-default trỏ về
// bản tiếng Việt vì đó là ngôn ngữ mặc định của site.
for (const [english, vietnamese, path] of [[home, viHome, ""], [privacy, viPrivacy, "/privacy"]]) {
  for (const document of [english, vietnamese]) {
    assert.equal(document('link[rel="alternate"][hreflang="en"]').attr("href"), `${siteUrl}/en${path}`)
    assert.equal(document('link[rel="alternate"][hreflang="vi"]').attr("href"), `${siteUrl}${path}`)
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
assert.equal(viHome('main section#solutions article').length, 4)
assert.equal(viHome('main section#the-gap article').length, 2)
assert.equal(viHome('main section#services article').length, 3)
assert.equal(viHome('a[href="/privacy"]').length, 1)
assert.equal(viHome('a[href="https://veximtrade.com"]').length >= 2, true)
assert.ok(viHome('main').text().includes('Không cam kết thứ hạng'))
assert.ok(!/90%|Top 1[-–]10|Alibaba|Global Sources/i.test(viHome('main').text()))
assert.equal(home('main section#solutions article').length, 4, "Four pillars: platform, reach, website, operations")
assert.equal(home('main section#the-gap article').length, 2, "Two-column verification gap")
assert.equal(home('main section#services article').length, 3, "Product-line engagement scopes")
assert.equal(home('main [class*="dashboardShell"], main [class*="proofConsole"]').length, 0, "No legacy technical dashboard")
assert.equal(home('a[href="https://veximtrade.com"]').length >= 2, true)
assert.equal(home('a[href="/en/privacy"]').length, 1)
for (const href of ["/services/fda", "/services/gacc", "/services/cosmetics/mocra-registration", "/services/us-agent"]) assert.ok(home(`a[href="${href}"]`).length, href)
assert.equal(home('script#home-page-schema[type="application/ld+json"]').length, 1)
const schema = JSON.parse(home("script#home-page-schema").html())
const service = schema["@graph"].find(node => node["@type"] === "Service")
assert.equal(service.name, heading)
assert.equal(service.hasOfferCatalog.itemListElement.length, 3)
assert.equal(schema["@graph"].find(node => node["@type"] === "WebPage").inLanguage, "en")
assert.ok(!/90% of factory|Page 1 of Google|instant listing verification|high-volume OEM contracts|Top 1[-–]10|Alibaba|Global Sources/i.test(home("main").text()))
// Mỗi liên kết chuyển ngữ mang ?lang= để middleware ghi nhớ lựa chọn của
// khách (desktop + mobile = 2 liên kết mỗi ngôn ngữ).
assert.equal(home('a[href="/?lang=vi"]').length, 2)
assert.equal(home('a[href="/en?lang=en"]').length, 2)
const homePhotos = home('main img[src^="/home/"][src$=".webp"]')
assert.equal(homePhotos.length, 13, "Thirteen editorial photographs inside <main>: four hero, four pillar, four journey, one verification scene")
assert.equal(home('footer img[src^="/home/"][src$=".webp"]').length, 1, "The footer invitation carries one photograph")
assert.equal(homePhotos.filter((_, image) => !home(image).attr("alt")).length, 0, "Every photograph carries alt text")
assert.equal(homePhotos.filter((_, image) => !home(image).attr("srcset")).length, 0, "Every photograph offers a responsive srcset")
assert.equal(home('main img[src="/home/export-network.svg"]').length, 1, "The illustrated route map remains in the hero")
for (const asset of ["origin-ingredients", "factory-floor", "buyer-meeting", "port-logistics", "catalog-device", "quality-lab", "warehouse-loading", "vietnam-factory-exterior", "global-buyer", "hanoi-harbor", "export-documentation", "trucking", "content-operations"]) {
  for (const suffix of ["", "-800"]) {
    const photo = readFileSync(`public/home/${asset}${suffix}.webp`)
    assert.ok(photo.length > 8_000 && photo.length < 200_000, `Photograph should stay lightweight: ${asset}${suffix}.webp`)
  }
}
for (const asset of ["export-network.svg", "cloud-architecture.svg", "buyer-intent.svg", "trade-connect.svg"]) {
  const content = readFileSync(`public/home/${asset}`, "utf8")
  assert.ok(content.includes("<svg") && !/<script|<foreignObject|https?:\/\//i.test(content.replace('xmlns="http://www.w3.org/2000/svg"', "")), asset)
  assert.ok(Buffer.byteLength(content) < 16_000, `SVG illustration should be lightweight: ${asset}`)
}
assert.ok(readFileSync("public/og-image.jpg").length < 300_000)
assert.ok(readFileSync("public/og-image-vi.jpg").length < 300_000)
const sitemapResponse = await fetch(`${base}/sitemap.xml`)
assert.equal(sitemapResponse.status, 200)
const sitemap = await sitemapResponse.text()
for (const url of [`${siteUrl}/en`, `${siteUrl}/en/privacy`]) assert.ok(sitemap.includes(`<loc>${url}</loc>`), `sitemap ${url}`)
assert.ok(sitemap.includes(`<loc>${siteUrl}</loc>`), "sitemap default-language home")
assert.ok(sitemap.includes(`<loc>${siteUrl}/privacy</loc>`), "sitemap default-language privacy")
// Định tuyến ngôn ngữ: tiếng Việt là mặc định, khách quốc tế được chuyển sang
// /en, và lựa chọn thủ công (?lang=) được ghi cookie để không bị chuyển lại.
{
  const status = async (path, headers) => {
    const response = await fetch(`${base}${path}`, { headers, redirect: "manual" })
    return { code: response.status, location: response.headers.get("location"), cookies: response.headers.getSetCookie?.() ?? [] }
  }
  const english = { "accept-language": "en-US,en;q=0.9" }
  const vietnamese = { "accept-language": "vi-VN,vi;q=0.9" }

  assert.equal((await status("/", {})).code, 200, "no Accept-Language falls back to Vietnamese")
  const enBrowser = await status("/", english)
  assert.equal(enBrowser.code, 307, "English browser is redirected to the English page")
  assert.ok(enBrowser.location?.endsWith("/en"), "redirects to /en")
  assert.equal((await status("/privacy", english)).location?.endsWith("/en/privacy"), true)
  assert.equal((await status("/en", english)).code, 200, "English page never bounces back")
  assert.equal((await status("/", vietnamese)).code, 200)
  assert.equal((await status("/", { "accept-language": "en;q=0.2, vi;q=0.9" })).code, 200, "quality values decide")
  assert.equal((await status("/", { "accept-language": "fr-FR,fr;q=0.9" })).code, 200, "unrelated languages stay on Vietnamese")

  // Bấm "VI" trên bản tiếng Anh ghi cookie để lần sau trình duyệt tiếng Anh
  // không bị chuyển hướng nữa.
  const chooseVi = await status("/?lang=vi", english)
  assert.equal(chooseVi.code, 307)
  assert.ok(chooseVi.cookies.some(cookie => cookie.startsWith("vexim_locale=vi")), "manual choice is persisted")
  assert.equal((await status("/", { ...english, cookie: "vexim_locale=vi" })).code, 200, "remembered choice wins over the browser language")
  assert.equal((await status("/", { ...vietnamese, cookie: "vexim_locale=en" })).location?.endsWith("/en"), true, "remembered English choice redirects")

  // URL tiếng Việt cũ giữ 308 về URL mới để không mất tín hiệu SEO.
  const oldHome = await status("/vi", {})
  assert.equal(oldHome.code, 308)
  assert.ok(oldHome.location?.endsWith("/"), "/vi -> /")
  assert.equal((await status("/vi/privacy", {})).location?.endsWith("/privacy"), true, "/vi/privacy -> /privacy")
}
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
console.log("PASS: bilingual home/privacy SSR, reciprocal hreflang/sitemap, unchanged Vietnamese FDA, schema, four SVGs plus twelve photographs, honest claims and audit endpoint validation")

const executablePath = process.env.BROWSER_EXECUTABLE_PATH
if (!executablePath) { console.log("Set BROWSER_EXECUTABLE_PATH to run interactive Chromium checks."); process.exit(0) }
const { default: puppeteer } = await import("puppeteer-core")
const browser = await puppeteer.launch({ executablePath, headless: true, protocolTimeout: 240000, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
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
    await page.goto(`${base}/en`, { waitUntil: "networkidle2", timeout: 90000 })
    await page.evaluate(() => document.fonts.ready)
    const state = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      width: document.documentElement.scrollWidth, viewport: innerWidth,
      h1: document.querySelector("h1")?.textContent,
      cls: window.__homeCLS || 0,
      heroTextAlign: getComputedStyle(document.querySelector('[class*="heroCopy"]')).textAlign,
      heroCopy: document.querySelector('[class*="heroCopy"]').getBoundingClientRect().toJSON(),
      heroStage: document.querySelector('figure[class*="heroStage"]').getBoundingClientRect().toJSON(),
      solution: getComputedStyle(document.querySelector('#solutions')).backgroundImage,
      heroPhotos: document.querySelectorAll('figure[class*="heroStage"] img').length,
      header: getComputedStyle(document.querySelector('header')).position,
    }))
    assert.equal(state.lang, "en")
    assert.equal(state.width, state.viewport, `horizontal overflow at ${width}px`)
    assert.equal(state.h1, heading)
    assert.equal(state.heroTextAlign, "left", `editorial headline alignment at ${width}px`)
    if (width > 960) assert.ok(state.heroStage.left >= state.heroCopy.right + 16, `illustration belongs beside the headline at ${width}px`)
    else assert.ok(state.heroStage.top >= state.heroCopy.bottom + 20, `illustration belongs below the copy at ${width}px`)
    assert.ok(state.cls < 0.01, `initial layout shift ${state.cls} at ${width}px`)
    assert.ok(state.solution.includes("gradient"), `solutions band keeps a warm, tinted background at ${width}px`)
    assert.equal(state.heroPhotos, 5, `hero keeps four photographs plus the route map at ${width}px`)
    assert.equal(state.header, "sticky")
    const art = await page.$$eval('main img[src^="/home/"]', async images => {
      await Promise.all(images.map(async image => { image.loading = "eager"; await image.decode() }))
      return images.map(image => ({ width: image.naturalWidth, height: image.naturalHeight }))
    })
    assert.equal(art.length, 14)
    assert.ok(art.every(image => image.width > 0 && image.height > 0), `broken isometric art at ${width}px`)
    if (width <= 960) {
      const header = await page.evaluate(() => ({
        brand: document.querySelector('a[class*="brand"]')?.getBoundingClientRect().right,
        menu: document.querySelector('button[aria-controls="home-mobile-nav"]')?.getBoundingClientRect().toJSON(),
      }))
      assert.ok(header.menu.width >= 42 && header.menu.left >= header.brand + 8, `mobile menu target overlaps brand at ${width}px`)
      const toggle = page.locator('button[aria-controls="home-mobile-nav"]')
      await toggle.click()
      assert.equal(await page.$eval('button[aria-controls="home-mobile-nav"]', el => el.getAttribute("aria-expanded")), "true")
      await page.locator('nav[aria-label="Mobile navigation"] a[href="/en#the-gap"]').click()
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
  for (const width of [320, 390, 768, 881, 1024, 1440]) {
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
    const state = await page.evaluate(() => {
      const copy = document.querySelector('[class*="heroCopy"]').getBoundingClientRect()
      const art = document.querySelector('figure[class*="heroStage"]').getBoundingClientRect()
      const brand = document.querySelector('a[class*="brand"]').getBoundingClientRect()
      const menu = document.querySelector('button[aria-controls="home-mobile-nav"]').getBoundingClientRect()
      return { lang: document.documentElement.lang, h1: document.querySelector('h1')?.textContent,
        width: document.documentElement.scrollWidth, viewport: innerWidth, cls: window.__homeCLS || 0,
        align: getComputedStyle(document.querySelector('[class*="heroCopy"]')).textAlign,
        copyRight: copy.right, copyBottom: copy.bottom, artLeft: art.left, artTop: art.top,
        brandRight: brand.right, menuLeft: menu.left, menuWidth: menu.width,
        menuVisible: getComputedStyle(document.querySelector('button[aria-controls="home-mobile-nav"]')).display !== 'none',
      }
    })
    assert.equal(state.lang, "vi")
    assert.equal(await page.$('.zalo-chat-widget'), null, "Translated landing uses its own contact flow, not the service widget")
    assert.equal(state.h1, viHeading)
    assert.equal(state.width, state.viewport, `Vietnamese overflow at ${width}px`)
    assert.equal(state.align, "left")
    assert.ok(state.cls < .01, `Vietnamese layout shift at ${width}px`)
    if (width > 960) assert.ok(state.artLeft >= state.copyRight + 16)
    else assert.ok(state.artTop >= state.copyBottom + 20)
    if (width <= 960) assert.ok(state.menuVisible && state.menuWidth >= 42 && state.menuLeft >= state.brandRight + 8)
    const art = await page.$$eval('main img[src^="/home/"]', async images => {
      await Promise.all(images.map(async image => { image.loading = "eager"; await image.decode() }))
      return images.map(image => [image.naturalWidth, image.naturalHeight])
    })
    assert.equal(art.length, 14)
    assert.ok(art.every(([w, h]) => w > 0 && h > 0))
    assert.deepEqual(errors, [], `Vietnamese browser errors at ${width}px`)
    if (screenshots && [390, 1440].includes(width)) await page.screenshot({ path: path.join(screenshots, `homepage-vi-${width}.png`), fullPage: true })
    console.log(`PASS browser VI: ${width}px, no overflow, stable editorial hero, four SVGs, CLS=${state.cls.toFixed(4)}`)
    await page.close()
  }
  // Vietnamese is the default: the browser starts on the Vietnamese page and
  // the dropdown switches to /en and back, remembering each manual choice.
  const languagePage = await browser.newPage()
  await languagePage.setViewport({ width: 1440, height: 900 })
  await languagePage.goto(`${base}/`, { waitUntil: "networkidle2" })
  assert.equal(await languagePage.$eval('html', el => el.lang), 'vi')
  await languagePage.locator('[class*="desktopLanguage"] summary').click()
  assert.equal(await languagePage.$eval('[class*="desktopLanguage"]', el => el.open), true)
  await languagePage.keyboard.press('Escape')
  assert.equal(await languagePage.$eval('[class*="desktopLanguage"]', el => el.open), false)
  await languagePage.locator('[class*="desktopLanguage"] summary').click()
  await Promise.all([languagePage.waitForNavigation({ waitUntil: 'domcontentloaded' }), languagePage.locator('[class*="desktopLanguage"] a[lang="en"]').click()])
  assert.equal(new URL(languagePage.url()).pathname, '/en')
  assert.equal(await languagePage.$eval('html', el => el.lang), 'en')
  assert.equal(await languagePage.evaluate(() => document.cookie.includes('vexim_locale=en')), true, 'manual choice is remembered')
  await languagePage.setViewport({ width: 390, height: 844 })
  await languagePage.goto(`${base}/en/privacy`, { waitUntil: 'networkidle2' })
  await languagePage.locator('button[aria-controls="home-mobile-nav"]').click()
  await languagePage.locator('[class*="mobileLanguage"] summary').click()
  assert.equal(await languagePage.$eval('[class*="mobileLanguage"]', el => el.open), true)
  await Promise.all([languagePage.waitForNavigation({ waitUntil: 'domcontentloaded' }), languagePage.locator('[class*="mobileLanguage"] a[lang="vi"]').click()])
  assert.equal(new URL(languagePage.url()).pathname, '/privacy')
  assert.equal(await languagePage.$eval('html', el => el.lang), 'vi')
  await languagePage.close()
  console.log('PASS browser: desktop/mobile keyboard-accessible language dropdown, same-page locale links, preserved privacy context')

  const viAudit = await browser.newPage()
  await viAudit.setViewport({ width: 390, height: 844 })
  await viAudit.goto(`${base}/`, { waitUntil: 'networkidle2' })
  await viAudit.setRequestInterception(true)
  let viPosted, viStatus = 200
  viAudit.on('request', request => {
    if (request.url().endsWith('/api/digital-audit')) {
      viPosted = JSON.parse(request.postData())
      void request.respond({ status: viStatus, contentType: 'application/json', body: viStatus === 200 ? '{"success":true}' : '{"error":"Online submission is unavailable."}' })
    } else void request.continue()
  })
  await viAudit.locator('button[class*="heroPrimary"]').click()
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
  await viAudit.locator('button[class*="tierButtonFeatured"]').click()
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
  await page.goto(`${base}/en`, { waitUntil: "networkidle2" })
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
