import { mkdirSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { loadSchemaBuilders } from "./schema-loader.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const out = path.join(root, "docs", "seo")
const { builders, cleanup } = loadSchemaBuilders()
try {
  mkdirSync(out, { recursive: true })
  const json = JSON.stringify(builders.buildCompleteHomeSchema(), null, 2).replace(/</g, "\\u003c")
  writeFileSync(path.join(out, "homepage-schema.json"), `${json}\n`)
  writeFileSync(path.join(out, "homepage-schema.md"), `# Schema trang chủ Vexim Global — định vị B2B Digital Export

Được sinh từ code hiện tại. Không chép lại dữ liệu cũ và không tự thêm giá, tọa độ, số liệu thứ hạng hoặc chứng nhận.

- Canonical / OG / sitemap: **https://www.veximglobal.com**.
- Trang chủ WebPage: **en**; WebSite: tiếng Anh và tiếng Việt (blog/dịch vụ còn bằng tiếng Việt).
- Organization / LocalBusiness: một node chung toàn website, số điện thoại **+84373685634**, email **contact@veximglobal.com**, địa chỉ **25/6/51 Ngọa Long, Tây Tựu, Hà Nội**.
- Slogan doanh nghiệp được giữ như thông tin thương hiệu đã xác nhận; phần chữ nhìn thấy trên trang chủ đều tiếng Anh.
- Service chính: hạ tầng xuất khẩu B2B và Buyer-Intent SEO; ba phạm vi hợp tác được đề xuất: Core Launchpad, Global Growth Engine, Enterprise Dominance. Không có giá hoặc cam kết thứ hạng.
- FDA, GACC, MoCRA và US Agent là liên kết phụ; 6 định danh service trang dịch vụ trước đây vẫn giữ nguyên trên từng landing page, không còn là catalog chính của trang chủ.
- Ảnh trang chủ/OG là tệp thực 1200×630, không chứa số liệu minh họa như hiệu suất thật.

## Cách sử dụng

Root layout xuất Organization/LocalBusiness, Logo và WebSite. Trang chủ xuất WebPage, ImageObject, Vexim Trade Organization và Service. Dùng chung @id nhưng **không chèn** bản gộp này thêm lần nữa vào Next.js.

## JSON-LD hoàn chỉnh

\`\`\`html
<script type="application/ld+json">
${json}
</script>
\`\`\`

## Giới hạn

Schema phù hợp nội dung hiện tại của code; chưa xác nhận việc Google hiển thị rich results hay kết quả production. Không ngụ ý vị trí SEO hoặc chuyển đổi. Tạo lại bằng \`npm run schema:export\`, kiểm tra \`npm run test:schema\`.
`)
  console.log("Generated docs/seo/homepage-schema.json and homepage-schema.md")
} finally {
  cleanup()
}
