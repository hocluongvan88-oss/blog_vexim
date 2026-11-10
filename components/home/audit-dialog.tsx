"use client"

import { createContext, useContext, useState, type ReactNode, type FormEvent } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PUBLIC_EMAIL } from "@/lib/business-profile"
import { HOME_CLIENT_MESSAGES, VI_AUDIT_ERRORS } from "@/lib/home-client-i18n"
import type { HomeLocale } from "@/lib/locale-routes"
import { validateDigitalAudit, type DigitalAuditRequest } from "@/lib/digital-audit"
import styles from "./home.module.css"

const AuditContext = createContext<{ open: (scope?: string) => void; locale: HomeLocale } | null>(null)

export function AuditButton({ children, className, scope }: { children?: ReactNode; className?: string; scope?: string }) {
  const context = useContext(AuditContext)
  return <button type="button" className={className || styles.primaryButton} onClick={() => context?.open(scope)}>{children ?? HOME_CLIENT_MESSAGES[context?.locale ?? "en"].audit.defaultButton}</button>
}

function emailDraft(data: DigitalAuditRequest, locale: HomeLocale) {
  const text = HOME_CLIENT_MESSAGES[locale].audit
  return `${text.draftGreeting}\n\n${text.draftIntro}\n\n${text.draftWebsite} ${data.website}\n${text.draftCompany} ${data.company}\n${text.draftMarkets} ${data.markets}\n${text.draftEmail} ${data.email}${data.scope ? `\n${text.draftScope} ${data.scope}` : ""}\n\n${text.draftClosing}`
}

export function AuditProvider({ children, locale }: { children: ReactNode; locale: HomeLocale }) {
  const text = HOME_CLIENT_MESSAGES[locale].audit
  const [open, setOpen] = useState(false)
  const [scope, setScope] = useState("")
  const [draft, setDraft] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const resetDraft = () => { setDraft(""); setError(""); setSent(false); setCopied(false) }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    const form = new FormData(event.currentTarget)
    const checked = validateDigitalAudit({
      website: form.get("website"), company: form.get("company"), markets: form.get("markets"),
      email: form.get("email"), scope,
    })
    if (!checked.ok) { setError(locale === "vi" ? VI_AUDIT_ERRORS[checked.error] || text.unavailable : checked.error); return }
    const backup = emailDraft(checked.data, locale)
    setDraft(backup) // Visitors can send their request when server mail is unavailable.
    setBusy(true)
    try {
      const response = await fetch("/api/digital-audit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...checked.data, fax: form.get("fax") }),
      })
      const result = await response.json()
      if (response.ok && result.success === true) { setSent(true); setDraft("") }
      else setError(locale === "vi" ? text.unavailable : result.error || text.unavailable)
    } catch { setError(text.network) }
    finally { setBusy(false) }
  }
  return <AuditContext.Provider value={{ locale, open: (selectedScope = "") => { setScope(selectedScope); resetDraft(); setOpen(true) } }}>
    {children}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent lang={locale} className={styles.auditDialog}>
        <DialogHeader>
          <p className={styles.eyebrow}>{text.eyebrow}</p>
          <DialogTitle className={styles.dialogTitle}>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        {scope && <p className={styles.scopeNote}>{text.selected} <strong>{scope}</strong></p>}
        {sent ? <p role="status" className={styles.successNote}>{text.sent}</p> : <form onSubmit={submit} className={styles.auditForm}>
          <label htmlFor="audit-website">{text.website}<input id="audit-website" name="website" type="url" placeholder={text.websiteHint} required maxLength={2048} autoComplete="url" onChange={resetDraft} /></label>
          <label htmlFor="audit-company">{text.company}<input id="audit-company" name="company" type="text" placeholder={text.companyHint} required maxLength={160} autoComplete="organization" onChange={resetDraft} /></label>
          <label htmlFor="audit-markets">{text.markets}<input id="audit-markets" name="markets" type="text" placeholder={text.marketsHint} required maxLength={300} onChange={resetDraft} /></label>
          <label htmlFor="audit-email">{text.email}<input id="audit-email" name="email" type="email" placeholder={text.emailHint} required maxLength={254} autoComplete="email" onChange={resetDraft} /></label>
          <label className={styles.trap} aria-hidden="true">Fax<input type="text" name="fax" tabIndex={-1} autoComplete="off" /></label>
          <p className={styles.formNote}>{text.note}</p>
          {error && <p role="alert" className={styles.formError}>{error}</p>}
          <button className={styles.primaryButton} type="submit" disabled={busy}>{busy ? text.busy : text.submit} <span aria-hidden="true">↗</span></button>
        </form>}
        {!sent && draft && <div className={styles.draftPanel} role="status">
          <strong>{text.alternative}</strong>
          <p>{text.alternativeInfo} {PUBLIC_EMAIL}.</p>
          <a className={styles.darkButton} href={`mailto:${PUBLIC_EMAIL}?subject=${encodeURIComponent(text.draftSubject)}&body=${encodeURIComponent(draft)}`}>{text.openDraft}</a>
          <button type="button" className={styles.textButton} onClick={async () => {
            try { await navigator.clipboard.writeText(draft); setCopied(true) } catch { setError(`${text.copyUnavailable} ${PUBLIC_EMAIL} ${locale === "vi" ? "để được hỗ trợ." : "directly."}`) }
          }}>{copied ? text.copied : text.copy}</button>
        </div>}
        <a className={styles.directContact} href={`mailto:${PUBLIC_EMAIL}`}>{text.direct} {PUBLIC_EMAIL}</a>
      </DialogContent>
    </Dialog>
  </AuditContext.Provider>
}
