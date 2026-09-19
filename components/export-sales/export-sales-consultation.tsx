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
            <span>Đăng ký tư vấn Phòng Sale Xuất khẩu</span>
            <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
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
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 w-full">
      <input
        type="text"
        name="website"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        style={{ position: "absolute", left: "-9999px" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="form-name" className="block text-xs sm:text-sm font-semibold mb-1 text-slate-800 dark:text-slate-200">
            Họ và tên <span className="text-destructive">*</span>
          </label>
          <Input
            id="form-name"
            placeholder="VD: Nguyễn Văn Hưng"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
            className="h-9 sm:h-10 text-xs sm:text-sm bg-background border-slate-300 dark:border-slate-700 focus:border-sky-500"
          />
        </div>
        <div>
          <label htmlFor="form-phone" className="block text-xs sm:text-sm font-semibold mb-1 text-slate-800 dark:text-slate-200">
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
            className="h-9 sm:h-10 text-xs sm:text-sm bg-background border-slate-300 dark:border-slate-700 focus:border-sky-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="form-email" className="block text-xs sm:text-sm font-semibold mb-1 text-slate-800 dark:text-slate-200">
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
            className="h-9 sm:h-10 text-xs sm:text-sm bg-background border-slate-300 dark:border-slate-700 focus:border-sky-500"
          />
        </div>
        <div>
          <label htmlFor="form-industry" className="block text-xs sm:text-sm font-semibold mb-1 text-slate-800 dark:text-slate-200">
            Ngành hàng sản xuất
          </label>
          <select
            id="form-industry"
            className="w-full h-9 sm:h-10 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-md bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
        <label htmlFor="form-product" className="block text-xs sm:text-sm font-semibold mb-1 text-slate-800 dark:text-slate-200">
          Sản phẩm chủ lực & Công suất tháng
        </label>
        <Input
          id="form-product"
          placeholder="VD: Hạt điều rang muối 50 tấn/tháng, Cà phê Robusta..."
          value={formData.product}
          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          disabled={isSubmitting}
          className="h-9 sm:h-10 text-xs sm:text-sm bg-background border-slate-300 dark:border-slate-700 focus:border-sky-500"
        />
      </div>

      <div>
        <label htmlFor="form-desc" className="block text-xs sm:text-sm font-semibold mb-1 text-slate-800 dark:text-slate-200">
          Hiện trạng hồ sơ & Nhu cầu cụ thể
        </label>
        <Textarea
          id="form-desc"
          rows={2}
          placeholder="VD: Đã có ISO 22000, chưa có FDA; cần tìm buyer siêu thị Mỹ..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isSubmitting}
          className="bg-background text-xs sm:text-sm py-2 min-h-[54px] border-slate-300 dark:border-slate-700 focus:border-sky-500 resize-none"
        />
      </div>

      {submitMessage && (
        <div
          className={`p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm flex items-center gap-2 ${
            submitMessage.startsWith("✓")
              ? "bg-sky-50 text-sky-800 border border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-800"
              : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800"
          }`}
        >
          {submitMessage.startsWith("✓") && <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-600" />}
          <span className="leading-snug">{submitMessage}</span>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 sm:h-12 bg-gradient-to-r from-amber-400 to-orange-500 text-navy-950 hover:from-amber-500 hover:to-orange-600 shadow-md shadow-orange-500/25 font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2 whitespace-normal py-2 text-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
            <span>Đang gửi thông tin...</span>
          </>
        ) : (
          <>
            <span>Đăng ký tư vấn Phòng Sale Xuất khẩu</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground pt-0.5 text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
        <span>Bảo mật 100% dữ liệu sản phẩm & thông tin nhà máy</span>
      </div>
    </form>
  )
}
