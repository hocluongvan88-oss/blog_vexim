// No registration is submitted. Clicks are prevented only in the analytics assertions.
import assert from "node:assert/strict"
import { mkdirSync } from "node:fs"
import puppeteer from "puppeteer-core"
import { loadSchemaBuilders } from "./schema-loader.mjs"

const base = process.env.SCHEMA_TEST_BASE_URL || "http://127.0.0.1:3000"
const executablePath = process.env.BROWSER_EXECUTABLE_PATH
assert.ok(executablePath, "Set BROWSER_EXECUTABLE_PATH to a local Chromium executable")
const screenshots = process.env.TRADE_SCREENSHOT_DIR
if (screenshots) mkdirSync(screenshots, { recursive: true })
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})
try {
  const page = await browser.newPage(),
    errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
  await page.evaluateOnNewDocument(() => {
    window.__events = []
    window.gtag = (...args) => window.__events.push(args)
  })
  for (const width of [320, 360, 390, 639, 640, 768, 1023, 1024, 1440, 1920]) {
    await page.setViewport({ width, height: 900 })
    const requests = []
    const record = (request) => requests.push(request.url())
    page.on("request", record)
    await page.goto(`${base}/services/export-sales?utm_source=zalo&utm_campaign=trade`, {
      waitUntil: "networkidle0",
    })
    await page.evaluate(() => document.fonts.ready)
    page.off("request", record)
    const geometry = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      headerHeight: document.querySelector("header").getBoundingClientRect().height,
      columns: getComputedStyle(document.querySelector(".feature-grid")).gridTemplateColumns.split(" ")
        .length,
      categories: getComputedStyle(document.querySelector("#danh-muc .grid-3")).gridTemplateColumns.split(" ")
        .length,
      heroColumns: getComputedStyle(document.querySelector(".hero-grid")).gridTemplateColumns.split(" ")
        .length,
      buttons: [...document.querySelectorAll("[data-register]")].map((el) => ({
        url: el.href,
        height: el.getBoundingClientRect().height,
      })),
      font: document.fonts.check('700 34px "Be Vietnam Pro"'),
    }))
    assert.equal(geometry.overflow, false, `overflow at ${width}`)
    assert.ok(geometry.headerHeight <= 72)
    assert.equal(geometry.columns, width < 640 ? 1 : width < 1024 ? 2 : 4)
    assert.equal(geometry.categories, width < 640 ? 1 : width < 1024 ? 2 : 3)
    assert.equal(geometry.heroColumns, width < 1024 ? 1 : 2)
    assert.ok(geometry.font)
    geometry.buttons.forEach((button) => {
      assert.ok(button.height >= 48)
      const url = new URL(button.url)
      assert.equal(url.origin, "https://veximtrade.com")
      assert.equal(url.pathname, "/supplier/register")
      assert.equal(url.searchParams.get("utm_source"), "zalo")
    })
    assert.ok(
      !requests.some((url) => /fonts\.google|fonts\.gstatic|_next\/|api\/|analytics\.google/.test(url)),
    )
    assert.ok(
      requests
        .filter((url) => url.endsWith(".js"))
        .every((url) => /\/trade\/trade\.[a-f0-9]+\.js$/.test(url)),
    )
    if (screenshots && [390, 1440].includes(width)) {
      await page.screenshot({ path: `${screenshots}/${width}-hero.png` })
      await page.screenshot({ path: `${screenshots}/${width}-full.png`, fullPage: true })
    }
  }
  await page.setViewport({ width: 390, height: 844 })
  await page.goto(`${base}/services/export-sales?utm_source=zalo`, { waitUntil: "networkidle0" })
  await page.keyboard.press("Tab")
  assert.equal(await page.evaluate(() => document.activeElement.textContent), "Bỏ qua đến nội dung chính")
  await page.keyboard.press("Enter")
  assert.equal(await page.evaluate(() => document.activeElement.id), "noi-dung-chinh")
  await page.evaluate(() => window.scrollTo(0, 0))
  const menu = "#mobile-menu summary"
  await page.focus(menu)
  await page.keyboard.press("Enter")
  await page.waitForFunction(() => document.querySelector("#mobile-menu").open)
  assert.equal(await page.$eval(menu, (el) => el.getAttribute("aria-expanded")), "true")
  await page.click('#mobile-nav a[href="#xac-minh"]')
  await page.waitForFunction(() => !document.querySelector("#mobile-menu").open)
  assert.ok((await page.$eval("#xac-minh", (el) => el.getBoundingClientRect().top)) >= 68)
  assert.equal(await page.$eval("header", (el) => el.getBoundingClientRect().top), 0)
  await page.click(menu)
  await page.keyboard.press("Escape")
  await page.waitForFunction(() => !document.querySelector("#mobile-menu").open)
  assert.equal(await page.evaluate(() => document.activeElement.tagName), "SUMMARY")
  assert.equal(await page.$eval(".illustrated-rfq", (el) => el.tabIndex), -1)
  // Keep the actual href intact, but do not navigate to or create a real registration.
  await page.evaluate(() =>
    document.addEventListener(
      "click",
      (event) => {
        if (event.target.closest("a[data-register]")) event.preventDefault()
      },
      true,
    ),
  )
  for (const position of ["header", "hero", "footer_cta"]) {
    const selector = `[data-register][data-position="${position}"]`
    await page.$eval(selector, (el) => el.scrollIntoView({ block: "center", behavior: "instant" }))
    await page.click(selector)
  }
  await page.$eval("[data-learn]", (el) => el.scrollIntoView({ block: "center", behavior: "instant" }))
  await page.click("[data-learn]")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForFunction(() =>
    window.__events.some((args) => args[1] === "scroll_depth" && args[2].percent === 90),
  )
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  const events = await page.evaluate(() => window.__events)
  assert.deepEqual(
    events.filter((args) => args[1] === "cta_register_click").map((args) => args[2].position),
    ["header", "hero", "footer_cta"],
  )
  assert.equal(events.filter((args) => args[1] === "cta_learn_click").length, 1)
  assert.deepEqual(
    events
      .filter((args) => args[1] === "scroll_depth")
      .map((args) => args[2].percent)
      .sort(),
    [50, 90],
  )
  for (const [command, name, params] of events) {
    assert.equal(command, "event")
    assert.ok(["cta_register_click", "cta_learn_click", "scroll_depth"].includes(name))
    assert.ok(Object.keys(params || {}).every((key) => ["position", "percent"].includes(key)))
  }
  // Native details menu and all text/real registration links still work without JS.
  const nojs = await browser.newPage()
  await nojs.setJavaScriptEnabled(false)
  await nojs.setViewport({ width: 320, height: 844 })
  await nojs.goto(`${base}/services/export-sales?utm_source=email`, { waitUntil: "networkidle0" })
  assert.ok((await nojs.$eval("main", (el) => el.textContent)).includes("Ba bước, mỗi bước duyệt riêng"))
  await nojs.click("#mobile-menu summary")
  assert.ok(await nojs.$eval("#mobile-menu", (el) => el.open))
  assert.equal(await nojs.$$eval("[data-register]", (els) => els.length), 3)
  assert.ok(
    await nojs.$$eval("[data-register]", (els) =>
      els.every((el) => new URL(el.href).searchParams.get("utm_source") === "email"),
    ),
  )
  // The homepage card must use a full document navigation, not request this HTML as an RSC payload.
  await page.goto(base, { waitUntil: "domcontentloaded" })
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" })
  await page.$eval('#services h3 a[href="/services/export-sales"]', (el) =>
    el.scrollIntoView({ block: "center", behavior: "instant" }),
  )
  await page.click('#services h3 a[href="/services/export-sales"]')
  await page.waitForFunction(() => location.pathname === "/services/export-sales")
  assert.equal(await page.$$("script[src*='_next/']").then((els) => els.length), 0)
  // Exercise the existing Vercel SDK contract and its after-paint loader without a real collector.
  const loader = loadSchemaBuilders()
  try {
    const productionHtml = loader.trade.renderTradePage({ analytics: true })
    const vercel = await browser.newPage()
    let collectorScripts = 0
    await vercel.evaluateOnNewDocument(() => {
      window.__vaEvents = []
      window.va = (...args) => window.__vaEvents.push(args)
    })
    await vercel.setRequestInterception(true)
    vercel.on("request", (request) => {
      const path = new URL(request.url()).pathname
      if (path === "/services/export-sales" && request.isNavigationRequest())
        return request.respond({ status: 200, contentType: "text/html", body: productionHtml })
      if (path === "/_vercel/insights/script.js") {
        collectorScripts++
        return request.respond({
          status: 200,
          contentType: "application/javascript",
          body: "window.__insightsLoaded = true",
        })
      }
      return request.continue()
    })
    await vercel.goto(`${base}/services/export-sales`, { waitUntil: "networkidle0" })
    await vercel.waitForFunction(() => window.__insightsLoaded === true)
    await vercel.evaluate(() =>
      document.addEventListener(
        "click",
        (event) => {
          if (event.target.closest("a[data-register]")) event.preventDefault()
        },
        true,
      ),
    )
    await vercel.$eval('[data-position="hero"]', (el) => el.click())
    assert.equal(collectorScripts, 1)
    const recorded = await vercel.evaluate(() =>
      window.__vaEvents.find((args) => args[0] === "event" && args[1].name === "cta_register_click"),
    )
    assert.deepEqual(recorded, ["event", { name: "cta_register_click", data: { position: "hero" } }])
    await vercel.close()
  } finally {
    loader.cleanup()
  }
  assert.deepEqual(errors, [])
  console.log(
    "PASS: 320–1920px/no overflow; correct breakpoints; self-hosted fonts/no framework JS; sticky/keyboard/native menu/no-JS; UTMs; 3 CTA events and deduplicated private scroll events; real homepage document navigation",
  )
} finally {
  await browser.close()
}
