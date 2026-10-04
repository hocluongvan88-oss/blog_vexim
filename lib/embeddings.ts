/**
 * Embedding thật cho kho tri thức (RAG theo ngữ nghĩa).
 *
 * ── VÌ SAO CẦN FILE NÀY ──────────────────────────────────────────────
 * Trước đây `createEmbedding` trong lib/ai-service.ts chỉ là hàm giả
 * (`return Array(1536).fill(0)`) và KHÔNG BAO GIỜ được gọi → AI chỉ tìm
 * tài liệu bằng cách so khớp từ khoá. Cách đó bỏ sót rất nhiều câu hỏi
 * của khách: hỏi "thủ tục xuất hàng sang Mỹ" sẽ không khớp tài liệu có
 * chữ "Prior Notice", "FSMA"… Dù cùng một ý.
 *
 * ── NHÀ CUNG CẤP ────────────────────────────────────────────────────
 * Groq KHÔNG có API embedding, nên phải dùng nhà cung cấp khác:
 *   • gemini  — Google AI Studio, `gemini-embedding-001`, có bậc MIỄN PHÍ
 *               (100 request/phút, 1.000 request/ngày) → đủ cho kho tri
 *               thức của Vexim và tốn 0 đồng.
 *   • openai  — `text-embedding-3-small`, ~0,02 USD/1 triệu token.
 *
 * Cả hai đều xuất vector 1536 chiều (Gemini qua `outputDimensionality`)
 * nên dùng chung một cột `vector(1536)` trong CSDL.
 *
 * ── CÁCH BẬT ────────────────────────────────────────────────────────
 * Thêm 1 trong 2 biến môi trường vào Vercel → Settings → Environment Variables:
 *   GEMINI_API_KEY=...        (khuyến nghị — miễn phí)
 *   OPENAI_API_KEY=sk-...     (nếu muốn dùng OpenAI)
 * Không có key thì hệ thống TỰ ĐỘNG quay về tìm theo từ khoá như trước,
 * không làm hỏng chatbot.
 *
 * Có thể ghi đè: EMBEDDING_PROVIDER=gemini|openai, EMBEDDING_MODEL=...,
 * EMBEDDING_DIMENSIONS=1536 (phải khớp cột vector trong CSDL).
 */

export type EmbeddingProvider = "gemini" | "openai" | "none"

export interface EmbeddingConfig {
  provider: EmbeddingProvider
  model: string
  dimensions: number
  apiKey: string
  /** Số văn bản gửi trong 1 request (Gemini giới hạn 100). */
  batchSize: number
  /** Cắt bớt văn bản quá dài (Gemini: tối đa 2048 token đầu vào). */
  maxChars: number
}

const DEFAULT_DIMENSIONS = 1536

/** Đọc cấu hình embedding từ biến môi trường (đọc lúc gọi để test đổi được env). */
export function getEmbeddingConfig(): EmbeddingConfig {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ""
  const openaiKey = process.env.OPENAI_API_KEY || ""

  const requested = (process.env.EMBEDDING_PROVIDER || "").toLowerCase()
  const dimensions = Number(process.env.EMBEDDING_DIMENSIONS || DEFAULT_DIMENSIONS) || DEFAULT_DIMENSIONS

  let provider: EmbeddingProvider = "none"
  if (requested === "gemini" && geminiKey) provider = "gemini"
  else if (requested === "openai" && openaiKey) provider = "openai"
  else if (!requested) provider = geminiKey ? "gemini" : openaiKey ? "openai" : "none"

  const model =
    process.env.EMBEDDING_MODEL ||
    (provider === "gemini" ? "gemini-embedding-001" : provider === "openai" ? "text-embedding-3-small" : "")

  return {
    provider,
    model,
    dimensions,
    apiKey: provider === "gemini" ? geminiKey : provider === "openai" ? openaiKey : "",
    batchSize: provider === "gemini" ? 50 : 100,
    maxChars: provider === "gemini" ? 4000 : 8000,
  }
}

/** Có bật được embedding thật không? */
export function isEmbeddingEnabled(): boolean {
  return getEmbeddingConfig().provider !== "none"
}

/** Chuẩn hoá vector về độ dài 1 (an toàn cho cả cosine lẫn inner product). */
function normalizeVector(vector: number[]): number[] {
  let sum = 0
  for (const value of vector) sum += value * value
  const norm = Math.sqrt(sum)
  if (!norm || !Number.isFinite(norm)) return vector
  return vector.map((value) => value / norm)
}

/**
 * Đổi vector thành chuỗi theo cú pháp pgvector: `[0.1,0.2,...]`.
 * Làm tròn 6 chữ số để payload gửi lên Supabase nhỏ hơn ~40%.
 */
export function toVectorLiteral(vector: number[]): string {
  return `[${vector.map((value) => Number(value.toFixed(6))).join(",")}]`
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Gọi API embedding — nhà cung cấp nào cũng trả về `number[][]` cùng thứ tự đầu vào.
 * Tự thử lại khi bị 429 (quá giới hạn) hoặc lỗi 5xx.
 */
async function callProvider(
  texts: string[],
  config: EmbeddingConfig,
  taskType: "document" | "query",
): Promise<{ embeddings: number[][] | null; error: string | null }> {
  const prepared = texts.map((text) =>
    text.length > config.maxChars ? text.slice(0, config.maxChars) : text,
  )

  const maxAttempts = 3
  let lastError = ""

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (config.provider === "gemini") {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:batchEmbedContents`
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": config.apiKey,
          },
          body: JSON.stringify({
            requests: prepared.map((text) => ({
              model: `models/${config.model}`,
              content: { parts: [{ text }] },
              // Tài liệu và câu hỏi phải dùng đúng loại nhiệm vụ thì độ tương đồng mới chuẩn
              taskType: taskType === "query" ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT",
              outputDimensionality: config.dimensions,
            })),
          }),
        })

        if (!response.ok) {
          const detail = await response.text()
          lastError = `Gemini ${response.status}: ${detail.slice(0, 300)}`
          // 429 = quá giới hạn, 5xx = lỗi tạm thời -> thử lại
          if (response.status === 429 || response.status >= 500) {
            await sleep(attempt * attempt * 1500)
            continue
          }
          return { embeddings: null, error: lastError }
        }

        const json: any = await response.json()
        const embeddings = (json.embeddings || []).map((item: any) => item?.values || [])
        if (embeddings.length !== prepared.length || embeddings.some((v: number[]) => !v?.length)) {
          return { embeddings: null, error: "Gemini trả về số vector không khớp với số văn bản" }
        }
        return { embeddings: embeddings.map(normalizeVector), error: null }
      }

      if (config.provider === "openai") {
        const response = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model,
            input: prepared,
            dimensions: config.dimensions,
          }),
        })

        if (!response.ok) {
          const detail = await response.text()
          lastError = `OpenAI ${response.status}: ${detail.slice(0, 300)}`
          if (response.status === 429 || response.status >= 500) {
            await sleep(attempt * attempt * 1500)
            continue
          }
          return { embeddings: null, error: lastError }
        }

        const json: any = await response.json()
        const items: any[] = json.data || []
        if (items.length !== prepared.length) {
          return { embeddings: null, error: "OpenAI trả về số vector không khớp với số văn bản" }
        }
        // API không đảm bảo thứ tự, phải sắp lại theo `index`
        const ordered = [...items].sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
        return { embeddings: ordered.map((item) => normalizeVector(item.embedding || [])), error: null }
      }

      return { embeddings: null, error: "Chưa cấu hình nhà cung cấp embedding" }
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Lỗi gọi API embedding"
      await sleep(attempt * attempt * 1000)
    }
  }

  return { embeddings: null, error: lastError || "Không tạo được embedding" }
}

export interface EmbedResult {
  embeddings: number[][] | null
  error: string | null
  provider: EmbeddingProvider
  model: string
  /** Số văn bản đã tạo được vector. */
  count: number
}

/**
 * Tạo embedding cho nhiều văn bản (tự chia lô theo giới hạn nhà cung cấp).
 * Không bao giờ ném lỗi — caller chỉ cần kiểm tra `error`.
 */
export async function embedTexts(
  texts: string[],
  options: { taskType?: "document" | "query" } = {},
): Promise<EmbedResult> {
  const config = getEmbeddingConfig()
  const empty: EmbedResult = {
    embeddings: null,
    error: null,
    provider: config.provider,
    model: config.model,
    count: 0,
  }

  if (config.provider === "none" || !config.apiKey) {
    return { ...empty, error: "Chưa cấu hình GEMINI_API_KEY hoặc OPENAI_API_KEY" }
  }
  if (texts.length === 0) return empty

  const taskType = options.taskType || "document"
  const all: number[][] = []

  for (let i = 0; i < texts.length; i += config.batchSize) {
    const batch = texts.slice(i, i + config.batchSize)
    const { embeddings, error } = await callProvider(batch, config, taskType)
    if (error || !embeddings) {
      return {
        embeddings: all.length > 0 ? all : null,
        error,
        provider: config.provider,
        model: config.model,
        count: all.length,
      }
    }
    all.push(...embeddings)
  }

  return { embeddings: all, error: null, provider: config.provider, model: config.model, count: all.length }
}

/** Tạo embedding cho 1 câu hỏi của khách (dùng taskType RETRIEVAL_QUERY). */
export async function embedQuery(query: string): Promise<number[] | null> {
  const result = await embedTexts([query], { taskType: "query" })
  return result.embeddings?.[0] || null
}

/** Mô tả ngắn để hiển thị trong trang admin. */
export function describeEmbeddingConfig(): {
  enabled: boolean
  provider: EmbeddingProvider
  model: string
  dimensions: number
  hint: string
} {
  const config = getEmbeddingConfig()
  const enabled = config.provider !== "none"
  return {
    enabled,
    provider: config.provider,
    model: config.model,
    dimensions: config.dimensions,
    hint: enabled
      ? `Đang dùng ${config.provider === "gemini" ? "Google Gemini" : "OpenAI"} · ${config.model} · ${config.dimensions} chiều`
      : "Chưa bật tìm kiếm theo ngữ nghĩa — thêm GEMINI_API_KEY (miễn phí) hoặc OPENAI_API_KEY vào Vercel rồi deploy lại.",
  }
}
