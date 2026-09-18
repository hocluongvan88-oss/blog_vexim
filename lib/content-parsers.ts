import type { Block } from "@/components/block-editor/types"
import { sanitizeInlineHtml, stripHtml } from "./sanitize"

/**
 * Bộ parser dùng chung cho module blog (1 nguồn duy nhất).
 *
 * Trước đây logic này bị lặp lại 3 lần ở:
 *   - components/admin/html-paste-dialog.tsx
 *   - components/block-editor/blocks/paragraph-block.tsx
 *   - components/block-editor/block-editor.tsx (dead code)
 * và mỗi bản lại có bug khác nhau (ví dụ `hasHeader` luôn `true`).
 */

export interface ParsedTableData {
  rows: number
  cols: number
  content: string[][]
  hasHeader: boolean
}

export interface ParsedBlock {
  type: "heading" | "paragraph" | "quote" | "list" | "table" | "image"
  text: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  style?: "ordered" | "unordered"
  items?: string[]
  tableData?: ParsedTableData
  imageData?: {
    url: string
    alt: string
    caption: string
    width: string
  }
}

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"]
const CONTAINER_TAGS = ["div", "section", "article", "main", "aside", "header", "footer", "figure", "figcaption"]

let blockIdCounter = 0

export function generateBlockId(prefix = "block"): string {
  blockIdCounter += 1
  return `${prefix}_${blockIdCounter}_${Math.random().toString(36).slice(2, 11)}`
}

/* ------------------------------------------------------------------ */
/* Markdown                                                            */
/* ------------------------------------------------------------------ */

/** Chuyển markdown inline (bold/italic/link/code) sang HTML inline. */
export function parseInlineMarkdown(text: string): string {
  let result = text

  // Code trước để không bị các regex khác phá
  const codeTokens: string[] = []
  result = result.replace(/`([^`]+)`/g, (_m, code: string) => {
    codeTokens.push(`<code>${code}</code>`)
    return `\u0000CODE${codeTokens.length - 1}\u0000`
  })

  // Bold: **text** hoặc __text__
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  result = result.replace(/__(.+?)__/g, "<strong>$1</strong>")

  // Italic: *text* hoặc _text_
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
  result = result.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "<em>$1</em>")

  // Links: [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
    const safeHref = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href) ? href : ""
    if (!safeHref) return label
    return `<a href="${safeHref}">${label}</a>`
  })

  // Trả lại code
  result = result.replace(/\u0000CODE(\d+)\u0000/g, (_m, idx: string) => codeTokens[Number(idx)] ?? "")

  return result
}

/** Parse bảng markdown (đã tách thành các dòng). Trả về `null` nếu không hợp lệ. */
export function parseMarkdownTable(lines: string[]): ParsedTableData | null {
  if (!lines || lines.length < 2) return null

  const rows: string[][] = []
  let separatorIndex = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Dòng phân cách: |---|---|
    if (/^\|[\s\-:|]+\|$/.test(line) && line.includes("-")) {
      separatorIndex = i
      continue
    }

    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim())

    if (cells.length > 0) rows.push(cells)
  }

  if (rows.length === 0) return null

  const maxCols = Math.max(...rows.map((row) => row.length))
  const normalizedRows = rows.map((row) => {
    const next = [...row]
    while (next.length < maxCols) next.push("")
    return next
  })

  return {
    rows: normalizedRows.length,
    cols: maxCols,
    content: normalizedRows,
    // Bảng markdown chỉ có header khi dòng phân cách nằm ngay sau dòng đầu tiên
    hasHeader: separatorIndex === 1 && normalizedRows.length > 1,
  }
}

/** Parse nội dung markdown (đoạn văn, heading, list, quote, bảng) thành khối. */
export function parseMarkdownToBlocks(text: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = []
  const lines = String(text ?? "").split(/\r?\n/)
  let i = 0

  while (i < lines.length) {
    const trimmedLine = lines[i].trim()

    if (!trimmedLine) {
      i++
      continue
    }

    // Bảng markdown
    if (trimmedLine.startsWith("|") && trimmedLine.endsWith("|")) {
      const tableLines: string[] = [trimmedLine]
      i++
      while (i < lines.length) {
        const nextLine = lines[i].trim()
        if (nextLine.startsWith("|") && nextLine.endsWith("|")) {
          tableLines.push(nextLine)
          i++
        } else if (nextLine === "" && i + 1 < lines.length && lines[i + 1].trim().startsWith("|")) {
          i++
        } else {
          break
        }
      }

      const tableData = parseMarkdownTable(tableLines)
      if (tableData) {
        blocks.push({ type: "table", text: "", tableData })
        continue
      }
    }

    // Heading
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length, 6) as ParsedBlock["level"]
      blocks.push({ type: "heading", text: sanitizeInlineHtml(parseInlineMarkdown(headingMatch[2])), level })
      i++
      continue
    }

    // Blockquote
    if (trimmedLine.startsWith(">")) {
      blocks.push({
        type: "quote",
        text: sanitizeInlineHtml(parseInlineMarkdown(trimmedLine.replace(/^>\s*/, ""))),
      })
      i++
      continue
    }

    // List không thứ tự
    if (/^[*\-+]\s+/.test(trimmedLine)) {
      const items: string[] = []
      while (i < lines.length && /^[*\-+]\s+/.test(lines[i].trim())) {
        items.push(sanitizeInlineHtml(parseInlineMarkdown(lines[i].trim().replace(/^[*\-+]\s+/, ""))))
        i++
      }
      blocks.push({ type: "list", text: "", style: "unordered", items })
      continue
    }

    // List có thứ tự
    if (/^\d+\.\s+/.test(trimmedLine)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(sanitizeInlineHtml(parseInlineMarkdown(lines[i].trim().replace(/^\d+\.\s+/, ""))))
        i++
      }
      blocks.push({ type: "list", text: "", style: "ordered", items })
      continue
    }

    // Đường kẻ ngang -> bỏ qua
    if (/^[-*_]{3,}$/.test(trimmedLine)) {
      i++
      continue
    }

    // Đoạn văn
    blocks.push({
      type: "paragraph",
      text: sanitizeInlineHtml(parseInlineMarkdown(trimmedLine)),
    })
    i++
  }

  return blocks
}

/** Kiểm tra nhanh nội dung có phải markdown không (để chọn parser phù hợp). */
export function looksLikeMarkdown(content: string): boolean {
  return (
    /^\|.*\|$/m.test(content) ||
    /^#{1,6}\s+/m.test(content) ||
    /^[*\-+]\s+/m.test(content) ||
    /^\d+\.\s+/m.test(content) ||
    /^>\s+/m.test(content)
  )
}

/* ------------------------------------------------------------------ */
/* HTML (chỉ chạy ở client / môi trường có DOM)                        */
/* ------------------------------------------------------------------ */

function ensureDomParser() {
  if (typeof DOMParser === "undefined") {
    throw new Error("DOMParser không khả dụng (hàm parse HTML chỉ dùng ở phía client).")
  }
}

/**
 * Làm sạch HTML inline khi copy từ Google Docs / Word / web:
 * - Chuyển <span style="font-weight:700"> thành <strong>, ... 
 * - Bỏ toàn bộ attribute lạ, giữ lại href an toàn.
 */
export function cleanInlineHtml(html: string): string {
  if (!html || typeof html !== "string") return ""
  ensureDomParser()

  const temp = document.createElement("div")
  temp.innerHTML = html

  temp.querySelectorAll("script, style, meta, link, iframe, object, embed, form, input, button").forEach((el) => el.remove())

  // span có style -> thẻ semantic
  temp.querySelectorAll("span").forEach((span) => {
    const style = span.getAttribute("style") || ""
    const hasBold = /font-weight\s*:\s*(bold|[6-9]00)/i.test(style)
    const hasItalic = /font-style\s*:\s*italic/i.test(style)
    const hasUnderline = /text-decoration[^;]*underline/i.test(style)

    if (!hasBold && !hasItalic && !hasUnderline) {
      span.replaceWith(...Array.from(span.childNodes))
      return
    }

    let inner = span.innerHTML
    if (hasUnderline) inner = `<u>${inner}</u>`
    if (hasItalic) inner = `<em>${inner}</em>`
    if (hasBold) inner = `<strong>${inner}</strong>`

    const wrapper = document.createElement("span")
    wrapper.innerHTML = inner
    span.replaceWith(...Array.from(wrapper.childNodes))
  })

  // Bỏ thẻ block bao ngoài nhưng giữ nội dung, thêm khoảng trắng để không dính chữ
  temp.querySelectorAll("p, div").forEach((el) => {
    el.replaceWith(...Array.from(el.childNodes), document.createTextNode(" "))
  })

  // Giữ duy nhất href an toàn
  temp.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || ""
    const target = a.getAttribute("target") || ""
    const rel = a.getAttribute("rel") || ""
    while (a.attributes.length > 0) a.removeAttribute(a.attributes[0].name)
    if (href && !/^\s*javascript:/i.test(href)) {
      a.setAttribute("href", href)
      if (target) a.setAttribute("target", target)
      if (rel) a.setAttribute("rel", rel)
    }
  })

  temp.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName.toLowerCase()
    if (tag === "a") return
    while (el.attributes.length > 0) el.removeAttribute(el.attributes[0].name)
  })

  return sanitizeInlineHtml(temp.innerHTML)
}

function hasBlockChildren(el: Element): boolean {
  return el.querySelector("p, div, section, article, ul, ol, table, blockquote, h1, h2, h3, h4, h5, h6, figure") !== null
}

/** Parse HTML thành các khối (heading, đoạn, quote, list, table, image). */
export function parseHtmlToParsedBlocks(html: string): ParsedBlock[] {
  if (!html || typeof html !== "string") return []
  ensureDomParser()

  const blocks: ParsedBlock[] = []
  const doc = new DOMParser().parseFromString(html, "text/html")

  const pushParagraph = (rawHtml: string) => {
    const text = sanitizeInlineHtml(cleanInlineHtml(rawHtml))
    if (stripHtml(text)) blocks.push({ type: "paragraph", text })
  }

  const processTable = (tableEl: Element) => {
    const rows: string[][] = []

    const readRows = (selector: string) => {
      tableEl.querySelectorAll(selector).forEach((tr) => {
        const cells: string[] = []
        tr.querySelectorAll("td, th").forEach((cell) => {
          cells.push(cell.textContent?.trim() ? cleanInlineHtml(cell.innerHTML) : "")
        })
        if (cells.length > 0) rows.push(cells)
      })
    }

    readRows(":scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr, :scope > tr")
    if (rows.length === 0) readRows("tr")

    if (rows.length === 0) return
    const maxCols = Math.max(...rows.map((row) => row.length))
    const normalized = rows.map((row) => {
      const next = [...row]
      while (next.length < maxCols) next.push("")
      return next
    })

    const hasHeader =
      tableEl.querySelector("thead") !== null || tableEl.querySelector("tr:first-child th") !== null

    blocks.push({
      type: "table",
      text: "",
      tableData: { rows: normalized.length, cols: maxCols, content: normalized, hasHeader },
    })
  }

  const processImage = (img: Element) => {
    const src = img.getAttribute("src")?.trim() || ""
    if (!src || /^\s*javascript:/i.test(src)) return
    blocks.push({
      type: "image",
      text: "",
      imageData: {
        url: src,
        alt: (img.getAttribute("alt") || "").trim(),
        caption: (img.getAttribute("title") || "").trim(),
        width: "100%",
      },
    })
  }

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() || ""
      if (text) pushParagraph(text)
      return
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return

    const el = node as Element
    const tag = el.tagName.toLowerCase()

    if (HEADING_TAGS.includes(tag)) {
      const text = sanitizeInlineHtml(cleanInlineHtml(el.innerHTML))
      if (stripHtml(text)) {
        blocks.push({ type: "heading", text, level: Number(tag.charAt(1)) as ParsedBlock["level"] })
      }
      return
    }

    if (tag === "p") {
      pushParagraph(el.innerHTML)
      return
    }

    if (tag === "blockquote") {
      const text = sanitizeInlineHtml(cleanInlineHtml(el.innerHTML))
      if (stripHtml(text)) blocks.push({ type: "quote", text })
      return
    }

    if (tag === "img") {
      processImage(el)
      return
    }

    if (tag === "figure") {
      const imgs = el.querySelectorAll("img")
      const onlyImage = imgs.length > 0 && !hasBlockChildren(el)
      if (onlyImage) {
        imgs.forEach(processImage)
        return
      }
    }

    if (tag === "table") {
      processTable(el)
      return
    }

    if (tag === "ul" || tag === "ol") {
      const items: string[] = []
      el.querySelectorAll(":scope > li").forEach((li) => {
        const text = sanitizeInlineHtml(cleanInlineHtml(li.innerHTML))
        if (stripHtml(text)) items.push(text)
      })
      if (items.length > 0) {
        blocks.push({ type: "list", text: "", style: tag === "ol" ? "ordered" : "unordered", items })
      }
      return
    }

    if (tag === "br" || tag === "hr") return

    if (CONTAINER_TAGS.includes(tag)) {
      Array.from(el.childNodes).forEach(processNode)
      return
    }

    // Thẻ inline hoặc thẻ lạ không có con dạng block -> coi như một đoạn văn
    if (!hasBlockChildren(el)) {
      pushParagraph(el.outerHTML)
      return
    }

    Array.from(el.childNodes).forEach(processNode)
  }

  Array.from(doc.body.childNodes).forEach(processNode)

  return blocks
}

/** Chuyển khối đã parse sang cấu trúc Block[] của trình soạn thảo. */
export function parsedBlocksToBlocks(parsed: ParsedBlock[]): Block[] {
  return parsed.map((pb) => {
    switch (pb.type) {
      case "heading":
        return {
          id: generateBlockId(),
          type: "heading",
          data: { text: pb.text, level: pb.level ?? 2, align: "left" },
        }
      case "quote":
        return {
          id: generateBlockId(),
          type: "quote",
          data: { text: pb.text, author: "", align: "left" },
        }
      case "list":
        return {
          id: generateBlockId(),
          type: "list",
          data: { style: pb.style ?? "unordered", items: pb.items ?? [], align: "left" },
        }
      case "table":
        return {
          id: generateBlockId(),
          type: "table",
          data: {
            rows: pb.tableData?.rows ?? 0,
            cols: pb.tableData?.cols ?? 0,
            content: pb.tableData?.content ?? [],
            hasHeader: pb.tableData?.hasHeader ?? true,
            align: "left",
          },
        }
      case "image":
        return {
          id: generateBlockId(),
          type: "image",
          data: {
            url: pb.imageData?.url ?? "",
            alt: pb.imageData?.alt ?? "",
            caption: pb.imageData?.caption ?? "",
            width: pb.imageData?.width ?? "100%",
            align: "center",
          },
        }
      default:
        return {
          id: generateBlockId(),
          type: "paragraph",
          data: { text: pb.text, align: "justify" },
        }
    }
  })
}

/** HTML -> Block[] (dùng cho Import HTML và cho các bài viết định dạng cũ). */
export function htmlToBlocks(html: string): Block[] {
  if (!html || typeof html !== "string") return []
  const trimmed = html.trim()
  if (!trimmed) return []

  try {
    const parsed = parseHtmlToParsedBlocks(trimmed)
    if (parsed.length > 0) return parsedBlocksToBlocks(parsed)
  } catch (error) {
    console.warn("[blog] Không parse được HTML, fallback sang text thuần:", error)
  }

  // Fallback: coi là text thuần, mỗi dòng một đoạn
  return parsedBlocksToBlocks(
    trimmed
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({ type: "paragraph" as const, text: sanitizeInlineHtml(line) })),
  )
}

/* ------------------------------------------------------------------ */
/* Tiện ích                                                            */
/* ------------------------------------------------------------------ */

/** Text thuần của toàn bộ khối — dùng để đếm từ, tìm kiếm, SEO checker. */
export function blocksToPlainText(blocks: Block[] | undefined | null): string {
  if (!blocks || blocks.length === 0) return ""

  const parts: string[] = []

  for (const block of blocks) {
    switch (block.type) {
      case "heading":
      case "paragraph":
      case "quote":
        parts.push(stripHtml(block.data?.text || ""))
        break
      case "list":
        (block.data?.items || []).forEach((item: string) => parts.push(stripHtml(item)))
        break
      case "table":
        (block.data?.content || []).forEach((row: string[]) =>
          (row || []).forEach((cell) => parts.push(stripHtml(cell))),
        )
        break
      case "image":
        if (block.data?.alt) parts.push(String(block.data.alt))
        if (block.data?.caption) parts.push(String(block.data.caption))
        break
      default:
        break
    }
  }

  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim()
}
