import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, excerpt, slug, category, featured_image")
    .eq("status", "published")
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
    .order("published_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Search error:", error)
    return NextResponse.json({ results: [] })
  }

  return NextResponse.json({ results: posts || [] })
}
