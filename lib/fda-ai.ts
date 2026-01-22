import { generateText } from "ai"
import type { FDAItem } from "@/types/fda"

export class FDAAIService {
  // Tạo summary tiếng Việt cho FDA item
  async generateVietnameseSummary(item: FDAItem): Promise<string> {
    try {
      console.log(`[v0] Generating Vietnamese summary for: ${item.title.substring(0, 50)}...`)

      // Prompt tùy theo category
      const prompt = this.buildPrompt(item)

      const { text } = await generateText({
        model: "groq/llama-3.3-70b-versatile",
        prompt,
        maxTokens: 200,
      })

      console.log(`[v0] Generated summary: ${text.substring(0, 100)}...`)

      return text.trim()
    } catch (error) {
      console.error("[v0] Error generating Vietnamese summary:", error)
      return `${item.title} - ${item.criticalInfo}`
    }
  }

  private buildPrompt(item: FDAItem): string {
    const baseInfo = `
Sản phẩm: ${item.title}
Thông tin quan trọng: ${item.criticalInfo}
Ngày: ${item.date}
Trạng thái: ${item.status}
${item.classification ? `Phân loại: ${item.classification}` : ""}
${item.manufacturer ? `Nhà sản xuất: ${item.manufacturer}` : ""}
    `.trim()

    // Prompt khác nhau theo category
    switch (item.category) {
      case "food":
        return `
Bạn là chuyên gia an toàn thực phẩm. Tóm tắt cảnh báo thu hồi thực phẩm sau đây bằng tiếng Việt (tối đa 2-3 câu). 
Tập trung vào: Sản phẩm gì, tại sao bị thu hồi, nguy cơ sức khỏe.

${baseInfo}

CHỈ xuất ra tiếng Việt, không giải thích thêm:`

      case "cosmetic":
        return `
Bạn là chuyên gia mỹ phẩm. Tóm tắt biến cố có hại từ mỹ phẩm sau đây bằng tiếng Việt (tối đa 2-3 câu).
Tập trung vào: Sản phẩm gì, phản ứng phụ nào, mức độ nghiêm trọng.

${baseInfo}

CHỈ xuất ra tiếng Việt, không giải thích thêm:`

      case "drug":
        return `
Bạn là dược sĩ. Tóm tắt thông tin về thuốc sau đây bằng tiếng Việt (tối đa 2-3 câu).
Tập trung vào: Tên thuốc, vấn đề gì, ảnh hưởng đến người dùng.

${baseInfo}

CHỈ xuất ra tiếng Việt, không giải thích thêm:`

      default:
        return `
Tóm tắt cảnh báo FDA sau đây bằng tiếng Việt (tối đa 2-3 câu). Nói rõ vấn đề và rủi ro.

${baseInfo}

CHỈ xuất ra tiếng Việt, không giải thích thêm:`
    }
  }

  // Batch processing cho nhiều items
  async generateSummariesBatch(items: FDAItem[]): Promise<FDAItem[]> {
    console.log(`[v0] Generating summaries for ${items.length} items...`)

    const summaryPromises = items.map(async (item) => {
      const summary = await this.generateVietnameseSummary(item)
      return {
        ...item,
        aiSummary: summary,
      }
    })

    const itemsWithSummaries = await Promise.all(summaryPromises)

    console.log(`[v0] Completed ${itemsWithSummaries.length} summaries`)

    return itemsWithSummaries
  }
}

// Singleton instance
export const fdaAI = new FDAAIService()
