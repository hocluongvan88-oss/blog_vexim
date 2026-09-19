// Generates a visual preview of all Vexim email templates (yellow-green design)
// Usage: node scripts/generate-email-preview.mjs
// Output: public/email-preview/*.html (open index.html in a browser)

import ts from "typescript"
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import path from "node:path"

const require = createRequire(import.meta.url)
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, "public", "email-preview")
const buildDir = path.join(root, "scripts", ".email-preview-build")
rmSync(buildDir, { recursive: true, force: true })
mkdirSync(buildDir, { recursive: true })
mkdirSync(outDir, { recursive: true })

// Transpile each self-contained template lib to CJS
const templateFiles = {
  emailTemplates: "lib/email-templates.tsx",
  emailGacc: "lib/email-gacc.tsx",
  emailFdaRegistration: "lib/email-fda-registration.tsx",
  emailConsultation: "lib/email-consultation.tsx",
}

const T = {}
for (const [key, rel] of Object.entries(templateFiles)) {
  const source = readFileSync(path.join(root, rel), "utf8")
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  })
  const outPath = path.join(buildDir, `${key}.js`)
  writeFileSync(outPath, result.outputText)
  Object.assign(T, require(outPath))
}

const EMAIL = "doanhan@veximglobal.vn"
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
  email: "expora@anvietfood.vn",
  phone: "0912 345 678",
  taxCode: "0101 234 567",
}

const consultationParams = {
  name: "Nguyễn Thu Hà",
  phone: "0934 567 890",
  email: "ha.nguyen@doanhnghiep.vn",
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
      unsubscribeLink: `${BASE}/api/fda/subscribe?email=${encodeURIComponent(EMAIL)}&token=DEMO_TOKEN_123`,
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
      unsubscribeLink: `${BASE}/api/fda/subscribe?email=${encodeURIComponent(EMAIL)}&token=DEMO_TOKEN_123`,
    }),
  },
  {
    file: "03-canh-bao-khan-cap",
    title: "3. Cảnh báo FDA khẩn cấp",
    html: T.getImmediateAlertEmailHTML({
      email: EMAIL,
      alert: sampleAlerts[0],
      unsubscribeLink: `${BASE}/api/fda/subscribe?email=${encodeURIComponent(EMAIL)}&token=DEMO_TOKEN_123`,
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
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vexim Global — Thư viện email (Vàng Xanh)</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #1c2410; color: #eef2e2; font-family: 'Segoe UI', Arial, sans-serif; }
    .topbar {
      position: sticky; top: 0; z-index: 10;
      background: linear-gradient(90deg, #365314, #4d7c0f 55%, #65a30d);
      padding: 18px 28px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
      border-bottom: 3px solid #facc15;
    }
    .topbar .logo { font-weight: 800; letter-spacing: 2px; font-size: 15px; color: #fef9c3; }
    .topbar h1 { font-size: 17px; margin: 0; font-weight: 700; color: white; }
    .topbar .swatches { display: flex; gap: 6px; margin-left: auto; }
    .topbar .sw { width: 22px; height: 22px; border-radius: 6px; border: 1px solid rgba(255,255,255,.35); }
    .palette-note { width: 100%; font-size: 12px; color: #d9f99d; margin-top: 2px; }
    .grid {
      max-width: 1400px; margin: 0 auto; padding: 24px;
      display: grid; grid-template-columns: repeat(auto-fit, minmax(680px, 1fr)); gap: 24px;
    }
    @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } }
    .card { background: #242e14; border: 1px solid #3a4a1e; border-radius: 14px; overflow: hidden; }
    .card-head {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px;
      background: #2c3818; border-bottom: 1px solid #3a4a1e;
    }
    .num {
      background: #facc15; color: #1a2e05; font-weight: 800; font-size: 12px;
      border-radius: 8px; padding: 4px 8px;
    }
    .card-title { font-weight: 700; font-size: 14px; }
    .card-file { font-size: 11px; color: #9db078; }
    .open { margin-left: auto; font-size: 12px; color: #bef264; text-decoration: none; white-space: nowrap; }
    .open:hover { text-decoration: underline; }
    iframe { width: 100%; height: 980px; border: 0; display: block; background: #f4f6ec; }
  </style>
</head>
<body>
  <div class="topbar">
    <span class="logo">VEXIM GLOBAL</span>
    <h1>📧 Thư viện email — thiết kế lại ton màu vàng xanh</h1>
    <div class="swatches">
      <span class="sw" style="background:#facc15" title="#facc15"></span>
      <span class="sw" style="background:#eab308" title="#eab308"></span>
      <span class="sw" style="background:#a3e635" title="#a3e635"></span>
      <span class="sw" style="background:#84cc16" title="#84cc16"></span>
      <span class="sw" style="background:#4d7c0f" title="#4d7c0f"></span>
      <span class="sw" style="background:#365314" title="#365314"></span>
    </div>
    <div class="palette-note">
      Palette: vàng #facc15 → #eab308 · xanh vàng #a3e635 → #84cc16 → #4d7c0f · xanh rêu đậm #365314 (bản tin khẩn) · nền #f4f6ec
    </div>
  </div>
  <div class="grid">
${cards}
  </div>
</body>
</html>`

writeFileSync(path.join(outDir, "index.html"), indexHtml)
rmSync(buildDir, { recursive: true, force: true })
console.log(`✓ Generated ${pages.length} email previews + index.html in public/email-preview/`)
