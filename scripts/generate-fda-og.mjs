// Branded social card, not a photo of a real client or an FDA-issued document.
import sharp from "sharp"
import { mkdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const logo = readFileSync(path.join(root, "public/logo.png")).toString("base64")
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#10233e"/>
<rect x="0" y="0" width="1200" height="10" fill="#f5ad36"/>
<circle cx="1160" cy="550" r="240" fill="#193656"/>
<circle cx="1160" cy="550" r="180" fill="none" stroke="#2a4c70" stroke-width="2"/>
<rect x="936" y="48" width="204" height="142" rx="12" fill="#fff"/>
<image x="951" y="58" width="174" height="122" href="data:image/png;base64,${logo}"/>
<g font-family="DejaVu Sans,Arial,sans-serif">
<text x="74" y="109" fill="#b7c8dc" font-size="24" font-weight="700" letter-spacing="3">VEXIM GLOBAL</text>
<text x="70" y="278" fill="#fff" font-size="82" font-weight="700">Đăng ký FDA</text>
<text x="74" y="353" fill="#f5ad36" font-size="34">Hồ sơ · Chi phí · US Agent</text>
<text x="74" y="423" fill="#d4dfec" font-size="27">Tư vấn cho doanh nghiệp xuất khẩu sang Mỹ</text>
<rect x="74" y="470" width="680" height="1" fill="#3a5270"/>
<text x="74" y="525" fill="#d4dfec" font-size="24">Tử Tế - Tận Tâm - Trách Nhiệm</text>
<text x="74" y="576" fill="#9db3cd" font-size="23">www.veximglobal.com/services/fda</text>
</g></svg>`
mkdirSync(path.join(root, "public/images"), { recursive: true })
const output = path.join(root, "public/images/og-fda.png")
await sharp(Buffer.from(svg)).png({ palette: true }).toFile(output)
const metadata = await sharp(output).metadata()
console.log(`FDA OG: ${metadata.width}×${metadata.height}, ${readFileSync(output).length} bytes`)
