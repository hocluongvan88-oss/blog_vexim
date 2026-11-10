import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { auditEmailText, validateDigitalAudit } from "@/lib/digital-audit"

export const runtime = "nodejs"

// Best-effort per-instance throttle. Production abuse controls should use a
// shared rate limiter (this map does not coordinate between server instances).
const attempts = new Map<string, number[]>()
const response = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } })

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return response({ error: "Expected a JSON request." }, 415)
  if (Number(request.headers.get("content-length") || 0) > 4096) return response({ error: "Request too large." }, 413)
  const origin = request.headers.get("origin")
  if (origin) {
    try { if (new URL(origin).host !== new URL(request.url).host) return response({ error: "Invalid request origin." }, 403) }
    catch { return response({ error: "Invalid request origin." }, 403) }
  }
  let body: Record<string, unknown>
  try {
    const text = await request.text()
    if (text.length > 4096) return response({ error: "Request too large." }, 413)
    body = JSON.parse(text)
  } catch { return response({ error: "Invalid request data." }, 400) }
  if (body?.fax) return response({ success: true }) // Honeypot: do not send email.
  const checked = validateDigitalAudit(body)
  if (!checked.ok) return response({ error: checked.error }, 400)
  const ip = (request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown").trim().slice(0, 128)
  const now = Date.now()
  const recent = (attempts.get(ip) || []).filter(time => now - time < 3600_000)
  if (recent.length >= 3) return response({ error: "Please try again later or contact us directly by email." }, 429)
  if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) return response({ error: "Online submission is unavailable. Please send the email draft instead." }, 503)
  // Avoid accumulating indefinitely on a long-running worker; the map is only
  // an in-process stopgap, never a durable record of submissions.
  if (attempts.size > 2000) attempts.clear()
  attempts.set(ip, [...recent, now])
  try {
    const port = Number.parseInt(process.env.MAIL_PORT || "587", 10)
    const transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.zoho.com", port, secure: port === 465,
      auth: { user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD },
    })
    await transport.sendMail({
      from: process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME,
      to: process.env.ADMIN_EMAIL || process.env.MAIL_USERNAME,
      replyTo: checked.data.email,
      subject: "Digital audit request — Vexim Global",
      text: auditEmailText(checked.data),
    })
    return response({ success: true })
  } catch (error) {
    console.error("[Digital audit] Mail delivery failed", error)
    return response({ error: "Online submission failed. Please send the email draft instead." }, 502)
  }
}
