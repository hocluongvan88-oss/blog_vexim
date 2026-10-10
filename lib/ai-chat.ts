/**
 * Lớp gọi model AI để SINH CÂU TRẢ LỜI (chat), hỗ trợ 2 nhà cung cấp:
 *
 *   - Groq   (GROQ_API_KEY)    — nhanh, free ~1.000 request/ngày
 *   - Gemini (GEMINI_API_KEY)  — free ~1.500 request/ngày, CŨNG CHÍNH LÀ KEY
 *                                 đang dùng cho embedding (tìm tài liệu theo ngữ nghĩa)
 *
 * Vì sao cần cả hai: ngày 16/08/2026 Groq khai tử model Llama 3.3 70B khiến
 * chatbot im lặng; nếu chỉ phụ thuộc một nhà cung cấp thì mỗi lần họ đổi chính
 * sách là bot chết. Nay chỉ cần MỘT trong hai key là bot chạy; có cả hai thì
 * tự chuyển sang cái còn lại khi cái kia lỗi (hết hạn mức / model bị khai tử).
 *
 * Ghi đè bằng biến môi trường khi cần:
 *   CHAT_PROVIDER=groq|gemini     (ưu tiên nhà cung cấp nào trước)
 *   GROQ_MODEL=openai/gpt-oss-120b
 *   GEMINI_MODEL=gemini-3.8-flash
 */
import Groq from "groq-sdk"
import {
  DEFAULT_GROQ_MODEL,
  FALLBACK_GROQ_MODELS,
  callGroqWithFallback,
  type GroqLike,
} from "@/lib/ai-models"

export type ChatProvider = "groq" | "gemini"

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

/**
 * Model Gemini mặc định. Gemini 2.5 chỉ mở cho tài khoản đã dùng trước đó, nên
 * dùng dòng Gemini 3 (Google khuyến nghị cho dự án mới). Có thể đổi bằng GEMINI_MODEL.
 */
export const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash"

/** Các model Gemini thử lần lượt khi model chính không dùng được. */
export const FALLBACK_GEMINI_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash-lite"]

/**
 * Thời gian tối đa cho MỘT nhà cung cấp trả lời (ms). Quá thời gian này bot
 * chuyển sang nhà cung cấp dự phòng thay vì để khách chờ hàng phút (từng gặp:
 * Gemini mất ~96 giây cho lời chào). Đổi bằng AI_REQUEST_TIMEOUT_MS.
 */
export const DEFAULT_AI_REQUEST_TIMEOUT_MS = 15000

export function getAiRequestTimeoutMs(): number {
  const raw = Number(process.env.AI_REQUEST_TIMEOUT_MS)
  return Number.isFinite(raw) && raw >= 1000 ? raw : DEFAULT_AI_REQUEST_TIMEOUT_MS
}

/** Lỗi timeout: mã 408 + cờ `timeout` để các lớp trên biết là quá thời gian. */
export function createAiTimeoutError(provider: string, ms: number): Error {
  return Object.assign(
    new Error(`${provider} không phản hồi sau ${Math.round(ms / 1000)} giây (timeout)`),
    { status: 408, timeout: true },
  )
}

/**
 * Chạy `run` với giới hạn thời gian. Khi hết giờ: huỷ request (AbortSignal) và
 * ném lỗi timeout. Dùng Promise.race nên vẫn chặn được cả client không tôn trọng signal.
 */
export async function withAiTimeout<T>(
  provider: string,
  run: (signal: AbortSignal) => Promise<T>,
  ms: number = getAiRequestTimeoutMs(),
): Promise<T> {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort()
      reject(createAiTimeoutError(provider, ms))
    }, ms)
  })
  try {
    return await Promise.race([run(controller.signal), timeout])
  } finally {
    clearTimeout(timer)
  }
}

/** Thông báo khi chưa cấu hình key nào — dùng cho cả log lẫn câu trả lời khách. */
export const NO_CHAT_PROVIDER_MESSAGE =
  "Chưa cấu hình khoá AI nào. Thêm GROQ_API_KEY hoặc GEMINI_API_KEY vào biến môi trường rồi deploy lại."

export interface ChatMessage {
  role: string
  content: string
}

export interface ChatResult {
  text: string
  provider: ChatProvider
  model: string
}

/* ------------------------------------------------------------------ */
/* Nhận diện nhà cung cấp                                              */
/* ------------------------------------------------------------------ */

/** Đọc key lúc GỌI (không cache) để test đổi biến môi trường được. */
export function getGroqApiKey(): string {
  return process.env.GROQ_API_KEY || ""
}

export function getGeminiApiKey(): string {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ""
}

/** Đoán nhà cung cấp từ tên model đang cấu hình trong CSDL. */
export function providerForModel(model?: string): ChatProvider | null {
  const normalized = (model || "").trim().toLowerCase()
  if (!normalized) return null
  if (normalized.startsWith("gemini")) return "gemini"
  // Mọi model Groq đều có dạng "openai/...", "qwen/...", "llama-..." …
  return "groq"
}

/**
 * Danh sách nhà cung cấp sẽ thử, theo thứ tự ưu tiên:
 * model đang cấu hình → CHAT_PROVIDER → Groq → Gemini.
 * Chỉ trả về nhà cung cấp THẬT SỰ có key.
 */
export function getChatProviders(preferredModel?: string): ChatProvider[] {
  const available: ChatProvider[] = []
  if (getGroqApiKey()) available.push("groq")
  if (getGeminiApiKey()) available.push("gemini")

  const requested = (process.env.CHAT_PROVIDER || "").trim().toLowerCase()
  const first =
    providerForModel(preferredModel) ||
    (requested === "groq" || requested === "gemini" ? (requested as ChatProvider) : null)

  if (!first || !available.includes(first)) return available
  return [first, ...available.filter((provider) => provider !== first)]
}

/** Mô tả ngắn để hiện trong log / trang quản trị. */
export function describeChatConfig(): {
  providers: ChatProvider[]
  groqModel: string
  geminiModel: string
  hint: string
} {
  const providers = getChatProviders()
  const groqModel = process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL
  const geminiModel = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL
  return {
    providers,
    groqModel,
    geminiModel,
    hint:
      providers.length === 0
        ? NO_CHAT_PROVIDER_MESSAGE
        : providers.length === 1
          ? `Đang dùng ${providers[0] === "groq" ? `Groq · ${groqModel}` : `Gemini · ${geminiModel}`} ` +
            "(chỉ 1 nhà cung cấp — nên thêm key còn lại để bot không im lặng khi hết hạn mức)"
          : `Groq · ${groqModel} (chính) → Gemini · ${geminiModel} (dự phòng)`,
  }
}

/* ------------------------------------------------------------------ */
/* Gemini (REST, không cần thêm thư viện)                              */
/* ------------------------------------------------------------------ */

/** Chuỗi model Gemini sẽ thử: model ưu tiên → dự phòng → mặc định. */
export function resolveGeminiChain(
  preferred?: string,
  fallbacks: string[] = FALLBACK_GEMINI_MODELS,
): string[] {
  const chain: string[] = []
  // Thứ tự: model ưu tiên → GEMINI_MODEL (env) → mặc định → các model dự phòng
  for (const candidate of [
    preferred,
    process.env.GEMINI_MODEL,
    DEFAULT_GEMINI_MODEL,
    ...fallbacks,
  ]) {
    const model = (candidate || "").trim()
    if (!model || chain.includes(model)) continue
    // Chỉ nhận model Gemini — tránh gửi id kiểu "openai/gpt-oss-120b" sang Google
    if (providerForModel(model) !== "gemini") continue
    chain.push(model)
  }
  return chain.length > 0 ? chain : [DEFAULT_GEMINI_MODEL]
}

/**
 * Lấy phần chữ trong phản hồi Gemini.
 * Model Gemini 3 có thể trả về "thought" (phần suy luận nội bộ) — phải bỏ đi,
 * chỉ lấy phần trả lời thật.
 */
export function extractGeminiText(payload: any): string {
  const parts = payload?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return ""
  return parts
    .filter((part: any) => typeof part?.text === "string" && part?.thought !== true)
    .map((part: any) => part.text)
    .join("")
}

/** Lý do Gemini không trả về chữ nào (bị chặn, hết token, …) để báo lỗi rõ ràng. */
export function describeGeminiEmptyResponse(payload: any): string {
  const blockReason = payload?.promptFeedback?.blockReason
  if (blockReason) return `Gemini từ chối trả lời (${blockReason})`
  const finishReason = payload?.candidates?.[0]?.finishReason
  if (finishReason) return `Gemini không trả về nội dung (finishReason: ${finishReason})`
  return "Gemini không trả về nội dung"
}

/** Gọi 1 model Gemini bằng REST API. */
export async function callGeminiGenerate(options: {
  apiKey: string
  model: string
  systemPrompt: string
  messages: ChatMessage[]
  temperature: number
  maxTokens: number
  fetchImpl?: typeof fetch
}): Promise<{ text: string; model: string }> {
  const fetchImpl = options.fetchImpl || fetch
  return withAiTimeout("Gemini", async (signal) => {
    const response = await fetchImpl(`${GEMINI_API_BASE}/${options.model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": options.apiKey,
      },
      signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: options.systemPrompt }] },
        contents: options.messages.map((message) => ({
          // Gemini dùng "model" cho lượt của trợ lý
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          temperature: options.temperature,
          // Gemini 3 tốn token cho phần suy luận nội bộ -> để dư để câu trả lời
          // không bị cắt cụt.
          maxOutputTokens: Math.max(options.maxTokens, 2048),
        },
      }),
    })

    const payload: any = await response.json().catch(() => null)

    if (!response.ok) {
      const message = payload?.error?.message || `Gemini trả về lỗi HTTP ${response.status}`
      throw Object.assign(new Error(message), { status: response.status })
    }

    const text = extractGeminiText(payload)
    if (!text.trim()) {
      throw Object.assign(new Error(describeGeminiEmptyResponse(payload)), { status: 502 })
    }
    return { text, model: options.model }
  })
}

/** Model chưa tồn tại/quá hạn mức -> thử model Gemini kế tiếp (hạn mức tính riêng từng model). */
function shouldTryNextGeminiModel(error: any): boolean {
  // Hết giờ: không thử model Gemini khác (sẽ chậm thêm) — chuyển sang Groq luôn.
  if (error?.timeout) return false
  const status = Number(error?.status)
  if (status === 404 || status === 429 || status === 408) return true
  if (status >= 500) return true
  const text = String(error?.message || "").toLowerCase()
  return /not found|not supported|is not available|quota|rate limit|overloaded/.test(text)
}

/** Thử lần lượt các model Gemini cho tới khi có câu trả lời. */
export async function callGeminiWithFallback(options: {
  apiKey: string
  systemPrompt: string
  messages: ChatMessage[]
  temperature: number
  maxTokens: number
  preferredModel?: string
  fetchImpl?: typeof fetch
}): Promise<{ text: string; model: string }> {
  const chain = resolveGeminiChain(options.preferredModel)
  let lastError: any = null

  for (const model of chain) {
    try {
      return await callGeminiGenerate({
        apiKey: options.apiKey,
        model,
        systemPrompt: options.systemPrompt,
        messages: options.messages,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        fetchImpl: options.fetchImpl,
      })
    } catch (error: any) {
      lastError = error
      if (!shouldTryNextGeminiModel(error)) throw error
      console.error(`[v0] Gemini model "${model}" không dùng được — thử model kế tiếp`)
    }
  }

  throw lastError ?? new Error("Không có model Gemini nào khả dụng")
}

/* ------------------------------------------------------------------ */
/* Gọi chung: tự chọn nhà cung cấp, tự chuyển khi lỗi                   */
/* ------------------------------------------------------------------ */

/** Lỗi thuộc dạng "nhà cung cấp không dùng được" -> nên thử nhà cung cấp khác. */
export function isProviderUnavailableError(error: any): boolean {
  const status = Number(error?.status ?? error?.response?.status ?? error?.error?.status)
  // 413: yêu cầu lớn hơn giới hạn TPM của nhà cung cấp (vd. Groq 8.000 token/phút).
  // Thử lại y hệt sẽ lỗi lại -> phải chuyển sang nhà cung cấp khác.
  if ([401, 403, 404, 408, 413, 429].includes(status)) return true
  if (status >= 500) return true
  const text = `${error?.message || ""} ${error?.error?.code || ""} ${error?.error?.message || ""}`.toLowerCase()
  return /api key|api_key|unauthorized|invalid.*key|quota|rate[ _]limit|fetch failed|network|model_not_found|does not exist|decommission|request too large|tokens per minute|^413\b/.test(
    text,
  )
}

/**
 * Sinh câu trả lời bằng nhà cung cấp khả dụng đầu tiên; nếu lỗi kiểu "không dùng
 * được" (hết hạn mức, key sai, model bị khai tử) thì tự chuyển sang nhà cung cấp
 * còn lại. Lỗi thật (400 sai request) vẫn ném ra để không giấu lỗi.
 */
export async function generateChatText(
  options: {
    systemPrompt: string
    message: string
    history?: ChatMessage[]
    temperature?: number
    maxTokens?: number
    /** Model đang cấu hình trong CSDL (quyết định ưu tiên nhà cung cấp). */
    preferredModel?: string
    /** Dùng trong kiểm thử để không gọi mạng. */
    fetchImpl?: typeof fetch
    groqClientFactory?: (apiKey: string) => GroqLike
  },
): Promise<ChatResult> {
  const providers = getChatProviders(options.preferredModel)
  if (providers.length === 0) throw new Error(NO_CHAT_PROVIDER_MESSAGE)

  const temperature = options.temperature ?? 0.7
  const maxTokens = options.maxTokens ?? 1024
  const messages: ChatMessage[] = [
    ...(options.history || []),
    { role: "user", content: options.message },
  ]
  const preferred = (options.preferredModel || "").trim()

  let lastError: any = null

  for (const provider of providers) {
    try {
      if (provider === "groq") {
        const apiKey = getGroqApiKey()
        const client = options.groqClientFactory
          ? options.groqClientFactory(apiKey)
          : (new Groq({ apiKey }) as unknown as GroqLike)
        const groqModel =
          preferred && providerForModel(preferred) === "groq" ? preferred : undefined
        const { completion, model } = await withAiTimeout("Groq", () =>
          callGroqWithFallback(client, {
            model: groqModel,
            messages: [
              { role: "system", content: options.systemPrompt },
              ...messages,
            ],
            temperature,
            maxTokens,
          }),
        )
        const text = completion?.choices?.[0]?.message?.content || ""
        if (!text.trim()) {
          throw Object.assign(new Error("Groq không trả về nội dung"), { status: 502 })
        }
        return { text, provider, model }
      }

      const { text, model } = await callGeminiWithFallback({
        apiKey: getGeminiApiKey(),
        systemPrompt: options.systemPrompt,
        messages,
        temperature,
        maxTokens,
        preferredModel: preferred && providerForModel(preferred) === "gemini" ? preferred : undefined,
        fetchImpl: options.fetchImpl,
      })
      return { text, provider, model }
    } catch (error: any) {
      lastError = error
      if (!isProviderUnavailableError(error)) throw error
      console.error(
        `[v0] Nhà cung cấp "${provider}" không dùng được (${error?.message || error}) — thử nhà cung cấp kế tiếp`,
      )
    }
  }

  throw lastError ?? new Error(NO_CHAT_PROVIDER_MESSAGE)
}

export { DEFAULT_GROQ_MODEL, FALLBACK_GROQ_MODELS }
