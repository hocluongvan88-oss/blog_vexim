// Real sidebar components, isolated fixtures only: no production routes, credentials or writes.
import assert from "node:assert/strict"
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"
import { execFileSync } from "node:child_process"
import { createServer } from "node:http"
import postcss from "postcss"
import tailwind from "@tailwindcss/postcss"
import puppeteer from "puppeteer-core"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const scratch = mkdtempSync(path.join(tmpdir(), "vexim-blog-sidebar-"))
const screenshots = process.env.BLOG_SIDEBAR_SCREENSHOT_DIR
const bundle = (entry, output, platform, extra = []) => execFileSync("npx", [
  "--yes", "esbuild@0.25.12", `scripts/fixtures/blog-sidebar/${entry}`,
  "--bundle", `--outfile=${scratch}/${output}`, `--platform=${platform}`, "--jsx=automatic",
  '--define:process.env.NODE_ENV="development"',
  `--alias:next/link=${root}/scripts/fixtures/post-editor/link.tsx`, ...extra,
], { cwd: root, stdio: "inherit" })
const row = (id, published_at, extra = {}) => ({
  id, title: `Bài kiểm thử ${id}: hướng dẫn xuất khẩu cho doanh nghiệp Việt Nam`, slug: id,
  category: "FDA", status: "published", featured_image: null, published_at,
  created_at: "2026-01-01T00:00:00Z", views_count: 1, ...extra,
})
const rows = [
  row("old-high-views", "2025-01-01T00:00:00Z", { views_count: 999999 }),
  row("current", "2026-10-15T00:00:00Z"),
  row("draft-newer", "2026-10-16T00:00:00Z", { status: "draft" }),
  row("new-low-views", "2026-10-14T18:00:00Z"),
  row("same-date-b", "2026-10-13T00:00:00Z"),
  row("same-date-a", "2026-10-13T00:00:00Z"),
  row("created-tiebreak", "2026-10-13T00:00:00Z", { created_at: "2026-02-01T00:00:00Z" }),
  row("older", "2026-10-12T00:00:00Z"),
  row("no-publish-date", null, { created_at: "2026-10-16T00:00:00Z" }),
]
let browser, server
try {
  bundle("server.ts", "server.cjs", "node", [`--alias:@/lib/supabase/server=${root}/scripts/fixtures/blog-sidebar/database.ts`])
  const { RecentPosts, SidebarFixture, renderToStaticMarkup, renderToString, createElement } = createRequire(import.meta.url)(`${scratch}/server.cjs`)
  const run = async (props = {}, options = {}) => {
    globalThis.__recentPostsDb = { rows, calls: [], ...options }
    const component = await RecentPosts(props)
    return { markup: component ? renderToStaticMarkup(component) : "", calls: globalThis.__recentPostsDb.calls }
  }
  const latest = await run({ excludePostId: "current" })
  const slugs = [...latest.markup.matchAll(/href="\/blog\/([^"?]+)"/g)].map(match => match[1])
  assert.deepEqual(slugs, ["new-low-views", "created-tiebreak", "same-date-b", "same-date-a", "older"])
  assert.ok(latest.calls.some(call => call[0] === "eq" && call[1] === "status" && call[2] === "published"))
  assert.ok(latest.calls.some(call => call[0] === "neq" && call[1] === "id" && call[2] === "current"))
  assert.deepEqual(latest.calls.filter(call => call[0] === "order"), [
    ["order", "published_at", { ascending: false, nullsFirst: false }],
    ["order", "created_at", { ascending: false, nullsFirst: false }],
    ["order", "id", { ascending: false }],
  ])
  assert.match(latest.markup, /15\/10\/2026/, "Dates use Vietnam timezone, not the test machine timezone")
  assert.doesNotMatch(latest.markup, /lượt xem|phổ biến|draft-newer|old-high-views|\/blog\/current/)
  const index = await run({ limit: 1 })
  assert.match(index.markup, /href="\/blog\/current"/)
  assert.ok(!index.calls.some(call => call[0] === "neq"))
  for (const [limit, expected] of [[0, 1], [-2, 1], [2.9, 2], [100, 10], [NaN, 5]]) {
    const result = await run({ limit })
    assert.deepEqual(result.calls.find(call => call[0] === "limit"), ["limit", expected])
  }
  for (const options of [{ rows: [] }, { failCreate: true }, { failResult: true }]) {
    assert.equal((await run({}, options)).markup, "", "No fake fallback posts or empty panel on backend failure")
  }
  const fallback = await run({}, { rows: [row("legacy", null)] })
  assert.match(fallback.markup, /01\/01\/2026/)
  const invalid = await run({}, { rows: [row("invalid-date", "invalid")] })
  assert.doesNotMatch(invalid.markup, /<time|Invalid Date/)
  const articleSource = readFileSync(path.join(root, "app/blog/[slug]/page.tsx"), "utf8")
  const indexSource = readFileSync(path.join(root, "app/blog/page.tsx"), "utf8")
  assert.match(articleSource, /<RecentPosts excludePostId=\{post.id\}/)
  assert.match(articleSource, /<BlogSidebarRail className="hidden lg:block">/)
  assert.match(articleSource, /<aside className="hidden min-w-0 xl:block">/)
  assert.match(indexSource, /<BlogSidebarRail offsetElementId="blog-category-filter">/)
  for (const source of [articleSource, indexSource]) assert.doesNotMatch(source, /PopularPosts/)
  console.log("PASS: published-only recent query, stable newest-first ordering, exclusion, timezone, limits, empty/error handling and page wiring")

  if (!process.env.BROWSER_EXECUTABLE_PATH) {
    console.log("Browser checks skipped; set BROWSER_EXECUTABLE_PATH to run viewport/scroll/keyboard/no-JS assertions.")
  } else {
    if (screenshots) mkdirSync(screenshots, { recursive: true })
    bundle("client.tsx", "client.js", "browser")
    const css = await postcss([tailwind({ base: root })]).process(readFileSync(path.join(root, "app/globals.css"), "utf8"), { from: path.join(root, "app/globals.css") })
    writeFileSync(`${scratch}/page.css`, css.css)
    server = createServer((req, res) => {
      const url = new URL(req.url, "http://localhost")
      if (req.method !== "GET") { res.writeHead(405); res.end("Read-only fixture"); return }
      if (["/client.js", "/page.css"].includes(url.pathname)) {
        res.setHeader("Content-Type", url.pathname.endsWith(".js") ? "text/javascript" : "text/css")
        res.end(readFileSync(`${scratch}${url.pathname}`)); return
      }
      if (url.pathname === "/placeholder.svg") {
        res.setHeader("Content-Type", "image/svg+xml")
        res.end('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#e2e8f0"/></svg>'); return
      }
      if (url.pathname !== "/") { res.writeHead(404); res.end(); return }
      const fixture = { recentMarkup: latest.markup, mode: url.searchParams.get("mode") || "article" }
      const markup = renderToString(createElement(SidebarFixture, fixture))
      res.setHeader("Content-Type", "text/html; charset=utf-8")
      res.end(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/page.css"></head><body><div id="root">${markup}</div><script>window.__sidebarFixture=${JSON.stringify(fixture).replace(/</g, "\\u003c")}</script><script src="/client.js"></script></body></html>`)
    })
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve))
    const origin = `http://127.0.0.1:${server.address().port}`
    browser = await puppeteer.launch({ executablePath: process.env.BROWSER_EXECUTABLE_PATH, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] })
    const page = await browser.newPage()
    const errors = []
    page.on("pageerror", error => errors.push(error.message))
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()) })
    const tick = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const noOverflow = async label => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: no horizontal overflow`)
    for (const width of [320, 390, 768, 1024, 1280, 1568, 1920]) {
      await page.setViewport({ width, height: 900 })
      for (const mode of ["article", "index"]) {
        await page.goto(`${origin}/?mode=${mode}`, { waitUntil: "networkidle0" })
        await noOverflow(`${mode}/${width}`)
        const visible = await page.$eval('aside[aria-label="Thanh bên blog"]', el => getComputedStyle(el).display !== "none")
        assert.equal(visible, mode === "index" || width >= 1024)
        if (width < 1024) {
          if (mode === "index") {
            const flow = await page.$eval('aside[aria-label="Thanh bên blog"]', el => ({ position: getComputedStyle(el).position, maxHeight: getComputedStyle(el.firstElementChild).maxHeight }))
            assert.equal(flow.position, "static")
            assert.equal(flow.maxHeight, "none")
          }
          continue
        }
        const padding = await page.$eval('[aria-labelledby="recent-posts-title"]', el => ({ padding: getComputedStyle(el).paddingTop, gap: el.firstElementChild.getBoundingClientRect().top - el.getBoundingClientRect().top }))
        assert.equal(padding.padding, "0px")
        assert.ok(padding.gap <= 1.1, "Navy header starts directly at the card border")
        for (const top of [450, 1700]) {
          await page.evaluate(top => window.scrollTo({ top, behavior: "instant" }), top)
          await tick()
          const rail = await page.$eval('aside[aria-label="Thanh bên blog"]', el => ({ top: el.getBoundingClientRect().top, headerBottom: document.querySelector("[data-test-header]").getBoundingClientRect().bottom, regionHeight: el.firstElementChild.getBoundingClientRect().height, expectedTop: document.getElementById("blog-category-filter") ? Math.ceil(84 + document.getElementById("blog-category-filter").getBoundingClientRect().height + 16) : 96 }))
          assert.equal(Math.round(rail.top), rail.expectedTop, `${mode}/${width}: sticky below fixed header`)
          assert.ok(rail.top >= rail.headerBottom + 15)
          assert.ok(rail.regionHeight <= 900 - rail.expectedTop - 16 + 1)
          if (mode === "article" && width >= 1280) assert.equal(Math.round(await page.$eval("[data-test-toc] nav", el => el.getBoundingClientRect().top)), 96, "TOC also remains sticky")
        }
        if (screenshots && mode === "article" && [1280, 1568].includes(width)) await page.screenshot({ path: path.join(screenshots, `article-${width}.png`) })
        await page.focus("#sidebar-name")
        await tick()
        const field = await page.$eval("#sidebar-name", el => ({ top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom, scrolled: el.closest('[role="region"]').scrollTop }))
        assert.ok(field.scrolled > 0 && field.top >= 96 && field.bottom <= 900 - 16, "Keyboard focus reveals consultation fields inside rail")
        await page.focus('aside[aria-label="Thanh bên blog"] [role="region"]')
        await page.keyboard.press("End")
        await page.waitForFunction(() => {
          const rail = document.querySelector('aside[aria-label="Thanh bên blog"] [role="region"]')
          return rail.scrollTop + rail.clientHeight >= rail.scrollHeight - 2
        })
        const service = await page.$eval('aside[aria-label="Thanh bên blog"] a[href="/services/export-sales"]', el => el.textContent.trim())
        assert.equal(service, "Nền tảng kết nối B2B")
        assert.ok(!await page.$eval('aside[aria-label="Thanh bên blog"]', el => el.textContent.includes("Tại sao chọn Vexim")))
        await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }))
        await tick()
        assert.ok(await page.evaluate(() => document.querySelector('aside[aria-label="Thanh bên blog"]').getBoundingClientRect().bottom <= document.querySelector("[data-test-footer]").getBoundingClientRect().top + 1), "Rail stops before footer")
      }
    }
    // Resize without navigation: the live category bar may wrap to more/fewer rows.
    await page.setViewport({ width: 1024, height: 900 })
    await page.goto(`${origin}/?mode=index`, { waitUntil: "networkidle0" })
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }))
    const beforeResize = await page.$eval('aside[aria-label="Thanh bên blog"]', el => el.style.getPropertyValue("--blog-sidebar-top"))
    await page.setViewport({ width: 1920, height: 900 })
    await page.waitForFunction(before => {
      const rail = document.querySelector('aside[aria-label="Thanh bên blog"]')
      const filter = document.getElementById("blog-category-filter")
      return rail.style.getPropertyValue("--blog-sidebar-top") !== before && Math.round(rail.getBoundingClientRect().top) === Math.ceil(84 + filter.getBoundingClientRect().height + 16)
    }, {}, beforeResize)
    await page.setViewport({ width: 1280, height: 600 })
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])
    await page.goto(origin, { waitUntil: "networkidle0" })
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }))
    await tick()
    assert.ok(await page.$eval('aside[aria-label="Thanh bên blog"] [role="region"]', el => el.getBoundingClientRect().height <= 489), "Short viewport/reduced motion retains bounded rail")
    if (screenshots) await page.screenshot({ path: path.join(screenshots, "article-short-viewport.png") })
    const noJs = await browser.newPage()
    await noJs.setJavaScriptEnabled(false)
    await noJs.setViewport({ width: 1280, height: 900 })
    await noJs.goto(origin, { waitUntil: "networkidle0" })
    assert.equal(await noJs.$$eval('[aria-labelledby="recent-posts-title"] a', els => els.length), 5)
    await noJs.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }))
    assert.equal(Math.round(await noJs.$eval('aside[aria-label="Thanh bên blog"]', el => el.getBoundingClientRect().top)), 96)
    await noJs.goto(`${origin}/?mode=index`, { waitUntil: "networkidle0" })
    assert.equal(await noJs.$$eval('[aria-labelledby="recent-posts-title"] a', els => els.length), 5)
    assert.equal(await noJs.$eval('aside[aria-label="Thanh bên blog"]', el => getComputedStyle(el).position), "static", "Index without JS safely uses normal flow instead of overlapping the category bar")
    assert.deepEqual(errors, [], "No hydration or runtime errors")
    console.log("PASS: actual components at 320–1920px; header padding; sticky rail/TOC; form focus; keyboard scrolling; footer boundary; mobile flow; short viewport/reduced motion; server-rendered/no-JS list and sticky")
  }
} finally {
  delete globalThis.__recentPostsDb
  await browser?.close()
  if (server) await new Promise(resolve => server.close(resolve))
  rmSync(scratch, { recursive: true, force: true })
}
