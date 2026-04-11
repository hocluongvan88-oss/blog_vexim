import { getNewsArticles } from "@/lib/news-crawler-db"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const source = searchParams.get("source") as "FDA" | "GACC" | "FEDERAL_REGISTER" | undefined
    const status = searchParams.get("status") || undefined
    const minRelevance = searchParams.get("minRelevance")
      ? Number.parseInt(searchParams.get("minRelevance")!)
      : undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50

    // Use direct Supabase query to support all sources
    const supabase = await getSupabaseServerClient()
    
    let query = supabase
      .from("news_articles")
      .select("*")
      .order("published_date", { ascending: false })

    if (source) {
      query = query.eq("source_name", source)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (minRelevance) {
      query = query.gte("relevance_score", minRelevance)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data: articles, error } = await query

    if (error) {
      throw error
    }

    return Response.json({
      success: true,
      count: articles?.length || 0,
      articles: articles || [],
    })
  } catch (error: any) {
    console.error("[v0] Error fetching articles:", error)
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
