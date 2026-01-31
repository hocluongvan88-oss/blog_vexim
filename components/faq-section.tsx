"use client"

import { Card } from "@/components/ui/card"
import { Plus, Minus } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "Vexim Global có bao nhiêu năm kinh nghiệm trong lĩnh vực xuất nhập khẩu?",
    answer:
      "Tiền thân Vexim Global có hơn 10 năm kinh nghiệm trực tiếp tư vấn và hỗ trợ hàng trăm doanh nghiệp Việt Nam xuất khẩu sang các thị trường khó tính như Mỹ, EU, Hàn Quốc, Trung Quốc. Đội ngũ chuyên viên của chúng tôi đều được đào tạo bài bản về luật thương mại quốc tế và thường xuyên cập nhật các quy định mới nhất.",
  },
  {
    question: "Tôi cần chuẩn bị những gì khi đăng ký FDA cho sản phẩm thực phẩm?",
    answer:
      "Để đăng ký FDA, bạn cần chuẩn bị: (1) Giấy phép kinh doanh và các giấy tờ pháp lý của công ty, (2) Thông tin chi tiết về sản phẩm (thành phần, quy trình sản xuất, nhãn mác), (3) Chứng nhận ATTP hoặc các giấy chứng nhận chất lượng liên quan, (4) Thông tin nhà máy sản xuất. Đội ngũ Vexim sẽ hướng dẫn chi tiết và hỗ trợ hoàn thiện toàn bộ hồ sơ.",
  },
  {
    question: "Nền tảng truy xuất nguồn gốc tích hợp AI của Vexim hoạt động như thế nào?",
    answer:
      "Nền tảng của chúng tôi sử dụng công nghệ Blockchain để lưu trữ dữ liệu bất biến về nguồn gốc sản phẩm, kết hợp AI để phân tích và dự đoán rủi ro trong chuỗi cung ứng. Người tiêu dùng có thể quét mã QR trên sản phẩm để xem toàn bộ hành trình từ nguyên liệu đến thành phẩm. Đây là giải pháp tiên phong đầu tiên tại Việt Nam, giúp doanh nghiệp xây dựng lòng tin và tăng giá trị thương hiệu.",
  },
  {
    question: "Chi phí dịch vụ của Vexim Global như thế nào?",
    answer:
      "Chi phí dịch vụ phụ thuộc vào loại hình đăng ký, thị trường mục tiêu và độ phức tạp của sản phẩm. Vexim cam kết báo giá minh bạch, không phát sinh chi phí ẩn. Chúng tôi cung cấp báo giá chi tiết sau buổi tư vấn đầu tiên (miễn phí) và luôn tối ưu chi phí cho khách hàng. Hãy liên hệ để nhận báo giá cụ thể cho nhu cầu của bạn.",
  },
  {
    question: "Thời gian hoàn thành thủ tục đăng ký các giấy phép mất bao lâu?",
    answer:
      "Thời gian phụ thuộc vào từng loại giấy phép: FDA thường chỉ mất 2-8 ngày, GACC từ 2-4 tháng, MFDS từ 2-4 tháng. Vexim luôn tối ưu hóa quy trình và theo sát tiến độ để đảm bảo hoàn tất nhanh nhất có thể. Chúng tôi cũng cung cấp dịch vụ xử lý khẩn cấp khi cần thiết.",
  },
  {
    question: "Vexim có hỗ trợ sau khi doanh nghiệp đã nhận được giấy phép không?",
    answer:
      "Hoàn toàn có. Vexim cung cấp dịch vụ hậu mãi toàn diện bao gồm: tư vấn duy trì tuân thủ, hướng dẫn gia hạn giấy phép, hỗ trợ khi có thay đổi quy định, đào tạo nhân sự về quy định thị trường xuất khẩu. Chúng tôi luôn đồng hành cùng khách hàng trong suốt hành trình phát triển kinh doanh quốc tế.",
  },
  {
    question: "Dịch vụ Agent Hoa Kỳ của Vexim bao gồm những gì?",
    answer:
      "Dịch vụ Agent Hoa Kỳ bao gồm: đại diện pháp lý cho doanh nghiệp tại Mỹ, tuân thủ quy định FDA Vexim đóng vai trò cầu nối pháp lý chuyên trách, hỗ trợ doanh nghiệp tiếp nhận thông tin từ FDA và tư vấn tuân thủ các quy chuẩn kỹ thuật để tối ưu hóa quy trình xuất khẩu sang thị trường Hoa Kỳ",
  },
  {
    question: "Làm sao để bắt đầu làm việc với Vexim Global?",
    answer:
      "Rất đơn giản! Bạn chỉ cần: (1) Liên hệ với chúng tôi qua hotline 0373685634 hoặc điền form trên website, (2) Chúng tôi sẽ dựa vào nhu cầu của quý khách tư vấn miễn phí để chia sẻ nhu cầu, (3) Nhận báo giá và kế hoạch chi tiết, (4) Ký hợp đồng và bắt đầu quy trình. Đội ngũ Vexim sẵn sàng hỗ trợ bạn từ bước đầu tiên!",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Câu hỏi thường gặp
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Giải đáp những thắc mắc phổ biến về dịch vụ xuất nhập khẩu của Vexim Global
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-300">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-start justify-between gap-4 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-semibold text-primary text-lg leading-relaxed pr-4">{faq.question}</span>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-primary" />
                  ) : (
                    <Plus className="w-4 h-4 text-primary" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {faq.answer}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Vẫn còn thắc mắc?</p>
          <a
            href="#contact"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Liên hệ tư vấn miễn phí
          </a>
        </div>
      </div>
    </section>
  )
}
