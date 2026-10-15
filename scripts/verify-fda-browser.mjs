// Requires a locally installed Chromium, not a production SMTP/analytics account.
// BROWSER_EXECUTABLE_PATH=/path/to/chromium npm run test:fda:browser
import assert from "node:assert/strict"
import puppeteer from "puppeteer-core"

const base = process.env.SCHEMA_TEST_BASE_URL || "http://127.0.0.1:3000"
assert.ok(process.env.BROWSER_EXECUTABLE_PATH, "Set BROWSER_EXECUTABLE_PATH to a Chromium executable")
const browser = await puppeteer.launch({ executablePath: process.env.BROWSER_EXECUTABLE_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
try {
  const page = await browser.newPage()
  await page.evaluateOnNewDocument(() => { window.__testEvents = []; window.gtag = (...args) => window.__testEvents.push(args) })
  const requests = []
  let success = false
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).pathname === '/api/consultation') {
      requests.push(JSON.parse(request.postData()))
      return request.respond({ status: success ? 200 : 503, contentType: 'application/json', body: JSON.stringify(success ? { success: true } : { error: 'Lỗi mô phỏng, vui lòng thử lại.' }) })
    }
    return request.continue()
  })
  await page.goto(`${base}/services/fda`, { waitUntil: 'networkidle0', timeout: 120000 })
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewport({ width, height: 900 })
    const layout = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, broken: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).length }))
    assert.ok(layout.scroll <= width, `Horizontal overflow at ${width}px`)
    assert.equal(layout.broken, 0)
  }
  console.log('PASS: 320/390/768/1440px layouts and image loading')

  await page.setViewport({ width: 390, height: 844 })
  async function clickText(text, keyboard = false) {
    for (const button of await page.$$('button')) {
      if ((await button.evaluate(el => el.textContent)).includes(text)) {
        if (keyboard) { await button.focus(); await page.keyboard.press('Enter') }
        else await button.click()
        return
      }
    }
    throw new Error(`Button not found: ${text}`)
  }
  await clickText('Nhận tư vấn đăng ký FDA', true)
  await page.waitForSelector('[role="dialog"]', { visible: true })
  const state = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]'), rect = dialog.getBoundingClientRect()
    return { x: rect.x, right: rect.right, width: innerWidth, focused: dialog.contains(document.activeElement), service: dialog.querySelector('select').value }
  })
  assert.ok(state.x >= 0 && state.right <= state.width)
  assert.ok(state.focused)
  assert.equal(state.service, 'fda')
  await page.type('[role="dialog"] input[id$="-name"]', 'Khách kiểm thử')
  await page.type('[role="dialog"] input[id$="-phone"]', '0912345678')
  await page.type('[role="dialog"] input[id$="-email"]', 'test@example.com')
  await page.type('[role="dialog"] input[id$="-product"]', 'Bánh kẹo thử nghiệm')
  await page.click('[role="dialog"] button[type="submit"]')
  await page.waitForFunction(() => document.querySelector('[role="status"]')?.textContent.includes('Lỗi mô phỏng'))
  assert.equal(requests.length, 1)
  assert.equal((await page.evaluate(() => window.__testEvents)).filter(event => event[1] === 'generate_lead').length, 0)
  assert.equal(await page.$eval('[role="dialog"] input[id$="-email"]', el => el.value), 'test@example.com')
  success = true
  await page.click('[role="dialog"] button[type="submit"]')
  await page.waitForFunction(() => document.querySelector('[role="status"]')?.textContent.includes('24 giờ'))
  const events = await page.evaluate(() => window.__testEvents)
  const leads = events.filter(event => event[1] === 'generate_lead')
  assert.equal(leads.length, 1)
  assert.equal(leads[0][2].source, 'fda_hero')
  assert.equal(leads[0][2].service, 'fda')
  assert.equal(requests.length, 2)
  assert.equal(requests[1].service, 'fda')
  assert.ok(!/Khách kiểm thử|0912345678|test@example.com|Bánh kẹo/.test(JSON.stringify(events)))
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'))
  assert.ok(await page.evaluate(() => document.activeElement.textContent.includes('Nhận tư vấn đăng ký FDA')))
  console.log('PASS: keyboard trigger, FDA default, error/retry/success, lead counted once, no PII, focus restoration')

  await clickText('Nhận tư vấn và báo giá FDA')
  await page.waitForSelector('[role="dialog"]', { visible: true })
  assert.equal(await page.$eval('[role="dialog"] input[type="email"]', el => el.value), '')
  await page.click('[role="dialog"] button[type="submit"]')
  assert.equal(requests.length, 2, 'Required fields must stop empty submits')
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'))
  await page.$eval('#faq details', el => el.open = true)
  assert.ok(await page.$eval('#faq details', el => el.open))
  console.log('PASS: final CTA, reset, required fields, Escape, native FAQ')

  await page.setViewport({ width: 1440, height: 1000 })
  await page.goto(`${base}/services/us-agent`, { waitUntil: 'networkidle0', timeout: 120000 })
  await page.click('button[aria-haspopup="dialog"]')
  await page.waitForSelector('[role="dialog"]', { visible: true })
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'))
  await clickText('Yêu cầu tư vấn')
  await page.waitForSelector('[role="dialog"]', { visible: true })
  console.log('PASS: existing children-trigger and controlled header-dialog flows')
} finally {
  await browser.close()
}
