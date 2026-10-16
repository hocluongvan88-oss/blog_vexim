import { createHash } from "node:crypto"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"
import { PUBLIC_EMAIL } from "@/lib/business-profile"
import { exportDigitalLeadSchema, normalizeCompanyWebsite } from "@/lib/export-digital-lead"
import { getExportDigitalAdminEmail } from "@/lib/email-export-digital"

export const runtime = "nodejs"
const attempts = new Map<string, { count: number; until: number }>()
const deliveries = new Map<string, { until: number; promise: Promise<boolean> }>()
const hour = 60 * 60 * 1000
const json = (body: unknown, status: number) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } })

/** Best-effort per-instance protection. Use an edge/distributed limiter before scaling. */
function prune() {
  const now = Date.now()
  for (const [key, item] of attempts) if (item.until < now) attempts.delete(key)
  for (const [key, item] of deliveries) if (item.until < now) deliveries.delete(key)
  while (attempts.size >= 10000) attempts.delete(attempts.keys().next().value!)
  while (deliveries.size >= 10000) deliveries.delete(deliveries.keys().next().value!)
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || new URL(request.url).host
  if (origin) {
    try {
      if (new URL(origin).host !== host)
        return json({ error: "Yêu cầu không hợp lệ. Vui lòng gửi từ website Vexim." }, 403)
    } catch {
      return json({ error: "Nguồn yêu cầu không hợp lệ." }, 400)
    }
  }
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ error: "Định dạng yêu cầu không hợp lệ." }, 415)
  const requestId = request.headers.get("x-request-id")
  if (!z.string().uuid().safeParse(requestId).success)
    return json({ error: "Mã yêu cầu không hợp lệ. Vui lòng tải lại trang." }, 400)
  let body: unknown
  const reader = request.body?.getReader()
  if (!reader) return json({ error: "Chưa có dữ liệu yêu cầu." }, 400)
  try {
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 16000) {
        await reader.cancel()
        return json({ error: "Nội dung quá dài." }, 413)
      }
      chunks.push(value)
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"))
  } catch {
    return json({ error: "Dữ liệu gửi chưa hợp lệ." }, 400)
  }
  const parsed = exportDigitalLeadSchema.safeParse(body)
  if (!parsed.success)
    return json({ error: parsed.error.issues[0]?.message || "Vui lòng kiểm tra lại thông tin." }, 400)
  const lead = parsed.data
  if (lead.honeypot) return json({ error: "Không thể xử lý yêu cầu này. Vui lòng liên hệ Vexim." }, 400)
  lead.website = lead.noWebsite ? "" : normalizeCompanyWebsite(lead.website)
  const recipient = process.env.EXPORT_DIGITAL_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || process.env.MAIL_USERNAME
  if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD || !recipient)
    return json({ error: "Kênh tiếp nhận đang được bảo trì. Vui lòng nhắn Zalo để nhận báo cáo." }, 503)
  prune()
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
  const ipKey = createHash("sha256").update(ip).digest("hex")
  const key = createHash("sha256")
    .update(`${ipKey}:${requestId}:${JSON.stringify(lead)}`)
    .digest("hex")
  let delivery = deliveries.get(key)
  if (!delivery) {
    const rate = attempts.get(ipKey) || { count: 0, until: Date.now() + hour }
    if (rate.count >= 5)
      return json({ error: "Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau hoặc liên hệ qua Zalo." }, 429)
    rate.count++
    attempts.set(ipKey, rate)
    const promise = (async () => {
      try {
        const port = Number(process.env.MAIL_PORT || 587)
        const transport = nodemailer.createTransport({
          host: process.env.MAIL_HOST || "smtp.zoho.com",
          port,
          secure: port === 465,
          auth: { user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        })
        const info = await transport.sendMail({
          from: {
            name: process.env.MAIL_FROM_NAME || "Vexim Export Digital",
            address: process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME!,
          },
          to: recipient,
          replyTo: lead.email || PUBLIC_EMAIL,
          subject: "[Export Digital] Yêu cầu báo cáo đánh giá miễn phí",
          html: getExportDigitalAdminEmail(lead, requestId!),
          text: `Yêu cầu báo cáo trong 2 ngày làm việc.\nMã: ${requestId}\nDoanh nghiệp: ${lead.company}\nWebsite: ${lead.website || "Chưa có"}\nSản phẩm: ${lead.product}\nThị trường: ${lead.markets.join(", ")}\nLiên hệ: ${lead.name}\nĐiện thoại/Zalo: ${lead.phone}\nEmail: ${lead.email || "Không cung cấp"}\nKênh bán: ${lead.channels.join(", ") || "Chưa cung cấp"}`,
        })
        return Array.isArray(info.accepted) && info.accepted.length > 0
      } catch {
        console.error("[Export Digital] Notification email was not accepted; no success returned.")
        return false
      }
    })()
    delivery = { promise, until: Date.now() + hour }
    deliveries.set(key, delivery)
  }
  if (!(await delivery.promise)) {
    deliveries.delete(key)
    return json(
      { error: "Chưa gửi được yêu cầu. Thông tin của bạn vẫn được giữ trong form; vui lòng thử lại hoặc nhắn Zalo." },
      503,
    )
  }
  return json(
    {
      success: true,
      requestId,
      message: "Vexim đã tiếp nhận yêu cầu. Chuyên viên sẽ gửi báo cáo trong 2 ngày làm việc.",
    },
    202,
  )
}
