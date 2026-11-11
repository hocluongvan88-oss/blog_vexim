// Reproduce the two homepage social previews using only the new, original local art.
// BROWSER_EXECUTABLE_PATH=/path/to/chromium pnpm og:home [--vi]
import { createServer } from "node:http"
import { readFileSync, statSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import puppeteer from "puppeteer-core"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const browserPath = process.env.BROWSER_EXECUTABLE_PATH
const vietnamese = process.argv.includes("--vi")
if (!browserPath) throw new Error("Set BROWSER_EXECUTABLE_PATH to a local Chromium executable")

const files = new Map([
  ["/trade/logo.svg", ["public/trade/logo.svg", "image/svg+xml"]],
  ["/home/export-atelier.svg", ["public/home/export-atelier.svg", "image/svg+xml"]],
  ["/fonts/inter-home-latin.woff2", ["public/fonts/inter-home-latin.woff2", "font/woff2"]],
  ["/fonts/be-vietnam-regular.woff2", ["app/fonts/BeVietnamPro-Regular.woff2", "font/woff2"]],
  ["/fonts/be-vietnam-bold.woff2", ["app/fonts/BeVietnamPro-Bold.woff2", "font/woff2"]],
])

const pageHtml = `<!doctype html><html lang="${vietnamese ? "vi" : "en"}"><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url('/fonts/inter-home-latin.woff2') format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:BeVietnam;src:url('/fonts/be-vietnam-regular.woff2') format('woff2');font-weight:400;font-display:block}
@font-face{font-family:BeVietnam;src:url('/fonts/be-vietnam-bold.woff2') format('woff2');font-weight:700;font-display:block}
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{font-family:${vietnamese ? "BeVietnam" : "Inter"},Arial,sans-serif;color:#0b2748;background:linear-gradient(120deg,#fbfdff 0%,#f4f9fe 50%,#dbeeff 100%)}
.canvas{position:relative;width:1200px;height:630px;overflow:hidden;border-top:10px solid #0b315a}
.brand{position:absolute;top:52px;left:72px;display:flex;align-items:center;gap:11px;font-size:24px;font-weight:780;letter-spacing:-.065em}.brand img{width:43px;height:43px}.brand em{margin-left:.12em;color:#1767b3;font-style:normal;font-weight:575}
.eyebrow{position:absolute;top:158px;left:77px;color:#1b669f;font-size:11px;font-weight:740;letter-spacing:.12em}
h1{position:absolute;top:208px;left:72px;z-index:1;margin:0;max-width:665px;font-size:${vietnamese ? 49 : 54}px;font-weight:710;letter-spacing:-.055em;line-height:1.17}h1 span{color:#1767b3}
.sub{position:absolute;top:504px;left:76px;color:#49667f;font-size:15px;font-weight:540}
.scene{position:absolute;left:755px;top:167px;width:382px;height:362px;overflow:hidden;border:1px solid #bfd8ed;background:radial-gradient(circle at 47% 38%,#fafdff,#dceefb 76%)}
.scene:before{content:'';position:absolute;z-index:2;inset:12px;border:1px solid #bddaf0}.scene img{position:absolute;top:19px;left:-44px;display:block;width:470px;height:auto}
.bottom{position:absolute;left:76px;right:76px;bottom:31px;display:flex;align-items:center;justify-content:space-between;padding-top:15px;border-top:1px solid #bad1e5;color:#416580;font-size:10px;font-weight:690;letter-spacing:.07em}
</style></head><body><div class="canvas">
<div class="brand"><img src="/trade/logo.svg" alt=""><span>VEXIM<em>GLOBAL</em></span></div>
<div class="eyebrow">${vietnamese ? "HẠ TẦNG SỐ XUẤT KHẨU CÓ ĐỊNH HƯỚNG" : "DIGITAL EXPORT, BUILT WITH INTENTION"}</div>
<h1>${vietnamese ? "Hạ tầng số<br><span>B2B toàn cầu</span><br>&amp; Tăng tốc xuất khẩu" : "Global B2B Digital<br><span>Infrastructure</span><br>&amp; Export Acceleration"}</h1>
<p class="sub">${vietnamese ? "Xây dựng tại Việt Nam. Kết nối với thế giới." : "Built in Vietnam. Connected to the world."}</p>
<div class="scene"><img src="/home/export-atelier.svg" alt=""></div>
<div class="bottom"><span>VEXIMGLOBAL.COM</span><span>${vietnamese ? "NỀN TẢNG SỐ · TÌM KIẾM · KẾT NỐI THƯƠNG MẠI" : "OWNED PRESENCE · BUYER-INTENT SEARCH · TRADE CONNECTION"}</span></div>
</div></body></html>`

const server = createServer((req, res) => {
  const asset = files.get(new URL(req.url, "http://localhost").pathname)
  if (asset) {
    res.setHeader("Content-Type", asset[1])
    res.end(readFileSync(path.join(root, asset[0])))
  } else if (req.url === "/") {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.end(pageHtml)
  } else { res.writeHead(404); res.end() }
})
let browser
try {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve))
  browser = await puppeteer.launch({ executablePath: browserPath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: "networkidle0" })
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map(image => image.decode()))
  })
  const output = path.join(root, vietnamese ? "public/og-image-vi.jpg" : "public/og-image.jpg")
  await page.screenshot({ path: output, type: "jpeg", quality: 83 })
  const bytes = statSync(output).size
  if (bytes >= 300_000) throw new Error(`OG preview exceeds 300 KB budget: ${bytes} bytes`)
  console.log(`Generated ${output} (${Math.round(bytes / 1024)} KiB, 1200×630)`)
} finally {
  await browser?.close()
  server.close()
}
