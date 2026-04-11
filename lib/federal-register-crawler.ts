import { getSupabaseServerClient } from "./supabase-server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Federal Register API endpoints for FDA documents
const FEDERAL_REGISTER_API = "https://www.federalregister.gov/api/v1/documents.json"

// Categories to crawl
const FDA_SEARCH_TERMS = [
  { term: "cosmetic", category: "Cosmetics" },
  { term: "drug", category: "Drugs" },
  { term: "food", category: "Food" },
]

export interface FederalRegisterDocument {
  document_number: string
  title: string
  type: string
  abstract: string
  publication_date: string
  html_url: string
  pdf_url: string
  agencies: { name: string; raw_name: string }[]
  topics: string[]
  action: string
  dates: string
  effective_on: string | null
  comments_close_on: string | null
}

export interface FederalRegisterResponse {
  count: number
  results: FederalRegisterDocument[]
  next_page_url: string | null
}

/**
 * Fetch documents from Federal Register API
 */
async function fetchFederalRegisterDocuments(
  searchTerm: string,
  daysBack: number = 7
): Promise<FederalRegisterDocument[]> {
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - daysBack)
  const fromDateStr = fromDate.toISOString().split("T")[0]

  // Build API URL with parameters
  const params = new URLSearchParams({
    per_page: "25",
    order: "newest",
    "conditions[agencies][]": "food-and-drug-administration",
    "conditions[term]": searchTerm,
    "conditions[publication_date][gte]": fromDateStr,
  })

  const url = `${FEDERAL_REGISTER_API}?${params.toString()}`
  console.log(`[FederalRegister] Fetching: ${url}`)

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "VeximGlobal/1.0 (FDA Compliance Monitoring)",
      },
    })

    if (!response.ok) {
      throw new Error(`Federal Register API error: ${response.status} ${response.statusText}`)
    }

    const data: FederalRegisterResponse = await response.json()
    console.log(`[FederalRegister] Found ${data.count} documents for "${searchTerm}"`)

    return data.results || []
  } catch (error) {
    console.error(`[FederalRegister] Error fetching "${searchTerm}":`, error)
    return []
  }
}

/**
 * Analyze document with AI to generate Vietnamese summary
 */
async function analyzeDocumentWithAI(doc: FederalRegisterDocument, category: string) {
  const prompt = `
Bạn là chuyên gia pháp lý về FDA của Vexim Global. Phân tích tài liệu Federal Register sau và tạo tóm tắt bằng tiếng Việt:

TIÊU ĐỀ: ${doc.title}
LOẠI: ${doc.type}
NGÀY CÔNG BỐ: ${doc.publication_date}
${doc.action ? `HÀNH ĐỘNG: ${doc.action}` : ""}
${doc.dates ? `NGÀY QUAN TRỌNG: ${doc.dates}` : ""}
${doc.effective_on ? `HIỆU LỰC TỪ: ${doc.effective_on}` : ""}
${doc.comments_close_on ? `HẠN GÓP Ý: ${doc.comments_close_on}` : ""}

TÓM TẮT GỐC (TIẾNG ANH):
${doc.abstract || "Không có tóm tắt"}

CHỦ ĐỀ: ${doc.topics?.join(", ") || "Không có"}

---

Hãy trả về JSON với format:
{
  "summary_vi": "Tóm tắt ngắn gọn 2-3 câu bằng tiếng Việt, dễ hiểu cho doanh nghiệp xuất khẩu",
  "key_points": ["Điểm quan trọng 1", "Điểm quan trọng 2"],
  "impact_level": "high" | "medium" | "low",
  "affected_products": ["Sản phẩm bị ảnh hưởng"],
  "action_required": "Hành động cần thực hiện (nếu có)",
  "deadline": "Ngày deadline quan trọng (nếu có)",
  "relevance_score": 0-100,
  "keywords_vi": ["từ khóa tiếng Việt"]
}
`

  const hasOpenAIKey = !!process.env.OPENAI_API_KEY

  try {
    let result: string

    if (hasOpenAIKey) {
      console.log("[FederalRegister] Using OpenAI API for analysis...")
      const response = await generateText({
        model: openai("gpt-4o-mini"),
        prompt,
        temperature: 0.3,
      })
      result = response.text
    } else {
      console.log("[FederalRegister] Using Vercel AI Gateway...")
      const response = await generateText({
        model: "openai/gpt-4o-mini",
        prompt,
        temperature: 0.3,
      })
      result = response.text
    }

    // Parse JSON from response
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        ...parsed,
        category,
      }
    }
  } catch (error) {
    console.error("[FederalRegister] AI analysis error:", error)
  }

  // Fallback response
  return {
    summary_vi: doc.abstract
      ? `[Cần dịch] ${doc.abstract.substring(0, 200)}...`
      : `Tài liệu FDA về ${category.toLowerCase()}: ${doc.title}`,
    key_points: [],
    impact_level: "medium",
    affected_products: [],
    action_required: null,
    deadline: doc.comments_close_on || doc.effective_on || null,
    relevance_score: 60,
    keywords_vi: [category.toLowerCase()],
    category,
  }
}

/**
 * Main function to crawl Federal Register
 */
export async function crawlFederalRegister(daysBack: number = 7) {
  const supabase = await getSupabaseServerClient()

  // Create crawl log
  const { data: logData, error: logError } = await supabase
    .from("crawl_logs")
    .insert({
      source: "FEDERAL_REGISTER",
      status: "running",
    })
    .select()
    .single()

  if (logError) {
    console.error("[FederalRegister] Error creating crawl log:", logError)
    throw new Error("Failed to create crawl log")
  }

  const logId = logData.id
  let totalFound = 0
  let totalFiltered = 0

  try {
    // Crawl each category
    for (const { term, category } of FDA_SEARCH_TERMS) {
      console.log(`[FederalRegister] Crawling ${category} (term: "${term}")...`)

      const documents = await fetchFederalRegisterDocuments(term, daysBack)
      totalFound += documents.length

      for (const doc of documents) {
        // Check if document already exists
        const { data: existing } = await supabase
          .from("news_articles")
          .select("id")
          .eq("url", doc.html_url)
          .single()

        if (existing) {
          console.log(`[FederalRegister] Document already exists: ${doc.document_number}`)
          continue
        }

        // Analyze with AI
        const analysis = await analyzeDocumentWithAI(doc, category)

        // Only save documents with relevance score >= 50
        if (analysis.relevance_score >= 50) {
          const { error: insertError } = await supabase.from("news_articles").insert({
            source: "FEDERAL_REGISTER",
            title: doc.title,
            url: doc.html_url,
            published_date: doc.publication_date,
            content: doc.abstract || doc.title,
            summary: analysis.summary_vi,
            category: `FDA - ${category}`,
            relevance_score: analysis.relevance_score,
            filter_layer: "tier2",
            keywords: analysis.keywords_vi || [],
            status: "pending",
            raw_html: JSON.stringify({
              document_number: doc.document_number,
              type: doc.type,
              action: doc.action,
              dates: doc.dates,
              effective_on: doc.effective_on,
              comments_close_on: doc.comments_close_on,
              pdf_url: doc.pdf_url,
              topics: doc.topics,
              ai_analysis: analysis,
            }),
          })

          if (insertError) {
            console.error("[FederalRegister] Error inserting document:", insertError)
          } else {
            totalFiltered++
            console.log(`[FederalRegister] Added: ${doc.title.substring(0, 50)}... (Score: ${analysis.relevance_score})`)
          }
        } else {
          console.log(`[FederalRegister] Skipped (low relevance ${analysis.relevance_score}): ${doc.title.substring(0, 50)}...`)
        }

        // Rate limiting - wait between AI calls
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Wait between categories to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Update crawl log
    await supabase
      .from("crawl_logs")
      .update({
        completed_at: new Date().toISOString(),
        status: "completed",
        articles_found: totalFound,
        articles_filtered: totalFiltered,
      })
      .eq("id", logId)

    console.log(`[FederalRegister] Crawl completed: ${totalFiltered} added from ${totalFound} found`)

    return {
      success: true,
      source: "FEDERAL_REGISTER",
      articlesFound: totalFound,
      articlesFiltered: totalFiltered,
    }
  } catch (error: any) {
    console.error("[FederalRegister] Crawl error:", error)

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

/**
 * Get Federal Register articles with filters
 */
export async function getFederalRegisterArticles(filters?: {
  category?: string
  status?: string
  minRelevance?: number
  limit?: number
}) {
  const supabase = await getSupabaseServerClient()

  let query = supabase
    .from("news_articles")
    .select("*")
    .eq("source", "FEDERAL_REGISTER")
    .order("published_date", { ascending: false })

  if (filters?.category) {
    query = query.ilike("category", `%${filters.category}%`)
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
    console.error("[FederalRegister] Error fetching articles:", error)
    throw error
  }

  return data
}
