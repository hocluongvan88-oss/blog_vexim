// Inter 4.1 (OFL-1.1), self-hosted Latin + Vietnamese, including NFD combining marks.
// One weight-variable file avoids mixed-subset glyphs. See public/trade/fonts/README.md.
export const TRADE_FONT_CSS = String.raw`
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url(/trade/fonts/inter-vietnamese-latin-variable.3642455776.woff2) format('woff2');
  unicode-range: U+0000-024F,U+0300-036F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2113,U+2122,U+2191-2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
`
export const TRADE_PRELOAD_FONT = "/trade/fonts/inter-vietnamese-latin-variable.3642455776.woff2"
export const TRADE_SCRIPT = "/trade/trade.8b63b4b2f7.js"

/** AI-created editorial product images, never supplier or verification evidence. */
export const TRADE_IMAGES = {
  cashew: {
    src: "/trade/images/cashew-800.9b689e010c.webp",
    width: 800,
    height: 534,
    srcset: "/trade/images/cashew-480.e9a953c30a.webp 480w, /trade/images/cashew-800.9b689e010c.webp 800w",
    alt: "Ảnh minh họa hạt điều nhân, không đại diện nhà cung cấp cụ thể",
  },
  pepper: {
    src: "/trade/images/pepper-800.12d3bdb750.webp",
    width: 800,
    height: 534,
    srcset: "/trade/images/pepper-480.36ee472d49.webp 480w, /trade/images/pepper-800.12d3bdb750.webp 800w",
    alt: "Ảnh minh họa hồ tiêu, không đại diện nhà cung cấp cụ thể",
  },
  spices: {
    src: "/trade/images/spices-800.99fd911ec5.webp",
    width: 800,
    height: 534,
    srcset: "/trade/images/spices-480.a99b30ff98.webp 480w, /trade/images/spices-800.99fd911ec5.webp 800w",
    alt: "Ảnh minh họa quế, hồi, không đại diện nhà cung cấp cụ thể",
  },
  hero: {
    src: "/trade/images/hero-1536.9717604852.webp",
    width: 1536,
    height: 1024,
    srcset: "/trade/images/hero-960.7121b0017d.webp 960w, /trade/images/hero-1536.9717604852.webp 1536w",
    alt: "Ảnh hạt điều minh họa trên nền studio sáng",
  },
  service: {
    src: "/trade/images/service-640.938ff2bede.webp",
    width: 640,
    height: 480,
  },
} as const

/** Original Vexim V symbol, cropped from public/logo.png without redrawing. */
export const TRADE_MARK = "/trade/images/vexim-mark-160.9c6b959ff0.webp"
