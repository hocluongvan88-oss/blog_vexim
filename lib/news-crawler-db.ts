import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@/lib/supabase-server"

// Tier 1: Keyword filtering
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
  "seafood",
  "hải sản",
  "agricultural",
  "nông sản",
  "beverage",
  "đồ uống",
  "inspection",
  "kiểm tra",
  "certificate",
  "giấy chứng nhận",
  "registration",
  "đăng ký",
  "compliance",
  "tuân thủ",
]

interface ArticleLink {
  title: string
  url: string
  date?: string
}

// Fetch FDA news using RSS feed (more reliable than HTML parsing)
async function fetchFDAArticles(): Promise<ArticleLink[]> {
  console.log("[v0] Trying FDA crawl strategy 1/1...")

  try {
    // FDA RSS feed is more reliable than parsing HTML
    const response = await fetch(
      "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }

    const xml = await response.text()
    console.log(`[v0] FDA crawl successful with strategy 1`)
    console.log(`[v0] Fetched ${xml.length} bytes from FDA`)

    // Parse XML RSS feed
    const articles: ArticleLink[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>/
    const linkRegex = /<link>(.*?)<\/link>/
    const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/

    let match
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemContent = match[1]
      const titleMatch = titleRegex.exec(itemContent)
      const linkMatch = linkRegex.exec(itemContent)
      const dateMatch = pubDateRegex.exec(itemContent)

      if (titleMatch && linkMatch) {
        articles.push({
          title: titleMatch[1].trim(),
          url: linkMatch[1].trim(),
          date: dateMatch ? dateMatch[1].trim() : undefined,
        })
      }
    }

    console.log(`[v0] Parsed ${articles.length} article links from RSS feed`)
    return articles.slice(0, 20) // Get latest 20 articles
  } catch (error: any) {
    console.error(`[v0] FDA crawl failed:`, error.message)
    return []
  }
}

// Fetch GACC news using their RSS or alternative method
async function fetchGACCArticles(): Promise<ArticleLink[]> {
  const strategies = [
    // Strategy 1: Try their news API endpoint
    async () => {
      console.log("[v0] Trying GACC crawl strategy 1/2...")
      const response = await fetch("http://www.customs.gov.cn/customs/302249/302266/302267/index.html", {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          "Accept-Encoding": "gzip, deflate",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
      })

      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)

      const html = await response.text()
      console.log(`[v0] Strategy 1 successful, fetched ${html.length} bytes`)

      // Parse HTML for article links
      const articles: ArticleLink[] = []
      const linkRegex = /<a\s+href=["'](\/customs\/[^"']+)["'][^>]*>([^<]+)<\/a>/g
      const dateRegex = /(\d{4})-(\d{2})-(\d{2})/

      let match
      while ((match = linkRegex.exec(html)) !== null && articles.length < 20) {
        const url = match[1]
        const title = match[2].trim()
        const dateMatch = dateRegex.exec(html.substring(match.index - 50, match.index + 200))

        if (title.length > 10) {
          // Filter out navigation links
          articles.push({
            title,
            url: `http://www.customs.gov.cn${url}`,
            date: dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : undefined,
          })
        }
      }

      return articles
    },

    // Strategy 2: Fallback to mock data with a note to manually update
    async () => {
      console.log("[v0] Trying GACC crawl strategy 2/2 (fallback)...")
      console.log("[v0] GACC website is blocking automated access. Using fallback mode.")
      console.log("[v0] Note: Please manually add GACC articles or contact their webmaster for API access.")

      // Return empty array - user can manually add GACC news
      return []
    },
  ]

  for (let i = 0; i < strategies.length; i++) {
    try {
      const articles = await strategies[i]()
      if (articles.length > 0) {
        console.log(`[v0] Found ${articles.length} article links from GACC`)
        return articles
      }
    } catch (error: any) {
      console.log(`[v0] Strategy ${i + 1} failed: ${error.message}`)
      if (i < strategies.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }
  }

  console.log(`[v0] All GACC strategies failed, returning empty array`)
  return []
}

// Fetch full article content
async function fetchArticleDetail(url: string, source: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) return null

    const html = await response.text()

    // Extract main content based on source
    let content = ""
    if (source === "FDA") {
      // FDA uses specific content containers
      const contentMatch = html.match(/<div class="content-body">([\s\S]*?)<\/div>/i)
      content = contentMatch ? contentMatch[1] : html
    } else {
      // GACC - try common content containers
      const contentMatch =
        html.match(/<div class="content">([\s\S]*?)<\/div>/i) || html.match(/<div id="content">([\s\S]*?)<\/div>/i)
      content = contentMatch ? contentMatch[1] : html
    }

    // Strip HTML tags and clean up
    content = content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    return content.substring(0, 3000) // Limit to 3000 chars
  } catch (error) {
    console.error(`[v0] Error fetching article detail from ${url}:`, error)
    return null
  }
}

// Tier 1: Keyword filter
function tier1KeywordFilter(text: string): boolean {
  const lowerText = text.toLowerCase()
  return TIER1_KEYWORDS.some((keyword) => lowerText.includes(keyword.toLowerCase()))
}

// Tier 2 & 3: AI analysis with OpenAI
async function aiAnalysis(
  title: string,
  content: string,
  source: string,
): Promise<{
  passed: boolean
  relevance: "high" | "medium" | "low"
  category: string
  excerpt: string
} | null> {
  try {
    const hasApiKey = !!process.env.OPENAI_API_KEY

    if (!hasApiKey) {
      console.log("[v0] No OPENAI_API_KEY found, falling back to keyword-only filtering")
      // Fallback: simple keyword matching
      const passed = tier1KeywordFilter(title + " " + content)
      return passed
        ? {
            passed: true,
            relevance: "medium",
            category: source === "FDA" ? "FDA Regulations" : "GACC Updates",
            excerpt: content.substring(0, 200),
          }
        : null
    }

    console.log("[v0] Using OpenAI API for AI filtering...")

    const prompt = `Phân tích bài viết tin tức về xuất nhập khẩu thực phẩm:

TIÊU ĐỀ: ${title}
NỘI DUNG: ${content}
NGUỒN: ${source}

YÊU CẦU ĐÁNH GIÁ:
1. Có liên quan trực tiếp đến xuất/nhập khẩu thực phẩm (hải sản, nông sản, đồ uống) sang Mỹ, Trung Quốc, Hàn Quốc?
2. Có đề cập quy định FDA, GACC, MFDS hay các giấy tờ pháp lý (Process Filing, GACC Registration, US Agent)?
3. Có cập nhật chính sách mới ảnh hưởng đến doanh nghiệp xuất khẩu thực phẩm?

Trả về JSON format:
{
  "passed": true/false (true nếu liên quan đến xuất nhập khẩu thực phẩm),
  "relevance": "high/medium/low",
  "category": "FDA Regulations" hoặc "GACC Updates" hoặc "Export Requirements" hoặc "Food Safety",
  "excerpt": "tóm tắt ngắn gọn 1-2 câu về nội dung chính"
}

CHỈ trả về JSON, không giải thích thêm.`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxTokens: 300,
    })

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("[v0] Could not parse AI response as JSON")
      return null
    }

    const result = JSON.parse(jsonMatch[0])
    return result.passed ? result : null
  } catch (error: any) {
    console.error("[v0] AI analysis error:", error.message)
    // Fallback to keyword filtering
    const passed = tier1KeywordFilter(title + " " + content)
    return passed
      ? {
          passed: true,
          relevance: "medium",
          category: source === "FDA" ? "FDA Regulations" : "GACC Updates",
          excerpt: content.substring(0, 200),
        }
      : null
  }
}

// Main crawl function
export async function crawlNews(source: "FDA" | "GACC") {
  const supabase = await createClient()

  try {
    // Fetch article links
    const articles = source === "FDA" ? await fetchFDAArticles() : await fetchGACCArticles()

    if (articles.length === 0) {
      return {
        success: false,
        message: `No articles found from ${source}`,
        savedCount: 0,
      }
    }

    console.log(`[v0] Processing ${articles.length} articles from ${source}...`)

    let savedCount = 0
    let processedCount = 0

    for (const article of articles) {
      processedCount++
      console.log(`[v0] [${processedCount}/${articles.length}] Processing: ${article.title}`)

      // Tier 1: Keyword filter
      if (!tier1KeywordFilter(article.title)) {
        console.log(`[v0] [Tier 1] Filtered out (no keywords): ${article.title}`)
        continue
      }

      // Fetch full article content
      console.log(`[v0] Fetching article detail from: ${article.url}`)
      const content = await fetchArticleDetail(article.url, source)

      if (!content) {
        console.log(`[v0] Could not fetch article content, skipping`)
        continue
      }

      console.log(`[v0] Fetched ${content.length} chars of content`)

      // Tier 2 & 3: AI analysis
      const aiResult = await aiAnalysis(article.title, content, source)

      if (!aiResult) {
        console.log(`[v0] [AI Filter] Not relevant: ${article.title}`)
        continue
      }

      console.log(`[v0] [AI Filter] PASSED - Relevance: ${aiResult.relevance}, Category: ${aiResult.category}`)

      // Save to database
      const { error } = await supabase.from("news_articles").insert({
        title: article.title,
        url: article.url,
        source,
        content: content.substring(0, 5000),
        excerpt: aiResult.excerpt,
        category: aiResult.category,
        relevance_score: aiResult.relevance === "high" ? 90 : aiResult.relevance === "medium" ? 60 : 30,
        status: "pending",
        published_date: article.date || new Date().toISOString(),
      })

      if (error) {
        console.error(`[v0] Database error:`, error)
      } else {
        savedCount++
        console.log(`[v0] ✓ Saved to database: ${article.title}`)
      }

      // Delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return {
      success: true,
      message: `Processed ${processedCount} articles, saved ${savedCount} relevant articles`,
      processedCount,
      savedCount,
    }
  } catch (error: any) {
    console.error(`[v0] Crawl error for ${source}:`, error)
    throw error
  }
}

export async function getNewsArticles(options?: {
  status?: string
  limit?: number
  offset?: number
}): Promise<any[]> {
  const supabase = await createClient()

  let query = supabase.from("news_articles").select("*").order("created_at", { ascending: false })

  if (options?.status) {
    query = query.eq("status", options.status)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching news articles:", error)
    return []
  }

  return data || []
}

export async function updateArticleStatus(
  id: string,
  status: "pending" | "approved" | "rejected" | "published",
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("news_articles").update({ status }).eq("id", id)

  if (error) {
    console.error("[v0] Error updating article status:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
