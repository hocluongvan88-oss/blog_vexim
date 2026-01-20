import { NextResponse } from "next/server"
import Groq from "groq-sdk"

export async function POST(request: Request) {
  try {
    // Check if GROQ_API_KEY is configured
    if (!process.env.GROQ_API_KEY) {
      console.error("[v0] GROQ_API_KEY is not configured")
      return NextResponse.json(
        { error: "GROQ_API_KEY chưa được cấu hình. Vui lòng thêm vào biến môi trường." },
        { status: 500 }
      )
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    const { task, text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    let systemPrompt = ""
    let userPrompt = ""

    switch (task) {
      case "improve":
        systemPrompt = `Bạn là chuyên gia viết content marketing. Nhiệm vụ: cải thiện văn phong, làm cho văn bản chuyên nghiệp hơn, dễ đọc hơn, nhưng giữ nguyên ý nghĩa.
        
Quy tắc:
- Giữ nguyên độ dài tương đương
- Viết theo văn phong blog chuyên nghiệp Việt Nam
- Không thêm thông tin mới
- Trả về CHỈ văn bản đã cải thiện, không giải thích`
        userPrompt = `Cải thiện đoạn văn sau:\n\n${text}`
        break

      case "shorten":
        systemPrompt = `Bạn là chuyên gia editing. Nhiệm vụ: rút ngắn văn bản xuống 50-70% độ dài gốc, giữ lại những thông tin quan trọng nhất.
        
Quy tắc:
- Loại bỏ từ ngữ thừa, câu lặp
- Giữ nguyên ý chính
- Văn phong súc tích, chuyên nghiệp
- Trả về CHỈ văn bản đã rút gọn`
        userPrompt = `Rút ngắn đoạn văn sau:\n\n${text}`
        break

      case "expand":
        systemPrompt = `Bạn là content writer chuyên nghiệp. Nhiệm vụ: mở rộng ý tưởng, thêm chi tiết, ví dụ cụ thể để văn bản phong phú hơn.
        
Quy tắc:
- Thêm ví dụ, giải thích chi tiết
- Giữ nguyên ý chính
- Không thêm thông tin sai lệch
- Độ dài tăng 150-200%
- Trả về CHỈ văn bản đã mở rộng`
        userPrompt = `Mở rộng đoạn văn sau với nhiều chi tiết hơn:\n\n${text}`
        break

      case "keywords":
        systemPrompt = `Bạn là SEO specialist. Nhiệm vụ: thêm từ khóa SEO tự nhiên vào văn bản để tối ưu cho công cụ tìm kiếm.
        
Quy tắc:
- Thêm từ khóa liên quan tự nhiên
- Không làm văn bản kỳ quặc
- Giữ độ dài tương đương
- Tối ưu cho SEO Việt Nam
- Trả về CHỈ văn bản đã tối ưu SEO`
        userPrompt = `Thêm từ khóa SEO vào đoạn văn sau (liên quan đến xuất nhập khẩu, FDA, GACC, MFDS):\n\n${text}`
        break

      case "meta_description":
        systemPrompt = `Bạn là SEO expert. Nhiệm vụ: tạo meta description tối ưu cho bài blog.
        
Quy tắc:
- Độ dài 150-160 ký tự
- Chứa từ khóa chính
- Hấp dẫn, kêu gọi hành động
- Tóm tắt nội dung chính
- Viết bằng tiếng Việt
- Trả về CHỈ meta description, không giải thích`
        userPrompt = `Tạo meta description cho bài viết sau:\n\n${text.slice(0, 1000)}...`
        break

      case "suggest_tags":
        systemPrompt = `Bạn là content strategist. Nhiệm vụ: phân tích nội dung và đề xuất 5-8 tags phù hợp.
        
Quy tắc:
- Tags liên quan đến xuất nhập khẩu, FDA, GACC, MFDS, logistics
- Viết bằng tiếng Việt
- Ngắn gọn, dễ hiểu (1-3 từ mỗi tag)
- Trả về CHỈ danh sách tags, mỗi tag trên 1 dòng, không đánh số`
        userPrompt = `Đề xuất tags cho bài viết:\n\n${text.slice(0, 1000)}...`
        break

      default:
        return NextResponse.json({ error: "Invalid task" }, { status: 400 })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: task === "suggest_tags" ? 0.8 : 0.7,
      max_tokens: task === "expand" ? 2048 : 1024,
    })

    const result = completion.choices[0]?.message?.content || ""

    // Handle tags response
    if (task === "suggest_tags") {
      const tags = result
        .split("\n")
        .map((tag) => tag.trim())
        .filter((tag) => tag && !tag.match(/^\d+\./)) // Remove numbered lists
        .slice(0, 8)

      return NextResponse.json({ tags })
    }

    // Handle meta description with keywords extraction
    if (task === "meta_description") {
      // Extract potential keywords (this is basic, could be improved)
      const keywords = text
        .toLowerCase()
        .match(/\b(fda|gacc|mfds|xuất khẩu|nhập khẩu|hải quan|kiểm dịch|thực phẩm|mỹ phẩm|dược phẩm)\b/gi)
      const uniqueKeywords = [...new Set(keywords || [])].slice(0, 5)

      return NextResponse.json({ 
        result, 
        keywords: uniqueKeywords 
      })
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error("[v0] AI assistant error:", error)
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    )
  }
}
