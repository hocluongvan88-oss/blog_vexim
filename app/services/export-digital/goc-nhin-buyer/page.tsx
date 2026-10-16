import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { JsonLd } from "@/components/json-ld"
import { BUYER_CRITERIA, EXPORT_DIGITAL } from "@/lib/export-digital-content"
import { SITE_URL } from "@/lib/business-profile"
import { buildWebPageSchema } from "@/lib/schema"
import "../export-digital.css"

const path = `${EXPORT_DIGITAL.path}/goc-nhin-buyer`
const title = "Buyer nhìn website của bạn trong 30 giây đầu | Vexim"
export const metadata: Metadata = {
  title: { absolute: title },
  description:
    "Một khung tự kiểm tra thông tin doanh nghiệp xuất khẩu: sản phẩm, nhà máy, bằng chứng, năng lực và cách liên hệ — nhìn từ phía buyer.",
  alternates: { canonical: `${SITE_URL}${path}` },
}
export default function BuyerViewPage() {
  return (
    <div className="ed-page">
      <JsonLd
        id="buyer-guide-schema"
        data={buildWebPageSchema({
          path,
          name: title,
          description: "Khung tự kiểm tra website doanh nghiệp xuất khẩu từ góc nhìn buyer.",
        })}
      />
      <main className="ed-shell ed-reading">
        <Link href={EXPORT_DIGITAL.path} className="ed-text-link">
          <ArrowLeft size={16} />
          Vexim Export Digital
        </Link>
        <div className="ed-heading">
          <p className="ed-eyebrow">GÓC NHÌN BUYER</p>
          <h1>Buyer nhìn website của bạn trong 30 giây đầu</h1>
        </div>
        <p>
          Hãy thử mở website của bạn như một người chưa từng biết công ty. “30 giây” ở đây là một bài tập đọc nhanh,
          không phải số liệu nghiên cứu hay thời gian ra quyết định của mọi buyer.
        </p>
        <p>
          Người đọc có tìm được sản phẩm phù hợp, hiểu bạn là nhà sản xuất hay đơn vị thương mại, và biết phải liên hệ
          ai không? Trước khi bổ sung lời quảng cáo, hãy kiểm tra sáu câu hỏi này.
        </p>
        {BUYER_CRITERIA.map((criterion, index) => (
          <section key={criterion.title}>
            <h2>
              {index + 1}. {criterion.question}
            </h2>
            <p>{criterion.evidence}</p>
            <p>
              Chỉ đưa lên những thông tin còn đúng và có thể đối chiếu. Nếu chưa có đủ dữ liệu, ghi rõ phạm vi hoặc trao
              đổi với người phụ trách thay vì đưa ra một cam kết chung.
            </p>
          </section>
        ))}
        <section>
          <h2>Ba việc có thể làm trước</h2>
          <ol>
            <li>
              Viết lại phần đầu trang để người đọc biết ngay sản phẩm chính, quy cách và nhóm khách hàng bạn phục vụ.
            </li>
            <li>
              Đưa hồ sơ, ảnh nhà máy và bằng chứng vào đúng chỗ; kiểm tra tên doanh nghiệp, phạm vi áp dụng và thời hạn.
              Không trình bày số đăng ký FDA như chứng nhận chất lượng.
            </li>
            <li>
              Thử gửi yêu cầu báo giá trên điện thoại. Hãy chắc rằng form, email và đầu mối liên hệ thực sự hoạt động.
            </li>
          </ol>
        </section>
        <p>
          Website không thay thế gian hàng B2B, năng lực sản xuất hay quy trình bán hàng. Nó giúp buyer có thêm cơ sở để
          kiểm tra những điều bạn nói và bắt đầu một cuộc trao đổi cụ thể hơn.
        </p>
        <Link href={`${EXPORT_DIGITAL.path}#nhan-bao-cao`} className="ed-button ed-button-primary">
          Nhận báo cáo đánh giá miễn phí
          <ArrowRight size={17} />
        </Link>
      </main>
    </div>
  )
}
