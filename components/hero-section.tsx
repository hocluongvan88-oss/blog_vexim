"use client"

import type React from "react"

import { useState } from "react"
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
      {/* Background Image — logistics / cảng biển */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2000)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Lớp phủ navy đậm dần sang phải để ảnh vẫn lộ ra, không còn một màu xanh phẳng */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/97 via-navy-900/92 to-navy-800/70" />
      </div>

      {/* Điểm nhấn xanh nhạt — glow + grid trang trí */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-32 right-[-10%] w-[480px] h-[480px] rounded-full bg-sky-400/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[15%] w-[420px] h-[420px] rounded-full bg-amber-400/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #7dd3fc 1px, transparent 1px), linear-gradient(to bottom, #7dd3fc 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-1.5 text-sm font-medium text-sky-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Giải pháp xuất nhập khẩu toàn cầu
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              Giảm rào cản pháp lý, sẵn sàng đưa sản phẩm ra thị trường quốc tế
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400 drop-shadow-lg">
              Từ tuân thủ pháp lý, hoàn thiện hồ sơ đến tiếp cận thị trường và phát triển kênh bán hàng.
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
              Vexim Global tư vấn và hỗ trợ doanh nghiệp Việt Nam tiếp cận thị trường Hoa Kỳ và các thị trường quốc tế. Với FDA, chúng tôi giúp doanh nghiệp hiểu đúng yêu cầu, chuẩn bị đúng hồ sơ và xử lý thủ tục rõ ràng, hiệu quả.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90">
                  <strong className="font-semibold text-white">Cập nhật quy định</strong> — theo dõi sát các yêu cầu và thay đổi ảnh hưởng đến sản phẩm, hồ sơ và kế hoạch xuất khẩu.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90">
                  <strong className="font-semibold text-white">Rà soát hồ sơ kỹ lưỡng</strong> — kiểm tra doanh nghiệp, sản phẩm, nhãn mác và tài liệu trước khi tiến hành.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90">
                  <strong className="font-semibold text-white">Quy trình rõ ràng – xử lý nhanh</strong> — chuẩn hóa từng bước, minh bạch tiến độ, tối ưu thời gian hoàn thiện hồ sơ.
                </span>
              </li>
            </ul>
            <Button variant="cta" size="lg" onClick={() => setIsDialogOpen(true)}>
              Tư vấn miễn phí
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Right Content - Consultation Form */}
          <Card id="consultation-form" className="p-6 md:p-8 bg-white shadow-2xl">
            <h3 className="text-2xl font-bold text-primary mb-2">Tư vấn miễn phí - Nhận kết quả trong 24h</h3>
            <p className="text-muted-foreground mb-6">
              <span className="text-accent font-semibold">Vui lòng gửi lại thông tin</span> chúng tôi sẽ liên hệ với bạn ngay!
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Họ và tên <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Số điện thoại <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0912 345 678"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2">
                  Loại dịch vụ quan tâm
                </label>
                <select
                  id="service"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
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
                <label htmlFor="product" className="block text-sm font-medium mb-2">
                  Sản phẩm cần đăng ký
                </label>
                <Input
                  id="product"
                  type="text"
                  placeholder="VD: Yến hũ, Hạt điều nhân"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Mô tả thêm (chứng chỉ, quy trình sản xuất...)
                </label>
                <textarea
                  id="description"
                  placeholder="VD: Có chứng chỉ ISO, sản xuất theo tiêu chuẩn GMP..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  rows={3}
                />
              </div>

              {submitMessage && (
                <div
                  className={`p-3 rounded-md text-sm ${submitMessage.startsWith("✓") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {submitMessage}
                </div>
              )}

              <Button type="submit" variant="cta" className="w-full" size="lg" disabled={isSubmitting}>
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
