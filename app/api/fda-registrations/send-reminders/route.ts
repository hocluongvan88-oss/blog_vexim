import { NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { emailService } from "@/lib/email-service-zoho"

// Cron job endpoint để gửi nhắc nhở gia hạn FDA và US Agent
// Chạy hàng ngày qua Vercel Cron
export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Starting FDA renewal reminders cron job")

    const supabase = createStaticClient()

    // Step 1: Generate reminders for upcoming renewals
    const { error: generateError } = await supabase.rpc("generate_fda_renewal_reminders")

    if (generateError) {
      console.error("[v0] Error generating reminders:", generateError)
      return NextResponse.json({ error: "Failed to generate reminders" }, { status: 500 })
    }

    // Step 2: Get pending reminders that need to be sent today
    const { data: pendingReminders, error: fetchError } = await supabase
      .from("fda_renewal_reminders")
      .select("*, fda_registrations(*)")
      .eq("status", "pending")
      .lte("reminder_date", new Date().toISOString().split("T")[0])

    if (fetchError) {
      console.error("[v0] Error fetching pending reminders:", fetchError)
      return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 })
    }

    if (!pendingReminders || pendingReminders.length === 0) {
      console.log("[v0] No pending reminders to send")
      return NextResponse.json({ message: "No reminders to send", sent: 0 })
    }

    console.log(`[v0] Found ${pendingReminders.length} pending reminders`)

    let successCount = 0
    let failCount = 0

    // Step 3: Send reminders
    for (const reminder of pendingReminders) {
      const registration = reminder.fda_registrations

      if (!registration) {
        console.warn(`[v0] Registration not found for reminder ${reminder.id}`)
        continue
      }

      try {
        // Determine reminder content based on type
        if (reminder.reminder_type === "fda_renewal") {
          await sendFdaRenewalReminder(registration, reminder.months_before)
        } else if (reminder.reminder_type === "agent_renewal") {
          await sendAgentRenewalReminder(registration)
        }

        // Mark as sent
        await supabase
          .from("fda_renewal_reminders")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", reminder.id)

        successCount++
        console.log(`[v0] Sent reminder for ${registration.company_name}`)
      } catch (error) {
        console.error(`[v0] Error sending reminder for ${registration.company_name}:`, error)

        // Mark as failed
        await supabase
          .from("fda_renewal_reminders")
          .update({
            status: "failed",
            error_message: error instanceof Error ? error.message : "Unknown error",
          })
          .eq("id", reminder.id)

        failCount++
      }
    }

    console.log(`[v0] FDA reminders cron job completed: ${successCount} sent, ${failCount} failed`)

    return NextResponse.json({
      message: "Reminders processed",
      sent: successCount,
      failed: failCount,
      total: pendingReminders.length,
    })
  } catch (error) {
    console.error("[v0] Error in FDA reminders cron job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Send FDA renewal reminder email
async function sendFdaRenewalReminder(registration: any, monthsBefore: number) {
  const expirationDate = new Date(registration.expiration_date)
  const formattedDate = expirationDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const subject = `[Nhắc nhở] Đăng ký FDA của ${registration.company_name} sắp hết hạn`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .info-table td:first-child { font-weight: bold; width: 40%; }
        .btn { display: inline-block; background: #2563eb; color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">⚠️ Nhắc nhở gia hạn FDA</h1>
        </div>
        <div class="content">
          <p>Kính gửi <strong>${registration.contact_name}</strong>,</p>
          
          <div class="alert-box">
            <strong>⏰ Thông báo quan trọng:</strong><br>
            Đăng ký FDA của công ty <strong>${registration.company_name}</strong> sẽ hết hạn trong <strong>${monthsBefore} tháng</strong>.
          </div>
          
          <p>Để đảm bảo hoạt động kinh doanh không bị gián đoạn, vui lòng chuẩn bị thủ tục gia hạn.</p>
          
          <table class="info-table">
            <tr>
              <td>Công ty:</td>
              <td>${registration.company_name}</td>
            </tr>
            <tr>
              <td>Loại đăng ký:</td>
              <td>${registration.registration_type}</td>
            </tr>
            <tr>
              <td>Số đăng ký FDA:</td>
              <td>${registration.registration_number || "Chưa có"}</td>
            </tr>
            <tr>
              <td>Ngày hết hạn:</td>
              <td><strong style="color: #dc2626;">${formattedDate}</strong></td>
            </tr>
          </table>
          
          <h3>📋 Thông tin liên hệ của chúng tôi:</h3>
          <ul>
            <li><strong>Hotline:</strong> 0373 685 634</li>
            <li><strong>Email:</strong> contact@veximglobal.com</li>
            <li><strong>Website:</strong> <a href="https://www.veximglobal.com">www.veximglobal.com</a></li>
          </ul>
          
          <p>Vexim Global sẽ hỗ trợ bạn hoàn tất thủ tục gia hạn nhanh chóng và thuận tiện.</p>
          
          <a href="https://www.veximglobal.com/services/fda" class="btn">Liên hệ gia hạn ngay →</a>
        </div>
        
        <div class="footer">
          <p>Email này được gửi tự động từ hệ thống quản lý của Vexim Global</p>
          <p>&copy; 2024 Vexim Global. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  // Send to contact email
  if (registration.contact_email) {
    await emailService.sendEmail(registration.contact_email, subject, html)
  }

  // Also send to company email if different
  if (registration.company_email && registration.company_email !== registration.contact_email) {
    await emailService.sendEmail(registration.company_email, subject, html)
  }
}

// Send US Agent renewal reminder email
async function sendAgentRenewalReminder(registration: any) {
  const endDate = new Date(registration.agent_contract_end_date)
  const formattedDate = endDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const subject = `[Nhắc nhở] Hợp đồng US Agent của ${registration.company_name} sắp hết hạn`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        .info-table td:first-child { font-weight: bold; width: 40%; }
        .btn { display: inline-block; background: #2563eb; color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">⚠️ Nhắc nhở gia hạn US Agent</h1>
        </div>
        <div class="content">
          <p>Kính gửi <strong>${registration.contact_name}</strong>,</p>
          
          <div class="alert-box">
            <strong>⏰ Thông báo quan trọng:</strong><br>
            Hợp đồng US Agent của công ty <strong>${registration.company_name}</strong> sẽ hết hạn vào <strong>${formattedDate}</strong>.
          </div>
          
          <p>US Agent là yêu cầu bắt buộc đối với đăng ký FDA. Vui lòng gia hạn hợp đồng để tránh gián đoạn.</p>
          
          <table class="info-table">
            <tr>
              <td>Công ty:</td>
              <td>${registration.company_name}</td>
            </tr>
            <tr>
              <td>US Agent hiện tại:</td>
              <td>${registration.agent_company_name || "Không có thông tin"}</td>
            </tr>
            <tr>
              <td>Người liên hệ Agent:</td>
              <td>${registration.agent_name || "Không có thông tin"}</td>
            </tr>
            <tr>
              <td>Ngày hết hạn hợp đồng:</td>
              <td><strong style="color: #dc2626;">${formattedDate}</strong></td>
            </tr>
            ${
              registration.agent_contract_years
                ? `<tr>
              <td>Thời hạn hợp đồng:</td>
              <td>${registration.agent_contract_years} năm</td>
            </tr>`
                : ""
            }
          </table>
          
          <h3>📋 Liên hệ Vexim Global để gia hạn:</h3>
          <ul>
            <li><strong>Hotline:</strong> 0373 685 634</li>
            <li><strong>Email:</strong> contact@veximglobal.com</li>
            <li><strong>Website:</strong> <a href="https://www.veximglobal.com">www.veximglobal.com</a></li>
          </ul>
          
          <p>Chúng tôi cung cấp dịch v��� US Agent uy tín với mức giá cạnh tranh.</p>
          
          <a href="https://www.veximglobal.com/services/us-agent" class="btn">Gia hạn US Agent ngay →</a>
        </div>
        
        <div class="footer">
          <p>Email này được gửi tự động từ hệ thống quản lý của Vexim Global</p>
          <p>&copy; 2024 Vexim Global. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  // Send to contact email
  if (registration.contact_email) {
    await emailService.sendEmail(registration.contact_email, subject, html)
  }

  // Also send to company email if different
  if (registration.company_email && registration.company_email !== registration.contact_email) {
    await emailService.sendEmail(registration.company_email, subject, html)
  }
}

// POST - Manual trigger for testing
export async function POST(request: Request) {
  return GET(request)
}
