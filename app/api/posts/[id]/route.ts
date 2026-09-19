import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/require-admin"
import {
  buildPostPayload,
  ensureUniqueSlug,
  POST_DETAIL_COLUMNS,
  POST_LIST_COLUMNS,
  slugify,
} from "@/lib/post-payload"
import { type NextRequest, NextResponse } from "next/server"

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

/** GET /api/posts/[id] — chi tiết bài viết. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  if (!isValidUuid(id)) {
    return NextResponse.json({ error: "ID bài viết không hợp lệ" }, { status: 400 })
  }

  // Bản nháp chỉ admin đọc được
  const auth = await requireAdmin()
  const columns = auth.ok ? POST_DETAIL_COLUMNS : POST_LIST_COLUMNS

  let query = supabase.from("posts").select(columns).eq("id", id)

  if (!auth.ok) {
    query = query.eq("status", "published")
  }

  const { data, error } = await query.maybeSingle()

  if (error) {
    console.error("[blog] Lỗi đọc bài viết:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 })
  }

  return NextResponse.json(data)
}

/** PUT /api/posts/[id] — cập nhật bài viết (chỉ admin). */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response
  const { supabase } = auth

  const { id } = await params
  if (!isValidUuid(id)) {
    return NextResponse.json({ error: "ID bài viết không hợp lệ" }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Payload không hợp lệ" }, { status: 400 })
  }

  // Lấy bài viết hiện tại để biết trạng thái / slug / ngày publish
  const { data: existing, error: existingError } = await supabase
    .from("posts")
    .select("id, slug, status, published_at, title")
    .eq("id", id)
    .maybeSingle()

  if (existingError) {
    console.error("[blog] Lỗi đọc bài viết trước khi cập nhật:", existingError)
    return NextResponse.json({ error: existingError.message }, { status: 500 })
  }

  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 })
  }

  const { payload, errors, plainTextLength } = buildPostPayload(body, { partial: true })
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(". ") }, { status: 400 })
  }

  if (payload.status === "published" && Object.prototype.hasOwnProperty.call(body, "content") && plainTextLength < 50) {
    return NextResponse.json(
      { error: "Nội dung quá ngắn để xuất bản (cần tối thiểu 50 ký tự)" },
      { status: 400 },
    )
  }

  // Slug: giữ nguyên nếu client không gửi, đảm bảo không trùng nếu có gửi
  if (payload.slug) {
    payload.slug = await ensureUniqueSlug(supabase, payload.slug as string, id)
  } else if (!existing.slug) {
    payload.slug = await ensureUniqueSlug(supabase, slugify((payload.title as string) || existing.title || ""), id)
  }

  // Chuyển draft -> published thì set published_at (giữ ngày cũ nếu đã publish trước đó)
  if (payload.status === "published" && !existing.published_at) {
    payload.published_at = new Date().toISOString()
  }

  const { data, error } = await supabase.from("posts").update(payload).eq("id", id).select().single()

  if (error) {
    console.error("[blog] Lỗi cập nhật bài viết:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

/** DELETE /api/posts/[id] — xoá bài viết (chỉ admin). */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response
  const { supabase } = auth

  const { id } = await params
  if (!isValidUuid(id)) {
    return NextResponse.json({ error: "ID bài viết không hợp lệ" }, { status: 400 })
  }

  const { error } = await supabase.from("posts").delete().eq("id", id)

  if (error) {
    console.error("[blog] Lỗi xoá bài viết:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
