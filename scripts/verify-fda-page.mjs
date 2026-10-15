import assert from "node:assert/strict"
import { existsSync, readFileSync, statSync } from "node:fs"
import { load } from "cheerio"
import { loadSchemaBuilders } from "./schema-loader.mjs"

const { builders: B, profile: P, fdaContent: C, cleanup } = loadSchemaBuilders()
const normalize = (value) => JSON.parse(JSON.stringify(value))
try {
  const data = normalize({
    "@context": "https://schema.org",
    "@graph": [...B.buildSiteSchema()["@graph"], ...B.buildFdaPageSchema()["@graph"]],
  })
  const definitions = new Map(),
    refs = []
  function walk(value) {
    if (Array.isArray(value)) return value.forEach(walk)
    if (!value || typeof value !== "object") return
    if (value["@id"]) {
      if (Object.keys(value).length > 1) {
        assert.ok(!definitions.has(value["@id"]), `Duplicate @id ${value["@id"]}`)
        definitions.set(value["@id"], value)
      } else refs.push(value["@id"])
    }
    Object.values(value).forEach(walk)
  }
  walk(data)
  refs.forEach((ref) => assert.ok(definitions.has(ref), `Unresolved ${ref}`))
  const service = definitions.get(P.serviceId("fda-registration"))
  assert.equal(service.provider["@id"], P.ORGANIZATION_ID)
  assert.equal(service.url, `${P.SITE_URL}${C.FDA_PAGE.path}`)
  assert.ok(service.description.includes("01/10 đến 31/12 năm chẵn"))
  assert.ok(!service.description.includes("gia hạn định kỳ 2 năm"))
  const faq = definitions.get(`${P.SITE_URL}${C.FDA_PAGE.path}#faq`)
  assert.deepEqual(
    faq.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]),
    C.FDA_FAQS.map((q) => [q.question, q.answer]),
  )
  assert.equal(faq.mainEntity.length, 8)
  assert.equal(C.FDA_LIBRA_CASE.company, "CÔNG TY TNHH LIBRA VIỆT NAM")
  assert.ok(!JSON.stringify(C.FDA_LIBRA_CASE).includes("Cổ phần"))
  assert.deepEqual(JSON.parse(readFileSync("docs/seo/fda-schema.json", "utf8")), data)
  assert.ok(C.FDA_PAGE.title.length <= 60)
  assert.ok(C.FDA_PAGE.description.length <= 165)
  const og = readFileSync(`public${C.FDA_PAGE.image}`)
  assert.equal(og.subarray(0, 8).toString("hex"), "89504e470d0a1a0a")
  assert.equal(og.readUInt32BE(16), 1200)
  assert.equal(og.readUInt32BE(20), 630)
  assert.ok(statSync(`public${C.FDA_PAGE.image}`).size < 300_000)
  console.log(
    "PASS: metadata lengths; real 1200×630 OG <300KB; schema export, all references, 8 FAQ answers and TNHH company name",
  )

  const base = process.env.SCHEMA_TEST_BASE_URL
  if (!base) {
    console.log("Set SCHEMA_TEST_BASE_URL to run SSR integration checks.")
    process.exitCode = 0
  } else {
    const response = await fetch(`${base}${C.FDA_PAGE.path}`)
    assert.equal(response.status, 200)
    assert.ok(!/noindex|nosnippet/i.test(response.headers.get("x-robots-tag") || ""))
    const $ = load(await response.text())
    const robots = $('meta[name="robots"]').attr("content") || ""
    const googlebot = $('meta[name="googlebot"]').attr("content") || ""
    assert.ok(/\bindex\b/.test(robots) && /\bfollow\b/.test(robots))
    assert.ok(!/noindex|nosnippet|max-snippet\s*:\s*0(?:\D|$)/i.test(`${robots} ${googlebot}`))
    const sitemap = await fetch(`${base}/sitemap.xml`)
    assert.equal(sitemap.status, 200)
    assert.ok(
      load(await sitemap.text(), { xmlMode: true })("url > loc")
        .toArray()
        .some((el) => el.children?.[0]?.data === `${P.SITE_URL}${C.FDA_PAGE.path}`),
      "FDA canonical must appear in sitemap",
    )
    const robotsResponse = await fetch(`${base}/robots.txt`)
    assert.equal(robotsResponse.status, 200)
    const robotsText = await robotsResponse.text()
    assert.ok(robotsText.includes(`Sitemap: ${P.SITE_URL}/sitemap.xml`))
    assert.ok(!/^Disallow:\s*\/services(?:\/fda)?\/?\s*$/im.test(robotsText), "Do not block FDA crawling")
    assert.equal($("html").attr("lang"), "vi")
    assert.equal($("h1").length, 1)
    assert.equal($("h1").text().trim(), "Dịch vụ đăng ký FDA Vững bước vào thị trường Mỹ")
    assert.equal($("title").text(), C.FDA_PAGE.title)
    assert.equal($('meta[name="description"]').attr("content"), C.FDA_PAGE.description)
    assert.equal($('link[rel="canonical"]').attr("href"), `${P.SITE_URL}${C.FDA_PAGE.path}`)
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]'])
      assert.equal($(selector).attr("content"), C.FDA_PAGE.title)
    for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]'])
      assert.equal($(selector).attr("content"), C.FDA_PAGE.description)
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]'])
      assert.equal($(selector).attr("content"), `${P.SITE_URL}${C.FDA_PAGE.image}`)
    assert.equal($('meta[property="og:locale"]').attr("content"), "vi_VN")
    assert.equal($('meta[name="twitter:card"]').attr("content"), "summary_large_image")
    assert.equal($("main").length, 1)
    assert.equal($("main footer, main header").length, 0)
    const nodes = $('script[type="application/ld+json"]')
      .toArray()
      .flatMap((el) => {
        const block = JSON.parse($(el).html())
        assert.equal(block["@context"], "https://schema.org")
        return block["@graph"] ?? [block]
      })
    assert.deepEqual(nodes, data["@graph"])
    const visibleFaq = $("#faq details")
      .toArray()
      .map((el) => [$(el).find("summary").text(), $(el).find("p").text()])
    assert.deepEqual(
      visibleFaq,
      C.FDA_FAQS.map((q) => [q.question, q.answer]),
    )
    const sectionIds = $("main > section")
      .map((_, el) => $(el).attr("id"))
      .get()
    assert.deepEqual(sectionIds, [
      "fda-hero",
      "problems",
      "why-vexim",
      "comparison",
      "process",
      "documents",
      "case-studies",
      "partners",
      "fda-contact",
      "faq",
    ])
    assert.equal($('[data-testid="fda-lead-form"]').length, 2)
    assert.equal($('#fda-hero [data-form-location="hero"]').length, 1)
    assert.equal($('#fda-contact [data-form-location="contact"]').length, 1)
    assert.equal($("#fda-hero img").length, 1)
    assert.ok(existsSync(`public${C.FDA_HERO_IMAGE}`))
    const heroSrc = $("#fda-hero img").attr("src")
    assert.ok(heroSrc.includes(C.FDA_HERO_IMAGE) || heroSrc.includes(encodeURIComponent(C.FDA_HERO_IMAGE)))
    assert.ok($('a[href="#fda-contact"]').length >= 4)
    assert.equal($("#problems h2").text(), "Những doanh nghiệp nào cần đăng ký FDA?")
    assert.equal($("#problems article").length, 6)
    assert.deepEqual(
      $("#problems article")
        .toArray()
        .map((el) => [$(el).find("h3").text(), $(el).find("p").last().text()]),
      C.FDA_BUSINESS_TYPES.map((item) => [item.title, item.requirement]),
    )
    assert.ok(!$("#problems").text().includes("Bạn gặp phải những vấn đề"))
    assert.equal($("#comparison tbody tr").length, 6)
    assert.equal($("#process ol > li").length, 5)
    assert.equal($("#documents article").length, 2)
    assert.equal($("#case-libra article").length, 4)
    assert.equal(
      $("#partners img").length,
      C.FDA_PARTNERS.filter((partner) => C.FDA_LANDING_MEDIA[partner.media]).length,
      "Render every configured partner logo",
    )
    assert.equal($("#faq details").length, 8)
    for (const form of $('[data-testid="fda-lead-form"]').toArray()) {
      for (const name of ["name", "phone", "email", "product"])
        assert.ok($(form).find(`[name="${name}"]`).is("[required]"))
      assert.equal($(form).find('button[type="submit"]').length, 1)
    }
    assert.ok($('#fda-contact input[name="company"]').is("[required]"))
    assert.equal($("#fda-contact textarea").attr("maxlength"), "500")
    for (const source of C.FDA_SOURCES) assert.equal($(`main a[href="${source.url}"]`).length, 1)
    const ids = $("[id]")
      .map((_, el) => $(el).attr("id"))
      .get()
    assert.equal(ids.length, new Set(ids).size, "Form labels and controls need distinct IDs")
    $('main a[href^="#"]').each((_, el) =>
      assert.ok(ids.includes($(el).attr("href").slice(1)), `Missing anchor target ${$(el).attr("href")}`),
    )
    assert.equal(
      $("#case-libra img").length,
      C.FDA_LIBRA_STEPS.filter((step) => C.FDA_LANDING_MEDIA[step.media]).length,
      "Render only configured case images",
    )
    assert.equal(
      $("#documents img").length,
      ["registration", "certificate"].filter((key) => C.FDA_LANDING_MEDIA[key]).length,
    )
    for (const [key, path] of Object.entries(C.FDA_LANDING_MEDIA)) {
      if (!path) continue
      assert.ok(existsSync(`public${path}`), `Missing configured media: ${key}`)
      const bytes = readFileSync(`public${path}`)
      if (path.endsWith(".webp")) {
        assert.equal(bytes.toString("ascii", 0, 4), "RIFF", `Wrong image format: ${path}`)
        assert.equal(bytes.toString("ascii", 8, 12), "WEBP", `Wrong image format: ${path}`)
      }
      if (path.endsWith(".png"))
        assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", `Wrong image format: ${path}`)
      const image = $(`main img[src="${path}"]`)
      assert.equal(image.length, 1, `Configured media not rendered exactly once: ${key}`)
      assert.ok(image.attr("alt"), `Missing alternative text: ${key}`)
      assert.equal((await fetch(`${base}${path}`)).status, 200, `Media URL: ${path}`)
      if (!key.startsWith("partner"))
        assert.equal(image.closest("a").attr("href"), path, "Documents/case images must open their full-size image")
    }
    assert.ok(!$("#documents, #case-libra").text().includes("Ảnh sẽ được bổ sung"))
    assert.ok($("#case-libra").text().includes(C.FDA_LIBRA_CASE.company))
    const mainText = $("main").text()
    assert.ok(!/20\s*%|98%|99%|500\+|10\+|1-31\/10|chính xác 100%/.test(mainText))
    assert.equal($("img").filter((_, el) => $(el).attr("alt") === undefined).length, 0)
    $('img[src^="/"]').each((_, el) =>
      assert.ok(existsSync(`public${$(el).attr("src")}`), `Missing image ${$(el).attr("src")}`),
    )
    const internal = [
      ...new Set(
        $('main a[href^="/"]')
          .map((_, el) => $(el).attr("href"))
          .get(),
      ),
    ]
    for (const path of internal) assert.equal((await fetch(`${base}${path}`)).status, 200, `Internal link ${path}`)
    console.log(
      `PASS: SSR metadata/schema/FAQ exactly match source; reference section order, photo hero, two inline forms, uploaded media/full-size links and no discount; ${internal.length} internal links return 200`,
    )
  }
} finally {
  cleanup()
}
