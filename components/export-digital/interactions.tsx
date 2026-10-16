"use client"

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react"
import { ArrowRight, CheckCircle2, Loader2, MessageCircle, ShieldCheck } from "lucide-react"
import { VEXIM_ZALO_URL } from "@/lib/contact-info"
import { EXPORT_CHANNELS, EXPORT_MARKETS, EXPORT_SIGNALS } from "@/lib/export-digital-content"
import { exportDigitalLeadSchema } from "@/lib/export-digital-lead"

type Source = "header" | "hero" | "comparison" | "packages" | "report" | "sticky" | "success" | "footer"
function track(
  event: "assessment_cta_click" | "assessment_form_start" | "generate_lead" | "zalo_click",
  source: Source,
) {
  const analytics = window as Window & {
    gtag?: (...args: unknown[]) => void
    dataLayer?: Record<string, unknown>[]
  }
  const params = {
    form_id: "export_digital_assessment",
    service: "export-digital",
    source,
  }
  try {
    if (typeof analytics.gtag === "function") analytics.gtag("event", event, params)
    else if (Array.isArray(analytics.dataLayer)) analytics.dataLayer.push({ event, ...params })
  } catch {
    /* Analytics must not block navigation or submission. */
  }
}

export function ReportLink({
  source,
  children = "Nhận báo cáo miễn phí",
  className = "",
}: {
  source: Source
  children?: ReactNode
  className?: string
}) {
  return (
    <a
      href="#nhan-bao-cao"
      onClick={() => track("assessment_cta_click", source)}
      className={`ed-button ed-button-primary ${className}`}
    >
      {children}
      <ArrowRight size={17} aria-hidden="true" />
    </a>
  )
}
export function ZaloLink({
  source,
  children = "Chat Zalo với chuyên viên",
  className = "",
}: {
  source: Source
  children?: ReactNode
  className?: string
}) {
  return (
    <a
      href={VEXIM_ZALO_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("zalo_click", source)}
      className={`ed-button ed-button-secondary ${className}`}
    >
      {children}
      <MessageCircle size={17} aria-hidden="true" />
    </a>
  )
}

export function PainChecklist() {
  const [selected, setSelected] = useState<number[]>([])
  return (
    <div className="ed-checklist">
      {EXPORT_SIGNALS.map((signal, index) => (
        <label key={signal} className={`ed-signal ${selected.includes(index) ? "is-checked" : ""}`}>
          <input
            type="checkbox"
            checked={selected.includes(index)}
            onChange={(event) =>
              setSelected((current) =>
                event.target.checked ? [...current, index] : current.filter((value) => value !== index),
              )
            }
          />
          <span>{signal}</span>
          <span className="ed-signal-number" aria-hidden="true">
            0{index + 1}
          </span>
        </label>
      ))}
      <p className="ed-checklist-result" aria-live="polite">
        {selected.length >= 2
          ? `Bạn đã tích ${selected.length}/5 dấu hiệu. Vấn đề có thể không nằm ở giá.`
          : "Nếu bạn tích từ 2 ô trở lên, vấn đề có thể không nằm ở giá."}
      </p>
      <p className="ed-fine-print">Chỉ để bạn tự đối chiếu. Lựa chọn không được lưu hoặc gửi đi.</p>
    </div>
  )
}

export function MobileReportBar() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const hero = document.getElementById("export-hero"),
      form = document.getElementById("nhan-bao-cao")
    if (!hero || !form) return
    let heroVisible = true,
      formVisible = false,
      completed = false
    const onComplete = () => {
      completed = true
      setVisible(false)
    }
    window.addEventListener("export-assessment-complete", onComplete)
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting
        else formVisible = entry.isIntersecting
      }
      setVisible(!completed && !heroVisible && !formVisible)
    })
    observer.observe(hero)
    observer.observe(form)
    return () => {
      observer.disconnect()
      window.removeEventListener("export-assessment-complete", onComplete)
    }
  }, [])
  return (
    <div
      className={`ed-mobile-bar ${visible ? "is-visible" : ""}`}
      aria-label="Nhận báo cáo hoặc liên hệ Zalo"
      {...(!visible ? { inert: true } : {})}
    >
      <ReportLink source="sticky">Nhận báo cáo</ReportLink>
      <ZaloLink source="sticky">Zalo</ZaloLink>
    </div>
  )
}

const empty = {
  website: "",
  noWebsite: false,
  company: "",
  product: "",
  markets: [] as string[],
  name: "",
  phone: "",
  email: "",
  channels: [] as string[],
  honeypot: "",
}
export function AssessmentForm() {
  const id = useId()
  const [data, setData] = useState(empty)
  const [status, setStatus] = useState<"idle" | "pending" | "error" | "success">("idle")
  const [error, setError] = useState("")
  const [reference, setReference] = useState("")
  const requestId = useRef("")
  const started = useRef(false)
  const successRef = useRef<HTMLDivElement>(null)
  const pending = status === "pending"
  useEffect(() => {
    if (status === "success") successRef.current?.focus()
  }, [status])
  function change<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setData((current) => ({ ...current, [key]: value }))
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || status === "success") return
    const result = exportDigitalLeadSchema.safeParse(data)
    if (!result.success) {
      setStatus("error")
      setError(result.error.issues[0]?.message || "Vui lòng kiểm tra lại thông tin.")
      return
    }
    setStatus("pending")
    setError("")
    try {
      requestId.current ||= crypto.randomUUID()
      const response = await fetch("/api/export-digital-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": requestId.current,
        },
        body: JSON.stringify(result.data),
      })
      const body = await response.json().catch(() => null)
      if (!response.ok || body?.success !== true) {
        setStatus("error")
        setError(
          typeof body?.error === "string"
            ? body.error
            : "Chưa gửi được yêu cầu. Vui lòng thử lại hoặc nhắn Zalo.",
        )
        return
      }
      setReference(body.requestId || requestId.current)
      setStatus("success")
      window.dispatchEvent(new Event("export-assessment-complete"))
      track("generate_lead", "report")
    } catch {
      setStatus("error")
      setError("Chưa kết nối được. Thông tin vẫn được giữ để bạn thử lại, hoặc nhắn Zalo cho Vexim.")
    }
  }
  if (status === "success")
    return (
      <div ref={successRef} tabIndex={-1} className="ed-form-success" role="status">
        <div className="ed-success-icon">
          <CheckCircle2 size={32} aria-hidden="true" />
        </div>
        <p className="ed-eyebrow">Yêu cầu đã được tiếp nhận</p>
        <h3>Cảm ơn bạn. Chúng tôi bắt đầu từ đây.</h3>
        <p>
          Chuyên viên Vexim sẽ gửi báo cáo{" "}
          <strong>“Buyer và AI nhìn thấy gì về bạn” trong 2 ngày làm việc</strong> qua Zalo/điện thoại
          {data.email ? " hoặc email bạn đã cung cấp" : " bạn đã cung cấp"}.
        </p>
        <p className="ed-fine-print">
          Mã yêu cầu: <span className="ed-reference">{reference}</span>. Đây là xác nhận tiếp nhận, báo cáo
          chưa được tạo tự động.
        </p>
        <ZaloLink source="success">Chat Zalo ngay</ZaloLink>
        <a href="/services/export-digital/goc-nhin-buyer" className="ed-text-link">
          Đọc: Buyer nhìn website của bạn trong 30 giây đầu <ArrowRight size={16} />
        </a>
      </div>
    )
  return (
    <form
      className="ed-form"
      onSubmit={submit}
      onFocus={() => {
        if (!started.current) {
          started.current = true
          track("assessment_form_start", "report")
        }
      }}
      data-testid="export-assessment-form"
      aria-busy={pending}
    >
      <fieldset disabled={pending}>
        <legend className="sr-only">Thông tin nhận báo cáo miễn phí</legend>
        <div className="ed-honeypot" aria-hidden="true">
          <label htmlFor={`${id}-fax`}>
            Fax
            <input
              id={`${id}-fax`}
              name="fax"
              value={data.honeypot}
              onChange={(e) => change("honeypot", e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
        <label htmlFor={`${id}-website`}>
          Website doanh nghiệp {!data.noWebsite && <span aria-hidden="true">*</span>}
          <input
            id={`${id}-website`}
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="doanhnghiep.com — không cần nhập https://"
            maxLength={500}
            required={!data.noWebsite}
            disabled={data.noWebsite || pending}
            value={data.website}
            onChange={(e) => change("website", e.target.value)}
          />
        </label>
        <label className="ed-inline-check">
          <input
            name="noWebsite"
            type="checkbox"
            checked={data.noWebsite}
            onChange={(e) => change("noWebsite", e.target.checked)}
          />
          Chưa có website — đánh giá theo tên doanh nghiệp
        </label>
        <label htmlFor={`${id}-company`}>
          Tên doanh nghiệp <span aria-hidden="true">*</span>
          <input
            id={`${id}-company`}
            name="company"
            autoComplete="organization"
            required
            minLength={2}
            maxLength={180}
            placeholder="Tên công ty để buyer tìm kiếm"
            value={data.company}
            onChange={(e) => change("company", e.target.value)}
          />
        </label>
        <label htmlFor={`${id}-product`}>
          Sản phẩm chính <span aria-hidden="true">*</span>
          <input
            id={`${id}-product`}
            name="product"
            required
            minLength={2}
            maxLength={240}
            placeholder="Ví dụ: hạt điều, mỹ phẩm gia công OEM"
            value={data.product}
            onChange={(e) => change("product", e.target.value)}
          />
        </label>
        <fieldset className="ed-options">
          <legend>
            Thị trường muốn bán <span aria-hidden="true">*</span> <small>Chọn ít nhất một</small>
          </legend>
          <div>
            {EXPORT_MARKETS.map((market) => (
              <label key={market}>
                <input
                  type="checkbox"
                  name="markets"
                  value={market}
                  checked={data.markets.includes(market)}
                  onChange={(e) =>
                    change(
                      "markets",
                      e.target.checked
                        ? [...data.markets, market]
                        : data.markets.filter((value) => value !== market),
                    )
                  }
                />
                {market}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="ed-form-row">
          <label htmlFor={`${id}-name`}>
            Họ và tên <span aria-hidden="true">*</span>
            <input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              value={data.name}
              onChange={(e) => change("name", e.target.value)}
              placeholder="Người nhận báo cáo"
            />
          </label>
          <label htmlFor={`${id}-phone`}>
            Điện thoại / Zalo <span aria-hidden="true">*</span>
            <input
              id={`${id}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={30}
              value={data.phone}
              onChange={(e) => change("phone", e.target.value)}
              placeholder="Số liên hệ của bạn"
            />
          </label>
        </div>
        <label htmlFor={`${id}-email`}>
          Email <small>Không bắt buộc</small>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={data.email}
            onChange={(e) => change("email", e.target.value)}
            placeholder="Để nhận thêm bản PDF qua email"
          />
        </label>
        <fieldset className="ed-options">
          <legend>
            Đang bán qua kênh nào? <small>Không bắt buộc</small>
          </legend>
          <div>
            {EXPORT_CHANNELS.map((channel) => (
              <label key={channel}>
                <input
                  type="checkbox"
                  name="channels"
                  value={channel}
                  checked={data.channels.includes(channel)}
                  onChange={(e) =>
                    change(
                      "channels",
                      e.target.checked
                        ? [...data.channels, channel]
                        : data.channels.filter((value) => value !== channel),
                    )
                  }
                />
                {channel}
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>
      {error && (
        <div className="ed-form-error" role="alert">
          {error}
          <a href={VEXIM_ZALO_URL} target="_blank" rel="noopener noreferrer">
            Nhắn Zalo với Vexim
          </a>
        </div>
      )}
      <button type="submit" className="ed-button ed-button-primary ed-submit" disabled={pending}>
        {pending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Đang gửi yêu cầu…
          </>
        ) : (
          <>
            Nhận báo cáo miễn phí
            <ArrowRight size={18} />
          </>
        )}
      </button>
      <p className="ed-form-privacy">
        <ShieldCheck size={15} aria-hidden="true" />
        <span>
          Không cam kết mua · Thông tin chỉ dùng để làm báo cáo và liên hệ về yêu cầu này. Dấu * là trường bắt
          buộc.
        </span>
      </p>
    </form>
  )
}
