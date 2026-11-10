import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { load } from "cheerio"
import { loadSchemaBuilders } from "./schema-loader.mjs"

const { builders: B, profile: P, cleanup } = loadSchemaBuilders()
const normalize = (value) => JSON.parse(JSON.stringify(value))
const graph = normalize(B.buildCompleteHomeSchema())
const definitions = new Map()
const references = []

function visit(value, nodes = definitions, refs = references) {
  if (Array.isArray(value)) return value.forEach(item => visit(item, nodes, refs))
  if (!value || typeof value !== "object") return
  if (value['@id']) {
    if (Object.keys(value).length > 1) {
      assert.ok(!nodes.has(value['@id']), `Duplicate definition: ${value['@id']}`)
      nodes.set(value['@id'], value)
    } else refs.push(value['@id'])
  }
  for (const child of Object.values(value)) visit(child, nodes, refs)
}

try {
  visit(graph)
  for (const ref of references) assert.ok(definitions.has(ref), `Unresolved @id: ${ref}`)
  assert.equal(graph['@context'], 'https://schema.org')
  const organization = definitions.get(P.ORGANIZATION_ID)
  assert.deepEqual(organization['@type'], ['Organization', 'LocalBusiness'])
  assert.equal(organization.slogan, P.BRAND_SLOGAN)
  assert.equal(organization.email, P.PUBLIC_EMAIL)
  assert.equal(organization.telephone, P.PHONE_E164)
  assert.deepEqual(organization.address, { '@type': 'PostalAddress', ...P.ADDRESS })
  assert.deepEqual(organization.sameAs, Object.values(P.SOCIAL_PROFILES))
  assert.equal(organization.openingHoursSpecification.length, 2)
  assert.equal(organization.openingHoursSpecification[0].closes, '18:00')
  assert.equal(organization.openingHoursSpecification[1].closes, '12:00')
  assert.ok(organization.openingHoursSpecification.every(slot => slot.dayOfWeek.every(day => day.startsWith('https://schema.org/'))))
  assert.deepEqual([definitions.get(P.LOGO_ID).width, definitions.get(P.LOGO_ID).height], [824, 543])
  assert.equal(definitions.get(`${P.SITE_URL}/#webpage`).mainEntity['@id'], P.HOME_SERVICE_ID)
  const service = definitions.get(P.HOME_SERVICE_ID)
  assert.equal(service['@type'], 'Service')
  assert.equal(service.provider['@id'], P.ORGANIZATION_ID)
  assert.equal(service.name, 'Global B2B Digital Infrastructure & Export Acceleration')
  assert.equal(definitions.get(`${P.SITE_URL}/#webpage`).inLanguage, 'en')
  assert.deepEqual(definitions.get(P.WEBSITE_ID).inLanguage, ['en', 'vi-VN'])
  assert.equal(service.hasOfferCatalog.itemListElement.length, 3)
  for (const offer of service.hasOfferCatalog.itemListElement) {
    assert.equal(offer.itemOffered.provider['@id'], P.ORGANIZATION_ID)
    assert.ok(offer.itemOffered.url.endsWith('/#services'))
    assert.ok(!('price' in offer), 'No invented package price')
  }
  for (const item of P.SERVICE_CATALOG) {
    assert.ok(!definitions.has(P.serviceId(item.key)), 'Legacy compliance/Trade services are not the homepage primary catalog')
    const node = normalize(B.buildServiceNode(item))
    assert.equal(node.url, `${P.SITE_URL}${item.path}`)
    assert.ok(!('availableLanguage' in node), 'Service has no availableLanguage property')
    assert.ok(!('inLanguage' in node), 'Service has no inLanguage property')
  }
  const serialized = JSON.stringify(graph)
  assert.ok(!/https:\/\/veximglobal\.com|ProfessionalService|priceRange|admin\/dashboard|aggregateRating|postalCode/.test(serialized))
  assert.deepEqual(JSON.parse(readFileSync('docs/seo/homepage-schema.json', 'utf8')), graph)
  const viGraph = normalize({ '@context': 'https://schema.org', '@graph': [...B.buildSiteSchema()['@graph'], ...B.buildVietnameseHomePageSchema()['@graph']] })
  const viNodes = new Map(), viReferences = []
  visit(viGraph, viNodes, viReferences)
  for (const ref of viReferences) assert.ok(viNodes.has(ref), `Unresolved VI @id: ${ref}`)
  assert.equal(viNodes.get(`${P.SITE_URL}/vi#webpage`).inLanguage, 'vi-VN')
  assert.equal(viNodes.get(`${P.SITE_URL}/vi#webpage`).mainEntity['@id'], `${P.SITE_URL}/vi#service`)
  assert.equal(viNodes.get(`${P.SITE_URL}/vi#service`).name, 'Hạ tầng số B2B toàn cầu & Tăng tốc xuất khẩu')
  assert.equal(viNodes.get(`${P.SITE_URL}/vi#service`).hasOfferCatalog.itemListElement.length, 3)
  assert.deepEqual(viNodes.get(P.ORGANIZATION_ID), organization, 'Business identity must be shared across languages')
  assert.deepEqual(JSON.parse(readFileSync('docs/seo/homepage-schema-vi.json', 'utf8')), viGraph)
  assert.ok(readFileSync('public/og-image-vi.jpg').length < 300_000)
  console.log(`PASS: EN/VI page graphs, ${references.length} + ${viReferences.length} resolved @id references, unchanged business entity, 3 engagement scopes each, schema exports current`)

  // Optional integration check against actual SSR HTML, not an assumption from source.
  const base = process.env.SCHEMA_TEST_BASE_URL
  if (base) {
    const getPage = async (path) => {
      const response = await fetch(`${base}${path}`)
      assert.equal(response.status, 200, path)
      const $ = load(await response.text())
      const nodes = $('script[type="application/ld+json"]').toArray().flatMap(element => {
        const block = JSON.parse($(element).html())
        assert.equal(block['@context'], 'https://schema.org', 'Each standalone script needs its own @context')
        return block['@graph'] ?? [block]
      })
      return { $, nodes }
    }
    const home = await getPage('/')
    assert.deepEqual(home.nodes, graph['@graph'])
    assert.equal(home.$('link[rel="canonical"]').attr('href'), P.SITE_URL)
    assert.equal(home.$('meta[property="og:url"]').attr('content'), P.SITE_URL)
    assert.equal(home.$('title').text(), P.SITE_TITLE)
    assert.equal(home.$('html').attr('lang'), 'en')
    assert.equal(home.$('main').first().attr('lang'), 'en')
    assert.equal(home.$('meta[property="og:locale"]').attr('content'), 'en_US')
    assert.equal(home.$('h1').text().trim(), service.name)
    assert.ok(home.$('footer').text().includes(P.PUBLIC_EMAIL))
    assert.ok(home.$('footer').text().includes(P.ADDRESS.streetAddress))
    const viHome = await getPage('/vi')
    assert.deepEqual(viHome.nodes, viGraph['@graph'])
    assert.equal(viHome.$('link[rel="canonical"]').attr('href'), `${P.SITE_URL}/vi`)
    assert.equal(viHome.$('meta[property="og:url"]').attr('content'), `${P.SITE_URL}/vi`)
    assert.equal(viHome.$('meta[property="og:locale"]').attr('content'), 'vi_VN')
    assert.equal(viHome.$('html').attr('lang'), 'vi')
    assert.equal(viHome.$('main').first().attr('lang'), 'vi')
    assert.equal(viHome.$('h1').text().trim(), viNodes.get(`${P.SITE_URL}/vi#service`).name)
    for (const page of [home.$, viHome.$]) {
      assert.equal(page('link[rel="alternate"][hreflang="en"]').attr('href'), P.SITE_URL)
      assert.equal(page('link[rel="alternate"][hreflang="vi"]').attr('href'), `${P.SITE_URL}/vi`)
    }
    for (const item of P.SERVICE_CATALOG) {
      const { nodes, $ } = await getPage(item.path)
      const node = nodes.find(node => node['@id'] === P.serviceId(item.key))
      assert.ok(node)
      const { '@context': _context, ...serviceNode } = node
      assert.deepEqual(serviceNode, B.buildServiceNode(item))
      assert.equal(nodes.filter(node => node['@id'] === P.ORGANIZATION_ID).length, 1)
      assert.equal($('html').attr('lang'), 'vi')
    }
    console.log('PASS: EN/VI homepage SSR matches schema exports and reciprocal hreflang; all 6 legacy landing pages retain service identities and Vietnamese document language')
  }
} finally {
  cleanup()
}
