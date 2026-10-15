"use client"

import type React from "react"
import { isValidElement, useId, useState } from "react"
import { trackConsultationEvent } from "@/lib/conversion-tracking"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface ConsultationDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  trigger?: React.ReactElement
  defaultService?: string
  trackingSource?: string
}

export function ConsultationDialog({ open, onOpenChange, children, trigger, defaultService = "", trackingSource = "website" }: ConsultationDialogProps) {
  const formId = useId()
  const triggerContent = trigger ?? children
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: defaultService,
    product: "",
    description: "",
    honeypot: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  // Use controlled or uncontrolled based on props
  const dialogOpen = open !== undefined ? open : isOpen
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !dialogOpen) trackConsultationEvent("consultation_open", trackingSource, defaultService || "unspecified")
    if (open === undefined) setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

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

      if (response.ok && data.success === true) {
        trackConsultationEvent("generate_lead", trackingSource, ["fda", "gacc", "export-sales", "agent-us", "other"].includes(formData.service) ? formData.service : "unspecified")
        setSubmitMessage("✓ Bạn đã đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.")
        setTimeout(() => {
          handleOpenChange(false)
          setFormData({ name: "", phone: "", email: "", service: defaultService, product: "", description: "", honeypot: "" })
          setSubmitMessage("")
        }, 2000)
      } else {
        setSubmitMessage(`✗ ${data.error || "Có lỗi xảy ra. Vui lòng thử lại."}`)
      }
    } catch (error) {
      setSubmitMessage("✗ Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // One accessible Radix trigger/form supports both trigger and children callers.
  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {triggerContent && (
        <DialogTrigger asChild>
          {isValidElement(triggerContent) ? triggerContent : <button type="button">{triggerContent}</button>}
        </DialogTrigger>
      )}
      <DialogContent className="w-full max-w-[calc(100%_-_1.5rem)] sm:max-w-[500px] max-h-[92dvh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-primary">Đăng ký tư vấn miễn phí</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">Vui lòng để lại thông tin, chúng tôi sẽ liên hệ trong vòng 24 giờ</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4" data-testid="consultation-form">
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
              <label htmlFor={`${formId}-name`} className="block text-sm font-medium mb-2">
                Họ và tên <span className="text-destructive">*</span>
              </label>
              <Input
                id={`${formId}-name`}
                type="text"
                placeholder="Nhập tên của bạn"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor={`${formId}-phone`} className="block text-sm font-medium mb-2">
                Số điện thoại <span className="text-destructive">*</span>
              </label>
              <Input
                id={`${formId}-phone`}
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
            <label htmlFor={`${formId}-email`} className="block text-sm font-medium mb-2">
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              id={`${formId}-email`}
              type="email"
              placeholder="Nhập email của bạn"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor={`${formId}-service`} className="block text-sm font-medium mb-2">
              Loại dịch vụ quan tâm
            </label>
            <select
              id={`${formId}-service`}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              disabled={isSubmitting}
            >
              <option value="">Chọn dịch vụ</option>
              <option value="fda">Đăng ký FDA</option>
              <option value="gacc">Mã GACC</option>
              <option value="export-sales">Phòng sale xuất khẩu</option>
              <option value="agent-us">Dịch vụ Agent Hoa Kỳ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
            <label htmlFor={`${formId}-product`} className="block text-sm font-medium mb-2">
              Sản phẩm cần đăng ký
            </label>
            <Input
              id={`${formId}-product`}
              type="text"
              placeholder="Nhập sản phẩm của bạn"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor={`${formId}-description`} className="block text-sm font-medium mb-2">
              Mô tả thêm
            </label>
            <textarea
              id={`${formId}-description`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              rows={4}
            />
          </div>

          {submitMessage && (
            <div
              role="status" aria-live="polite"
              className={`p-3 rounded-md text-sm ${submitMessage.startsWith("✓") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              {submitMessage}
            </div>
          )}

          <Button
            type="submit"
            variant="cta" className="w-full min-h-12"
            size="lg"
            disabled={isSubmitting}
          >
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
      </DialogContent>
    </Dialog>
  )
}

export default ConsultationDialog
