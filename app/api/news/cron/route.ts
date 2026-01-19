import { crawlNews } from "@/lib/news-crawler-db"

export const maxDuration = 300

// Cron job endpoint - có thể setup với Vercel Cron hoặc external scheduler
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")

  // Simple auth check (trong production nên dùng proper auth)
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    console.log("[Cron] Daily news crawl started...")

    const [fdaResult, gaccResult] = await Promise.all([crawlNews("FDA"), crawlNews("GACC")])

    const totalFound = fdaResult.articlesFound + gaccResult.articlesFound
    const totalFiltered = fdaResult.articlesFiltered + gaccResult.articlesFiltered

    console.log(`[Cron] Crawl completed: ${totalFiltered} articles added from ${totalFound} found`)

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      fda: fdaResult,
      gacc: gaccResult,
      summary: {
        totalFound,
        totalFiltered,
      },
    })
  } catch (error: any) {
    console.error("[Cron] Error:", error)
    return Response.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
