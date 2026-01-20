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

/**
 * Tìm kiếm tài liệu liên quan từ knowledge base
 */
export async function searchKnowledge(
  query: string,
  topK: number = 5,
  supabase: any
): Promise<KnowledgeChunk[]> {
  try {
    // Tạo embedding cho query
    const queryEmbedding = await createEmbedding(query)

    // Tìm kiếm similarity (cần pgvector extension)
    // Hiện tại sử dụng full-text search thay thế
    const { data, error } = await supabase
      .from("knowledge_chunks")
      .select(
        `
        id,
        chunk_text,
        knowledge_documents!inner(title, category)
      `
      )
      .textSearch("chunk_text", query, {
        type: "websearch",
        config: "english",
      })
      .limit(topK)

    if (error) throw error

    return (
      data?.map((item: any) => ({
        id: item.id,
        chunk_text: item.chunk_text,
        document_title: item.knowledge_documents.title,
        category: item.knowledge_documents.category,
      })) || []
    )
  } catch (error) {
    console.error("[v0] Error searching knowledge:", error)
    return []
  }
}

/**
 * Xây dựng context từ knowledge chunks
 */
function buildContext(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return ""

  const context = chunks
    .map(
      (chunk, index) =>
        `[Tài liệu ${index + 1}: ${chunk.document_title}]\n${chunk.chunk_text}`
    )
    .join("\n\n")

  return `\n\nThông tin tham khảo:\n${context}`
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
        "Bạn là AI assistant của Vexim Global, chuyên tư vấn về xuất nhập khẩu.",
    }
  } catch (error) {
    console.error("[v0] Error loading AI config:", error)
    return {
      model: "llama-3.3-70b-versatile",
      maxTokens: 1024,
      temperature: 0.7,
      systemPrompt:
        "Bạn là AI assistant của Vexim Global, chuyên tư vấn về xuất nhập khẩu, FDA, MFDS, GACC và các dịch vụ liên quan.",
    }
  }
}
