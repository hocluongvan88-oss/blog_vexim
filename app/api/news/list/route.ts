import { getNewsArticles } from "@/lib/news-crawler-db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const source = searchParams.get("source") as "FDA" | "GACC" | undefined
    const status = searchParams.get("status") || undefined
    const minRelevance = searchParams.get("minRelevance")
      ? Number.parseInt(searchParams.get("minRelevance")!)
      : undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50

    const articles = await getNewsArticles({
      source,
      status,
      minRelevance,
      limit,
    })

    return Response.json({
      success: true,
      count: articles.length,
      articles,
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
