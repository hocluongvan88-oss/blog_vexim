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
  widget.includes("throw new Error(data.error") && widget.includes("setShowZaloCta(true)"),
  'Widget xử lý status "error" (báo lỗi thân thiện + gợi ý Zalo)',
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

console.log(`\n${pass} PASS / ${fail} FAIL`)
if (fail) process.exit(1)
