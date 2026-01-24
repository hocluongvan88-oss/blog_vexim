import { generateText } from "ai"
import type { FDAItem } from "@/types/fda"
import { createServerClient } from "@/lib/supabase-server"

export class FDAAIService {
  // C-4: Tạo summary tiếng Việt cho FDA item với cache
  async generateVietnameseSummary(item: FDAItem, cacheKey?: string): Promise<string> {
    try {
      // Check cache first if cacheKey provided
      if (cacheKey) {
        const cached = await this.getCachedSummary(cacheKey, item.id)
        if (cached) {
          console.log(`[v0] AI summary cache HIT for item: ${item.id}`)
          return cached
        }
        console.log(`[v0] AI summary cache MISS for item: ${item.id}`)
      }

      console.log(`[v0] Generating Vietnamese summary for: ${item.title.substring(0, 50)}...`)

      // Prompt tùy theo category
      const prompt = this.buildPrompt(item)

      const { text } = await generateText({
        model: "groq/llama-3.3-70b-versatile",
        prompt,
        maxTokens: 200,
      })

      const summary = text.trim()
      console.log(`[v0] Generated summary: ${summary.substring(0, 100)}...`)

      // Save to cache if cacheKey provided
      if (cacheKey) {
        await this.saveSummaryToCache(cacheKey, item.id, summary)
      }

      return summary
    } catch (error) {
      console.error("[v0] Error generating Vietnamese summary:", error)
      return `${item.title} - ${item.criticalInfo}`
    }
  }

  // Get cached AI summary from database
  private async getCachedSummary(cacheKey: string, itemId: string): Promise<string | null> {
    try {
      const supabase = await createServerClient()
      
      const { data, error } = await supabase
        .from("fda_alerts_cache")
        .select("ai_summaries")
        .eq("cache_key", cacheKey)
        .gt("expires_at", new Date().toISOString())
        .single()

      if (error || !data || !data.ai_summaries) {
        return null
      }

      const summaries = data.ai_summaries as Record<string, string>
      return summaries[itemId] || null
    } catch (error) {
      console.error("[v0] Error getting cached summary:", error)
      return null
    }
  }

  // Save AI summary to cache
  private async saveSummaryToCache(cacheKey: string, itemId: string, summary: string): Promise<void> {
    try {
      const supabase = await createServerClient()
      
      // Get existing cache entry
      const { data: existing } = await supabase
        .from("fda_alerts_cache")
        .select("ai_summaries")
        .eq("cache_key", cacheKey)
        .single()

      const existingSummaries = (existing?.ai_summaries as Record<string, string>) || {}
      const updatedSummaries = {
        ...existingSummaries,
        [itemId]: summary,
      }

      // Update cache with new summary
      await supabase
        .from("fda_alerts_cache")
        .update({
          ai_summaries: updatedSummaries,
        })
        .eq("cache_key", cacheKey)

      console.log(`[v0] Saved AI summary to cache for item: ${itemId}`)
    } catch (error) {
      console.error("[v0] Error saving summary to cache:", error)
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
