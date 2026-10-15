"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowRight, Loader2, Shield, FileCheck, Clock } from "lucide-react"
import { ConsultationDialog } from "./consultation-dialog"

export function HeroSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    product: "",
    description: "",
    honeypot: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage("✓ Bạn đã đăng ký thành công! Chúng tôi sẽ liên hệ trong vòng 24h.")
        setFormData({ name: "", phone: "", email: "", service: "", product: "", description: "", honeypot: "" })
      } else {
        setSubmitMessage(`✗ ${data.error || "Có lỗi xảy ra. Vui lòng thử lại."}`)
      }
    } catch (error) {
      setSubmitMessage("✗ Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="hero" className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-navy-950">
      {/* Ảnh có sẵn trên website, không phụ thuộc dịch vụ ảnh bên ngoài. */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/china-customs-port-container-shipping-trade.jpg"
          alt="Minh họa cảng container và hoạt động xuất khẩu hàng hóa"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Phủ tối vừa đủ để đọc chữ, giữ hình ảnh cảng biển nhìn thấy rõ. */}
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/5" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1.15fr_0.85fr] gap-8 md:gap-10 items-center">
          {/* Left Content */}
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-1.5 text-sm font-medium text-sky-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Regulatory Compliance & Market Access
            </span>
            {/*
              H1 cũ là câu lợi ích ("Giảm rào cản pháp lý...") — không chứa từ khóa nào,
              và H2 ngay dưới là một câu dài dùng làm tiêu đề. Nay:
                - H1 chứa đúng cụm người dùng tìm: đăng ký FDA / tư vấn pháp lý / xuất khẩu sang Mỹ;
                - câu lợi ích cũ chuyển xuống thành tagline dạng <p> (giữ nguyên giao diện);
                - H2 dài thành <p> để heading chỉ dành cho khối nội dung thật.
            */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              Dịch vụ đăng ký FDA &amp; tư vấn pháp lý xuất khẩu sang Mỹ
            </h1>
            <p className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400 drop-shadow-lg">
              Giảm rào cản pháp lý, sẵn sàng đưa sản phẩm ra thị trường quốc tế
            </p>
            <p className="text-lg md:text-xl font-semibold mb-6 text-white/95 leading-relaxed">
              Từ tuân thủ pháp lý, hoàn thiện hồ sơ đến hỗ trợ doanh nghiệp tiếp cận thị trường Hoa Kỳ và các thị trường quốc tế.
            </p>
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
              Vexim Global tư vấn và hỗ trợ doanh nghiệp Việt Nam trong các yêu cầu pháp lý khi đưa sản phẩm ra thị trường quốc tế. Với thị trường Hoa Kỳ, chúng tôi tập trung vào{" "}
              <strong className="font-semibold text-white">FDA, FSVP và MOCRA</strong>, giúp doanh nghiệp xác định đúng yêu cầu, chuẩn bị đúng hồ sơ và xử lý theo quy trình rõ ràng.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90">
                  <strong className="block font-semibold text-white mb-1">Cập nhật quy định</strong>
                  <span className="block leading-relaxed">Theo dõi các yêu cầu và thay đổi pháp lý có thể ảnh hưởng đến sản phẩm và kế hoạch xuất khẩu.</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90">
                  <strong className="block font-semibold text-white mb-1">Rà soát hồ sơ</strong>
                  <span className="block leading-relaxed">Kiểm tra thông tin doanh nghiệp, sản phẩm, nhãn mác và tài liệu trước khi xử lý.</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90">
                  <strong className="block font-semibold text-white mb-1">Quy trình rõ ràng</strong>
                  <span className="block leading-relaxed">Xác định từng bước cần thực hiện, minh bạch phạm vi công việc và cập nhật tiến độ trong quá trình xử lý.</span>
                </span>
              </li>
            </ul>
            <Button variant="cta" size="lg" onClick={() => setIsDialogOpen(true)}>
              Tư vấn miễn phí
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Right Content - Consultation Form */}
          <Card id="consultation-form" className="p-5 md:p-6 bg-white shadow-2xl rounded-xl">
            <h3 className="text-lg md:text-xl font-bold text-primary mb-1.5">Tư vấn miễn phí trong 24h</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gửi thông tin sản phẩm và nhu cầu của bạn. Vexim sẽ liên hệ trao đổi về yêu cầu trong thời gian sớm nhất.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Honeypot field ẩn */}
              <input
                type="text"
                name="website"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                style={{ position: "absolute", left: "-9999px" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="block text-[13px] font-medium mb-1">
                    Họ và tên <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nhập tên của bạn"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-[13px] font-medium mb-1">
                    Số điện thoại <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại của bạn"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-[13px] font-medium mb-1">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-[13px] font-medium mb-1">
                  Loại dịch vụ quan tâm
                </label>
                <select
                  id="service"
                  className="w-full px-3 py-1.5 text-sm border border-input rounded-md bg-background"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  disabled={isSubmitting}
                >
                  <option value="">Chọn dịch vụ</option>
                  <option value="fda">Đăng ký FDA</option>
                  <option value="export-sales">Phòng sale xuất khẩu</option>
                  <option value="fsvp">FSVP Compliance</option>
                  <option value="agent-us">Dịch vụ US Agent</option>
                  <option value="mocra">MOCRA Registration</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label htmlFor="product" className="block text-[13px] font-medium mb-1">
                  Sản phẩm cần đăng ký
                </label>
                <Input
                  id="product"
                  type="text"
                  placeholder="Nhập sản phẩm của bạn"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-[13px] font-medium mb-1">
                  Mô tả thêm
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-1.5 border border-input rounded-md bg-background text-sm"
                  rows={2}
                />
              </div>

              {submitMessage && (
                <div
                  className={`p-3 rounded-md text-sm ${submitMessage.startsWith("✓") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {submitMessage}
                </div>
              )}

              <Button type="submit" variant="cta" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi yêu cầu tư vấn"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </section>
  )
}
