/**
 * Bộ đọc markdown cho khung chat — trả về DỮ LIỆU, không trả về chuỗi HTML.
 *
 * ── VÌ SAO VIẾT LẠI ───────────────────────────────────────────────────
 * Bản cũ trong components/chat-widget.tsx:
 *   • Chèn HTML thẳng bằng dangerouslySetInnerHTML -> lỗ hổng XSS: nội dung AI
 *     trả về (mà AI có thể bị dẫn dắt bởi câu hỏi của khách) được đưa nguyên
 *     vào DOM. Khách chỉ cần dụ AI nhả ra thẻ HTML là chạy được script.
 *   • Không hiểu BẢNG. Câu hỏi trong ngành này (hồ sơ / thời gian / chi phí)
 *     rất hay ở dạng bảng, AI xuất bảng ra là khách thấy một đống dấu "|" —
 *     trông như web lỗi.
 *
 * Bản mới trả về cấu trúc dữ liệu để React tự dựng phần tử, nên không có HTML
 * nào được chèn thẳng -> hết XSS, và bảng được dựng tử tế.
 *
 * Hàm thuần, không phụ thuộc DOM/React -> kiểm thử được.
 */

export type InlineNode =
  | { type: "text"; text: string }
  | { type: "strong"; text: string }
  | { type: "em"; text: string }
  | { type: "code"; text: string }
  | { type: "link"; text: string; href: string }

export type MarkdownBlock =
  | { type: "paragraph"; inline: InlineNode[] }
  | { type: "list"; ordered: boolean; items: InlineNode[][] }
  | { type: "table"; header: InlineNode[][]; rows: InlineNode[][][] }
  | { type: "spacer" }

/** Chỉ cho phép liên kết http/https — chặn javascript:, data:, vbscript:… */
export function isSafeHref(href: string): boolean {
  const value = String(href || "").trim().toLowerCase()
  if (!value) return false
  if (value.startsWith("http://") || value.startsWith("https://")) return true
  if (value.startsWith("mailto:") || value.startsWith("tel:")) return true
  return false
}

/**
 * Tách một dòng thành các mảnh văn bản có định dạng.
 * Thứ tự ưu tiên: link -> code -> bold -> italic.
 */
export function parseInline(line: string): InlineNode[] {
  const source = String(line ?? "")
  const nodes: InlineNode[] = []
  const pattern =
    /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\n]+)\*|_([^_\n]+)_/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  const pushText = (text: string) => {
    if (!text) return
    const previous = nodes[nodes.length - 1]
    // Gộp các mảnh chữ liền nhau để React không phải tạo quá nhiều node
    if (previous && previous.type === "text") previous.text += text
    else nodes.push({ type: "text", text })
  }

  while ((match = pattern.exec(source)) !== null) {
    pushText(source.slice(lastIndex, match.index))
    lastIndex = match.index + match[0].length

    if (match[1] !== undefined && match[2] !== undefined) {
      // Nếu URL không an toàn thì giữ nguyên văn bản gốc, KHÔNG tạo thẻ liên kết
      if (isSafeHref(match[2])) nodes.push({ type: "link", text: match[1], href: match[2] })
      else pushText(match[0])
    } else if (match[3] !== undefined) {
      nodes.push({ type: "code", text: match[3] })
    } else if (match[4] !== undefined || match[5] !== undefined) {
      nodes.push({ type: "strong", text: match[4] ?? match[5] })
    } else {
      nodes.push({ type: "em", text: match[6] ?? match[7] ?? "" })
    }
  }

  pushText(source.slice(lastIndex))
  return nodes
}

/** Một dòng có phải là dòng phân cách của bảng markdown? (`|---|---|`) */
function isTableSeparator(line: string): boolean {
  const cells = splitTableRow(line)
  if (cells.length === 0) return false
  return cells.every((cell) => /^:?-{2,}:?$/.test(cell.trim()))
}

/** Tách một dòng bảng thành các ô. */
function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "")
  return trimmed.split("|").map((cell) => cell.trim())
}

/** Dòng này có thể là một hàng của bảng? */
function looksLikeTableRow(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed.includes("|")) return false
  // Bỏ qua dòng chỉ có 1 dấu | ở giữa câu văn thường
  return splitTableRow(trimmed).length >= 2
}

/**
 * Đọc markdown thành danh sách khối để khung chat dựng giao diện.
 * Hỗ trợ: đoạn văn, gạch đầu dòng, danh sách số, BẢNG, dòng trống.
 */
export function parseChatMarkdown(text: string): MarkdownBlock[] {
  const lines = String(text ?? "").split("\n")
  const blocks: MarkdownBlock[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    // Bảng: hàng đầu + hàng phân cách + các hàng còn lại
    if (
      looksLikeTableRow(line) &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1]) &&
      looksLikeTableRow(lines[i + 1])
    ) {
      const header = splitTableRow(line).map(parseInline)
      const rows: InlineNode[][][] = []
      i += 2
      while (i < lines.length && looksLikeTableRow(lines[i]) && !isTableSeparator(lines[i])) {
        rows.push(splitTableRow(lines[i]).map(parseInline))
        i++
      }
      blocks.push({ type: "table", header, rows })
      continue
    }

    // Danh sách
    const bullet = line.match(/^\s*[*+-]\s+(.*)$/)
    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/)
    if (bullet || ordered) {
      const isOrdered = Boolean(ordered)
      const items: InlineNode[][] = []
      while (i < lines.length) {
        const nextBullet = lines[i].match(/^\s*[*+-]\s+(.*)$/)
        const nextOrdered = lines[i].match(/^\s*\d+[.)]\s+(.*)$/)
        if (isOrdered ? !nextOrdered : !nextBullet) break
        items.push(parseInline((isOrdered ? nextOrdered![1] : nextBullet![1]).trim()))
        i++
      }
      blocks.push({ type: "list", ordered: isOrdered, items })
      continue
    }

    // Dòng trống
    if (line.trim() === "") {
      // Gộp nhiều dòng trống liền nhau thành một khoảng nghỉ
      const previous = blocks[blocks.length - 1]
      if (previous && previous.type !== "spacer") blocks.push({ type: "spacer" })
      i++
      continue
    }

    // Đoạn văn thường — gộp các dòng liền nhau để không bị vụn
    const paragraph: string[] = [line.trim()]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].match(/^\s*[*+-]\s+/) &&
      !lines[i].match(/^\s*\d+[.)]\s+/) &&
      !looksLikeTableRow(lines[i])
    ) {
      paragraph.push(lines[i].trim())
      i++
    }
    blocks.push({ type: "paragraph", inline: parseInline(paragraph.join(" ")) })
  }

  // Bỏ khoảng nghỉ ở đầu và cuối
  while (blocks.length > 0 && blocks[0].type === "spacer") blocks.shift()
  while (blocks.length > 0 && blocks[blocks.length - 1].type === "spacer") blocks.pop()

  return blocks
}

/** Có ít nhất một bảng trong nội dung? (dùng cho kiểm thử / thống kê) */
export function hasTable(text: string): boolean {
  return parseChatMarkdown(text).some((block) => block.type === "table")
}
