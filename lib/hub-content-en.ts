/**
 * Overview hub — English. Product names stay untranslated.
 *
 * Same rule as the Vietnamese hub: this page divides, it does not explain.
 * Every href here must point at a route that exists; `verify-hub-links.mjs`
 * checks the Vietnamese file, and these two share structure.
 */

import { VI_HUB } from "./hub-content-vi"

export const EN_HUB = {
  hero: {
    eyebrow: "VEXIM GLOBAL · EXPORT SALES CHANNEL",
    titleBefore: "Good goods are not enough.",
    titleAccent: "A buyer has to find you.",
    line: "Four things, done together, for Vietnamese manufacturers selling abroad.",
    primary: "Talk to us",
    secondary: "See the four things",
    secondaryHref: "#works",
    indexLabel: "Page contents",
    index: [
      { number: "01", label: "What Vexim does", href: "#works" },
      { number: "02", label: "Engagement scope", href: "#scope" },
      { number: "03", label: "Compliance services", href: "#compliance" },
      { number: "04", label: "Contact", href: "#contact" },
    ],
  },

  worksLabel: "01 / WHAT VEXIM DOES",
  worksTitle: "Four things. Four pages.",
  worksHint: "Open any one of them for the detail.",
  works: [
    { number: "01", label: "B2B MARKETPLACE", title: "Vexim Trade", line: "Buyers with an order already look for the factory.", href: "https://veximtrade.com", external: true, cta: "Open Vexim Trade" },
    { number: "02", label: "MARKET APPROACH", title: "Buyers in each market", line: "Read what they call your goods before writing a word.", href: "/services/export-delegation", cta: "See the method" },
    { number: "03", label: "PRODUCT WEBSITE", title: "A page a buyer can order from", line: "Six things they need. Most sites are a brochure.", href: "/services/export-sales", cta: "See the structure" },
    { number: "04", label: "EXPORT SERVICES", title: "Documents and permits", line: "Delegated export, import-country licences.", href: "/services/export-delegation", cta: "See services" },
  ],

  scopeLabel: "02 / ENGAGEMENT SCOPE",
  scopeTitle: "Agree the markets first.",
  scopeLine: "Then agree how much work gets you there.",
  scope: [
    { name: "B2B Launchpad", for: "One lead product", id: "core" },
    { name: "Global Growth Engine", for: "Several groups, several markets", id: "growth" },
    { name: "Enterprise Dominance", for: "Large manufacturing groups", id: "enterprise" },
  ],
  scopeCta: "Discuss this scope",

  complianceLabel: "03 / COMPLIANCE",
  complianceTitle: "Where Vexim started.",
  complianceLine: "Four services, run by the same team for twenty years.",
  complianceLinks: [
    { name: "FDA", note: "Facility registration, labels, US Agent", href: "/services/fda" },
    { name: "GACC", note: "Export code into China", href: "/services/gacc" },
    { name: "MoCRA", note: "Cosmetics into the US", href: "/services/cosmetics/mocra-registration" },
    { name: "US Agent", note: "Legal representative in the US", href: "/services/us-agent" },
  ],

  ctaTitle: "Your goods are fine.",
  ctaAccent: "The route to the buyer is not.",
  ctaLine: "Tell us what you sell and where you want to go.",
  ctaButton: "Talk to us",

  marquee: VI_HUB.marquee,
} as const

export const EN_HUB_META = {
  title: "Export sales channel for Vietnamese manufacturers | Vexim Global",
  description: "Four things Vexim does for Vietnamese manufacturers: the Vexim Trade B2B marketplace, buyer work by market, product websites, and export services.",
} as const
