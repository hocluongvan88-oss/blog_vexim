/**
 * Hồ sơ khách hàng mà chatbot cần thu thập — giống một nhân viên kinh doanh
 * của Vexim hỏi khách trước khi báo giá / chuyển chuyên viên.
 *
 * Vì sao cần: trước đây bot trả lời xong là hết, không nắm được khách thuộc
 * nhóm sản phẩm nào, thị trường nào, đã có mã DUNS chưa… nên khi chuyển chuyên
 * viên thì chuyên viên phải hỏi lại từ đầu và khách bị hỏi trùng.
 *
 * Toàn bộ hàm ở đây là hàm thuần (không phụ thuộc React/DOM) để kiểm thử được.
 */

export type LeadMarket = "FDA" | "GACC" | "MFDS" | "US_AGENT" | "EXPORT"

/**
 * Câu hỏi BẮT BUỘC có trong mọi lời mời gặp chuyên viên (yêu cầu của Vexim).
 * Dùng chung cho prompt của AI, thẻ trong khung chat và tin nhắn chuyển chuyên viên.
 */
export const HANDOFF_CONNECT_QUESTION =
  "Anh/chị có muốn em kết nối với chuyên viên bên em không ạ?"

export interface LeadProfile {
  /** Thị trường cần đăng ký */
  market?: LeadMarket
  /** Nhóm sản phẩm, dạng khoá: canned | processed | raw | other */
  productGroup?: string
  /** Nhãn hiển thị của nhóm sản phẩm */
  productLabel?: string
  /** Đã có mã DUNS ĐÚNG với địa chỉ nhà máy sản xuất chưa? */
  hasDuns?: boolean
  /** Tên công ty / nhà máy */
  companyName?: string
  /** Số điện thoại hoặc Zalo (đã chuẩn hoá về dạng 0xxxxxxxxx) */
  phone?: string
}

export interface LeadField {
  key: keyof LeadProfile
  /** Nhãn ngắn để hiện trong bản tổng hợp */
  label: string
  /** Câu hỏi gợi ý để AI hỏi khách một cách tự nhiên */
  question: string
}

/* ------------------------------------------------------------------ */
/* Nhận diện thông tin từ câu nói của khách                            */
/* ------------------------------------------------------------------ */

/**
 * So khớp TỪ NGUYÊN VẸN cho tiếng Việt.
 *
 * Không dùng \b: JS coi chữ có dấu (ì, ỹ, ô…) là "không phải ký tự chữ" nên
 * \bmì\b vừa khớp sai vừa trượt. Hậu quả thật đã gặp: "mình" bị nhận ra là
 * "mì" -> khách nói "bên mình xuất trái cây tươi" bị xếp nhầm vào nhóm chế biến.
 * Cách đúng: dùng lớp ký tự Unicode \p{L} để biết đâu là ranh giới từ.
 */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Khớp khi cụm từ đứng riêng thành một từ (không nằm trong từ khác). */
function vnWords(phrases: string[]): RegExp {
  return new RegExp(`(^|[^\\p{L}])(?:${phrases.map(escapeRegex).join("|")})([^\\p{L}]|$)`, "iu")
}

/** Chữ "Mỹ" — nhưng KHÔNG tính "mỹ phẩm". */
const MY_COUNTRY = /(^|[^\p{L}])mỹ(?!\s*phẩm)([^\p{L}]|$)/iu

const MARKET_PATTERNS: Array<{ market: LeadMarket; label: string; pattern: RegExp }> = [
  {
    market: "FDA",
    label: "FDA (Mỹ)",
    pattern: vnWords([
      "fda", "hoa kỳ", "nước mỹ", "thị trường mỹ", "hợp chủng quốc",
      "us agent", "fce", "sid", "lacf", "prior notice", "hải quan mỹ",
    ]),
  },
  {
    market: "GACC",
    label: "GACC (Trung Quốc)",
    pattern: vnWords(["gacc", "trung quốc", "thị trường trung", "hải quan trung", "trung quoc"]),
  },
  { market: "MFDS", label: "MFDS (Hàn Quốc)", pattern: vnWords(["mfds", "hàn quốc", "thị trường hàn"]) },
  {
    market: "US_AGENT",
    label: "US Agent (đại diện tại Mỹ)",
    pattern: vnWords(["us agent", "đại diện tại mỹ", "đại diện fda"]),
  },
  {
    market: "EXPORT",
    label: "Uỷ thác xuất khẩu",
    pattern: vnWords(["uỷ thác xuất khẩu", "uỷ quyền xuất khẩu", "xuất khẩu hộ"]),
  },
]

const PRODUCT_GROUPS: Array<{ id: string; label: string; pattern: RegExp }> = [
  {
    id: "canned",
    label: "Thực phẩm đóng hộp (nhóm LACF/AF)",
    pattern: vnWords([
      "đóng hộp", "đồ hộp", "hộp thiếc", "đóng lon", "đóng hộp thủy tinh",
      "lacf", "axit thấp", "acidified", "thực phẩm đóng hộp",
    ]),
  },
  {
    id: "processed",
    label: "Sản phẩm chế biến",
    pattern: vnWords([
      "chế biến", "sấy", "sấy khô", "rang", "nướng", "luộc", "tiệt trùng", "bột",
      "gia vị", "đông lạnh", "nước mắm", "mì", "mì gói", "mì ăn liền", "tương",
      "chao", "xúc xích", "đồ khô", "bánh", "kẹo", "cà phê", "trà", "nước uống",
    ]),
  },
  {
    id: "raw",
    label: "Sản phẩm thô / tươi",
    pattern: vnWords([
      "thô", "tươi", "tươi sống", "nguyên liệu thô", "chưa qua chế biến",
      "trái cây tươi", "rau tươi", "trái cây", "rau củ",
    ]),
  },
]

/** Câu khách nói CHƯA có mã DUNS — phải kiểm tra trước câu khẳng định. */
const DUNS_NEGATIVE = /(chưa|khong|không)\s*(có\s*)?(mã\s*)?(d-u-n-s|duns)|duns[^.\n]{0,20}(chưa|không)\s*có/i
/** Câu khách nói ĐÃ có mã DUNS. */
const DUNS_POSITIVE = /(đã|đã có|hiện có|bên em có|mình có|có sẵn)\s*(mã\s*)?(d-u-n-s|duns)|(mã\s*)?duns\s*(của\s*)?(bên em|mình|em|công ty)?[^.\n]{0,10}(rồi|đúng|khớp|ok)/i

/** Số điện thoại Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx. */
export function normalizePhone(raw: string): string | undefined {
  const digits = String(raw || "").replace(/[^\d+]/g, "")
  const local = digits.startsWith("+84") ? "0" + digits.slice(3) : digits
  if (!/^0\d{9}$/.test(local)) return undefined
  return local
}

function detectPhone(text: string): string | undefined {
  const matches = text.match(/(\+?84|0)([\s.\-]?\d){8,10}/g)
  if (!matches) return undefined
  for (const match of matches) {
    const phone = normalizePhone(match)
    if (phone) return phone
  }
  return undefined
}

function detectCompanyName(text: string): string | undefined {
  const match = text.match(/(?:công ty|cty|nhà máy|cơ sở)\s+([^,.;?!\n]{2,70})/i)
  if (!match) return undefined

  const keyword = text.slice(match.index, match.index + match[0].indexOf(match[1])).trim()

  // Bỏ từ nối ở đầu ("nhà máy ở Bình Dương" -> "Bình Dương"), rồi cắt tại động từ:
  // "Công ty em có một nhà máy…" không được coi là tên công ty.
  const candidate = match[1]
    .trim()
    .replace(/^(?:ở|tại|đặt|có|thuộc|nằm|là|chuyên|sản xuất|kinh doanh)\s+/i, "")
    .split(/\s+(?:ở|tại|có|chuyên|sản xuất|làm|muốn|cần|để|và|với|thì|nhưng|đang|sẽ)\s+/i)[0]
    .trim()

  // Phải có tên riêng (chữ hoa) hoặc số — nếu không thì chỉ là câu mô tả chung
  if (candidate.length < 3) return undefined
  if (!/[A-ZÀ-Ỹ0-9]/.test(candidate)) return undefined

  return `${keyword} ${candidate}`.replace(/\s+/g, " ")
}

/**
 * Trích thông tin từ MỘT câu của khách, giữ lại những gì đã biết trước đó.
 * Không bao giờ xoá dữ liệu cũ — chỉ bổ sung/ghi đè khi câu mới nói rõ hơn.
 */
export function extractLeadProfile(text: string, current: LeadProfile = {}): LeadProfile {
  const source = String(text || "")
  if (!source.trim()) return { ...current }

  const next: LeadProfile = { ...current }

  for (const { market, pattern } of MARKET_PATTERNS) {
    if (pattern.test(source) || (market === "FDA" && MY_COUNTRY.test(source))) {
      // US_AGENT / EXPORT là dịch vụ riêng, không thay thế thị trường đã biết
      if (!next.market || market === "US_AGENT" || market === "EXPORT") next.market = market
      break
    }
  }

  for (const group of PRODUCT_GROUPS) {
    if (group.pattern.test(source)) {
      next.productGroup = group.id
      next.productLabel = group.label
      break
    }
  }

  if (DUNS_NEGATIVE.test(source)) {
    next.hasDuns = false
  } else if (DUNS_POSITIVE.test(source) || /(mã\s*)?duns\s*đúng|duns\s*khớp|đúng\s*địa chỉ/i.test(source)) {
    next.hasDuns = true
  }

  const phone = detectPhone(source)
  if (phone) next.phone = phone

  const company = detectCompanyName(source)
  if (company) next.companyName = company

  return next
}

/** Trích từ toàn bộ hội thoại (dùng khi nạp lại lịch sử hoặc phía máy chủ). */
export function extractLeadProfileFromMessages(texts: string[]): LeadProfile {
  return texts.reduce<LeadProfile>((profile, text) => extractLeadProfile(text, profile), {})
}

/* ------------------------------------------------------------------ */
/* Kiểm tra còn thiếu gì                                               */
/* ------------------------------------------------------------------ */

/** Bốn thông tin tối thiểu mà một sale Vexim phải nắm trước khi chuyển chuyên viên. */
export const REQUIRED_LEAD_FIELDS: LeadField[] = [
  {
    key: "market",
    label: "Thị trường",
    question: "Anh/chị đang muốn đăng ký cho thị trường nào ạ (FDA Mỹ, GACC Trung Quốc, MFDS Hàn Quốc…)?",
  },
  {
    key: "productGroup",
    label: "Nhóm sản phẩm",
    question: "Sản phẩm bên mình thuộc nhóm nào ạ (thực phẩm đóng hộp, chế biến, hay nguyên liệu thô)?",
  },
  {
    key: "hasDuns",
    label: "Mã DUNS",
    question: "Bên mình đã có mã DUNS đúng với địa chỉ nhà máy sản xuất chưa ạ?",
  },
  {
    key: "phone",
    label: "Số điện thoại / Zalo",
    question: "Anh/chị cho em xin số điện thoại hoặc Zalo để chuyên viên Vexim liên hệ lại nhé?",
  },
]

/** Những thông tin nên biết nhưng chưa bắt buộc. */
export const OPTIONAL_LEAD_FIELDS: LeadField[] = [
  {
    key: "companyName",
    label: "Tên công ty / nhà máy",
    question: "Anh/chị cho em biết tên công ty hoặc nhà máy sản xuất nhé?",
  },
]

export function isLeadFieldFilled(profile: LeadProfile, key: keyof LeadProfile): boolean {
  if (key === "hasDuns") return typeof profile.hasDuns === "boolean"
  const value = profile[key]
  return typeof value === "string" ? value.trim().length > 0 : value !== undefined && value !== null
}

/** Thông tin còn thiếu (chỉ tính 4 thông tin bắt buộc). */
export function missingLeadFields(profile: LeadProfile = {}): LeadField[] {
  return REQUIRED_LEAD_FIELDS.filter((field) => !isLeadFieldFilled(profile, field.key))
}

/** Đã đủ thông tin tối thiểu để chuyển chuyên viên. */
export function isLeadReady(profile: LeadProfile = {}): boolean {
  return missingLeadFields(profile).length === 0
}

/** Khách đang hỏi giá / phí / báo giá — dấu hiệu sẵn sàng mua. */
export function isPriceQuestion(message: string): boolean {
  return /(giá|bao nhiêu|chi phí|phí|báo giá|bảng giá|cost|price|quote)/i.test(String(message || ""))
}

/**
 * Đã đến lúc tổng hợp thông tin và mời kết nối chuyên viên chưa?
 * Theo yêu cầu: khi ĐỦ HỒ SƠ hoặc khi khách HỎI VỀ GIÁ.
 */
export function shouldSummarizeAndInvite(
  profile: LeadProfile = {},
  message: string = "",
): boolean {
  return isLeadReady(profile) || isPriceQuestion(message)
}

/* ------------------------------------------------------------------ */
/* Dự kiến thời gian & bản tổng hợp                                    */
/* ------------------------------------------------------------------ */

/** Mốc thời gian chuẩn do Vexim cung cấp (xem thêm knowledge/thoi-gian-dang-ky-fda-gacc.md). */
export const VEXIM_TIMELINES = {
  fdaWithDuns: "1–2 ngày",
  fdaWithoutDuns: "5–8 ngày",
  gacc: "15–30 ngày kể từ khi nhận đủ hồ sơ",
  gaccNote: "GACC chỉ nhận đăng ký nhóm sản phẩm chế biến",
} as const

/**
 * Ước tính thời gian theo thông tin đã thu thập được.
 * Chỉ trả lời theo mốc CHUẨN của Vexim — không suy diễn thêm.
 */
export function estimateTimeline(profile: LeadProfile = {}): string | null {
  const lines: string[] = []

  const wantsFda = profile.market === "FDA" || profile.market === "US_AGENT"
  const wantsGacc = profile.market === "GACC"

  if (wantsFda) {
    if (profile.hasDuns === true) lines.push(`FDA: khoảng ${VEXIM_TIMELINES.fdaWithDuns} (đã có mã DUNS đúng địa chỉ nhà máy)`)
    else if (profile.hasDuns === false) lines.push(`FDA: khoảng ${VEXIM_TIMELINES.fdaWithoutDuns} (chưa có mã DUNS)`)
    else lines.push(`FDA: ${VEXIM_TIMELINES.fdaWithDuns} nếu đã có mã DUNS đúng địa chỉ nhà máy, ${VEXIM_TIMELINES.fdaWithoutDuns} nếu chưa có`)
  }

  if (wantsGacc) {
    if (profile.productGroup === "raw") lines.push(`GACC: ${VEXIM_TIMELINES.gaccNote} — nhóm nguyên liệu thô chưa qua chế biến nằm ngoài phạm vi Vexim nhận`)
    else lines.push(`GACC: khoảng ${VEXIM_TIMELINES.gacc} (${VEXIM_TIMELINES.gaccNote})`)
  }

  if (lines.length === 0) return null
  return lines.join(" · ")
}

/** Bản tổng hợp thông tin khách — dùng cho thẻ trong khung chat và email báo admin. */
export function summarizeLead(profile: LeadProfile = {}): string[] {
  const lines: string[] = []

  if (profile.market) {
    const label = MARKET_PATTERNS.find((item) => item.market === profile.market)?.label || profile.market
    lines.push(`Thị trường: ${label}`)
  }
  if (profile.productLabel) lines.push(`Nhóm sản phẩm: ${profile.productLabel}`)
  if (profile.hasDuns === true) lines.push("Mã DUNS: đã có, đúng địa chỉ nhà máy")
  if (profile.hasDuns === false) lines.push("Mã DUNS: chưa có (cần đăng ký mới)")

  const timeline = estimateTimeline(profile)
  if (timeline) lines.push(`Thời gian dự kiến: ${timeline}`)

  if (profile.companyName) lines.push(`Công ty/nhà máy: ${profile.companyName}`)
  if (profile.phone) lines.push(`Điện thoại/Zalo: ${profile.phone}`)

  return lines
}
