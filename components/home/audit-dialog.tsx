"use client"

import { createContext, useContext, useState, type ReactNode, type FormEvent } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PUBLIC_EMAIL } from "@/lib/business-profile"
import { validateDigitalAudit, type DigitalAuditRequest } from "@/lib/digital-audit"
import styles from "./home.module.css"

const AuditContext = createContext<((scope?: string) => void) | null>(null)

export function AuditButton({ children = "Request Free Digital Audit", className, scope }: { children?: ReactNode; className?: string; scope?: string }) {
  const open = useContext(AuditContext)
  return <button type="button" className={className || styles.primaryButton} onClick={() => open?.(scope)}>{children}</button>
}

function emailDraft(data: DigitalAuditRequest) {
  return `Hello Vexim Global,\n\nI would like to request a free digital audit.\n\nWebsite: ${data.website}\nCompany: ${data.company}\nTarget export markets: ${data.markets}\nMy business email: ${data.email}${data.scope ? `\nService scope: ${data.scope}` : ""}\n\nPlease reply to discuss the next steps.`
}

export function AuditProvider({ children }: { children: ReactNode }) {
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
    if (!checked.ok) { setError(checked.error); return }
    const backup = emailDraft(checked.data)
    setDraft(backup) // A visitor can still send their request when server mail is unavailable.
    setBusy(true)
    try {
      const response = await fetch("/api/digital-audit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...checked.data, fax: form.get("fax") }),
      })
      const result = await response.json()
      if (response.ok && result.success === true) { setSent(true); setDraft("") }
      else setError(result.error || "Online submission is unavailable. Please send the email draft instead.")
    } catch { setError("We could not reach the server. Please send the email draft instead.") }
    finally { setBusy(false) }
  }
  return <AuditContext.Provider value={(selectedScope = "") => { setScope(selectedScope); resetDraft(); setOpen(true) }}>
    {children}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={styles.auditDialog}>
        <DialogHeader>
          <p className={styles.eyebrow}>YOUR NEXT EXPORT CHAPTER</p>
          <DialogTitle className={styles.dialogTitle}>Request a free digital audit.</DialogTitle>
          <DialogDescription>Share your official website and where you want to export. We will get back to your business email to discuss next steps.</DialogDescription>
        </DialogHeader>
        {scope && <p className={styles.scopeNote}>Selected scope: <strong>{scope}</strong></p>}
        {sent ? <p role="status" className={styles.successNote}>Your request has been sent. Vexim Global can reply to the business email you provided.</p> : <form onSubmit={submit} className={styles.auditForm}>
          <label htmlFor="audit-website">Website URL<input id="audit-website" name="website" type="url" placeholder="https://yourcompany.com" required maxLength={2048} autoComplete="url" onChange={resetDraft} /></label>
          <label htmlFor="audit-company">Company name<input id="audit-company" name="company" type="text" placeholder="Your manufacturing company" required maxLength={160} autoComplete="organization" onChange={resetDraft} /></label>
          <label htmlFor="audit-markets">Target export markets<input id="audit-markets" name="markets" type="text" placeholder="e.g. United States, Japan, EU" required maxLength={300} onChange={resetDraft} /></label>
          <label htmlFor="audit-email">Business email<input id="audit-email" name="email" type="email" placeholder="name@company.com" required maxLength={254} autoComplete="email" onChange={resetDraft} /></label>
          <label className={styles.trap} aria-hidden="true">Fax<input type="text" name="fax" tabIndex={-1} autoComplete="off" /></label>
          <p className={styles.formNote}>Sent to Vexim Global by email. No automatic website crawl or ranking guarantee is included.</p>
          {error && <p role="alert" className={styles.formError}>{error}</p>}
          <button className={styles.primaryButton} type="submit" disabled={busy}>{busy ? "Sending request…" : "Send audit request"} <span aria-hidden="true">↗</span></button>
        </form>}
        {!sent && draft && <div className={styles.draftPanel} role="status">
          <strong>Alternative: send from your email app.</strong>
          <p>Open the draft, review it and press send. If the email app does not open, copy the details and email {PUBLIC_EMAIL}.</p>
          <a className={styles.darkButton} href={`mailto:${PUBLIC_EMAIL}?subject=${encodeURIComponent("Free digital audit request — Vexim Global")}&body=${encodeURIComponent(draft)}`}>Open email draft ↗</a>
          <button type="button" className={styles.textButton} onClick={async () => {
            try { await navigator.clipboard.writeText(draft); setCopied(true) } catch { setError(`Copy unavailable. Please email ${PUBLIC_EMAIL} directly.`) }
          }}>{copied ? "Details copied" : "Copy request details"}</button>
        </div>}
        <a className={styles.directContact} href={`mailto:${PUBLIC_EMAIL}`}>Prefer a direct conversation? {PUBLIC_EMAIL}</a>
      </DialogContent>
    </Dialog>
  </AuditContext.Provider>
}
