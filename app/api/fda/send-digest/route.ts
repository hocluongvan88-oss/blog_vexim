import { NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"

// This endpoint should be called by a cron job
// Vercel Cron or external service like cron-job.org

export async function GET(request: Request) {
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

    // Send digest emails
    await emailService.sendAlertDigest(frequency)

    return NextResponse.json({
      success: true,
      message: `${frequency} digest sent successfully`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in send-digest cron:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
