// Email template for GACC Submissions

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

// User Confirmation Email
export function getGACCUserConfirmationHTML(params: GACCSubmissionParams): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận gửi hồ sơ đánh giá GACC</title>
  <style>
    body { font-family: 'Be Vietnam Pro', Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .email-wrapper { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .icon { font-size: 48px; margin-bottom: 10px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #0f172a; font-size: 22px; margin-bottom: 20px; }
    .content p { color: #475569; margin-bottom: 15px; font-size: 16px; }
    .info-box { background: #f0fdf4; border: 2px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-box h3 { color: #166534; margin-top: 0; font-size: 18px; }
    .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #d1fae5; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #065f46; min-width: 150px; }
    .info-value { color: #047857; }
    .status-badge { background: #86efac; color: #166534; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: 600; margin: 20px 0; }
    .next-steps { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
    .next-steps h3 { color: #1e40af; margin-top: 0; }
    .next-steps ul { margin: 10px 0; padding-left: 20px; }
    .next-steps li { color: #475569; margin-bottom: 10px; }
    .footer { background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #64748b; font-size: 14px; margin: 5px 0; }
    .footer a { color: #059669; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <div class="icon">✅</div>
        <h1>Đã nhận hồ sơ đánh giá GACC</h1>
      </div>
      
      <div class="content">
        <h2>Kính gửi ${params.companyName},</h2>
        
        <p>Chúng tôi đã nhận được hồ sơ đánh giá khả năng đăng ký GACC của quý công ty. Cảm ơn quý công ty đã tin tưởng và sử dụng dịch vụ của Vexim Global.</p>
        
        <div class="status-badge">🎯 Hồ sơ đang được xử lý</div>
        
        <div class="info-box">
          <h3>📋 Thông tin hồ sơ</h3>
          <div class="info-row">
            <span class="info-label">Mã hồ sơ:</span>
            <span class="info-value">#${params.submissionId.slice(0, 8).toUpperCase()}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Doanh nghiệp:</span>
            <span class="info-value">${params.companyName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Sản phẩm:</span>
            <span class="info-value">${params.productName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Mã HS:</span>
            <span class="info-value">${params.hsCode}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Thời gian gửi:</span>
            <span class="info-value">${params.submittedAt}</span>
          </div>
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
        
        <p><strong>Lưu ý quan trọng:</strong></p>
        <ul style="color: #475569; padding-left: 20px;">
          <li>Vui lòng lưu giữ mã hồ sơ để tra cứu</li>
          <li>Hệ thống sẽ tự động gửi thông báo khi có cập nhật</li>
          <li>Mọi thắc mắc xin liên hệ hotline: <strong>0373 685 634</strong></li>
        </ul>
      </div>
      
      <div class="footer">
        <p><strong>Vexim Global</strong></p>
        <p>Chuyên gia xuất nhập khẩu & Đăng ký GACC</p>
        <p style="margin-top: 10px;">
          Email: <a href="mailto:contact@veximglobal.vn">contact@veximglobal.vn</a><br>
          Hotline: 0373 685 634<br>
          Website: <a href="https://www.veximglobal.com">veximglobal.com</a>
        </p>
      </div>
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
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .email-wrapper { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 3px solid #f97316; }
    .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .urgent { background: #fff7ed; color: #9a3412; padding: 6px 12px; border-radius: 15px; display: inline-block; font-weight: 600; margin-top: 10px; font-size: 14px; }
    .content { padding: 30px; }
    .content h2 { color: #0f172a; font-size: 20px; margin-bottom: 15px; }
    .info-box { background: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; padding: 6px 0; border-bottom: 1px solid #fde68a; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #92400e; min-width: 140px; }
    .info-value { color: #78350f; }
    .btn { display: inline-block; background: #f97316; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .btn:hover { background: #ea580c; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #64748b; font-size: 13px; margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <h1>🔔 HỒ SƠ GACC MỚI</h1>
        <span class="urgent">⚡ CẦN XỬ LÝ NGAY</span>
      </div>
      
      <div class="content">
        <h2>Hồ sơ đánh giá GACC mới từ khách hàng</h2>
        
        <p>Có một hồ sơ đánh giá GACC mới vừa được gửi và đang chờ xem xét.</p>
        
        <div class="info-box">
          <div class="info-row">
            <span class="info-label">Mã hồ sơ:</span>
            <span class="info-value">#${params.submissionId.slice(0, 8).toUpperCase()}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Doanh nghiệp:</span>
            <span class="info-value">${params.companyName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Sản phẩm:</span>
            <span class="info-value">${params.productName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Mã HS:</span>
            <span class="info-value">${params.hsCode}</span>
          </div>
          ${params.taxCode ? `
          <div class="info-row">
            <span class="info-label">Mã số thuế:</span>
            <span class="info-value">${params.taxCode}</span>
          </div>
          ` : ''}
          ${params.phone ? `
          <div class="info-row">
            <span class="info-label">Số điện thoại:</span>
            <span class="info-value">${params.phone}</span>
          </div>
          ` : ''}
          ${params.email ? `
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${params.email}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label">Thời gian gửi:</span>
            <span class="info-value">${params.submittedAt}</span>
          </div>
        </div>
        
        <div style="text-align: center;">
          <a href="https://www.veximglobal.com/admin/gacc-submissions/${params.submissionId}" class="btn">
            Xem chi tiết hồ sơ →
          </a>
        </div>
        
        <p style="margin-top: 20px; padding: 15px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
          <strong>⏰ Lưu ý:</strong> Khách hàng mong đợi nhận được phản hồi trong vòng 1-2 ngày làm việc.
        </p>
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
