import { createClient } from "@/lib/supabase/server"
import { emailService } from "@/lib/email-service-zoho"

/**
 * Loại thông báo gửi cho admin.
 * - `handover`: khách cần chuyên viên (rule engine chuyển người)
 * - `new_lead`: khách để lại thông tin liên hệ (ASK_CONTACT)
 * - `zalo_message`: khách nhắn trên Zalo khi hội thoại đã ở chế độ chuyên viên
 */
export type AdminNotificationType = "handover" | "new_lead" | "zalo_message"

export interface NotificationPayload {
  conversationId: string
  customerName: string
  message: string
  urgency: "high" | "medium" | "low"
  serviceTag?: string
  reason?: string
  /** Mặc định `handover` để tương thích với các lời gọi cũ. */
  type?: AdminNotificationType
  /** Kênh khách đến: website / facebook / zalo */
  channel?: string
}

const TYPE_LABELS: Record<AdminNotificationType, string> = {
  handover: "Khách cần chuyên viên",
  new_lead: "Khách để lại liên hệ",
  zalo_message: "Tin nhắn Zalo mới",
}

const TYPE_ICONS: Record<AdminNotificationType, string> = {
  handover: "🔔",
  new_lead: "📇",
  zalo_message: "💬",
}

/**
 * Xây dựng nội dung email thông báo cho admin.
 */
function buildEmailHtml(payload: NotificationPayload, siteUrl: string): string {
  const type: AdminNotificationType = payload.type || "handover"
  const urgencyLabel =
    payload.urgency === "high" ? "Khẩn cấp" : payload.urgency === "medium" ? "Trung bình" : "Thấp"

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f97316; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .badge-high { background: #fee2e2; color: #dc2626; }
    .badge-medium { background: #fef3c7; color: #d97706; }
    .badge-low { background: #dbeafe; color: #2563eb; }
    .button { display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .quote { background: #fff; border-left: 4px solid #f97316; padding: 12px 16px; margin: 12px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>${TYPE_ICONS[type]} ${TYPE_LABELS[type]}</h2>
    </div>
    <div class="content">
      <p><strong>Khách hàng:</strong> ${payload.customerName}</p>
      ${payload.channel ? `<p><strong>Kênh:</strong> ${payload.channel}</p>` : ""}
      ${payload.serviceTag ? `<p><strong>Dịch vụ quan tâm:</strong> ${payload.serviceTag}</p>` : ""}
      ${payload.reason ? `<p><strong>Lý do chuyển:</strong> ${payload.reason}</p>` : ""}
      <div class="quote"><strong>Tin nhắn:</strong><br />${payload.message}</div>
      <p>
        <span class="badge badge-${payload.urgency}">${urgencyLabel}</span>
      </p>
      <a href="${siteUrl}/admin/conversations?id=${payload.conversationId}" class="button">
        Trả lời ngay
      </a>
      <p style="color:#6b7280;font-size:12px;margin-top:16px">
        Khách thường rời đi nếu không được phản hồi trong vài phút — hãy trả lời sớm nhất có thể.
      </p>
    </div>
  </div>
</body>
</html>`
}

/**
 * Lưu thông báo vào DB (hiển thị ở chuông thông báo trong trang admin).
 *
 * Ghi DB là bước quan trọng nhất vì nó KHÔNG phụ thuộc dịch vụ ngoài:
 * dù email/push có lỗi thì admin vẫn thấy thông báo khi mở trang quản trị.
 */
export async function saveAdminNotification(payload: NotificationPayload): Promise<void> {
  try {
    const supabase = await createClient()
    const type: AdminNotificationType = payload.type || "handover"

    const { error } = await supabase.from("admin_notifications").insert({
      type,
      conversation_id: payload.conversationId,
      title: `${TYPE_ICONS[type]} ${TYPE_LABELS[type]}: ${payload.customerName}`,
      message: payload.message,
      urgency: payload.urgency,
      metadata: {
        service_tag: payload.serviceTag,
        reason: payload.reason,
        channel: payload.channel,
      },
      is_read: false,
    })

    if (error) console.error("[admin-notify] Không lưu được thông báo:", error.message)
  } catch (error) {
    console.error("[admin-notify] Lỗi lưu thông báo:", error)
  }
}

/**
 * Gửi email thông báo cho admin qua Zoho SMTP (dịch vụ email của hệ thống).
 *
 * LƯU Ý: trước đây hàm này dùng Resend (`RESEND_API_KEY`), nhưng toàn bộ dự án
 * gửi email bằng Zoho SMTP nên biến đó không bao giờ tồn tại → thông báo bị bỏ qua
 * âm thầm và admin không hề biết có khách đang chờ.
 */
export async function sendEmailNotification(payload: NotificationPayload): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { data: emailConfig, error } = await supabase
      .from("ai_config")
      .select("value")
      .eq("key", "admin_notification_emails")
      .maybeSingle()

    if (error) {
      console.error("[admin-notify] Không đọc được cấu hình email admin:", error.message)
      return false
    }

    const adminEmails = Array.isArray(emailConfig?.value) ? (emailConfig?.value as string[]) : []

    if (adminEmails.length === 0) {
      console.warn(
        "[admin-notify] Chưa cấu hình email nhận thông báo. Vào Admin → Cài đặt → Thông báo để thêm email.",
      )
      return false
    }

    const type: AdminNotificationType = payload.type || "handover"
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.veximglobal.com"

    const sent = await emailService.sendEmail({
      to: adminEmails.join(", "),
      subject: `${TYPE_ICONS[type]} ${TYPE_LABELS[type]}: ${payload.customerName}${
        payload.serviceTag ? ` — ${payload.serviceTag}` : ""
      }`,
      html: buildEmailHtml(payload, siteUrl),
    })

    console.log(`[admin-notify] Email thông báo ${type} tới ${adminEmails.length} admin:`, sent ? "OK" : "THẤT BẠI")
    return sent
  } catch (error) {
    console.error("[admin-notify] Lỗi gửi email thông báo:", error)
    return false
  }
}

/**
 * Gửi Web Push tới các thiết bị đã đăng ký (điện thoại admin).
 */
export async function sendPushNotification(payload: NotificationPayload): Promise<void> {
  try {
    const type: AdminNotificationType = payload.type || "handover"
    const apiKey = process.env.INTERNAL_API_KEY || "vexim-internal-api-key"
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const response = await fetch(`${siteUrl}/api/notifications/send-push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        title: `${TYPE_ICONS[type]} ${TYPE_LABELS[type]}: ${payload.customerName}`,
        body: payload.message,
        url: "/admin/conversations",
        conversationId: payload.conversationId,
        urgency: payload.urgency,
      }),
    })

    if (!response.ok) {
      console.warn("[admin-notify] Push không gửi được (mã lỗi):", response.status)
      return
    }

    console.log("[admin-notify] Đã gửi push notification")
  } catch (error) {
    console.error("[admin-notify] Lỗi gửi push:", error)
  }
}

/**
 * Thông báo cho admin về một sự kiện của khách hàng.
 *
 * Chạy song song 3 kênh độc lập và KHÔNG dùng `Promise.all` trực tiếp để một kênh
 * lỗi cũng không kéo theo kênh khác:
 *  1. Lưu vào DB  → hiện ở chuông thông báo trong trang admin (luôn hoạt động)
 *  2. Email Zoho  → admin nhận được trên điện thoại dù không mở web
 *  3. Web Push    → thông báo trình duyệt (nếu đã đăng ký)
 */
export async function notifyAdmin(payload: NotificationPayload): Promise<void> {
  const results = await Promise.allSettled([
    saveAdminNotification(payload),
    sendEmailNotification(payload),
    sendPushNotification(payload),
  ])

  const failed = results.filter((r) => r.status === "rejected").length
  if (failed > 0) {
    console.warn(`[admin-notify] ${failed}/3 kênh thông báo gặp lỗi (các kênh còn lại vẫn đã gửi).`)
  }
}

/** Giữ tên cũ để không phải sửa các lời gọi hiện có. */
export async function notifyAdminNewHandover(payload: NotificationPayload): Promise<void> {
  await notifyAdmin({ ...payload, type: payload.type || "handover" })
}
