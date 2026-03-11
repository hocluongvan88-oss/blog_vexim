import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ScanLine,
  Database,
  Zap,
  Shield,
  FileCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Brain,
  FileText,
  BadgeCheck,
  Sparkles,
} from "lucide-react"
import ConsultationDialog from "@/components/consultation-dialog"
import Link from "next/link"

const features = [
  {
    icon: Brain,
    title: "AI phân tích thông minh",
    description:
      "Sử dụng Vision AI và OCR để trích xuất toàn bộ nội dung nhãn, sau đó đối chiếu với bộ quy định 21 CFR.",
  },
  {
    icon: Database,
    title: "5.346 vi phạm thực tế",
    description:
      "Cơ sở dữ liệu Warning Letters, Recall và Import Alerts được cập nhật hàng tuần từ FDA.gov.",
  },
  {
    icon: Clock,
    title: "Kết quả trong 2 phút",
    description:
      "Quét nhanh, trả về báo cáo chi tiết với mã CFR cụ thể và hướng dẫn khắc phục từng lỗi.",
  },
  {
    icon: Shield,
    title: "Chuyên gia rà soát",
    description:
      "FDA Compliance Specialist xác nhận kết quả AI, bổ sung nhận định chuyên sâu từ kinh nghiệm thực chiến.",
  },
]

const industries = [
  {
    title: "Thực phẩm",
    regulation: "21 CFR Part 101",
    count: "1.247",
  },
  {
    title: "Mỹ phẩm",
    regulation: "21 CFR Part 701",
    count: "312",
  },
  {
    title: "TPCN",
    regulation: "21 CFR Part 111",
    count: "589",
  },
  {
    title: "OTC",
    regulation: "21 CFR Part 801",
    count: "198",
  },
]

const steps = [
  {
    step: "01",
    title: "Tải nhãn lên",
    description: "Chụp ảnh hoặc upload file nhãn sản phẩm (JPG, PNG, PDF).",
  },
  {
    step: "02",
    title: "AI quét & phân tích",
    description: "Đối chiếu với 5.346 vi phạm và quy định 21 CFR liên quan.",
  },
  {
    step: "03",
    title: "Nhận báo cáo",
    description: "Báo cáo chi tiết với mã CFR, mức độ nghiêm trọng và cách sửa.",
  },
]

const benefits = [
  "Phát hiện lỗi trước khi hàng rời cảng",
  "Tiết kiệm chi phí lưu kho, thu hồi",
  "Tăng tỷ lệ thông quan lên 99,5%",
  "Cấp Certification Letter khi đạt chuẩn",
]

export default function FDALabelCheckPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section - Clean AI Style */}
        <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              {/* AI Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Label Pro by Vexim Global</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
                Kiểm tra nhãn FDA
                <span className="block text-primary mt-2">bằng trí tuệ nhân tạo</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                Đối chiếu nhãn sản phẩm với 5.346 vi phạm FDA thực tế. Phát hiện lỗi trong 2 phút, 
                giúp doanh nghiệp Việt xuất khẩu an toàn sang thị trường Mỹ.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <ConsultationDialog>
                  <Button size="lg" className="text-lg px-8 py-6 gap-2">
                    <ScanLine className="w-5 h-5" />
                    Kiểm tra nhãn ngay
                  </Button>
                </ConsultationDialog>
                <Link href="/fda-tracker">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 gap-2">
                    Xem vi phạm thực tế
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground">5.346</div>
                  <div className="text-sm text-muted-foreground mt-1">vi phạm trong CSDL</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground">~2 phút</div>
                  <div className="text-sm text-muted-foreground mt-1">nhận kết quả</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-foreground">99,5%</div>
                  <div className="text-sm text-muted-foreground mt-1">thông quan sau sửa</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Simple 3 Steps */}
        <section className="py-16 md:py-20 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
                Quy trình đơn giản
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">
                Tại sao chọn AI Label Pro?
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Kết hợp sức mạnh AI với kinh nghiệm thực chiến của chuyên gia FDA Compliance
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, idx) => (
                  <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Industries Supported */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">
                Hỗ trợ 4 ngành hàng FDA
              </h2>
              <p className="text-center text-muted-foreground mb-12">
                Mỗi ngành có bộ quy định riêng - AI được huấn luyện chuyên sâu trên từng nhóm 21 CFR
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {industries.map((industry, idx) => (
                  <Card key={idx} className="text-center hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-1">{industry.title}</h3>
                      <p className="text-xs text-primary font-medium mb-3">{industry.regulation}</p>
                      <div className="text-2xl font-bold text-accent">{industry.count}</div>
                      <p className="text-xs text-muted-foreground">Warning Letters</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                    Bảo vệ lô hàng của bạn trước khi rời cảng
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Hàng bị FDA giữ tại cảng Mỹ đồng nghĩa với chi phí lưu container tăng mỗi ngày, 
                    mất suất lên kệ siêu thị, và hồ sơ vi phạm bị lưu vĩnh viễn. 
                    Kiểm tra trước khi xuất - tiết kiệm cả tỷ đồng.
                  </p>
                  <ul className="space-y-3">
                    {benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6 md:p-8">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full text-accent text-sm font-medium mb-4">
                        <Zap className="w-4 h-4" />
                        Bắt đầu miễn phí
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Kiểm tra nhãn đầu tiên</h3>
                      <p className="text-sm text-muted-foreground">
                        Trải nghiệm AI Label Pro với nhãn sản phẩm thực tế của bạn
                      </p>
                    </div>

                    <ConsultationDialog>
                      <Button size="lg" className="w-full text-lg py-6 gap-2">
                        <ScanLine className="w-5 h-5" />
                        Kiểm tra ngay
                      </Button>
                    </ConsultationDialog>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Không cần tạo tài khoản. Kết quả trong 2 phút.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
                Bạn sẽ nhận được gì?
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Báo cáo chi tiết</h3>
                    <p className="text-sm text-muted-foreground">
                      PDF với từng điểm vi phạm, trích dẫn mã CFR và hướng dẫn khắc phục cụ thể
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <BadgeCheck className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Certification Letter</h3>
                    <p className="text-sm text-muted-foreground">
                      Chứng nhận tuân thủ FDA khi nhãn đạt chuẩn - dùng để đàm phán với buyer
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Tư vấn chuyên gia</h3>
                    <p className="text-sm text-muted-foreground">
                      FDA Compliance Specialist hỗ trợ 1-1 khi cần giải trình với FDA
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Đừng để lô hàng tiếp theo trở thành bài học đắt giá
              </h2>
              <p className="text-white/80 mb-8">
                Hơn 200 doanh nghiệp Việt Nam đã tin dùng AI Label Pro để bảo vệ lô hàng xuất khẩu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ConsultationDialog>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 gap-2">
                    <ScanLine className="w-5 h-5" />
                    Kiểm tra nhãn miễn phí
                  </Button>
                </ConsultationDialog>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
                  >
                    Liên hệ tư vấn
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
