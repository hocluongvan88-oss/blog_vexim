"use client"

import { createContext, useContext, useState, type FormEvent, type ReactNode } from "react"
import { PUBLIC_EMAIL } from "@/lib/business-profile"
import { validateDigitalAudit } from "@/lib/digital-audit"
import { HOME_CLIENT_MESSAGES, VI_AUDIT_ERRORS } from "@/lib/home-client-i18n"
import type { HomeSolutionId } from "@/lib/homepage-content"
import type { HomeLocale } from "@/lib/locale-routes"
import styles from "./home.module.css"

type Scope = HomeSolutionId | ""
const Context = createContext<{ scope: Scope; choose: (s: Scope) => void }>({ scope: "", choose: () => {} })

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [scope, choose] = useState<Scope>("")
  return <Context.Provider value={{ scope, choose }}>{children}</Context.Provider>
}

/** A normal fragment link still works before hydration. Carry the service of
 * interest into the single form rather than maintaining separate lead flows. */
export function ConsultationLink({
  children,
  service,
  className,
}: {
  children: ReactNode
  service: Scope
  className: string
}) {
  const { choose } = useContext(Context)
  return (
    <a href="#contact" className={className} onClick={() => choose(service)}>
      {children}
    </a>
  )
}

export function ConsultationForm({
  locale,
  options,
}: {
  locale: HomeLocale
  options: readonly { id: HomeSolutionId; name: string }[]
}) {
  const f = HOME_CLIENT_MESSAGES[locale].form
  const { scope, choose } = useContext(Context)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [draft, setDraft] = useState("")
  const [copied, setCopied] = useState(false)
  const reset = () => {
    setError("")
    setDraft("")
    setCopied(false)
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    reset()
    const form = new FormData(event.currentTarget)
    const result = validateDigitalAudit({
      ...Object.fromEntries(form),
      scope: options.find((s) => s.id === scope)?.name || "",
    })
    if (!result.ok) {
      setError(locale === "vi" ? VI_AUDIT_ERRORS[result.error] || f.failed : result.error)
      return
    }
    setBusy(true)
    const data = result.data
    try {
      const response = await fetch("/api/digital-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, fax: form.get("fax") }),
      })
      if (!response.ok || (await response.json()).success !== true) throw new Error("Not delivered")
      setSent(true)
    } catch {
      setError(f.failed)
      setDraft(
        [
          f.greeting,
          "",
          `${f.company}: ${data.company}`,
          `${f.email}: ${data.email}`,
          data.website,
          data.phone,
          `${f.markets}: ${data.markets}`,
          data.scope,
        ]
          .filter(Boolean)
          .join("\n"),
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className={styles.formCard}>
      {sent ? (
        <div className={styles.success}>
          <p role="status">{f.sent}</p>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              setSent(false)
              choose("")
              reset()
            }}
          >
            {f.again}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} onChange={reset} aria-label={HOME_CLIENT_MESSAGES[locale].nav.consult}>
          <fieldset disabled={busy} className={styles.fields}>
            <label>
              {f.company}
              <input
                name="company"
                id="audit-company"
                required
                autoComplete="organization"
                maxLength={160}
                placeholder={f.companyHint}
              />
            </label>
            <label>
              {f.phone}
              <input name="phone" type="tel" autoComplete="tel" maxLength={32} placeholder="+84…" />
            </label>
            <label>
              {f.email}
              <input
                name="email"
                id="audit-email"
                type="email"
                required
                autoComplete="email"
                maxLength={254}
                placeholder="name@company.com"
              />
            </label>
            <label>
              {f.website}
              <input
                name="website"
                id="audit-website"
                type="url"
                autoComplete="url"
                maxLength={2048}
                placeholder="https://"
              />
            </label>
            <label className={styles.fullField}>
              {f.service}
              <select name="scope" value={scope} onChange={(e) => choose(e.target.value as Scope)}>
                <option value="">{f.choose}</option>
                {options.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.fullField}>
              {f.markets}
              <textarea
                name="markets"
                id="audit-markets"
                required
                maxLength={300}
                rows={2}
                placeholder={f.marketsHint}
              />
            </label>
            <label hidden aria-hidden="true">
              Fax
              <input tabIndex={-1} name="fax" autoComplete="off" />
            </label>
            <button className={`${styles.button} ${styles.fullField}`} type="submit">
              {busy ? f.sending : f.submit} <span aria-hidden="true">→</span>
            </button>
          </fieldset>
          <p className={styles.formNote}>{f.note}</p>
          {error && (
            <p role="alert" className={styles.formError}>
              {error}
            </p>
          )}
          {draft && (
            <div className={styles.draft}>
              <a
                href={`mailto:${PUBLIC_EMAIL}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(draft)}`}
              >
                {f.draft} ↗
              </a>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(draft)
                    setCopied(true)
                  } catch {
                    setError(f.copyFailed)
                  }
                }}
              >
                {copied ? f.copied : f.copy}
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  )
}
