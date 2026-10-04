/**
 * Kiểm thử trải nghiệm khung chat (góc nhìn NGƯỜI ĐI MUA DỊCH VỤ TƯ VẤN).
 *
 * Chạy:
 *   npx esbuild scripts/verify-chat/widget-ux.test.ts --bundle --platform=node \
 *     --format=cjs --alias:@=. --outfile=/tmp/ux.cjs && node /tmp/ux.cjs
 *
 * Vì sao cần — những điểm từng làm khách doanh nghiệp bỏ đi:
 *  1. Hiệu ứng gõ 15ms/ký tự: câu 500 ký tự bắt chờ 7,5 giây, và vì isLoading
 *     đã tắt nên khách gửi được tin thứ hai -> hai vòng lặp gõ làm lẫn nội dung.
 *  2. Không hiển thị được BẢNG dù câu hỏi ngành này rất hay ở dạng bảng.
 *  3. Chèn HTML thẳng bằng dangerouslySetInnerHTML -> lỗ hổng XSS.
 *  4. Không đóng được bằng Escape, không có vùng aria-live cho trình đọc màn hình.
 *  5. Ô chat trống, khách mới không biết hỏi gì.
 *  6. Không gửi được file, không nhận được bản tóm tắt qua email.
 */
import { readFileSync } from "fs"
import { parseChatMarkdown, hasTable, isSafeHref, parseInline } from "@/lib/chat-markdown"

let pass = 0
let fail = 0
const check = (ok: boolean, msg: string) => {
  ok ? pass++ : fail++
  console.log(`${ok ? "PASS" : "FAIL"} ${msg}`)
}

const widget = readFileSync("components/chat-widget.tsx", "utf8")

/* ---------- 1. Không còn chờ chữ hiện dần ---------- */
check(!/typingSpeed/.test(widget), "Đã bỏ hiệu ứng gõ từng ký tự (khách không phải chờ 7,5 giây)")
// (Vẫn còn setInterval cho việc hỏi lại lịch sử mỗi 8s/20s — đó là chủ ý, không phải lỗi.)
check(
  !/currentIndex/.test(widget) && !/substring\(0, currentIndex\)/.test(widget),
  "Không còn vòng lặp gõ chữ -> không còn lỗi trộn nội dung hai câu trả lời",
)
check(!/isStreaming/.test(widget), "Bỏ hẳn trạng thái isStreaming (nguồn của lỗi trên)")
check(
  /message_text: fullMessage/.test(widget),
  "Câu trả lời hiện ra ngay khi nhận được",
)

/* ---------- 2. Bảng markdown ---------- */
const tableText = [
  "| Thị trường | Thời gian | Lưu ý |",
  "| --- | --- | --- |",
  "| FDA (Mỹ) | 1–2 ngày | nếu đã có DUNS |",
  "| GACC | 15–30 ngày | chỉ nhóm chế biến |",
].join("\n")
check(hasTable(tableText), "Nhận ra bảng markdown từ câu trả lời của AI")
const table = parseChatMarkdown(tableText)[0]
check(table.type === "table", "Dòng bảng được đọc thành khối bảng, không phải đoạn văn")
if (table.type === "table") {
  check(table.header.length === 3, `Bảng có 3 cột (${table.header.length})`)
  check(table.rows.length === 2, `Bảng có 2 hàng dữ liệu (${table.rows.length})`)
  check(
    JSON.stringify(table.rows[1][1]) === JSON.stringify([{ type: "text", text: "15–30 ngày" }]),
    "Ô trong bảng được đọc đúng nội dung",
  )
}
check(
  !hasTable("Bảng giá tham khảo | liên hệ để biết thêm"),
  "Câu văn có một dấu | không bị nhận nhầm thành bảng",
)

/* ---------- 3. An toàn: không còn innerHTML, chặn link độc ---------- */
check(!/dangerouslySetInnerHTML/.test(widget.replace(/KHÔNG dùng dangerouslySetInnerHTML[^\n]*/g, "")),
  "Khung chat không còn chèn HTML thẳng (bịt lỗ hổng XSS)")
check(isSafeHref("https://veximglobal.com") && isSafeHref("tel:0373685634"), "Cho phép link http/https/tel")
check(!isSafeHref("javascript:alert(1)") && !isSafeHref("data:text/html,x"), "Chặn javascript: và data:")
const unsafe = parseChatMarkdown("Xem [tại đây](javascript:alert(1)) nhé")
check(
  !JSON.stringify(unsafe).includes('"link"'),
  "Link độc không được dựng thành thẻ <a>",
)

/* ---------- 4. Markdown cơ bản vẫn chạy ---------- */
const rich = parseChatMarkdown("**Đậm** và *nghiêng* và `code` và [Vexim](https://veximglobal.com)")
check(JSON.stringify(rich).includes('"strong"'), "Vẫn hiểu **in đậm**")
check(JSON.stringify(rich).includes('"em"'), "Vẫn hiểu *in nghiêng*")
check(JSON.stringify(rich).includes('"code"'), "Vẫn hiểu `code`")
check(JSON.stringify(rich).includes('"link"'), "Vẫn dựng được link an toàn")
const list = parseChatMarkdown("- Bước 1: kiểm DUNS\n- Bước 2: đăng ký cơ sở")[0]
check(list.type === "list" && list.items.length === 2, "Danh sách gạch đầu dòng đọc đúng")
check(parseChatMarkdown("1. Nộp hồ sơ\n2. Chờ duyệt")[0].type === "list", "Danh sách số đọc đúng")
check(parseInline("").length === 0, "Dòng rỗng không sinh phần tử rác")
check(parseChatMarkdown("").length === 0, "Nội dung rỗng không sinh khối rác")

/* ---------- 5. Bàn phím & trình đọc màn hình ---------- */
check(/event\.key === "Escape"/.test(widget), "Bấm Escape đóng được khung chat")
check(/role="log"/.test(widget) && /aria-live="polite"/.test(widget),
  "Tin nhắn mới được trình đọc màn hình thông báo")
check(!/<p className="sr-only" aria-live="polite">/.test(widget),
  "Không tạo vùng thông báo trùng (mỗi tin chỉ đọc một lần)")
check(/aria-label="Gửi tin nhắn"/.test(widget), "Nút gửi có nhãn cho trình đọc màn hình")

/* ---------- 6. Điện thoại ---------- */
check(/100dvh/.test(widget), "Chiều cao khung chat không vượt quá màn hình điện thoại")
check(!/h-\[600px\] w-96/.test(widget), "Bỏ chiều cao 600px cố định")

/* ---------- 7. Khách mới biết hỏi gì ---------- */
check(/QUICK_QUESTIONS/.test(widget), "Có câu hỏi gợi ý ở màn hình trống")
const quickCount = (widget.match(/^\s*"[^"]+\?",?$/gm) || []).length
check(quickCount >= 4, `Có ít nhất 4 câu hỏi gợi ý (${quickCount})`)
check(/sendMessage\(question\)/.test(widget), "Bấm gợi ý là hỏi được ngay")
check(/onClick=\{\(\) => sendMessage\(\)\}/.test(widget),
  "Nút gửi không truyền sự kiện click vào tham số câu hỏi (lỗi cũ)")

/* ---------- 8. Gửi file ---------- */
check(/type="file"/.test(widget), "Khung chat có nút đính kèm file")
check(/\/api\/chatbot\/upload/.test(widget), "Gọi API tải file lên")
check(/has_file: Boolean\(attachment\)/.test(widget) && /attachment_url/.test(widget),
  "Tin nhắn kèm file gửi đủ thông tin để chuyển chuyên viên")
check(/accept="\.pdf,\.png/.test(widget), "Chỉ nhận định dạng hồ sơ hợp lệ (PDF, ảnh, Word, Excel)")

const upload = readFileSync("app/api/chatbot/upload/route.ts", "utf8")
check(/MAX_FILE_BYTES = 10 \* 1024 \* 1024/.test(upload), "Giới hạn file 10MB")
check(/allowed_mime_types|ALLOWED_TYPES/.test(upload), "Chặn định dạng file không hợp lệ")
check(/findOrCreateConversation/.test(upload), "Gửi file ngay khi chưa có hội thoại vẫn chạy")
check(/chat-attachments/.test(upload), "Lưu file vào bucket riêng của khung chat")

const sendAi = readFileSync("app/api/chatbot/send-ai/route.ts", "utf8")
check(/hasFile: has_file === true/.test(sendAi), "File gửi lên kích hoạt rule chuyển chuyên viên (LQ-04)")
check(!/hasFile: false, \/\/ TODO/.test(sendAi), "Bỏ chỗ 'TODO: Add file detection' cũ")

/* ---------- 9. Bản tóm tắt qua email ---------- */
check(/\/api\/chatbot\/email-summary/.test(widget), "Khách xin được bản tóm tắt qua email")
const emailRoute = readFileSync("app/api/chatbot/email-summary/route.ts", "utf8")
check(/emailService\.sendEmail/.test(emailRoute), "Gửi email thật qua Zoho SMTP")
check(/escapeHtml/.test(emailRoute), "Nội dung email được escape (không chèn HTML từ tin nhắn)")
check(/VEXIM_PHONE_DISPLAY/.test(emailRoute), "Email có số liên hệ chính thức của Vexim")
check(/EMAIL_PATTERN/.test(emailRoute), "Kiểm tra định dạng email trước khi gửi")

/* ---------- 10. Không hứa quá lời ---------- */
check(!/Trả lời ngay 24\/7/.test(widget), "Bỏ dòng 'Trả lời ngay 24/7' (chuyên viên không trực 24/7)")
check(/Chuyên viên trong giờ làm việc/.test(widget), "Nói rõ chuyên viên chỉ trực trong giờ làm việc")

/* ---------- 11. AI trả lời có cấu trúc ---------- */
const aiService = readFileSync("lib/ai-service.ts", "utf8")
check(/BẢNG markdown/.test(aiService), "Prompt cho phép AI dùng bảng cho câu hỏi kỹ thuật")
check(!/Tối đa 3–4 câu cho mỗi lần trả lời/.test(aiService),
  "Bỏ giới hạn cứng 3–4 câu (câu hỏi kỹ thuật cần đủ ý)")
check(/Câu xã giao \(chào hỏi, cảm ơn\): 1–2 câu/.test(aiService),
  "Vẫn giữ ngắn gọn với câu xã giao")

/* ---------- 12. Bằng chứng năng lực (hồ sơ năng lực) ---------- */
const credentialsUrl = "https://fda.veximglobal.com"
check(
  readFileSync("lib/contact-info.ts", "utf8").includes("VEXIM_CREDENTIALS_URL"),
  "Trang hồ sơ năng lực là một hằng số dùng chung, không rải rác trong code",
)
check(widget.includes("VEXIM_CREDENTIALS_URL"), "Khung chat có link tới hồ sơ năng lực để khách kiểm chứng")
check(
  widget.includes("Xem hồ sơ năng lực") && widget.includes("Hồ sơ năng lực, chứng nhận FDA"),
  "Link xuất hiện ở màn hình trống và trong thẻ tư vấn",
)
check(
  widget.includes("Vexim đã hỗ trợ doanh nghiệp nào xuất Mỹ?"),
  "Có câu hỏi gợi ý về uy tín — câu người đi mua dịch vụ luôn muốn hỏi",
)

const credentials = readFileSync("knowledge/ho-so-nang-luc-vexim.md", "utf8")
check(credentials.includes("200 doanh nghiệp"), "Tài liệu nêu số doanh nghiệp đã hỗ trợ (200+)")
check(credentials.includes("35-2957758"), "Tài liệu có EIN thật của Vexim (US Agent trực tiếp)")
check(credentials.includes("10048679256") && credentials.includes("17721772358"),
  "Tài liệu có mã đăng ký FDA đã được cấp (bằng chứng kiểm chứng được)")
check(credentials.includes("LIBRA") && credentials.includes("3/2026"),
  "Có case study Libra đã thông quan cảng Mỹ 3/2026")
check(credentials.includes("KHÔNG được bịa thêm"), "Tài liệu tự nhắc chỉ dùng số liệu có thật")
check(credentials.includes("1–2 ngày") && credentials.includes("5–8 ngày"),
  "Tài liệu chỉ dùng mốc chuẩn 1–2 ngày / 5–8 ngày")
// Chủ doanh nghiệp chốt: chỉ MỘT mốc thời gian. Mọi con số khác phải bị gỡ khỏi
// tài liệu, khỏi prompt và khỏi giao diện để khách không nhận hai câu trả lời khác nhau.
const staleTimeline = /2[–-]5 ngày|3[–-]5 ngày/
check(!staleTimeline.test(credentials), "Tài liệu năng lực đã gỡ hẳn mốc '2–5 ngày'")

check(!staleTimeline.test(widget), "Khung chat đã gỡ hẳn mốc '2–5 ngày'")

const playbook = readFileSync("lib/sales-playbook.ts", "utf8")
check(/CÓ UY TÍN KHÔNG/.test(playbook), "Cẩm nang dạy AI trả lời câu hỏi về uy tín bằng bằng chứng thật")
check(/không bịa thêm tên khách hàng/.test(playbook), "Cẩm nang chặn AI bịa tên khách hàng/số liệu")
check(playbook.includes("https://fda.veximglobal.com"), "Cẩm nang kèm link để khách tự kiểm chứng")
check(/MỐC THỜI GIAN DUY NHẤT/.test(playbook), "Prompt chốt chỉ dùng một mốc thời gian duy nhất")
check(/Không dùng bất kỳ con số nào khác/.test(playbook),
  "Prompt cấm AI dùng con số thời gian khác, kể cả khi khách nhắc lại")
check(!staleTimeline.test(playbook), "Prompt của AI đã gỡ hẳn mốc '2–5 ngày'")
// Bằng chứng năng lực phải LUÔN có trong prompt, không phụ thuộc việc tìm tài liệu
check(/BẰNG CHỨNG NĂNG LỰC/.test(playbook) && playbook.includes("200 doanh nghiệp"),
  "Bằng chứng năng lực luôn nằm trong prompt (RAG có thể không tìm ra đoạn ngắn)")
check(playbook.includes("35-2957758") && playbook.includes("LIBRA"),
  "Prompt có EIN và case study thật để trả lời câu hỏi về uy tín")

console.log(`\n${pass} PASS / ${fail} FAIL`)
if (fail) process.exit(1)
