import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Clock, FileText, Shield, Globe } from "lucide-react"
import ConsultationDialog from "@/components/consultation-dialog"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đăng ký MFDS (Hàn Quốc)",
  description:
    "Chứng nhận thực phẩm, mỹ phẩm, thiết bị y tế hợp pháp tại Hàn Quốc. Vexim Global đồng hành cùng doanh nghiệp Việt chinh phục thị trường Hàn Quốc.",
  keywords: [
    "đăng ký MFDS",
    "MFDS Korea",
    "xuất khẩu Hàn Quốc",
    "MFDS thực phẩm",
    "MFDS mỹ phẩm",
    "Health Functional Food",
    "Korean market",
  ],
  alternates: {
    canonical: "/services/mfds",
  },
  openGraph: {
    title: "Đăng ký MFDS (Hàn Quốc) - Vexim Global",
    description:
      "Chứng nhận thực phẩm, mỹ phẩm, thiết bị y tế hợp pháp tại Hàn Quốc. Vexim Global đồng hành cùng doanh nghiệp Việt chinh phục thị trường Hàn Quốc.",
    url: "/services/mfds",
    type: "website",
  },
}

export default function MFDSPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white pt-32 md:pt-40 pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  Dịch vụ đăng ký Hàn Quốc
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                  Đăng ký MFDS - Thông hành thị trường Hàn Quốc
                </h1>
                <p className="text-xl text-white/90 mb-8 text-pretty leading-relaxed">
                  Chứng nhận thực phẩm, mỹ phẩm, thiết bị y tế hợp pháp tại Hàn Quốc. Vexim Global đồng hành cùng doanh
                  nghiệp Việt chinh phục thị trường 52 triệu dân với GDP bình quân đầu người 35,000 USD.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <ConsultationDialog>
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-lg">
                      Tư vấn đăng ký MFDS
                    </Button>
                  </ConsultationDialog>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
                  >
                    Tải checklist MFDS
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src="/korean-cosmetics-health-products-laboratory-qualit.jpg"
                  alt="MFDS Korea Registration"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why MFDS Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Tại sao cần đăng ký MFDS?</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Ministry of Food and Drug Safety (MFDS) là cơ quan quản lý an toàn thực phẩm và dược phẩm của Hàn Quốc.
                Không có chứng nhận MFDS = không thể nhập khẩu hợp pháp.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Bắt buộc pháp lý</h3>
                  <p className="text-muted-foreground">
                    100% sản phẩm thực phẩm, mỹ phẩm, thiết bị y tế phải có giấy phép MFDS trước khi thông quan Hải quan
                    Hàn Quốc.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Shield className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Uy tín thương hiệu</h3>
                  <p className="text-muted-foreground">
                    Logo MFDS trên bao bì giúp người tiêu dùng Hàn Quốc tin tưởng. Tăng 300% khả năng được phân phối tại
                    các chuỗi lớn như Lotte, GS25.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Globe className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Cửa ngõ xuất khẩu</h3>
                  <p className="text-muted-foreground">
                    Thị trường Hàn Quốc có thu nhập cao, chuộng hàng Việt Nam (đặc biệt nông sản, mỹ phẩm thiên nhiên).
                    Tiềm năng tỷ USD.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Nhóm sản phẩm áp dụng</h2>
              <p className="text-lg text-muted-foreground">
                Vexim Global có kinh nghiệm đăng ký đầy đủ các nhóm sản phẩm sau
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: "Thực phẩm thông thường",
                  items: ["Nông sản tươi sống", "Thực phẩm chế biến", "Gia vị, nước sốt", "Đồ uống không cồn"],
                },
                {
                  title: "Thực phẩm chức năng",
                  items: [
                    "Health Functional Food",
                    "Thực phẩm bổ sung",
                    "Vitamin, khoáng chất",
                    "Sản phẩm từ thảo dược",
                  ],
                },
                {
                  title: "Mỹ phẩm",
                  items: ["Skincare, makeup", "Dầu gội, sữa tắm", "Kem chống nắng", "Mặt nạ, serum"],
                },
                {
                  title: "Thiết bị y tế",
                  items: [
                    "Class I: Khẩu trang, găng tay",
                    "Class II: Máy đo huyết áp",
                    "Class III: Thiết bị phẫu thuật",
                    "IVD: Test kit chẩn đoán",
                  ],
                },
                {
                  title: "Sản phẩm trẻ em",
                  items: ["Thực phẩm cho trẻ em", "Đồ chơi an toàn", "Mỹ phẩm trẻ em", "Sữa công thức"],
                },
                {
                  title: "Nguyên liệu thô",
                  items: ["Nguyên liệu thực phẩm", "Nguyên liệu mỹ phẩm", "Phụ gia cho phép", "Chất bảo quản"],
                },
              ].map((category, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-primary">{category.title}</h3>
                    <ul className="space-y-2">
                      {category.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Quy trình đăng ký MFDS chuẩn</h2>
              <p className="text-lg text-muted-foreground">
                6 bước minh bạch, dễ theo dõi. Vexim đảm nhiệm toàn bộ thủ tục phức tạp
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  step: "01",
                  title: "Đánh giá sản phẩm & Phân loại",
                  description:
                    "Xác định loại giấy phép cần thiết (Food/Cosmetic/Medical Device). Kiểm tra thành phần có hợp pháp tại Hàn Quốc không. Tư vấn điều chỉnh công thức nếu cần.",
                  duration: "2-3 ngày",
                  icon: FileText,
                },
                {
                  step: "02",
                  title: "Chuẩn bị hồ sơ tiếng Hàn",
                  description:
                    "Dịch thuật chuyên ngành: Certificate of Analysis, Manufacturing Process, Ingredient List. Công chứng, hợp pháp hóa lãnh sự tại Đại sứ quán Hàn Quốc.",
                  duration: "7-10 ngày",
                  icon: Globe,
                },
                {
                  step: "03",
                  title: "Kiểm nghiệm phòng lab Hàn Quốc",
                  description:
                    "Gửi mẫu sang lab được MFDS công nhận (Korea Testing Laboratory). Test vi sinh, kim loại nặng, chất cấm. Nhận Certificate of Analysis.",
                  duration: "10-15 ngày",
                  icon: Shield,
                },
                {
                  step: "04",
                  title: "Nộp hồ sơ lên MFDS",
                  description:
                    "Đăng ký trực tuyến qua hệ thống MFDS (Nanum). Upload toàn bộ hồ sơ, certificate. Nộp phí xử lý (khoảng 100,000-300,000 KRW tùy loại).",
                  duration: "1-2 ngày",
                  icon: FileText,
                },
                {
                  step: "05",
                  title: "MFDS thẩm định hồ sơ",
                  description:
                    "Cơ quan MFDS review hồ sơ, có thể yêu cầu bổ sung. Vexim đối ứng với MFDS bằng tiếng Hàn. Theo dõi tiến độ real-time.",
                  duration: "20-40 ngày",
                  icon: Clock,
                },
                {
                  step: "06",
                  title: "Nhận giấy phép & Hướng dẫn sử dụng",
                  description:
                    "Nhận Import Food Report / Cosmetic Report / Medical Device License. Hướng dẫn dán nhãn tiếng Hàn đúng quy định. Tư vấn chiến lược phân phối.",
                  duration: "2-3 ngày",
                  icon: CheckCircle2,
                },
              ].map((process, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">{process.step}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                          <h3 className="text-xl font-semibold">{process.title}</h3>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                            <Clock className="w-4 h-4" />
                            {process.duration}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 rounded-lg">
                <Clock className="w-5 h-5 text-accent" />
                <span className="font-semibold text-lg">Tổng thời gian: 45-75 ngày làm việc</span>
              </div>
              <p className="mt-4 text-muted-foreground">Thời gian có thể nhanh hơn nếu hồ sơ chuẩn xác ngay từ đầu</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng chinh phục thị trường Hàn Quốc?</h2>
              <p className="text-xl text-white/90 mb-8">
                Đội ngũ Vexim Global thành thạo tiếng Hàn, am hiểu sâu quy trình MFDS. Tỷ lệ phê duyệt 98%. Hỗ trợ từ A
                đến Z.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <ConsultationDialog>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-lg">
                    Đăng ký tư vấn miễn phí
                  </Button>
                </ConsultationDialog>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
                >
                  Xem case study
                </Button>
              </div>
              <p className="mt-6 text-white/80 text-sm">Hỗ trợ 24/7 • Tư vấn miễn phí • Không phê duyệt hoàn phí</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
