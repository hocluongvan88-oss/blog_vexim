/**
 * Danh sách model Groq dùng cho toàn hệ thống (chatbot, trợ lý viết bài, FDA AI).
 *
 * Vì sao tách riêng file này: trang Admin → Cài đặt là client component, nếu
 * import từ `lib/ai-service.ts` sẽ kéo cả SDK Groq vào bundle trình duyệt. File
 * này chỉ có hằng số + hàm thuần, không phụ thuộc gì.
 *
 * BỐI CẢNH: Groq đã NGỪNG phục vụ `llama-3.3-70b-versatile` từ 16/08/2026
 * (thông báo 17/06/2026). Sau ngày đó mọi request tới model này trả về
 * 404 `model_not_found` — chatbot vẫn "chạy" nhưng không bao giờ có câu trả lời.
 * Model thay thế do Groq khuyến nghị: openai/gpt-oss-120b và openai/gpt-oss-20b.
 */

/** Model mặc định cho mọi câu trả lời AI. */
export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b"

/** Các model thử lần lượt khi model đang cấu hình không còn khả dụng. */
export const FALLBACK_GROQ_MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"]

/** Model Groq đã ngừng phục vụ — bỏ qua để khỏi tốn một lượt gọi 404. */
export const RETIRED_GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "llama3-70b-8192",
  "llama3-8b-8192",
  "mixtral-8x7b-32768",
  "qwen/qwen3-32b",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "moonshotai/kimi-k2-instruct-0905",
]

/** Model cho admin chọn ở trang Cài đặt. */
export const AVAILABLE_GROQ_MODELS: Array<{ id: string; label: string }> = [
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B (Groq khuyên dùng)" },
  { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B (nhanh hơn, rẻ hơn)" },
  { id: "qwen/qwen3.6-27b", label: "Qwen 3.6 27B (bản xem trước của Groq)" },
]

export function isRetiredModel(model?: string): boolean {
  if (!model) return false
  const normalized = model.trim().toLowerCase()
  return RETIRED_GROQ_MODELS.some((retired) => retired === normalized)
}

/**
 * Danh sách model sẽ thử, theo thứ tự: model đang cấu hình → các model dự phòng.
 * Model đã bị khai tử bị loại ngay từ đầu.
 */
export function resolveModelChain(
  configured?: string,
  fallbacks: string[] = FALLBACK_GROQ_MODELS,
): string[] {
  const chain: string[] = []
  for (const candidate of [configured, ...fallbacks, DEFAULT_GROQ_MODEL]) {
    const model = (candidate || "").trim()
    if (!model || chain.includes(model) || isRetiredModel(model)) continue
    chain.push(model)
  }
  return chain.length > 0 ? chain : [DEFAULT_GROQ_MODEL]
}

/** Lỗi "model không tồn tại / không có quyền dùng" của Groq (404 model_not_found). */
export function isModelUnavailableError(error: any): boolean {
  const status = error?.status ?? error?.response?.status ?? error?.error?.status
  if (status === 404) return true
  const text = `${error?.message || ""} ${error?.error?.code || ""} ${error?.error?.message || ""}`.toLowerCase()
  return /model_not_found|does not exist|do not have access|not have access|decommission/.test(text)
}

/** Client Groq tối thiểu — cho phép truyền client thật hoặc client giả trong test. */
export type GroqLike = {
  chat: { completions: { create: (args: any) => Promise<any> } }
}

/**
 * Gọi Groq và TỰ CHUYỂN sang model dự phòng khi model hiện tại bị khai tử.
 * Chỉ chuyển model với lỗi "model không tồn tại"; các lỗi khác (400 sai request,
 * 401 sai key, 429 quá hạn mức) vẫn ném ra ngoài để không giấu lỗi thật.
 */
export async function callGroqWithFallback(
  client: GroqLike,
  options: { model?: string; messages: any[]; temperature: number; maxTokens: number; fallbacks?: string[] },
): Promise<{ completion: any; model: string }> {
  const chain = resolveModelChain(options.model, options.fallbacks)
  let lastError: any = null

  for (const model of chain) {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages: options.messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      })
      return { completion, model }
    } catch (error: any) {
      lastError = error
      if (!isModelUnavailableError(error)) throw error
      console.error(
        `[v0] Model "${model}" không còn được Groq phục vụ — thử model dự phòng tiếp theo`,
      )
    }
  }

  throw lastError ?? new Error("Không có model AI nào khả dụng")
}
