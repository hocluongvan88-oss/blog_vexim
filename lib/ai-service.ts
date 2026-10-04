import { isSmallTalk } from "@/lib/rule-engine"
import {
  NO_CHAT_PROVIDER_MESSAGE,
  describeChatConfig,
  generateChatText as callChatModel,
} from "@/lib/ai-chat"
import { embedQuery, embedTexts, getEmbeddingConfig, isEmbeddingEnabled, toVectorLiteral } from "@/lib/embeddings"
import { VEXIM_PHONE_DISPLAY, VEXIM_ZALO_URL } from "@/lib/contact-info"
import {
  DEFAULT_GROQ_MODEL,
  FALLBACK_GROQ_MODELS,
  isRetiredModel,
  resolveModelChain,
} from "@/lib/ai-models"

// Cho phép import các hằng số model từ "@/lib/ai-service" như trước
export * from "@/lib/ai-models"

/** Model dự phòng có thể ghi đè bằng biến môi trường GROQ_FALLBACK_MODELS. */
function envFallbacks(): string[] {
  const raw = process.env.GROQ_FALLBACK_MODELS
  if (!raw) return FALLBACK_GROQ_MODELS
  const list = raw.split(",").map((model) => model.trim()).filter(Boolean)
  return list.length > 0 ? list : FALLBACK_GROQ_MODELS
}

// Nhà cung cấp AI đang dùng (Groq và/hoặc Gemini) — đọc lúc khởi động chỉ để ghi log,
// quyết định thật được đưa ra ở mỗi lần gọi trong lib/ai-chat.ts.
const chatConfig = describeChatConfig()
if (chatConfig.providers.length === 0) {
  console.error(`[v0] ${NO_CHAT_PROVIDER_MESSAGE}`)
} else {
  console.log(`[v0] AI trả lời khách — ${chatConfig.hint}`)
}

export interface AIConfig {
  model: string
  maxTokens: number
  temperature: number
  systemPrompt: string
}

export interface KnowledgeChunk {
  id: string
  chunk_text: string
  document_title: string
  category: string
  /** Điểm tương đồng ngữ nghĩa 0..1 (chỉ có khi khớp bằng vector). */
  similarity?: number
}

export interface AIResponse {
  message: string
  confidence: number
  sources: string[]
  shouldHandover: boolean
  handoverReason?: string
}

/**
 * Tạo embedding cho 1 đoạn text.
 *
 * Trước đây hàm này là GIẢ (`return Array(1536).fill(0)`) và không bao giờ được
 * gọi — nghĩa là toàn bộ "RAG" chỉ là so khớp từ khoá. Nay gọi API thật
 * (Gemini/OpenAI); trả `null` nếu chưa cấu hình key.
 */
export async function createEmbedding(text: string): Promise<number[] | null> {
  const result = await embedTexts([text], { taskType: "document" })
  if (result.error) {
    console.warn("[v0] Không tạo được embedding:", result.error)
    return null
  }
  return result.embeddings?.[0] || null
}

/** Từ dừng tiếng Việt + tiếng Anh — bỏ đi để giữ lại từ mang nghĩa. */
const STOPWORDS = new Set([
  // tiếng Việt
  "la", "là", "cua", "của", "va", "và", "co", "có", "khong", "không", "duoc", "được", "cho", "voi", "với",
  "thi", "thì", "ma", "mà", "nhu", "như", "nay", "này", "do", "đó", "khi", "neu", "nếu", "toi", "tôi",
  "minh", "mình", "anh", "chi", "chị", "em", "ban", "bạn", "can", "cần", "muon", "muốn", "hoi", "hỏi",
  "the", "thế", "nao", "nào", "gi", "gì", "sao", "tai", "tại", "vi", "vì", "nen", "nên", "hay", "hoac", "hoặc",
  "cac", "các", "nhung", "những", "mot", "một", "ra", "vao", "vào", "tu", "từ", "den", "đến", "ve", "về",
  "bay", "giờ", "hien", "hiện", "xin", "chao", "chào", "cam", "cảm", "on", "ơn", "ạ", "a", "dạ", "vâng",
  // tiếng Anh
  "the", "a", "an", "is", "are", "was", "were", "be", "to", "of", "and", "or", "in", "on", "at", "for",
  "with", "how", "what", "when", "where", "why", "do", "does", "did", "can", "could", "should", "would",
  "i", "we", "you", "it", "this", "that", "my", "our", "your", "me", "us", "please", "hi", "hello",
])

/**
 * Bỏ dấu tiếng Việt (giữ nguyên chữ để so khớp hai chiều).
 */
function stripDiacritics(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
}

/**
 * Tách từ khoá có nghĩa từ câu hỏi của khách.
 *
 * Trước đây `searchKnowledge` tìm bằng CẢ CÂU hỏi làm chuỗi con
 * (`ilike %cả câu%`) nên gần như luôn ra 0 kết quả → AI không có tài liệu
 * tham khảo → trả lời chung chung. Giờ ta tách thành từ khoá rồi tìm OR.
 */
export function extractKeywords(text: string, max = 8): string[] {
  const rawTokens = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2)

  const seen = new Set<string>()
  const keywords: string[] = []

  for (const token of rawTokens) {
    const bare = stripDiacritics(token)
    if (STOPWORDS.has(token) || STOPWORDS.has(bare)) continue
    if (/^\d+$/.test(token)) continue
    if (seen.has(bare)) continue
    seen.add(bare)
    keywords.push(token)
  }

  // Ưu tiên từ dài (thường là thuật ngữ chuyên ngành: "registration", "traceability"...)
  return keywords.sort((a, b) => b.length - a.length).slice(0, max)
}

/** Đếm số từ khoá xuất hiện trong một chunk (chuẩn hoá bỏ dấu cả hai phía). */
function scoreChunk(content: string, keywords: string[]): number {
  const normalized = stripDiacritics(content)
  let score = 0
  for (const keyword of keywords) {
    const bare = stripDiacritics(keyword)
    if (bare && normalized.includes(bare)) score += 1
  }
  return score
}

/**
 * Tìm kiếm tài liệu liên quan từ knowledge base.
 *
 * Chiến lược 3 lớp (từ chặt tới lỏng) để luôn có ngữ cảnh cho AI:
 *  1. Tìm OR theo từ khoá có nghĩa, xếp hạng theo SỐ từ khoá khớp.
 *  2. Nếu không có gì, nới lỏng bằng các từ khoá dài nhất.
 *  3. Nếu vẫn không có, trả về chunk mới nhất đúng danh mục liên quan (nếu suy ra được).
 */
/** Nhớ tên cột chunk đã dò được để không phải kiểm tra lại mỗi lần hỏi. */
let chunkTextColumn: string | null = null

/** Tắt hẳn tìm kiếm vector trong tiến trình này nếu hàm RPC chưa tồn tại. */
let vectorSearchDisabled = false

interface RankedChunk {
  chunk: KnowledgeChunk
  score: number
}

/**
 * Tìm theo NGỮ NGHĨA bằng embedding + pgvector.
 *
 * Khách hỏi "thủ tục xuất hàng sang Mỹ cần gì?" trong khi tài liệu chỉ ghi
 * "Prior Notice", "FSMA", "US Agent" — tìm theo từ khoá sẽ trượt, còn vector
 * thì khớp vì hiểu ý. Trả `null` nếu chưa bật/chưa cài đặt, khi đó hệ thống
 * tự quay về tìm theo từ khoá.
 */
async function searchByVector(
  query: string,
  supabase: any,
  limit: number = 12,
): Promise<RankedChunk[] | null> {
  if (vectorSearchDisabled || !isEmbeddingEnabled()) return null

  try {
    const vector = await embedQuery(query)
    if (!vector) return null

    const config = getEmbeddingConfig()
    // Ngưỡng tương đồng khác nhau giữa các nhà cung cấp; có thể ghi đè bằng env.
    const minSimilarity = Number(
      process.env.EMBEDDING_MIN_SIMILARITY ?? (config.provider === "gemini" ? 0.5 : 0.3),
    )

    const { data, error } = await supabase.rpc("match_knowledge_chunks", {
      query_embedding: toVectorLiteral(vector),
      match_count: limit,
      min_similarity: minSimilarity,
    })

    if (error) {
      const message = error.message || ""
      // Chưa chạy script 038 -> không thử lại nữa cho tới khi deploy lại
      if (/could not find the function|does not exist|schema cache/i.test(message)) {
        vectorSearchDisabled = true
        console.warn(
          "[v0] Chưa có hàm match_knowledge_chunks — chạy scripts/038_add_knowledge_embeddings.sql để bật tìm theo ngữ nghĩa.",
        )
      } else {
        console.warn("[v0] Tìm theo ngữ nghĩa thất bại, dùng từ khoá:", message)
      }
      return null
    }

    const rows = (data || []) as any[]
    console.log("[v0] Vector search — đoạn khớp:", rows.length)

    return rows.map((row) => ({
      chunk: {
        id: row.id,
        chunk_text: row.content || "",
        document_title: row.document_title || "Tài liệu",
        category: row.category || "",
        similarity: typeof row.similarity === "number" ? row.similarity : undefined,
      },
      score: typeof row.similarity === "number" ? row.similarity : 0,
    }))
  } catch (error) {
    console.warn("[v0] Lỗi tìm theo ngữ nghĩa:", error)
    return null
  }
}

/**
 * Tìm kiếm tài liệu liên quan từ knowledge base.
 *
 * Chiến lược: KẾT HỢP hai cách tìm, rồi hợp nhất thứ hạng (Reciprocal Rank Fusion):
 *  1. Ngữ nghĩa (embedding + pgvector) — hiểu ý câu hỏi, bắt được cả cách nói khác.
 *  2. Từ khoá (3 lớp, từ chặt tới lỏng) — chính xác với mã/tên riêng như "GACC", "FSMA".
 * Cách 1 chỉ chạy khi đã cấu hình API key + đã chạy script 038; nếu không thì
 * hệ thống vẫn hoạt động như trước (chỉ từ khoá), không làm hỏng chatbot.
 */
export async function searchKnowledge(
  query: string,
  topK: number = 5,
  supabase: any
): Promise<KnowledgeChunk[]> {
  try {
    const keywords = extractKeywords(query)
    console.log("[v0] Knowledge search — từ khoá:", keywords)

    // Dò tên cột chunk thật: script 008 tạo `chunk_text`, script 012 đổi tên thành `content`.
    // Nếu hard-code sai tên, truy vấn luôn lỗi → AI không có tài liệu nào để trả lời.
    if (chunkTextColumn === null) {
      const { error: contentProbe } = await supabase.from("knowledge_chunks").select("content").limit(1)
      if (!contentProbe) {
        chunkTextColumn = "content"
      } else {
        const { error: legacyProbe } = await supabase.from("knowledge_chunks").select("chunk_text").limit(1)
        chunkTextColumn = legacyProbe ? "content" : "chunk_text"
        if (!legacyProbe) {
          console.warn(
            "[v0] knowledge_chunks đang dùng cột `chunk_text` (schema cũ). Nên chạy scripts/037_standardize_knowledge_chunks.sql.",
          )
        }
      }
    }
    const textColumn = chunkTextColumn

    const runQuery = async (terms: string[]) => {
      if (terms.length === 0) return [] as any[]
      const orFilter = terms.map((term) => `${textColumn}.ilike.%${term}%`).join(",")
      const { data, error } = await supabase
        .from("knowledge_chunks")
        .select(
          `
          id,
          ${textColumn},
          knowledge_documents!inner(title, category, status)
        `
        )
        .or(orFilter)
        .eq("knowledge_documents.status", "active")
        .limit(40)

      if (error) {
        console.error("[v0] Knowledge search error:", error)
        return [] as any[]
      }
      return (data || []) as any[]
    }

    // Lớp 1 + 2: tìm theo từ khoá, nới lỏng dần
    let rows = await runQuery(keywords)
    if (rows.length === 0 && keywords.length > 2) {
      rows = await runQuery(keywords.slice(0, 3))
    }
    if (rows.length === 0 && keywords.length > 0) {
      rows = await runQuery([keywords[0]])
    }
    // Lớp 3: chưa có từ khoá nào (câu quá ngắn) -> lấy chunk mới nhất làm ngữ cảnh nền
    if (rows.length === 0 && keywords.length === 0) {
      const { data } = await supabase
        .from("knowledge_chunks")
        .select(
          `
          id,
          ${textColumn},
          knowledge_documents!inner(title, category, status)
        `
        )
        .eq("knowledge_documents.status", "active")
        .limit(40)
      rows = (data || []) as any[]
    }

    // Xếp hạng từ khoá: khớp trong nội dung + điểm thưởng nếu khớp TIÊU ĐỀ tài liệu
    const keywordRanked: RankedChunk[] = rows
      .map((item) => {
        const text = item[textColumn] || item.content || item.chunk_text || ""
        const title = item.knowledge_documents?.title || ""
        return {
          chunk: {
            id: item.id,
            chunk_text: text,
            document_title: title || "Tài liệu",
            category: item.knowledge_documents?.category || "",
          },
          score: scoreChunk(text, keywords) + scoreChunk(title, keywords) * 2,
        }
      })
      .filter((entry) => entry.score > 0 || keywords.length === 0)
      .sort((a, b) => b.score - a.score)

    // Xếp hạng ngữ nghĩa (có thể null nếu chưa bật)
    const vectorRanked = await searchByVector(query, supabase, 12)

    // Hợp nhất thứ hạng (RRF): mỗi danh sách đóng góp 1/(60 + hạng).
    // Vector được nhân 1.2 vì hiểu ý tốt hơn, từ khoá vẫn giữ vai trò bắt
    // đúng các mã riêng như "GACC", "DIN", "FSMA 204".
    const K = 60
    const merged = new Map<string, RankedChunk>()

    const add = (entry: RankedChunk, rank: number, weight: number) => {
      const current = merged.get(entry.chunk.id)
      const contribution = weight / (K + rank + 1)
      if (current) {
        current.score += contribution
        // Giữ lại điểm tương đồng để hiển thị/ghi log
        if (entry.chunk.similarity !== undefined) current.chunk.similarity = entry.chunk.similarity
      } else {
        merged.set(entry.chunk.id, { chunk: entry.chunk, score: contribution })
      }
    }

    keywordRanked.forEach((entry, index) => add(entry, index, 1))
    ;(vectorRanked || []).forEach((entry, index) => add(entry, index, 1.2))

    const ranked = [...merged.values()].sort((a, b) => b.score - a.score).slice(0, topK)
    console.log(
      `[v0] Knowledge chunks tìm được: ${ranked.length} (từ khoá: ${keywordRanked.length}, ngữ nghĩa: ${vectorRanked?.length ?? 0})`,
    )

    return ranked.map(({ chunk }) => chunk)
  } catch (error) {
    console.error("[v0] Error searching knowledge:", error)
    return []
  }
}

/**
 * Xây dựng context từ knowledge chunks
 */
function buildContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) {
    // Không có tài liệu nào khớp: yêu cầu AI KHÔNG bịa và chủ động xin thêm thông tin
    // thay vì trả lời chung chung (đây là lý do khách thấy câu trả lời "nhạt").
    return `

⚠️ KHÔNG tìm thấy tài liệu nội bộ nào liên quan tới câu hỏi này trong kho tri thức của Vexim.

NẾU khách chỉ chào hỏi / cảm ơn / nói chuyện xã giao: hãy chào lại thân thiện, giới
thiệu ngắn gọn Vexim hỗ trợ FDA, GACC, MFDS, US Agent… và hỏi khách cần giúp gì.
TUYỆT ĐỐI không xin số điện thoại và không nói phải chuyển chuyên viên trong trường hợp này.

Quy tắc BẮT BUỘC khi thiếu tài liệu (với câu hỏi thật):
- KHÔNG bịa số liệu, mốc thời gian, mức phí hay tên biểu mẫu.
- Chỉ trả lời phần CHẮC CHẮN đúng theo quy định chung, ngắn gọn (tối đa 3 câu).
- Nói rõ đây là thông tin chung và cần chuyên viên xác nhận cho trường hợp cụ thể.
- Đặt 1–2 câu hỏi làm rõ (loại sản phẩm, thị trường, cơ sở đã đăng ký chưa) để tư vấn đúng hơn.`
  }

  const context = chunks
    .map(
      (chunk, index) =>
        `[Tài liệu ${index + 1}: ${chunk.document_title}]\n${chunk.chunk_text}`
    )
    .join("\n\n")

  return `

📚 TÀI LIỆU NỘI BỘ CỦA VEXIM (ưu tiên trả lời theo các tài liệu này, trích dẫn số liệu chính xác):
${context}

Lưu ý: nếu tài liệu trên không đủ để trả lời, hãy nói rõ cần chuyên viên xác nhận và đặt câu hỏi làm rõ — tuyệt đối không tự suy diễn số liệu.`
}

/**
 * Phân tích intent và xác định cần chuyển sang agent không
 */
export function analyzeIntent(
  message: string,
  aiResponse: string
): { confidence: number; shouldHandover: boolean; reason?: string } {
  // Chào hỏi / cảm ơn / xã giao: AI luôn trả lời được, tuyệt đối không chuyển
  // chuyên viên. (Nếu không chặn ở đây, câu chào lại lịch sự của AI — ví dụ
  // "Em có thể hỗ trợ anh/chị…" — bị coi là "không đủ tin cậy" và chuyển oan.)
  if (isSmallTalk(message)) {
    return { confidence: 0.95, shouldHandover: false }
  }

  // Dấu hiệu AI THẬT SỰ không chắc. KHÔNG dùng "có thể" hay "xin lỗi": đây là
  // hai từ lịch sự cực kỳ phổ biến trong tiếng Việt, trước đây hễ AI viết ra là
  // bị chấm 0.3 điểm rồi chuyển chuyên viên dù trả lời đúng.
  const lowConfidenceKeywords = [
    "không chắc",
    "không rõ",
    "chưa rõ",
    "không hiểu",
    "không có thông tin",
    "chưa có thông tin",
  ]
  // Chỉ tính là khẩn cấp khi thật sự cần xử lý ngay (có ranh giới từ, tránh
  // "ngay" khớp lẫn trong câu bình thường như "ngay cả", "ngay từ đầu").
  const urgentPatterns = [
    /(cần|muốn|làm|xử lý|triển khai|thực hiện|chốt)[\s]+(gấp|ngay)/i,
    /\bkhẩn cấp\b/i,
    /\burgent\b/i,
  ]
  const complexKeywords = [
    "tư vấn chi tiết",
    "báo giá cụ thể",
    "hợp đồng",
    "thỏa thuận",
    "ký kết",
  ]

  let confidence = 0.8 // Default confidence

  // Check for low confidence indicators
  const hasLowConfidence = lowConfidenceKeywords.some((keyword) =>
    aiResponse.toLowerCase().includes(keyword)
  )
  if (hasLowConfidence) confidence = 0.3

  // Check for urgent request
  const isUrgent = urgentPatterns.some((pattern) => pattern.test(message))
  if (isUrgent) {
    return {
      confidence: 0.2,
      shouldHandover: true,
      reason: "Yêu cầu khẩn cấp cần xử lý ngay",
    }
  }

  // Check for complex request
  const isComplex = complexKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  )
  if (isComplex) {
    return {
      confidence: 0.4,
      shouldHandover: true,
      reason: "Yêu cầu phức tạp cần chuyên gia tư vấn",
    }
  }

  return {
    confidence,
    shouldHandover: confidence < 0.5,
    reason:
      confidence < 0.5 ? "AI không đủ tin cậy để trả lời" : undefined,
  }
}

/**
 * Hướng dẫn cố định về việc mời khách tư vấn sâu hơn.
 *
 * Luôn được ghép vào system prompt (kể cả khi admin đã tự đặt system prompt trong
 * CSDL) để AI không bao giờ tự bịa giá và luôn có cách chuyển khách sang chuyên viên.
 */
const CONTACT_GUIDANCE = `

📞 KHI KHÁCH CẦN TƯ VẤN SÂU HƠN — hãy chủ động mời khách liên hệ:
- Trường hợp cần: hỏi báo giá/chi phí cụ thể, hồ sơ riêng của công ty khách, hợp đồng, khiếu nại, hoặc câu hỏi không có trong tài liệu nội bộ.
- Cách mời: "Anh/chị nhắn Zalo ${VEXIM_PHONE_DISPLAY} (${VEXIM_ZALO_URL}) hoặc để lại số điện thoại, chuyên viên Vexim sẽ tư vấn trực tiếp ạ."
- TUYỆT ĐỐI không tự bịa giá, thời hạn, cam kết hay quy định không có trong tài liệu. Nếu không có thông tin, nói rõ là chưa có và mời chuyên viên.
- TUYỆT ĐỐI KHÔNG xin số điện thoại và KHÔNG hứa chuyển chuyên viên khi khách chỉ chào hỏi, cảm ơn hay nói chuyện xã giao — những lúc đó chỉ cần chào lại thân thiện và hỏi khách cần hỗ trợ gì.
- Trả lời ngắn gọn, xưng "em", gọi khách là "anh/chị". Tối đa 3–4 câu cho mỗi lần trả lời.`

/**
 * Tạo response từ AI với RAG
 */
export async function generateAIResponse(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>,
  config: AIConfig,
  supabase: any,
  ragEnabled: boolean = true
): Promise<AIResponse> {
  try {
    let knowledgeChunks: KnowledgeChunk[] = []
    let context = ""

    // RAG: Tìm kiếm knowledge base
    if (ragEnabled) {
      knowledgeChunks = await searchKnowledge(message, 5, supabase)
      context = buildContext(knowledgeChunks)
    }

    if (isRetiredModel(config.model)) {
      console.warn(
        `[v0] Model "${config.model}" đã bị Groq ngừng phục vụ — dùng "${resolveModelChain(config.model, envFallbacks())[0]}". ` +
          `Vào Admin → Cài đặt để đổi model trong CSDL.`
      )
    }

    // Gọi model AI: tự chọn Groq/Gemini theo key đang có, tự chuyển nhà cung cấp
    // khi bên kia lỗi (hết hạn mức, model bị khai tử, key sai…).
    const { text: aiMessage, provider, model: modelUsed } = await callChatModel({
      systemPrompt: config.systemPrompt + context + CONTACT_GUIDANCE,
      message,
      history: conversationHistory,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      preferredModel: config.model,
    })
    console.log(`[v0] AI trả lời bằng: ${provider}/${modelUsed}`)
    console.log("[v0] Received AI response:", aiMessage.substring(0, 100))

    // Phân tích intent và confidence
    const analysis = analyzeIntent(message, aiMessage)

    return {
      message: aiMessage,
      confidence: analysis.confidence,
      sources: knowledgeChunks.map((c) => c.document_title),
      shouldHandover: analysis.shouldHandover,
      handoverReason: analysis.reason,
    }
  } catch (error) {
    console.error("[v0] Error generating AI response:", error)

    return {
      message:
        `Xin lỗi, em đang gặp sự cố kỹ thuật. Anh/chị thử lại sau giúp em, hoặc liên hệ hotline ${VEXIM_PHONE_DISPLAY} để được hỗ trợ trực tiếp ạ.`,
      confidence: 0.0,
      sources: [],
      shouldHandover: true,
      handoverReason: "Lỗi hệ thống AI",
    }
  }
}

/**
 * Load AI config từ database
 */
export async function loadAIConfig(supabase: any): Promise<AIConfig> {
  try {
    const { data, error } = await supabase
      .from("ai_config")
      .select("key, value")
      .in("key", [
        "groq_model",
        "max_tokens",
        "temperature",
        "system_prompt",
      ])

    if (error) throw error

    const config: any = {}
    data?.forEach((item: any) => {
      config[item.key] = item.value
    })

    return {
      model: config.groq_model || process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
      maxTokens: parseInt(config.max_tokens) || 1024,
      temperature: parseFloat(config.temperature) || 0.7,
      systemPrompt:
        config.system_prompt ||
        `Bạn là trợ lý tư vấn tuân thủ xuất khẩu của Vexim Global.
Bạn xưng "em", giao tiếp lịch sự, chuyên nghiệp, theo văn hóa Việt Nam, ưu tiên trả lời ngắn gọn – đúng trọng tâm – dễ hiểu.

📋 Dịch vụ chính của Vexim Global:
1. FDA (Mỹ) - Đăng ký cơ sở, Prior Notice, US Agent
2. GACC (Trung Quốc) - Đăng ký cơ sở Trung Quốc, kiểm dịch
3. MFDS (Hàn Quốc) - Cấp phép, kiểm dịch, tiêu chuẩn sản phẩm
4. Uỷ quyền Xuất khẩu (Export Delegation) - Xuất khẩu theo đơn đặt hàng
5. AI Traceability - Truy xuất nguồn gốc sản phẩm bằng AI
6. US Agent - Đại diện tại Mỹ cho FDA

🎯 Nhiệm vụ chính:
- Giải thích CHÍNH XÁC quy định xuất nhập khẩu cho từng thị trường
- Giúp khách hàng hiểu đúng bản chất pháp lý, tránh nhầm lẫn phổ biến
- Định hướng giải pháp, không bán hàng lộ liễu
- Biết khi nào phải chuyển chuyên viên

🚨 NGUYÊN TẮC QUAN TRỌNG NHẤT - KHÔNG GIẢ ĐỊNH SẢN PHẨM:
- TUYỆT ĐỐI KHÔNG tự ý đề cập đến sản phẩm cụ thể mà khách chưa nói
- TUYỆT ĐỐI KHÔNG dùng ví dụ sản phẩm như "chè khô", "cà phê", "hải sản" khi khách chưa nói
- ❌ SAI: "Để đăng ký chè khô với GACC..." (khi khách chỉ hỏi "đăng ký GACC")
- ✅ ĐÚNG: "Anh/chị cho em biết sản phẩm muốn xuất khẩu là gì ạ?"
- LUÔN HỎI SẢN PHẨM TRƯỚC khi đưa ra hướng dẫn cụ thể

⚠️ Nguyên tắc bắt buộc - FDA:
- FDA KHÔNG đăng ký sản phẩm thực phẩm thường
- FDA chỉ yêu cầu: Đăng ký CƠ SỞ + Prior Notice + US Agent
- TUYỆT ĐỐI KHÔNG dùng: "đăng ký sản phẩm", "xin giấy phép", "phê duyệt"
- HỎI SẢN PHẨM trước khi tư vấn chi tiết

⚠️ Nguyên tắc bắt buộc - GACC (Cập nhật 2026):
- HỎI SẢN PHẨM TRƯỚC: "Anh/chị cho em biết sản phẩm muốn xuất khẩu sang Trung Quốc là gì ạ?"
- GACC Decree 280 (có hiệu lực 1/6/2026): Bắt buộc đăng ký cơ sở với GACC
- Yêu cầu kiểm dịch toàn bộ lô hàng (100%)
- Nhãn mác phải có tiếng Trung Quốc (GB 7718)
- KHÔNG đề cập sản phẩm cụ thể nếu khách chưa nói

⚠️ Nguyên tắc bắt buộc - MFDS:
- HỎI SẢN PHẨM trước khi tư vấn
- MFDS yêu cầu đăng ký cơ sở trước
- Thực phẩm chức năng / mới yêu cầu cấp phép riêng
- Nhãn mác phải có tiếng Hàn Quốc

🧠 Cách trả lời:
- Trả lời TỰ NHIÊN như trò chuyện thật, KHÔNG máy móc, KHÔNG rập khuôn
- **TUYỆT ĐỐI CẤM** các câu máy móc sau:
  ❌ "Em có thể hỗ trợ anh/chị tìm hiểu thêm..."
  ❌ "Nếu anh/chị muốn, em có thể hỗ trợ kết nối..."
  ❌ "Anh/chị có thể tham khảo..."
  ❌ "Tuy nhiên, để có thông tin chính xác và cụ thể..."
  ❌ "Em nghĩ rằng anh/chị nên làm việc trực tiếp với chuyên viên..."
  ❌ BẤT KỲ câu nào bắt đầu bằng "Nếu anh/chị muốn..."
- Kết thúc bằng CÂU HỎI CỤ THỂ về tình huống của khách, KHÔNG dùng câu chung chung
- Ví dụ ĐÚNG: "Vậy cơ sở anh/chị đã có giấy phép ATTP chưa ạ?" 
- Ví dụ SAI: "Em có thể hỗ trợ anh/chị tìm hiểu thêm về GACC" ❌
- Không hỏi quá nhiều câu cùng lúc (tối đa 1-2 câu)
- Không suy đoán khi thiếu thông tin; nếu không chắc → chuyển chuyên viên
- Không báo giá cụ thể, không cam kết kết quả

🔁 Khi NÀO phải chuyển chuyên viên (HANDOVER):
- Khách hỏi về sản phẩm cụ thể của họ
- Khách nói: "bạn có làm không", "giúp tôi làm", "kết nối giúp tôi"
- Khách hỏi chi phí / báo giá
- Khách nói đã bị FDA/GACC/MFDS từ chối / cảnh báo
- Sản phẩm là: dietary supplement, low-acid canned food, thực phẩm chức năng (MFDS)

🗣️ Cách mời kết nối chuẩn:
"Trường hợp này em cần chuyên viên bên em kiểm tra kỹ để tư vấn chính xác cho mình.
Nếu anh/chị tiện, cho em xin số điện thoại, em nhờ chuyên viên của Vexim liên hệ hỗ trợ trực tiếp ạ."

🚫 Giới hạn vai trò:
- Bạn không thay thế chuyên viên tư vấn
- Bạn không đưa ra kết luận pháp lý cuối cùng
- Nhiệm vụ của bạn là giải thích – định hướng – mở đường cho chuyên viên`,
    }
  } catch (error) {
    console.error("[v0] Error loading AI config:", error)
    throw error
  }
}
