import assert from "node:assert/strict"
import { existsSync, readFileSync, statSync } from "node:fs"
import { load } from "cheerio"
import { loadSchemaBuilders } from "./schema-loader.mjs"

const { builders: B, profile: P, fdaContent: C, cleanup } = loadSchemaBuilders()
const normalize = value => JSON.parse(JSON.stringify(value))
try {
  const data = normalize({ '@context': 'https://schema.org', '@graph': [...B.buildSiteSchema()['@graph'], ...B.buildFdaPageSchema()['@graph']] })
  const definitions = new Map(), refs = []
  function walk(value) {
    if (Array.isArray(value)) return value.forEach(walk)
    if (!value || typeof value !== 'object') return
    if (value['@id']) {
      if (Object.keys(value).length > 1) {
        assert.ok(!definitions.has(value['@id']), `Duplicate @id ${value['@id']}`)
        definitions.set(value['@id'], value)
      } else refs.push(value['@id'])
    }
    Object.values(value).forEach(walk)
  }
  walk(data)
  refs.forEach(ref => assert.ok(definitions.has(ref), `Unresolved ${ref}`))
  const faq = definitions.get(`${P.SITE_URL}${C.FDA_PAGE.path}#faq`)
  assert.deepEqual(faq.mainEntity.map(q => [q.name, q.acceptedAnswer.text]), C.FDA_FAQS.map(q => [q.question, q.answer]))
  assert.equal(faq.mainEntity.length, 6)
  assert.equal(C.FDA_LIBRA_CASE.company, 'CÔNG TY TNHH LIBRA VIỆT NAM')
  assert.ok(!JSON.stringify(C.FDA_LIBRA_CASE).includes('Cổ phần'))
  assert.deepEqual(JSON.parse(readFileSync('docs/seo/fda-schema.json', 'utf8')), data)
  assert.ok(C.FDA_PAGE.title.length <= 60)
  assert.ok(C.FDA_PAGE.description.length <= 165)
  const og = readFileSync(`public${C.FDA_PAGE.image}`)
  assert.equal(og.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
  assert.equal(og.readUInt32BE(16), 1200)
  assert.equal(og.readUInt32BE(20), 630)
  assert.ok(statSync(`public${C.FDA_PAGE.image}`).size < 300_000)
  console.log('PASS: metadata lengths; real 1200×630 OG <300KB; schema export, all references, 6 FAQ answers and TNHH company name')

  const base = process.env.SCHEMA_TEST_BASE_URL
  if (!base) { console.log('Set SCHEMA_TEST_BASE_URL to run SSR integration checks.'); process.exitCode = 0 }
  else {
    const response = await fetch(`${base}${C.FDA_PAGE.path}`)
    assert.equal(response.status, 200)
    const $ = load(await response.text())
    assert.equal($('html').attr('lang'), 'vi')
    assert.equal($('h1').length, 1)
    assert.equal($('h1').text().trim(), 'Đăng ký FDA')
    assert.equal($('title').text(), C.FDA_PAGE.title)
    assert.equal($('meta[name="description"]').attr('content'), C.FDA_PAGE.description)
    assert.equal($('link[rel="canonical"]').attr('href'), `${P.SITE_URL}${C.FDA_PAGE.path}`)
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) assert.equal($(selector).attr('content'), C.FDA_PAGE.title)
    for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) assert.equal($(selector).attr('content'), C.FDA_PAGE.description)
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) assert.equal($(selector).attr('content'), `${P.SITE_URL}${C.FDA_PAGE.image}`)
    assert.equal($('meta[property="og:locale"]').attr('content'), 'vi_VN')
    assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary_large_image')
    assert.equal($('main').length, 1)
    assert.equal($('main footer, main header').length, 0)
    const nodes = $('script[type="application/ld+json"]').toArray().flatMap(el => {
      const block = JSON.parse($(el).html())
      assert.equal(block['@context'], 'https://schema.org')
      return block['@graph'] ?? [block]
    })
    assert.deepEqual(nodes, data['@graph'])
    const visibleFaq = $('#faq details').toArray().map(el => [$(el).find('summary').text(), $(el).find('p').text()])
    assert.deepEqual(visibleFaq, C.FDA_FAQS.map(q => [q.question, q.answer]))
    assert.ok($('button').filter((_, el) => $(el).text().trim() === 'Nhận tư vấn đăng ký FDA').length === 1)
    assert.ok($('button').filter((_, el) => $(el).text().trim() === 'Nhận tư vấn và báo giá FDA').length === 1)
    assert.equal($('a').filter((_, el) => $(el).text().includes('Xem hướng dẫn FDA chính thức')).attr('href'), C.FDA_SOURCES[0].url)
    assert.equal($('#case-libra img').length, 0, 'No pending case images may be published')
    assert.ok($('#case-libra').text().includes(C.FDA_LIBRA_CASE.company))
    const mainText = $('main').text()
    assert.ok(!/98%|99%|500\+|10\+|1-31\/10|chính xác 100%/.test(mainText))
    assert.equal($('img').filter((_, el) => $(el).attr('alt') === undefined).length, 0)
    $('img[src^="/"]').each((_, el) => assert.ok(existsSync(`public${$(el).attr('src')}`), `Missing image ${$(el).attr('src')}`))
    const internal = [...new Set($('main a[href^="/"]').map((_, el) => $(el).attr('href')).get())]
    for (const path of internal) assert.equal((await fetch(`${base}${path}`)).status, 200, `Internal link ${path}`)
    console.log(`PASS: SSR metadata/schema/FAQ exactly match source; CTA buttons render, no fabricated case images; ${internal.length} internal links return 200`)
  }
} finally {
  cleanup()
}
