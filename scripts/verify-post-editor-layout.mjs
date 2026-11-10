// Renders the actual create/edit client pages with mocked routing/data, not a
// production auth bypass. Never writes to Supabase or sends an AI request.
import assert from "node:assert/strict"
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"
import { createServer } from "node:http"
import postcss from "postcss"
import tailwind from "@tailwindcss/postcss"
import puppeteer from "puppeteer-core"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const executablePath = process.env.BROWSER_EXECUTABLE_PATH
assert.ok(executablePath, "Set BROWSER_EXECUTABLE_PATH to Chromium")
const scratch = mkdtempSync(path.join(tmpdir(), "vexim-editor-layout-"))
const screenshots = process.env.POST_EDITOR_SCREENSHOT_DIR
if (screenshots) mkdirSync(screenshots, { recursive: true })
const title =
  "Đăng ký FDA cho thực phẩm xuất khẩu sang Mỹ: Khi nào nhà máy cần đăng ký? Hướng dẫn cho doanh nghiệp Việt Nam"
const blocks = [
  { id: "fixture-heading", type: "heading", data: { level: 2, text: title, align: "left" } },
  {
    id: "fixture-paragraph",
    type: "paragraph",
    data: {
      text: "Nhà máy, kho hay công ty thương mại cần đăng ký FDA? Xem cách xác định cơ sở phải đăng ký, chuẩn bị DUNS, U.S. Agent và hồ sơ cho lô hàng đầu tiên.",
      align: "justify",
    },
  },
]
const snapshot = {
  title,
  slug: "dang-ky-fda-thuc-pham",
  category: "FDA",
  blocks,
  excerpt: "Hướng dẫn chuẩn bị hồ sơ đăng ký FDA cho doanh nghiệp thực phẩm xuất khẩu sang Mỹ.",
  metaTitle: "",
  metaDescription: "",
  featuredImage: "",
  featuredImageAlt: "",
  focusKeyword: "đăng ký FDA",
}
const writes = []
let browser, server
try {
  execFileSync(
    "npx",
    [
      "--yes",
      "esbuild@0.25.12",
      "scripts/fixtures/post-editor/page.tsx",
      "--bundle",
      `--outfile=${scratch}/page.js`,
      "--platform=browser",
      "--format=esm",
      "--jsx=automatic",
      '--define:process.env.NODE_ENV="development"',
      `--alias:next/navigation=${root}/scripts/fixtures/post-editor/navigation.ts`,
      `--alias:next/link=${root}/scripts/fixtures/post-editor/link.tsx`,
    ],
    { cwd: root, stdio: "inherit" },
  )
  const css = await postcss([tailwind({ base: root })]).process(
    readFileSync(path.join(root, "app/globals.css"), "utf8"),
    {
      from: path.join(root, "app/globals.css"),
    },
  )
  writeFileSync(path.join(scratch, "page.css"), css.css)
  // Keep the frame consistent with the production admin layout, without
  // executing its server-side authentication against a real database.
  assert.match(
    readFileSync(path.join(root, "app/admin/(dashboard)/layout.tsx"), "utf8"),
    /className="min-w-0 flex-1 w-full"/,
  )
  server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost")
    res.setHeader("Cache-Control", "no-store")
    if (url.pathname.startsWith("/api/")) {
      res.setHeader("Content-Type", "application/json")
      if (req.method !== "GET") {
        let data = ""
        for await (const chunk of req) data += chunk
        writes.push({ method: req.method, path: url.pathname, data: JSON.parse(data) })
        res.end(JSON.stringify({ id: "layout-fixture" }))
      } else if (url.pathname === "/api/posts/layout-fixture") {
        res.end(JSON.stringify({ ...snapshot, content: JSON.stringify(blocks), status: "draft" }))
      } else res.end(JSON.stringify(url.pathname.includes("search") ? { results: [] } : []))
      return
    }
    if (["/page.js", "/page.css"].includes(url.pathname)) {
      res.setHeader("Content-Type", url.pathname.endsWith(".js") ? "text/javascript" : "text/css")
      res.end(readFileSync(path.join(scratch, url.pathname.slice(1))))
      return
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.end(
      '<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/page.css"><div id="root"></div><script type="module" src="/page.js"></script></html>',
    )
  })
  await new Promise((resolve) => server.listen(0, "0.0.0.0", resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  })
  for (const mode of ["new", "edit"]) {
    const page = await browser.newPage()
    const errors = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("dialog", (dialog) => dialog.dismiss())
    await page.evaluateOnNewDocument((snapshot) => {
      if (location.pathname === "/new")
        localStorage.setItem("vexim-blog-draft-new", JSON.stringify({ savedAt: Date.now(), data: snapshot }))
    }, snapshot)
    await page.setViewport({ width: 1568, height: 1000 })
    await page.goto(`${base}/${mode}`, { waitUntil: "networkidle0" })
    if (mode === "new")
      await page.evaluate(() =>
        [...document.querySelectorAll("button")]
          .find((b) => b.textContent.includes("Khôi phục bản nháp"))
          .click(),
      )
    await page.waitForFunction((expected) => document.querySelector("#title")?.value === expected, {}, title)
    for (const width of [320, 390, 768, 1024, 1280, 1440, 1568, 1920]) {
      await page.setViewport({ width, height: 1000 })
      await page.waitForFunction(() => {
        const field = document.querySelector("#title")
        return field.clientHeight >= field.scrollHeight - 1 && field.clientWidth >= field.scrollWidth - 1
      })
      const geometry = await page.evaluate(() => {
        const title = document.querySelector("#title"),
          editor = document.querySelector(".block-editor-container")
        const sidebar = [...document.querySelectorAll("aside")].find((el) =>
          el.querySelector('[role="tablist"]'),
        )
        const grid = sidebar.parentElement
        const body = document.querySelector('[data-block-id="fixture-heading"]').parentElement
        const style = getComputedStyle(body)
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length,
          sidebarWidth: sidebar.getBoundingClientRect().width,
          sidebarTop: sidebar.getBoundingClientRect().top,
          editorBottom: editor.getBoundingClientRect().bottom,
          mainWidth: grid.firstElementChild.getBoundingClientRect().width,
          titleHeight: title.getBoundingClientRect().height,
          fontSize: parseFloat(getComputedStyle(title).fontSize),
          paddingLeft: style.paddingLeft,
          paddingRight: style.paddingRight,
        }
      })
      assert.equal(geometry.overflow, false, `${mode}: overflow at ${width}: ${JSON.stringify(geometry)}`)
      assert.ok(geometry.titleHeight > geometry.fontSize * 2, "Long title must wrap, not hide its ending")
      assert.equal(geometry.paddingLeft, geometry.paddingRight, "Balanced content canvas padding")
      assert.equal(geometry.columns, width < 1280 ? 1 : 2)
      if (width >= 1280) {
        assert.ok(Math.abs(geometry.sidebarWidth - (width < 1536 ? 300 : 340)) < 1)
        assert.ok(geometry.mainWidth > geometry.sidebarWidth, "Writing canvas must be wider than tools")
      } else
        assert.ok(geometry.sidebarTop >= geometry.editorBottom, "Tools stack below content on small screens")
      if (screenshots && width === 1568) {
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.evaluate(
          () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
        )
        await page.screenshot({ path: `${screenshots}/${mode}-1568.png` })
      }
    }
    // Exercise all sidebar tabs at its narrowest desktop width.
    await page.setViewport({ width: 1280, height: 1000 })
    for (const name of ["SEO", "AI & Gợi ý", "Thiết lập"]) {
      await page.evaluate(
        (name) =>
          [...document.querySelectorAll('[role="tab"]')].find((el) => el.textContent.includes(name)).click(),
        name,
      )
      await page.waitForFunction(() => document.querySelector('[role="tabpanel"][data-state="active"]'))
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `${name} sidebar overflows`,
      )
      assert.ok(
        await page.evaluate(() => {
          const tabs = document.querySelector('[role="tablist"]')
          const bounds = tabs.getBoundingClientRect()
          return [...tabs.querySelectorAll('[role="tab"]')].every((tab) => {
            const rect = tab.getBoundingClientRect()
            return rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1
          })
        }),
        `${name}: tab buttons fit inside compact sidebar`,
      )
    }
    // Selected block toolbar must stay within the canvas, including mobile.
    for (const width of [320, 1280]) {
      await page.setViewport({ width, height: 1000 })
      await page.click('[data-block-id="fixture-heading"] h2')
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `Selected heading toolbar overflow at ${width}`,
      )
      const heading = await page.$eval('[data-block-id="fixture-heading"] h2', (el) => ({
        client: el.clientWidth,
        scroll: el.scrollWidth,
      }))
      assert.ok(heading.scroll <= heading.client + 1, "Heading text must wrap, including its quick controls")
    }
    // Long unbroken text/URLs must wrap inside both kinds of content blocks.
    await page.setViewport({ width: 320, height: 1000 })
    for (const selector of [
      '[data-block-id="fixture-heading"] h2',
      '[data-block-id="fixture-paragraph"] p',
    ]) {
      const original = await page.$eval(selector, (el) => el.innerHTML)
      await page.$eval(selector, (el) => {
        el.textContent = "DoanhNghiệpViệtNam".repeat(20)
        el.dispatchEvent(new Event("input", { bubbles: true }))
      })
      assert.ok(
        await page.$eval(selector, (el) => el.scrollWidth <= el.clientWidth + 1),
        `Unbroken block content: ${selector}`,
      )
      await page.$eval(
        selector,
        (el, html) => {
          el.innerHTML = html
          el.dispatchEvent(new Event("input", { bubbles: true }))
        },
        original,
      )
    }
    const setTitle = async (text) => {
      await page.$eval(
        "#title",
        (el, value) => {
          Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(el, value)
          el.dispatchEvent(new Event("input", { bubbles: true }))
        },
        text,
      )
      await page.waitForFunction(
        () =>
          document.querySelector("#title").scrollHeight <= document.querySelector("#title").clientHeight + 1,
      )
    }
    await setTitle("FDA " + "DoanhNghiệpViệtNam".repeat(20))
    assert.equal(
      await page.evaluate(
        () => document.querySelector("#title").scrollWidth > document.querySelector("#title").clientWidth,
      ),
      false,
    )
    await setTitle("FDA\nHướng dẫn đăng ký")
    assert.equal(await page.$eval("#title", (el) => el.value), "FDA Hướng dẫn đăng ký")
    await setTitle("FDA")
    const shortHeight = await page.$eval("#title", (el) => el.offsetHeight)
    await setTitle(title)
    assert.ok((await page.$eval("#title", (el) => el.offsetHeight)) > shortHeight)
    // IME Enter must not navigate away mid-composition; normal Enter still
    // takes the writer to the first editable block (previous behavior).
    await page.focus("#title")
    await page.$eval("#title", (el) =>
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", isComposing: true, bubbles: true })),
    )
    assert.equal(await page.evaluate(() => document.activeElement.id), "title")
    await page.keyboard.press("Enter")
    assert.equal(await page.evaluate(() => document.activeElement.hasAttribute("contenteditable")), true)
    // Width-only changes (focus mode) must trigger title remeasurement.
    await page.setViewport({ width: 1568, height: 1000 })
    await page.evaluate(() =>
      [...document.querySelectorAll("button")]
        .find((el) => el.title.startsWith("Ẩn bảng cài đặt bên phải"))
        .click(),
    )
    await page.waitForFunction(
      () => ![...document.querySelectorAll("aside")].some((el) => el.querySelector('[role="tablist"]')),
    )
    assert.equal(await page.$eval("#title", (el) => el.value), title)
    await page.evaluate(() =>
      [...document.querySelectorAll("button")]
        .find((el) => el.title.startsWith("Hiện bảng cài đặt bên phải"))
        .click(),
    )
    await page.waitForFunction(
      () =>
        document.querySelector("#title").scrollHeight <= document.querySelector("#title").clientHeight + 1,
    )
    // Save against the local fixture server only; no real post is created/edited.
    await page.evaluate(() =>
      [...document.querySelectorAll("button")].find((el) => el.textContent.trim() === "Lưu nháp").click(),
    )
    await page.waitForFunction(() => window.__navigations.includes("/admin/posts"))
    const saved = writes.at(-1)
    assert.equal(saved.method, mode === "new" ? "POST" : "PUT")
    assert.equal(saved.data.title, title)
    assert.equal(JSON.parse(saved.data.content)[0].data.text, title)
    assert.deepEqual(errors, [])
    await page.close()
    console.log(
      `PASS: ${mode} actual client page; 320–1920px; long title growth/shrink/resize/IME; balanced canvas; compact sidebar/tabs; selected toolbar; mocked draft save`,
    )
  }
} finally {
  if (browser) await browser.close()
  if (server) await new Promise((resolve) => server.close(resolve))
  rmSync(scratch, { recursive: true, force: true })
}
