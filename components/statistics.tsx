import { AlertCircle } from "lucide-react"

const stats = [
  {
    number: "500+",
    label: "Doanh nghiệp đã hợp tác",
  },
  {
    number: "10+",
    label: "Năm kinh nghiệm",
  },
  {
    number: "98%",
    label: "Hồ sơ được chấp thuận",
  },
  {
    number: "24/7",
    label: "Hỗ trợ khẩn cấp",
  },
]

// Thêm phần thống kê vấn đề thường gặp
const commonIssues = [
  {
    issue: "Hồ sơ FDA bị từ chối do thiếu Process Filing",
    percentage: "35%",
    description: "Nhiều doanh nghiệp không biết thực phẩm đóng hộp cần nộp Process Filing (SID) theo 21 CFR 108.",
  },
  {
    issue: "Container bị giữ tại cảng Trung Quốc vì thiếu GACC",
    percentage: "28%",
    description: "Xuất khẩu nông sản, thủy sản sang Trung Quốc bắt buộc phải có Mã GACC đăng ký tại GACC.",
  },
  {
    issue: "Sản phẩm bị thu hồi do ghi nhãn sai quy định",
    percentage: "22%",
    description: "Ghi nhãn không đúng theo FDA Nutrition Labeling hoặc MFDS Labeling Standards.",
  },
  {
    issue: "Thiếu US Agent dẫn đến FDA Warning Letter",
    percentage: "15%",
    description: "FDA yêu cầu US Agent để nhận các thông báo pháp lý. Thiếu US Agent có thể bị Warning Letter.",
  },
]

export function Statistics() {
  return (
    <div>
      {/* Phần thống kê thành tích */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Con số nói lên hiệu quả</h2>
            <p className="text-white/90 text-lg">Kết quả thực tế từ hơn 10 năm kinh nghiệm</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-yellow-400 drop-shadow-lg">{stat.number}</div>
                <div className="text-lg text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phần thống kê vấn đề phát sinh */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Vấn đề pháp lý phổ biến khi xuất khẩu</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Dựa trên phân tích hơn 1.000 trường hợp doanh nghiệp gặp khó khăn trong xuất nhập khẩu
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {commonIssues.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-destructive">
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-3xl font-bold text-destructive flex-shrink-0">{item.percentage}</div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">{item.issue}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-primary font-semibold">
              Vexim Global giúp bạn tránh hoàn toàn những rủi ro này bằng quy trình tư vấn chuyên nghiệp
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
