/** Shared form validation. No URL is fetched or analyzed at submission time. */
export interface DigitalAuditRequest {
  website: string
  company: string
  markets: string
  email: string
  scope: string
}

const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const clean = (value: unknown) => typeof value === "string" ? value.trim() : ""

export function validateDigitalAudit(input: unknown): { ok: true; data: DigitalAuditRequest } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, error: "Please provide a valid request." }
  const values = input as Record<string, unknown>
  const website = clean(values.website)
  const company = clean(values.company)
  const markets = clean(values.markets)
  const email = clean(values.email)
  const scope = clean(values.scope)
  if (!website || website.length > 2048 || /[\r\n]/.test(website)) return { ok: false, error: "Please enter a complete website URL." }
  try {
    const parsed = new URL(website)
    if (!["https:", "http:"].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) throw new Error("Invalid URL")
  } catch { return { ok: false, error: "Please enter a complete HTTP or HTTPS website URL." } }
  if (!company || company.length > 160 || /[\x00-\x1f\x7f]/.test(company)) return { ok: false, error: "Please enter a company name (up to 160 characters)." }
  if (!markets || markets.length > 300 || /[\x00-\x1f\x7f]/.test(markets)) return { ok: false, error: "Please enter target export markets (up to 300 characters)." }
  if (!emailPattern.test(email) || email.length > 254 || /[\r\n]/.test(email)) return { ok: false, error: "Please enter a valid business email." }
  if (scope.length > 100 || /[\x00-\x1f\x7f]/.test(scope)) return { ok: false, error: "Please select a valid service scope." }
  return { ok: true, data: { website, company, markets, email, scope } }
}

export function auditEmailText(data: DigitalAuditRequest) {
  return ["New export channel request — Vexim Global", "", `Company: ${data.company}`, `Website: ${data.website}`, `Target export markets: ${data.markets}`, `Reply to: ${data.email}`, `Engagement scope: ${data.scope || "Not specified"}`, "", "No automated checking or result was promised."].join("\n")
}
