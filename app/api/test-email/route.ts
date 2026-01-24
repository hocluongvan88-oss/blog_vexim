import { emailService } from "@/lib/email-service-zoho"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("[v0] === TEST EMAIL ENDPOINT ===")
  console.log("[v0] Checking environment variables:")
  console.log("[v0] - MAIL_USERNAME:", process.env.MAIL_USERNAME ? "✓ Set" : "✗ Missing")
  console.log("[v0] - MAIL_PASSWORD:", process.env.MAIL_PASSWORD ? "✓ Set" : "✗ Missing")
  console.log("[v0] - MAIL_HOST:", process.env.MAIL_HOST || "not set")
  console.log("[v0] - MAIL_PORT:", process.env.MAIL_PORT || "not set")
  
  try {
    // Test email send
    const result = await emailService.sendEmail({
      to: "test@example.com",
      subject: "Test Email from FDA Alerts",
      html: "<p>This is a test email to verify SMTP configuration.</p>",
    })
    
    return NextResponse.json({
      success: true,
      emailSent: result,
      envVarsPresent: {
        MAIL_USERNAME: !!process.env.MAIL_USERNAME,
        MAIL_PASSWORD: !!process.env.MAIL_PASSWORD,
        MAIL_HOST: !!process.env.MAIL_HOST,
        MAIL_PORT: !!process.env.MAIL_PORT,
      }
    })
  } catch (error) {
    console.error("[v0] Test email failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      envVarsPresent: {
        MAIL_USERNAME: !!process.env.MAIL_USERNAME,
        MAIL_PASSWORD: !!process.env.MAIL_PASSWORD,
        MAIL_HOST: !!process.env.MAIL_HOST,
        MAIL_PORT: !!process.env.MAIL_PORT,
      }
    }, { status: 500 })
  }
}
