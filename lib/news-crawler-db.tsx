import { getSupabaseServerClient } from "./supabase-server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface CrawlConfig {
  source: "FDA" | "GACC"
  url: string
  selectors: {
    container: string
    title: string
    link: string
    date?: string
    content?: string
  }
}

interface FilterKeywords {
  layer1_must: string[]
  layer2_should: string[]
  layer3_exclude: string[]
}

const FILTER_KEYWORDS: FilterKeywords = {
  layer1_must: [
    "thực phẩm",
    "food",
    "xuất khẩu",
    "export",
    "nhập khẩu",
    "import",
    "chứng nhận",
    "certification",
    "giấy phép",
    "license",
    "FDA",
    "GACC",
    "MFDS",
    "an toàn thực phẩm",
    "food safety",
    "quy định",
    "regulation",
    "tiêu chuẩn",
    "standard",
    "kiểm tra",
    "inspection",
    "hải quan",
    "customs",
  ],
  layer2_should: [
    "nông sản",
    "agricultural",
    "thủy sản",
    "seafood",
    "chế biến",
    "processed",
    "đóng gói",
    "packaging",
    "nhãn mác",
    "labeling",
    "Process Filing",
    "US Agent",
    "Prior Notice",
    "FSVP",
    "进口",
    "出口",
    "食品",
    "农产品",
    "水产品",
    "认证",
    "检验检疫",
    "备案",
  ],
  layer3_exclude: [
    "dược phẩm",
    "pharmaceutical",
    "thiết bị y tế",
    "medical device",
    "mỹ phẩm không liên quan thực phẩm",
    "cosmetics unrelated to food",
    "thú y không liên quan xuất nhập",
    "veterinary unrelated to export",
    "药品",
    "医疗器械",
    "化妆品",
  ],
}

const CRAWL_CONFIGS: CrawlConfig[] = [
  {
    source: "FDA",
    url: "https://www.fda.gov/news-events/fda-newsroom/press-announcements",
    selectors: {
      container: ".views-row",
      title: ".views-field-title a",
      link: ".views-field-title a",
      date: ".views-field-field-release-date",
    },
  },
  {
    source: "GACC",
    url: "http://www.customs.gov.cn/customs/302249/2480148/index.html",
    selectors: {
      container: ".news-list li",
      title: "a",
      link: "a",
      date: ".date",
    },
  },
]

export async function crawlNews(source: "FDA" | "GACC") {
  const supabase = await getSupabaseServerClient()

  // Create crawl log
  const { data: logData, error: logError } = await supabase
    .from("crawl_logs")
    .insert({
      source,
      status: "running",
    })
    .select()
    .single()

  if (logError) {
    console.error("[v0] Error creating crawl log:", logError)
    throw new Error("Failed to create crawl log")
  }

  const logId = logData.id

  try {
    const config = CRAWL_CONFIGS.find((c) => c.source === source)
    if (!config) {
      throw new Error(`No config found for source: ${source}`)
    }

    let response
    let lastError

    // Try multiple strategies for GACC
    const strategies =
      source === "GACC"
        ? [
            // Strategy 1: Full browser simulation
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "Accept-Encoding": "gzip, deflate",
                Connection: "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Cache-Control": "max-age=0",
                Referer: "http://www.customs.gov.cn/",
                Host: "www.customs.gov.cn",
              },
            },
            // Strategy 2: Simplified headers
            {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Accept: "text/html",
                "Accept-Language": "zh-CN",
              },
            },
            // Strategy 3: Minimal headers
            {
              headers: {
                "User-Agent": "Mozilla/5.0",
              },
            },
          ]
        : [
            // FDA - simple strategy
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              },
            },
          ]

    for (let i = 0; i < strategies.length; i++) {
      try {
        console.log(`[v0] Trying ${source} crawl strategy ${i + 1}/${strategies.length}...`)

        response = await fetch(config.url, {
          ...strategies[i],
          redirect: "follow",
        })

        if (response.ok) {
          console.log(`[v0] ${source} crawl successful with strategy ${i + 1}`)
          break
        } else {
          lastError = `Strategy ${i + 1} failed: ${response.status} ${response.statusText}`
          console.log(`[v0] ${lastError}`)
        }
      } catch (error: any) {
        lastError = `Strategy ${i + 1} error: ${error.message}`
        console.log(`[v0] ${lastError}`)
      }

      // Wait between retries
      if (i < strategies.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    if (!response || !response.ok) {
      throw new Error(`Failed to fetch ${source}: ${lastError}`)
    }

    const html = await response.text()
    console.log(`[v0] Fetched ${html.length} bytes from ${source}`)

    // Parse listing page to get article links
    const articles = await parseHTML(html, config)

    console.log(`[v0] Found ${articles.length} article links from ${source}`)

    let articlesFiltered = 0

    for (const article of articles) {
      // Check if article already exists
      const { data: existing } = await supabase.from("news_articles").select("id").eq("url", article.url).single()

      if (existing) {
        console.log(`[v0] Article already exists: ${article.title}`)
        continue
      }

      // Fetch full article content
      const fullArticle = await fetchArticleDetail(article, source)

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Apply AI filtering with full content
      const filterResult = await filterArticleWithAI(fullArticle)

      if (filterResult.isRelevant) {
        // Insert article into database
        const { error: insertError } = await supabase.from("news_articles").insert({
          source,
          title: fullArticle.title,
          url: fullArticle.url,
          published_date: fullArticle.publishedDate,
          content: fullArticle.content,
          summary: filterResult.summary,
          category: filterResult.category,
          relevance_score: filterResult.relevanceScore,
          filter_layer: filterResult.filterLayer,
          keywords: filterResult.keywords,
          status: "pending",
          raw_html: fullArticle.rawHtml,
        })

        if (insertError) {
          console.error("[v0] Error inserting article:", insertError)
        } else {
          articlesFiltered++
          console.log(`[v0] Added article: ${fullArticle.title} (${fullArticle.publishedDate})`)
        }
      } else {
        console.log(`[v0] Article filtered out: ${fullArticle.title} (Score: ${filterResult.relevanceScore})`)
      }
    }

    // Update crawl log
    await supabase
      .from("crawl_logs")
      .update({
        completed_at: new Date().toISOString(),
        status: "completed",
        articles_found: articles.length,
        articles_filtered: articlesFiltered,
      })
      .eq("id", logId)

    return {
      success: true,
      articlesFound: articles.length,
      articlesFiltered,
    }
  } catch (error: any) {
    // Update crawl log with error
    await supabase
      .from("crawl_logs")
      .update({
        completed_at: new Date().toISOString(),
        status: "failed",
        error_message: error.message,
      })
      .eq("id", logId)

    throw error
  }
}

async function parseHTML(html: string, config: CrawlConfig) {
  const articles: any[] = []

  try {
    if (config.source === "FDA") {
      // FDA structure: <div class="views-row"><h3><a href="/news...">Title</a></h3><time>Date</time></div>
      const rowRegex = /<div[^>]*class="[^"]*views-row[^"]*"[^>]*>([\s\S]*?)<\/div>/gi
      let rowMatch

      while ((rowMatch = rowRegex.exec(html)) !== null && articles.length < 20) {
        const rowHtml = rowMatch[1]

        // Extract link and title
        const linkMatch = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/i.exec(rowHtml)
        if (!linkMatch) continue

        let url = linkMatch[1]
        const title = linkMatch[2].trim()

        // Make URL absolute
        if (url.startsWith("/")) {
          url = "https://www.fda.gov" + url
        }

        // Extract date
        const dateMatch =
          /<time[^>]*datetime=["']([^"']+)["'][^>]*>/i.exec(rowHtml) ||
          /<div[^>]*class="[^"]*views-field-field-release-date[^"]*"[^>]*>([^<]+)<\/div>/i.exec(rowHtml)
        const publishedDate = dateMatch ? dateMatch[1].trim() : null

        articles.push({
          title,
          url,
          publishedDate: publishedDate || new Date().toISOString(),
          needsDetailFetch: true,
        })
      }
    } else if (config.source === "GACC") {
      // GACC structure: <li><span class="date">2024-01-15</span><a href="/path">Title</a></li>
      const itemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi
      let itemMatch

      while ((itemMatch = itemRegex.exec(html)) !== null && articles.length < 20) {
        const itemHtml = itemMatch[1]

        // Extract link and title
        const linkMatch = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/i.exec(itemHtml)
        if (!linkMatch) continue

        let url = linkMatch[1]
        const title = linkMatch[2].trim()

        // Make URL absolute
        if (url.startsWith("/")) {
          url = "http://www.customs.gov.cn" + url
        } else if (!url.startsWith("http")) {
          continue
        }

        // Extract date
        const dateMatch =
          /<span[^>]*class="[^"]*date[^"]*"[^>]*>([^<]+)<\/span>/i.exec(itemHtml) ||
          /(\d{4}[-/]\d{2}[-/]\d{2})/i.exec(itemHtml)
        const publishedDate = dateMatch ? dateMatch[1].trim() : null

        articles.push({
          title,
          url,
          publishedDate: publishedDate || new Date().toISOString(),
          needsDetailFetch: true,
        })
      }
    }

    console.log(`[v0] Parsed ${articles.length} article links from listing page`)
  } catch (error) {
    console.error("[v0] Error parsing HTML:", error)
  }

  return articles
}

async function fetchArticleDetail(article: any, source: "FDA" | "GACC") {
  try {
    console.log(`[v0] Fetching article detail: ${article.url}`)

    const headers =
      source === "GACC"
        ? {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            Referer: "http://www.customs.gov.cn/",
          }
        : {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          }

    const response = await fetch(article.url, { headers })

    if (!response.ok) {
      console.error(`[v0] Failed to fetch article: ${response.status}`)
      return article
    }

    const html = await response.text()

    // Extract main content based on source
    let content = ""
    const rawHtml = html.substring(0, 5000) // Store first 5000 chars for reference

    if (source === "FDA") {
      // Extract content from FDA article page
      const contentMatch = /<div[^>]*class="[^"]*article-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(html)
      if (contentMatch) {
        content = contentMatch[1]
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .substring(0, 2000)
      }

      // Try to get more accurate date
      const dateMatch = /<time[^>]*datetime=["']([^"']+)["'][^>]*>/i.exec(html)
      if (dateMatch) {
        article.publishedDate = dateMatch[1]
      }
    } else if (source === "GACC") {
      // Extract content from GACC article page
      const contentMatch =
        /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(html) ||
        /<div[^>]*id="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(html)

      if (contentMatch) {
        content = contentMatch[1]
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .substring(0, 2000)
      }

      // Try to get more accurate date
      const dateMatch = /发布时间[:：]\s*(\d{4}[-/]\d{2}[-/]\d{2})/i.exec(html)
      if (dateMatch) {
        article.publishedDate = dateMatch[1]
      }
    }

    return {
      ...article,
      content: content || article.title, // Fallback to title if no content found
      rawHtml,
    }
  } catch (error) {
    console.error(`[v0] Error fetching article detail:`, error)
    return article
  }
}

async function filterArticleWithAI(article: any) {
  const prompt = `
Phân tích bài viết sau và xác định mức độ liên quan đến xuất nhập khẩu thực phẩm:

Tiêu đề: ${article.title}
URL: ${article.url}

Quy tắc lọc 3 lớp:
- Lớp 1 (BẮT BUỘC): Phải chứa ít nhất 1 từ khóa về thực phẩm, xuất khẩu, nhập khẩu, FDA, GACC, MFDS, chứng nhận, an toàn thực phẩm
- Lớp 2 (NÊN CÓ): Nên có từ khóa về nông sản, thủy sản, chế biến, đóng gói, nhãn mác, Process Filing
- Lớp 3 (LOẠI TRỪ): Không được là dược phẩm, thiết bị y tế, mỹ phẩm không liên quan thực phẩm

Trả về JSON với:
{
  "isRelevant": boolean,
  "relevanceScore": 0-100,
  "filterLayer": "layer1" | "layer2" | "layer3",
  "keywords": string[],
  "category": string,
  "summary": string (tiếng Việt, 2-3 câu)
}
`

  const hasOpenAIKey = !!process.env.OPENAI_API_KEY

  try {
    let result

    if (hasOpenAIKey) {
      // Use OpenAI directly with API key
      console.log("[v0] Using OpenAI API with direct key...")
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt,
        temperature: 0.3,
      })
      result = text
    } else {
      // Try AI Gateway (requires credit card)
      console.log("[v0] Using Vercel AI Gateway...")
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt,
        temperature: 0.3,
      })
      result = text
    }

    // Parse JSON response
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsedResult = JSON.parse(jsonMatch[0])
      return parsedResult
    }
  } catch (error) {
    console.error("[v0] AI filtering error:", error)
    console.log("[v0] Falling back to keyword-based filtering...")
  }

  // Fallback to keyword matching
  return fallbackKeywordFilter(article)
}

function fallbackKeywordFilter(article: any) {
  const text = `${article.title} ${article.content}`.toLowerCase()

  // Layer 1: Must have at least one keyword
  const layer1Matches = FILTER_KEYWORDS.layer1_must.filter((kw) => text.includes(kw.toLowerCase()))

  if (layer1Matches.length === 0) {
    return {
      isRelevant: false,
      relevanceScore: 0,
      filterLayer: "layer1",
      keywords: [],
      category: "Không liên quan",
      summary: "Bài viết không chứa từ khóa bắt buộc về xuất nhập khẩu thực phẩm.",
    }
  }

  // Layer 3: Must not contain exclude keywords
  const layer3Matches = FILTER_KEYWORDS.layer3_exclude.filter((kw) => text.includes(kw.toLowerCase()))

  if (layer3Matches.length > 0) {
    return {
      isRelevant: false,
      relevanceScore: 20,
      filterLayer: "layer3",
      keywords: layer3Matches,
      category: "Loại trừ",
      summary: "Bài viết thuộc lĩnh vực loại trừ (dược phẩm, y tế).",
    }
  }

  // Layer 2: Should have keywords for higher relevance
  const layer2Matches = FILTER_KEYWORDS.layer2_should.filter((kw) => text.includes(kw.toLowerCase()))

  const relevanceScore = Math.min(100, 50 + layer2Matches.length * 10)

  return {
    isRelevant: true,
    relevanceScore,
    filterLayer: layer2Matches.length > 0 ? "layer2" : "layer1",
    keywords: [...layer1Matches, ...layer2Matches],
    category: "Xuất nhập khẩu thực phẩm",
    summary: `Bài viết liên quan đến ${layer1Matches.join(", ")}. Chứa ${layer1Matches.length + layer2Matches.length} từ khóa liên quan.`,
  }
}

export async function getNewsArticles(filters?: {
  source?: "FDA" | "GACC"
  status?: string
  minRelevance?: number
  limit?: number
}) {
  const supabase = await getSupabaseServerClient()

  let query = supabase.from("news_articles").select("*").order("published_date", { ascending: false })

  if (filters?.source) {
    query = query.eq("source", filters.source)
  }

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.minRelevance) {
    query = query.gte("relevance_score", filters.minRelevance)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching articles:", error)
    throw error
  }

  return data
}

export async function updateArticleStatus(articleId: string, status: "approved" | "rejected" | "published") {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("news_articles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", articleId)

  if (error) {
    console.error("[v0] Error updating article status:", error)
    throw error
  }
}
