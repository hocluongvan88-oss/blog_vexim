import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { load } from "cheerio"
import { loadSchemaBuilders } from "./schema-loader.mjs"

const { builders: B, profile: P, cleanup } = loadSchemaBuilders()
const normalize = (value) => JSON.parse(JSON.stringify(value))
const graph = normalize(B.buildCompleteHomeSchema())
const definitions = new Map()
const references = []

function visit(value) {
  if (Array.isArray(value)) return value.forEach(visit)
  if (!value || typeof value !== "object") return
  if (value['@id']) {
    if (Object.keys(value).length > 1) {
      assert.ok(!definitions.has(value['@id']), `Duplicate definition: ${value['@id']}`)
      definitions.set(value['@id'], value)
    } else references.push(value['@id'])
  }
  for (const child of Object.values(value)) visit(child)
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
  assert.equal(service.hasOfferCatalog.itemListElement.length, 6)
  for (const item of P.HOME_SERVICE_CATALOG) {
    const node = definitions.get(P.serviceId(item.key))
    assert.deepEqual(node, normalize(B.buildServiceNode(item)))
    assert.equal(node.url, `${P.SITE_URL}${item.path}`)
    assert.ok(!('availableLanguage' in node), 'Service has no availableLanguage property')
    assert.ok(!('inLanguage' in node), 'Service has no inLanguage property')
  }
  const serialized = JSON.stringify(graph)
  assert.ok(!/https:\/\/veximglobal\.com|ProfessionalService|priceRange|admin\/dashboard|aggregateRating|postalCode/.test(serialized))
  assert.deepEqual(JSON.parse(readFileSync('docs/seo/homepage-schema.json', 'utf8')), graph)
  console.log(`PASS: ${graph['@graph'].length} top-level entities; all ${references.length} @id references resolve; 6 service identities match; exported JSON is current`)

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
    assert.equal(home.$('h1').text().trim(), service.name)
    assert.ok(home.$('footer').text().includes(P.PUBLIC_EMAIL))
    assert.ok(home.$('footer').text().includes(P.ADDRESS.streetAddress))
    const cards = home.$('#services h3 a').toArray().map(element => ({
      name: home.$(element).text().trim(), path: home.$(element).attr('href'),
    }))
    assert.equal(cards.length, 6)
    assert.ok(!cards.some(card => card.path === '/services/fsvp'))
    assert.equal(cards[4].name, 'Vexim Export Digital')
    assert.equal(cards[4].path, '/services/export-digital')
    for (const item of P.HOME_SERVICE_CATALOG) {
      assert.ok(cards.some(card => card.name === item.name && card.path === item.path))
    }
    for (const item of P.SERVICE_CATALOG) {
      const { nodes } = await getPage(item.path)
      const node = nodes.find(node => node['@id'] === P.serviceId(item.key))
      assert.ok(node)
      const { '@context': _context, ...serviceNode } = node
      assert.deepEqual(serviceNode, B.buildServiceNode(item))
      assert.equal(nodes.filter(node => node['@id'] === P.ORGANIZATION_ID).length, 1)
    }
    console.log('PASS: homepage SSR matches standalone export; canonical/OG/title/H1/footer match; 6 homepage cards match schema; all 7 landing pages emit the same service identities (FSVP preserved)')
  }
} finally {
  cleanup()
}
