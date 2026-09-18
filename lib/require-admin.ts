import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>

export type AdminAuthResult =
  | { ok: true; supabase: ServerSupabaseClient; email: string | null }
  | { ok: false; response: NextResponse }

/**
 * Kiểm tra người gọi API có phải admin không.
 *
 * Trước đây các API ghi dữ liệu blog (POST/PUT/DELETE bài viết, upload ảnh, AI)
 * dùng client anon mà KHÔNG kiểm tra đăng nhập — chỉ dựa vào RLS, trong khi RLS
 * lại cho mọi user `authenticated` quyền ghi.
 *
 * Cách dùng:
 *   const auth = await requireAdmin()
 *   if (!auth.ok) return auth.response
 *   const { supabase } = auth
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    }

    // Dùng select("*") giống layout admin để không phụ thuộc cấu trúc cột của admin_users
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .maybeSingle()

    if (error || !adminUser) {
      return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
    }

    return { ok: true, supabase, email: user.email }
  } catch (error) {
    console.error("[blog] Lỗi kiểm tra quyền admin:", error)
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }
}
