import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/require-admin"
import { buildPostPayload, ensureUniqueSlug, POST_LIST_COLUMNS, slugify } from "@/lib/post-payload"
import { type NextRequest, NextResponse } from "next/server"

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 50

/** GET /api/posts — danh sách bài viết công khai (chỉ bài đã publish trừ khi là admin). */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams

  const category = searchParams.get("category")
  const requestedStatus = searchParams.get("status")

  // Chỉ admin mới được xem bản nháp
  const auth = requestedStatus && requestedStatus !== "published" ? await requireAdmin() : null
  const status = auth?.ok ? requestedStatus || "published" : "published"

  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || DEFAULT_LIMIT, 1), MAX_LIMIT)
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0)
  const includeContent = searchParams.get("include_content") === "1"

  let query = supabase
    .from("posts")
    .select(includeContent ? `${POST_LIST_COLUMNS}, content` : POST_LIST_COLUMNS)
    .eq("status", status)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

/** POST /api/posts — tạo bài viết mới (chỉ admin). */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response
  const { supabase } = auth

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Payload không hợp lệ" }, { status: 400 })
  }

  const { payload, errors, plainTextLength } = buildPostPayload(body)
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(". ") }, { status: 400 })
  }

  // Xuất bản thì cần nội dung thực sự (tránh đăng bài rỗng)
  if (payload.status === "published" && plainTextLength < 50) {
    return NextResponse.json(
      { error: "Nội dung quá ngắn để xuất bản (cần tối thiểu 50 ký tự)" },
      { status: 400 },
    )
  }

  const baseSlug = (payload.slug as string) || slugify(payload.title as string)
  payload.slug = await ensureUniqueSlug(supabase, baseSlug)

  if (payload.status === "published" && !payload.published_at) {
    payload.published_at = new Date().toISOString()
  }

  const { data, error } = await supabase.from("posts").insert(payload).select().single()

  if (error) {
    console.error("[blog] Lỗi tạo bài viết:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
