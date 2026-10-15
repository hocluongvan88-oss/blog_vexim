// Generates a visual preview of all Vexim email templates (navy / neutral, light and dark mode)
// Usage: node scripts/generate-email-preview.mjs
// Output: public/email-preview/*.html (open index.html in a browser)

import { mkdirSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { loadEmailTemplates } from "./email-template-loader.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, "public", "email-preview")
mkdirSync(outDir, { recursive: true })
const { templates: T, cleanup } = loadEmailTemplates()

const EMAIL = "nguoidung@example.com"
const BASE = "https://www.veximglobal.com"

const sampleAlerts = [
  {
    title: "Thu hồi lô cá ngừ đóng hộp có vi khuẩn Listeria",
    criticalInfo: "Lô sản xuất 12/08/2026, sử dụng trước 30/09/2026 — nguy cơ nhiễm Listeria monocytogenes",
    aiSummary: "FDA yêu cầu thu hồi 42 tấn cá ngừ đóng hộp sản xuất tại Texas do phát hiện vi khuẩn Listeria. Người tiêu dùng không nên sử dụng lô sản xuất trong tháng 8/2026.",
    date: "2026-09-18",
    manufacturer: "Gulf Coast Canned Seafood LLC",
    classification: "Class I - nguy cơ gây tổn hại sức khỏe",
    category: "food",
  },
  {
    title: "Thu hồi viên sủi vitamin C liều cao hàm lượng không đạt",
    criticalInfo: "Hàm lượng vitamin C thực tế chỉ đạt 47% so với công bố",
    aiSummary: "Sản phẩm viên sủi vitamin C 1000mg do Sunrise Nutrition (California) sản xuất có hàm lượng hoạt chất thấp hơn nhiều so với nhãn. Không gây nguy hiểm trực tiếp nhưng vi phạm tiêu chuẩn chất lượng FDA.",
    date: "2026-09-17",
    manufacturer: "Sunrise Nutrition Inc.",
    classification: "Class II",
    category: "food",
  },
  {
    title: "Thu hồi kem dưỡng ẩm chứa chất gây ung thư nhóm 1",
    criticalInfo: "Chứa 1,4-dioxane vượt ngưỡng cho phép — sản phẩm tại thị trường Mỹ",
    aiSummary: "Một thương hiệu mỹ phẩm online thông báo thu hồi tự nguyện dòng kem dưỡng ẩm do phát hiện 1,4-dioxane (chất gây ung thư nhóm 1) vượt ngưỡng. Vexim lưu ý các lô hàng xuất sang thị trường Canada, EU.",
    date: "2026-09-16",
    manufacturer: "Beauty Glow Cosmetics",
    classification: "Class I - nguy cơ gây tổn hại sức khỏe",
    category: "cosmetics",
  },
  {
    title: "Cảnh báo: bột sắn dây đóng gói nhầm vào thực phẩm cho trẻ em",
    criticalInfo: "Lô 1.200 hộp, phân phối tại 3 tiểu bang",
    aiSummary: "Lỗi phân loại nguyên liệu dẫn đến bột sắn dây không đạt chuẩn xuất hiện trong hỗn hợp thực phẩm cho trẻ em dưới 3 tuổi. Phụ huynh cần kiểm tra hạn sử dụng in trên đáy hộp.",
    date: "2026-09-15",
    manufacturer: "Little Sprout Foods Co.",
    classification: "Class II",
    category: "food",
  },
  {
    title: "Thu hồi thực phẩm chức năng tăng cơ có chứa chất cấm",
    criticalInfo: "Phát hiện methylhexanamine — chất không được phép trong thực phẩm",
    aiSummary: "Thực phẩm bổ sung cho người tập gym chứa methylhexanamine (chất kích thích thần kinh cấm dùng trong thực phẩm) có thể gây tim đập nhanh, tăng huyết áp. FDA khuyến cáo ngừng sử dụng ngay.",
    date: "2026-09-14",
    manufacturer: "MaxPro Supplement",
    classification: "Class I - nguy cơ gây tổn hại sức khỏe",
    category: "food",
  },
  {
    title: "Cảnh báo hạt điều rang muối nhiễm ôi dầu",
    criticalInfo: "Lô hàng 800kg, sản xuất 25/07/2026",
    aiSummary: "Mẫu thử cho thấy chỉ số acid tự do vượt ngưỡng, sản phẩm có mùi ôi. Doanh nghiệp xuất khẩu cần đối chiếu mã lô của nhà cung cấp.",
    date: "2026-09-13",
    manufacturer: "NutriCoast Traders",
    classification: "Class II",
    category: "food",
  },
]

const gaccParams = {
  companyName: "Công ty TNHH Thực phẩm An Việt",
  productName: "Cá basa phi lê đông lạnh",
  hsCode: "0303.54.90",
  submissionId: "a1b2c3d4e5f6a7b8",
  submittedAt: "19/09/2026 14:30",
  email: "xuatkhau@example.com",
  phone: "0912 345 678",
  taxCode: "0101 234 567",
}

const consultationParams = {
  name: "Nguyễn Thu Hà",
  phone: "0934 567 890",
  email: "khachhang@example.com",
  serviceName: "Đăng ký FDA (Mỹ)",
  product: "Mật ong hoa cà phê 500g",
  description: "Công ty tôi có 2 dòng sản phẩm (mật ong + trà hoa cúc) muốn xuất sang Mỹ.\nVui lòng tư vấn hồ sơ và thời gian dự kiến.",
}

const pages = [
  {
    file: "01-xac-nhan-dang-ky-fda",
    title: "1. Xác nhận đăng ký cảnh báo FDA",
    html: T.getVerificationEmailHTML({
      email: EMAIL,
      verificationLink: `${BASE}/api/fda/verify?email=${encodeURIComponent(EMAIL)}&token=DEMO_TOKEN_123`,
      unsubscribeLink: `${BASE}/fda-tracker/unsubscribe?email=${encodeURIComponent(EMAIL)}&token=DEMO_TOKEN_123`,
    }),
  },
  {
    file: "02-ban-tin-canh-bao",
    title: "2. Bản tin cảnh báo FDA (hàng ngày / hàng tuần)",
    html: T.getAlertEmailHTML({
      email: EMAIL,
      alerts: sampleAlerts,
      alertCount: 12,
      frequency: "daily",
      unsubscribeLink: `${BASE}/fda-tracker/unsubscribe?email=${encodeURIComponent(EMAIL)}&token=DEMO_TOKEN_123`,
    }),
  },
  {
    file: "03-canh-bao-khan-cap",
    title: "3. Cảnh báo FDA khẩn cấp",
    html: T.getImmediateAlertEmailHTML({
      email: EMAIL,
      alert: sampleAlerts[0],
      unsubscribeLink: `${BASE}/fda-tracker/unsubscribe?email=${encodeURIComponent(EMAIL)}&token=DEMO_TOKEN_123`,
    }),
  },
  {
    file: "04-huy-dang-ky",
    title: "4. Xác nhận hủy đăng ký",
    html: T.getUnsubscribeEmailHTML({ email: EMAIL }),
  },
  {
    file: "05-xac-nhan-ho-so-gacc",
    title: "5. Xác nhận hồ sơ GACC (khách hàng)",
    html: T.getGACCUserConfirmationHTML(gaccParams),
  },
  {
    file: "06-thong-bao-gacc-admin",
    title: "6. Thông báo hồ sơ GACC mới (admin)",
    html: T.getGACCAdminNotificationHTML(gaccParams),
  },
  {
    file: "07-nhac-no-gia-han-fda",
    title: "7. Nhắc nhở gia hạn đăng ký FDA",
    html: T.getFdaRenewalReminderHTML({
      companyName: gaccParams.companyName,
      contactName: "Trần Quốc Bảo",
      registrationType: "Cơ sở sản xuất thực phẩm",
      registrationNumber: "D-1234567",
      expirationDate: "15/01/2027",
      monthsBefore: 4,
    }),
  },
  {
    file: "08-nhac-no-gia-han-us-agent",
    title: "8. Nhắc nhở gia hạn US Agent",
    html: T.getAgentRenewalReminderHTML({
      companyName: gaccParams.companyName,
      contactName: "Trần Quốc Bảo",
      agentCompanyName: "US Trade Partners LLC",
      agentName: "Ms. Linda Parker",
      contractEndDate: "15/01/2027",
      contractYears: 1,
    }),
  },
  {
    file: "09-xac-nhan-tu-van-khach-hang",
    title: "9. Xác nhận đăng ký tư vấn (khách hàng)",
    html: T.getConsultationCustomerHTML(consultationParams),
  },
  {
    file: "10-thong-cao-lead-moi-admin",
    title: "10. Lead mới từ website (admin)",
    html: T.getConsultationAdminHTML(consultationParams),
  },
]

// Write individual pages
for (const p of pages) {
  writeFileSync(path.join(outDir, `${p.file}.html`), p.html)
}

// Write index page
const cards = pages
  .map(
    (p, i) => `
      <div class="card">
        <div class="card-head">
          <span class="num">${String(i + 1).padStart(2, "0")}</span>
          <div>
            <div class="card-title">${p.title}</div>
            <div class="card-file">${p.file}.html</div>
          </div>
          <a class="open" href="${p.file}.html" target="_blank">Mở &times; toàn màn hình</a>
        </div>
        <iframe src="${p.file}.html" loading="lazy" title="${p.title}"></iframe>
      </div>`,
  )
  .join("\n")

const indexHtml = `<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow"><title>Vexim — xem trước email</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f1f5f9;color:#243247;font-family:Arial,sans-serif}header{padding:28px;max-width:1200px;margin:auto}h1{font-size:26px}p{line-height:1.6}label{font-size:14px}select{padding:10px;margin-left:8px} .grid{max-width:1400px;margin:auto;padding:16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:24px}.card{background:white;border:1px solid #dbe3ed;border-radius:8px;overflow:hidden}.card-head{padding:16px;display:flex;gap:12px;flex-wrap:wrap}.card-title{font-weight:bold}.card-file,.num{display:none}.open{color:#17365d;font-size:14px}iframe{width:100%;height:1000px;border:0;display:block;max-width:100%;margin:0 auto}
</style></head><body><header><h1>Vexim Global · Xem trước email</h1>
<p><strong>Dữ liệu minh họa, không phải cảnh báo FDA thật.</strong> Mẫu dùng nền trung tính, điểm nhấn navy và slogan “Tử Tế - Tận Tâm - Trách Nhiệm”.</p>
<p>Chế độ tối theo cài đặt hệ thống/trình duyệt. Đây là bản xem trước HTML, không thay thế kiểm thử Apple Mail/Gmail trên iPhone thật.</p>
<label>Chiều rộng email <select id="width"><option value="100%">Co giãn</option><option value="320px">320px</option><option value="375px">iPhone 375px</option><option value="390px">iPhone 390px</option><option value="430px">iPhone 430px</option></select></label>
</header><div class="grid">${cards}</div>
<script>document.getElementById('width').addEventListener('change', function(){document.querySelectorAll('iframe').forEach(frame=>frame.style.width=this.value)})</script>
</body></html>`

writeFileSync(path.join(outDir, "index.html"), indexHtml)
cleanup()
console.log(`✓ Generated ${pages.length} email previews + index.html in public/email-preview/`)
