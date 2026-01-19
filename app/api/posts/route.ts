import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams

  const category = searchParams.get("category")
  const status = searchParams.get("status") || "published"

  let query = supabase.from("posts").select("*").eq("status", status).order("published_at", { ascending: false })

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  // Tự động generate slug từ title nếu chưa có
  if (!body.slug && body.title) {
    body.slug = body.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // Set published_at nếu status là published
  if (body.status === "published" && !body.published_at) {
    body.published_at = new Date().toISOString()
  }

  const { data, error } = await supabase.from("posts").insert(body).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
