/**
 * Kiểm chứng phần sinh id cho heading + ảnh (chống CLS) của module blog.
 *
 * Chạy (từ thư mục gốc dự án):
 *   npx esbuild scripts/verify-seo/anchors.test.ts --bundle --platform=node --format=cjs \
 *     --jsx=automatic --alias:@=. --outfile=/tmp/anchors.test.cjs && node /tmp/anchors.test.cjs
 */

import { blocksToHTML } from "@/lib/blocks-to-html"
import { ensureHeadingAnchors, buildHeadingAnchors, slugifyHeading } from "@/lib/heading-anchors"

let pass = 0
let fail = 0
function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    pass++
    console.log("PASS", name)
  } else {
    fail++
    console.log("FAIL", name, extra ?? "")
  }
}

const blocks = [
  { id: "1", type: "paragraph", data: { text: "Mở bài ngắn." } },
  { id: "2", type: "heading", data: { level: 2, text: "Đăng ký FDA là gì?" } },
  { id: "3", type: "paragraph", data: { text: "Trả lời ngay trong 40 từ đầu." } },
  { id: "4", type: "heading", data: { level: 3, text: "Chi phí & thời gian" } },
  {
    id: "5",
    type: "image",
    data: {
      url: "https://x.test/a.jpg",
      alt: "<strong>Nhãn FDA</strong>",
      caption: "Hình 1",
      width_px: 1600,
      height_px: 900,
      width: "100%",
      align: "center",
    },
  },
  { id: "6", type: "heading", data: { level: 2, text: "Đăng ký FDA là gì?" } },
  { id: "7", type: "heading", data: { level: 2, text: "!!!" } },
] as any

const html = blocksToHTML(blocks)
check("h2 đầu có id slug tiếng Việt", html.includes('id="dang-ky-fda-la-gi"'), html)
check("h3 có id", html.includes('id="chi-phi-thoi-gian"'), html)
check("heading trùng tên được đánh số", html.includes('id="dang-ky-fda-la-gi-2"'), html)
check("heading rỗng/ký tự lạ rơi về slug 'muc'", html.includes('id="muc"'), html)
check("heading có class scroll-mt-24", /<h2[^>]*scroll-mt-24/.test(html), html)
check("ảnh có width/height chống CLS", html.includes('width="1600"') && html.includes('height="900"'), html)
check("alt không lọt thẻ HTML", html.includes('alt="Nhãn FDA"'), html)
check("không còn thẻ <strong> trong alt", !/alt="[^"]*<strong>/.test(html))

const ensured = ensureHeadingAnchors(html)
check("ensureHeadingAnchors giữ nguyên id (idempotent)", ensured.html === html, ensured.html.slice(0, 200))
check(
  "danh sách heading khớp số h2/h3 trong HTML",
  ensured.headings.length === (html.match(/<h[23]\b/g) || []).length,
  ensured.headings,
)
check("text heading lấy đúng", ensured.headings[0]?.text === "Đăng ký FDA là gì?", ensured.headings[0])

// Bài lưu dạng HTML thô (không phải JSON block) — trước đây không có id nào
const rawHtml =
  '<h2>Quy trình GACC</h2><p>Nội dung</p><h3 id="co-san">Hồ sơ cần gì?</h3><h2>Quy trình GACC</h2>'
const raw = ensureHeadingAnchors(rawHtml)
check("HTML thô: heading thiếu id được bù", raw.html.includes('id="quy-trinh-gacc"'), raw.html)
check("HTML thô: giữ id có sẵn", raw.html.includes('id="co-san"'), raw.html)
check("HTML thô: chống trùng id", raw.html.includes('id="quy-trinh-gacc-2"'), raw.html)
check("HTML thô: heading dùng được cho mục lục", raw.headings.length === 3 && raw.headings[1].id === "co-san", raw.headings)
check("HTML thô: chạy lại vẫn ổn định", ensureHeadingAnchors(raw.html).html === raw.html)

check(
  "buildHeadingAnchors bỏ qua block không phải heading",
  buildHeadingAnchors(blocks).length === 4,
  buildHeadingAnchors(blocks),
)
check(
  "slugifyHeading xử lý tiếng Việt + độ dài",
  slugifyHeading("ĐĂNG KÝ FDA: Điều kiện & Thủ tục (2026)").startsWith("dang-ky-fda-dieu-kien"),
  slugifyHeading("ĐĂNG KÝ FDA: Điều kiện & Thủ tục (2026)"),
)

console.log(`\n${pass} PASS / ${fail} FAIL`)
process.exit(fail === 0 ? 0 : 1)
