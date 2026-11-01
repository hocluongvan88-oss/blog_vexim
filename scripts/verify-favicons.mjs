import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import sharp from "sharp"
import ts from "typescript"
import { load } from "cheerio"

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const expected = new Map([
  ["/favicon.png", 96],
  ["/apple-icon.png", 180],
  ["/icon-192.png", 192],
  ["/icon-512.png", 512],
  ["/icon-dark-32x32.png", 32],
  ["/icon-light-32x32.png", 32],
])
async function verifyPng(bytes, size, label) {
  assert.deepEqual(bytes.subarray(0, 8), pngSignature, `${label}: real PNG, not renamed JPEG/HTML`)
  const metadata = await sharp(bytes).metadata()
  assert.equal(metadata.format, "png", label)
  assert.equal(metadata.width, size, label)
  assert.equal(metadata.height, size, label)
  assert.ok((await sharp(bytes).stats()).entropy > 0.1, `${label}: not a blank icon`)
}
for (const [url, size] of expected) await verifyPng(readFileSync(`public${url}`), size, url)
assert.ok(readFileSync("public/favicon.png").length < 15000)

const iconModule = ts.transpileModule(readFileSync("lib/site-icons.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText
const { SITE_ICONS } = await import(
  `data:text/javascript;base64,${Buffer.from(iconModule).toString("base64")}`
)
assert.deepEqual(SITE_ICONS, {
  icon: [{ url: "/favicon.png", type: "image/png", sizes: "96x96" }],
  apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
})
assert.match(readFileSync("app/layout.tsx", "utf8"), /icons:\s*SITE_ICONS/)
// Next file-convention icons take precedence over metadata; don't silently
// introduce another competing homepage favicon alongside the stable PNG.
for (const file of [
  "favicon.ico",
  "icon.png",
  "icon.svg",
  "icon.jpg",
  "icon.tsx",
  "apple-icon.png",
  "apple-icon.tsx",
])
  assert.equal(existsSync(`app/${file}`), false, `Unexpected root file-convention icon: ${file}`)

const manifest = JSON.parse(readFileSync("public/manifest.json", "utf8"))
for (const item of manifest.icons) {
  assert.ok(expected.has(item.src), `Unvalidated manifest icon: ${item.src}`)
  assert.equal(item.type, "image/png")
  assert.equal(item.sizes, `${expected.get(item.src)}x${expected.get(item.src)}`)
  if (item.purpose.split(" ").includes("maskable")) {
    const { data, info } = await sharp(`public${item.src}`)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const center = (info.width - 1) / 2
    for (let y = 0; y < info.height; y++)
      for (let x = 0; x < info.width; x++) {
        const index = (y * info.width + x) * info.channels
        if (Math.min(...data.subarray(index, index + 3)) < 245)
          assert.ok(
            Math.hypot(x - center, y - center) <= info.width * 0.4,
            `${item.src}: maskable safe circle`,
          )
      }
  }
}
const ico = readFileSync("public/favicon.ico")
assert.equal(ico.readUInt16LE(0), 0)
assert.equal(ico.readUInt16LE(2), 1)
assert.equal(ico.readUInt16LE(4), 2)
let offset = 6 + 16 * 2
for (const [i, size] of [32, 48].entries()) {
  const entry = 6 + i * 16
  assert.equal(ico[entry], size)
  assert.equal(ico[entry + 1], size)
  assert.equal(ico.readUInt32LE(entry + 12), offset)
  const length = ico.readUInt32LE(entry + 8)
  await verifyPng(ico.subarray(offset, offset + length), size, `favicon.ico frame ${size}`)
  offset += length
}
assert.equal(offset, ico.length)
console.log(
  "PASS: genuine square PNGs; exact metadata/manifest sizes; shared Vexim V; maskable safe area; valid ICO fallback",
)

const base = process.env.FAVICON_TEST_BASE_URL
if (base) {
  // A user-agent smoke test is not proof that a real Google IP bypasses the CDN/WAF.
  // Production validation must also use URL Inspection/server logs.
  for (const userAgent of ["Mozilla/5.0", "Googlebot", "Googlebot-Image/1.0"]) {
    for (const [url, size] of expected) {
      const response = await fetch(base + url, { headers: { "User-Agent": userAgent } })
      assert.equal(response.status, 200, `${userAgent} ${url}`)
      assert.match(response.headers.get("content-type"), /^image\/png(?:;|$)/)
      assert.ok(!response.headers.get("set-cookie"), `${url}: public asset must not create a session`)
      assert.ok(!/noindex|none/i.test(response.headers.get("x-robots-tag") || ""))
      await verifyPng(Buffer.from(await response.arrayBuffer()), size, url)
    }
    const response = await fetch(base + "/", { headers: { "User-Agent": userAgent } })
    assert.equal(response.status, 200, `${userAgent} homepage`)
    const $ = load(await response.text())
    const icons = $("link[rel='icon']")
    assert.equal(icons.length, 1, "One explicit primary favicon in raw SSR HTML")
    assert.equal(new URL(icons.attr("href"), base).pathname, "/favicon.png")
    assert.equal(icons.attr("sizes"), "96x96")
    assert.equal(icons.attr("type"), "image/png")
    const apple = $("link[rel='apple-touch-icon']")
    assert.equal(apple.length, 1)
    assert.equal(new URL(apple.attr("href"), base).pathname, "/apple-icon.png")
    assert.equal(apple.attr("sizes"), "180x180")
    assert.equal(apple.attr("type"), "image/png")
  }
  const fallback = await fetch(base + "/favicon.ico")
  assert.equal(fallback.status, 200)
  assert.match(fallback.headers.get("content-type"), /^image\/(?:x-icon|vnd\.microsoft\.icon)(?:;|$)/)
  assert.deepEqual(Buffer.from(await fallback.arrayBuffer()), ico)
  const robots = await fetch(base + "/robots.txt")
  assert.equal(robots.status, 200)
  assert.ok(!/^Disallow:\s*\/(?:favicon|apple-icon|icon-|\s*$)/im.test(await robots.text()))
  console.log(
    "PASS: raw homepage icon links; public icon HTTP 200/MIME/decode/no session for browser and crawler UAs; ICO and robots",
  )
}
