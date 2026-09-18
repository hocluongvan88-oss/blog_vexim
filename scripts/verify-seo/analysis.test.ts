/**
 * Kiểm chứng bộ chấm điểm SEO (`lib/seo-analysis.ts`) + nguồn/gợi ý câu hỏi.
 *
 * Chạy (từ thư mục gốc dự án):
 *   npx esbuild scripts/verify-seo/analysis.test.ts --bundle --platform=node --format=cjs \
 *     --jsx=automatic --alias:@=. --outfile=/tmp/analysis.test.cjs && node /tmp/analysis.test.cjs
 */

import { analyzePostSeo, estimatePixelWidth, suggestQuestions } from "@/lib/seo-analysis"
import { getOfficialSources } from "@/lib/official-sources"

let pass = 0
let fail = 0
function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    pass++
    console.log("PASS", name)
  } else {
    fail++
    console.log("FAIL", name, JSON.stringify(extra))
  }
}
const msg = (a: any) => a.issues.map((i: any) => i.message).join(" | ")

/* ------------------------------- Bài viết tốt ------------------------------- */
const goodBlocks = [
  {
    id: "b0",
    type: "paragraph",
    data: {
      text: "Đăng ký FDA là thủ tục bắt buộc trước khi đưa thực phẩm vào thị trường Mỹ, thường mất từ một đến ba tuần và cần một US Agent đứng tên tại Hoa Kỳ.",
    },
  },
  { id: "b1", type: "heading", data: { level: 2, text: "Đăng ký FDA là gì?" } },
  {
    id: "b2",
    type: "paragraph",
    data: {
      text: "Đăng ký FDA là thủ tục bắt buộc để đưa thực phẩm vào Mỹ, do Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ quản lý và thường mất từ 1 đến 3 tuần.",
    },
  },
  { id: "b3", type: "heading", data: { level: 2, text: "Hồ sơ cần chuẩn bị gồm những gì?" } },
  { id: "b4", type: "list", data: { style: "ordered", items: ["Giấy phép kinh doanh", "Bản mô tả sản phẩm"] } },
  { id: "b5", type: "table", data: { headers: ["Loại hồ sơ", "Thời gian"], rows: [["FDA Food", "2 tuần"]] } },
  {
    id: "b6",
    type: "paragraph",
    data: {
      text: 'Theo <a href="https://www.fda.gov/food/food-facility-registration">hướng dẫn đăng ký cơ sở của FDA</a>, doanh nghiệp cần US Agent. Xem thêm <a href="/blog/gacc-la-gi">quy trình GACC</a> và <a href="/services/food/us-agent">dịch vụ US Agent</a>.',
    },
  },
  {
    id: "b7",
    type: "image",
    data: {
      url: "https://x.test/a.jpg",
      alt: "Hồ sơ đăng ký FDA",
      caption: "",
      width: "100%",
      align: "center",
      width_px: 1600,
      height_px: 900,
    },
  },
] as any

const good = analyzePostSeo({
  title: "Đăng ký FDA cho thực phẩm xuất khẩu: hồ sơ và thời gian",
  excerpt:
    "Hướng dẫn đăng ký FDA từng bước cho doanh nghiệp xuất khẩu thực phẩm sang Mỹ, kèm danh sách hồ sơ và thời gian xử lý thực tế.",
  metaTitle: "Đăng ký FDA cho thực phẩm xuất khẩu: hồ sơ, thời gian",
  metaDescription:
    "Hướng dẫn đăng ký FDA cho thực phẩm xuất khẩu sang Mỹ: hồ sơ cần chuẩn bị, thời gian xử lý và lỗi thường gặp.",
  focusKeyword: "đăng ký FDA",
  slug: "dang-ky-fda-thuc-pham",
  featuredImage: "https://x.test/cover.jpg",
  featuredImageAlt: "Hồ sơ đăng ký FDA",
  blocks: goodBlocks,
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  otherPosts: [{ id: "x", title: "Quy trình GACC cho nông sản" }],
})

check("bài tốt: không có lỗi mức error", !good.issues.some((i: any) => i.severity === "error"), good.issues)
check("bài tốt: readiness cao (>=80)", good.scores.readiness >= 80, good.scores)
check("bài tốt: technical cao (>=80)", good.scores.technical >= 80, good.scores)
check("bài tốt: nhận diện answer-first", good.counts.hasAnswerFirstIntro === true, good.counts)
check("bài tốt: nhận diện nguồn chính thống từ link fda.gov", good.counts.hasSources === true, good.counts)
check("bài tốt: đếm được bảng", good.counts.hasTable === true, good.counts)
check(
  "bài tốt: từ khóa nằm ở tiêu đề + thân bài + alt",
  good.info.focusKeywordPlacement.title === true && good.info.focusKeywordPlacement.alt === true,
  good.info.focusKeywordPlacement,
)

/* ------------------------------- Bài viết yếu ------------------------------- */
const bad = analyzePostSeo({
  title: "Đăng ký FDA GACC MFDS xuất khẩu thực phẩm mỹ phẩm thực phẩm chức năng giá rẻ nhất thị trường",
  excerpt: "Dịch vụ tốt.",
  metaTitle: "",
  metaDescription: "",
  focusKeyword: "dịch vụ",
  slug: "a",
  featuredImage: "",
  blocks: [
    { id: "c1", type: "heading", data: { level: 2, text: "Giới thiệu" } },
    { id: "c2", type: "paragraph", data: { text: "Chúng tôi làm tốt." } },
    {
      id: "c3",
      type: "image",
      data: { url: "https://x.test/small.jpg", alt: "", caption: "", width: "100%", align: "center", width_px: 600, height_px: 400 },
    },
  ] as any,
  publishedAt: "2020-01-01T00:00:00.000Z",
  updatedAt: "2020-01-01T00:00:00.000Z",
  otherPosts: [
    {
      id: "y",
      title: "Đăng ký FDA GACC MFDS xuất khẩu thực phẩm mỹ phẩm thực phẩm chức năng giá rẻ nhất thị trường",
    },
  ],
})

check("bài yếu: technical thấp hơn bài tốt", bad.scores.technical < good.scores.technical, bad.scores)
check("bài yếu: readiness thấp hơn bài tốt", bad.scores.readiness < good.scores.readiness, bad.scores)
check("bài yếu: cảnh báo thiếu nguồn chính thống", /nguồn|tham chiếu/i.test(msg(bad)), bad.issues)
check("bài yếu: cảnh báo thiếu FAQ/câu hỏi", /câu hỏi|FAQ/i.test(msg(bad)), bad.issues)
check("bài yếu: cảnh báo thiếu liên kết nội bộ", /liên kết/i.test(msg(bad)), bad.issues)
check("bài yếu: cảnh báo alt ảnh", /alt/i.test(msg(bad)), bad.issues)
check("bài yếu: cảnh báo ảnh bìa", /ảnh bìa/i.test(msg(bad)), bad.issues)
check("bài yếu: cảnh báo trùng tiêu đề với bài cũ", /trùng|tương tự/i.test(msg(bad)), bad.issues)
check("bài yếu: nhắc bài cũ cần cập nhật", /cập nhật|lâu/i.test(msg(bad)), bad.issues)
check("issue chỉ tới block cụ thể (Sửa ngay)", bad.issues.some((i: any) => i.blockId === "c3"), bad.issues)
check(
  "điểm luôn trong 0..100",
  [good, bad].every(
    (a: any) =>
      a.scores.technical >= 0 && a.scores.technical <= 100 && a.scores.readiness >= 0 && a.scores.readiness <= 100,
  ),
  [good.scores, bad.scores],
)

/* --------------------- Bài mở bằng heading (thiếu đoạn dẫn) --------------------- */
const noIntro = analyzePostSeo({
  title: "Quy trình GACC cho nông sản Việt Nam xuất khẩu",
  excerpt:
    "Hướng dẫn quy trình GACC cho doanh nghiệp nông sản xuất khẩu sang Trung Quốc theo Decree 248 và 249, kèm hồ sơ cần chuẩn bị.",
  metaTitle: "",
  metaDescription: "",
  focusKeyword: "quy trình GACC",
  featuredImage: "https://x.test/cover.jpg",
  featuredImageAlt: "Hồ sơ GACC",
  blocks: [
    { id: "d0", type: "heading", data: { level: 2, text: "Quy trình GACC là gì?" } },
    {
      id: "d1",
      type: "paragraph",
      data: {
        text: "Quy trình GACC gồm ba bước chính và thường mất vài tuần để hoàn tất hồ sơ đăng ký với hải quan Trung Quốc theo quy định mới nhất hiện hành. Doanh nghiệp cần chuẩn bị giấy phép kinh doanh, bản mô tả nhà máy và danh mục sản phẩm trước khi nộp.",
      },
    },
    {
      id: "d2",
      type: "paragraph",
      data: {
        text: 'Chi tiết tại <a href="https://www.customs.gov.cn/">hải quan Trung Quốc</a> và <a href="/services/gacc">trang dịch vụ GACC</a> cùng <a href="/blog/fda-la-gi">bài FDA</a>.',
      },
    },
  ] as any,
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

check(
  "thiếu đoạn mở đầu: vẫn chỉ được block để 'Sửa ngay'",
  noIntro.issues.some((i: any) => i.category === "ai" && i.blockId === "d0"),
  noIntro.issues,
)
check("thiếu đoạn mở đầu: thông điệp nói rõ cần thêm đoạn trước H2", /trước H2|đoạn trả lời/i.test(msg(noIntro)), noIntro.issues)

/* ------------------------------ Hàm hỗ trợ khác ------------------------------ */
check("ngân sách tiêu đề tính theo pixel", estimatePixelWidth("a".repeat(60)) > estimatePixelWidth("i".repeat(60)))
check("gợi ý câu hỏi theo ngành trả về mảng khác rỗng", suggestQuestions("đăng ký FDA", "FDA").length > 0, suggestQuestions("đăng ký FDA", "FDA"))
check("nguồn chính thống theo danh mục FDA", getOfficialSources("FDA").length >= 3, getOfficialSources("FDA"))
check("nguồn chính thống danh mục lạ vẫn có nguồn chung", getOfficialSources("Không tồn tại").length > 0)

console.log(`\n${pass} PASS / ${fail} FAIL`)
process.exit(fail === 0 ? 0 : 1)
