import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Building2, FileText, CreditCard, ShieldCheck, Clock, ArrowRight, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thành lập LLC & Xin mã EIN tại Hoa Kỳ | Vexim Global",
  description:
    "Dịch vụ thành lập công ty LLC tại Mỹ và xin mã số thuế EIN từ IRS. Hỗ trợ doanh nghiệp Việt Nam có pháp nhân hợp pháp để nhập khẩu và kinh doanh tại thị trường Hoa Kỳ.",
  keywords: [
    "thành lập LLC",
    "LLC Mỹ",
    "mã số thuế EIN",
    "IRS EIN",
    "pháp nhân Hoa Kỳ",
    "FSVP Importer",
    "nhập khẩu thực phẩm Mỹ",
    "Form SS-4",
  ],
  alternates: {
    canonical: "/services/llc-ein",
  },
  openGraph: {
    title: "Thành lập LLC & Xin mã EIN tại Hoa Kỳ | Vexim Global",
    description:
      "Dịch vụ thành lập công ty LLC tại Mỹ và xin mã số thuế EIN từ IRS cho doanh nghiệp Việt Nam.",
    url: "/services/llc-ein",
    type: "website",
  },
}

export default function LLCEINPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                Pháp nhân Hoa Kỳ
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Thành lập LLC & Xin mã EIN
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Để trở thành FSVP Importer hoặc kinh doanh hợp pháp tại Mỹ, doanh nghiệp Việt Nam cần có pháp nhân 
                Hoa Kỳ (LLC) và mã số thuế liên bang (EIN). Vexim hỗ trợ toàn bộ quy trình từ A-Z.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>LLC: 3-7 ngày | EIN: 4-6 tuần</span>
                </div>
              </div>
              <ConsultationDialog
                trigger={
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Tư vấn thành lập LLC <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                }
              />
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/llc-formation-usa-business.jpg"
                alt="LLC Formation USA"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Need LLC & EIN */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Tại sao doanh nghiệp Việt cần LLC & EIN tại Mỹ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Theo quy định FSMA của FDA, FSVP Importer phải là pháp nhân Hoa Kỳ. LLC là hình thức phổ biến nhất 
              cho doanh nghiệp nước ngoài muốn có hiện diện hợp pháp tại Mỹ.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Đáp ứng FSVP</h3>
              <p className="text-muted-foreground leading-relaxed">
                FSVP Importer phải là U.S. owner hoặc consignee. Có LLC tại Mỹ cho phép doanh nghiệp Việt tự làm 
                FSVP Importer, kiểm soát toàn bộ quy trình nhập khẩu.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Mở tài khoản ngân hàng Mỹ</h3>
              <p className="text-muted-foreground leading-relaxed">
                Với LLC và EIN, bạn có thể mở tài khoản ngân hàng tại Mỹ (như Mercury, Relay), nhận thanh toán 
                trực tiếp từ khách hàng Mỹ, tránh phí chuyển đổi quốc tế.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Uy tín với đối tác Mỹ</h3>
              <p className="text-muted-foreground leading-relaxed">
                Có pháp nhân tại Mỹ tạo niềm tin với nhà nhập khẩu, nhà bán lẻ. Nhiều đối tác Mỹ chỉ làm việc 
                với công ty có địa chỉ và mã số thuế Hoa Kỳ.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Bán trên Amazon US</h3>
              <p className="text-muted-foreground leading-relaxed">
                Amazon FBA yêu cầu EIN để bán hàng. Có LLC giúp bạn đăng ký seller account chuyên nghiệp, 
                nhận thanh toán thuận tiện và tuân thủ thuế Mỹ.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* LLC vs EIN Explanation */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* LLC Card */}
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">LLC là gì?</h3>
                  <p className="text-muted-foreground">Limited Liability Company</p>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  LLC là loại hình công ty phổ biến nhất tại Mỹ cho doanh nghiệp nhỏ và vừa, đặc biệt với 
                  người nước ngoài. LLC kết hợp ưu điểm của công ty cổ phần (bảo vệ tài sản cá nhân) và 
                  doanh nghiệp tư nhân (linh hoạt về thuế).
                </p>
                <div className="border-t pt-4">
                  <h4 className="font-bold text-primary mb-3">Ưu điểm của LLC:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Bảo vệ tài sản cá nhân khỏi nợ công ty</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Không yêu cầu SSN - người nước ngoài có thể làm chủ 100%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Linh hoạt thuế: chọn pass-through hoặc corporation taxation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Ít yêu cầu báo cáo hơn corporation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* EIN Card */}
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">EIN là gì?</h3>
                  <p className="text-muted-foreground">Employer Identification Number</p>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  EIN là mã số thuế 9 chữ số do IRS (Internal Revenue Service) cấp cho doanh nghiệp tại Mỹ. 
                  EIN tương đương với mã số thuế doanh nghiệp tại Việt Nam, dùng để kê khai thuế, 
                  mở tài khoản ngân hàng, thuê nhân viên.
                </p>
                <div className="border-t pt-4">
                  <h4 className="font-bold text-primary mb-3">EIN được sử dụng để:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Mở tài khoản ngân hàng doanh nghiệp tại Mỹ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Kê khai thuế liên bang và tiểu bang</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Đăng ký FSVP Importer với FDA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Đăng ký Amazon Seller, các marketplace Mỹ</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Quy trình thành lập LLC & Xin EIN
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Vexim đồng hành cùng bạn qua từng bước, đảm bảo tuân thủ đầy đủ quy định của tiểu bang và IRS
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Tư vấn & Chọn tiểu bang",
                description:
                  "Phân tích nhu cầu kinh doanh, tư vấn tiểu bang phù hợp (Delaware, Wyoming, Florida phổ biến cho người nước ngoài). Mỗi tiểu bang có phí và yêu cầu khác nhau.",
                duration: "1-2 ngày",
              },
              {
                step: "02",
                title: "Chuẩn bị hồ sơ LLC",
                description:
                  "Soạn Articles of Organization, Operating Agreement. Xác định tên công ty (name availability check), địa chỉ Registered Agent tại tiểu bang đăng ký.",
                duration: "2-3 ngày",
              },
              {
                step: "03",
                title: "Nộp hồ sơ thành lập LLC",
                description:
                  "Nộp Articles of Organization lên Secretary of State. Nhận Certificate of Formation xác nhận LLC được thành lập hợp pháp.",
                duration: "3-7 ngày (tùy tiểu bang)",
              },
              {
                step: "04",
                title: "Xin mã EIN từ IRS",
                description:
                  "Hoàn thành Form SS-4, nộp lên IRS qua fax hoặc mail. Người nước ngoài không có SSN vẫn đủ điều kiện xin EIN qua quy trình đặc biệt.",
                duration: "4-6 tuần",
              },
              {
                step: "05",
                title: "Nhận EIN & Hoàn tất",
                description:
                  "Nhận thư xác nhận CP 575 từ IRS chứa mã EIN. Hướng dẫn mở tài khoản ngân hàng Mỹ và các bước tiếp theo cho kinh doanh.",
                duration: "Ngay sau khi nhận",
              },
            ].map((process, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{process.step}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <h3 className="text-xl font-bold text-primary">{process.title}</h3>
                      <span className="text-sm text-accent font-medium mt-2 md:mt-0">{process.duration}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* State Comparison */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              So sánh các tiểu bang phổ biến
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Mỗi tiểu bang có ưu nhược điểm riêng. Vexim tư vấn lựa chọn phù hợp với mục tiêu kinh doanh của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 border-2 border-accent">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-primary">Wyoming</h3>
                <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm mt-2">
                  Phổ biến nhất
                </span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Không thuế thu nhập tiểu bang</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Phí thành lập: ~$100/năm</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Bảo mật cao - không công khai chủ sở hữu</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Xử lý nhanh 1-2 ngày</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-primary">Delaware</h3>
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mt-2">
                  Cho doanh nghiệp lớn
                </span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Luật doanh nghiệp phát triển nhất</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Court of Chancery chuyên về business</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Phí: ~$300/năm (Franchise Tax)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Uy tín với nhà đầu tư</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-primary">Florida</h3>
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mt-2">
                  Có văn phòng thực
                </span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Không thuế thu nhập cá nhân</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Phí: ~$150/năm</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Gần các cảng nhập khẩu lớn</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm">Phù hợp nếu có hoạt động thực tế</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 border-l-4 border-yellow-500 bg-yellow-50/50">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Lưu ý quan trọng cho doanh nghiệp Việt Nam</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-yellow-600">1.</span>
                      <span>
                        <strong>Không cần SSN/ITIN:</strong> Người nước ngoài có thể xin EIN mà không cần số an sinh 
                        xã hội Mỹ. IRS có quy trình riêng cho foreign-owned entities.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-yellow-600">2.</span>
                      <span>
                        <strong>Registered Agent bắt buộc:</strong> LLC phải có Registered Agent với địa chỉ thực tại 
                        tiểu bang đăng ký. Vexim cung cấp dịch vụ Registered Agent.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-yellow-600">3.</span>
                      <span>
                        <strong>Nghĩa vụ thuế:</strong> Dù không có hoạt động tại Mỹ, LLC vẫn có thể phải nộp báo cáo 
                        thuế hàng năm (Form 5472, 1120). Cần tư vấn kế toán thuế.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-yellow-600">4.</span>
                      <span>
                        <strong>Annual Report:</strong> Hầu hết tiểu bang yêu cầu nộp Annual Report và phí duy trì 
                        hàng năm. Không nộp sẽ bị thu hồi LLC.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Dịch vụ trọn gói LLC & EIN
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-accent mb-2">$499</div>
              <h3 className="text-xl font-bold text-primary mb-3">Thành lập LLC</h3>
              <ul className="text-left space-y-2 text-muted-foreground text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Articles of Organization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Operating Agreement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Registered Agent 1 năm</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Certificate of Formation</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-accent">
              <div className="text-4xl font-bold text-accent mb-2">$299</div>
              <h3 className="text-xl font-bold text-primary mb-3">Xin mã EIN</h3>
              <ul className="text-left space-y-2 text-muted-foreground text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Hoàn thành Form SS-4</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Nộp hồ sơ lên IRS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Theo dõi trạng thái</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Nhận thư CP 575</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-primary text-white">
              <div className="text-4xl font-bold text-yellow-400 mb-2">$699</div>
              <h3 className="text-xl font-bold mb-3">Combo LLC + EIN</h3>
              <ul className="text-left space-y-2 text-white/90 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Tất cả dịch vụ LLC</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Tất cả dịch vụ EIN</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Tiết kiệm $99</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Hỗ trợ mở bank account</span>
                </li>
              </ul>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            * Chưa bao gồm phí nộp tiểu bang (thường $50-300 tùy tiểu bang). Liên hệ để nhận báo giá chi tiết.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Sẵn sàng có pháp nhân tại Hoa Kỳ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Liên hệ ngay để được tư vấn chi tiết về thành lập LLC và xin EIN. 
            Vexim đồng hành cùng bạn từ A-Z.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Đăng ký tư vấn miễn phí
                </Button>
              }
            />
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Xem dịch vụ FSVP Importer
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
