import { NextResponse } from "next/server"
import { emailService } from "@/lib/email-service-zoho"
import { createServerClient } from "@/lib/supabase-server"

// This endpoint should be called by a cron job
// Vercel Cron or external service like cron-job.org

export async function GET(request: Request) {
  const startTime = Date.now()
  let emailsSent = 0
  let jobId: string | null = null

  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || "your-secret-key"

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const frequency = searchParams.get("frequency") as "daily" | "weekly" | null

    if (!frequency || (frequency !== "daily" && frequency !== "weekly")) {
      return NextResponse.json({ error: "Invalid frequency parameter. Must be 'daily' or 'weekly'" }, { status: 400 })
    }

    console.log(`[v0] Starting ${frequency} FDA alert digest...`)

    // Log job start to database
    const supabase = await createServerClient()
    const { data: jobLog, error: logError } = await supabase
      .from("cron_job_logs")
      .insert({
        job_name: `fda-digest-${frequency}`,
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (!logError && jobLog) {
      jobId = jobLog.id
    }

    // Send digest emails
    const result = await emailService.sendAlertDigest(frequency)
    emailsSent = result?.emailsSent || 0

    // Calculate execution time
    const executionTimeMs = Date.now() - startTime

    // Update job log with success
    if (jobId) {
      await supabase
        .from("cron_job_logs")
        .update({
          status: "success",
          completed_at: new Date().toISOString(),
          emails_sent: emailsSent,
          execution_time_ms: executionTimeMs,
        })
        .eq("id", jobId)
    }

    console.log(`[v0] ${frequency} digest completed. Sent: ${emailsSent} emails in ${executionTimeMs}ms`)

    return NextResponse.json({
      success: true,
      message: `${frequency} digest sent successfully`,
      emailsSent,
      executionTimeMs,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in send-digest cron:", error)

    // Calculate execution time
    const executionTimeMs = Date.now() - startTime

    // Log error to database
    if (jobId) {
      const supabase = await createServerClient()
      await supabase
        .from("cron_job_logs")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
          emails_sent: emailsSent,
          execution_time_ms: executionTimeMs,
          error_message: error instanceof Error ? error.message : "Unknown error",
        })
        .eq("id", jobId)
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        emailsSent,
        executionTimeMs,
      },
      { status: 500 },
    )
  }
}
