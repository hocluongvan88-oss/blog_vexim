/**
 * Kiểm thử RULE ENGINE — quyết định khi nào AI trả lời, khi nào xin liên hệ,
 * khi nào chuyển chuyên viên.
 *
 * Chạy:
 *   npx esbuild scripts/verify-chat/rule-engine.test.ts --bundle --platform=node \
 *     --format=cjs --alias:@=. --alias:groq-sdk=./scripts/verify-chat/groq-stub.ts \
 *     --outfile=/tmp/rules.cjs && node /tmp/rules.cjs
 *
 * Vì sao cần: đã từng có lỗi khách chỉ nhắn "xin chào" mà hệ thống trả ngay
 * "để lại số điện thoại" — do rule LQ-01 nhận nhầm tên mặc định "Khách hàng"
 * thành tên công ty, khiến MỌI tin nhắn đều bị chặn để xin liên hệ.
 */
import { evaluateRules, isSmallTalk, isPlaceholderName } from "@/lib/rule-engine"
import { shouldOfferConsultation } from "@/lib/consultation-offer"
import { analyzeIntent } from "@/lib/ai-service"

let pass = 0
let fail = 0
const check = (ok: boolean, msg: string) => {
  ok ? pass++ : fail++
  console.log(`${ok ? "PASS" : "FAIL"} ${msg}`)
}

const run = (message: string, customerInfo: Record<string, string> = {}) =>
  evaluateRules({ message, customerInfo, hasFile: false })

/* ---------- 1. Chào hỏi / xã giao: KHÔNG xin số điện thoại ---------- */
const greetings = ["xin chào", "Chào em", "hello", "Hi", "alo", "ad ơi", "cảm ơn em", "thanks", "hihi"]
for (const greeting of greetings) {
  const result = run(greeting, { companyName: "Khách hàng" })
  check(
    result.action === "AI_CONTINUE",
    `"${greeting}" -> ${result.action} (phải để AI trả lời, không xin số điện thoại)`,
  )
}

/* ---------- 2. Chính lỗi đã xảy ra: mọi tin nhắn + tên mặc định ---------- */
const realQuestions = [
  "Thủ tục xuất khẩu thực phẩm sang Mỹ cần gì ạ?",
  "Các dịch vụ bên mình cung cấp là gì?",
  "Đăng ký FDA mất bao lâu?",
  "Bên em hỗ trợ những thị trường nào?",
  "Sản phẩm bên anh là trà thảo mộc thì cần gì?",
]
for (const question of realQuestions) {
  const result = run(question, { companyName: "Khách hàng" })
  check(
    result.action === "AI_CONTINUE",
    `Câu hỏi thật vẫn được AI trả lời: "${question.slice(0, 40)}…" -> ${result.action}`,
  )
}

/* ---------- 3. Khách thật sự cần người: VẪN phải chuyển/xin liên hệ ---------- */
const needHuman: Array<{ message: string; expect: string; rule: string }> = [
  { message: "Bên mình có làm FDA không?", expect: "HANDOFF_TO_ADMIN", rule: "SI-01" },
  { message: "Cho em xin báo giá dịch vụ FDA", expect: "HANDOFF_TO_ADMIN", rule: "CR-05" },
  { message: "Cho em xin giá dịch vụ FDA", expect: "HANDOFF_TO_ADMIN", rule: "CR-05" },
  { message: "Sản phẩm của tôi có cần đăng ký FDA không?", expect: "HANDOFF_TO_ADMIN", rule: "CR-01" },
  { message: "Có chắc được duyệt không ạ?", expect: "HANDOFF_TO_ADMIN", rule: "CR-02" },
  { message: "Bên em khác gì đơn vị khác?", expect: "ASK_CONTACT", rule: "SI-06" },
  { message: "Kết nối cho em với chuyên viên", expect: "HANDOFF_TO_ADMIN", rule: "SI-02" },
]
for (const testCase of needHuman) {
  const result = run(testCase.message, { companyName: "Khách hàng" })
  check(
    result.action === testCase.expect,
    `Khách cần người thật: "${testCase.message.slice(0, 40)}…" -> ${result.action} (${result.ruleId})`,
  )
}

/* ---------- 3b. Câu hỏi kiến thức KHÔNG bị nhầm thành "đồng ý" ---------- */
const knowledgeQuestions = [
  "Bên em có hỗ trợ không ạ?",
  "Có cần dịch ngược không ạ?",
  "Sản phẩm này có được nhập không ạ?",
]
for (const question of knowledgeQuestions) {
  const result = run(question)
  check(
    result.ruleId !== "SI-02-IMMEDIATE",
    `Không chuyển chuyên viên oan cho câu hỏi: "${question}" -> ${result.action} (${result.ruleId})`,
  )
}
const consent = run("Vâng ạ")
check(consent.action === "HANDOFF_TO_ADMIN", `Khách đồng ý thật thì vẫn chuyển ngay: "Vâng ạ" -> ${consent.ruleId}`)
const consent2 = run("ok em")
check(consent2.action === "HANDOFF_TO_ADMIN", `"ok em" -> ${consent2.ruleId}`)

/* ---------- 4. Tên công ty THẬT mới kích hoạt LQ-01 ---------- */
const withRealCompany = run("Chào em", { companyName: "Công ty TNHH Thực phẩm ABC" })
check(
  withRealCompany.action === "AI_CONTINUE",
  `Chào hỏi vẫn không xin liên hệ dù biết tên công ty (${withRealCompany.ruleId})`,
)
const leadWithCompany = run("Bên mình tư vấn giúp công ty em nhé", { companyName: "Công ty TNHH Thực phẩm ABC" })
check(leadWithCompany.action === "ASK_CONTACT", `Có tên công ty thật + câu hỏi thật -> xin liên hệ (${leadWithCompany.ruleId})`)

/* ---------- 5. Nhận diện tên mặc định ---------- */
for (const placeholder of ["Khách hàng", "khach hang", "guest", "Khách", "", "user"]) {
  check(isPlaceholderName(placeholder), `"${placeholder}" là tên mặc định -> không tính là tên công ty`)
}
for (const realName of ["Công ty TNHH ABC", "Công ty CP Xuất khẩu Miền Nam"]) {
  check(!isPlaceholderName(realName), `"${realName}" là tên công ty thật`)
}

/* ---------- 6. Nhãn chất lượng lead vẫn được giữ ---------- */
const tagged = run("Xuất khẩu sang Mỹ cần chuẩn bị gì?")
check(tagged.action === "AI_CONTINUE", "Câu hỏi về thị trường vẫn cho AI trả lời")
const withTags = run("Cho hỏi về GACC Trung Quốc")
check(withTags.tags.service_tag === "GACC", `Vẫn gắn nhãn dịch vụ để chăm sóc sau: ${withTags.tags.service_tag}`)

/* ---------- 7. Hàm nhận diện chào hỏi ---------- */
check(isSmallTalk("xin chào") === true, "Nhận ra 'xin chào'")
check(isSmallTalk("Cảm ơn em nhé") === true, "Nhận ra lời cảm ơn")
check(isSmallTalk("Thủ tục xuất khẩu sang Mỹ cần gì?") === false, "Không nhầm câu hỏi thật thành chào hỏi")
check(isSmallTalk("chào bạn, cho mình hỏi về FDA") === false, "Câu vừa chào vừa hỏi -> vẫn là câu hỏi thật")

/* ---------- 8. Bẫy Unicode: chữ có dấu không được làm \b hỏng luật ---------- */
check(
  run("Cho em xin báo giá dịch vụ FDA").ruleId === "CR-05",
  "Nhận ra 'báo giá' dù kết thúc bằng chữ có dấu (không dùng \\b sai chỗ)",
)

/* ---------- 9. Chuỗi quyết định cho lời chào (đúng lỗi trong ảnh chụp) ---------- */
// Trước đây: rule engine trả ASK_CONTACT -> API trả status "ask_contact" -> widget hiện
// thẻ "để lại liên hệ / Zalo". Bây giờ cả 2 chốt đều phải im lặng.
const greetingMessage = "xin chào"
const greetingRule = evaluateRules({
  message: greetingMessage,
  customerInfo: {},
  hasFile: false,
})
check(greetingRule.action === "AI_CONTINUE", `Bước 1 — rule engine: "${greetingMessage}" -> ${greetingRule.action}`)
const greetingStatus = greetingRule.action === "AI_CONTINUE" ? "ok" : "ask_contact"
const greetingOffer = shouldOfferConsultation({
  status: greetingStatus,
  sourcesCount: 0,
  customerMessage: greetingMessage,
})
check(greetingOffer.offer === false, `Bước 2 — widget: không hiện thẻ tư vấn cho lời chào (offer=${greetingOffer.offer})`)

// Nhưng khi khách thật sự cần tư vấn sâu, thẻ 0373 685 634 vẫn phải hiện (task 16)
const deepRule = evaluateRules({ message: "Bên mình báo giá FDA bao nhiêu?", customerInfo: {}, hasFile: false })
const deepOffer = shouldOfferConsultation({
  status: deepRule.action === "HANDOFF_TO_ADMIN" ? "handoff" : "ok",
  sourcesCount: 0,
  customerMessage: "Bên mình báo giá FDA bao nhiêu?",
})
check(
  deepOffer.offer === true,
  `Khách hỏi giá -> vẫn hiện thẻ tư vấn Zalo 0373 685 634 (offer=${deepOffer.offer}, lý do=${deepOffer.reason})`,
)

/* ---------- 10. Chấm độ tin cậy: không chuyển chuyên viên oan ---------- */
// "có thể" và "xin lỗi" là hai từ lịch sự phổ biến nhất trong tiếng Việt; trước
// đây hễ AI viết ra là bị chấm 0.3 điểm -> chuyển chuyên viên dù trả lời đúng.
const polite = analyzeIntent("Bên em có hỗ trợ không ạ?", "Dạ em có thể hỗ trợ anh/chị về FDA ạ.")
check(polite.shouldHandover === false, `"có thể" không còn bị coi là thiếu tự tin (confidence=${polite.confidence})`)
const apology = analyzeIntent("Thủ tục FDA gồm mấy bước?", "Xin lỗi anh/chị, em xin trình bày ạ.")
check(apology.shouldHandover === false, `"xin lỗi" không còn bị coi là thiếu tự tin (confidence=${apology.confidence})`)
const greetingIntent = analyzeIntent("xin chào", "Dạ em chào anh/chị, em có thể giúp gì ạ?")
check(greetingIntent.shouldHandover === false, "Lời chào không bao giờ chuyển chuyên viên")
const uncertain = analyzeIntent("Thủ tục FDA gồm mấy bước?", "Em không rõ phần này ạ.")
check(uncertain.shouldHandover === true, `AI thật sự không rõ -> vẫn chuyển chuyên viên (confidence=${uncertain.confidence})`)
const urgent = analyzeIntent("Em cần làm gấp trong tuần này", "Dạ vâng ạ.")
check(urgent.shouldHandover === true, "Khách cần gấp -> chuyển chuyên viên")
const notUrgent = analyzeIntent("Em hỏi về thời gian xử lý hồ sơ ạ", "Dạ khoảng 7 ngày ạ.")
check(notUrgent.shouldHandover === false, "Câu hỏi bình thường không bị coi là khẩn cấp")

console.log(`\n${pass} PASS / ${fail} FAIL`)
if (fail) process.exit(1)
