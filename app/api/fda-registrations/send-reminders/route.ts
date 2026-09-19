import { NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { emailService } from "@/lib/email-service-zoho"
import {
  getFdaRenewalReminderHTML,
  getAgentRenewalReminderHTML,
} from "@/lib/email-fda-registration"

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

  const html = getFdaRenewalReminderHTML({
    companyName: registration.company_name,
    contactName: registration.contact_name,
    registrationType: registration.registration_type,
    registrationNumber: registration.registration_number,
    expirationDate: formattedDate,
    monthsBefore,
  })

  // Send to contact email
  if (registration.contact_email) {
    await emailService.sendEmail({ to: registration.contact_email, subject, html })
  }

  // Also send to company email if different
  if (registration.company_email && registration.company_email !== registration.contact_email) {
    await emailService.sendEmail({ to: registration.company_email, subject, html })
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

  const html = getAgentRenewalReminderHTML({
    companyName: registration.company_name,
    contactName: registration.contact_name,
    agentCompanyName: registration.agent_company_name,
    agentName: registration.agent_name,
    contractEndDate: formattedDate,
    contractYears: registration.agent_contract_years,
  })

  // Send to contact email
  if (registration.contact_email) {
    await emailService.sendEmail({ to: registration.contact_email, subject, html })
  }

  // Also send to company email if different
  if (registration.company_email && registration.company_email !== registration.contact_email) {
    await emailService.sendEmail({ to: registration.company_email, subject, html })
  }
}

// POST - Manual trigger for testing
export async function POST(request: Request) {
  return GET(request)
}
