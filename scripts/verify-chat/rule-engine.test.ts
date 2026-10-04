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
import {
  evaluateRules,
  isSmallTalk,
  isPlaceholderName,
  shouldAlertAdminOnAiReply,
} from "@/lib/rule-engine"
import { shouldOfferConsultation } from "@/lib/consultation-offer"
import { analyzeIntent } from "@/lib/ai-service"
import {
  DEFAULT_GROQ_MODEL,
  callGroqWithFallback,
  isModelUnavailableError,
  isRetiredModel,
  resolveModelChain,
} from "@/lib/ai-models"
import { readFileSync } from "fs"

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
  // b2 (chủ doanh nghiệp chốt): câu hỏi giá KHÔNG chặn câu trả lời nữa — AI tóm tắt
  // thông tin đã biết + mời kết nối chuyên viên, admin vẫn được báo ngay.
  { message: "Cho em xin báo giá dịch vụ FDA", expect: "AI_CONTINUE", rule: "SI-07" },
  { message: "Cho em xin giá dịch vụ FDA", expect: "AI_CONTINUE", rule: "SI-07" },
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
  run("Cho em xin báo giá dịch vụ FDA").ruleId === "SI-07-PRICING",
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

/* ---------- 11. Groq khai tử model: chatbot phải tự chuyển model khác ---------- */
// 16/08/2026 Groq ngừng phục vụ llama-3.3-70b-versatile. Nếu code vẫn gọi model
// đó, khách nhắn tin mà bot im lặng mãi (404 model_not_found).
check(isRetiredModel("llama-3.3-70b-versatile") === true, "Biết model Llama 3.3 70B đã bị Groq khai tử")
check(isRetiredModel(DEFAULT_GROQ_MODEL) === false, `Model mặc định hiện tại (${DEFAULT_GROQ_MODEL}) còn dùng được`)
check(resolveModelChain("llama-3.3-70b-versatile")[0] === DEFAULT_GROQ_MODEL,
  `Model cũ trong CSDL tự chuyển sang ${DEFAULT_GROQ_MODEL}`)
check(resolveModelChain("openai/gpt-oss-20b")[0] === "openai/gpt-oss-20b",
  "Tôn trọng model admin chọn trong CSDL")
const chain = resolveModelChain(undefined)
check(chain.length === new Set(chain).size, `Chuỗi model không lặp: ${chain.join(" → ")}`)

const prodError = {
  status: 404,
  message: '404 {"error":{"message":"The model `llama-3.3-70b-versatile` does not exist or you do not have access to it.","type":"invalid_request_error","code":"model_not_found"}}',
}
check(isModelUnavailableError(prodError) === true, "Nhận ra đúng lỗi 404 model_not_found của Groq")
check(isModelUnavailableError({ status: 400, message: "invalid request" }) === false,
  "Không coi lỗi 400 là lỗi model (không giấu lỗi thật)")
check(isModelUnavailableError({ status: 429, message: "rate limit" }) === false,
  "Không coi lỗi quá hạn mức là lỗi model")

// Diễn lại đúng sự cố: model đang cấu hình chết -> model dự phòng trả lời
const calls: string[] = []
const fakeClient = {
  chat: {
    completions: {
      create: async (args: any) => {
        calls.push(args.model)
        if (args.model === DEFAULT_GROQ_MODEL) {
          throw Object.assign(new Error(prodError.message), { status: 404 })
        }
        return { choices: [{ message: { content: "Dạ em chào anh/chị ạ!" } }] }
      },
    },
  },
}
async function testModelFallback() {
const result = await callGroqWithFallback(fakeClient, {
  model: DEFAULT_GROQ_MODEL,
  messages: [{ role: "user", content: "xin chào" }],
  temperature: 0.7,
  maxTokens: 512,
})
check(
  result.completion.choices[0].message.content.includes("chào") && result.model !== DEFAULT_GROQ_MODEL,
  `Model chính chết -> tự trả lời bằng "${result.model}" (đã gọi: ${calls.join(", ")})`,
)

// Lỗi thật (429) thì ném ra ngay, không thử model khác
let threw = false
try {
  await callGroqWithFallback(
    { chat: { completions: { create: async () => { throw Object.assign(new Error("rate limit"), { status: 429 }) } } } },
    { model: DEFAULT_GROQ_MODEL, messages: [], temperature: 0.7, maxTokens: 512 },
  )
} catch {
  threw = true
}
check(threw, "Lỗi quá hạn mức vẫn báo ra ngoài, không bị che bằng model dự phòng")
}

// Không còn chỗ nào trong repo ghim model đã chết
const seedSql = readFileSync("scripts/008_create_ai_knowledge_base.sql", "utf8")
check(!seedSql.includes("llama-3.3-70b-versatile"), "SQL khởi tạo không còn gieo model đã chết")
const settingsPage = readFileSync("app/admin/(dashboard)/settings/page.tsx", "utf8")
check(settingsPage.includes("AVAILABLE_GROQ_MODELS"), "Trang Cài đặt lấy danh sách model còn dùng được")
const blogAssistant = readFileSync("app/api/blog/ai-assistant/route.ts", "utf8")
check(
  !blogAssistant.includes('"llama-3.3-70b-versatile"'),
  "Trợ lý viết bài không còn gọi model đã chết (chỉ nhắc trong ghi chú)",
)

/* ---------- 3e. Tín hiệu mua & tình huống khẩn ---------- */
// Lỗi thật: "Mình muốn đăng ký FDA" — câu mua rõ nhất — trước đây không khớp rule
// nào nên khách sẵn sàng mua vẫn chỉ được AI trả lời chung chung, không ai được báo.
const buyingSignals = [
  "Mình muốn đăng ký FDA",
  "Em muốn đăng ký GACC cho nhà máy",
  "Đăng ký giúp tôi luôn đi",
  "Chị cần nộp hồ sơ FDA luôn",
]
for (const m of buyingSignals) {
  const r = run(m)
  check(r.action === "ASK_CONTACT", `Khách ngỏ ý muốn đăng ký -> phải xin liên hệ: "${m}" -> ${r.ruleId}`)
}

// …nhưng nếu kèm câu hỏi kiến thức thì KHÔNG được chặn câu trả lời
const knowledgeStillAnswered = [
  "Mình muốn đăng ký FDA thì cần chuẩn bị giấy tờ gì?",
  "Đăng ký GACC mất bao lâu?",
  "Thực phẩm đóng hộp xuất sang Mỹ cần gì?",
]
for (const m of knowledgeStillAnswered) {
  const r = run(m)
  check(r.action === "AI_CONTINUE", `Câu hỏi kiến thức vẫn để AI trả lời: "${m.slice(0, 45)}…" -> ${r.action}`)
}

// Lỗi thật: hàng đang bị giữ ở cảng (detention) rơi vào AI_CONTINUE — trợ lý trả lời
// chung chung trong lúc khách đang mất tiền mỗi ngày. Đây là ca khẩn, phải có người.
const emergencies = [
  "Hồ sơ của tôi bị FDA giữ ở cảng rồi, làm sao?",
  "Lô hàng của em bị hải quan Mỹ giữ lại",
  "Nếu hàng bị FDA giữ lại (detention) thì phải làm sao?",
]
for (const m of emergencies) {
  const r = run(m)
  check(
    r.action === "HANDOFF_TO_ADMIN" && r.ruleId === "CR-03" && r.tags.urgency === "high",
    `Hàng bị giữ ở cảng -> chuyển chuyên viên ngay: "${m.slice(0, 45)}…" -> ${r.ruleId} / ${r.tags.urgency}`,
  )
}

const ruleEngineSrc = readFileSync("lib/rule-engine.ts", "utf8")
check(!ruleEngineSrc.includes("anh/chì"), "Hết lỗi chính tả \"anh/chì\" trong tin nhắn mẫu gửi khách")
const sendAiSrc = readFileSync("app/api/chatbot/send-ai/route.ts", "utf8")
check(
  sendAiSrc.includes('ruleResult.ruleId === "SI-02-IMMEDIATE"'),
  "Khách vừa đồng ý thì xác nhận ngay, không hỏi lại câu chốt vừa hỏi",
)

/* ---------- 3f. Sau khi chuyển chuyên viên (a2) & câu hỏi giá (b2) ---------- */
// a2: khách đang chờ chuyên viên vẫn phải được trả lời câu hỏi kiến thức. Trước đây
// send-ai trả ngay một câu "đang được chuyên viên xử lý" rồi AI im vĩnh viễn.
const sendAiRoute = readFileSync("app/api/chatbot/send-ai/route.ts", "utf8")
check(
  sendAiRoute.includes("const alreadyHandedOver = Boolean(activeHandover)"),
  "a2: hội thoại đã chuyển chuyên viên không còn chặn AI trả lời",
)
check(
  sendAiRoute.includes("ALREADY_HANDED_OVER_NOTE") && sendAiRoute.includes("KHÔNG hỏi lại câu kết nối chuyên viên"),
  "a2: AI được dặn vẫn trả lời kiến thức nhưng không hỏi lại câu kết nối",
)
check(
  sendAiRoute.includes("if (!alreadyHandedOver && ruleResult.action === \"HANDOFF_TO_ADMIN\")") &&
    sendAiRoute.includes("if (!alreadyHandedOver && ruleResult.action === \"ASK_CONTACT\")"),
  "a2: không tạo phiếu chuyển trùng / không xin số điện thoại lại khi đã có chuyên viên",
)
check(
  sendAiRoute.includes('handover_mode: alreadyHandedOver ? "manual"'),
  "a2: đang chờ chuyên viên thì giữ nguyên chế độ chuyên viên, không hạ về auto",
)
check(
  sendAiRoute.includes('status: alreadyHandedOver ? "handed_over" : "ok"'),
  "a2: khung chat vẫn hiện thẻ \"Chuyên viên đang hỗ trợ\" kèm câu trả lời thật",
)

// b2: câu hỏi giá -> AI trả lời nhưng admin phải được báo (lead nóng nhất)
const pricing = run("Chi phí đăng ký FDA là bao nhiêu?")
check(
  pricing.action === "AI_CONTINUE" && pricing.tags.reason === "sales" && pricing.tags.urgency === "high",
  `b2: câu hỏi giá AI trả lời nhưng gắn nhãn lead nóng: ${pricing.ruleId}`,
)
check(
  shouldAlertAdminOnAiReply(pricing),
  "b2: câu hỏi giá phải báo admin ngay (push/email), không chờ admin mở dashboard",
)
check(
  !shouldAlertAdminOnAiReply(run("Đăng ký GACC mất bao lâu?")),
  "Câu hỏi kiến thức bình thường không bắn thông báo làm phiền chuyên viên",
)
check(
  sendAiRoute.includes("HOT_LEAD_ALERT_COOLDOWN_MS") && sendAiRoute.includes("last_lead_alert_at"),
  "b2: chống spam thông báo — mỗi hội thoại tối đa 1 lần / 30 phút",
)
check(
  readFileSync("lib/ai-service.ts", "utf8").includes("extraInstructions"),
  "ai-service truyền được ghi chú riêng cho từng lượt (phục vụ a2)",
)

testModelFallback().then(() => {
  console.log(`\n${pass} PASS / ${fail} FAIL`)
  if (fail) process.exit(1)
})
