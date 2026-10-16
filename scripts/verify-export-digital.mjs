import assert from "node:assert/strict"
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { createRequire } from "node:module"
import { randomUUID } from "node:crypto"
import vm from "node:vm"
import ts from "typescript"
import { load } from "cheerio"
import { loadSchemaBuilders } from "./schema-loader.mjs"
import { loadEmailTemplates } from "./email-template-loader.mjs"

const require = createRequire(import.meta.url)
function moduleFrom(file, mocks = {}, env = {}) {
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText
  const exports = {}
  vm.runInNewContext(
    code,
    {
      exports,
      require: (name) => {
        assert.ok(name in mocks, `Unexpected import: ${name}`)
        return mocks[name]
      },
      process: { env },
      console: { error() {} },
      URL,
      Buffer,
      Date,
      Request,
      Response,
      Uint8Array,
      Set,
      Map,
    },
    { filename: file },
  )
  return exports
}
const C = moduleFrom("lib/export-digital-content.ts")
const L = moduleFrom("lib/export-digital-lead.ts", {
  zod: require("zod"),
  "./export-digital-content": C,
})
const site = loadSchemaBuilders(),
  email = loadEmailTemplates()
try {
  const E = moduleFrom("lib/email-export-digital.ts", {
    "./email-layout": email.templates,
  })
  const schema = moduleFrom("lib/export-digital-schema.ts", {
    "./business-profile": site.profile,
    "./schema": site.builders,
    "./export-digital-content": C,
  }).buildExportDigitalSchema()
  const graph = JSON.parse(
    JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [...site.builders.buildSiteSchema()["@graph"], ...schema["@graph"]],
    }),
  )
  if (process.argv.includes("--export"))
    writeFileSync("docs/seo/export-digital-schema.json", JSON.stringify(graph, null, 2) + "\n")
  assert.deepEqual(JSON.parse(readFileSync("docs/seo/export-digital-schema.json", "utf8")), graph)
  const definitions = new Map(),
    refs = []
  function walk(value) {
    if (!value || typeof value !== "object") return
    if (Array.isArray(value)) return value.forEach(walk)
    if (value["@id"]) {
      if (Object.keys(value).length === 1) refs.push(value["@id"])
      else {
        assert.ok(!definitions.has(value["@id"]))
        definitions.set(value["@id"], value)
      }
    }
    Object.values(value).forEach(walk)
  }
  walk(graph)
  refs.forEach((ref) => assert.ok(definitions.has(ref), `Unresolved schema ID: ${ref}`))
  assert.equal(definitions.get(`${site.profile.SITE_URL}${C.EXPORT_DIGITAL.path}#faq`).mainEntity.length, 8)
  assert.ok(!/aggregateRating|Review|priceCurrency/.test(JSON.stringify(graph)))
  assert.equal(C.BUYER_CRITERIA.length, 6)
  assert.equal(C.EXPORT_STEPS.length, 4)
  for (const input of [
    "doanhnghiep.com",
    "https://doanhnghiep.com",
    "http://www.doanhnghiep.com/a?secret=test#key",
  ])
    assert.ok(L.normalizeCompanyWebsite(input).startsWith("http"))
  assert.equal(L.normalizeCompanyWebsite("doanhnghiep.com?secret=test#key"), "https://doanhnghiep.com/")
  for (const input of [
    "",
    "localhost",
    "http://127.0.0.1",
    "https://internal.local",
    "javascript:alert(1)",
    "https://user:pass@example.com",
    "https://[::1]",
    "https://a.com:8080",
    "https://a..com",
    "https://-company.com",
    "https://company-.com",
    `https://${"a".repeat(64)}.com`,
  ])
    assert.throws(() => L.normalizeCompanyWebsite(input), input)
  const lead = {
    website: "doanhnghiep.com",
    noWebsite: false,
    company: "Công ty thử",
    product: "Hạt điều",
    markets: ["Mỹ", "EU"],
    name: "Khách thử",
    phone: "0912345678",
    email: "",
    channels: ["Alibaba"],
    honeypot: "",
  }
  assert.ok(L.exportDigitalLeadSchema.safeParse(lead).success, "Email is optional")
  assert.ok(
    L.exportDigitalLeadSchema.safeParse({
      ...lead,
      website: "",
      noWebsite: true,
    }).success,
  )
  for (const patch of [
    { markets: [] },
    { website: "" },
    { phone: "abc" },
    { company: " " },
    { product: " " },
    { email: "wrong" },
    { markets: ["Unlisted"] },
  ])
    assert.equal(L.exportDigitalLeadSchema.safeParse({ ...lead, ...patch }).success, false)
  const hostile = {
    ...lead,
    company: '<img src=x onerror="evil()">',
    name: "<script>evil()</script>",
    website: "https://doanhnghiep.com/",
  }
  const html = E.getExportDigitalAdminEmail(hostile, "test-id")
  const mail = load(html)
  assert.equal(mail("script,img,[onerror]").length, 0)
  assert.ok(mail("body").text().includes(hostile.company))
  assert.ok(mail("body").text().includes("2 ngày làm việc"))
  console.log(
    "PASS: schema references/export; 8 matching FAQ; URL normalization; required/optional fields; safe admin email",
  )

  const env = {
    MAIL_USERNAME: "sender@example.com",
    MAIL_PASSWORD: "mock",
    ADMIN_EMAIL: "team@example.com",
    MAIL_HOST: "smtp.example.com",
    MAIL_PORT: "465",
  }
  let sends = 0,
    smtpOk = true,
    accepted = true,
    sentMessage,
    config
  const makeRoute = (
    configEnv = env,
    send = async (message) => {
      sends++
      sentMessage = message
      if (!smtpOk) throw new Error("mock SMTP failure")
      return { accepted: accepted ? [env.ADMIN_EMAIL] : [] }
    },
  ) =>
    moduleFrom(
      "app/api/export-digital-assessment/route.ts",
      {
        "node:crypto": require("node:crypto"),
        "next/server": {
          NextResponse: {
            json: (data, options) => Response.json(data, options),
          },
        },
        zod: require("zod"),
        nodemailer: {
          createTransport(options) {
            config = options
            return { sendMail: send }
          },
        },
        "@/lib/business-profile": site.profile,
        "@/lib/export-digital-lead": L,
        "@/lib/email-export-digital": E,
      },
      configEnv,
    )
  const request = (body = lead, id = randomUUID(), headers = {}) =>
    new Request("https://www.veximglobal.com/api/export-digital-assessment", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": id,
        origin: "https://www.veximglobal.com",
        ...headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  const route = makeRoute()
  assert.equal((await makeRoute({}).POST(request())).status, 503)
  assert.equal(
    (await route.POST(request(lead, randomUUID(), { origin: "https://evil.example" }))).status,
    403,
  )
  assert.equal((await route.POST(request(lead, randomUUID(), { "content-type": "text/plain" }))).status, 415)
  assert.equal((await route.POST(request(lead, "invalid"))).status, 400)
  assert.equal((await route.POST(request("{"))).status, 400)
  assert.equal((await route.POST(request("x".repeat(17000)))).status, 413)
  assert.equal((await route.POST(request({ ...lead, honeypot: "bot" }))).status, 400)
  assert.equal((await route.POST(request({ ...lead, markets: [] }))).status, 400)
  assert.equal(sends, 0)
  const id = randomUUID()
  smtpOk = false
  const failed = await route.POST(request(lead, id))
  assert.equal(failed.status, 503)
  assert.notEqual((await failed.json()).success, true)
  smtpOk = true
  const success = await route.POST(request(lead, id))
  assert.equal(success.status, 202)
  assert.equal((await success.json()).success, true)
  assert.equal(sentMessage.to, env.ADMIN_EMAIL)
  assert.equal(config.secure, true)
  assert.equal(sentMessage.replyTo, site.profile.PUBLIC_EMAIL)
  assert.ok(sentMessage.html.includes("https://doanhnghiep.com/"))
  assert.equal(sentMessage.html.includes("Chưa tự động tạo dự án Vexim Growth"), true)
  assert.equal((await route.POST(request(lead, id))).status, 202)
  assert.equal(sends, 2, "Duplicate same submission must not send email again")
  accepted = false
  assert.equal((await makeRoute().POST(request())).status, 503)
  accepted = true
  const limited = makeRoute()
  for (let i = 0; i < 5; i++) assert.equal((await limited.POST(request())).status, 202)
  assert.equal((await limited.POST(request())).status, 429)
  let release,
    count = 0
  const gate = new Promise((resolve) => {
    release = resolve
  })
  const concurrent = makeRoute(env, async () => {
    count++
    await gate
    return { accepted: [env.ADMIN_EMAIL] }
  })
  const concurrentId = randomUUID()
  const a = concurrent.POST(request(lead, concurrentId)),
    b = concurrent.POST(request(lead, concurrentId))
  release()
  assert.deepEqual(
    (await Promise.all([a, b])).map((r) => r.status),
    [202, 202],
  )
  assert.equal(count, 1)
  const noSite = makeRoute()
  assert.equal(
    (
      await noSite.POST(
        request({
          ...lead,
          website: "",
          noWebsite: true,
          email: "customer@example.com",
        }),
      )
    ).status,
    202,
  )
  assert.equal(sentMessage.replyTo, "customer@example.com")
  console.log(
    "PASS: actual route with mocked SMTP: missing config, bad input/origin, body limit, honeypot, failure/retry, accepted recipient, rate limit and concurrent deduplication",
  )

  const base = process.env.SCHEMA_TEST_BASE_URL
  if (base) {
    const response = await fetch(`${base}${C.EXPORT_DIGITAL.path}`)
    assert.equal(response.status, 200)
    const $ = load(await response.text())
    assert.equal($("h1").text().replace(/\s+/g, " ").trim(), "Sản phẩm tốt, nhưng buyer chỉ hỏi giá?")
    assert.equal($("title").text(), C.EXPORT_DIGITAL.title)
    assert.equal($('link[rel="canonical"]').attr("href"), `${site.profile.SITE_URL}${C.EXPORT_DIGITAL.path}`)
    assert.equal($('meta[name="description"]').attr("content"), C.EXPORT_DIGITAL.description)
    assert.ok(!$('meta[name="robots"]').attr("content").includes("noindex"))
    const nodes = $('script[type="application/ld+json"]')
      .toArray()
      .flatMap((el) => JSON.parse($(el).html())["@graph"])
    assert.deepEqual(nodes, graph["@graph"])
    assert.deepEqual(
      $("#cau-hoi details")
        .toArray()
        .map((el) => [$(el).find("summary>span:nth-child(2)").text(), $(el).find("p").text()]),
      JSON.parse(JSON.stringify(C.EXPORT_FAQS.map((faq) => [faq.question, faq.answer]))),
    )
    assert.equal($("#cau-hoi details[open]").length, 1)
    assert.equal($("main > section").length, 11, "Evidence block stays hidden until authorized data exists")
    assert.equal($('form[data-testid="export-assessment-form"]').length, 1)
    assert.equal($('input[name="email"][required]').length, 0)
    assert.equal($("#goi-dich-vu .ed-price-note").length, 3)
    assert.equal($('#goi-dich-vu a[href="#nhan-bao-cao"]').length, 3)
    assert.equal($("#export-hero img").length, 0, "Hero is an illustrative UI, not stock imagery")
    for (const source of ["#export-hero", "#cai-gia", "#goi-dich-vu"])
      assert.ok($(`${source} a[href="#nhan-bao-cao"]`).length > 0)
    const ids = $("[id]")
      .map((_, el) => $(el).attr("id"))
      .get()
    assert.equal(ids.length, new Set(ids).size)
    $('a[href^="#"]').each((_, el) => assert.ok(ids.includes($(el).attr("href").slice(1))))
    assert.ok(!/30–80|10–25|12 nước|Phổ biến nhất|lên top ChatGPT/i.test($("main").text()))
    const og = readFileSync(`public${C.EXPORT_DIGITAL.image}`)
    assert.equal(og.readUInt32BE(16), 1200)
    assert.equal(og.readUInt32BE(20), 630)
    assert.equal((await fetch(`${base}${C.EXPORT_DIGITAL.image}`)).status, 200)
    assert.equal((await fetch(`${base}${C.EXPORT_DIGITAL.path}/goc-nhin-buyer`)).status, 200)
    assert.ok(
      (await (await fetch(`${base}/sitemap.xml`)).text()).includes(
        `${site.profile.SITE_URL}${C.EXPORT_DIGITAL.path}`,
      ),
    )
    assert.ok(existsSync(`public${C.EXPORT_DIGITAL.image}`))
    console.log(
      "PASS: SSR content/metadata/schema/FAQ parity; one conversion form; illustrative hero; no invented proof, price or popularity; real resource/OG/sitemap",
    )
  }
} finally {
  site.cleanup()
  email.cleanup()
}
