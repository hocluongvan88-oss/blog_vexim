"use client"

/** No analytics script is injected here. Use an existing GA4/GTM installation, if any.
 * Only fixed service/source labels are sent; never names, email, phone or product text.
 */
export function trackConsultationEvent(
  name: "consultation_open" | "form_start" | "generate_lead",
  source: string,
  service: string,
) {
  if (typeof window === "undefined") return
  const analytics = window as Window & {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (command: "event", name: string, params: Record<string, string>) => void
  }
  const params = { form_name: "consultation", source, service }
  // Analytics must never prevent opening/submitting the form.
  try {
    if (typeof analytics.gtag === "function") analytics.gtag("event", name, params)
    else if (Array.isArray(analytics.dataLayer)) analytics.dataLayer.push({ event: name, ...params })
  } catch {
    // A blocked or unavailable analytics endpoint is not a form error.
  }
}
