import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

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

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.zoho.com",
      port: Number.parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, // false cho port 587 (STARTTLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates if needed
      },
    })

    // Map service code sang tên dịch vụ
    const serviceNames: Record<string, string> = {
      fda: "Đăng ký FDA (Mỹ)",
      gacc: "Mã GACC (Trung Quốc)",
      mfds: "Giấy phép MFDS (Hàn Quốc)",
      "agent-us": "Dịch vụ Agent Hoa Kỳ",
      "ai-traceability": "Nền tảng truy xuất nguồn gốc",
      delegation: "Uỷ thác xuất nhập khẩu",
      other: "Khác",
    }
    const serviceName = serviceNames[service] || service || "Chưa chọn"

    // Email 1: Gửi cho khách hàng (xác nhận)
    await transporter.sendMail({
      from: `"Vexim Global" <${process.env.EMAIL_USER}>`, // Use EMAIL_USER
      to: email,
      subject: "Xác nhận đăng ký tư vấn - Vexim Global",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #065f46 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Vexim Global</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0;">Tận Tâm - Nhanh Chóng - Chính Xác</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1e3a8a; margin-top: 0;">Xin chào ${name},</h2>
            
            <p>Cảm ơn bạn đã quan tâm đến dịch vụ của Vexim Global! Chúng tôi đã nhận được yêu cầu tư vấn của bạn.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">Thông tin đăng ký:</h3>
              <p style="margin: 8px 0;"><strong>Họ tên:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Số điện thoại:</strong> ${phone}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 8px 0;"><strong>Dịch vụ quan tâm:</strong> ${serviceName}</p>
              ${product ? `<p style="margin: 8px 0;"><strong>Sản phẩm cần đăng ký:</strong> ${product}</p>` : ""}
              ${description ? `<p style="margin: 8px 0;"><strong>Mô tả thêm:</strong> ${description.replace(/\n/g, "<br>")}</p>` : ""}
            </div>
            
            <p><strong>Chuyên gia của chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ</strong> để tư vấn chi tiết về giải pháp phù hợp nhất.</p>
            
            <p>Trong thời gian chờ đợi, bạn có thể:</p>
            <ul style="color: #4b5563;">
              <li>Tham khảo thêm các dịch vụ trên website: <a href="https://veximglobal.com" style="color: #1e3a8a;">veximglobal.com</a></li>
              <li>Liên hệ hotline: <strong style="color: #10b981;">0373 685 634</strong> (8h-17h30 T2-T6)</li>
              <li>Email: <a href="mailto:contact@veximglobal.com" style="color: #1e3a8a;">contact@veximglobal.com</a></li>
            </ul>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Trân trọng,</p>
              <p style="color: #1e3a8a; font-weight: bold; margin: 5px 0;">Đội ngũ Vexim Global</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2026 Vexim Global. Bản quyền thuộc về Vexim Global.</p>
            <p>Số 25/6/52 Ngoa Long, Tay Tuu, Ha Noi</p>
          </div>
        </body>
        </html>
      `,
    })

    // Email 2: Gửi cho admin (thông báo lead mới)
    await transporter.sendMail({
      from: `"Vexim Website" <${process.env.EMAIL_USER}>`, // Use EMAIL_USER
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Use EMAIL_USER
      subject: `🔔 Khách hàng mới đăng ký: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1e3a8a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎯 Lead Mới Từ Website</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1e3a8a; margin-top: 0;">Thông tin khách hàng:</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <p style="margin: 10px 0;"><strong style="color: #065f46;">Họ tên:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong style="color: #065f46;">Số điện thoại:</strong> <a href="tel:${phone}" style="color: #1e3a8a;">${phone}</a></p>
              <p style="margin: 10px 0;"><strong style="color: #065f46;">Email:</strong> <a href="mailto:${email}" style="color: #1e3a8a;">${email}</a></p>
              <p style="margin: 10px 0;"><strong style="color: #065f46;">Dịch vụ quan tâm:</strong> <span style="background: #dbeafe; padding: 4px 12px; border-radius: 4px; color: #1e3a8a;">${serviceName}</span></p>
              ${product ? `<p style="margin: 10px 0;"><strong style="color: #065f46;">Sản phẩm:</strong> ${product}</p>` : ""}
              ${description ? `<p style="margin: 10px 0;"><strong style="color: #065f46;">Mô tả thêm:</strong><br><span style="color: #4b5563; font-style: italic;">${description.replace(/\n/g, "<br>")}</span></p>` : ""}
              <p style="margin: 10px 0; color: #6b7280; font-size: 14px;"><strong>Thời gian:</strong> ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;"><strong>⏰ Hành động:</strong> Vui lòng liên hệ khách hàng trong vòng 24 giờ!</p>
            </div>
          </div>
        </body>
        </html>
      `,
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
