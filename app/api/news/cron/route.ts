import { crawlNews } from "@/lib/news-crawler-db"
import { crawlFederalRegister } from "@/lib/federal-register-crawler"

export const maxDuration = 300

// Cron job endpoint - chạy tự động mỗi ngày
// Setup Vercel Cron trong vercel.json hoặc dùng external scheduler
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")

  // Simple auth check (trong production nên dùng proper auth)
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    console.log("[Cron] Daily news crawl started...")

    // Crawl all sources in parallel
    const results = await Promise.allSettled([
      crawlNews("FDA"),
      crawlNews("GACC"),
      crawlFederalRegister(1), // Chỉ lấy tin trong 1 ngày qua cho cron hàng ngày
    ])

    // Process results
    const fdaResult = results[0].status === "fulfilled" ? results[0].value : { articlesFound: 0, articlesFiltered: 0, error: results[0].reason?.message }
    const gaccResult = results[1].status === "fulfilled" ? results[1].value : { articlesFound: 0, articlesFiltered: 0, error: results[1].reason?.message }
    const federalRegisterResult = results[2].status === "fulfilled" ? results[2].value : { articlesFound: 0, articlesFiltered: 0, error: results[2].reason?.message }

    const totalFound = (fdaResult.articlesFound || 0) + (gaccResult.articlesFound || 0) + (federalRegisterResult.articlesFound || 0)
    const totalFiltered = (fdaResult.articlesFiltered || 0) + (gaccResult.articlesFiltered || 0) + (federalRegisterResult.articlesFiltered || 0)

    console.log(`[Cron] Crawl completed: ${totalFiltered} articles added from ${totalFound} found`)

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      fda: fdaResult,
      gacc: gaccResult,
      federalRegister: federalRegisterResult,
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
