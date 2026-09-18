/**
 * Lõi phân tích SEO cho trình soạn thảo blog — cập nhật theo hướng dẫn Google hiện hành (09/2026).
 *
 * Khác biệt so với bản cũ (`components/seo-checker.tsx` trước đây):
 * - BỎ "mật độ từ khóa": Google khẳng định không có mật độ vàng, không dùng mật độ làm tín hiệu.
 * - BỎ mốc "300 từ": số từ không phải yếu tố xếp hạng (chỉ giữ ngưỡng tối thiểu rất thấp để tránh trang rỗng).
 * - BỎ meta keywords: Google bỏ qua thẻ này từ 2009.
 * - THÊM nhóm tín hiệu Google thực sự dùng: câu trả lời trực tiếp (answer-first), cấu trúc
 *   heading dạng câu hỏi, nguồn trích dẫn chính thống, bảng/danh sách bước, khối FAQ,
 *   độ mới của bài, trùng chủ đề với bài khác, và tiêu chí kỹ thuật (ảnh bìa ≥1200px, alt...).
 *
 * Điểm được tách làm 2 thang độc lập:
 *  1. `technical` — SEO kỹ thuật (bắt buộc/nên có).
 *  2. `readiness` — Answer-readiness: khả năng được trích dẫn trong AI Overviews / AI Mode.
 */

import type { Block } from "@/components/block-editor/types"
import { stripHtml } from "./sanitize"

export type IssueSeverity = "error" | "warning" | "info" | "success"

export interface SeoIssue {
  severity: IssueSeverity
  message: string
  category: string
  /** Gợi ý hành động cụ thể cho writer */
  action?: string
  /** Block cần sửa (nếu xác định được) */
  blockId?: string
  /** Với ảnh: số thứ tự ảnh trong bài */
  imageIndex?: number
}

export interface SeoScores {
  technical: number
  readiness: number
}

export interface SeoAnalysis {
  scores: SeoScores
  issues: SeoIssue[]
  counts: {
    words: number
    headings: number
    questionHeadings: number
    answerFirstSections: number
    internalLinks: number
    externalLinks: number
    images: number
    imagesWithoutAlt: number
    tables: number
    steps: number
    faqs: number
    hasAnswerFirstIntro: boolean
    hasSources: boolean
    hasFaq: boolean
    hasTable: boolean
  }
  info: {
    titleLength: number
    titlePixelWidth: number
    descriptionLength: number
    readingMinutes: number
    ageDays: number | null
    focusKeywordPlacement: {
      title: boolean
      intro: boolean
      heading: boolean
      alt: boolean
      meta: boolean
    }
  }
}

export interface SeoAnalysisInput {
  title: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  focusKeyword?: string
  slug?: string
  featuredImage?: string
  featuredImageAlt?: string
  blocks?: Block[]
  /** ISO string — dùng để nhắc cập nhật bài cũ */
  publishedAt?: string | null
  updatedAt?: string | null
  /** Các bài khác trong hệ thống, để phát hiện trùng chủ đề */
  otherPosts?: Array<{ id?: string; title: string; focus_keyword?: string | null }>
  /** Nguồn chính thống có sẵn trong bài (link tới fda.gov, gacc, mofcom, mfds...). */
  officialLinkDomains?: string[]
}

const DEFAULT_OFFICIAL_DOMAINS = [
  "fda.gov",
  "hhs.gov",
  "gacc.gov.cn",
  "mofcom.gov.cn",
  "mfds.go.kr",
  "europa.eu",
  "efsa.europa.eu",
  "fda.gov.vn",
  "moh.gov.vn",
  "gov.vn",
  "usda.gov",
  "officialgazette.gov.ph",
  "customs.gov.vn",
]

/** ~600px ở desktop, ước lượng thô: chữ hoa/rộng nặng hơn chữ thường. */
export function estimatePixelWidth(text: string, fontSize = 20): number {
  let units = 0
  for (const char of text) {
    if (/[MW@#%&]/.test(char)) units += 1.35
    else if (/[A-Z0-9]/.test(char)) units += 0.85
    else if (/[ilj.,:;!'|]/.test(char)) units += 0.32
    else if (char === " ") units += 0.42
    else units += 0.62
  }
  return Math.round(units * fontSize)
}

export function countWords(text: string): number {
  const plain = stripHtml(text)
  if (!plain) return 0
  return plain.split(/\s+/).filter((word) => word.length > 0).length
}

export function readingMinutes(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200))
}

/** Tiêu đề trùng nhau tới mức nào (Jaccard trên các từ có nghĩa). */
export function titleSimilarity(a: string, b: string): number {
  const tokenize = (text: string) =>
    new Set(
      stripHtml(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2),
    )

  const setA = tokenize(a)
  const setB = tokenize(b)
  if (setA.size === 0 || setB.size === 0) return 0

  let intersection = 0
  setA.forEach((word) => {
    if (setB.has(word)) intersection += 1
  })

  return intersection / (setA.size + setB.size - intersection)
}

/** Heading có phải dạng câu hỏi không ("... là gì?", "bao lâu", "như thế nào"...). */
const QUESTION_PATTERNS = [
  /\?$/,
  /\b(là gì|bao nhiêu|bao lâu|như thế nào|thế nào|tại sao|vì sao|khi nào|ở đâu|ai|có nên|được không|phải không|gồm những gì|những gì|cách nào|quy trình ra sao)\b/i,
  /^(cách|hướng dẫn|quy trình|thủ tục|điều kiện|hồ sơ|kinh nghiệm)\b/i,
]

export function isQuestionHeading(text: string): boolean {
  const plain = stripHtml(text).trim()
  if (!plain) return false
  return QUESTION_PATTERNS.some((pattern) => pattern.test(plain))
}

interface Section {
  headingBlockId?: string
  headingText?: string
  /** Nội dung text của các block thuộc mục này */
  paragraphs: Array<{ blockId: string; text: string; type: Block["type"] }>
}

function groupIntoSections(blocks: Block[]): { intro: Section; sections: Section[] } {
  const intro: Section = { paragraphs: [] }
  const sections: Section[] = []
  let current: Section = intro

  for (const block of blocks) {
    if (block.type === "heading") {
      current = { headingBlockId: block.id, headingText: stripHtml(String(block.data?.text ?? "")), paragraphs: [] }
      sections.push(current)
      continue
    }

    const rawText =
      block.type === "paragraph" || block.type === "quote"
        ? String(block.data?.text ?? "")
        : block.type === "list"
          ? (block.data?.items ?? []).join(" ")
          : ""

    if (rawText.trim()) {
      current.paragraphs.push({ blockId: block.id, text: stripHtml(rawText), type: block.type })
    }
  }

  return { intro, sections }
}

/** Một mục được coi là "answer-first" khi có câu trả lời trực tiếp 40–80 từ ở đầu mục. */
function sectionIsAnswerFirst(section: Section): boolean {
  const first = section.paragraphs[0]
  if (!first) return false

  const firstSentence = first.text.split(/(?<=[.!?…])\s+/)[0] ?? first.text
  const words = firstSentence.split(/\s+/).filter(Boolean).length
  const sectionWords = section.paragraphs.reduce((total, item) => total + item.text.split(/\s+/).length, 0)

  // Câu đầu phải "đứng độc lập": 15–90 từ, và là một phần đáng kể của câu trả lời
  if (words < 15 || words > 90) return false
  if (sectionWords > 0 && firstSentence.length / Math.max(first.text.length, 1) < 0.25) return false

  // Loại các câu "dẫn dắt" rỗng nghĩa thường gặp
  const filler = /(trong bối cảnh|ngày càng|như chúng ta đã biết|trước khi đi vào|hãy cùng tìm hiểu|dưới đây là một số)/i
  return !filler.test(firstSentence)
}

/**
 * Phân tích một bài viết và trả về điểm + danh sách việc cần làm.
 * Hàm thuần (không phụ thuộc DOM) nên chạy được cả ở server.
 */
export function analyzePostSeo(input: SeoAnalysisInput): SeoAnalysis {
  const {
    title,
    excerpt,
    metaTitle,
    metaDescription,
    focusKeyword = "",
    slug = "",
    featuredImage = "",
    featuredImageAlt = "",
    blocks = [],
    publishedAt = null,
    updatedAt = null,
    otherPosts = [],
    officialLinkDomains = DEFAULT_OFFICIAL_DOMAINS,
  } = input

  const issues: SeoIssue[] = []
  let technical = 100
  let readiness = 100

  /* ---------------------------------- Title ---------------------------------- */
  const metaTitleText = (metaTitle || title).trim()
  const titleLength = metaTitleText.length
  const titlePixelWidth = estimatePixelWidth(metaTitleText, 20)

  if (!metaTitleText) {
    issues.push({
      severity: "error",
      category: "title",
      message: "Tiêu đề bài viết không được để trống",
      action: "Nhập tiêu đề (30–60 ký tự là vùng an toàn)",
    })
    technical -= 20
  } else if (titlePixelWidth > 620) {
    issues.push({
      severity: "warning",
      category: "title",
      message: `Tiêu đề dài ~${titlePixelWidth}px (Google cắt quanh 600px ở desktop, mobile cắt sớm hơn)`,
      action: "Rút gọn hoặc đưa phần quan trọng lên đầu tiêu đề",
    })
    technical -= 8
  } else if (titlePixelWidth > 560) {
    issues.push({
      severity: "info",
      category: "title",
      message: `Tiêu đề ~${titlePixelWidth}px — sát ngưỡng cắt trên desktop`,
      action: "Cân nhắc rút ngắn nếu tiêu đề còn phần đuôi ít quan trọng",
    })
  } else {
    issues.push({
      severity: "success",
      category: "title",
      message: `Độ dài tiêu đề tốt (~${titlePixelWidth}px / 600px)`,
    })
  }

  // H1 hiển thị trong bài chính là `title` -> cảnh báo lệch với meta title (Google hay viết lại tiêu đề)
  if (metaTitle && title && titleSimilarity(metaTitle, title) < 0.5) {
    issues.push({
      severity: "info",
      category: "title",
      message: "Meta title khác khá nhiều so với H1 của bài",
      action: "Nên để H1 và meta title cùng thông điệp để giảm khả năng Google tự viết lại tiêu đề",
    })
  }

  /* ------------------------------ Meta description ----------------------------- */
  const desc = (metaDescription || excerpt).trim()
  const descriptionLength = desc.length

  if (!desc) {
    issues.push({
      severity: "warning",
      category: "meta",
      message: "Chưa có meta description (Google sẽ tự cắt đoạn trong bài)",
      action: "Viết 120–158 ký tự mô tả đúng nội dung — giúp tăng CTR dù không phải yếu tố xếp hạng",
    })
    technical -= 10
  } else if (descriptionLength < 70) {
    issues.push({
      severity: "info",
      category: "meta",
      message: `Meta description ngắn (${descriptionLength} ký tự)`,
      action: "Nên 120–158 ký tự để dùng hết chỗ hiển thị",
    })
    technical -= 4
  } else if (descriptionLength > 165) {
    issues.push({
      severity: "warning",
      category: "meta",
      message: `Meta description bị cắt (${descriptionLength} ký tự, hiển thị khoảng 158)`,
      action: "Rút còn ~155 ký tự và đặt thông điệp chính lên đầu",
    })
    technical -= 5
  } else {
    issues.push({
      severity: "success",
      category: "meta",
      message: `Meta description ổn (${descriptionLength} ký tự)`,
    })
  }

  /* --------------------------------- Nội dung --------------------------------- */
  const plainParts = blocks.map((block) => ({
    type: block.type,
    text:
      block.type === "paragraph" || block.type === "quote"
        ? stripHtml(String(block.data?.text ?? ""))
        : block.type === "list"
          ? stripHtml((block.data?.items ?? []).join(" "))
          : block.type === "table"
            ? stripHtml(((block.data?.content ?? []) as string[][]).map((row) => row.join(" ")).join(" "))
            : "",
  }))

  const fullText = plainParts.map((part) => part.text).join(" ")
  const wordCount = countWords(fullText)
  const reading = readingMinutes(wordCount)

  if (wordCount < 50) {
    issues.push({
      severity: "error",
      category: "content",
      message: `Nội dung quá ngắn (${wordCount} từ)`,
      action: "Bổ sung nội dung trước khi lưu nháp/xuất bản",
    })
    technical -= 20
    readiness -= 20
  } else if (wordCount < 150) {
    issues.push({
      severity: "info",
      category: "content",
      message: `Bài ${wordCount} từ — khá ngắn cho chủ đề hướng dẫn`,
      action: "Bổ sung ví dụ, số liệu hoặc câu hỏi thường gặp (không cần chạy theo số từ)",
    })
  } else {
    issues.push({
      severity: "success",
      category: "content",
      message: `${wordCount} từ (~${reading} phút đọc)`,
    })
  }

  /* --------------------- Cấu trúc heading + answer-first (AI) --------------------- */
  const headingBlocks = blocks.filter((block) => block.type === "heading")
  const { intro, sections } = groupIntoSections(blocks)

  const issueHeadings = headingBlocks
    .map((block) => ({ block, text: stripHtml(String(block.data?.text ?? "")) }))
    .filter((item) => isQuestionHeading(item.text))

  const answerFirstSections = sections.filter(sectionIsAnswerFirst)
  const introIsAnswerFirst = sectionIsAnswerFirst(intro)

  if (headingBlocks.length === 0) {
    issues.push({
      severity: "warning",
      category: "structure",
      message: "Bài chưa có heading (H2/H3) nào",
      action: "Chia bài thành các mục bằng H2/H3 để người đọc và AI dễ trích xuất",
    })
    technical -= 8
    readiness -= 8
  } else {
    const questionRatio = issueHeadings.length / headingBlocks.length
    if (questionRatio >= 0.4) {
      issues.push({
        severity: "success",
        category: "structure",
        message: `${issueHeadings.length}/${headingBlocks.length} heading là dạng câu hỏi — rất tốt cho trích dẫn AI`,
      })
      readiness += 0
    } else if (issueHeadings.length === 0) {
      issues.push({
        severity: "info",
        category: "structure",
        message: "Chưa có heading nào ở dạng câu hỏi",
        action: 'Nên có ít nhất 1–2 H2 dạng "… là gì?", "… bao lâu?", "… như thế nào?"',
      })
      readiness -= 4
    } else {
      issues.push({
        severity: "success",
        category: "structure",
        message: `Có ${issueHeadings.length} heading dạng câu hỏi`,
      })
    }
  }

  if (!introIsAnswerFirst && wordCount >= 50) {
    const introIsEmpty = intro.paragraphs.length === 0
    issues.push({
      severity: "warning",
      category: "ai",
      message: introIsEmpty
        ? "Bài mở đầu bằng heading luôn — thiếu đoạn trả lời trực tiếp"
        : "Mở bài chưa trả lời trực tiếp câu hỏi chính",
      action: introIsEmpty
        ? "Thêm 1 đoạn 40–80 từ ngay dưới tiêu đề (trước H2 đầu tiên) trả lời thẳng câu hỏi chính, rồi mới chia mục"
        : "Viết 40–80 từ trả lời thẳng ngay đầu bài — phần lớn trích dẫn của AI Overviews lấy từ 30% nội dung đầu trang",
      // Không có đoạn mở đầu thì nhảy tới block đầu tiên để writer chèn ngay tại đó
      blockId: intro.paragraphs[0]?.blockId ?? blocks[0]?.id,
    })
    readiness -= 14
  } else if (introIsAnswerFirst) {
    issues.push({ severity: "success", category: "ai", message: "Mở bài có câu trả lời trực tiếp (answer-first)" })
  }

  const sectionsWithoutAnswer = sections.filter(
    (section) => section.paragraphs.length > 0 && !sectionIsAnswerFirst(section),
  )

  if (sections.length > 0) {
    const answeredRatio = answerFirstSections.length / sections.length
    if (answeredRatio >= 0.7) {
      issues.push({
        severity: "success",
        category: "ai",
        message: `${answerFirstSections.length}/${sections.length} mục mở đầu bằng câu trả lời trực tiếp`,
      })
    } else {
      const firstMissing = sectionsWithoutAnswer[0]
      issues.push({
        severity: answerFirstSections.length === 0 ? "warning" : "info",
        category: "ai",
        message: `${sections.length - answerFirstSections.length}/${sections.length} mục chưa trả lời trực tiếp trong 2 câu đầu`,
        action: "Mỗi H2 nên mở bằng 1–2 câu trả lời trọn nghĩa, sau đó mới giải thích chi tiết",
        blockId: firstMissing?.headingBlockId,
      })
      readiness -= Math.min(20, (sections.length - answerFirstSections.length) * 5)
    }
  }

  /* --------------------------- Bảng / danh sách bước --------------------------- */
  const tableCount = blocks.filter((block) => block.type === "table").length
  const listBlocks = blocks.filter((block) => block.type === "list")
  const stepBlocks = listBlocks.filter((block) => block.data?.style === "ordered").length

  if (tableCount === 0 && stepBlocks === 0) {
    issues.push({
      severity: "info",
      category: "ai",
      message: "Chưa có bảng so sánh hoặc danh sách bước nào",
      action: "Bảng so sánh / danh sách bước là dạng nội dung được AI trích dẫn nhiều nhất",
    })
    readiness -= 6
  } else {
    issues.push({
      severity: "success",
      category: "ai",
      message: `Có ${tableCount} bảng, ${stepBlocks} danh sách bước`,
    })
  }

  /* -------------------------------- Khối FAQ -------------------------------- */
  const faqSections = headingBlocks.filter((block) => /faq|câu hỏi thường gặp|hỏi[- ]đáp/i.test(String(block.data?.text ?? "")))
  const hasFaq = faqSections.length > 0
  if (!hasFaq) {
    issues.push({
      severity: "info",
      category: "ai",
      message: "Chưa có mục Câu hỏi thường gặp (FAQ)",
      action: "Thêm 2–4 câu hỏi người đọc hay hỏi để trả lời truy vấn dài (không cần schema đặc biệt)",
    })
    readiness -= 6
  } else {
    issues.push({ severity: "success", category: "ai", message: "Có mục Câu hỏi thường gặp" })
  }

  /* ---------------------------------- Links ---------------------------------- */
  // Link nằm trong HTML inline của block (text đã được sanitize nên chỉ còn href an toàn)
  const rawContent = blocks.map((block) => JSON.stringify(block.data ?? {})).join(" ")
  const hrefs: string[] = []
  const hrefRegex = /href=\\?"([^"\\]+)\\?"/gi
  let hrefMatch: RegExpExecArray | null
  while ((hrefMatch = hrefRegex.exec(rawContent)) !== null) {
    hrefs.push(hrefMatch[1])
  }

  const internalLinks = hrefs.filter((href) => href.startsWith("/") || href.includes("veximglobal.com"))
  const externalLinks = hrefs.filter((href) => /^https?:\/\//i.test(href) && !href.includes("veximglobal.com"))
  const officialLinks = externalLinks.filter((href) =>
    officialLinkDomains.some((domain) => href.toLowerCase().includes(domain)),
  )
  const hasSources = officialLinks.length > 0

  if (internalLinks.length === 0) {
    issues.push({
      severity: "warning",
      category: "link",
      message: "Chưa có liên kết nội bộ nào trong bài",
      action: "Thêm 2–4 link tới bài viết/dịch vụ liên quan với anchor text mô tả đích đến",
    })
    technical -= 8
    readiness -= 4
  } else if (internalLinks.length < 2) {
    issues.push({
      severity: "info",
      category: "link",
      message: `Chỉ có ${internalLinks.length} liên kết nội bộ`,
      action: "Nên có ít nhất 2–3 liên kết nội bộ trong thân bài",
    })
  } else {
    issues.push({ severity: "success", category: "link", message: `${internalLinks.length} liên kết nội bộ` })
  }

  if (!hasSources) {
    issues.push({
      severity: "warning",
      category: "sources",
      message: "Chưa dẫn nguồn chính thống (FDA, GACC, MFDS, công báo…)",
      action:
        "Với nội dung tuân thủ, mỗi khẳng định về quy định nên kèm link nguồn — đây là tín hiệu tin cậy quan trọng nhất còn thiếu",
    })
    readiness -= 14
  } else {
    issues.push({
      severity: "success",
      category: "sources",
      message: `Có ${officialLinks.length} nguồn chính thống được dẫn`,
    })
  }

  /* --------------------------------- Images --------------------------------- */
  const imageBlocks = blocks.filter((block) => block.type === "image")
  const imagesWithoutAlt = imageBlocks.filter((block) => {
    const data = block.data ?? {}
    return !String(data.alt ?? "").trim() && !String(data.caption ?? "").trim()
  })

  imagesWithoutAlt.forEach((block, index) => {
    issues.push({
      severity: "error",
      category: "image",
      message: `Ảnh #${imageBlocks.indexOf(block) + 1} trong bài thiếu alt text`,
      action: "Mô tả ngắn nội dung ảnh (giúp SEO ảnh + trình đọc màn hình)",
      blockId: block.id,
      imageIndex: index,
    })
    technical -= 5
  })

  if (imageBlocks.length > 0 && imagesWithoutAlt.length === 0) {
    issues.push({ severity: "success", category: "image", message: `Cả ${imageBlocks.length} ảnh đều có alt/caption` })
  }

  if (wordCount > 700 && imageBlocks.length === 0) {
    issues.push({
      severity: "info",
      category: "image",
      message: "Bài dài nhưng chưa có ảnh minh họa trong nội dung",
      action: "Thêm 1–2 ảnh/bảng ở các mục dài để dễ đọc",
    })
    readiness -= 3
  }

  // Ảnh bìa
  if (!featuredImage) {
    issues.push({
      severity: "warning",
      category: "image",
      message: "Chưa có ảnh bìa",
      action: "Ảnh bìa cần cho OG/Twitter card và Google Discover (≥1200px ngang)",
    })
    technical -= 6
  } else {
    issues.push({ severity: "success", category: "image", message: "Đã có ảnh bìa" })

    if (!featuredImageAlt.trim()) {
      issues.push({
        severity: "warning",
        category: "image",
        message: "Ảnh bìa chưa có alt text",
        action: "Thêm alt mô tả ảnh bìa (đang được ưu tiên hiển thị ở đầu bài)",
      })
      technical -= 4
    }
  }

  /* ---------------------------------- Slug ---------------------------------- */
  if (slug && slug.length > 75) {
    issues.push({
      severity: "info",
      category: "slug",
      message: `Slug dài (${slug.length} ký tự)`,
      action: "Rút ngắn slug còn 3–6 từ chính; đổi slug nên có redirect 301 từ URL cũ",
    })
  }

  /* --------------------------- Từ khóa trọng tâm (vị trí) --------------------------- */
  const keyword = focusKeyword.trim()
  const keywordLower = keyword.toLowerCase()
  const introText = intro.paragraphs.map((item) => item.text).join(" ").toLowerCase()
  const headingTexts = headingBlocks.map((block) => stripHtml(String(block.data?.text ?? "")).toLowerCase())
  const altTexts = imageBlocks
    .map((block) => `${block.data?.alt ?? ""} ${block.data?.caption ?? ""}`.toLowerCase())
    .join(" ")

  const placement = {
    title: keywordLower.length > 0 && metaTitleText.toLowerCase().includes(keywordLower),
    intro: keywordLower.length > 0 && introText.includes(keywordLower),
    heading: keywordLower.length > 0 && headingTexts.some((text) => text.includes(keywordLower)),
    alt: keywordLower.length > 0 && altTexts.includes(keywordLower),
    meta: keywordLower.length > 0 && desc.toLowerCase().includes(keywordLower),
  }

  if (keyword) {
    if (!placement.title) {
      issues.push({
        severity: "warning",
        category: "keyword",
        message: `Từ khóa "${keyword}" chưa có trong tiêu đề`,
        action: "Đưa từ khóa vào tiêu đề, nên ở nửa đầu",
      })
      technical -= 6
    }
    if (!placement.intro) {
      issues.push({
        severity: "info",
        category: "keyword",
        message: `Từ khóa "${keyword}" chưa xuất hiện trong phần mở bài`,
        action: "Dùng từ khóa (hoặc biến thể) trong 100 từ đầu",
      })
      technical -= 3
    }
    if (placement.title && placement.intro) {
      issues.push({
        severity: "success",
        category: "keyword",
        message: `Từ khóa "${keyword}" đã ở đúng vị trí quan trọng (tiêu đề + mở bài)`,
      })
    }

    // Cảnh báo nhồi nhét: chỉ khi lặp bất thường, KHÔNG dùng mật độ % làm thang điểm
    const occurrences = keywordLower.split(/\s+/).length > 1
      ? (fullText.toLowerCase().split(keywordLower).length - 1)
      : (fullText.toLowerCase().match(new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g")) || []).length

    if (wordCount > 200 && occurrences / Math.max(wordCount, 1) > 0.06) {
      issues.push({
        severity: "warning",
        category: "keyword",
        message: `Từ khóa lặp ${occurrences} lần — có dấu hiệu nhồi nhét`,
        action: "Giảm bớt, dùng từ đồng nghĩa/biến thể để câu văn tự nhiên",
      })
      technical -= 4
    }
  } else {
    issues.push({
      severity: "info",
      category: "keyword",
      message: "Chưa đặt từ khóa trọng tâm",
      action: "Đặt từ khóa để hệ thống kiểm tra vị trí (không cần đạt mật độ %)",
    })
  }

  /* ------------------------------ Trùng chủ đề ------------------------------ */
  if (title.trim() && otherPosts.length > 0) {
    const duplicates = otherPosts
      .map((post) => ({ post, similarity: titleSimilarity(title, post.title) }))
      .filter((item) => item.similarity >= 0.6)
      .sort((a, b) => b.similarity - a.similarity)

    if (duplicates.length > 0) {
      const top = duplicates[0]
      issues.push({
        severity: duplicates.length > 1 || top.similarity >= 0.8 ? "warning" : "info",
        category: "duplicate",
        message: `Tiêu đề trùng ${Math.round(top.similarity * 100)}% với bài đã có: "${top.post.title}"${duplicates.length > 1 ? ` (và ${duplicates.length - 1} bài khác)` : ""}`,
        action: "Cân nhắc gộp bài, hoặc đổi góc tiếp cận để không tự cạnh tranh từ khóa (cannibalization)",
      })
      technical -= top.similarity >= 0.8 ? 8 : 4
    }
  }

  /* -------------------------------- Độ mới -------------------------------- */
  const lastTouched = updatedAt || publishedAt
  let ageDays: number | null = null
  if (lastTouched) {
    const time = new Date(lastTouched).getTime()
    if (Number.isFinite(time)) ageDays = Math.floor((Date.now() - time) / 86400000)
  }

  if (ageDays !== null && ageDays > 210) {
    issues.push({
      severity: "info",
      category: "freshness",
      message: `Bài đã ${Math.round(ageDays / 30)} tháng chưa cập nhật`,
      action: "Kiểm tra lại số liệu/quy định và cập nhật — độ mới ảnh hưởng cả Search lẫn AI Overviews",
    })
  }

  return {
    scores: {
      technical: Math.max(0, Math.min(100, technical)),
      readiness: Math.max(0, Math.min(100, readiness)),
    },
    issues,
    counts: {
      words: wordCount,
      headings: headingBlocks.length,
      questionHeadings: issueHeadings.length,
      answerFirstSections: answerFirstSections.length,
      internalLinks: internalLinks.length,
      externalLinks: externalLinks.length,
      images: imageBlocks.length,
      imagesWithoutAlt: imagesWithoutAlt.length,
      tables: tableCount,
      steps: stepBlocks,
      faqs: hasFaq ? 1 : 0,
      hasAnswerFirstIntro: introIsAnswerFirst,
      hasSources,
      hasFaq,
      hasTable: tableCount > 0,
    },
    info: {
      titleLength,
      titlePixelWidth,
      descriptionLength,
      readingMinutes: reading,
      ageDays,
      focusKeywordPlacement: placement,
    },
  }
}

/** Gợi ý câu hỏi để writer bổ sung (dựa trên từ khóa + danh mục). */
export function suggestQuestions(focusKeyword: string, category = ""): string[] {
  const keyword = focusKeyword.trim() || "chủ đề này"
  const base = [
    `${keyword} là gì?`,
    `${keyword} mất bao lâu?`,
    `Chi phí ${keyword} là bao nhiêu?`,
    `${keyword} cần những giấy tờ gì?`,
    `Doanh nghiệp Việt Nam cần lưu ý gì khi ${keyword}?`,
  ]

  if (/FDA/i.test(category)) {
    return [
      `Đăng ký FDA cho thực phẩm mất bao lâu?`,
      `Chi phí đăng ký FDA và phí duy trì hằng năm là bao nhiêu?`,
      `Doanh nghiệp Việt Nam có bắt buộc phải có US Agent không?`,
      ...base.slice(1, 3),
    ]
  }
  if (/GACC/i.test(category)) {
    return [
      "Đăng ký GACC cần những giấy tờ gì?",
      "Decree 248 và Decree 249 khác nhau thế nào?",
      "Hồ sơ GACC bị từ chối thì xử lý ra sao?",
      ...base.slice(0, 2),
    ]
  }
  if (/MFDS/i.test(category)) {
    return [
      "Đăng ký MFDS mất bao lâu?",
      "Sản phẩm nào bắt buộc đăng ký MFDS?",
      "Hồ sơ MFDS cần dịch thuật công chứng không?",
      ...base.slice(0, 2),
    ]
  }

  return base
}
