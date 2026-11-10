// Reproduce the homepage social preview from the same local SVG/Inter assets.
// BROWSER_EXECUTABLE_PATH=/path/to/chromium corepack pnpm og:home
// Requires only the repo's puppeteer-core dependency and a local Chromium binary.
import { createServer } from "node:http"
import { readFileSync, statSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import puppeteer from "puppeteer-core"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const browserPath = process.env.BROWSER_EXECUTABLE_PATH
if (!browserPath) throw new Error("Set BROWSER_EXECUTABLE_PATH to a local Chromium executable")

const files = new Map([
  ["/trade/logo.svg", ["public/trade/logo.svg", "image/svg+xml"]],
  ["/home/export-network.svg", ["public/home/export-network.svg", "image/svg+xml"]],
  ["/fonts/inter-home-latin.woff2", ["public/fonts/inter-home-latin.woff2", "font/woff2"]],
])

const pageHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url('/fonts/inter-home-latin.woff2') format('woff2');font-weight:100 900;font-display:block}
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden}body{font-family:Inter,Arial,sans-serif;color:#1d1d1f;background:radial-gradient(circle at 86% 58%,#dbeaff 0,transparent 38%),linear-gradient(150deg,#fff 2%,#f8faff 75%,#f1f6ff)}
.canvas{position:relative;width:1200px;height:630px;padding:0 75px;overflow:hidden}
.brand{display:flex;align-items:center;gap:12px;position:absolute;top:49px;left:75px;font-size:25px;font-weight:740;letter-spacing:-.055em}.brand img{width:43px;height:43px}.brand em{color:#2471bf;font-style:normal;font-weight:550}
.eyebrow{position:absolute;top:145px;left:77px;color:#2668ac;font-size:12px;font-weight:730;letter-spacing:.095em}
h1{position:absolute;top:194px;left:72px;z-index:1;margin:0;font-size:59px;font-weight:710;letter-spacing:-.066em;line-height:1.115}h1 span{color:#1969c4;background:linear-gradient(95deg,#0071e3,#5e5ce6);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sub{position:absolute;top:468px;left:77px;color:#4d617c;font-size:16px;font-weight:510}
.scene{position:absolute;top:205px;left:645px;width:595px;height:299px;border:1px solid #dbe7fb;border-radius:30px;background:radial-gradient(circle at 45% 40%,#fff,#eaf3ff);overflow:hidden;box-shadow:0 22px 55px #4468a82b}.scene img{display:block;width:110%;height:auto;margin-left:-5%;margin-top:-3px}
.bottom{position:absolute;left:77px;right:76px;bottom:32px;display:flex;align-items:center;justify-content:space-between;padding-top:18px;border-top:1px solid #d5e1ef;color:#52657e;font-size:12px;font-weight:650;letter-spacing:.055em}
</style></head><body><div class="canvas">
<div class="brand"><img src="/trade/logo.svg" alt=""><span>VEXIM <em>GLOBAL</em></span></div>
<div class="eyebrow">THE NEXT-GEN EXPORT ACCELERATION ENGINE</div>
<h1>Global B2B Digital<br><span>Infrastructure &amp;</span><br>Export Acceleration</h1>
<p class="sub">Built in Vietnam. Designed for international buyers.</p>
<div class="scene"><img src="/home/export-network.svg" alt=""></div>
<div class="bottom"><span>VEXIMGLOBAL.COM</span><span>OWNED PRESENCE&nbsp;&nbsp; · &nbsp;&nbsp;BUYER-INTENT SEARCH&nbsp;&nbsp; · &nbsp;&nbsp;TRADE CONNECTION</span></div>
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
  const output = path.join(root, "public/og-image.jpg")
  await page.screenshot({ path: output, type: "jpeg", quality: 83 })
  const bytes = statSync(output).size
  if (bytes >= 300_000) throw new Error(`OG preview exceeds 300 KB budget: ${bytes} bytes`)
  console.log(`Generated ${output} (${Math.round(bytes / 1024)} KiB, 1200×630)`)
} finally {
  await browser?.close()
  server.close()
}
