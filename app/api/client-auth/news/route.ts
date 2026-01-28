import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase-server"

// GET - Fetch FDA/GACC news relevant to client's registrations
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("client-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Decode token to get client_id
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    const clientId = payload.clientId

    const supabase = await createServerClient()

    // Get client's registrations to determine relevant categories
    const { data: registrations, error: regError } = await supabase
      .from("fda_registrations")
      .select("registration_type")
      .eq("client_id", clientId)

    if (regError) {
      console.error("[v0] Error fetching registrations:", regError)
      return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
    }

    // Map registration types to news categories
    const categories = new Set<string>()
    registrations?.forEach(reg => {
      if (reg.registration_type.includes("Food")) categories.add("Food")
      if (reg.registration_type.includes("Drug")) categories.add("Drugs")
      if (reg.registration_type.includes("Device")) categories.add("Medical Devices")
      if (reg.registration_type.includes("Cosmetic")) categories.add("Cosmetics")
    })

    // Fetch relevant published news
    let query = supabase
      .from("crawled_news")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(50)

    // Filter by categories if any
    if (categories.size > 0) {
      query = query.overlaps("categories", Array.from(categories))
    }

    const { data: news, error: newsError } = await query

    if (newsError) {
      console.error("[v0] Error fetching news:", newsError)
      return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
    }

    // Filter by relevance and add read status
    const relevantNews = (news || [])
      .filter(item => item.relevance === "high" || item.relevance === "medium")
      .map(item => ({
        id: item.id,
        source: item.source,
        title: item.title,
        summary: item.summary || item.title,
        articleUrl: item.article_url,
        publishedDate: item.published_date,
        relevance: item.relevance,
        categories: item.categories,
        aiAnalysis: item.ai_analysis,
        createdAt: item.created_at,
      }))

    return NextResponse.json({ news: relevantNews })
  } catch (error) {
    console.error("[v0] Error in client news API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
