/**
 * Kiểm thử luồng chat của khách trên website.
 *
 * Chạy:
 *   npx esbuild scripts/verify-chat/merge.test.ts --bundle --platform=node \
 *     --format=cjs --alias:@=. --outfile=/tmp/merge.cjs && node /tmp/merge.cjs
 *
 * Vì sao cần: đây là các lỗi đã từng xảy ra thật và rất khó thấy bằng mắt —
 * tin của khách bị nhân đôi sau mỗi nhịp cập nhật, khách không bao giờ thấy
 * câu trả lời của chuyên viên, hoặc widget không hiểu phản hồi của API.
 */
import { readFileSync } from "fs"
import { mergeIncomingMessages } from "@/lib/chat-message-merge"
import { shouldOfferConsultation, isSubstantiveQuestion } from "@/lib/consultation-offer"
import { formatVnPhone, VEXIM_PHONE, VEXIM_ZALO_URL, VEXIM_PHONE_DISPLAY } from "@/lib/contact-info"

let pass = 0
let fail = 0
const check = (ok: boolean, msg: string) => {
  ok ? pass++ : fail++
  console.log(`${ok ? "PASS" : "FAIL"} ${msg}`)
}

type Msg = { id: string | number; sender_type: string; message_text: string; created_at?: string }

const known = new Set<string>()
const localCustomer = new Set<string>()

// 1. Khách gửi tin -> hiện ngay với id tạm, đồng thời ghi nhớ nội dung
known.add("temp_1")
localCustomer.add("Phí FDA là bao nhiêu?")

// 2. DB trả về chính tin đó (id thật) + câu trả lời của bot
const history: Msg[] = [
  { id: "db-cust-1", sender_type: "customer", message_text: "Phí FDA là bao nhiêu?" },
  { id: "db-bot-1", sender_type: "bot", message_text: "Phí đăng ký FDA là 0 USD ạ." },
]
let result = mergeIncomingMessages<Msg>(history, known, localCustomer, { countUnread: true })
check(
  result.added.length === 1 && result.added[0].id === "db-bot-1",
  `Không nhân đôi tin của khách khi nạp lại lịch sử (thêm ${result.added.length} tin)`,
)
check(known.has("db-cust-1"), "Ghi nhớ id thật của tin khách để không xử lý lại")

// 3. Cập nhật lặp lại cùng dữ liệu -> không thêm gì
result = mergeIncomingMessages<Msg>(history, known, localCustomer, { countUnread: true })
check(result.added.length === 0, "Cập nhật lặp lại không thêm tin trùng")

// 4. Chuyên viên trả lời trong trang quản trị
result = mergeIncomingMessages<Msg>(
  [{ id: "db-agent-1", sender_type: "agent", message_text: "Em gửi báo giá nhé." }],
  known,
  localCustomer,
  { countUnread: true },
)
check(result.added.length === 1 && result.added[0].sender_type === "agent", "Tin của chuyên viên hiện được cho khách")
check(result.unread === 1, "Có tin mới khi khung chat đóng -> hiện chấm đỏ")

// 5. Khách gửi từ thiết bị khác vẫn hiển thị, nhưng không tính là chưa đọc
result = mergeIncomingMessages<Msg>(
  [{ id: "db-cust-2", sender_type: "customer", message_text: "Em cảm ơn anh" }],
  known,
  localCustomer,
  { countUnread: true },
)
check(result.added.length === 1, "Tin khách gửi từ thiết bị khác vẫn hiển thị")
check(result.unread === 0, "Tin của khách KHÔNG tính là chưa đọc")

// 6. Khung chat đang mở -> không đếm chưa đọc
result = mergeIncomingMessages<Msg>(
  [{ id: "db-bot-2", sender_type: "bot", message_text: "Anh cần hỗ trợ gì thêm không?" }],
  known,
  localCustomer,
)
check(result.added.length === 1 && result.unread === 0, "Khung chat đang mở -> không đếm tin chưa đọc")

// 7. Dữ liệu rỗng / lỗi mạng
check(mergeIncomingMessages<Msg>(null, known, localCustomer).added.length === 0, "Không có dữ liệu -> không lỗi")

// 8. Hợp đồng API: widget phải hiểu MỌI phản hồi mà /api/chatbot/send-ai trả về
const route = readFileSync("app/api/chatbot/send-ai/route.ts", "utf8")
const widget = readFileSync("components/chat-widget.tsx", "utf8")

for (const status of ["ok", "handed_over", "handoff", "ask_contact"]) {
  check(widget.includes(`data.status === "${status}"`), `Widget xử lý status "${status}"`)
}
check(
  widget.includes("throw new Error(data.error") && widget.includes('setConsultReason("error")'),
  'Widget xử lý status "error" (báo lỗi thân thiện + hiện số Zalo)',
)
check(route.includes('status: "handoff"'), "API vẫn trả status handoff (hợp đồng không đổi)")

// 9. Lịch sử chat đọc từ CSDL của Vexim, không gọi server cũ
const historyRoute = readFileSync("app/api/chatbot/history/route.ts", "utf8")
check(
  !/fetch\([`"'].*chatbot-six-wheat/.test(historyRoute) && !historyRoute.includes("CHATBOT_URL"),
  "Lịch sử chat không còn gọi server cũ bên ngoài",
)
check(historyRoute.includes('from("chat_messages")'), "Lịch sử chat đọc từ CSDL của Vexim")

// 10. Widget gắn lên website, ẩn trong /admin, tắt nút Zalo
const clientWidgets = readFileSync("components/client-widgets.tsx", "utf8")
check(clientWidgets.includes("<ChatWidget />"), "Trợ lý AI đã được gắn lên website")
check(clientWidgets.includes('startsWith("/admin")'), "Không hiện widget trong trang quản trị")
check(
  /const SHOW_ZALO_BUTTON = false/.test(clientWidgets) && clientWidgets.includes("{SHOW_ZALO_BUTTON && <ZaloChatButton />}"),
  "Nút Zalo OA đang TẮT (bật lại bằng SHOW_ZALO_BUTTON = true)",
)

// 11. Số Zalo/hotline chính thức
check(VEXIM_PHONE === "0373685634", "Số liên hệ chính thức là 0373685634")
check(formatVnPhone(VEXIM_PHONE) === "0373 685 634", `Hiển thị số dễ đọc: ${VEXIM_PHONE_DISPLAY}`)
check(formatVnPhone("0912345678") === "0912 345 678", "Định dạng số 10 chữ số bất kỳ")
check(formatVnPhone("abc") === "abc", "Chuỗi không phải số -> giữ nguyên, không lỗi")
check(VEXIM_ZALO_URL === "https://zalo.me/0373685634", `Link Zalo đúng số: ${VEXIM_ZALO_URL}`)

// 12. Khi nào mời khách tư vấn sâu hơn
const cases: Array<{ name: string; signals: Parameters<typeof shouldOfferConsultation>[0]; expect: boolean; reason?: string }> = [
  { name: "hệ thống chuyển chuyên viên", signals: { status: "handoff" }, expect: true, reason: "handoff" },
  { name: "hệ thống xin thông tin liên hệ", signals: { status: "ask_contact" }, expect: true, reason: "ask_contact" },
  { name: "hội thoại đã ở chế độ chuyên viên", signals: { status: "handed_over" }, expect: true, reason: "handed_over" },
  { name: "lỗi kết nối", signals: { status: "error" }, expect: true, reason: "error" },
  { name: "AI tự thấy cần người thật", signals: { status: "ok", suggestHandover: true }, expect: true, reason: "ai_suggested" },
  { name: "khách hỏi báo giá", signals: { status: "ok", customerMessage: "Cho em xin báo giá dịch vụ FDA với ạ" }, expect: true, reason: "deep_request" },
  { name: "khách xin tư vấn trực tiếp", signals: { status: "ok", customerMessage: "Có ai tư vấn trực tiếp không ạ?" }, expect: true, reason: "deep_request" },
  { name: "khách hỏi số điện thoại", signals: { status: "ok", customerMessage: "Cho em xin số điện thoại bên mình nhé" }, expect: true, reason: "deep_request" },
  { name: "khách hỏi số liên hệ", signals: { status: "ok", customerMessage: "Cho em xin số liên hệ" }, expect: true, reason: "deep_request" },
  { name: "khách hỏi hợp đồng", signals: { status: "ok", customerMessage: "Bên mình có ký hợp đồng không?" }, expect: true, reason: "deep_request" },
  { name: "không có tài liệu khớp + câu hỏi thật", signals: { status: "ok", sourcesCount: 0, customerMessage: "Thủ tục xuất khẩu thực phẩm sang Mỹ cần gì ạ?" }, expect: true, reason: "no_documents" },
  { name: "chào hỏi xã giao", signals: { status: "ok", sourcesCount: 0, customerMessage: "xin chào" }, expect: false },
  { name: "cảm ơn", signals: { status: "ok", sourcesCount: 0, customerMessage: "ok em cảm ơn nhé" }, expect: false },
  // Tra cứu thường mà AI CÓ tài liệu trả lời -> KHÔNG mời Zalo (tránh làm phiền khách)
  { name: "hỏi phí, AI có tài liệu trả lời", signals: { status: "ok", sourcesCount: 3, customerMessage: "Phí FDA là bao nhiêu?" }, expect: false },
  { name: "tra cứu thường, có tài liệu", signals: { status: "ok", sourcesCount: 2, customerMessage: "Hồ sơ GACC cần những gì?" }, expect: false },
]

for (const testCase of cases) {
  const decision = shouldOfferConsultation(testCase.signals)
  const ok = decision.offer === testCase.expect && (!testCase.reason || decision.reason === testCase.reason)
  check(ok, `Mời tư vấn sâu — ${testCase.name}: ${decision.offer ? decision.reason : "không mời"}`)
}

// 13. Câu hỏi thật vs câu xã giao
check(isSubstantiveQuestion("Thủ tục xuất khẩu thực phẩm sang Mỹ cần gì ạ?") === true, "Nhận ra câu hỏi thật")
check(isSubstantiveQuestion("ok") === false, "Không coi 'ok' là câu hỏi")
check(isSubstantiveQuestion("cảm ơn em") === false, "Không coi lời cảm ơn là câu hỏi")

// 14. Widget dùng đúng số chính thức, không còn số OA cũ
check(!widget.includes("2933050463560569889"), "Khung chat không còn dùng ID OA cũ")
check(widget.includes("VEXIM_ZALO_URL") && widget.includes("VEXIM_PHONE_DISPLAY"), "Khung chat lấy số từ lib/contact-info")
check(widget.includes("shouldOfferConsultation"), "Khung chat dùng chung logic mời tư vấn sâu")
check(widget.includes("CONSULTATION_CONTENT"), "Thẻ mời tư vấn nói theo từng ngữ cảnh")

// 15. AI cũng biết số để tự mời khách
const aiService = readFileSync("lib/ai-service.ts", "utf8")
check(aiService.includes("CONTACT_GUIDANCE"), "AI có hướng dẫn riêng về việc mời tư vấn sâu")
// Prompt cuối = system prompt + tài liệu tìm được + cẩm nang bán hàng
// + (ghi chú riêng cho lượt đó, ví dụ hội thoại đã chuyển chuyên viên — a2)
// + hướng dẫn liên hệ.
// Cẩm nang phải LUÔN có mặt (không phụ thuộc việc tìm tài liệu có ra hay không).
check(
  /config\.systemPrompt \+\s*\n?\s*context \+\s*\n?\s*buildSalesPlaybook\([^)]*\) \+\s*\n?\s*(?:\(extraInstructions \|\| ""\) \+\s*\n?\s*)?CONTACT_GUIDANCE/.test(
    aiService,
  ),
  "Cẩm nang bán hàng + hướng dẫn liên hệ luôn được ghép vào system prompt",
)

// 16. Không được hiện số hotline giả cho khách khi hệ thống lỗi
for (const file of ["app/api/chatbot/send-ai/route.ts", "app/api/chatbot/send/route.ts"]) {
  const source = readFileSync(file, "utf8")
  check(!source.includes("0123-456-789"), `${file}: không còn hotline giả 0123-456-789 trong thông báo lỗi`)
  check(
    source.includes("VEXIM_PHONE_DISPLAY"),
    `${file}: thông báo lỗi dùng số thật từ lib/contact-info`,
  )
}

// 17. Khung chat tự cuộn xuống khi có tin mới
check(widget.includes("messagesContainerRef"), "Khung tin nhắn có ref để tự cuộn")
check(widget.includes("onScroll={handleMessagesScroll}"), "Theo dõi vị trí cuộn của khách")
check(widget.includes("isAtBottomRef"), "Ghi nhớ khách có đang ở cuối khung không")
check(
  !/if \(isStreaming\) return/.test(widget),
  "Không còn chặn cuộn trong lúc AI gõ từng ký tự (nguyên nhân tin dài bị trôi khỏi tầm mắt)",
)
check(
  widget.includes("container.scrollTop = container.scrollHeight"),
  "Cuộn thẳng xuống đáy (không dùng smooth khi nội dung đang tăng liên tục)",
)
check(widget.includes("Tin nhắn mới nhất"), "Có nút quay xuống cuối khi khách kéo lên đọc lại")
check(
  /isAtBottomRef\.current = true\s*\n\s*setShowJumpToLatest\(false\)\s*\n\s*setMessages\(\(prev\) => \[\.\.\.prev, userMessage\]\)/.test(widget),
  "Khách vừa gửi tin -> luôn cuộn xuống dù trước đó đang đọc lại",
)
check(
  widget.includes("scrollToBottom()") && widget.includes("\[isOpen, isMinimized, scrollToBottom\]"),
  "Mở lại khung chat -> hiện tin nhắn mới nhất",
)

/**
 * Mô phỏng đúng lỗi khách gặp: khung cao 400px, khách đang ở cuối (nội dung 350px).
 * Khách gửi thêm 1 tin làm nội dung dài 550px.
 */
const OLD_THRESHOLD = 100
const NEW_THRESHOLD = 80
const simulate = (contentBefore: number, contentAfter: number, scrollTop = 0, viewport = 400) => {
  const distanceIfCheckedAfterRender = contentAfter - scrollTop - viewport
  const oldWouldScroll = distanceIfCheckedAfterRender < OLD_THRESHOLD
  // Cách mới: biết trước đó khách đang ở cuối (onScroll cập nhật ngay khi khách cuộn)
  const wasAtBottom = contentBefore - scrollTop - viewport <= NEW_THRESHOLD
  return { oldWouldScroll, newWouldScroll: wasAtBottom }
}
const addedMessage = simulate(350, 550)
check(
  addedMessage.oldWouldScroll === false && addedMessage.newWouldScroll === true,
  "Tin mới làm khung cao thêm: cách cũ không cuộn (lỗi), cách mới cuộn xuống",
)
const readingUp = simulate(900, 1100, 100)
check(
  readingUp.newWouldScroll === false,
  "Khách đang kéo lên đọc lại -> không bị kéo xuống, chỉ hiện nút gợi ý",
)

console.log(`\n${pass} PASS / ${fail} FAIL`)
if (fail) process.exit(1)
