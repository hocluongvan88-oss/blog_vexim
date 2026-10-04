/**
 * Kiểm thử EMAIL HỒ SƠ KHÁCH HÀNG gửi cho admin.
 *
 * Chạy:
 *   npx esbuild scripts/verify-chat/lead-summary-email.test.ts --bundle --platform=node \
 *     --format=cjs --alias:@=. --outfile=/tmp/leadmail.cjs && node /tmp/leadmail.cjs
 *
 * Vì sao cần: đây là kênh duy nhất báo cho chủ doanh nghiệp biết "có khách đã đủ
 * thông tin, gọi lại đi" mà không phải ngồi canh trang quản trị. Ba thứ phải đúng:
 *  - Đúng người nhận (hocluongvan88@gmail.com + email đã cấu hình trong Admin).
 *  - Đủ thông tin để gọi lại (số điện thoại/Zalo, thị trường, sản phẩm, DUNS).
 *  - KHÔNG dội email: chỉ gửi khi hồ sơ thay đổi.
 */
import { readFileSync } from "fs"
import {
  DEFAULT_LEAD_SUMMARY_EMAIL,
  buildLeadSummaryEmail,
  escapeHtml,
  leadSummaryKey,
  leadSummaryRecipients,
  shouldEmailLeadSummary,
} from "@/lib/lead-summary-email"
import { HANDOFF_CONNECT_QUESTION } from "@/lib/lead-profile"

let pass = 0
let fail = 0
const check = (ok: boolean, msg: string) => {
  ok ? pass++ : fail++
  console.log(`${ok ? "PASS" : "FAIL"} ${msg}`)
}

/* ---------- 1. Người nhận ---------- */
check(
  DEFAULT_LEAD_SUMMARY_EMAIL === "hocluongvan88@gmail.com",
  "Mặc định gửi về đúng email chủ doanh nghiệp đưa (hocluongvan88@gmail.com)",
)
check(
  leadSummaryRecipients().includes(DEFAULT_LEAD_SUMMARY_EMAIL),
  "Không cấu hình gì thì vẫn gửi về email chủ doanh nghiệp",
)
const withStaff = leadSummaryRecipients(["sale@veximglobal.com", DEFAULT_LEAD_SUMMARY_EMAIL])
check(
  withStaff.length === 2 && withStaff.includes("sale@veximglobal.com"),
  "Có cấu hình thêm email chuyên viên thì gửi cho cả hai, không lặp địa chỉ",
)
check(
  !leadSummaryRecipients(["khong-phai-email", ""]).some((email) => !email.includes("@")),
  "Bỏ qua chuỗi không phải email khi ai đó nhập sai trong Cài đặt",
)
process.env.ADMIN_LEAD_SUMMARY_EMAIL = "owner@khac.com"
check(
  leadSummaryRecipients()[0] === "owner@khac.com",
  "Đổi được người nhận bằng biến môi trường ADMIN_LEAD_SUMMARY_EMAIL",
)
delete process.env.ADMIN_LEAD_SUMMARY_EMAIL

/* ---------- 2. Chỉ gửi khi có hồ sơ & có gì mới ---------- */
const emptyProfile = {}
check(leadSummaryKey(emptyProfile) === "", "Khách mới chỉ chào hỏi -> chưa có hồ sơ để gửi")
check(!shouldEmailLeadSummary(emptyProfile, {}), "Không gửi email khi chưa tổng hợp được gì")

const profile1 = { market: "FDA", hasDuns: false }
check(shouldEmailLeadSummary(profile1, {}), "Đủ thông tin -> gửi email cho admin")
const key1 = leadSummaryKey(profile1)
check(
  !shouldEmailLeadSummary(profile1, { lead_summary_email_key: key1 }),
  "Khách nhắn thêm vài câu giống nhau -> KHÔNG gửi lại (chống dội email)",
)
const profile2 = { ...profile1, phone: "0912345678" }
check(
  leadSummaryKey(profile2) !== key1 && shouldEmailLeadSummary(profile2, { lead_summary_email_key: key1 }),
  "Khách để lại số điện thoại -> hồ sơ đổi -> gửi lại bản mới",
)
const profile3 = { market: "FDA", hasDuns: true }
check(
  leadSummaryKey(profile3) !== leadSummaryKey({ market: "FDA", hasDuns: false }),
  "Đã có DUNS khác chưa có DUNS -> tính là thông tin thay đổi",
)

/* ---------- 3. Nội dung email đủ để gọi lại cho khách ---------- */
const fullProfile = {
  market: "FDA",
  productGroup: "processed",
  hasDuns: false,
  phone: "0912345678",
  companyName: "Công ty TNHH Bình Minh",
}
const { subject, html } = buildLeadSummaryEmail({
  profile: fullProfile,
  messages: [
    { sender_type: "customer", message_text: "Bên mình báo giá FDA bao nhiêu?" },
    { sender_type: "bot", message_text: "Em đã ghi nhận thông tin ạ." },
  ],
  conversationId: "abcd1234-5678-90ab-cdef-1234567890ab",
  siteUrl: "https://www.veximglobal.com",
})

check(subject.includes("0912345678"), "Tiêu đề có số điện thoại để chuyên viên thấy ngay")
check(subject.includes("FDA"), "Tiêu đề nêu thị trường khách cần đăng ký")
check(html.includes('href="tel:0912345678"'), "Số điện thoại bấm gọi được ngay trên điện thoại")
check(html.includes("hocluongvan88") === false, "Không lộ địa chỉ admin trong nội dung gửi đi")
check(html.includes("Công ty TNHH Bình Minh"), "Có tên công ty khách khai")
check(html.includes("Sản phẩm chế biến"), "Có nhóm sản phẩm")
check(html.includes("Chưa có mã DUNS"), "Nói rõ tình trạng mã DUNS")
check(/5–8 ngày/.test(html), "Có mốc thời gian dự kiến đúng chuẩn Vexim (chưa có DUNS -> 5–8 ngày)")
check(html.includes(escapeHtml(HANDOFF_CONNECT_QUESTION)), "Có câu hỏi chốt đã gửi khách")
check(html.includes("/admin/conversations"), "Có link mở trang quản trị để xem cả hội thoại")
check(
  html.includes("abcd1234"),
  "Có mã hội thoại ngắn để chuyên viên đối chiếu nhanh",
)
check(html.includes("Bên mình báo giá FDA bao nhiêu?"), "Có nội dung khách đã trao đổi")

/* ---------- 4. Chống chèn HTML qua dữ liệu khách ---------- */
const xss = buildLeadSummaryEmail({
  profile: { market: "FDA", companyName: '<script>alert("x")</script>' },
  messages: [{ sender_type: "customer", message_text: "<img src=x onerror=alert(1)>" }],
})
check(!xss.html.includes("<script>"), "Tên công ty chứa mã lạ không chèn được script vào email")
check(!xss.html.includes("<img src=x"), "Nội dung chat chứa mã lạ cũng bị vô hiệu hoá")

/* ---------- 5. Nối vào luồng chat ---------- */
const route = readFileSync("app/api/chatbot/send-ai/route.ts", "utf8")
check(
  route.includes("shouldSummarizeAndInvite(leadProfile, message_text)"),
  "Chỉ gửi khi trợ lý đã tổng hợp thông tin (đủ 4 thông tin hoặc khách hỏi giá)",
)
check(
  route.includes("after(async () => {") && route.includes("sendLeadSummaryEmail("),
  "Gửi email SAU khi trả lời khách (after) — khách không phải chờ thêm",
)
// Phải await BÊN TRONG after() (nếu không email có thể bị cắt khi hàm kết thúc),
// nhưng KHÔNG được await trong luồng chính — nếu không mỗi lượt chat chậm 1–3 giây.
const afterIndex = route.indexOf("after(async () => {")
const awaitIndex = route.indexOf("await sendLeadSummaryEmail")
check(
  afterIndex !== -1 && awaitIndex > afterIndex,
  "Email chỉ được await bên trong after() — luồng trả lời khách không bị chậm",
)
const service = readFileSync("lib/notification-service.tsx", "utf8")
check(
  service.includes('"admin_notification_emails"'),
  "Gửi thêm cho các email đã cấu hình ở Admin → Cài đặt → Thông báo",
)
check(
  service.includes("lead_summary_email_key") && service.includes("lead_summary_emailed_at"),
  "Lưu dấu đã gửi vào metadata hội thoại để chống gửi trùng",
)
check(
  service.includes("if (!shouldEmailLeadSummary("),
  "Dùng chung hàm quyết định với phần kiểm thử (không viết lại logic ở hai nơi)",
)

/* ---------- 6. Không gửi 2 email cho cùng một thời điểm ---------- */
check(
  service.includes("skipEmail") && service.includes("if (payload.skipEmail)"),
  "Có cờ bỏ kênh email khi email hồ sơ đã gửi trong cùng lượt",
)
check(
  route.includes("const summaryEmailGoingOut =") &&
    (route.match(/skipEmail: summaryEmailGoingOut/g) || []).length >= 3,
  "Cả 3 nhánh thông báo (chuyển chuyên viên / xin liên hệ / lead nóng) đều tránh gửi email trùng",
)
check(
  route.includes("shouldEmailLeadSummary(leadProfile, convMetadata)"),
  "Chỉ bỏ email thông báo khi email hồ sơ THẬT SỰ sẽ được gửi",
)

console.log(`\n${pass} PASS / ${fail} FAIL`)
if (fail) process.exit(1)
