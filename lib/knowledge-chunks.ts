/**
 * Xử lý tài liệu cho kho tri thức của AI (RAG).
 *
 * File này gom 3 việc trước đây nằm rải rác và KHÔNG nhất quán giữa các API:
 *  1. Làm sạch nội dung thô (HTML từ URL, text từ PDF/Word, markdown).
 *  2. Cắt thành chunk đúng kích thước, giữ ngữ cảnh tiêu đề mục.
 *  3. Ghi chunk xuống DB với tên cột đúng (tự dò `content` / `chunk_text`).
 *
 * ── VÌ SAO CẦN ──
 * Trước đây mỗi API tự cắt chunk một kiểu:
 *  - `upload` cắt theo `\n\n`, không giới hạn kích thước → PDF (chỉ có `\n` đơn)
 *    biến cả tài liệu thành MỘT chunk khổng lồ, AI đọc không nổi → trả lời chung chung.
 *  - `upload` lọc bỏ mọi đoạn < 50 ký tự → mất sạch dòng quan trọng như "Phí: 0 USD".
 *  - `import-files` và sửa tài liệu lại ghi vào cột `chunk_text`, trong khi script 012
 *    đã đổi tên cột thành `content` → ghi lỗi, tài liệu hiện trong danh sách nhưng
 *    kho tri thức RỖNG nên AI không tra được gì.
 */

import { embedTexts, getEmbeddingConfig, toVectorLiteral } from "@/lib/embeddings"

export const MIN_CHUNK_CHARS = 200
export const TARGET_CHUNK_CHARS = 1200
export const MAX_CHUNK_CHARS = 2000
export const CHUNK_OVERLAP_CHARS = 200

export interface ChunkRow {
  document_id: string
  chunk_index: number
  token_count: number
  metadata: Record<string, unknown>
  /** Nội dung chunk — tên cột thật do `insertChunks` quyết định. */
  text: string
}

export type ChunkTextColumn = "content" | "chunk_text"

/* ------------------------------------------------------------------ */
/* 1. LÀM SẠCH NỘI DUNG                                                */
/* ------------------------------------------------------------------ */

/** Bỏ thẻ HTML/script/style, giữ lại text có nghĩa (dùng cho import từ URL). */
export function htmlToPlainText(html: string): string {
  if (!html) return ""

  let text = html
    // Bỏ hoàn toàn script/style/noscript/svg và nội dung của chúng
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")

  // Thẻ xuống dòng / kết thúc khối -> thêm dấu xuống dòng để không dính chữ
  text = text
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(p|div|section|article|li|tr|h[1-6]|blockquote|td|th)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<h([1-6])[^>]*>/gi, (_m, level: string) => `\n${"#".repeat(Number(level))} `)

  // Bỏ mọi thẻ còn lại
  text = text.replace(/<[^>]+>/g, " ")

  // Giải mã entity phổ biến
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&[a-z]+;/gi, " ")

  return normalizeWhitespace(text)
}

/** Chuẩn hoá khoảng trắng nhưng GIỮ dấu xuống dòng cấu trúc. */
export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t\u00a0]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

/** Làm sạch Markdown nhưng GIỮ tiêu đề dạng `#` để chunk biết ngữ cảnh mục. */
export function cleanMarkdownForKnowledge(markdown: string): string {
  let cleaned = markdown

  // Bỏ khối code và bảng markdown (không hữu ích cho RAG dạng text)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, " ")
  cleaned = cleaned.replace(/^\|.*\|$/gm, " ")
  cleaned = cleaned.replace(/^[-=]{3,}$/gm, " ")

  // Giữ tiêu đề (## ...) nhưng bỏ ký hiệu trang trí
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "$1")
  cleaned = cleaned.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1$2")
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1")
  cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, " ")
  cleaned = cleaned.replace(/\[(.+?)\]\(.*?\)/g, "$1")
  cleaned = cleaned.replace(/^[ \t]*[*+]\s+/gm, "- ")

  return normalizeWhitespace(cleaned)
}

/* ------------------------------------------------------------------ */
/* 2. CẮT CHUNK                                                        */
/* ------------------------------------------------------------------ */

interface Block {
  /** Tiêu đề mục đang chứa block này (để AI biết chunk thuộc phần nào). */
  heading: string
  text: string
}

/** Tách nội dung thành các block theo dòng trống, ghi nhớ tiêu đề mục gần nhất. */
function splitIntoBlocks(content: string): Block[] {
  const normalized = normalizeWhitespace(content)
  const lines = normalized.split("\n")
  const blocks: Block[] = []
  let currentHeading = ""
  let buffer: string[] = []

  const flush = () => {
    const text = buffer.join("\n").trim()
    if (text) blocks.push({ heading: currentHeading, text })
    buffer = []
  }

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      flush()
      currentHeading = headingMatch[2].trim()
      continue
    }
    if (!line.trim()) {
      flush()
      continue
    }
    buffer.push(line)
  }
  flush()

  // Nếu tài liệu không có dòng trống nào (PDF thường vậy) và tạo ra 1 block khổng lồ
  // → cắt tiếp theo câu để tránh chunk quá dài.
  return blocks.flatMap((block) =>
    block.text.length <= MAX_CHUNK_CHARS ? [block] : splitBlockBySentence(block),
  )
}

/** Cắt một block quá dài thành nhiều phần theo câu. */
function splitBlockBySentence(block: Block): Block[] {
  const sentences = block.text.split(/(?<=[.!?…])\s+(?=[A-ZÀ-Ỹ0-9#\-])|\n/).filter(Boolean)
  const parts: Block[] = []
  let buffer = ""

  for (const sentence of sentences) {
    const candidate = buffer ? `${buffer} ${sentence}` : sentence
    if (candidate.length > TARGET_CHUNK_CHARS && buffer) {
      parts.push({ heading: block.heading, text: buffer.trim() })
      buffer = sentence
    } else {
      buffer = candidate
    }
  }
  if (buffer.trim()) parts.push({ heading: block.heading, text: buffer.trim() })

  return parts
}

/**
 * Cắt tài liệu thành các chunk để nạp vào kho tri thức.
 *
 * Khác biệt so với bản cũ:
 *  - Ghép các đoạn ngắn tới ~1200 ký tự (trước đây mỗi đoạn = 1 chunk → vụn; PDF thì 1 chunk khổng lồ).
 *  - KHÔNG BAO GIỜ bỏ nội dung: mục ngắn (ví dụ "Phí: 0 USD", "Deadline: 30 ngày")
 *    được gộp vào chunk kế bên kèm nhãn mục, thay vì bị xoá như bản cũ
 *    (`filter(p => p.trim().length > 50)`).
 *  - Mỗi chunk được gắn nhãn `[Mục: …]` để AI trả lời đúng ngữ cảnh.
 *  - Có phần chồng lấn (overlap) ở ranh giới chunk để không mất ý.
 */
export function chunkDocument(
  documentId: string,
  content: string,
  options: { sourceType?: string } = {},
): ChunkRow[] {
  // Chỉ chạy htmlToPlainText khi nội dung THẬT SỰ còn thẻ HTML.
  // (Tài liệu nguồn URL đã được chuyển thành text ở route upload rồi — chạy lại
  //  lần nữa có thể nuốt mất các ký tự "<" ">" trong câu như "Giá < 100 USD".)
  const looksLikeHtml = /<\/?[a-z][a-z0-9]*[^>]*>/i.test(content)

  const prepared =
    options.sourceType === "url" && looksLikeHtml
      ? htmlToPlainText(content)
      : cleanMarkdownForKnowledge(content)

  if (!prepared.trim()) return []

  const blocks = splitIntoBlocks(prepared)
  if (blocks.length === 0) return []

  /* --- Bước 1: gom block thành các chunk thô (chưa lọc) --- */
  interface RawChunk {
    heading: string
    text: string
  }

  const raw: RawChunk[] = []
  let buffer = ""
  let bufferHeading = blocks[0]?.heading || ""

  const flush = () => {
    const text = buffer.trim()
    if (text) raw.push({ heading: bufferHeading || "", text })
    buffer = ""
  }

  for (const block of blocks) {
    const piece = block.text.trim()
    if (!piece) continue

    // Đổi mục -> chốt chunk hiện tại để không trộn nội dung 2 mục vào 1 chunk
    if (block.heading && block.heading !== bufferHeading && buffer.trim()) {
      flush()
    }
    if (block.heading) bufferHeading = block.heading

    if (buffer.length + piece.length + 2 > MAX_CHUNK_CHARS && buffer.trim()) {
      const tail = buffer.slice(-CHUNK_OVERLAP_CHARS)
      flush()
      buffer = tail ? `${tail}\n${piece}` : piece
    } else {
      buffer = buffer ? `${buffer}\n\n${piece}` : piece
    }
  }
  flush()

  /* --- Bước 2: gộp chunk quá ngắn vào chunk kế bên (KHÔNG xoá) --- */
  const withContext = (chunk: RawChunk) =>
    chunk.heading ? `[Mục: ${chunk.heading}]\n${chunk.text}` : chunk.text

  /** Gộp nhãn 2 mục khi phải nối chúng vào cùng 1 chunk (để AI vẫn biết có 2 mục). */
  const combineHeadings = (a: string, b: string) => {
    if (!a) return b
    if (!b || a === b) return a
    const combined = `${a} + ${b}`
    return combined.length <= 120 ? combined : b
  }

  const merged: RawChunk[] = raw.map((chunk) => ({ ...chunk }))
  const removed = new Set<number>()

  // 2a. Mục ngắn -> gộp vào chunk PHÍA SAU (giữ nhãn mục của nó trong nội dung)
  for (let i = 0; i < merged.length - 1; i++) {
    const cur = merged[i]
    if (cur.text.length >= MIN_CHUNK_CHARS) continue
    const next = merged[i + 1]
    const combined = withContext(cur).length + next.text.length + 2
    if (combined > MAX_CHUNK_CHARS) continue

    merged[i + 1] = {
      heading: combineHeadings(cur.heading, next.heading),
      text: `${withContext(cur)}\n\n${next.text}`,
    }
    removed.add(i)
  }

  // 2b. Còn ngắn -> gộp vào chunk PHÍA TRƯỚC
  for (let i = 0; i < merged.length; i++) {
    if (removed.has(i) || merged[i].text.length >= MIN_CHUNK_CHARS) continue
    const prevIndex = [...Array(i).keys()].reverse().find((j) => !removed.has(j))
    if (prevIndex === undefined) continue
    const prev = merged[prevIndex]
    const cur = merged[i]
    const combined = withContext(prev).length + withContext(cur).length + 2
    if (combined > MAX_CHUNK_CHARS) continue

    merged[prevIndex] = {
      heading: combineHeadings(prev.heading, cur.heading),
      text: `${prev.text}\n\n${withContext(cur)}`,
    }
    removed.add(i)
  }

  /* --- Bước 3: tạo ChunkRow (gắn nhãn mục + đếm token) --- */
  const kept = merged.filter((_, i) => !removed.has(i))
  const finalChunks = kept.length > 0 ? kept : []

  const chunks: ChunkRow[] = finalChunks.map((chunk, index) => {
    const text = withContext(chunk)
    return {
      document_id: documentId,
      chunk_index: index,
      token_count: Math.ceil(text.length / 4),
      metadata: {
        heading: chunk.heading || null,
        char_count: text.length,
        ...(text.length < MIN_CHUNK_CHARS ? { short_document: true } : {}),
      },
      text,
    }
  })

  // Fallback: tài liệu quá ngắn so với MIN_CHUNK_CHARS nhưng vẫn có nội dung
  if (chunks.length === 0 && prepared.trim().length > 0) {
    const text = prepared.trim()
    chunks.push({
      document_id: documentId,
      chunk_index: 0,
      token_count: Math.ceil(text.length / 4),
      metadata: { heading: null, char_count: text.length, short_document: true },
      text,
    })
  }

  return chunks
}

/* ------------------------------------------------------------------ */
/* 3. GHI XUỐNG DB (tự dò tên cột)                                     */
/* ------------------------------------------------------------------ */

let cachedTextColumn: ChunkTextColumn | null = null
let cachedHasTokenCount: boolean | null = null
let cachedHasEmbedding: boolean | null = null
let cachedHasEmbeddingModel: boolean | null = null

/**
 * Dò tên cột thật của `knowledge_chunks`.
 *
 * Lịch sử: script 008 tạo cột `chunk_text`, script 012 đổi tên thành `content`.
 * Tuỳ việc bạn đã chạy script nào mà code cũ hoạt động hay không — nên ở đây
 * tự dò một lần rồi ghi nhớ, tránh phụ thuộc vào việc migration đã chạy chưa.
 */
export async function detectChunkSchema(
  supabase: any,
): Promise<{
  textColumn: ChunkTextColumn
  hasTokenCount: boolean
  /** Cột `embedding vector(1536)` đã tồn tại chưa (script 038). */
  hasEmbedding: boolean
  hasEmbeddingModel: boolean
}> {
  if (cachedTextColumn !== null && cachedHasTokenCount !== null && cachedHasEmbedding !== null) {
    return {
      textColumn: cachedTextColumn,
      hasTokenCount: cachedHasTokenCount,
      hasEmbedding: cachedHasEmbedding,
      hasEmbeddingModel: cachedHasEmbeddingModel === true,
    }
  }

  const { error: contentError } = await supabase.from("knowledge_chunks").select("content").limit(1)
  if (!contentError) {
    const { error: tokenError } = await supabase.from("knowledge_chunks").select("token_count").limit(1)
    cachedTextColumn = "content"
    cachedHasTokenCount = !tokenError
  } else {
    cachedTextColumn = "chunk_text"
    cachedHasTokenCount = false
    console.warn(
      "[knowledge] Đang dùng cột `chunk_text` (schema cũ). Nên chạy scripts/037_standardize_knowledge_chunks.sql để chuẩn hoá về `content`.",
    )
  }

  // Cột embedding do script 038 tạo — chưa chạy thì bỏ qua phần ngữ nghĩa
  const { error: embeddingError } = await supabase.from("knowledge_chunks").select("embedding").limit(1)
  cachedHasEmbedding = !embeddingError
  if (cachedHasEmbedding) {
    const { error: modelError } = await supabase.from("knowledge_chunks").select("embedding_model").limit(1)
    cachedHasEmbeddingModel = !modelError
  } else {
    cachedHasEmbeddingModel = false
    console.warn(
      "[knowledge] Chưa có cột `embedding`. Chạy scripts/038_add_knowledge_embeddings.sql để bật tìm kiếm theo ngữ nghĩa.",
    )
  }

  console.log(
    `[knowledge] Schema: cột nội dung=${cachedTextColumn}, token_count=${cachedHasTokenCount}, embedding=${cachedHasEmbedding}`,
  )

  return {
    textColumn: cachedTextColumn,
    hasTokenCount: cachedHasTokenCount,
    hasEmbedding: cachedHasEmbedding,
    hasEmbeddingModel: cachedHasEmbeddingModel === true,
  }
}

/**
 * Ghi chunk xuống DB với đúng tên cột, trả về lỗi (nếu có) thay vì nuốt im lặng.
 *
 * Đồng thời tạo EMBEDDING (vector ngữ nghĩa) nếu đã chạy script 038 và đã cấu
 * hình GEMINI_API_KEY / OPENAI_API_KEY. Việc tạo embedding là best-effort:
 * thất bại thì chunk vẫn được lưu để tìm theo từ khoá, và admin có thể bấm
 * "Nạp embedding cho AI" sau.
 *
 * Ghi theo lô nhỏ (kèm vector thì 8 dòng/lô) để tránh payload quá lớn làm
 * request thất bại giữa chừng trên serverless.
 */
export async function insertChunks(
  supabase: any,
  rows: ChunkRow[],
): Promise<{ inserted: number; embedded: number; error: string | null; embeddingError: string | null }> {
  if (rows.length === 0) return { inserted: 0, embedded: 0, error: null, embeddingError: null }

  const { textColumn, hasTokenCount, hasEmbedding, hasEmbeddingModel } = await detectChunkSchema(supabase)

  const baseRecord = (row: ChunkRow) => {
    const record: Record<string, unknown> = {
      document_id: row.document_id,
      chunk_index: row.chunk_index,
      metadata: row.metadata,
      [textColumn]: row.text,
    }
    if (hasTokenCount) record.token_count = row.token_count
    return record
  }

  // ── Trường hợp 1: chưa có cột embedding -> ghi thẳng theo lô 20 ──
  if (!hasEmbedding) {
    let inserted = 0
    for (let i = 0; i < rows.length; i += 20) {
      const batch = rows.slice(i, i + 20).map(baseRecord)
      const { error } = await supabase.from("knowledge_chunks").insert(batch)
      if (error) return { inserted, embedded: 0, error: error.message, embeddingError: null }
      inserted += batch.length
    }
    return { inserted, embedded: 0, error: null, embeddingError: null }
  }

  // ── Trường hợp 2: có cột embedding -> tạo vector rồi ghi kèm ──
  const config = getEmbeddingConfig()
  let vectors: number[][] | null = null
  let embeddingError: string | null = null

  if (config.provider !== "none") {
    const result = await embedTexts(rows.map((row) => row.text), { taskType: "document" })
    vectors = result.embeddings
    embeddingError = result.error
    if (embeddingError) console.error("[knowledge] Không tạo được embedding:", embeddingError)
  }

  if (!vectors) {
    // Không tạo được vector: vẫn phải lưu tài liệu để không mất nội dung
    let inserted = 0
    for (let i = 0; i < rows.length; i += 20) {
      const batch = rows.slice(i, i + 20).map(baseRecord)
      const { error } = await supabase.from("knowledge_chunks").insert(batch)
      if (error) return { inserted, embedded: 0, error: error.message, embeddingError }
      inserted += batch.length
    }
    return { inserted, embedded: 0, error: null, embeddingError }
  }

  // Tài liệu quá lớn: ghi trước để không vượt giới hạn thời gian của serverless,
  // vector sẽ được nạp sau bằng nút "Nạp embedding cho AI".
  if (rows.length > 120) {
    let inserted = 0
    for (let i = 0; i < rows.length; i += 20) {
      const batch = rows.slice(i, i + 20).map(baseRecord)
      const { error } = await supabase.from("knowledge_chunks").insert(batch)
      if (error) return { inserted, embedded: 0, error: error.message, embeddingError }
      inserted += batch.length
    }
    return {
      inserted,
      embedded: 0,
      error: null,
      embeddingError: `Tài liệu lớn (${inserted} đoạn) — hãy bấm "Nạp embedding cho AI" để tạo vector ngữ nghĩa.`,
    }
  }

  const model = `${config.provider}:${config.model}`
  let inserted = 0
  for (let i = 0; i < rows.length; i += 8) {
    const batch = rows.slice(i, i + 8).map((row, offset) => {
      const record = baseRecord(row)
      const vector = vectors?.[i + offset]
      if (vector) {
        record.embedding = toVectorLiteral(vector)
        if (hasEmbeddingModel) record.embedding_model = model
      }
      return record
    })
    const { error } = await supabase.from("knowledge_chunks").insert(batch)
    if (error) return { inserted, embedded: inserted, error: error.message, embeddingError }
    inserted += batch.length
  }

  console.log(`[knowledge] Đã ghi ${inserted} chunk kèm embedding (${model})`)
  return { inserted, embedded: inserted, error: null, embeddingError }
}

/**
 * Nạp embedding cho các đoạn đã có trong CSDL nhưng chưa có vector.
 * Dùng cho nút "Nạp embedding cho AI" trong trang quản trị (chạy theo lô để
 * không vượt giới hạn thời gian của serverless).
 */
export async function embedMissingChunks(
  supabase: any,
  options: { limit?: number } = {},
): Promise<{ embedded: number; remaining: number; error: string | null; model: string | null }> {
  const limit = Math.min(Math.max(options.limit ?? 100, 1), 300)

  const { hasEmbedding, hasEmbeddingModel, textColumn } = await detectChunkSchema(supabase)
  if (!hasEmbedding) {
    return {
      embedded: 0,
      remaining: 0,
      error: "Chưa có cột embedding trong CSDL — hãy chạy scripts/038_add_knowledge_embeddings.sql trước.",
      model: null,
    }
  }

  const config = getEmbeddingConfig()
  if (config.provider === "none") {
    return {
      embedded: 0,
      remaining: 0,
      error: "Chưa cấu hình GEMINI_API_KEY hoặc OPENAI_API_KEY trong Vercel.",
      model: null,
    }
  }

  const { data: rows, error: selectError } = await supabase
    .from("knowledge_chunks")
    .select(`id, ${textColumn}, chunk_index, document_id`)
    .is("embedding", null)
    .order("chunk_index", { ascending: true })
    .limit(limit)

  if (selectError) return { embedded: 0, remaining: 0, error: selectError.message, model: null }
  if (!rows || rows.length === 0) return { embedded: 0, remaining: 0, error: null, model: null }

  const texts = rows.map((row: any) => String(row[textColumn] ?? ""))
  const { embeddings, error: embedError } = await embedTexts(texts, { taskType: "document" })

  if (embedError || !embeddings) {
    return { embedded: 0, remaining: rows.length, error: embedError || "Không tạo được embedding", model: null }
  }

  const model = `${config.provider}:${config.model}`
  let embedded = 0

  // Cập nhật song song 6 dòng một lượt cho nhanh mà không quá tải PostgREST
  for (let i = 0; i < rows.length; i += 6) {
    const slice = rows.slice(i, i + 6)
    const results = await Promise.all(
      slice.map((row: any, offset: number) => {
        const vector = embeddings[i + offset]
        if (!vector) return Promise.resolve({ error: null })
        const update: Record<string, unknown> = {
          embedding: toVectorLiteral(vector),
          embedded_at: new Date().toISOString(),
        }
        if (hasEmbeddingModel) update.embedding_model = model
        return supabase.from("knowledge_chunks").update(update).eq("id", row.id)
      }),
    )

    const failure = results.find((result: any) => result?.error)
    if (failure) {
      return {
        embedded,
        remaining: rows.length - embedded,
        error: String(failure.error?.message || failure.error),
        model,
      }
    }
    embedded += slice.length
  }

  // Đếm lại xem còn bao nhiêu đoạn chưa có vector
  const { count } = await supabase
    .from("knowledge_chunks")
    .select("id", { count: "exact", head: true })
    .is("embedding", null)

  return { embedded, remaining: count ?? 0, error: null, model }
}

/** Cắt ngắn nội dung để hiển thị xem trước (không cắt giữa từ nếu có thể). */
export function extractPreview(text: string, max = 240): string {
  const clean = String(text ?? "").replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const lastSpace = cut.lastIndexOf(" ")
  return `${lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut}…`
}
