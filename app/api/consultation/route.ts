import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import {
  getConsultationCustomerHTML,
  getConsultationAdminHTML,
} from "@/lib/email-consultation"

// Rate limiting: lưu IP và thời gian submit
const submissionTracker = new Map<string, number[]>()

// Hàm kiểm tra rate limit (tối đa 3 lần/giờ)
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const submissions = submissionTracker.get(ip) || []

  // Xóa các submission cũ hơn 1 giờ
  const recentSubmissions = submissions.filter((time) => now - time < 3600000)

  if (recentSubmissions.length >= 3) {
    return false // Đã vượt quá giới hạn
  }

  recentSubmissions.push(now)
  submissionTracker.set(ip, recentSubmissions)
  return true
}

export async function POST(request: Request) {
  try {
    // Lấy IP để rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Kiểm tra rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 giờ." }, { status: 429 })
    }

    const body = await request.json()
    const { name, phone, email, service, product, description, honeypot } = body

    // Bảo mật: Kiểm tra honeypot (field ẩn để bắt bot)
    if (honeypot) {
      console.log("[Security] Bot detected via honeypot")
      return NextResponse.json({ success: true }) // Trả về success để không để bot biết
    }

    // Validation
    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin bắt buộc." }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 })
    }

    // Validate phone (Vietnam phone number)
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "Số điện thoại không hợp lệ." }, { status: 400 })
    }

    // Debug logging
    console.log("[v0] Email config check:", {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      user: process.env.MAIL_USERNAME ? "***set***" : "MISSING",
      pass: process.env.MAIL_PASSWORD ? "***set***" : "MISSING",
    })

    // Kiểm tra credentials
    if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
      console.error("[v0] Missing email credentials!")
      return NextResponse.json({ error: "Cấu hình email chưa đầy đủ. Vui lòng liên hệ hotline." }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.zoho.com",
      port: Number.parseInt(process.env.MAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true, // Enable debug output
    })

    // Map service code sang tên dịch vụ
    const serviceNames: Record<string, string> = {
      fda: "Đăng ký FDA (Mỹ)",
      gacc: "Mã GACC (Trung Quốc)",
      "export-sales": "Phòng sale xuất khẩu (Mỹ)",
      "fda-label-check": "Phòng sale xuất khẩu (Mỹ)",
      "agent-us": "Dịch vụ Agent Hoa Kỳ",
      fsvp: "FSVP Compliance",
      mocra: "MOCRA Registration",
      other: "Khác",
    }
    const serviceName = serviceNames[service] || service || "Chưa chọn"

    const consultationParams = {
      name,
      phone,
      email,
      serviceName,
      product,
      description,
    }

    // Email 1: Gửi cho khách hàng (xác nhận)
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || "Vexim Global"}" <${process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME}>`,
      to: email,
      subject: "Xác nhận đăng ký tư vấn - Vexim Global",
      html: getConsultationCustomerHTML(consultationParams),
    })

    // Email 2: Gửi cho admin (thông báo lead mới)
    await transporter.sendMail({
      from: `"Vexim Website" <${process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME}>`,
      to: process.env.ADMIN_EMAIL || process.env.MAIL_USERNAME,
      subject: `🔔 Khách hàng mới đăng ký: ${name}`,
      html: getConsultationAdminHTML(consultationParams),
    })

    return NextResponse.json({
      success: true,
      message: "Đã gửi yêu cầu tư vấn thành công!",
    })
  } catch (error) {
    console.error("[Email Error]", error)
    return NextResponse.json({ error: "Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline." }, { status: 500 })
  }
}
