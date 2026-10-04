// Rule Engine for Vexim Global Chatbot
// Decides: AI continues, Ask contact, or Handoff to admin

export type RuleAction = "AI_CONTINUE" | "ASK_CONTACT" | "HANDOFF_TO_ADMIN"

export interface RuleResult {
  action: RuleAction
  reason: string
  ruleId: string
  tags: {
    service_tag?: "FDA" | "GACC" | "MFDS" | "FSMA204" | "US_AGENT" | "EXPORT" | "TRACEABILITY"
    reason: "compliance" | "sales" | "data" | "quality"
    urgency: "low" | "medium" | "high"
  }
}

export interface MessageContext {
  message: string
  conversationHistory?: string[]
  aiConfidence?: number
  hasFile?: boolean
  customerInfo?: {
    companyName?: string
    market?: string
    product?: string
  }
}

/**
 * TÊN MẶC ĐỊNH/PLACEHOLDER — không phải tên công ty thật.
 *
 * Đây là gốc của một lỗi rất nặng: khung chat luôn gửi customer_name =
 * "Khách hàng", mà rule LQ-01 lại coi trường này là TÊN CÔNG TY, nên MỌI tin
 * nhắn (kể cả "xin chào") đều bị chuyển thành "để lại số điện thoại" và AI
 * không bao giờ được trả lời.
 */
const PLACEHOLDER_NAMES = new Set([
  "khách hàng", "khach hang", "khách", "khach", "guest", "customer", "anonymous", "ẩn danh",
  "unknown", "không xác định", "test", "người dùng", "nguoi dung", "user", "visitor", "khách vãng lai",
])

export function isPlaceholderName(name?: string): boolean {
  if (!name) return true
  const normalized = name.trim().toLowerCase()
  return normalized.length < 2 || PLACEHOLDER_NAMES.has(normalized)
}

/**
 * Chào hỏi / cảm ơn / xã giao — những câu KHÔNG được biến thành xin số điện thoại
 * hay chuyển chuyên viên. Cứ để AI chào lại thân thiện rồi hỏi khách cần gì.
 */
const SMALL_TALK_PATTERNS: RegExp[] = [
  /^(xin |dạ |vâng |ạ |em |anh |chị |quý khách )*(chào|chao|hello|hi|hey|helo|alo|a lô)( (em|anh|chị|ad|admin|shop|bên mình|vexim|mọi người))?[\s.,!?]*$/i,
  /^(ad|admin|shop|em|bên mình)\s*ơi[\s.,!?]*$/i,
  /^(cảm ơn|cám ơn|thank you|thanks|thankyou|tks|thank)([\s.,!?]+(em|anh|chị|ad|admin|nhé|ạ|nhiều|rất|quá|bạn|mọi người))*[\s.,!?]*$/i,
  /^(hihi|haha|hi hi|hehe)[\s.,!?]*$/i,
]

export function isSmallTalk(message: string): boolean {
  const text = String(message || "").trim()
  if (text.length > 40) return false
  return SMALL_TALK_PATTERNS.some((pattern) => pattern.test(text))
}

// 1. COMPLIANCE RISK RULES (CR) - Must handoff
function checkComplianceRisk(message: string): RuleResult | null {
  const lowerMsg = message.toLowerCase()

  // CR-01: Specific case questions
  const specificCasePatterns = [
    /sản phẩm (này|của tôi|của chúng tôi).*(có cần|phải|đăng ký)/i,
    /hàng (này|của tôi).*(cần|phải làm)/i,
    /(của tôi|của em|của anh).*(có được|có thể|cần)/i,
  ]
  if (specificCasePatterns.some((p) => p.test(message))) {
    return {
      action: "HANDOFF_TO_ADMIN",
      reason: "Specific product/case requires expert review",
      ruleId: "CR-01",
      tags: { reason: "compliance", urgency: "high" },
    }
  }

  // CR-02: Result guarantee requests
  const guaranteePatterns = [
    /có chắc.*được duyệt/i,
    /đảm bảo.*pass/i,
    /chắc chắn.*thành công/i,
    /(cam kết|bảo đảm).*(kết quả|được)/i,
  ]
  if (guaranteePatterns.some((p) => p.test(message))) {
    return {
      action: "HANDOFF_TO_ADMIN",
      reason: "Cannot guarantee regulatory outcomes",
      ruleId: "CR-02",
      tags: { reason: "compliance", urgency: "high" },
    }
  }

  // CR-03: Previous violations/rejections
  const violationPatterns = [
    /bị (từ chối|reject|cảnh báo|warning)/i,
    /(từng|đã) bị.*FDA/i,
    /vi phạm/i,
    /không đạt.*yêu cầu/i,
    // Hàng/lô hàng đang bị giữ ở cảng hoặc bị FDA – hải quan chặn (detention).
    // Đây là tình huống khẩn: khách đang mất tiền mỗi ngày, phải có chuyên viên
    // vào ngay. Trước đây các câu kiểu "lô hàng của em bị hải quan Mỹ giữ lại"
    // rơi vào AI_CONTINUE — trợ lý trả lời chung chung trong lúc hàng đang bị giữ.
    /bị\s+(giữ|chặn|tạm giữ|thu hồi|detention)/i,
    /(hải quan|cảng|cửa khẩu|fda)[^.!?]{0,25}(giữ|chặn|detention|tạm giữ)/i,
    /giữ\s+(lại\s+)?(hàng|lô hàng|hồ sơ|container)/i,
    /(detention|detained|shipment hold)/i,
  ]
  if (violationPatterns.some((p) => p.test(message))) {
    return {
      action: "HANDOFF_TO_ADMIN",
      reason: "Previous compliance issues need expert handling",
      ruleId: "CR-03",
      tags: { reason: "compliance", urgency: "high" },
    }
  }

  // CR-04: Specific legal interpretation
  const legalPatterns = [
    /điều khoản.*nào/i,
    /quy định.*cụ thể/i,
    /luật.*nói/i,
    /(regulation|CFR).*\d+/i,
  ]
  if (legalPatterns.some((p) => p.test(message))) {
    return {
      action: "HANDOFF_TO_ADMIN",
      reason: "Legal interpretation requires expertise",
      ruleId: "CR-04",
      tags: { reason: "compliance", urgency: "medium" },
    }
  }

  // CR-05: Pricing/Quote requests
  const pricingPatterns = [
    /(phí|chi phí|giá|báo giá).*(bao nhiêu|là gì)/i,
    // Lưu ý: KHÔNG dùng \b sau từ có dấu (á, í, ệ…) — JS coi chữ có dấu là
    // "không phải chữ" nên \bbáo giá\b sẽ không bao giờ khớp.
    /báo giá/i,
    /(xin|hỏi|cho)[\s]+(giá|phí|chi phí)/i,
    /tốn.*bao nhiêu/i,
    /(quote|pricing|cost)/i,
  ]
  if (pricingPatterns.some((p) => p.test(message))) {
    return {
      action: "HANDOFF_TO_ADMIN",
      reason: "Pricing requires custom quote",
      ruleId: "CR-05",
      tags: { reason: "sales", urgency: "medium" },
    }
  }

  return null
}

// 2. SALES INTENT RULES (SI) - Should ask contact or handoff
function checkSalesIntent(message: string): RuleResult | null {
  const lowerMsg = message.toLowerCase()

  // SI-01: Direct "do you do this" questions - HIGH SALES INTENT
  const directDoQuestions = [
    /(bạn|bên|công ty).*(có làm|làm được|làm)/i,
    /ý.*là.*(có làm|làm được|làm không)/i,
    /(em|anh|mình|các bạn).*(làm.*không|có làm)/i,
  ]
  if (directDoQuestions.some((p) => p.test(message))) {
    return {
      action: "HANDOFF_TO_ADMIN",
      reason: "Direct service capability question - very high sales intent",
      ruleId: "SI-01-HIGH",
      tags: { reason: "sales", urgency: "high" },
    }
  }

  // SI-02: "Connect me" / "I want to start" - IMMEDIATE HANDOFF
  const immediateHandoffPatterns = [
    /(kết nối|liên hệ|gọi).*(cho|giúp|tôi|mình|em|anh)/i,
    // Chỉ nhận câu ĐỒNG Ý NGẮN kiểu "ok em", "vâng ạ", "đồng ý nhé".
    // Trước đây pattern cũ /(có|được|...).*(em|anh|nhé|ạ)$/ khớp cả câu hỏi kiến
    // thức rất phổ biến: "Bên em có hỗ trợ không ạ?" -> chuyển chuyên viên oan.
    /^(vâng|dạ|ừ|ừm|uhm|ok|oke|okê|okay|đồng ý|đc|được)([\s.,!?]+(em|anh|chị|nhé|nha|ạ|luôn|vậy|thế|đó|đấy))*[\s.,!?]*$/i,
    /(đồng ý|chốt|bắt đầu|tiến hành|triển khai)[\s]+(luôn|đi|với em|với mình|với anh|với chị|nhé)/i,
    /muốn (làm|thuê|nhờ).*ngay/i,
  ]
  if (immediateHandoffPatterns.some((p) => p.test(message))) {
    return {
      action: "HANDOFF_TO_ADMIN",
      reason: "Customer ready to engage - immediate handoff required",
      ruleId: "SI-02-IMMEDIATE",
      tags: { reason: "sales", urgency: "high" },
    }
  }

  // SI-03: Service inquiry
  const servicePatterns = [
    /(bên|công ty).*(em|anh).*(cung cấp|hỗ trợ)/i,
    /dịch vụ.*(gì|nào)/i,
    /(các|những) dịch vụ/i,
  ]
  if (servicePatterns.some((p) => p.test(message))) {
    // AI trả lời được ngay (danh sách dịch vụ nằm trong system prompt) -> chỉ gắn
    // nhãn "khách quan tâm dịch vụ", KHÔNG chặn câu trả lời để xin số điện thoại.
    return {
      action: "AI_CONTINUE",
      reason: "Service inquiry - tagged as sales interest",
      ruleId: "SI-03",
      tags: { reason: "sales", urgency: "medium" },
    }
  }

  // SI-04b: TÍN HIỆU MUA rõ nhất — khách nói thẳng là muốn đăng ký / nhờ làm hồ sơ.
  // Trước đây "Mình muốn đăng ký FDA" và "Đăng ký giúp tôi luôn đi" không khớp
  // rule nào (SI-04 chỉ có "muốn làm / triển khai / bắt đầu") nên khách sẵn sàng
  // mua vẫn chỉ được AI trả lời chung chung, không ai được báo.
  //
  // Chốt chặn: nếu câu đó kèm câu hỏi kiến thức ("…thì cần chuẩn bị gì?") thì
  // KHÔNG tính là tín hiệu mua — phải để AI trả lời, tránh biến thành máy thu lead.
  const buyingIntentPatterns = [
    /(muốn|định|cần|nhờ|tính)\s+(đăng ký|nộp hồ sơ|gửi hồ sơ|làm hồ sơ|ký hợp đồng)/i,
    /(đăng ký|nộp hồ sơ|gửi hồ sơ|làm hồ sơ)\s+(giúp|hộ|luôn|ngay|đi|với\s+(em|mình|tôi|anh|chị|bên em))/i,
    /nhờ\s+(em|bên em|mình|bên mình|vexim)\s+(đăng ký|làm|nộp|gửi)/i,
  ]
  const asksKnowledge = /[?]|cần gì|cần chuẩn bị|như thế nào|thế nào|bao lâu|bao nhiêu|điều kiện|quy trình|gì ạ|gì không|giấy tờ gì/i
  if (buyingIntentPatterns.some((p) => p.test(message)) && !asksKnowledge.test(message)) {
    return {
      action: "ASK_CONTACT",
      reason: "Customer ready to buy - wants to register now",
      ruleId: "SI-04-READY",
      tags: { reason: "sales", urgency: "high" },
    }
  }

  // SI-04: Want to proceed
  const proceedPatterns = [
    /muốn (làm|triển khai|bắt đầu)/i,
    /cần (thuê|nhờ) luôn/i,
    /(start|proceed|begin)/i,
  ]
  if (proceedPatterns.some((p) => p.test(message))) {
    return {
      action: "ASK_CONTACT",
      reason: "Ready to proceed",
      ruleId: "SI-04",
      tags: { reason: "sales", urgency: "high" },
    }
  }

  // SI-05: Timeline questions
  const timelinePatterns = [
    /bao lâu.*(xong|hoàn thành|được)/i,
    /mất.*bao nhiêu thời gian/i,
    /(timeline|duration|how long)/i,
  ]
  if (timelinePatterns.some((p) => p.test(message))) {
    // "Đăng ký FDA mất bao lâu?" là câu tra cứu bình thường — tài liệu có số ngày
    // xử lý, để AI trả lời rồi mới mời liên hệ nếu khách cần sâu hơn.
    return {
      action: "AI_CONTINUE",
      reason: "Timeline inquiry - answered from knowledge base",
      ruleId: "SI-05",
      tags: { reason: "sales", urgency: "medium" },
    }
  }

  // SI-06: Comparison questions
  const comparisonPatterns = [
    /(bên|công ty).*(em|anh).*khác gì/i,
    /so với.*đơn vị khác/i,
    /ưu điểm.*gì/i,
  ]
  if (comparisonPatterns.some((p) => p.test(message))) {
    return {
      action: "ASK_CONTACT",
      reason: "Comparison inquiry",
      ruleId: "SI-06",
      tags: { reason: "sales", urgency: "low" },
    }
  }

  return null
}

// 3. LEAD QUALITY RULES (LQ) - High priority contact
function checkLeadQuality(message: string, context: MessageContext): RuleResult | null {
  const lowerMsg = message.toLowerCase()

  // LQ-01: Provides company name — CHỈ khi thật sự có tên công ty.
  // (Trước đây chỉ cần customerInfo.companyName có giá trị là kích hoạt, mà khung
  // chat luôn gửi "Khách hàng" → mọi tin nhắn đều thành xin số điện thoại.)
  const companyName = context.customerInfo?.companyName
  if (
    (companyName && !isPlaceholderName(companyName)) ||
    /công ty\s+(tnhh|cổ phần|cp|tnhh mtv)/i.test(message) ||
    /công ty.*(tôi|chúng tôi|em|anh) (là|tên)/i.test(message)
  ) {
    return {
      action: "ASK_CONTACT",
      reason: "Company identified - high quality lead",
      ruleId: "LQ-01",
      tags: { reason: "quality", urgency: "high" },
    }
  }

  // LQ-02: Mentions market
  const marketPatterns = [
    /xuất (khẩu|đi).*(mỹ|trung quốc|hàn quốc|usa|china|korea)/i,
    /thị trường.*(mỹ|trung|hàn)/i,
  ]
  if (context.customerInfo?.market || marketPatterns.some((p) => p.test(message))) {
    // "Xuất khẩu sang Mỹ cần gì?" là câu hỏi kiến thức phổ biến nhất — nếu chặn để
    // xin số điện thoại thì AI không bao giờ được trả lời.
    return {
      action: "AI_CONTINUE",
      reason: "Target market identified - tagged as quality lead",
      ruleId: "LQ-02",
      tags: { reason: "quality", urgency: "high" },
    }
  }

  // LQ-03: Describes product
  const productPatterns = [
    /(sản phẩm|hàng hóa).*(của|là)/i,
    /(bên|công ty).*(em|tôi|anh).*(làm|sản xuất|kinh doanh)/i,
  ]
  if (context.customerInfo?.product || productPatterns.some((p) => p.test(message))) {
    // Mô tả sản phẩm trong câu hỏi là chuyện thường — gắn nhãn để chăm sóc sau,
    // vẫn để AI tư vấn trước.
    return {
      action: "AI_CONTINUE",
      reason: "Product category identified - tagged as quality lead",
      ruleId: "LQ-03",
      tags: { reason: "quality", urgency: "medium" },
    }
  }

  // LQ-04: File upload
  if (context.hasFile) {
    return {
      action: "HANDOFF_TO_ADMIN",
      reason: "Document uploaded - needs expert review",
      ruleId: "LQ-04",
      tags: { reason: "data", urgency: "high" },
    }
  }

  return null
}

// 4. AI CONFIDENCE RULES (AI) - Safety checks
function checkAIConfidence(context: MessageContext): RuleResult | null {
  // AI-01: Low confidence
  if (context.aiConfidence !== undefined && context.aiConfidence < 0.5) {
    return {
      action: "HANDOFF_TO_ADMIN",
      reason: "AI confidence too low",
      ruleId: "AI-01",
      tags: { reason: "data", urgency: "medium" },
    }
  }

  // AI-02: Medium-low confidence
  if (context.aiConfidence !== undefined && context.aiConfidence < 0.7) {
    return {
      action: "ASK_CONTACT",
      reason: "AI not fully confident",
      ruleId: "AI-02",
      tags: { reason: "data", urgency: "low" },
    }
  }

  return null
}

// Detect service tag from message
function detectServiceTag(message: string): RuleResult["tags"]["service_tag"] | undefined {
  const lowerMsg = message.toLowerCase()

  if (/fda|food.*drug|mỹ|hoa kỳ|usa|us agent/i.test(lowerMsg)) return "FDA"
  if (/gacc|trung quốc|china|đăng ký|giấy chứng nhận/i.test(lowerMsg)) return "GACC"
  if (/mfds|hàn quốc|korea/i.test(lowerMsg)) return "MFDS"
  if (/fsma.*204|truy xuất nguồn gốc|traceability/i.test(lowerMsg)) return "FSMA204"
  if (/us agent|đại diện.*mỹ/i.test(lowerMsg)) return "US_AGENT"
  if (/xuất khẩu|export/i.test(lowerMsg)) return "EXPORT"
  if (/truy xuất|theo dõi/i.test(lowerMsg)) return "TRACEABILITY"

  return undefined
}

// Main rule engine
export function evaluateRules(context: MessageContext): RuleResult {
  const { message } = context

  // Priority 0: Chào hỏi / cảm ơn / xã giao -> để AI chào lại, KHÔNG xin số điện
  // thoại, KHÔNG chuyển chuyên viên. (Trước đây "xin chào" bị biến thành
  // "để lại số điện thoại" vì rule LQ-01 nhận nhầm tên mặc định "Khách hàng".)
  if (isSmallTalk(message)) {
    return {
      action: "AI_CONTINUE",
      reason: "Greeting / small talk",
      ruleId: "SMALL_TALK",
      tags: { service_tag: detectServiceTag(message), reason: "data", urgency: "low" },
    }
  }

  // Priority 1: Compliance Risk (MUST handoff)
  const complianceResult = checkComplianceRisk(message)
  if (complianceResult) {
    complianceResult.tags.service_tag = detectServiceTag(message)
    return complianceResult
  }

  // Priority 2: File upload (MUST handoff)
  if (context.hasFile) {
    return {
      action: "HANDOFF_TO_ADMIN",
      reason: "File uploaded - needs expert review",
      ruleId: "LQ-04",
      tags: {
        service_tag: detectServiceTag(message),
        reason: "data",
        urgency: "high",
      },
    }
  }

  // Priority 3: Sales intent & lead quality.
  //  - ASK_CONTACT / HANDOFF_TO_ADMIN: cần người thật -> trả về ngay.
  //  - AI_CONTINUE: chỉ là nhãn (khách quan tâm dịch vụ/thị trường/sản phẩm…)
  //    -> ghi nhớ lại, vẫn cho các rule an toàn bên dưới được xét, cuối cùng mới dùng.
  const salesResult = checkSalesIntent(message)
  if (salesResult && salesResult.action !== "AI_CONTINUE") {
    salesResult.tags.service_tag = detectServiceTag(message)
    return salesResult
  }

  const leadResult = checkLeadQuality(message, context)
  if (leadResult && leadResult.action !== "AI_CONTINUE") {
    leadResult.tags.service_tag = detectServiceTag(message)
    return leadResult
  }

  const taggedResult = salesResult || leadResult

  // Priority 4: AI Confidence (safety)
  const confidenceResult = checkAIConfidence(context)
  if (confidenceResult) {
    confidenceResult.tags.service_tag = detectServiceTag(message)
    return confidenceResult
  }

  // Có nhãn chất lượng lead -> trả về nhãn đó (AI vẫn trả lời bình thường)
  if (taggedResult) {
    taggedResult.tags.service_tag = detectServiceTag(message)
    return taggedResult
  }

  // Default: Continue with AI
  return {
    action: "AI_CONTINUE",
    reason: "Standard information request",
    ruleId: "DEFAULT",
    tags: {
      service_tag: detectServiceTag(message),
      reason: "data",
      urgency: "low",
    },
  }
}

// Get appropriate response message for ASK_CONTACT action
export function getContactRequestMessage(ruleId?: string): string {
  // High urgency - more direct
  if (ruleId?.includes("HIGH") || ruleId?.includes("IMMEDIATE")) {
    return `Dạ, Vexim có hỗ trợ dịch vụ này ạ!

Để tư vấn cụ thể cho trường hợp của anh/chị, em xin phép kết nối với chuyên viên. 

Anh/chị để lại số điện thoại, chuyên viên sẽ liên hệ tư vấn chi tiết ngay ạ.`
  }

  // Standard contact request
  return `Trường hợp này em cần chuyên viên của Vexim kiểm tra kỹ hơn để tư vấn chính xác cho anh/chị.

Nếu anh/chị tiện, mình có thể để lại số điện thoại, em sẽ nhờ chuyên viên liên hệ hỗ trợ trực tiếp ạ.`
}
