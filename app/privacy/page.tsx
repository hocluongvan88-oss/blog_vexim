import type { Metadata } from "next"
import { AuditProvider } from "@/components/home/audit-dialog"
import { HomeHeader } from "@/components/home/home-header"
import { HomeFooter } from "@/components/home/home-sections"
import { PUBLIC_EMAIL, SITE_URL } from "@/lib/business-profile"
import styles from "@/components/home/home.module.css"

export const metadata: Metadata = {
  title: "Privacy & Data Requests | Vexim Global",
  description: "How Vexim Global handles information submitted through the digital export audit request form, and how to contact us about your data.",
  manifest: null,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: { locale: "en_US", url: `${SITE_URL}/privacy`, title: "Privacy & Data Requests | Vexim Global", description: "Information about digital audit requests and data contact at Vexim Global." },
}

/** Factual notice for this new form, not a fabricated site-wide legal policy. */
export default function PrivacyPage() {
  return <div lang="en" className={styles.home}>
    <AuditProvider><HomeHeader />
      <main lang="en" className={styles.privacyPage}>
        <div className={styles.container}>
          <p className={styles.sectionLabel}>VEXIM GLOBAL / DATA REQUESTS</p>
          <h1>Privacy &amp; audit requests</h1>
          <p className={styles.privacyLead}>This page explains the information handled by our digital audit request form. It does not replace a full site-wide privacy policy for our other products and services.</p>
          <section><h2>Information you provide</h2><p>To request an audit conversation, you enter a website URL, your company name, target export markets and a business email. You may also select an engagement scope. Please do not include sensitive or confidential information in these fields.</p></section>
          <section><h2>How the request works</h2><p>When email delivery is configured, your information is sent to Vexim Global’s business inbox to respond to your inquiry. Submission does not run an automatic crawl or audit of your website. If online delivery is unavailable, you may choose to send an email draft from your own email application instead. In either case, the form does not save this information to a website database; email services may keep correspondence in their mail systems.</p></section>
          <section><h2>Questions, access or correction</h2><p>For questions about a request, or to ask about access, correction or deletion of the information in your email correspondence, contact <a href={`mailto:${PUBLIC_EMAIL}?subject=Privacy%20and%20data%20request`}>{PUBLIC_EMAIL}</a>. Other parts of the Vexim Global site, including Vietnamese consultation forms and client tools, may involve different data processing. Contact us for details before providing sensitive information.</p></section>
          <a className={styles.privacyBack} href="/">← Back to homepage</a>
        </div>
      </main>
      <HomeFooter /></AuditProvider>
  </div>
}
