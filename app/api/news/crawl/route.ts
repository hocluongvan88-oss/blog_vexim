import { crawlNews } from "@/lib/news-crawler-db"

export const maxDuration = 300 // 5 minutes for crawling

export async function POST(req: Request) {
  try {
    const { source } = await req.json()

    console.log(`[v0] Starting crawl for ${source || "all"} sources...`)

    const results = []

    // Crawl FDA
    if (!source || source === "FDA") {
      console.log("[v0] Crawling FDA news...")
      const fdaResult = await crawlNews("FDA")
      results.push({ source: "FDA", ...fdaResult })
    }

    // Crawl GACC
    if (!source || source === "GACC") {
      console.log("[v0] Crawling GACC news...")
      const gaccResult = await crawlNews("GACC")
      results.push({ source: "GACC", ...gaccResult })
    }

    return Response.json({
      success: true,
      results,
    })
  } catch (error: any) {
    console.error("[v0] Crawl error:", error)
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
