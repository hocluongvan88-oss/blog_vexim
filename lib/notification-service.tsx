import { createClient } from "@/lib/supabase/server"

export interface NotificationPayload {
  conversationId: string
  customerName: string
  message: string
  urgency: "high" | "medium" | "low"
  serviceTag?: string
  reason?: string
}

/**
 * Send browser push notification to admin
 */
export async function sendPushNotification(payload: NotificationPayload) {
  // Store notification in database for tracking
  const supabase = await createClient()
  
  await supabase.from("admin_notifications").insert({
    type: "new_conversation",
    conversation_id: payload.conversationId,
    title: `Khách hàng mới: ${payload.customerName}`,
    message: payload.message,
    urgency: payload.urgency,
    metadata: {
      service_tag: payload.serviceTag,
      reason: payload.reason,
    },
    is_read: false,
  })

  // Send Web Push notification via API
  try {
    const apiKey = process.env.INTERNAL_API_KEY || "vexim-internal-api-key"
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    
    await fetch(`${siteUrl}/api/notifications/send-push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        title: `🔔 Khách hàng mới: ${payload.customerName}`,
        body: payload.message,
        url: "/admin/conversations",
        conversationId: payload.conversationId,
        urgency: payload.urgency,
      }),
    })

    console.log("[v0] Push notification sent")
  } catch (error) {
    console.error("[v0] Error sending push notification:", error)
  }
}

/**
 * Send email notification to admin
 */
export async function sendEmailNotification(payload: NotificationPayload) {
  try {
    // Get admin emails from settings
    const supabase = await createClient()
    
    const { data: emailConfig, error } = await supabase
      .from("ai_config")
      .select("value")
      .eq("key", "admin_notification_emails")
      .maybeSingle()

    if (error) {
      console.error("[v0] Error fetching email config:", error)
      return
    }

    const adminEmails = (emailConfig?.value as string[]) || []
    
    if (adminEmails.length === 0) {
      console.log("[v0] No admin emails configured for notifications")
      return
    }

    // Use your email service (Resend, SendGrid, etc.)
    const emailBody = `
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🔔 Thông Báo Khách Hàng Mới</h2>
    </div>
    <div class="content">
      <p><strong>Khách hàng:</strong> ${payload.customerName}</p>
      <p><strong>Tin nhắn:</strong> ${payload.message}</p>
      ${payload.serviceTag ? `<p><strong>Dịch vụ:</strong> ${payload.serviceTag}</p>` : ""}
      ${payload.reason ? `<p><strong>Lý do chuyển:</strong> ${payload.reason}</p>` : ""}
      <p>
        <span class="badge badge-${payload.urgency}">
          ${payload.urgency === "high" ? "Khẩn cấp" : payload.urgency === "medium" ? "Trung bình" : "Thấp"}
        </span>
      </p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://vexim.vercel.app"}/admin/conversations?id=${payload.conversationId}" class="button">
        Xem Cuộc Hội Thoại
      </a>
    </div>
  </div>
</body>
</html>
    `

    // Send email using Resend (you need to add RESEND_API_KEY to env)
    if (process.env.RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Vexim Chat <notifications@vexim.com>",
          to: adminEmails,
          subject: `🔔 Khách hàng mới: ${payload.customerName}`,
          html: emailBody,
        }),
      })

      if (!response.ok) {
        throw new Error(`Email send failed: ${response.statusText}`)
      }

      console.log("[v0] Email notification sent to:", adminEmails)
    } else {
      console.log("[v0] RESEND_API_KEY not configured, skipping email notification")
    }
  } catch (error) {
    console.error("[v0] Error sending email notification:", error)
  }
}

/**
 * Notify admin about new handover conversation
 */
export async function notifyAdminNewHandover(payload: NotificationPayload) {
  // Send both push and email notifications
  await Promise.all([
    sendPushNotification(payload),
    sendEmailNotification(payload),
  ])
}
