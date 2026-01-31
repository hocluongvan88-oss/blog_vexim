import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Clock, TrendingUp, ArrowRight, Globe, FileCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mã Xuất Khẩu GACC ",
  description:
    "Dịch vụ đăng ký mã số GACC để xuất khẩu hàng hóa vào Trung Quốc. Kinh nghiệm thực chiến, tỷ lệ thành công cao.",
  keywords: ["GACC", "mã GACC", "đăng ký GACC", "xuất khẩu Trung Quốc", "GACC code", "GACC registration"],
  alternates: {
    canonical: "/services/gacc",
  },
  openGraph: {
    title: "Mã GACC (Trung Quốc) - Vexim Global",
    description:
      "Dịch vụ đăng ký mã số GACC để xuất khẩu hàng hóa vào Trung Quốc. Kinh nghiệm thực chiến, tỷ lệ thành công cao.",
    url: "/services/gacc",
    type: "website",
  },
}

export default function GACCPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                Thị trường Trung Quốc
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Đăng ký Mã GACC
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Trung Quốc là thị trường xuất khẩu lớn nhất của Việt Nam với kim ngạch hơn 58 tỷ USD/năm. Nhưng từ 2022, 
                muốn xuất khẩu thực phẩm, nông sản, thủy sản sang đây, doanh nghiệp bắt buộc phải có mã GACC. Không có 
                mã này, hàng sẽ bị từ chối ngay tại cửa khẩu, gây thiệt hại nghiêm trọng. Chúng tôi hiểu rõ từng bước 
                trong quy trình đăng ký phức tạp này - từ NAFIQAD Việt Nam đến hệ thống CIFER của Trung Quốc. Đồng hành 
                cùng bạn để lấy mã nhanh nhất, tránh mọi rủi ro bị từ chối.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/services/gacc/assessment">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <FileCheck className="mr-2 w-5 h-5" />
                    Đánh giá hồ sơ miễn phí
                  </Button>
                </Link>
                <ConsultationDialog
                  trigger={
                    <Button size="lg" variant="outline">
                      Tư vấn miễn phí <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/china-customs-port-container-shipping-trade.jpg"
                alt="GACC Registration"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why GACC */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Mã GACC là gì và tại sao bắt buộc?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              GACC code (Mã số Tổng cục Hải quan Trung Quốc) là mã định danh duy nhất cho mỗi cơ sở sản xuất, chế biến 
              muốn xuất khẩu vào Trung Quốc
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 border-l-4 border-l-accent">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                Yêu cầu bắt buộc từ 2022
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Trung Quốc siết chặt quản lý an toàn thực phẩm nhập khẩu qua GACC Order 248 và 249. Tất cả nhà sản xuất 
                nước ngoài phải đăng ký mã GACC trước khi xuất khẩu. Không có mã, hàng bị từ chối thông quan ngay tại 
                cửa khẩu, không có ngoại lệ.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Căn cứ GACC Order 248 và 249</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Áp dụng với cả cơ sở sản xuất và đóng gói</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-red-500">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                Rủi ro khi xuất hàng không có mã
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nhiều doanh nghiệp Việt đã gặp tổn thất lớn vì không biết hoặc chủ quan với quy định GACC
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Container bị giữ tại cảng Trung Quốc, phải hoàn trả hoặc tiêu hủy
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Tốn phí lưu container, hàng hư hỏng, mất tiền mất đơn
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Mất uy tín với đối tác, khó tìm được khách hàng mới
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Requiring GACC */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Nhóm hàng cần mã GACC</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Chúng tôi có kinh nghiệm đăng ký GACC cho các mặt hàng xuất khẩu chủ lực của Việt Nam
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Thủy hải sản",
                items: [
                  "Tôm đông lạnh các loại",
                  "Cá tra, cá basa fillet",
                  "Mực, bạch tuộc",
                  "Nghêu, sò, ốc",
                  "Hải sản chế biến",
                ],
                popular: true,
              },
              {
                title: "Trái cây tươi",
                items: ["Thanh long", "Sầu riêng", "Xoài", "Vải thiều", "Chuối, dừa"],
                popular: true,
              },
              {
                title: "Nông sản chế biến",
                items: ["Hạt điều", "Hạt tiêu", "Cà phê rang xay", "Gạo các loại", "Mì ăn liền"],
              },
              {
                title: "Thịt & Chế phẩm",
                items: ["Thịt lợn đông lạnh", "Thịt gà đông lạnh", "Xúc xích", "Giò chả", "Thịt bò chế biến"],
              },
              {
                title: "Sữa & Chế phẩm sữa",
                items: ["Sữa tươi, sữa tiệt trùng", "Sữa bột", "Pho mát", "Sữa chua", "Kem"],
              },
              {
                title: "Thực phẩm đóng gói",
                items: ["Bánh kẹo", "Đồ uống đóng chai", "Nước trái cây", "Gia vị, nước chấm", "Thực phẩm đông lạnh"],
              },
            ].map((category, index) => (
              <Card
                key={index}
                className={`p-6 hover:shadow-lg transition-shadow ${category.popular ? "border-2 border-accent" : ""}`}
              >
                {category.popular && (
                  <div className="inline-block bg-accent text-white px-3 py-1 rounded-full text-xs font-medium mb-3">
                    Xuất khẩu nhiều nhất
                  </div>
                )}
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

      {/* Process */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Quy trình đăng ký mã GACC</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Chúng tôi đơn giản hóa quy trình phức tạp thành 6 bước rõ ràng, dễ theo dõi
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Đánh giá điều kiện cơ sở",
                description:
                  "Kiểm tra xem nhà máy có đủ điều kiện vệ sinh an toàn thực phẩm theo yêu cầu GACC chưa. Nếu chưa đạt, chúng tôi hướng dẫn cụ thể những điểm cần khắc phục để tăng tỷ lệ thành công.",
                duration: "1-2 ngày",
              },
              {
                step: "02",
                title: "Đăng ký với cơ quan Việt Nam",
                description:
                  "Nộp hồ sơ lên NAFIQAD (Cục Quản lý Chất lượng Nông lâm sản và Thủy sản) hoặc cơ quan chuyên ngành. Đây là bước bắt buộc - GACC chỉ chấp nhận hồ sơ đã được cơ quan Việt Nam xác nhận.",
                duration: "10-15 ngày",
              },
              {
                step: "03",
                title: "Chuẩn bị hồ sơ GACC đầy đủ",
                description:
                  "Thu thập thông tin chi tiết về cơ sở: địa chỉ chính xác, công suất sản xuất, quy trình chi tiết, danh mục sản phẩm. Dịch tài liệu sang tiếng Trung và tiếng Anh chuẩn xác.",
                duration: "3-5 ngày",
              },
              {
                step: "04",
                title: "Nộp hồ sơ lên hệ thống GACC",
                description:
                  "Đăng ký qua CIFER (China Import Food Enterprise Registration). Theo dõi sát tiến độ xử lý hàng ngày, phản hồi ngay các yêu cầu bổ sung từ GACC để không bị trễ hẹn.",
                duration: "20-30 ngày",
              },
              {
                step: "05",
                title: "Thanh tra tại cơ sở (nếu GACC yêu cầu)",
                description:
                  "Một số trường hợp GACC cử thanh tra viên sang kiểm tra nhà máy. Chúng tôi chuẩn bị kỹ lưỡng, hỗ trợ phiên dịch chuyên ngành trong suốt buổi thanh tra.",
                duration: "Tùy lịch GACC",
              },
              {
                step: "06",
                title: "Nhận mã GACC & Hướng dẫn khai báo",
                description:
                  "GACC cấp mã số duy nhất cho cơ sở của bạn. Chúng tôi hướng dẫn chi tiết cách khai mã này trên tờ khai hải quan và các chứng từ xuất khẩu để tránh sai sót.",
                duration: "Ngay sau phê duyệt",
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
                      <span className="text-sm text-accent font-medium mt-2 md:mt-0">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {process.duration}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Vexim */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Tại sao chọn Vexim Global?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-4xl font-bold text-accent mb-2">95%</div>
              <h3 className="text-lg font-bold text-primary mb-3">Tỷ lệ phê duyệt cao</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hiểu rõ cả quy trình GACC và NAFIQAD Việt Nam
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-4xl font-bold text-accent mb-2">30-45</div>
              <h3 className="text-lg font-bold text-primary mb-3">Ngày hoàn thành</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Nhanh hơn 50% so với tự làm</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-4xl font-bold text-accent mb-2">300+</div>
              <h3 className="text-lg font-bold text-primary mb-3">Cơ sở đã hỗ trợ</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Từ thủy sản đến trái cây, nông sản</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Globe className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <h3 className="text-lg font-bold text-primary mb-3">Đại diện tại TQ</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Liên lạc trực tiếp với GACC khi cần</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Đừng để thiếu mã GACC làm gián đoạn xuất khẩu
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Liên hệ ngay để được đánh giá miễn phí điều kiện cơ sở và nhận báo giá chi tiết trong 24 giờ
          </p>
          <ConsultationDialog
            trigger={
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Đăng ký tư vấn miễn phí ngay
              </Button>
            }
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}