import { AlertCircle } from "lucide-react"

const stats = [
  {
    number: "200+",
    label: "Doanh nghiệp đã hợp tác",
  },
  {
    number: "100%",
    label: "Ứng dụng công nghệ vào quy trình",
  },
  {
    number: "90%+",
    label: "Khách hàng hài lòng*",
  },
  {
    number: "24/7",
    label: "Hotline hỗ trợ",
  },
]

// Thêm phần thống kê vấn đề thường gặp
const commonIssues = [
  {
    issue: "FDA Import Alert - Thiếu Process Filing (SID)",
    percentage: "35%",
    description:
      "Low-acid canned foods (LACF) theo 21 CFR 108.35 bắt buộc Process Filing. Thiếu SID dẫn đến Detention Without Physical Examination (DWPE). Nhiều DN xuất khẩu hải sản đóng hộp gặp vấn đề này.",
  },
  {
    issue: "GACC Registration Code - Container detained",
    percentage: "28%",
    description:
      "GACC Decree 248/249 yêu cầu registration code cho nhà máy và sản phẩm. Xuất khẩu nông sản, thủy sản thiếu GACC Code bị từ chối tại cảng Trung Quốc, dẫn đến demurrage fees và loss of goods.",
  },
  {
    issue: "Product Recall - Non-compliant labeling",
    percentage: "22%",
    description:
      "FDA Nutrition Labeling (21 CFR 101), MFDS Labeling Standards không tuân thủ dẫn đến voluntary recall hoặc mandatory recall. Allergen labeling và nutritional facts errors là nguyên nhân phổ biến.",
  },
  {
    issue: "FDA Warning Letter - Thiếu US Agent",
    percentage: "15%",
    description:
      "21 CFR 1.33 yêu cầu US Agent cho foreign food facilities. Thiếu US Agent hoặc sai thông tin dẫn đến FDA Warning Letter, có thể progress thành Import Alert nếu không corrective actions kịp thời.",
  },
]

export function Statistics() {
  return (
    <div>
      {/* Phần thống kê thành tích */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Con số nói lên sự tận tâm</h2>
            <p className="text-white/90 text-lg">Kết quả thực tế đồng hành cùng doanh nghiệp Việt</p>
            <p className="text-white/70 text-sm mt-2">
              *Dựa trên khảo sát phản hồi khách hàng. Mỗi hồ sơ khác nhau, kết quả phụ thuộc nhiều yếu tố
            </p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Top Compliance Violations - Phân tích thực tế
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Dựa trên case studies từ 500+ doanh nghiệp xuất khẩu Việt Nam (2020-2024)
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Nguồn: Internal compliance audit reports và public FDA/GACC enforcement data
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
            <p className="text-lg text-primary font-semibold mb-2">
              Vexim Global - Giảm thiểu compliance risks với quy trình kiểm tra chuyên sâu
            </p>
            <p className="text-sm text-muted-foreground">
              Chúng tôi thực hiện pre-submission review, mock inspections, và regulatory gap analysis để đảm bảo hồ sơ
              tuân thủ đầy đủ trước khi nộp
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
