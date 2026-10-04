import Groq from "groq-sdk"

// Initialize Groq client
let groq: Groq | null = null

try {
  if (!process.env.GROQ_API_KEY) {
    console.error("[v0] GROQ_API_KEY is not set in environment variables")
  } else {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
    console.log("[v0] Groq client initialized successfully")
  }
} catch (error) {
  console.error("[v0] Error initializing Groq client:", error)
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
}

export interface AIResponse {
  message: string
  confidence: number
  sources: string[]
  shouldHandover: boolean
  handoverReason?: string
}

/**
 * Tạo embedding cho text (cần OpenAI hoặc alternative)
 * Đây là placeholder - bạn cần implement với OpenAI API hoặc local model
 */
export async function createEmbedding(text: string): Promise<number[]> {
  // TODO: Implement với OpenAI API hoặc local embedding model
  // Hiện tại return mock embedding
  console.log("[v0] Creating embedding for:", text.substring(0, 100))
  return Array(1536).fill(0)
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

    // Xếp hạng: từ khoá khớp trong nội dung chunk + điểm thưởng nếu khớp TIÊU ĐỀ tài liệu
    const ranked = rows
      .map((item) => {
        const text = item[chunkTextColumn || "content"] || item.content || item.chunk_text || ""
        const title = item.knowledge_documents?.title || ""
        return { item, score: scoreChunk(text, keywords) + scoreChunk(title, keywords) * 2 }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)

    console.log("[v0] Knowledge chunks tìm được:", ranked.length)

    return ranked.map(({ item }) => ({
      id: item.id,
      chunk_text: item[textColumn] ?? item.content ?? item.chunk_text ?? "",
      document_title: item.knowledge_documents?.title || "Tài liệu",
      category: item.knowledge_documents?.category || "",
    }))
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
Quy tắc BẮT BUỘC khi thiếu tài liệu:
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
function analyzeIntent(
  message: string,
  aiResponse: string
): { confidence: number; shouldHandover: boolean; reason?: string } {
  const lowConfidenceKeywords = [
    "không chắc",
    "có thể",
    "không rõ",
    "xin lỗi",
    "không hiểu",
  ]
  const urgentKeywords = [
    "khẩn cấp",
    "gấp",
    "ngay",
    "urgent",
    "nhanh",
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
  const isUrgent = urgentKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  )
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
    // Check if Groq is initialized
    if (!groq) {
      throw new Error("Groq client is not initialized. Please check GROQ_API_KEY environment variable.")
    }

    let knowledgeChunks: KnowledgeChunk[] = []
    let context = ""

    // RAG: Tìm kiếm knowledge base
    if (ragEnabled) {
      knowledgeChunks = await searchKnowledge(message, 5, supabase)
      context = buildContext(knowledgeChunks)
    }

    // Xây dựng messages cho Groq
    const messages: any[] = [
      {
        role: "system",
        content: config.systemPrompt + context,
      },
      ...conversationHistory,
      {
        role: "user",
        content: message,
      },
    ]

    console.log("[v0] Calling Groq API with model:", config.model)

    // Gọi Groq API
    const completion = await groq.chat.completions.create({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    })

    const aiMessage = completion.choices[0]?.message?.content || ""
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
        "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hotline để được hỗ trợ trực tiếp.",
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
      model: config.groq_model || "llama-3.3-70b-versatile",
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
