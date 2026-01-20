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

// 2. SALES INTENT RULES (SI) - Should ask contact
function checkSalesIntent(message: string): RuleResult | null {
  const lowerMsg = message.toLowerCase()

  // SI-01: Service inquiry
  const servicePatterns = [
    /(bên|công ty).*(em|anh).*(có làm|cung cấp|hỗ trợ)/i,
    /dịch vụ.*(gì|nào)/i,
    /(các|những) dịch vụ/i,
  ]
  if (servicePatterns.some((p) => p.test(message))) {
    return {
      action: "ASK_CONTACT",
      reason: "Service inquiry",
      ruleId: "SI-01",
      tags: { reason: "sales", urgency: "medium" },
    }
  }

  // SI-02: Want to proceed
  const proceedPatterns = [
    /muốn (làm|triển khai|bắt đầu)/i,
    /cần (thuê|nhờ|làm) luôn/i,
    /(start|proceed|begin)/i,
  ]
  if (proceedPatterns.some((p) => p.test(message))) {
    return {
      action: "ASK_CONTACT",
      reason: "Ready to proceed",
      ruleId: "SI-02",
      tags: { reason: "sales", urgency: "high" },
    }
  }

  // SI-03: Timeline questions
  const timelinePatterns = [
    /bao lâu.*(xong|hoàn thành|được)/i,
    /mất.*bao nhiêu thời gian/i,
    /(timeline|duration|how long)/i,
  ]
  if (timelinePatterns.some((p) => p.test(message))) {
    return {
      action: "ASK_CONTACT",
      reason: "Timeline inquiry",
      ruleId: "SI-03",
      tags: { reason: "sales", urgency: "medium" },
    }
  }

  // SI-04: Comparison questions
  const comparisonPatterns = [
    /(bên|công ty).*(em|anh).*khác gì/i,
    /so với.*đơn vị khác/i,
    /ưu điểm.*gì/i,
  ]
  if (comparisonPatterns.some((p) => p.test(message))) {
    return {
      action: "ASK_CONTACT",
      reason: "Comparison inquiry",
      ruleId: "SI-04",
      tags: { reason: "sales", urgency: "low" },
    }
  }

  return null
}

// 3. LEAD QUALITY RULES (LQ) - High priority contact
function checkLeadQuality(message: string, context: MessageContext): RuleResult | null {
  const lowerMsg = message.toLowerCase()

  // LQ-01: Provides company name
  if (context.customerInfo?.companyName || /công ty.*(tôi|chúng tôi|em|anh) (là|tên)/i.test(message)) {
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
    return {
      action: "ASK_CONTACT",
      reason: "Target market identified",
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
    return {
      action: "ASK_CONTACT",
      reason: "Product category identified",
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

  // Priority 3: Sales Intent & Lead Quality (should ask contact)
  const salesResult = checkSalesIntent(message)
  if (salesResult) {
    salesResult.tags.service_tag = detectServiceTag(message)
    return salesResult
  }

  const leadResult = checkLeadQuality(message, context)
  if (leadResult) {
    leadResult.tags.service_tag = detectServiceTag(message)
    return leadResult
  }

  // Priority 4: AI Confidence (safety)
  const confidenceResult = checkAIConfidence(context)
  if (confidenceResult) {
    confidenceResult.tags.service_tag = detectServiceTag(message)
    return confidenceResult
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
export function getContactRequestMessage(): string {
  return `Trường hợp này em cần chuyên viên của Vexim kiểm tra kỹ hơn để tư vấn chính xác cho anh/chị.

Nếu anh/chị tiện, mình có thể để lại số điện thoại, em sẽ nhờ chuyên viên liên hệ hỗ trợ trực tiếp ạ.`
}
