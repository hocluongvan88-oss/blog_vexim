import { ADDRESS, BRAND_SLOGAN, ORGANIZATION_NAME, PHONE_DISPLAY, PHONE_E164, PUBLIC_EMAIL, SITE_URL } from "./business-profile"

/** Escape all customer/FDA data before inserting it into an HTML email. */
export function escapeEmailHtml(value: unknown): string {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
}

/** Only absolute HTTP(S) links are allowed in email CTAs. */
export function emailUrl(value: string): string {
  const url = new URL(value)
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Invalid email link protocol")
  return escapeEmailHtml(url.href)
}

export function emailButton(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;width:100%;"><tr><td align="left"><a class="email-button" href="${emailUrl(href)}" style="display:inline-block;background-color:#17365d;border:1px solid #17365d;border-radius:6px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;line-height:24px;padding:14px 22px;mso-padding-alt:14px 22px;text-align:center;">${escapeEmailHtml(label)}</a></td></tr></table>`
}

export function emailParagraph(html: string): string {
  return `<p style="margin:0 0 18px;font-size:16px;line-height:26px;">${html}</p>`
}

/** Stacked label/value rows stay readable even at 320px or with long emails. */
export function emailDetails(rows: Array<[string, unknown]>): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-panel" bgcolor="#f1f5f9" style="width:100%;table-layout:fixed;background-color:#f1f5f9;border:1px solid #dbe3ed;border-radius:6px;margin:20px 0;">${rows.filter(([, value]) => value !== undefined && value !== null && value !== "").map(([label, value]) => `<tr><td style="padding:12px 18px;border-bottom:1px solid #dbe3ed;overflow-wrap:anywhere;word-break:break-word;"><span class="email-muted" style="font-size:13px;line-height:20px;color:#526176;">${escapeEmailHtml(label)}</span><br><span style="font-size:16px;line-height:26px;white-space:pre-line;">${escapeEmailHtml(value)}</span></td></tr>`).join("")}</table>`
}

/**
 * Shared shell: critical styles inline; table layout; no gradients/webfonts/images
 * required for reading. Apple Mail dark-mode CSS is progressive enhancement.
 * Actual Gmail/iOS transformations must still be checked on a real device.
 */
export function renderEmail({ title, preheader, body, footerLinks = "" }: {
  title: string
  preheader: string
  body: string
  footerLinks?: string
}): string {
  return `<!DOCTYPE html>
<html lang="vi"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting"><meta name="format-detection" content="telephone=no,address=no,date=no,email=no">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${escapeEmailHtml(title)}</title>
<style>
:root { color-scheme:light dark; supported-color-schemes:light dark; }
body,table,td,a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
a { color:#17365d; text-decoration:underline; }
a[x-apple-data-detectors] { color:inherit !important; font:inherit !important; text-decoration:none !important; }
@media screen and (max-width:480px) {
 .email-outer { padding:12px 8px !important; }
 .email-padding { padding:24px 20px !important; }
 .email-title { font-size:24px !important; line-height:32px !important; }
 .email-button { display:block !important; padding:14px 12px !important; }
}
@media (prefers-color-scheme:dark) {
 body,.email-bg { background-color:#101827 !important; color:#e5edf7 !important; }
 .email-card { background-color:#182438 !important; color:#e5edf7 !important; border-color:#3d4e65 !important; }
 .email-panel { background-color:#223149 !important; color:#e5edf7 !important; border-color:#3d4e65 !important; }
 .email-muted { color:#b6c5d8 !important; }
 .email-card a { color:#a9d1ff !important; }
 .email-card .email-button { background-color:#a9d1ff !important; color:#10233e !important; border-color:#a9d1ff !important; }
}
</style></head>
<body class="email-bg" bgcolor="#f1f5f9" style="margin:0;padding:0;width:100%;background-color:#f1f5f9;color:#243247;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;">${escapeEmailHtml(preheader)}</div>
<table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f1f5f9" style="width:100%;table-layout:fixed;background-color:#f1f5f9;"><tr><td class="email-outer" align="center" style="padding:32px 16px;">
<!--[if mso]><table role="presentation" width="600" align="center"><tr><td><![endif]-->
<table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="width:100%;max-width:600px;table-layout:fixed;background-color:#ffffff;color:#243247;border:1px solid #dbe3ed;border-top:4px solid #17365d;">
<tr><td class="email-padding" style="padding:28px 32px;border-bottom:1px solid #dbe3ed;">
<p style="margin:0 0 6px;font-size:19px;line-height:26px;font-weight:bold;letter-spacing:1px;">${ORGANIZATION_NAME.toUpperCase()}</p>
<p class="email-muted" style="margin:0;font-size:14px;line-height:22px;color:#526176;">${BRAND_SLOGAN}</p>
</td></tr>
<tr><td class="email-padding" style="padding:32px;overflow-wrap:anywhere;word-break:break-word;">
<h1 class="email-title" style="margin:0 0 24px;font-size:28px;line-height:36px;letter-spacing:-0.4px;">${escapeEmailHtml(title)}</h1>
${body}
</td></tr>
<tr><td class="email-padding email-muted" style="padding:24px 32px;border-top:1px solid #dbe3ed;color:#526176;font-size:13px;line-height:22px;overflow-wrap:anywhere;word-break:break-word;">
<p style="margin:0 0 8px;"><strong>${ORGANIZATION_NAME}</strong><br>${BRAND_SLOGAN}</p>
<p style="margin:0 0 10px;">${escapeEmailHtml(ADDRESS.streetAddress)}, ${escapeEmailHtml(ADDRESS.addressLocality)}<br>
<a href="mailto:${PUBLIC_EMAIL}" style="color:#17365d;">${PUBLIC_EMAIL}</a><br>
<a href="tel:${PHONE_E164}" style="color:#17365d;">${PHONE_DISPLAY}</a> · <a href="${SITE_URL}" style="color:#17365d;">veximglobal.com</a></p>
${footerLinks}
<p style="margin:12px 0 0;">© ${new Date().getFullYear()} ${ORGANIZATION_NAME}</p>
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`
}
