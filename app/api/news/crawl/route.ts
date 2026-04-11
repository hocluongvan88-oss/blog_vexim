import { crawlNews } from "@/lib/news-crawler-db"
import { crawlFederalRegister } from "@/lib/federal-register-crawler"

export const maxDuration = 300 // 5 minutes for crawling

export async function POST(req: Request) {
  try {
    const { source, daysBack } = await req.json()

    console.log(`[v0] Starting crawl for ${source || "all"} sources...`)

    const results = []

    // Crawl FDA (old source)
    if (!source || source === "FDA") {
      console.log("[v0] Crawling FDA news...")
      try {
        const fdaResult = await crawlNews("FDA")
        results.push({ source: "FDA", ...fdaResult })
      } catch (error: any) {
        console.error("[v0] FDA crawl error:", error)
        results.push({ source: "FDA", success: false, error: error.message })
      }
    }

    // Crawl GACC
    if (!source || source === "GACC") {
      console.log("[v0] Crawling GACC news...")
      try {
        const gaccResult = await crawlNews("GACC")
        results.push({ source: "GACC", ...gaccResult })
      } catch (error: any) {
        console.error("[v0] GACC crawl error:", error)
        results.push({ source: "GACC", success: false, error: error.message })
      }
    }

    // Crawl Federal Register (FDA - Cosmetics, Drugs, Food)
    if (!source || source === "FEDERAL_REGISTER") {
      console.log("[v0] Crawling Federal Register (Cosmetics, Drugs, Food)...")
      try {
        const frResult = await crawlFederalRegister(daysBack || 7)
        results.push(frResult)
      } catch (error: any) {
        console.error("[v0] Federal Register crawl error:", error)
        results.push({ source: "FEDERAL_REGISTER", success: false, error: error.message })
      }
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
