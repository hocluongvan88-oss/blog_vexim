import { AlertTriangle, Scale, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"

export function LegalDisclaimer() {
  return (
    <section className="py-12 bg-gray-50 border-t-2 border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-bold text-primary">Legal Disclaimer - Thông báo quan trọng</h3>
          </div>

          <Card className="p-6 bg-yellow-50 border-l-4 border-yellow-600">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Giới hạn trách nhiệm pháp lý</h4>
                <div className="text-sm text-gray-700 space-y-2 leading-relaxed">
                  <p>
                    <strong>1. Thông tin tham khảo:</strong> Nội dung trên website chỉ mang tính tham khảo và giáo
                    dục. Quy định FDA, GACC, MFDS có thể thay đổi mà không báo trước. Khách hàng cần xác minh trực
                    tiếp với cơ quan chính thức (FDA.gov, customs.gov.cn, mfds.go.kr) trước khi ra quyết định kinh
                    doanh.
                  </p>
                  <p>
                    <strong>2. Không đảm bảo kết quả:</strong> Vexim Global không bảo đảm 100% hồ sơ được chấp thuận.
                    Quyết định phê duyệt/từ chối thuộc thẩm quyền của FDA, GACC, MFDS và các cơ quan quản lý nước
                    ngoài. Chúng tôi cam kết nỗ lực tối đa để chuẩn bị hồ sơ tuân thủ đầy đủ các quy định hiện hành.
                  </p>
                  <p>
                    <strong>3. Giới hạn trách nhiệm:</strong> Vexim Global không chịu trách nhiệm về (a) quyết định từ
                    chối từ cơ quan quản lý do nguyên nhân khách quan, (b) thay đổi quy định sau khi hồ sơ được nộp,
                    (c) thông tin không chính xác do khách hàng cung cấp, (d) các khoản lỗ liên quan đến chậm trễ vận
                    chuyển, demurrage, hoặc opportunity cost.
                  </p>
                  <p>
                    <strong>4. Cam kết về thời gian:</strong> Timeline ước tính (FDA 5-10 ngày, GACC 8-12 tuần, MFDS
                    10-16 tuần) phụ thuộc vào (a) độ đầy đủ và chính xác của hồ sơ khách hàng cung cấp, (b) thời gian
                    phản hồi của cơ quan quản lý, (c) sự hợp tác và response time của khách hàng với các yêu cầu bổ
                    sung. Chúng tôi cam kết theo dõi sát và thông báo tiến độ thường xuyên.
                  </p>
                  <p>
                    <strong>5. Professional advice:</strong> Thông tin trên website không thay thế tư vấn pháp lý
                    chuyên nghiệp. Đối với các trường hợp phức tạp, khách hàng nên tham khảo ý kiến luật sư chuyên về
                    international trade law và regulatory affairs.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Card className="p-4 bg-blue-50 border-l-4 border-blue-600">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-bold text-gray-900 mb-1 text-sm">Quyền sở hữu trí tuệ</h5>
                  <p className="text-xs text-gray-700">
                    Nội dung, hình ảnh, tài liệu trên website thuộc quyền sở hữu của Vexim Global. Nghiêm cấm sao
                    chép, phân phối mà không có sự đồng ý bằng văn bản.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-green-50 border-l-4 border-green-600">
              <div className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-bold text-gray-900 mb-1 text-sm">Luật áp dụng</h5>
                  <p className="text-xs text-gray-700">
                    Hợp đồng dịch vụ tuân thủ Luật Thương mại Việt Nam, Luật Bảo vệ quyền lợi người tiêu dùng. Tranh
                    chấp được giải quyết theo pháp luật Việt Nam tại Trọng tài Kinh tế Quốc tế Việt Nam (VIAC).
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Bằng việc sử dụng dịch vụ của Vexim Global, khách hàng xác nhận đã đọc, hiểu và đồng ý với các điều
              khoản trên.
            </p>
            <p className="mt-2">
              <strong>Cập nhật lần cuối:</strong> Tháng 1/2026 | <strong>Version:</strong> 2.0
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
