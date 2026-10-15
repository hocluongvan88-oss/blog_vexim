import { createServerClient } from "@/lib/supabase-server"
import { SITE_URL } from "@/lib/business-profile"
import { emailButton, emailDetails, emailParagraph as p, renderEmail } from "@/lib/email-layout"

/** Keep the page opened from the email consistent with the email itself. */
function verificationPage(title: string, body: string, status: number): Response {
  return new Response(renderEmail({
    title,
    preheader: title,
    body: body + emailButton("Quay lại FDA Tracker", `${SITE_URL}/fda-tracker`),
  }), {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    },
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const token = searchParams.get("token")
    if (!email || !token) {
      return verificationPage("Liên kết xác nhận không hợp lệ", p("Vui lòng mở đầy đủ liên kết xác nhận trong email hoặc quay lại FDA Tracker để đăng ký."), 400)
    }

    const supabase = await createServerClient()
    const { data: subscription, error } = await supabase
      .from("fda_subscriptions")
      .select("*")
      .eq("email", email)
      .eq("verification_token", token)
      .gt("token_expires_at", new Date().toISOString())
      .single()

    if (error || !subscription) {
      return verificationPage("Không tìm thấy đăng ký hợp lệ", p("Liên kết có thể đã hết hạn hoặc không còn hiệu lực. Vui lòng quay lại FDA Tracker và đăng ký lại để nhận email xác nhận mới."), 404)
    }
    if (subscription.is_active === false) {
      return verificationPage("Đăng ký này đã được hủy", p("Đăng ký cảnh báo này hiện không hoạt động. Liên kết xác nhận không tự kích hoạt lại đăng ký đã hủy."), 200)
    }
    if (subscription.verified) {
      return verificationPage("Email đã được xác nhận", emailDetails([["Email đăng ký", email]]) + p("Email đã được xác nhận trước đó. Bạn không cần thực hiện lại bước này."), 200)
    }

    const { error: updateError } = await supabase.from("fda_subscriptions").update({
      verified: true,
      updated_at: new Date().toISOString(),
    }).eq("id", subscription.id)
    if (updateError) throw updateError

    const frequency = subscription.frequency === "daily" ? "Hàng ngày" : subscription.frequency === "weekly" ? "Hàng tuần" : "Khi có cảnh báo phù hợp"
    const categoryLabels: Record<string, string> = { food: "Thực phẩm", drug: "Dược phẩm", cosmetics: "Mỹ phẩm", device: "Thiết bị y tế" }
    const categories = Array.isArray(subscription.categories) ? subscription.categories.map((value: string) => categoryLabels[value] ?? value).join(", ") : ""
    return verificationPage("Xác nhận email thành công", p("Cảm ơn bạn đã xác nhận. FDA Tracker sẽ gửi thông báo theo nhóm sản phẩm và tần suất bạn đã chọn khi có cảnh báo phù hợp.") +
      emailDetails([["Email đăng ký", email], ["Tần suất", frequency], ["Nhóm sản phẩm", categories]]) +
      p("Bạn có thể hủy nhận thông báo bằng liên kết ở cuối các email cảnh báo."), 200)
  } catch (error) {
    console.error("[v0] Error in verification endpoint:", error)
    return verificationPage("Chưa thể xác nhận email", p("Hệ thống đang gặp lỗi. Vui lòng thử mở lại liên kết sau ít phút."), 500)
  }
}
