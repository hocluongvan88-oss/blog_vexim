// Email template for GACC Submissions
// ============================================================
// THIẾT KẾ THỐNG NHẤT VEXIM GLOBAL — TON MÀU VÀNG XANH
// (cùng palette với lib/email-templates.tsx)
// ============================================================

export interface GACCSubmissionParams {
  companyName: string
  productName: string
  hsCode: string
  submissionId: string
  submittedAt: string
  email?: string
  phone?: string
  taxCode?: string
}

const GACC_BASE_STYLE = `
    body { font-family: 'Be Vietnam Pro', Arial, Helvetica, sans-serif; line-height: 1.6; color: #57534e; background-color: #f4f6ec; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
    .page { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
    .card { background: #ffffff; border: 1px solid #e6e9dd; border-radius: 14px; overflow: hidden; }
    .accent-bar { height: 5px; background: linear-gradient(90deg, #facc15 0%, #a3e635 45%, #4d7c0f 100%); }
    .header { background: linear-gradient(135deg, #84cc16 0%, #4d7c0f 100%); padding: 36px 32px; text-align: center; }
    .header .brand { display: inline-block; font-size: 11px; letter-spacing: 3px; color: #ecfccb; font-weight: 700; text-transform: uppercase; }
    .header h1 { color: #ffffff; margin: 10px 0 0 0; font-size: 26px; line-height: 1.3; }
    .header .icon { font-size: 40px; margin-bottom: 8px; }
    .content { padding: 32px; }
    .content h2 { color: #1c1917; font-size: 21px; margin-bottom: 14px; }
    .content p { color: #57534e; margin-bottom: 15px; font-size: 15px; }
    .btn { display: inline-block; background: #4d7c0f; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; }
    .btn:hover { background: #3f6212; color: #ffffff !important; }
    .info-box { background: #f7fee7; border: 2px solid #d9f99d; border-radius: 10px; padding: 20px; margin: 20px 0; }
    .info-box h3 { color: #3f6212; margin: 0 0 12px 0; font-size: 17px; }
    .info-table { width: 100%; border-collapse: collapse; }
    .info-table td { padding: 8px 0; border-bottom: 1px solid #e2ecc9; font-size: 14px; vertical-align: top; }
    .info-table tr:last-child td { border-bottom: none; }
    .info-label { font-weight: 700; color: #365314; width: 42%; }
    .info-value { color: #1c1917; }
    .status-badge { display: inline-block; background: #fef9c3; border: 1px solid #fde68a; color: #854d0e; padding: 8px 18px; border-radius: 20px; font-weight: 700; margin: 16px 0; }
    .next-steps { background: #f8faf3; border: 1px solid #e6e9dd; border-left: 5px solid #84cc16; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .next-steps h3 { color: #3f6212; margin: 0 0 10px 0; font-size: 17px; }
    .next-steps ul { margin: 10px 0 0 0; padding-left: 20px; }
    .next-steps li { color: #44403c; margin-bottom: 10px; font-size: 14px; }
    .footer { background: #f8faf3; padding: 26px 32px; text-align: center; border-top: 1px solid #e6e9dd; }
    .footer p { color: #78716c; font-size: 13px; margin: 5px 0; }
    .footer strong { color: #365314; }
    .footer a { color: #4d7c0f; text-decoration: none; font-weight: 600; }
`

const GACC_FOOTER = `
      <div class="footer">
        <p><strong>Vexim Global</strong> — Chuyên gia xuất nhập khẩu & Đăng ký GACC</p>
        <p style="margin-top: 10px;">
          Email: <a href="mailto:contact@veximglobal.vn">contact@veximglobal.vn</a><br>
          Hotline: 0373 685 634<br>
          Website: <a href="https://www.veximglobal.com">veximglobal.com</a>
        </p>
      </div>`

// User Confirmation Email
export function getGACCUserConfirmationHTML(params: GACCSubmissionParams): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận gửi hồ sơ đánh giá GACC</title>
  <style>${GACC_BASE_STYLE}</style>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="accent-bar"></div>
      <div class="header">
        <div class="icon">✅</div>
        <span class="brand">Vexim Global</span>
        <h1>Đã nhận hồ sơ đánh giá GACC</h1>
      </div>

      <div class="content">
        <h2>Kính gửi ${params.companyName},</h2>

        <p>Chúng tôi đã nhận được hồ sơ đánh giá khả năng đăng ký GACC của quý công ty. Cảm ơn quý công ty đã tin tưởng và sử dụng dịch vụ của Vexim Global.</p>

        <div style="text-align: center;">
          <span class="status-badge">🎯 Hồ sơ đang được xử lý</span>
        </div>

        <div class="info-box">
          <h3>📋 Thông tin hồ sơ</h3>
          <table class="info-table" role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td class="info-label">Mã hồ sơ:</td>
              <td class="info-value" style="font-weight: 700; color: #4d7c0f;">#${params.submissionId.slice(0, 8).toUpperCase()}</td>
            </tr>
            <tr>
              <td class="info-label">Doanh nghiệp:</td>
              <td class="info-value">${params.companyName}</td>
            </tr>
            <tr>
              <td class="info-label">Sản phẩm:</td>
              <td class="info-value">${params.productName}</td>
            </tr>
            <tr>
              <td class="info-label">Mã HS:</td>
              <td class="info-value">${params.hsCode}</td>
            </tr>
            <tr>
              <td class="info-label">Thời gian gửi:</td>
              <td class="info-value">${params.submittedAt}</td>
            </tr>
          </table>
        </div>

        <div class="next-steps">
          <h3>📌 Các bước tiếp theo</h3>
          <ul>
            <li><strong>Bước 1:</strong> Chuyên viên của chúng tôi sẽ xem xét hồ sơ trong vòng <strong>1-2 ngày làm việc</strong></li>
            <li><strong>Bước 2:</strong> Quý công ty sẽ nhận được báo cáo đánh giá sơ bộ qua email</li>
            <li><strong>Bước 3:</strong> Nếu cần bổ sung tài liệu, chúng tôi sẽ liên hệ trực tiếp</li>
            <li><strong>Bước 4:</strong> Sau khi hoàn thiện, chúng tôi sẽ hỗ trợ quý công ty nộp hồ sơ chính thức</li>
          </ul>
        </div>

        <p style="margin-bottom: 8px;"><strong>Lưu ý quan trọng:</strong></p>
        <ul style="color: #57534e; padding-left: 20px; margin: 0 0 15px 0; font-size: 14px;">
          <li style="margin-bottom: 6px;">Vui lòng lưu giữ mã hồ sơ để tra cứu</li>
          <li style="margin-bottom: 6px;">Hệ thống sẽ tự động gửi thông báo khi có cập nhật</li>
          <li style="margin-bottom: 0;">Mọi thắc mắc xin liên hệ hotline: <strong style="color: #4d7c0f;">0373 685 634</strong></li>
        </ul>
      </div>

      ${GACC_FOOTER}
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Admin Notification Email
export function getGACCAdminNotificationHTML(params: GACCSubmissionParams): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hồ sơ GACC mới cần xử lý</title>
  <style>
    ${GACC_BASE_STYLE}
    .card { border: 3px solid #eab308; }
    .header { background: linear-gradient(135deg, #365314 0%, #1a2e05 100%); padding: 32px; }
    .urgent { display: inline-block; background: #fef9c3; color: #854d0e; padding: 6px 14px; border-radius: 15px; font-weight: 700; margin-top: 12px; font-size: 13px; border: 1px solid #fde68a; }
    .info-box { background: #fefce8; border: 2px solid #fde68a; }
    .info-table td { border-bottom-color: #fde68a; }
    .info-label { color: #854d0e; }
    .info-value { color: #1c1917; }
    .btn { background: #365314; }
    .btn:hover { background: #1a2e05; }
  </style>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="accent-bar"></div>
      <div class="header">
        <span class="brand">Vexim Global · Admin</span>
        <h1>🔔 HỒ SƠ GACC MỚI</h1>
        <span class="urgent">⚡ CẦN XỬ LÝ NGAY</span>
      </div>

      <div class="content">
        <h2>Hồ sơ đánh giá GACC mới từ khách hàng</h2>

        <p>Có một hồ sơ đánh giá GACC mới vừa được gửi và đang chờ xem xét.</p>

        <div class="info-box">
          <table class="info-table" role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td class="info-label">Mã hồ sơ:</td>
              <td class="info-value" style="font-weight: 700;">#${params.submissionId.slice(0, 8).toUpperCase()}</td>
            </tr>
            <tr>
              <td class="info-label">Doanh nghiệp:</td>
              <td class="info-value">${params.companyName}</td>
            </tr>
            <tr>
              <td class="info-label">Sản phẩm:</td>
              <td class="info-value">${params.productName}</td>
            </tr>
            <tr>
              <td class="info-label">Mã HS:</td>
              <td class="info-value">${params.hsCode}</td>
            </tr>
            ${params.taxCode ? `
            <tr>
              <td class="info-label">Mã số thuế:</td>
              <td class="info-value">${params.taxCode}</td>
            </tr>` : ""}
            ${params.phone ? `
            <tr>
              <td class="info-label">Số điện thoại:</td>
              <td class="info-value">${params.phone}</td>
            </tr>` : ""}
            ${params.email ? `
            <tr>
              <td class="info-label">Email:</td>
              <td class="info-value">${params.email}</td>
            </tr>` : ""}
            <tr>
              <td class="info-label">Thời gian gửi:</td>
              <td class="info-value">${params.submittedAt}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <a href="https://www.veximglobal.com/admin/gacc-submissions/${params.submissionId}" class="btn">Xem chi tiết hồ sơ →</a>
        </div>

        <div style="background: #f7fee7; border: 1px solid #d9f99d; border-left: 5px solid #84cc16; padding: 14px 18px; border-radius: 8px;">
          <p style="margin: 0; color: #3f6212; font-size: 14px;">
            <strong>⏰ Lưu ý:</strong> Khách hàng mong đợi nhận được phản hồi trong vòng 1-2 ngày làm việc.
          </p>
        </div>
      </div>

      <div class="footer">
        <p><strong>Vexim Global Admin Panel</strong></p>
        <p>Email này được gửi tự động từ hệ thống</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}
