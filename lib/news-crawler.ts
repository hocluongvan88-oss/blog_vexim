import { generateObject, generateText } from "ai"
import { z } from "zod"
import * as cheerio from "cheerio"

// Schema cho tin tức từ FDA
const fdaNewsSchema = z.object({
  title: z.string(),
  url: z.string(),
  date: z.string(),
  summary: z.string(),
  relevance: z.enum(["high", "medium", "low"]),
  categories: z.array(z.string()),
})

// Schema cho tin tức từ GACC
const gaccNewsSchema = z.object({
  title: z.string(),
  url: z.string(),
  date: z.string(),
  summary: z.string(),
  relevance: z.enum(["high", "medium", "low"]),
  categories: z.array(z.string()),
})

export type NewsArticle = z.infer<typeof fdaNewsSchema>

// Lọc tầng 1: Lọc theo từ khóa cơ bản
const TIER1_KEYWORDS = [
  "food",
  "thực phẩm",
  "import",
  "export",
  "xuất khẩu",
  "nhập khẩu",
  "FDA",
  "GACC",
  "MFDS",
  "regulation",
  "quy định",
  "policy",
  "chính sách",
  "inspection",
  "kiểm tra",
  "certificate",
  "giấy chứng nhận",
  "registration",
  "đăng ký",
  "compliance",
  "tuân thủ",
  "seafood",
  "hải sản",
  "agricultural",
  "nông sản",
  "beverage",
  "đồ uống",
]

// Lọc tầng 2: Prompt chi tiết cho AI
const TIER2_ANALYSIS_PROMPT = `
Phân tích bài viết tin tức này và xác định mức độ liên quan đến lĩnh vực xuất nhập khẩu thực phẩm:

YÊU CẦU:
1. Có liên quan đến xuất khẩu/nhập khẩu thực phẩm sang Mỹ, Trung Quốc, Hàn Quốc?
2. Có đề cập đến quy định FDA, GACC, MFDS?
3. Có cập nhật về chính sách, luật pháp mới?
4. Có liên quan đến giấy tờ pháp lý (Process Filing, GACC Registration, US Agent, FSVP)?
5. Có đề cập đến thực phẩm (hải sản, nông sản, đồ uống, thực phẩm chế biến)?

Đánh giá:
- HIGH: Trực tiếp liên quan đến chính sách/quy định xuất nhập khẩu thực phẩm
- MEDIUM: Có đề cập gián tiếp hoặc ảnh hưởng đến ngành
- LOW: Ít liên quan hoặc chỉ đề cập chung chung

Phân loại vào các danh mục: FDA Regulations, GACC Updates, Export Requirements, Import Compliance, Food Safety, Policy Changes, Documentation, Inspection Guidelines
`

// Lọc tầng 3: Kiểm tra chi tiết với structured output
const TIER3_VALIDATION_SCHEMA = z.object({
  isRelevant: z.boolean(),
  relevanceScore: z.number().min(0).max(100),
  relevanceReason: z.string(),
  keyPoints: z.array(z.string()),
  affectedProducts: z.array(z.string()),
  affectedCountries: z.array(z.string()),
  requiresAction: z.boolean(),
  actionDeadline: z.string().optional(),
})

export class NewsCrawler {
  // Crawl FDA news
  async crawlFDANews(): Promise<string[]> {
    try {
      const response = await fetch("https://www.fda.gov/news-events/fda-newsroom/press-announcements")
      const html = await response.text()
      const $ = cheerio.load(html)

      const articles: string[] = []

      // Extract articles from FDA website
      $(".node--type-press-announcement").each((_, element) => {
        const title = $(element).find("h2").text().trim()
        const url = $(element).find("a").attr("href")
        const date = $(element).find(".date-display-single").text().trim()
        const summary = $(element).find(".field--name-body").text().trim()

        if (title && url) {
          articles.push(
            JSON.stringify({
              title,
              url: `https://www.fda.gov${url}`,
              date,
              summary: summary.substring(0, 300),
              source: "FDA",
            }),
          )
        }
      })

      return articles
    } catch (error) {
      console.error("Error crawling FDA news:", error)
      return []
    }
  }

  // Crawl GACC news (Trung Quốc)
  async crawlGACCNews(): Promise<string[]> {
    try {
      const response = await fetch("http://www.customs.gov.cn/customs/302249/2480148/index.html")
      const html = await response.text()
      const $ = cheerio.load(html)

      const articles: string[] = []

      // Extract articles from GACC website
      $(".article-list li").each((_, element) => {
        const title = $(element).find("a").text().trim()
        const url = $(element).find("a").attr("href")
        const date = $(element).find(".date").text().trim()

        if (title && url) {
          articles.push(
            JSON.stringify({
              title,
              url: url.startsWith("http") ? url : `http://www.customs.gov.cn${url}`,
              date,
              summary: "",
              source: "GACC",
            }),
          )
        }
      })

      return articles
    } catch (error) {
      console.error("Error crawling GACC news:", error)
      return []
    }
  }

  // Lọc tầng 1: Keyword filtering
  tier1Filter(article: string): boolean {
    const articleLower = article.toLowerCase()
    return TIER1_KEYWORDS.some((keyword) => articleLower.includes(keyword.toLowerCase()))
  }

  // Lọc tầng 2: AI analysis với generateText
  async tier2Analysis(article: string): Promise<{ relevance: string; categories: string[] }> {
    try {
      const { text } = await generateText({
        model: "openai/gpt-4o",
        prompt: `${TIER2_ANALYSIS_PROMPT}\n\nBÀI VIẾT:\n${article}\n\nTrả về JSON format: {"relevance": "high|medium|low", "categories": ["category1", "category2"]}`,
        maxOutputTokens: 500,
      })

      const result = JSON.parse(text)
      return {
        relevance: result.relevance || "low",
        categories: result.categories || [],
      }
    } catch (error) {
      console.error("Error in tier2 analysis:", error)
      return { relevance: "low", categories: [] }
    }
  }

  // Lọc tầng 3: Structured validation với generateObject
  async tier3Validation(article: string) {
    try {
      const { object } = await generateObject({
        model: "openai/gpt-4o",
        schema: TIER3_VALIDATION_SCHEMA,
        prompt: `
Phân tích chi tiết bài viết tin tức này về xuất nhập khẩu thực phẩm:

${article}

Xác định:
1. Có liên quan trực tiếp đến xuất nhập khẩu thực phẩm không?
2. Điểm số mức độ liên quan (0-100)
3. Lý do đánh giá
4. Các điểm chính cần lưu ý
5. Sản phẩm bị ảnh hưởng (hải sản, nông sản, đồ uống, etc.)
6. Quốc gia bị ảnh hưởng (Mỹ, Trung Quốc, Hàn Quốc, Việt Nam)
7. Có yêu cầu hành động gấp không?
8. Deadline nếu có
        `,
      })

      return object
    } catch (error) {
      console.error("Error in tier3 validation:", error)
      return null
    }
  }

  // Process toàn bộ workflow
  async processNewsArticle(articleJson: string): Promise<NewsArticle | null> {
    const article = JSON.parse(articleJson)

    // Lớp 1: Keyword filter
    if (!this.tier1Filter(articleJson)) {
      console.log(`[Tier 1] Filtered out: ${article.title}`)
      return null
    }

    // Lớp 2: AI analysis
    const tier2Result = await this.tier2Analysis(articleJson)
    if (tier2Result.relevance === "low") {
      console.log(`[Tier 2] Low relevance: ${article.title}`)
      return null
    }

    // Lớp 3: Detailed validation
    const tier3Result = await this.tier3Validation(articleJson)
    if (!tier3Result || !tier3Result.isRelevant) {
      console.log(`[Tier 3] Not relevant: ${article.title}`)
      return null
    }

    // Nếu pass tất cả 3 lớp, return article
    return {
      title: article.title,
      url: article.url,
      date: article.date,
      summary: tier3Result.keyPoints.join(". "),
      relevance: tier2Result.relevance as "high" | "medium" | "low",
      categories: tier2Result.categories,
    }
  }
}
