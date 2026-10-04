import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Lưu đăng ký Web Push của admin.
 *
 * Trước đây `hooks/use-push-notification.ts` gọi `/api/notifications/subscribe`
 * nhưng route này KHÔNG tồn tại → trả 404 → bảng `push_subscriptions` luôn rỗng
 * → `/api/notifications/send-push` không có người nhận → admin không bao giờ
 * nhận được thông báo đẩy khi có khách đang chờ.
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

    const subscription = await request.json()

    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Subscription không hợp lệ (thiếu endpoint)" }, { status: 400 })
    }

    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id: user.id,
        endpoint: subscription.endpoint,
        subscription,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )

    if (error) {
      console.error("[push] Không lưu được đăng ký push:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[push] Lỗi xử lý đăng ký push:", error)
    return NextResponse.json({ error: "Không thể lưu đăng ký push" }, { status: 500 })
  }
}
