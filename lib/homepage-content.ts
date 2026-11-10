/** Homepage positioning and proposed scopes. No unsupported rankings or outcomes. */
export const HOME_POSITIONING = {
  headline: "Global B2B Digital Infrastructure & Export Acceleration",
  description: "We empower Vietnamese manufacturers to build world-class official digital foundations, become easier to discover through buyer-intent search, and connect with the Vexim Trade ecosystem.",
  tradeUrl: "https://veximtrade.com",
} as const

export const EXPORT_PILLARS = [
  {
    id: "export-architecture", number: "01", label: "THE FOUNDATION", title: "B2B Export Web Architecture",
    description: "A fast, credible home for your products and the details international buyers need to verify your business.",
    features: [
      "High-speed static / SSR architecture for an official B2B website.",
      "Structured catalogs with MOQ, Incoterms 2020 and specifications.",
      "Factory credentials and spec sheets supplied and verified by your team.",
    ],
    output: "Own your digital foundation.",
  },
  {
    id: "buyer-intent-seo", number: "02", label: "THE DISCOVERY ENGINE", title: "Global Buyer-Intent SEO",
    description: "Make your product categories useful for the commercial searches procurement teams actually make.",
    features: [
      "Query mapping for bulk supply, OEM sourcing and FOB searches.",
      "Market-specific content planning for the US, EU and Middle East.",
      "Technical indexing and reporting with a clear source and timeframe.",
    ],
    output: "Be ready when buyers search.",
  },
  {
    id: "trade-sync", number: "03", label: "THE CONNECTION LAYER", title: "Vexim Trade Platform Integration",
    description: "Connect an independent export website with a relevant marketplace presence and a clearer inquiry pathway.",
    features: [
      "Listing support and cross-linking, subject to platform eligibility.",
      "Inquiry routing designed around your sales team's workflow.",
      "Outbound data matching only where platform access and scope allow.",
    ],
    output: "Connect discovery to conversation.",
  },
] as const

/** Proposed engagement scopes; deliverables and marketplace terms require agreement. */
export const EXPORT_TIERS = [
  {
    id: "core", number: "01", name: "B2B Launchpad", audience: "Single core product line", label: "BUILD THE FOUNDATION",
    description: "A focused digital export starting point for one product line.",
    features: [
      "B2B website infrastructure and catalog setup",
      "Core category buyer-intent SEO",
      "Vexim Trade listing support, subject to eligibility and agreed term",
    ],
  },
  {
    id: "growth", number: "02", name: "Global Growth Engine", audience: "Multi-category factories", label: "CONNECT THE PORTFOLIO",
    description: "An ongoing search, content and inquiry operation across a broader catalog.",
    features: [
      "Multi-category catalog architecture",
      "Multi-region buyer-intent SEO",
      "Monthly B2B content operations",
      "Inbound inquiry optimization",
    ],
  },
  {
    id: "enterprise", number: "03", name: "Enterprise Dominance", audience: "Large manufacturing groups", label: "OPERATE AT SCALE",
    description: "A tailored export agency retainer aligned with your product and market complexity.",
    features: [
      "Custom web and catalog infrastructure",
      "Category SEO and digital B2B PR planning",
      "Outbound data matching where available",
      "Ongoing operations scoped by agreement",
    ],
  },
] as const
