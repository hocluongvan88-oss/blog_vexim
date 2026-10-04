import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Huỷ đăng ký Web Push của admin (được gọi từ `usePushNotification.unsubscribeFromPush`).
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { endpoint } = await request.json().catch(() => ({ endpoint: undefined }))

    let query = supabase.from("push_subscriptions").delete().eq("user_id", user.id)
    if (endpoint) query = query.eq("endpoint", endpoint)

    const { error } = await query

    if (error) {
      console.error("[push] Không huỷ được đăng ký push:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[push] Lỗi xử lý huỷ đăng ký push:", error)
    return NextResponse.json({ error: "Không thể huỷ đăng ký push" }, { status: 500 })
  }
}
