import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, FileCheck, Clock, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đăng ký FDA (Mỹ)",
  description:
    "Dịch vụ tư vấn và đăng ký FDA cho thực phẩm, mỹ phẩm, thiết bị y tế xuất khẩu sang Hoa Kỳ. Quy trình chuyên nghiệp, đảm bảo tuân thủ.",
  keywords: [
    "đăng ký FDA",
    "FDA registration",
    "xuất khẩu Mỹ",
    "FDA thực phẩm",
    "FDA mỹ phẩm",
    "FDA thiết bị y t���",
    "tư v��n FDA",
  ],
  alternates: {
    canonical: "/services/fda",
  },
  openGraph: {
    title: "Đăng ký FDA (Mỹ) - Vexim Global",
    description:
      "Dịch vụ tư vấn và đăng ký FDA cho thực phẩm, mỹ phẩm, thiết bị y tế xuất khẩu sang Hoa Kỳ. Quy trình chuyên nghiệp, đảm bảo tuân thủ.",
    url: "/services/fda",
    type: "website",
  },
}

export default function FDAPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                Thị trường Hoa Kỳ
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Đăng ký FDA (Mỹ)
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Cửa ngõ pháp lý để sản phẩm của bạn tiếp cận thị trường Hoa Kỳ. Chúng tôi đồng hành cùng doanh nghiệp từ
                khâu tư vấn đến hoàn tất đăng ký FDA, đảm bảo tuân thủ đầy đủ quy định của cơ quan quản lý thực phẩm và
                dược phẩm Hoa Kỳ.
              </p>
              <ConsultationDialog
                trigger={
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Tư vấn miễn phí ngay <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                }
              />
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/fda-food-safety-inspection-laboratory-professional.jpg"
                alt="FDA Registration"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why FDA Registration Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Tại sao đăng ký FDA là bắt buộc?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              FDA (Food and Drug Administration) là cơ quan quản lý chặt chẽ nhất thế giới. Đăng ký FDA không chỉ là yêu
              cầu pháp lý mà còn là lá chắn bảo vệ doanh nghiệp khỏi rủi ro bị từ chối nhập khẩu, phạt tiền và mất uy
              tín.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Yêu cầu pháp lý bắt buộc</h3>
              <p className="text-muted-foreground leading-relaxed">
                Theo Food Safety Modernization Act (FSMA), tất cả cơ sở sản xuất, chế biến, đóng gói thực phẩm phải đăng
                ký với FDA trước khi xuất khẩu.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Tránh container bị giữ</h3>
              <p className="text-muted-foreground leading-relaxed">
                Không có FDA registration hợp lệ, hàng hóa sẽ bị customs (hải quan Mỹ) từ chối nhập khẩu ngay tại cảng,
                gây thiệt hại lớn.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Tăng uy tín thương hiệu</h3>
              <p className="text-muted-foreground leading-relaxed">
                FDA registration là dấu hiệu chất lượng được nhà nhập khẩu Mỹ tin tưởng, giúp tăng cơ hội hợp tác và mở
                rộng thị trường.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Tiết kiệm thời gian</h3>
              <p className="text-muted-foreground leading-relaxed">
                Quy trình đăng ký phức tạp với nhiều biểu mẫu và yêu cầu kỹ thuật. Chuyên gia của chúng tôi giúp bạn
                hoàn tất nhanh chóng, chính xác.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Coverage */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Các nhóm sản phẩm cần đăng ký FDA
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Vexim Global có chuyên môn sâu trong đăng ký FDA cho đa dạng ngành hàng xuất khẩu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Thực phẩm & Đồ uống",
                items: [
                  "Thực phẩm chế biến",
                  "Thực phẩm chức năng",
                  "Đồ uống có ga",
                  "Nước đóng chai",
                  "Thực phẩm đông lạnh",
                ],
              },
              {
                title: "Mỹ phẩm & Chăm sóc cá nhân",
                items: ["Mỹ phẩm trang điểm", "Sản phẩm chăm sóc da", "Dầu gội & sữa tắm", "Nước hoa", "Kem đánh răng"],
              },
              {
                title: "Thiết bị y tế",
                items: [
                  "Thiết bị y tế loại I, II, III",
                  "Dụng cụ phẫu thuật",
                  "Thiết bị chẩn đoán",
                  "Vật tư y tế tiêu hao",
                  "Thiết bị hỗ trợ điều trị",
                ],
              },
              {
                title: "Dược phẩm",
                items: [
                  "Thuốc không kê đơn (OTC)",
                  "Thuốc kê đơn",
                  "Nguyên liệu dược",
                  "Vitamin & khoáng chất",
                  "Thuốc thảo dược",
                ],
              },
              {
                title: "Thực phẩm động vật",
                items: [
                  "Thức ăn cho thú cưng",
                  "Thức ăn gia súc",
                  "Thức ăn thủy sản",
                  "Phụ gia thức ăn",
                  "Vitamin cho động vật",
                ],
              },
              {
                title: "Vật liệu tiếp xúc thực phẩm",
                items: [
                  "Bao bì nhựa thực phẩm",
                  "Hộp đựng thực phẩm",
                  "Màng bọc thực phẩm",
                  "Chai lọ đựng đồ uống",
                  "Dụng cụ nấu nướng",
                ],
              },
            ].map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-primary mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Quy trình đăng ký FDA cùng Vexim Global
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Chúng tôi đơn giản hóa quy trình phức tạp thành 5 bước rõ ràng
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Tư vấn & Đánh giá hồ sơ",
                description:
                  "Chuyên gia pháp lý phân tích sản phẩm, xác định loại đăng ký FDA cần thiết (Facility Registration, Product Listing, Prior Notice). Tư vấn U.S. Agent nếu cần.",
                duration: "1-2 ngày",
              },
              {
                step: "02",
                title: "Chuẩn bị hồ sơ & Tài liệu",
                description:
                  "Thu thập thông tin doanh nghiệp, quy trình sản xuất, thành phần sản phẩm, nhãn mác. Chuẩn bị FDA Form 3537, 2250a, và các biểu mẫu khác theo yêu cầu.",
                duration: "3-5 ngày",
              },
              {
                step: "03",
                title: "Nộp hồ sơ lên FDA Portal",
                description:
                  "Đăng ký trên FDA Industry Systems và FDA Unified Registration & Listing System (FURLS). Theo dõi trạng thái xử lý và phản hồi yêu cầu bổ sung từ FDA.",
                duration: "5-10 ngày",
              },
              {
                step: "04",
                title: "Nhận FDA Registration Number",
                description:
                  "FDA cấp Registration Number và Product Code. Hướng dẫn sử dụng Registration Number cho Prior Notice và nhãn mác sản phẩm.",
                duration: "Tức thì sau phê duyệt",
              },
              {
                step: "05",
                title: "Hỗ trợ gia hạn & Tuân thủ",
                description:
                  "FDA registration phải gia hạn 2 năm/lần (1-31/10 năm chẵn). Chúng tôi nhắc nhở và hỗ trợ gia hạn, cập nhật thông tin khi có thay đổi.",
                duration: "Suốt thời gian hợp tác",
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

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Tại sao chọn Vexim Global?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-accent mb-2">98%</div>
              <h3 className="text-xl font-bold text-primary mb-3">Tỷ lệ phê duyệt</h3>
              <p className="text-muted-foreground leading-relaxed">
                Gần như tất cả hồ sơ của chúng tôi được FDA phê duyệt ngay lần đầu nhờ kinh nghiệm 10+ năm
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-accent mb-2">500+</div>
              <h3 className="text-xl font-bold text-primary mb-3">Hồ sơ thành công</h3>
              <p className="text-muted-foreground leading-relaxed">
                Đã hỗ trợ hơn 500 doanh nghiệp Việt Nam đăng ký FDA và xuất khẩu thành công sang Mỹ
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <h3 className="text-xl font-bold text-primary mb-3">Hỗ trợ khẩn cấp</h3>
              <p className="text-muted-foreground leading-relaxed">
                Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn mọi lúc, kể cả khi hàng đã đến cảng Mỹ
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Sẵn sàng đưa sản phẩm vào thị trường Mỹ?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Liên hệ ngay với chuyên gia FDA của Vexim Global để được tư vấn miễn phí và báo giá chi tiết trong 24 giờ
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
              Tải tài liệu hướng dẫn FDA
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
