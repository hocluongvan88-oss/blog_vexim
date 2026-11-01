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
  writeFileSync(path.join(out, "homepage-schema.md"), `# Schema trang chủ Vexim Global — bản hiện tại

Bản này được sinh từ cấu hình đang dùng trong repository, không lấy lại dữ liệu cũ hoặc tự thêm giá, tọa độ, đánh giá khách hàng.

- Domain: **https://www.veximglobal.com** (khớp canonical/OG/sitemap).
- Email: **contact@veximglobal.com**. Điện thoại: **+84373685634**.
- Địa chỉ: **25/6/51 Ngọa Long, Tây Tựu, Hà Nội**.
- Slogan: **Tử Tế - Tận Tâm - Trách Nhiệm**.
- Giờ làm việc: thứ Hai–thứ Sáu 08:00–18:00; thứ Bảy 08:00–12:00. Chủ nhật nghỉ, không khai lịch mở cửa.
- Facebook/LinkedIn/Zalo: URL doanh nghiệp đã cung cấp; không dùng URL quản trị.
- Logo 824×543; ảnh trang chủ/OG 1200×630.
- Danh mục: 6 dịch vụ, mỗi dịch vụ có URL và @id khớp landing page.

## Cách sử dụng

Trong ứng dụng Next.js này, layout xuất Organization/LocalBusiness, Logo và WebSite; trang chủ xuất WebPage, ảnh và Service. Không chèn thêm nguyên khối bên dưới vào ứng dụng vì sẽ lặp dữ liệu đã có.

Khối bên dưới là bản gộp tương đương để sao chép sang hệ thống khác hoặc đưa vào công cụ kiểm tra. Nếu dùng thay bản cũ, **thay toàn bộ khối cũ**, không giữ đồng thời các URL non-www.

Hai khối JSON-LD khác nhau vẫn liên kết được qua @id; không bắt buộc tất cả nằm trong một thẻ script.

## JSON-LD hoàn chỉnh

\`\`\`html
<script type="application/ld+json">
${json}
</script>
\`\`\`

## Ghi chú kiểm tra

- ProfessionalService được Schema.org đánh dấu deprecated; dùng LocalBusiness cho đơn vị có địa chỉ công khai, Service cho dịch vụ được cung cấp.
- openingHoursSpecification thuộc Place; LocalBusiness kế thừa cả Place và Organization.
- provider đặt trên Service; availableLanguage chỉ khai trong ContactPoint, không đặt trực tiếp trên Service.
- Không dùng priceRange “$$” khi chưa có căn cứ; không tự thêm geo, mã bưu chính, số giấy phép, review hoặc aggregateRating.
- sameAs chỉ gồm các hồ sơ mạng xã hội đã xác nhận. Link hồ sơ năng lực fda.veximglobal.com vẫn hiển thị ở phần căn cứ website, không dùng như hồ sơ định danh mạng xã hội.
- Đây là dữ liệu xác minh theo code và HTML local. Chưa kiểm tra production hoặc chạy Rich Results Test/Schema Markup Validator trực tuyến. Schema hợp lệ không đảm bảo Google hiển thị rich results.

Tạo lại sau khi đổi thông tin: \`npm run schema:export\`. Kiểm tra: \`npm run test:schema\`.
`)
  console.log("Generated docs/seo/homepage-schema.json and homepage-schema.md")
} finally {
  cleanup()
}
