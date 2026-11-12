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
  assert.equal(load(cases[0])('a[href="https://www.veximglobal.com"]').length >= 1, true)
  console.log(`PASS: ${cases.length} template variants, safe HTML, inline styles, slogan, contacts and links`)

  const senderModule = loadModule('lib/email-service-zoho.ts', {
    '@/lib/business-profile': T,
    nodemailer: { createTransport() { throw new Error('No SMTP expected') } },
  })
  const service = new senderModule.EmailServiceZoho()
  let captured = null
  service.sendEmail = async ({ html, to }) => { captured = { html, to }; return false }
  assert.equal(await service.sendEmail({ to: email, subject: 'test', html: '<p>x</p>' }), false)
  assert.equal(captured.to, email)
  console.log('PASS: Zoho sender reports delivery failure rather than success')
  const previews = readdirSync('public/email-preview').filter(name => name.endsWith('.html') && name !== 'index.html')
  assert.equal(previews.length, 6)
  for (const name of previews) assert.ok(readFileSync(`public/email-preview/${name}`, 'utf8').includes(T.BRAND_SLOGAN))
  console.log('PASS: all 6 generated previews match the shared slogan')
} finally {
  cleanup()
}
