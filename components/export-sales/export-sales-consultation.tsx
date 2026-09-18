"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react"
import { ConsultationDialog } from "@/components/consultation-dialog"

export function ExportSalesBookingButton({
  children,
  className = "",
  size = "lg",
  variant = "default",
}: {
  children?: React.ReactNode
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        {children || (
          <>
            Đăng ký tư vấn Phòng Sale Xuất khẩu Vexim
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <ConsultationDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

export function ExportSalesInlineForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "export-sales",
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
        setSubmitMessage("✓ Đã gửi yêu cầu thành công! Chuyên gia Vexim sẽ liên hệ tư vấn trong 2-4h làm việc.")
        setFormData({
          name: "",
          phone: "",
          email: "",
          service: "export-sales",
          product: "",
          description: "",
          honeypot: "",
        })
      } else {
        setSubmitMessage(`✗ ${data.error || "Có lỗi xảy ra. Vui lòng thử lại sau."}`)
      }
    } catch {
      setSubmitMessage("✗ Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="website"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        style={{ position: "absolute", left: "-9999px" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="form-name" className="block text-sm font-medium mb-1.5 text-foreground">
            Họ và tên <span className="text-destructive">*</span>
          </label>
          <Input
            id="form-name"
            placeholder="VD: Nguyễn Văn Hưng"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
            className="bg-background"
          />
        </div>
        <div>
          <label htmlFor="form-phone" className="block text-sm font-medium mb-1.5 text-foreground">
            Số điện thoại / Zalo <span className="text-destructive">*</span>
          </label>
          <Input
            id="form-phone"
            type="tel"
            placeholder="VD: 0912 345 678"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={isSubmitting}
            className="bg-background"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="form-email" className="block text-sm font-medium mb-1.5 text-foreground">
            Email doanh nghiệp <span className="text-destructive">*</span>
          </label>
          <Input
            id="form-email"
            type="email"
            placeholder="ceo@nhamay.vn"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isSubmitting}
            className="bg-background"
          />
        </div>
        <div>
          <label htmlFor="form-industry" className="block text-sm font-medium mb-1.5 text-foreground">
            Ngành hàng sản xuất
          </label>
          <select
            id="form-industry"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            disabled={isSubmitting}
          >
            <option value="export-sales">Phòng sale xuất khẩu (Mỹ)</option>
            <option value="export-sales-food">Nông sản & Thực phẩm sang Mỹ</option>
            <option value="export-sales-cosmetics">Mỹ phẩm & Chăm sóc cá nhân (MoCRA)</option>
            <option value="export-sales-supplements">Thực phẩm chức năng (DSHEA)</option>
            <option value="export-sales-medical">Thiết bị y tế (FDA 510k)</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="form-product" className="block text-sm font-medium mb-1.5 text-foreground">
          Sản phẩm chủ lực & Công suất hàng tháng
        </label>
        <Input
          id="form-product"
          placeholder="VD: Hạt điều rang muối 50 tấn/tháng, Cà phê Robusta 100 tấn/tháng..."
          value={formData.product}
          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          disabled={isSubmitting}
          className="bg-background"
        />
      </div>

      <div>
        <label htmlFor="form-desc" className="block text-sm font-medium mb-1.5 text-foreground">
          Hiện trạng hồ sơ xuất khẩu & Nhu cầu cụ thể
        </label>
        <Textarea
          id="form-desc"
          rows={3}
          placeholder="VD: Đã có ISO 22000, chưa có FDA; cần tìm buyer siêu thị Mỹ; mong muốn đưa hàng vào California..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isSubmitting}
          className="bg-background text-sm"
        />
      </div>

      {submitMessage && (
        <div
          className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
            submitMessage.startsWith("✓")
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800"
          }`}
        >
          {submitMessage.startsWith("✓") && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />}
          {submitMessage}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-md font-bold text-base py-6"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Đang xử lý yêu cầu...
          </>
        ) : (
          <>
            Đăng ký tư vấn Phòng Sale Xuất khẩu Vexim
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Bảo mật 100% dữ liệu sản phẩm & thông tin năng lực nhà máy</span>
      </div>
    </form>
  )
}
