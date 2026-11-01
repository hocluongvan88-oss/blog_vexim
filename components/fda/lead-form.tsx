"use client"

import { useId, useRef, useState, type FormEvent } from "react"
import { ArrowRight, CheckCircle2, Loader2, RotateCcw, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trackConsultationEvent } from "@/lib/conversion-tracking"
import { VEXIM_PHONE_DISPLAY, VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"

const emptyForm = { company: "", name: "", email: "", phone: "", product: "", description: "", honeypot: "" }

/** The two reference-style inline forms share the site's real consultation endpoint. */
export function FdaLeadForm({ compact = false }: { compact?: boolean }) {
  const id = useId()
  const [data, setData] = useState(emptyForm)
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const started = useRef(false)
  const source = compact ? "fda_hero" : "fda_contact"
  const busy = status === "pending"
  const done = status === "success"
  const control =
    "mt-2 min-h-12 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-primary placeholder:text-slate-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
  const label = "block text-sm font-medium text-primary"

  function change(key: keyof typeof emptyForm, value: string) {
    setData((current) => ({ ...current, [key]: value }))
  }

  function start() {
    if (!started.current) {
      started.current = true
      trackConsultationEvent("form_start", source, "fda")
    }
  }

  function reset() {
    setData(emptyForm)
    setMessage("")
    setStatus("idle")
    started.current = false
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || done) return
    setStatus("pending")
    setMessage("")
    try {
      const description = [data.company.trim() ? `Doanh nghiệp: ${data.company.trim()}` : "", data.description.trim()]
        .filter(Boolean)
        .join("\n")
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email.trim(),
          service: "fda",
          product: data.product,
          description,
          honeypot: data.honeypot,
        }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || result?.success !== true) {
        setStatus("error")
        setMessage(
          typeof result?.error === "string"
            ? result.error
            : "Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi hotline.",
        )
        return
      }
      setStatus("success")
      setMessage("Vexim đã nhận yêu cầu. Chúng tôi sẽ liên hệ tư vấn trong vòng 24 giờ.")
      trackConsultationEvent("generate_lead", source, "fda")
    } catch {
      setStatus("error")
      setMessage("Không kết nối được. Vui lòng thử lại hoặc gọi hotline.")
    }
  }

  return (
    <form
      onSubmit={submit}
      onFocus={start}
      data-testid="fda-lead-form"
      data-form-location={compact ? "hero" : "contact"}
      className="space-y-4"
    >
      <fieldset disabled={busy || done} className="space-y-4 min-w-0">
        <legend className="sr-only">Thông tin đăng ký tư vấn FDA</legend>
        <div aria-hidden="true" className="absolute -left-[10000px]">
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            name="website"
            value={data.honeypot}
            onChange={(event) => change("honeypot", event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {!compact && (
          <label className={label} htmlFor={`${id}-company`}>
            Tên công ty <span className="text-red-600">*</span>
            <input
              id={`${id}-company`}
              name="company"
              autoComplete="organization"
              required
              maxLength={180}
              value={data.company}
              onChange={(event) => change("company", event.target.value)}
              className={control}
              placeholder="Tên doanh nghiệp của bạn"
            />
          </label>
        )}
        <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
          <label className={label} htmlFor={`${id}-name`}>
            Tên liên hệ <span className="text-red-600">*</span>
            <input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              value={data.name}
              onChange={(event) => change("name", event.target.value)}
              className={control}
              placeholder="Họ và tên"
            />
          </label>
          <label className={label} htmlFor={`${id}-phone`}>
            Số điện thoại <span className="text-red-600">*</span>
            <input
              id={`${id}-phone`}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              maxLength={20}
              value={data.phone}
              onChange={(event) => change("phone", event.target.value)}
              className={control}
              placeholder="Số điện thoại liên hệ"
            />
          </label>
        </div>
        <label className={label} htmlFor={`${id}-email`}>
          Email <span className="text-red-600">*</span>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={data.email}
            onChange={(event) => change("email", event.target.value)}
            className={control}
            placeholder="email@doanhnghiep.com"
          />
        </label>
        <label className={label} htmlFor={`${id}-product`}>
          Loại sản phẩm <span className="text-red-600">*</span>
          <select
            id={`${id}-product`}
            name="product"
            required
            value={data.product}
            onChange={(event) => change("product", event.target.value)}
            className={control}
          >
            <option value="">Chọn loại sản phẩm</option>
            {["Thực phẩm", "Mỹ phẩm", "Thiết bị y tế", "Thực phẩm chức năng", "Dược phẩm", "Khác"].map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </label>
        {!compact && (
          <label className={label} htmlFor={`${id}-description`}>
            Mô tả ngắn
            <textarea
              id={`${id}-description`}
              name="description"
              rows={3}
              maxLength={500}
              value={data.description}
              onChange={(event) => change("description", event.target.value)}
              className={`${control} resize-y`}
              placeholder="Sản phẩm, tình trạng hồ sơ và nhu cầu của doanh nghiệp…"
            />
            <span className="mt-1 block text-right text-xs font-normal text-muted-foreground">
              {data.description.length}/500 ký tự
            </span>
          </label>
        )}
      </fieldset>
      {message && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-lg border p-4 text-sm leading-relaxed ${done ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-800"}`}
        >
          {done && <CheckCircle2 className="mr-2 inline h-4 w-4" aria-hidden="true" />}
          {message}
          {status === "error" && (
            <a href={VEXIM_PHONE_TEL_URL} className="mt-2 block font-semibold underline">
              Gọi Vexim: {VEXIM_PHONE_DISPLAY}
            </a>
          )}
        </div>
      )}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="cta"
          disabled={busy || done}
          className="min-h-12 h-auto flex-1 whitespace-normal px-4 py-3 text-base"
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Đang gửi…
            </>
          ) : done ? (
            "Đã gửi yêu cầu"
          ) : (
            <>
              {compact ? "Nhận tư vấn miễn phí" : "Gửi yêu cầu tư vấn"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
        {(!compact || done) && (
          <Button type="button" variant="outline" onClick={reset} disabled={busy} className="min-h-12 h-auto px-3">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>{done ? "Gửi mới" : "Xóa"}</span>
          </Button>
        )}
      </div>
      <p className="flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        Thông tin được sử dụng để tư vấn theo yêu cầu của bạn.
      </p>
    </form>
  )
}
