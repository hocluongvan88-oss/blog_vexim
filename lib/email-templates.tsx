// Email templates for FDA Alert System

export interface EmailTemplateParams {
  email: string
  verificationLink?: string
  unsubscribeLink?: string
  alerts?: any[]
  alertCount?: number
}

// Verification Email Template
export function getVerificationEmailHTML(params: EmailTemplateParams): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận đăng ký cảnh báo FDA</title>
  <style>
    body { font-family: 'Be Vietnam Pro', Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .email-wrapper { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #2563eb 0%, #059669 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .content h2 { color: #0f172a; font-size: 22px; margin-bottom: 20px; }
    .content p { color: #475569; margin-bottom: 15px; font-size: 16px; }
    .btn { display: inline-block; background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .btn:hover { background: #1d4ed8; }
    .features { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .features ul { margin: 0; padding-left: 20px; }
    .features li { color: #334155; margin-bottom: 10px; }
    .footer { background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #64748b; font-size: 14px; margin: 5px 0; }
    .footer a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <h1>🛡️ Xác nhận đăng ký FDA Tracker</h1>
      </div>
      
      <div class="content">
        <h2>Chào mừng bạn đến với Vexim Global FDA Tracker!</h2>
        
        <p>Cảm ơn bạn đã đăng ký nhận cảnh báo FDA. Để hoàn tất đăng ký, vui lòng xác nhận địa chỉ email của bạn:</p>
        
        <div style="text-align: center;">
          <a href="${params.verificationLink}" class="btn">Xác nhận email của tôi</a>
        </div>
        
        <div class="features">
          <h3 style="margin-top: 0; color: #0f172a;">Bạn sẽ nhận được:</h3>
          <ul>
            <li>✅ Cảnh báo thu hồi thực phẩm, dược phẩm, mỹ phẩm từ FDA</li>
            <li>✅ Tóm tắt bằng tiếng Việt với AI</li>
            <li>✅ Thông báo realtime hoặc tổng hợp theo tuần</li>
            <li>✅ Hoàn toàn MIỄN PHÍ và có thể hủy bất cứ lúc nào</li>
          </ul>
        </div>
        
        <p><strong>Lưu ý:</strong> Link xác nhận sẽ hết hạn sau 24 giờ.</p>
        
        <p>Nếu bạn không đăng ký dịch vụ này, vui lòng bỏ qua email này.</p>
      </div>
      
      <div class="footer">
        <p><strong>Vexim Global</strong> - Chuyên gia xuất nhập khẩu toàn cầu</p>
        <p>Email: contact@veximglobal.vn | Phone: 0373 685 634</p>
        <p><a href="${params.unsubscribeLink}">Hủy đăng ký</a></p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Daily/Weekly Alert Email Template
export function getAlertEmailHTML(params: EmailTemplateParams & { frequency: "daily" | "weekly" }): string {
  const { alerts = [], alertCount = 0, frequency } = params
  const title = frequency === "daily" ? "Tóm tắt cảnh báo FDA hôm nay" : "Tóm tắt cảnh báo FDA tuần này"

  const alertsHTML = alerts
    .slice(0, 5)
    .map(
      (alert, index) => `
    <div style="background: white; border: 1px solid #e2e8f0; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
      <div style="display: flex; align-items: start; gap: 15px;">
        <div style="background: #fee2e2; color: #991b1b; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">
          ${index + 1}
        </div>
        <div style="flex: 1;">
          <h3 style="margin: 0 0 10px 0; color: #0f172a; font-size: 18px;">${alert.title}</h3>
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px; margin-bottom: 10px;">
            <p style="margin: 0; color: #991b1b; font-weight: 500;">⚠️ ${alert.criticalInfo}</p>
          </div>
          ${
            alert.aiSummary
              ? `
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px; margin-bottom: 10px;">
            <p style="margin: 0; color: #1e40af;"><strong>Tóm tắt AI:</strong> ${alert.aiSummary}</p>
          </div>
          `
              : ""
          }
          <div style="display: flex; gap: 15px; flex-wrap: wrap; font-size: 14px; color: #64748b;">
            ${alert.date ? `<span>📅 ${new Date(alert.date).toLocaleDateString("vi-VN")}</span>` : ""}
            ${alert.manufacturer ? `<span>🏭 ${alert.manufacturer}</span>` : ""}
            ${alert.classification ? `<span style="background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 4px;">${alert.classification}</span>` : ""}
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Be Vietnam Pro', Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 650px; margin: 0 auto; padding: 20px; }
    .email-wrapper { background: #f8fafc; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; }
    .stats { background: white; padding: 25px; margin: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; }
    .stat-item h3 { margin: 0; font-size: 32px; color: #ef4444; }
    .stat-item p { margin: 5px 0 0 0; color: #64748b; font-size: 14px; }
    .content { padding: 20px 30px; }
    .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 15px 0; }
    .footer { background: white; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0; margin-top: 20px; }
    .footer p { color: #64748b; font-size: 13px; margin: 5px 0; }
    .footer a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <h1>🚨 ${title}</h1>
        <p>${new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
      
      <div class="stats">
        <div class="stats-grid">
          <div class="stat-item">
            <h3>${alertCount}</h3>
            <p>Tổng cảnh báo</p>
          </div>
          <div class="stat-item">
            <h3>${alerts.length}</h3>
            <p>Nổi bật</p>
          </div>
          <div class="stat-item">
            <h3>${alerts.filter((a) => a.classification?.includes("I")).length}</h3>
            <p>Mức độ cao</p>
          </div>
        </div>
      </div>
      
      <div class="content">
        <h2 style="color: #0f172a; font-size: 22px; margin-bottom: 20px;">📋 Cảnh báo nổi bật</h2>
        
        ${alertsHTML}
        
        ${
          alertCount > 5
            ? `
        <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%); border-radius: 8px; margin-top: 20px;">
          <p style="color: #1e293b; font-size: 16px; margin-bottom: 15px;">
            <strong>Còn ${alertCount - 5} cảnh báo khác</strong> chưa hiển thị trong email này.
          </p>
          <a href="https://vexim.vn/fda-tracker" class="btn">Xem tất cả cảnh báo →</a>
        </div>
        `
            : ""
        }
        
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-top: 30px;">
          <h3 style="color: #0f172a; margin-top: 0;">💡 Lưu ý quan trọng</h3>
          <ul style="color: #475569; margin: 0; padding-left: 20px;">
            <li>Kiểm tra kỹ sản phẩm trước khi sử dụng</li>
            <li>Thông tin từ FDA.gov, cập nhật realtime</li>
            <li>Liên hệ Vexim Global để tư vấn chi tiết</li>
          </ul>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>Vexim Global</strong> - FDA Tracker</p>
        <p>Email: contact@veximglobal.vn | Phone: 0373 685 634</p>
        <p style="margin-top: 15px;">
          <a href="https://vexim.vn/fda-tracker">Xem trên web</a> | 
          <a href="${params.unsubscribeLink}">Hủy đăng ký</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Immediate Alert Email Template (Single Alert)
export function getImmediateAlertEmailHTML(params: EmailTemplateParams & { alert: any }): string {
  const { alert } = params

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚨 Cảnh báo FDA khẩn cấp</title>
  <style>
    body { font-family: 'Be Vietnam Pro', Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #fef2f2; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .email-wrapper { background: white; border: 3px solid #ef4444; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(239,68,68,0.3); }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 26px; }
    .urgent-badge { background: #fef2f2; color: #991b1b; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: 600; margin-top: 10px; border: 2px solid #fee2e2; }
    .content { padding: 30px; }
    .alert-box { background: #fef2f2; border: 2px solid #fecaca; border-left: 6px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .alert-box h2 { color: #991b1b; margin-top: 0; font-size: 20px; }
    .detail-grid { display: grid; gap: 15px; margin: 20px 0; }
    .detail-item { background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 3px solid #2563eb; }
    .detail-item strong { color: #1e40af; }
    .btn { display: inline-block; background: #ef4444; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { color: #64748b; font-size: 13px; margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <h1>🚨 CẢNH BÁO FDA KHẨN CẤP</h1>
        <span class="urgent-badge">⚡ THÔNG BÁO NGAY LẬP TỨC</span>
      </div>
      
      <div class="content">
        <p style="font-size: 16px; color: #475569;">Có một cảnh báo FDA mới vừa được phát hành:</p>
        
        <div class="alert-box">
          <h2>${alert.title}</h2>
          <p style="margin: 15px 0 0 0; color: #7f1d1d; font-size: 16px; font-weight: 500;">
            ⚠️ ${alert.criticalInfo}
          </p>
        </div>
        
        ${
          alert.aiSummary
            ? `
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">🤖 Tóm tắt AI</h3>
          <p style="margin: 0; color: #1e40af; font-size: 15px;">${alert.aiSummary}</p>
        </div>
        `
            : ""
        }
        
        <div class="detail-grid">
          ${alert.date ? `<div class="detail-item"><strong>📅 Ngày:</strong> ${new Date(alert.date).toLocaleDateString("vi-VN")}</div>` : ""}
          ${alert.manufacturer ? `<div class="detail-item"><strong>🏭 Nhà sản xuất:</strong> ${alert.manufacturer}</div>` : ""}
          ${alert.classification ? `<div class="detail-item"><strong>⚠️ Phân loại:</strong> ${alert.classification}</div>` : ""}
          ${alert.distributionPattern ? `<div class="detail-item"><strong>🌍 Phân phối:</strong> ${alert.distributionPattern}</div>` : ""}
        </div>
        
        <div style="text-align: center; padding: 20px; background: #fef9c3; border-radius: 8px; margin: 20px 0;">
          <p style="color: #713f12; margin: 0 0 15px 0; font-weight: 600;">
            ⚡ Hành động ngay để đảm bảo an toàn
          </p>
          <a href="https://vexim.vn/fda-tracker" class="btn">Xem chi tiết →</a>
        </div>
        
        <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <p style="color: #475569; font-size: 14px; margin: 0;">
            <strong>Cần tư vấn?</strong> Liên hệ ngay Vexim Global: <a href="tel:0373685634" style="color: #2563eb;">0373 685 634</a>
          </p>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>Vexim Global</strong> - FDA Tracker</p>
        <p>Email: contact@veximglobal.vn | Phone: 0373 685 634</p>
        <p style="margin-top: 15px;">
          <a href="${params.unsubscribeLink}" style="color: #64748b; text-decoration: none;">Hủy cảnh báo khẩn cấp</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Unsubscribe Confirmation Email
export function getUnsubscribeEmailHTML(params: EmailTemplateParams): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đã hủy đăng ký</title>
  <style>
    body { font-family: 'Be Vietnam Pro', Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 500px; margin: 50px auto; padding: 20px; }
    .email-wrapper { background: white; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .email-wrapper h1 { color: #0f172a; font-size: 24px; margin-bottom: 15px; }
    .email-wrapper p { color: #64748b; margin-bottom: 15px; }
    .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <h1>✅ Đã hủy đăng ký thành công</h1>
      <p>Bạn sẽ không còn nhận được cảnh báo FDA từ Vexim Global nữa.</p>
      <p>Nếu bạn muốn đăng ký lại, bạn có thể quay lại bất cứ lúc nào.</p>
      <a href="https://vexim.vn/fda-tracker" class="btn">Đăng ký lại</a>
      <p style="margin-top: 30px; font-size: 14px;">
        Cảm ơn bạn đã tin tưởng Vexim Global!
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
