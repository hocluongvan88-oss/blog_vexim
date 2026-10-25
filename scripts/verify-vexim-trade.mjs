import assert from "node:assert/strict"
import { readFileSync, writeFileSync, statSync, readdirSync } from "node:fs"
import { createHash } from "node:crypto"
import { gzipSync } from "node:zlib"
import { load } from "cheerio"
import { loadSchemaBuilders } from "./schema-loader.mjs"

const { trade: T, builders: B, profile: P, cleanup } = loadSchemaBuilders()
const normalize = (value) => JSON.parse(JSON.stringify(value))
try {
  const html = T.renderTradePage()
  const $ = load(html)
  const schema = normalize(T.buildTradePageSchema())
  if (process.argv.includes("--export"))
    writeFileSync("docs/seo/vexim-trade-schema.json", JSON.stringify(schema, null, 2) + "\n")
  assert.deepEqual(JSON.parse(readFileSync("docs/seo/vexim-trade-schema.json", "utf8")), schema)
  // Independent editorial fixture: changing implementation constants alone cannot
  // silently rewrite the owner's approved October 25 copy.
  const approved = JSON.parse(readFileSync("docs/vexim-trade-copy-2026-10-25.json", "utf8"))
  assert.equal($("title").text(), approved.head.title)
  assert.equal($("meta[name=description]").attr("content"), approved.head.description)
  assert.equal($("meta[property='og:description']").attr("content"), approved.head.ogDescription)
  assert.equal($("meta[property='og:image:alt']").attr("content"), approved.head.ogAlt)
  for (const [selector, expected] of Object.entries(approved.selectors)) {
    const actual = $(selector).toArray().map((el) => {
      const clone = $(el).clone()
      clone.find("br").replaceWith(" ")
      return clone.text().replace(/\s+/g, " ").trim()
    })
    assert.deepEqual(actual, expected, `Approved copy: ${selector}`)
  }
  assert.ok($("address").text().includes("Số 25/6/51 Ngoạ Long, Tây Tựu"))
  assert.ok(!$("body").text().includes("số chỗ có hạn"), "Old scarcity copy removed")
  assert.equal($("html").attr("lang"), "vi")
  assert.equal($("h1").length, 1)
  assert.equal($("h1").text(), T.TRADE.h1)
  assert.equal($("title").text(), T.TRADE.title)
  assert.ok(T.TRADE.title.length <= 60)
  assert.ok(T.TRADE.description.length >= 140 && T.TRADE.description.length <= 160)
  assert.equal($("meta[name=description]").attr("content"), T.TRADE.description)
  assert.equal($("link[rel=canonical]").attr("href"), P.SITE_URL + T.TRADE.path)
  assert.equal($("head script[type='application/ld+json']").length, 1)
  assert.equal($("script[type='application/ld+json']").length, 1)
  assert.equal($("body > :first-child").attr("href"), "#noi-dung-chinh")
  assert.equal($("main > section").length, 7)
  assert.equal($("header").length, 1)
  assert.equal($("footer").length, 1)
  assert.equal($("form").length, 0)
  assert.equal($("[data-register]").length, 3)
  assert.deepEqual(
    $("[data-register]")
      .toArray()
      .map((el) => $(el).attr("data-position")),
    ["header", "hero", "footer_cta"],
  )
  assert.ok(
    $("[data-register]")
      .toArray()
      .every((el) => el.tagName === "a" && $(el).attr("href") === T.TRADE.register),
  )
  const headings = $("h1,h2,h3")
    .toArray()
    .map((el) => Number(el.tagName.slice(1)))
  assert.ok(headings.every((level, i) => !i || level <= headings[i - 1] + 1))
  assert.equal($(".hero-description").text().replace(/\s+/g, " "), T.TRADE.hero)
  assert.equal($("figure figcaption").text(), "Hồ sơ minh họa")
  assert.equal($(".illustrated-rfq").get(0).tagName, "span")
  assert.equal($(".illustrated-rfq").attr("tabindex"), undefined)
  assert.equal($("#xac-minh ol > li").length, 3)
  assert.equal($("#dang-ky ol > li").length, 4)
  assert.ok(
    $(".step-number")
      .toArray()
      .every((el) => $(el).attr("aria-hidden") === "true"),
  )
  assert.equal($(".closing-title").get(0).tagName, "p")
  assert.ok(
    $("#xac-minh")
      .text()
      .includes("Vexim Trade xác minh nhà cung cấp, không chứng nhận chất lượng sản phẩm."),
  )
  assert.ok(
    !/Không bán thứ hạng|aggregateRating|"review"|priceCurrency|Phòng Sale Xuất Khẩu|__next_f|fonts.googleapis.com|fonts.gstatic.com/.test(
      html,
    ),
  )
  assert.equal($(".commitments li").length, 2)
  assert.equal($("link[rel=preload][as=font]").length, 1)
  assert.equal($("link[rel=preload][as=font]").attr("href"), T.TRADE_PRELOAD_FONT)
  const fontFiles = readdirSync("public/trade/fonts").filter((name) => name.endsWith(".woff2"))
  assert.equal(fontFiles.length, 1, "One complete Latin/Vietnamese variable font")
  for (const font of fontFiles) {
    assert.match(font, /^inter-vietnamese-latin-variable\.[a-f0-9]{10}\.woff2$/)
    const bytes = readFileSync(`public/trade/fonts/${font}`)
    assert.equal(bytes.toString("ascii", 0, 4), "wOF2")
    assert.ok(font.includes(createHash("sha256").update(bytes).digest("hex").slice(0, 10)))
    assert.ok(T.TRADE_FONT_CSS.includes(`/trade/fonts/${font}`))
  }
  assert.match(T.TRADE_FONT_CSS, /font-family:\s*"Inter"/)
  assert.match(T.TRADE_FONT_CSS, /font-weight:\s*100 900/)
  assert.match(T.TRADE_FONT_CSS, /font-display:\s*swap/)
  const ranges = T.TRADE_FONT_CSS.match(/unicode-range:\s*([^;]+);/)[1]
    .split(",")
    .map((range) => {
      const [start, end = start] = range.trim().replace(/^U\+/, "").split("-")
      return [parseInt(start, 16), parseInt(end, 16)]
    })
  // Guard against the previous Latin-ext-as-Latin declaration: ASCII and all
  // Vietnamese letters/combining marks must be eligible for this same font.
  for (const text of [$("body").text(), $("body").text().normalize("NFD")]) {
    for (const character of text) {
      const code = character.codePointAt(0)
      assert.ok(
        ranges.some(([start, end]) => code >= start && code <= end),
        `Missing font Unicode coverage U+${code.toString(16).toUpperCase()}`,
      )
    }
  }
  const script = $("script[src]").attr("src")
  assert.equal($("script[src]").length, 1)
  const scriptBytes = readFileSync(`public${script}`)
  assert.ok(script.includes(createHash("sha256").update(scriptBytes).digest("hex").slice(0, 10)))
  assert.equal(
    load(T.renderTradePage({ analytics: true }))("script[data-vercel-analytics]").attr(
      "data-vercel-analytics",
    ),
    "true",
  )
  const tokens = Object.fromEntries(
    [
      ...$("style")
        .text()
        .matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi),
    ].map((match) => [match[1], match[2]]),
  )
  const luminance = (hex) => {
    const channels = [1, 3, 5]
      .map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  }
  for (const [foreground, background] of [
    ["ink", "bg"],
    ["text-2", "bg"],
    ["text-3", "bg"],
    ["text-3", "bg-soft"],
    ["primary", "bg"],
    ["primary", "bg-soft"],
    ["eyebrow", "bg"],
    ["eyebrow", "bg-soft"],
    ["eyebrow-dark", "ink"],
    ["bg-soft", "ink"],
    ["bg", "primary"],
    ["bg", "primary-hover"],
  ]) {
    const a = luminance(tokens[foreground]),
      b = luminance(tokens[background])
    assert.ok(
      (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5,
      `${foreground}/${background} contrast`,
    )
  }

  assert.ok(gzipSync(scriptBytes).byteLength < 50000)
  assert.ok(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest/.test(scriptBytes.toString()))
  const weight =
    gzipSync(Buffer.from(html)).byteLength +
    gzipSync(scriptBytes).byteLength +
    fontFiles.reduce((sum, f) => sum + statSync(`public/trade/fonts/${f}`).size, 0)
  const imageFiles = readdirSync("public/trade/images").filter((name) => name.endsWith(".webp"))
  let imageBytes = 0
  for (const file of imageFiles) {
    const data = readFileSync(`public/trade/images/${file}`)
    assert.equal(data.toString("ascii", 0, 4), "RIFF")
    assert.equal(data.toString("ascii", 8, 12), "WEBP")
    assert.ok(file.includes(createHash("sha256").update(data).digest("hex").slice(0, 10)))
    assert.ok(data.byteLength < 60000)
    imageBytes += data.byteLength
  }
  assert.ok(imageFiles.length >= 8)
  assert.ok(weight + imageBytes < 500000)
  assert.ok($("img").length >= 5)
  assert.ok(
    $("img:not(.brand-mark)")
      .toArray()
      .every(
        (el) =>
          $(el).attr("src").endsWith(".webp") &&
          $(el).attr("width") &&
          $(el).attr("height") &&
          $(el).attr("loading") === "lazy" &&
          $(el).attr("alt"),
      ),
  )
  assert.equal($("img.brand-mark").length, 3, "Vexim mark in header, profile and footer")
  assert.ok(
    $("img.brand-mark").toArray().every((el) =>
      $(el).attr("src") === T.TRADE_MARK && $(el).attr("alt") === "" &&
      $(el).attr("aria-hidden") === "true" && $(el).attr("width") && $(el).attr("height")),
  )
  assert.ok(!html.includes('d="M7 9c9 0 14 5 14 16'), "No placeholder leaf in the page")
  assert.ok(readFileSync("public/trade/logo.svg", "utf8").includes("data:image/png;base64,"))
  assert.equal($("link[rel=icon]").attr("href"), "/trade/logo.svg?v=vexim")
  assert.equal($("link[rel=apple-touch-icon]").attr("href"), "/trade/apple-touch-icon.png?v=vexim")
  assert.ok(weight < 500000)
  const png = readFileSync("public/trade/og-nha-cung-cap.png")
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10])
  assert.equal(png.readUInt32BE(16), 1200)
  assert.equal(png.readUInt32BE(20), 630)
  assert.ok(png.byteLength < 300000)
  const definitions = new Map(),
    refs = []
  function visit(value) {
    if (!value || typeof value !== "object") return
    if (Array.isArray(value)) return value.forEach(visit)
    if (value["@id"]) {
      if (Object.keys(value).length === 1) refs.push(value["@id"])
      else {
        assert.ok(!definitions.has(value["@id"]))
        definitions.set(value["@id"], value)
      }
    }
    Object.values(value).forEach(visit)
  }
  visit(schema)
  refs.forEach((ref) => assert.ok(definitions.has(ref), `Unresolved schema ID: ${ref}`))
  assert.deepEqual(
    definitions.get(P.serviceId("export-sales")),
    normalize(B.buildServiceNode(P.getService("export-sales"))),
  )
  const organization = definitions.get(T.TRADE.organizationId)
  assert.ok($("address").text().includes(T.TRADE.legalName))
  for (const field of ["streetAddress", "addressLocality", "addressRegion"])
    assert.ok($("address").text().includes(organization.address[field]))
  assert.equal($("address a[href^='tel:']").text(), organization.contactPoint.telephone)
  assert.equal($("address a[href^='mailto:']").text(), organization.contactPoint.email)
  const catalog = definitions
    .get(P.serviceId("export-sales"))
    .hasOfferCatalog.itemListElement.map((item) => item.name)
  assert.deepEqual(
    catalog,
    T.TRADE_CATEGORIES.map((category) => category.name),
  )
  assert.equal($("#danh-muc article:not(.category-other)").length, catalog.length)
  assert.equal($("#danh-muc article.category-other").length, 1)
  assert.ok(!catalog.includes("Ngành hàng khác"), "Consultation is not an invented product category")
  assert.equal($("#danh-muc h3 a").length, 0, "No category URLs have been confirmed")
  for (const category of T.TRADE_CATEGORIES)
    assert.ok($("#danh-muc h3").text().includes(category.exportTitle))
  for (const invalid of ["javascript:alert(1)", "https://evil.example/", "https://[bad]"]) {
    T.TRADE_CATEGORIES[0].href = invalid
    assert.equal(load(T.renderTradePage())("#danh-muc h3 a").length, 0)
  }
  delete T.TRADE_CATEGORIES[0].href
  // Opening another category changes the UI/count/copy/schema from configuration alone.
  T.TRADE_CATEGORIES.push({
    key: "test-new",
    name: "Danh mục thử",
    exportTitle: "Danh mục mới",
    text: "Chỉ dùng trong test",
    specs: "Thông tin mới",
  })
  const expanded = load(T.renderTradePage())
  assert.equal(expanded("#danh-muc article").length, 5)
  assert.equal(expanded("#danh-muc h2").text(), "Mỗi ngành hàng, một bộ hồ sơ đúng chuẩn")
  assert.ok(expanded(".hero-note").text().includes("Đang mở 4 danh mục"))
  assert.ok(expanded("meta[property='og:description']").attr("content").includes("danh mục thử"))
  T.TRADE_CATEGORIES.pop()
  const utms = new URLSearchParams({
    utm_source: "zalo",
    utm_campaign: '<script>alert("test")</script>',
    email: "not-forwarded@example.com",
    next: "https://bad.example",
  })
  const attributed = load(T.renderTradePage({ params: utms }))
  attributed("[data-register]").each((_, el) => {
    const url = new URL(attributed(el).attr("href"))
    assert.equal(url.origin, "https://veximtrade.com")
    assert.equal(url.pathname, "/supplier/register")
    assert.equal(url.searchParams.get("utm_source"), "zalo")
    assert.equal(url.searchParams.get("utm_campaign"), utms.get("utm_campaign"))
    assert.equal(url.searchParams.has("email"), false)
    assert.equal(url.searchParams.has("next"), false)
  })
  assert.ok(
    load(T.renderTradePage({ noindex: true }))("meta[name=robots]")
      .attr("content")
      .includes("noindex"),
  )
  assert.equal($("meta[name=robots]").attr("content"), "index, follow, max-image-preview:large")
  console.log(
    `PASS: SSR/no hydration; approved October 25 copy/head/hero; 9 blocks; semantics; accessible illustration; 3 register links; UTM allowlist; private fixed events; ${Math.round((weight + imageBytes) / 1024)} KiB worst-case asset budget including all WebP variants; fonts/OG; complete linked schema and catalog parity`,
  )
  const base = process.env.SCHEMA_TEST_BASE_URL
  if (base) {
    const response = await fetch(`${base}${T.TRADE.path}?utm_source=zalo`)
    assert.equal(response.status, 200)
    assert.ok(response.headers.get("cache-control").includes("max-age=600"))
    const live = load(await response.text())
    assert.equal(live("h1").text(), T.TRADE.h1)
    assert.deepEqual(JSON.parse(live("script[type='application/ld+json']").html()), schema)
    assert.ok(
      live("[data-register]")
        .toArray()
        .every((el) => new URL(live(el).attr("href")).searchParams.get("utm_source") === "zalo"),
    )
    const capital = await fetch(`${base}/SERVICES/EXPORT-SALES?utm_source=test`, { redirect: "manual" })
    assert.equal(capital.status, 301)
    assert.equal(new URL(capital.headers.get("location"), base).pathname, T.TRADE.path)
    const legacyLabel = await fetch(`${base}/services/fda-label-check`, { redirect: "manual" })
    assert.equal(legacyLabel.status, 308)
    assert.equal(legacyLabel.headers.get("location"), "/services/food/label-compliance")
    const home = load(await (await fetch(base)).text())
    assert.ok(home('#services a[href="/services/export-sales"]').text().includes("Vexim Trade"))
    assert.equal(
      home('#services img[alt="Vexim Trade — Vexim Global"]').attr("src"),
      T.TRADE_IMAGES.service.src,
    )
    const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
    assert.ok(sitemap.includes(`${P.SITE_URL}${T.TRADE.path}`))
    assert.ok(sitemap.includes("2026-10-24T17:00:00.000Z"))
    for (const path of [
      script,
      $("link[rel=preload]").attr("href"),
      "/trade/og-nha-cung-cap.png",
      "/trade/apple-touch-icon.png",
      "/trade/logo.svg",
      T.TRADE_IMAGES.service.src,
      T.TRADE_MARK,
    ])
      assert.equal((await fetch(base + path)).status, 200, path)
    assert.ok(!(await (await fetch(`${base}/robots.txt`)).text()).includes("Disallow: /trade"))
    console.log(
      "PASS: actual route, UTM SSR, 301 uppercase, homepage card/artwork, assets, sitemap content timestamp and robots",
    )
  }
} finally {
  cleanup()
}
