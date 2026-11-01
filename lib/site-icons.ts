import type { Metadata } from "next"

/** Stable homepage icon URLs: Google Search uses one favicon per hostname. */
export const SITE_ICONS: Metadata["icons"] = {
  icon: [{ url: "/favicon.png", type: "image/png", sizes: "96x96" }],
  apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
}
