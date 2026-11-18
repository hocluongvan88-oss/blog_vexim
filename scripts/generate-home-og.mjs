// Reproduce the homepage social preview from the same local SVG/Inter assets.
// BROWSER_EXECUTABLE_PATH=/path/to/chromium corepack pnpm og:home
// Requires only the repo's puppeteer-core dependency and a local Chromium binary.
import { createServer } from "node:http"
import { readFileSync, statSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import puppeteer from "puppeteer-core"
import { loadSchemaBuilders } from "./schema-loader.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const browserPath = process.env.BROWSER_EXECUTABLE_PATH
const vietnamese = process.argv.includes("--vi")
if (!browserPath) throw new Error("Set BROWSER_EXECUTABLE_PATH to a local Chromium executable")

const { homeContent, cleanup } = loadSchemaBuilders()
const hero = homeContent.HOME_HERO[vietnamese ? "vi" : "en"]
cleanup()

const files = new Map([
  ["/trade/logo.svg", ["public/trade/logo.svg", "image/svg+xml"]],
  ["/home/export/routes.svg", ["public/home/export/routes.svg", "image/svg+xml"]],
  ["/fonts/inter-home-latin.woff2", ["public/fonts/inter-home-latin.woff2", "font/woff2"]],
  ["/fonts/be-vietnam-regular.woff2", ["app/fonts/BeVietnamPro-Regular.woff2", "font/woff2"]],
  ["/fonts/be-vietnam-bold.woff2", ["app/fonts/BeVietnamPro-Bold.woff2", "font/woff2"]],
])

const pageHtml = `<!doctype html><html lang="${vietnamese ? "vi" : "en"}"><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url('/fonts/inter-home-latin.woff2') format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:BeVietnam;src:url('/fonts/be-vietnam-regular.woff2') format('woff2');font-weight:400;font-display:block}
@font-face{font-family:BeVietnam;src:url('/fonts/be-vietnam-bold.woff2') format('woff2');font-weight:700;font-display:block}
*{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden}body{font-family:${vietnamese ? "BeVietnam" : "Inter"},Arial,sans-serif;color:#fff;background:#0b4937 radial-gradient(#2a624e 1px,transparent 1px) 0 0/20px 20px}
.canvas{position:relative;padding:48px 58px;height:100%}.brand{display:flex;align-items:center;gap:13px;font-size:24px;font-weight:700;letter-spacing:-.04em}.brand img{width:35px;height:35px;filter:brightness(0) saturate(100%) invert(78%) sepia(82%) saturate(802%) hue-rotate(337deg)}
.eyebrow{margin:67px 0 19px;color:#edeedc;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.eyebrow b{padding:4px 10px;margin-right:8px;background:#f5b63e;color:#13271c;border-radius:30px}.copy{position:relative;z-index:1;width:590px}
h1{margin:0;font-size:54px;line-height:1.12;letter-spacing:-.055em;text-wrap:balance}h1 span{display:block;color:#f5b63e}.scene{position:absolute;right:43px;top:162px;width:468px;padding:20px 13px 16px;background:#163c2f;border:1px solid #527460;border-radius:24px}.scene img{display:block;width:100%;height:auto}.scene b{display:block;padding:0 9px 8px;font-size:12px;letter-spacing:.13em;color:#e6eade}.scene small{display:block;padding:8px 9px 0;border-top:1px solid #385b47;color:#cadacb;font-size:13px}.bottom{position:absolute;bottom:36px;left:58px;right:58px;display:flex;justify-content:space-between;padding-top:18px;border-top:1px solid #53816a;font-size:13px;letter-spacing:.08em}
</style></head><body><div class="canvas"><div class="brand"><img src="/trade/logo.svg" alt="">VEXIM GLOBAL</div>
<div class="eyebrow"><b>B2B</b> ${hero.badge}</div><div class="copy"><h1>${hero.lead} <span>${hero.accent}</span></h1></div>
<div class="scene"><b>VIET NAM → GLOBAL</b><img src="/home/export/routes.svg" alt=""><small>${vietnamese ? "Kết nối trực tiếp với nhà nhập khẩu" : "Connecting food exporters with importers"}</small></div>
<div class="bottom"><span>VEXIMGLOBAL.COM</span><span>VEXIM TRADE　/　SEO &amp; GEO　/　WEB</span></div>
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
