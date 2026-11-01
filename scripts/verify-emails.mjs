import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import ts from "typescript"
import vm from "node:vm"
import { load } from "cheerio"
import { loadEmailTemplates } from "./email-template-loader.mjs"

const { templates: T, cleanup } = loadEmailTemplates()
const base = "https://www.veximglobal.com"
const hostile = '<img src=x onerror="alert(1)"> & Nguyễn'
const email = 'khachhang+fda@example.com'
const verify = `${base}/api/fda/verify?${new URLSearchParams({ email, token: 'demo-token' })}`
const unsubscribe = `${base}/fda-tracker/unsubscribe?${new URLSearchParams({ email, token: 'demo-token' })}`
const alert = { title: hostile, criticalInfo: hostile, aiSummary: hostile, manufacturer: hostile, classification: 'Class I', date: '2026-10-15' }
const consultation = { name: hostile, phone: '0373685634', email, serviceName: hostile, product: hostile, description: hostile + '\nDòng thứ hai' }
const gacc = { companyName: hostile, productName: hostile, hsCode: '1234', submissionId: 'test-id', submittedAt: '15/10/2026', email, phone: '0373685634', taxCode: hostile }

// Mock only external dependencies; exercise the actual transpiled service/route code.
function loadModule(file, mocks) {
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText
  const exports = {}
  vm.runInNewContext(code, {
    exports, require(name) { assert.ok(name in mocks, `Unexpected import ${name}`); return mocks[name] },
    process: { env: {} }, console: { log() {}, error() {} }, URL, URLSearchParams, Response, Request, setTimeout,
  }, { filename: file })
  return exports
}

try {
  const cases = [
    T.getVerificationEmailHTML({ email, verificationLink: verify, unsubscribeLink: unsubscribe }),
    T.getAlertEmailHTML({ email, alerts: [alert], alertCount: 8, frequency: 'daily', unsubscribeLink: unsubscribe }),
    T.getAlertEmailHTML({ email, alerts: [], frequency: 'weekly' }),
    T.getImmediateAlertEmailHTML({ email, alert, unsubscribeLink: unsubscribe }),
    T.getUnsubscribeEmailHTML({ email }),
    T.getConsultationCustomerHTML(consultation), T.getConsultationAdminHTML(consultation),
    T.getGACCUserConfirmationHTML(gacc), T.getGACCAdminNotificationHTML(gacc),
    T.getFdaRenewalReminderHTML({ companyName: hostile, contactName: hostile, registrationType: hostile, expirationDate: '31/12/2026', monthsBefore: 2 }),
    T.getAgentRenewalReminderHTML({ companyName: hostile, contactName: hostile, contractEndDate: '31/12/2026' }),
  ]
  for (const html of cases) {
    const $ = load(html)
    assert.equal($('html').attr('lang'), 'vi')
    assert.equal($('h1').length, 1)
    assert.equal($('script,[onerror],img').length, 0, 'No user HTML can be injected')
    assert.ok(html.includes(T.BRAND_SLOGAN))
    assert.ok(html.includes(T.PUBLIC_EMAIL))
    assert.ok(html.includes('prefers-color-scheme:dark'))
    assert.ok(html.includes('x-apple-disable-message-reformatting'))
    assert.ok(!/linear-gradient|#84cc16|#facc15|href=\{|undefined|\{\/\*/.test(html))
    assert.ok(Buffer.byteLength(html) < 90_000, 'Keep below Gmail clipping threshold')
    assert.ok($('table[role="presentation"]').length >= 2)
    $('.email-button').each((_, button) => {
      assert.match($(button).attr('style'), /background-color:/)
      assert.equal(new URL($(button).attr('href')).protocol, 'https:')
    })
  }
  const verification = load(cases[0])
  assert.equal(verification('.email-button').attr('href'), verify)
  assert.ok(verification('body').text().includes(email))
  assert.equal(verification('a').filter((_, a) => verification(a).attr('href') === unsubscribe).length, 1)
  assert.equal(load(cases[5])('a[href="https://www.veximglobal.com"]').length >= 1, true)
  for (const classification of ['Class I', 'Class I - nguy cơ', 'I']) assert.ok(T.isHighRiskAlert({ classification }))
  for (const classification of ['Class II', 'Class III', '', undefined]) assert.ok(!T.isHighRiskAlert({ classification }))
  assert.throws(() => T.getVerificationEmailHTML({ email }))
  assert.throws(() => T.getVerificationEmailHTML({ email, verificationLink: 'javascript:alert(1)' }))
  console.log(`PASS: ${cases.length} template variants, safe HTML, inline styles, slogan, contacts and links`)

  for (const file of ['lib/email-service.ts', 'lib/email-service-zoho.ts']) {
    const mocks = {
      '@/lib/business-profile': T, '@/lib/email-templates': T,
      '@/lib/supabase-server': { createServerClient() { throw new Error('No DB expected') } },
      nodemailer: { createTransport() { throw new Error('No SMTP expected') } },
    }
    const module = loadModule(file, mocks)
    const service = file.includes('zoho') ? new module.EmailServiceZoho() : new module.EmailService()
    // Missing config must not report delivery.
    assert.equal(await service.sendVerificationEmail(email, 'token'), false)
    for (const delivered of [false, true]) {
      service.sendEmail = async ({ html, to }) => {
        assert.equal(to, email)
        const $ = load(html)
        const link = new URL($('.email-button').attr('href'))
        assert.equal(link.searchParams.get('email'), email)
        return delivered
      }
      assert.equal(await service.sendVerificationEmail(email, 'token'), delivered)
    }
  }
  console.log('PASS: both senders propagate delivery failure/success; absent credentials do not report success')

  let sent = true, cancelled = { id: 'test-id' }, confirmations = 0, existing = null
  const database = { from(table) {
    const query = {
      select() { return query }, eq() { return query }, gt() { return query },
      single: async () => ({ data: table === 'rate_limits' ? null : existing, error: null }),
      maybeSingle: async () => ({ data: cancelled, error: null }),
      insert() { return query }, update() { return query },
      then(resolve) { return Promise.resolve({ data: [], error: null }).then(resolve) },
    }
    return query
  } }
  const route = loadModule('app/api/fda/subscribe/route.ts', {
    'next/server': { NextResponse: { json: (data, options) => Response.json(data, options) } },
    '@/lib/supabase-server': { createServerClient: async () => database },
    '@/lib/email-service-zoho': { emailService: { sendVerificationEmail: async () => sent, sendUnsubscribeConfirmation: async () => { confirmations++ } } },
  })
  for (const subscription of [null, { verified: false }]) {
    existing = subscription
    for (const success of [false, true]) {
      sent = success
      const response = await route.POST(new Request(`${base}/api/fda/subscribe`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, frequency: 'daily', categories: ['food'] }) }))
      assert.equal(response.status, success ? 200 : 503)
    }
  }
  assert.equal((await route.DELETE(new Request(`${base}/api/fda/subscribe`))).status, 400)
  cancelled = null
  assert.equal((await route.DELETE(new Request(`${base}/api/fda/subscribe?email=x&token=invalid`))).status, 404)
  assert.equal(confirmations, 0)
  cancelled = { id: 'valid' }
  assert.equal((await route.DELETE(new Request(`${base}/api/fda/subscribe?email=x&token=valid`))).status, 200)
  assert.equal(confirmations, 1)
  console.log('PASS: subscribe/new and resend return 503 on delivery failure; unsubscribe validates tokens')

  let verificationRecord = null, verificationError = null, updates = 0
  const verifyDatabase = { from() {
    const query = {
      select() { return query }, eq() { return query }, gt() { return query },
      single: async () => ({ data: verificationRecord, error: null }),
      update() { updates++; return query },
      then(resolve) { return Promise.resolve({ error: verificationError }).then(resolve) },
    }
    return query
  } }
  const verificationRoute = loadModule('app/api/fda/verify/route.ts', {
    '@/lib/business-profile': T, '@/lib/email-layout': T,
    '@/lib/supabase-server': { createServerClient: async () => verifyDatabase },
  })
  assert.equal((await verificationRoute.GET(new Request(`${base}/api/fda/verify`))).status, 400)
  assert.equal((await verificationRoute.GET(new Request(verify))).status, 404)
  verificationRecord = { id: 'valid', verified: false, is_active: true, categories: [hostile], frequency: 'daily' }
  let response = await verificationRoute.GET(new Request(verify))
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  const verifiedHtml = await response.text()
  assert.ok(verifiedHtml.includes(T.BRAND_SLOGAN))
  assert.equal(load(verifiedHtml)('img,[onerror]').length, 0)
  assert.equal(updates, 1)
  verificationRecord.verified = true
  assert.equal((await verificationRoute.GET(new Request(verify))).status, 200)
  assert.equal(updates, 1, 'Already verified does not update')
  verificationRecord.verified = false
  verificationRecord.is_active = false
  response = await verificationRoute.GET(new Request(verify))
  assert.ok((await response.text()).includes('Đăng ký này đã được hủy'))
  assert.equal(updates, 1, 'Cancelled subscription is not reactivated')
  verificationRecord.is_active = true
  verificationError = new Error('simulated DB update error')
  assert.equal((await verificationRoute.GET(new Request(verify))).status, 500)
  console.log('PASS: verification missing/expired/valid/already verified/cancelled/update-error states; escaped data, no-store response')

  const previews = readdirSync('public/email-preview').filter(name => name.endsWith('.html') && name !== 'index.html')
  assert.equal(previews.length, 10)
  for (const name of previews) assert.ok(readFileSync(`public/email-preview/${name}`, 'utf8').includes(T.BRAND_SLOGAN))
  console.log('PASS: all 10 generated previews match the shared slogan')
} finally {
  cleanup()
}
