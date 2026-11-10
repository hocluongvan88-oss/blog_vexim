/** Approved positioning and proposed service scopes. No invented performance data. */
export const HOME_POSITIONING = {
  headline: "Global B2B Digital Infrastructure & Export Acceleration Engine",
  description: "We transform Vietnamese manufacturers into globally searchable B2B brands. Build your official high-authority digital presence, dominate global Buyer-intent SEO, and connect directly with the Vexim Trade ecosystem.",
  tradeUrl: "https://veximtrade.com",
} as const

export const EXPORT_PILLARS = [
  {
    id: "export-architecture", number: "01", label: "THE FOUNDATION", title: "B2B Export Web Architecture",
    description: "An official digital presence built for the way international procurement teams evaluate suppliers.",
    features: ["High-speed static / SSR architecture and globally distributed delivery.", "Structured product catalogs: MOQ, HS codes, Incoterms 2020 and packaging specifications.", "Factory certifications and downloadable spec sheets, supplied and verified by your team."],
    output: "Your products. Structured for global discovery.",
  },
  {
    id: "buyer-intent-seo", number: "02", label: "THE DISCOVERY ENGINE", title: "Global Buyer-Intent SEO Engine",
    description: "Be discoverable for commercial questions, not just broad traffic that never turns into a buyer conversation.",
    features: ["Commercial query mapping: bulk supplier, OEM factory Vietnam and FOB pricing.", "Multi-region SEO planning for the US, EU, Middle East and Japan.", "Technical indexing, category content and reporting tied to qualified buyer intent."],
    output: "Search intent. Connected to export demand.",
  },
  {
    id: "trade-sync", number: "03", label: "THE DISTRIBUTION LAYER", title: "Vexim Trade Ecosystem Sync",
    description: "Connect your independent B2B presence with a marketplace and a coordinated buyer inquiry workflow.",
    features: ["Marketplace listing and cross-linking with the Vexim Trade ecosystem.", "Buyer inquiry routing designed around your sales team's operating process.", "Export data intelligence and outbound matching, scoped to available platform access."],
    output: "One export presence. Multiple paths to buyers.",
  },
] as const

export const EXPORT_TIERS = [
  {
    id: "core", number: "01", name: "B2B Core Launchpad", audience: "Single product category exporters", label: "ESTABLISH YOUR FOUNDATION",
    description: "A focused starting point for an export-ready category.",
    features: ["Full B2B web infrastructure setup", "Core category SEO", "1-year verified listing on Vexim Trade"],
  },
  {
    id: "growth", number: "02", name: "Global Growth Engine", audience: "Multi-category factories", label: "CONNECT YOUR PRODUCT LINES",
    description: "A coordinated web, search and content operation for a broader portfolio.",
    features: ["Full product line catalog", "Multi-region buyer-intent SEO", "Monthly B2B content operations", "Inbound lead optimization"],
  },
  {
    id: "enterprise", number: "03", name: "Enterprise Dominance", audience: "Large manufacturing groups", label: "BUILD AN INTEGRATED OPERATION",
    description: "An export agency retainer built around your operating complexity.",
    features: ["Custom web engine", "Global category SEO strategy", "Digital PR", "Vexim outbound data matching"],
  },
] as const

export const PROOF_VIEWS = [
  { id: "visibility", label: "Search visibility", source: "Search Console + dated SERP evidence", title: "Indexed B2B keywords", fields: ["Query & landing URL", "Country & device", "Rank check date"], explanation: "Verify query-level visibility with a dated result and the exact market. A search position is a snapshot, not a guarantee." },
  { id: "reach", label: "Buyer reach", source: "Search Console performance export", title: "Organic buyer impressions", fields: ["Reporting period", "Buyer-intent query group", "Target market"], explanation: "Separate commercial search demand from generic impressions. Search impressions alone do not establish that a visitor is a qualified buyer." },
  { id: "inquiries", label: "Lead quality", source: "Consented analytics + CRM attribution", title: "Cross-border lead conversions", fields: ["Conversion definition", "Attribution window", "Qualified inquiry count"], explanation: "Connect a defined inquiry event to an attributable source and CRM review. Report verified inquiries, not inferred sales." },
] as const
