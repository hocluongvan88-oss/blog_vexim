/**
 * Kiểm thử luồng thu thập thông tin khách + mời kết nối chuyên viên.
 *
 * Chạy:
 *   npx esbuild scripts/verify-chat/lead-profile.test.ts --bundle --platform=node \
 *     --format=cjs --alias:@=. --outfile=/tmp/lead.cjs && node /tmp/lead.cjs
 *
 * Vì sao cần: yêu cầu nghiệp vụ —
 *  1. Bot phải tư vấn như một sale Vexim: thu thập thị trường, nhóm sản phẩm,
 *     mã DUNS, số điện thoại trước khi chuyển chuyên viên.
 *  2. Mọi lời mời gặp chuyên viên PHẢI có câu "Anh/chị có muốn em kết nối với
 *     chuyên viên bên em không ạ?".
 *  3. Khi đủ hồ sơ HOẶC khách hỏi giá -> tổng hợp thông tin và mời kết nối.
 *  4. Mốc thời gian phải đúng số Vexim cung cấp: FDA 1–2 ngày (có DUNS) /
 *     5–8 ngày (chưa có DUNS); GACC chỉ nhóm chế biến, 15–30 ngày.
 */
import { readFileSync } from "fs"
import {
  HANDOFF_CONNECT_QUESTION,
  VEXIM_TIMELINES,
  estimateTimeline,
  extractLeadProfile,
  extractLeadProfileFromMessages,
  isLeadReady,
  isPriceQuestion,
  missingLeadFields,
  normalizePhone,
  shouldSummarizeAndInvite,
  summarizeLead,
} from "@/lib/lead-profile"
import { buildSalesPlaybook, DEFAULT_SALES_PLAYBOOK, SALES_FACTS } from "@/lib/sales-playbook"
import { shouldOfferConsultation } from "@/lib/consultation-offer"

let pass = 0
let fail = 0
const check = (ok: boolean, msg: string) => {
  ok ? pass++ : fail++
  console.log(`${ok ? "PASS" : "FAIL"} ${msg}`)
}

/* ---------- 1. Trích thông tin từ câu khách nói ---------- */
const canned = extractLeadProfile(
  "Bên em có thực phẩm đóng hộp muốn xuất sang Mỹ, chưa có mã DUNS, số em là 0912 345 678",
)
check(canned.market === "FDA", `Nhận ra thị trường Mỹ/FDA (${canned.market})`)
check(canned.productGroup === "canned", `Nhận ra nhóm đóng hộp (${canned.productLabel})`)
check(canned.hasDuns === false, "Nhận ra khách CHƯA có mã DUNS")
check(canned.phone === "0912345678", `Chuẩn hoá số điện thoại (${canned.phone})`)

const gacc = extractLeadProfile("Mình làm mì gói chế biến, muốn đăng ký GACC Trung Quốc, đã có mã DUNS đúng địa chỉ nhà máy rồi")
check(gacc.market === "GACC", `Nhận ra thị trường GACC (${gacc.market})`)
check(gacc.productGroup === "processed", `Nhận ra nhóm chế biến (${gacc.productLabel})`)
check(gacc.hasDuns === true, "Nhận ra khách ĐÃ có mã DUNS")

const raw = extractLeadProfile("Bên mình xuất trái cây tươi sang Trung Quốc")
check(raw.productGroup === "raw", `Nhận ra nhóm nguyên liệu thô/tươi (${raw.productLabel})`)

/* Bẫy: "chưa có mã DUNS" chứa cả cụm "có mã duns" -> phải ưu tiên phủ định */
check(
  extractLeadProfile("Dạ chưa có mã DUNS ạ").hasDuns === false,
  "Câu 'chưa có mã DUNS' không bị hiểu nhầm thành 'đã có'",
)
check(extractLeadProfile("Dạ bên em có mã DUNS rồi ạ").hasDuns === true, "Câu 'có mã DUNS rồi' -> đã có")

/* Số điện thoại */
check(normalizePhone("+84 912 345 678") === "0912345678", "Chuẩn hoá +84 -> 0xxxxxxxxx")
check(normalizePhone("0912-345-678") === "0912345678", "Bỏ dấu gạch trong số điện thoại")
check(normalizePhone("12345") === undefined, "Số vô nghĩa không bị nhận nhầm")

/* Tên công ty */
const company = extractLeadProfile("Công ty TNHH Thực phẩm ABC chuyên làm đồ hộp")
check(!!company.companyName && company.companyName.includes("ABC"), `Nhận ra tên công ty (${company.companyName})`)

/* ---------- 1b. Bẫy tiếng Việt: từ ngắn nằm trong từ khác ---------- */
check(extractLeadProfile("Bên mình xuất trái cây tươi sang Trung Quốc").productGroup === "raw",
  "'mình' không bị nhận nhầm thành 'mì' (nhóm chế biến)")
check(extractLeadProfile("Bên mình làm mỹ phẩm").market === undefined,
  "'mỹ phẩm' không bị nhận nhầm thành thị trường Mỹ")
check(extractLeadProfile("Xuất sang Mỹ").market === "FDA", "'sang Mỹ' -> thị trường FDA")
check(extractLeadProfile("Công ty em có một nhà máy ở Bình Dương").companyName === undefined,
  "Câu mô tả chung không bị nhận nhầm thành tên công ty")
check(
  extractLeadProfile("Công ty Cổ phần Xuất khẩu Miền Nam, số em 0905123456").companyName ===
    "Công ty Cổ phần Xuất khẩu Miền Nam",
  "Vẫn nhận đúng tên công ty có tên riêng",
)

/* ---------- 2. Không xoá dữ liệu đã thu thập ---------- */
const step1 = extractLeadProfile("Mình muốn làm FDA cho sản phẩm đóng hộp", {})
const step2 = extractLeadProfile("Chưa có mã DUNS ạ", step1)
const step3 = extractLeadProfile("Số em là 0987654321", step2)
check(
  step3.market === "FDA" && step3.productGroup === "canned" && step3.hasDuns === false && step3.phone === "0987654321",
  "Thông tin tích luỹ qua nhiều lượt chat, không mất dữ liệu cũ",
)

const fromHistory = extractLeadProfileFromMessages([
  "Chào em",
  "Bên mình làm thực phẩm đóng hộp",
  "Muốn đăng ký FDA Mỹ",
])
check(fromHistory.market === "FDA" && fromHistory.productGroup === "canned",
  "Trích được hồ sơ từ lịch sử hội thoại (khách đổi máy vẫn giữ được)")

/* ---------- 3. Còn thiếu gì ---------- */
const partial = extractLeadProfile("Muốn đăng ký FDA cho đồ hộp")
const missing = missingLeadFields(partial).map((field) => field.key)
check(missing.includes("hasDuns") && missing.includes("phone") && !missing.includes("market"),
  `Chỉ hỏi thứ còn thiếu (còn thiếu: ${missing.join(", ")})`)
check(isLeadReady(partial) === false, "Chưa đủ thông tin -> chưa coi là sẵn sàng chuyển chuyên viên")

const complete = { market: "FDA" as const, productGroup: "canned", hasDuns: false, phone: "0912345678" }
check(isLeadReady(complete) === true, "Đủ 4 thông tin -> sẵn sàng chuyển chuyên viên")

/* ---------- 4. Khi nào tổng hợp + mời kết nối ---------- */
check(shouldSummarizeAndInvite(complete, "dạ") === true, "Đủ hồ sơ -> tổng hợp và mời kết nối")
check(shouldSummarizeAndInvite(partial, "Bên mình báo giá bao nhiêu?") === true, "Khách hỏi giá -> mời kết nối dù chưa đủ hồ sơ")
check(shouldSummarizeAndInvite(partial, "Đăng ký FDA cần giấy tờ gì?") === false, "Câu hỏi kiến thức thường -> chưa mời, trả lời trước")
check(isPriceQuestion("Chi phí làm GACC thế nào ạ?") === true, "Nhận ra câu hỏi về chi phí")

/* ---------- 5. Mốc thời gian đúng số Vexim cung cấp ---------- */
check(VEXIM_TIMELINES.fdaWithDuns === "1–2 ngày", `Mốc FDA có DUNS: ${VEXIM_TIMELINES.fdaWithDuns}`)
check(VEXIM_TIMELINES.fdaWithoutDuns === "5–8 ngày", `Mốc FDA chưa có DUNS: ${VEXIM_TIMELINES.fdaWithoutDuns}`)
check(VEXIM_TIMELINES.gacc === "15–30 ngày kể từ khi nhận đủ hồ sơ", `Mốc GACC: ${VEXIM_TIMELINES.gacc}`)
check(VEXIM_TIMELINES.gaccNote.includes("chế biến"), "GACC chỉ nhận nhóm sản phẩm chế biến")

const timelineWithDuns = estimateTimeline({ market: "FDA", hasDuns: true })
check(!!timelineWithDuns && timelineWithDuns.includes("1–2 ngày"), `FDA có DUNS -> ${timelineWithDuns}`)
const timelineNoDuns = estimateTimeline({ market: "FDA", hasDuns: false })
check(!!timelineNoDuns && timelineNoDuns.includes("5–8 ngày"), `FDA chưa có DUNS -> ${timelineNoDuns}`)
const timelineGacc = estimateTimeline({ market: "GACC", productGroup: "processed" })
check(!!timelineGacc && timelineGacc.includes("15–30 ngày"), `GACC -> ${timelineGacc}`)
const timelineGaccRaw = estimateTimeline({ market: "GACC", productGroup: "raw" })
check(!!timelineGaccRaw && timelineGaccRaw.includes("chế biến"), `GACC nhóm thô -> nói rõ ngoài phạm vi: ${timelineGaccRaw}`)
check(estimateTimeline({}) === null, "Chưa biết thị trường -> không phán bừa thời gian")

/* ---------- 6. Bản tổng hợp cho khách & cho chuyên viên ---------- */
const summary = summarizeLead(complete)
check(summary.some((line) => line.includes("FDA")), "Bản tổng hợp có thị trường")
check(summary.some((line) => line.includes("DUNS")), "Bản tổng hợp có tình trạng DUNS")
check(summary.some((line) => line.includes("0912345678")), "Bản tổng hợp có số điện thoại")
check(summary.some((line) => line.includes("1–2 ngày") || line.includes("5–8 ngày")),
  "Bản tổng hợp có thời gian dự kiến (chuyên viên đọc là biết ngay)")

/* ---------- 7. Cẩm nang nhúng vào prompt ---------- */
const playbook = buildSalesPlaybook(partial)
check(playbook.includes(HANDOFF_CONNECT_QUESTION), "Cẩm nang có câu hỏi kết nối bắt buộc")
check(playbook.includes("ĐÃ NẮM ĐƯỢC THÔNG TIN"), "Cẩm nang nói rõ đã nắm gì")
check(playbook.includes("CÒN THIẾU"), "Cẩm nang nói rõ còn thiếu gì để AI hỏi đúng chỗ")
check(playbook.includes("5–8 ngày") && playbook.includes("15–30 ngày"), "Cẩm nang có đủ mốc thời gian chuẩn")
const playbookReady = buildSalesPlaybook(complete)
check(playbookReady.includes("ĐÃ ĐỦ THÔNG TIN"), "Đủ thông tin -> cẩm nang nhắc tổng hợp và hỏi kết nối")
check(buildSalesPlaybook({}, { adminPlaybook: "LUẬT RIÊNG CỦA VEXIM" }).includes("LUẬT RIÊNG CỦA VEXIM"),
  "Cẩm nang do admin sửa trong CSDL được ưu tiên dùng")

/* ---------- 8. Thẻ mời tư vấn trong khung chat ---------- */
const readyDecision = shouldOfferConsultation({
  status: "ok",
  sourcesCount: 2,
  customerMessage: "Dạ em cảm ơn",
  leadProfile: complete,
})
check(readyDecision.offer === true && readyDecision.reason === "ready_for_handoff",
  `Đủ hồ sơ -> hiện thẻ kết nối chuyên viên (${readyDecision.reason})`)

const priceDecision = shouldOfferConsultation({
  status: "ok",
  sourcesCount: 3,
  customerMessage: "Báo giá giúp em",
  leadProfile: partial,
})
check(priceDecision.offer === true, `Khách hỏi giá -> hiện thẻ (${priceDecision.reason})`)

const normalDecision = shouldOfferConsultation({
  status: "ok",
  sourcesCount: 3,
  customerMessage: "Hồ sơ GACC cần những gì?",
  leadProfile: {},
})
check(normalDecision.offer === false, "Câu hỏi tra cứu thường vẫn không làm phiền khách")

/* ---------- 9. Câu hỏi bắt buộc phải có ở mọi lời mời ---------- */
check(
  HANDOFF_CONNECT_QUESTION === "Anh/chị có muốn em kết nối với chuyên viên bên em không ạ?",
  `Đúng nguyên văn câu Vexim yêu cầu: "${HANDOFF_CONNECT_QUESTION}"`,
)
const widget = readFileSync("components/chat-widget.tsx", "utf8")
check(widget.includes("HANDOFF_CONNECT_QUESTION"), "Khung chat hiện câu hỏi kết nối")
check(widget.includes("isLeadReady(leadProfile)"), "Thẻ tư vấn biết khi nào khách đã đủ thông tin")
check(widget.includes("/api/chatbot/connect"), "Có nút kết nối chuyên viên gửi lên máy chủ")
check(widget.includes("summarizeLead"), "Thẻ hiện bản tổng hợp thông tin đã ghi nhận")

const sendAi = readFileSync("app/api/chatbot/send-ai/route.ts", "utf8")
check(sendAi.includes("HANDOFF_CONNECT_QUESTION"), "Tin nhắn chuyển chuyên viên cũng có câu hỏi bắt buộc")
check(sendAi.includes("lead_profile"), "API nhận hồ sơ khách từ khung chat")
check(sendAi.includes("mergeConversationMetadata"), "Lưu hồ sơ không ghi đè metadata cũ (service_tag…)")

const connectRoute = readFileSync("app/api/chatbot/connect/route.ts", "utf8")
check(connectRoute.includes("notifyAdmin"), "Khách bấm kết nối -> báo admin ngoài trang quản trị (email + thông báo nổi)")
check(connectRoute.includes("lead_summary"), "Email cho admin kèm bản tổng hợp thông tin khách")
check(connectRoute.includes("handover_mode"), "Chuyển hẳn hội thoại sang chế độ chuyên viên")

const aiService = readFileSync("lib/ai-service.ts", "utf8")
check(aiService.includes("buildSalesPlaybook"), "Cẩm nang luôn được ghép vào prompt của AI")
check(aiService.includes("sales_playbook"), "Đọc được cẩm nang admin sửa trong CSDL")

const knowledge = readFileSync("knowledge/thoi-gian-dang-ky-fda-gacc.md", "utf8")
check(knowledge.includes("1–2 ngày") && knowledge.includes("5–8 ngày") && knowledge.includes("15–30 ngày"),
  "Kho tri thức có tài liệu thời gian đăng ký FDA/GACC")
check(knowledge.includes("FCE-SID") && knowledge.includes("US Agent"),
  "Tài liệu có nội dung đóng hộp (LACF/AF, FCE-SID, US Agent)")

console.log(`\n${pass} PASS / ${fail} FAIL`)
if (fail) process.exit(1)
