// Email templates for FDA Alert System
// ============================================================
// THIẾT KẾ THỐNG NHẤT VEXIM GLOBAL — TON MÀU VÀNG XANH
// ============================================================
// Palette:
//   - Vàng:     #facc15 (yellow-400), #eab308 (yellow-500), #fef9c3 (yellow-100)
//   - Xanh:     #84cc16 (lime-500),  #4d7c0f (lime-700),  #365314 (lime-800)
//   - Nền:      #f4f6ec (page),      #f7fee7 (panel xanh),#fefce8 (panel vàng)
//   - Nâu xanh: #1c1917 (heading),   #57534e (body),      #78716c (muted)
// Nguyên tắc:
//   - Header gradient vàng-xanh: 135deg #84cc16 -> #4d7c0f
//   - Thanh accent 5px: #facc15 -> #a3e635 -> #4d7c0f
//   - CTA chính: nền #4d7c0f chữ trắng | CTA nhấn: nền #eab308 chữ sẫm
//   - Bản tin khẩn cấp: header xanh rêu đậm + viền vàng để tạo cấp bách
//   - Bố cục dùng table để tương thích Outlook; màu đặt inline + class

export interface EmailTemplateParams {
  email: string
  verificationLink?: string
  unsubscribeLink?: string
  alerts?: any[]
  alertCount?: number
}

// Common <style> block shared by all Vexim email templates
const EMAIL_BASE_STYLE = `
    body { font-family: 'Be Vietnam Pro', Arial, Helvetica, sans-serif; line-height: 1.6; color: #57534e; background-color: #f4f6ec; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
    .page { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
    .card { background: #ffffff; border: 1px solid #e6e9dd; border-radius: 14px; overflow: hidden; }
    .accent-bar { height: 5px; background: linear-gradient(90deg, #facc15 0%, #a3e635 45%, #4d7c0f 100%); }
    .header { background: linear-gradient(135deg, #84cc16 0%, #4d7c0f 100%); padding: 36px 32px; text-align: center; }
    .header .brand { display: inline-block; font-size: 11px; letter-spacing: 3px; color: #ecfccb; font-weight: 700; text-transform: uppercase; }
    .header h1 { color: #ffffff; margin: 10px 0 0 0; font-size: 26px; line-height: 1.3; }
    .header p { color: #d9f99d; margin: 8px 0 0 0; font-size: 14px; }
    .content { padding: 32px; }
    .content h2 { color: #1c1917; font-size: 22px; margin-bottom: 14px; }
    .content p { color: #57534e; margin-bottom: 15px; font-size: 15px; }
    .btn { display: inline-block; background: #4d7c0f; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; }
    .btn:hover { background: #3f6212; color: #ffffff !important; }
    .btn-yellow { background: #eab308; color: #1a2e05 !important; }
    .btn-yellow:hover { background: #ca8a04; color: #1a2e05 !important; }
    .panel-lime { background: #f7fee7; border: 1px solid #d9f99d; border-radius: 10px; padding: 20px; }
    .panel-yellow { background: #fefce8; border: 1px solid #fde68a; border-radius: 10px; padding: 20px; }
    .footer { background: #f8faf3; padding: 26px 32px; text-align: center; border-top: 1px solid #e6e9dd; }
    .footer p { color: #78716c; font-size: 13px; margin: 5px 0; }
    .footer strong { color: #365314; }
    .footer a { color: #4d7c0f; text-decoration: none; font-weight: 600; }
`

// Footer block (shared)
function emailFooter(extraLinks?: string): string {
  return `
      <div class="footer">
        <p><strong>Vexim Global</strong> — Chuyên gia xuất nhập khẩu toàn cầu</p>
        <p>Email: contact@veximglobal.vn | Phone: 0373 685 634</p>
        ${extraLinks ?? ""}
      </div>`
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
  <style>${EMAIL_BASE_STYLE}</style>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="accent-bar"></div>
      <div class="header">
        <span class="brand">Vexim Global</span>
        <h1>🛡️ Xác nhận đăng ký FDA Tracker</h1>
        <p>Chỉ còn 1 bước để nhận cảnh báo FDA miễn phí</p>
      </div>

      <div class="content">
        <h2>Chào mừng bạn đến với Vexim Global FDA Tracker!</h2>

        <p>Cảm ơn bạn đã đăng ký nhận cảnh báo FDA. Để hoàn tất đăng ký, vui lòng xác nhận địa chỉ email của bạn:</p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${params.verificationLink}" class="btn">Xác nhận email của tôi</a>
        </div>

        <div class="panel-lime" style="margin: 24px 0;">
          <h3 style="margin: 0 0 12px 0; color: #3f6212; font-size: 16px;">📦 Bạn sẽ nhận được:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #44403c; font-size: 15px;">
            <li style="margin-bottom: 8px;">✅ Cảnh báo thu hồi thực phẩm, dược phẩm, mỹ phẩm từ FDA</li>
            <li style="margin-bottom: 8px;">✅ Tóm tắt bằng tiếng Việt với AI</li>
            <li style="margin-bottom: 8px;">✅ Thông báo realtime hoặc tổng hợp theo tuần</li>
            <li style="margin-bottom: 0;">✅ Hoàn toàn MIỄN PHÍ và có thể hủy bất cứ lúc nào</li>
          </ul>
        </div>

        <p style="margin-bottom: 0;"><strong>Lưu ý:</strong> Link xác nhận sẽ hết hạn sau 24 giờ.</p>
        <p style="margin-bottom: 0; color: #78716c; font-size: 14px;">Nếu bạn không đăng ký dịch vụ này, vui lòng bỏ qua email này.</p>
      </div>

      ${emailFooter(
        `<p style="margin-top: 14px;"><a href="${params.unsubscribeLink}">Hủy đăng ký</a></p>`,
      )}
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
    <div style="background: #ffffff; border: 1px solid #e6e9dd; border-left: 5px solid #eab308; border-radius: 10px; margin-bottom: 16px; overflow: hidden;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="56" valign="top" style="padding: 18px 0 18px 18px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #fef9c3; border: 1px solid #fde68a; color: #a16207; font-weight: 800; font-size: 16px; text-align: center; line-height: 34px;">${index + 1}</div>
          </td>
          <td valign="top" style="padding: 18px 18px 18px 6px;">
            <h3 style="margin: 0 0 10px 0; color: #1c1917; font-size: 17px; line-height: 1.4;">${alert.title}</h3>
            <div style="background: #fefce8; border: 1px solid #fde68a; padding: 12px 14px; border-radius: 8px; margin-bottom: 10px;">
              <p style="margin: 0; color: #854d0e; font-size: 14px; font-weight: 600;">⚠️ ${alert.criticalInfo}</p>
            </div>
            ${
              alert.aiSummary
                ? `
            <div style="background: #f7fee7; border: 1px solid #d9f99d; padding: 12px 14px; border-radius: 8px; margin-bottom: 10px;">
              <p style="margin: 0; color: #3f6212; font-size: 14px;"><strong>Tóm tắt AI:</strong> ${alert.aiSummary}</p>
            </div>`
                : ""
            }
            <div style="font-size: 13px; color: #78716c; line-height: 1.9;">
              ${alert.date ? `<span style="display: inline-block; margin-right: 14px;">📅 ${new Date(alert.date).toLocaleDateString("vi-VN")}</span>` : ""}
              ${alert.manufacturer ? `<span style="display: inline-block; margin-right: 14px;">🏭 ${alert.manufacturer}</span>` : ""}
              ${alert.classification ? `<span style="display: inline-block; background: #fef9c3; border: 1px solid #fde68a; color: #854d0e; padding: 1px 10px; border-radius: 10px; font-weight: 600;">${alert.classification}</span>` : ""}
            </div>
          </td>
        </tr>
      </table>
    </div>`,
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${EMAIL_BASE_STYLE}</style>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="accent-bar"></div>
      <div class="header">
        <span class="brand">Vexim Global · FDA Tracker</span>
        <h1>📬 ${title}</h1>
        <p>${new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div style="padding: 24px 32px 0 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="10">
          <tr>
            <td width="33%" style="text-align: center; background: #f7fee7; border: 1px solid #d9f99d; border-radius: 10px; padding: 16px 8px;">
              <div style="font-size: 28px; font-weight: 800; color: #4d7c0f; line-height: 1.2;">${alertCount}</div>
              <div style="font-size: 13px; color: #78716c; margin-top: 4px;">Tổng cảnh báo</div>
            </td>
            <td width="33%" style="text-align: center; background: #f7fee7; border: 1px solid #d9f99d; border-radius: 10px; padding: 16px 8px;">
              <div style="font-size: 28px; font-weight: 800; color: #4d7c0f; line-height: 1.2;">${Math.min(alerts.length, 5)}</div>
              <div style="font-size: 13px; color: #78716c; margin-top: 4px;">Nổi bật</div>
            </td>
            <td width="33%" style="text-align: center; background: #fefce8; border: 1px solid #fde68a; border-radius: 10px; padding: 16px 8px;">
              <div style="font-size: 28px; font-weight: 800; color: #ca8a04; line-height: 1.2;">${alerts.filter((a) => a.classification?.includes("I")).length}</div>
              <div style="font-size: 13px; color: #78716c; margin-top: 4px;">Mức độ cao</div>
            </td>
          </tr>
        </table>
      </div>

      <div class="content">
        <h2 style="margin-top: 26px;">📋 Cảnh báo nổi bật</h2>

        ${alertsHTML}

        ${
          alertCount > 5
            ? `
        <div style="text-align: center; padding: 28px 20px; background: linear-gradient(135deg, #fef9c3 0%, #ecfccb 100%); border: 1px solid #fde68a; border-radius: 10px; margin-top: 8px;">
          <p style="color: #1a2e05; font-size: 15px; margin: 0 0 14px 0;">
            <strong>Còn ${alertCount - 5} cảnh báo khác</strong> chưa hiển thị trong email này.
          </p>
          <a href="https://www.veximglobal.com/fda-tracker" class="btn">Xem tất cả cảnh báo →</a>
        </div>`
            : ""
        }

        <div class="panel-lime" style="margin-top: 24px;">
          <h3 style="color: #3f6212; margin: 0 0 10px 0; font-size: 16px;">💡 Lưu ý quan trọng</h3>
          <ul style="color: #44403c; margin: 0; padding-left: 20px; font-size: 14px;">
            <li style="margin-bottom: 6px;">Kiểm tra kỹ sản phẩm trước khi sử dụng</li>
            <li style="margin-bottom: 6px;">Thông tin từ FDA.gov, cập nhật realtime</li>
            <li style="margin-bottom: 0;">Liên hệ Vexim Global để tư vấn chi tiết</li>
          </ul>
        </div>
      </div>

      ${emailFooter(
        `<p style="margin-top: 14px;">
          <a href="https://www.veximglobal.com/fda-tracker">Xem trên web</a> &nbsp;|&nbsp;
          <a href="${params.unsubscribeLink}">Hủy đăng ký</a>
        </p>`,
      )}
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
    ${EMAIL_BASE_STYLE}
    .card { border: 3px solid #eab308; }
    .header { background: linear-gradient(135deg, #365314 0%, #1a2e05 100%); }
    .urgent-badge { display: inline-block; background: #fef9c3; color: #854d0e; padding: 7px 16px; border-radius: 20px; font-weight: 700; font-size: 13px; margin-top: 12px; border: 1px solid #fde68a; }
    .alert-box { background: #fefce8; border: 2px solid #fde68a; border-left: 6px solid #eab308; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .alert-box h2 { color: #713f12; margin: 0 0 12px 0; font-size: 20px; line-height: 1.4; }
    .detail-item { background: #f8faf3; border: 1px solid #e6e9dd; border-left: 4px solid #84cc16; padding: 12px 16px; border-radius: 8px; margin-bottom: 10px; font-size: 14px; color: #57534e; }
    .detail-item strong { color: #3f6212; }
  </style>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="accent-bar"></div>
      <div class="header">
        <span class="brand">Vexim Global · FDA Tracker</span>
        <h1>🚨 CẢNH BÁO FDA KHẨN CẤP</h1>
        <span class="urgent-badge">⚡ THÔNG BÁO NGAY LẬP TỨC</span>
      </div>

      <div class="content">
        <p style="font-size: 15px; margin-top: 0;">Có một cảnh báo FDA mới vừa được phát hành:</p>

        <div class="alert-box">
          <h2>${alert.title}</h2>
          <p style="margin: 0; color: #854d0e; font-size: 15px; font-weight: 600;">⚠️ ${alert.criticalInfo}</p>
        </div>

        ${
          alert.aiSummary
            ? `
        <div class="panel-lime" style="margin: 20px 0;">
          <h3 style="color: #3f6212; margin: 0 0 8px 0; font-size: 17px;">🤖 Tóm tắt AI</h3>
          <p style="margin: 0; color: #3f6212; font-size: 14px;">${alert.aiSummary}</p>
        </div>`
            : ""
        }

        <div style="margin: 20px 0;">
          ${alert.date ? `<div class="detail-item"><strong>📅 Ngày:</strong> ${new Date(alert.date).toLocaleDateString("vi-VN")}</div>` : ""}
          ${alert.manufacturer ? `<div class="detail-item"><strong>🏭 Nhà sản xuất:</strong> ${alert.manufacturer}</div>` : ""}
          ${alert.classification ? `<div class="detail-item"><strong>⚠️ Phân loại:</strong> ${alert.classification}</div>` : ""}
          ${alert.distributionPattern ? `<div class="detail-item"><strong>🌍 Phân phối:</strong> ${alert.distributionPattern}</div>` : ""}
        </div>

        <div style="text-align: center; padding: 22px 20px; background: linear-gradient(135deg, #fef9c3 0%, #ecfccb 100%); border: 1px solid #fde68a; border-radius: 10px; margin: 24px 0;">
          <p style="color: #1a2e05; margin: 0 0 14px 0; font-weight: 700; font-size: 15px;">⚡ Hành động ngay để đảm bảo an toàn</p>
          <a href="https://www.veximglobal.com/fda-tracker" class="btn btn-yellow">Xem chi tiết →</a>
        </div>

        <div style="background: #f7fee7; border: 1px solid #d9f99d; padding: 14px 18px; border-radius: 8px;">
          <p style="color: #44403c; font-size: 14px; margin: 0;">
            <strong>Cần tư vấn?</strong> Liên hệ ngay Vexim Global: <a href="tel:0373685634" style="color: #4d7c0f; font-weight: 700;">0373 685 634</a>
          </p>
        </div>
      </div>

      ${emailFooter(
        `<p style="margin-top: 14px;"><a href="${params.unsubscribeLink}">Hủy cảnh báo khẩn cấp</a></p>`,
      )}
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
  <style>${EMAIL_BASE_STYLE}</style>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="accent-bar"></div>
      <div style="background: #ffffff; padding: 48px 40px 40px 40px; text-align: center;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: #f7fee7; border: 1px solid #d9f99d; margin: 0 auto 20px auto; text-align: center; line-height: 70px; font-size: 34px;">✅</div>
        <h1 style="color: #1c1917; font-size: 24px; margin: 0 0 14px 0;">Đã hủy đăng ký thành công</h1>
        <p style="color: #57534e; font-size: 15px; margin: 0 0 10px 0;">Bạn sẽ không còn nhận được cảnh báo FDA từ Vexim Global nữa.</p>
        <p style="color: #78716c; font-size: 14px; margin: 0 0 24px 0;">Nếu bạn muốn đăng ký lại, bạn có thể quay lại bất cứ lúc nào.</p>
        <a href="https://www.veximglobal.com/fda-tracker" class="btn">Đăng ký lại</a>
        <p style="margin: 30px 0 0 0; font-size: 14px; color: #78716c;">Cảm ơn bạn đã tin tưởng Vexim Global!</p>
      </div>

      ${emailFooter()}
    </div>
  </div>
</body>
</html>
  `.trim()
}
