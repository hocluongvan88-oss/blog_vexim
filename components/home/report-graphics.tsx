import { HOME_MESSAGES } from "@/lib/home-i18n"
import type { HomeLocale } from "@/lib/locale-routes"
import styles from "./home.module.css"

/** Small, static vector reports, not interactive controls or performance claims. */
export function HeroReport({ locale }: { locale: HomeLocale }) {
  const t = HOME_MESSAGES[locale].report
  return (
    <figure className={styles.heroStage} aria-label={`${t.title} · ${t.sample}`}>
      <svg viewBox="0 0 580 495" width="580" height="495" aria-hidden="true" focusable="false">
        <defs>
          <filter id="sheet-shadow" x="-25%" y="-30%" width="155%" height="180%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#061e15" floodOpacity=".22" />
          </filter>
          <linearGradient id="report-bar" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#65a58c" />
            <stop offset="1" stopColor="#0b523c" />
          </linearGradient>
        </defs>
        <g filter="url(#sheet-shadow)">
          <rect x="38" y="68" width="500" height="351" rx="21" fill="#fff" />
        </g>
        <g fill="#112b21">
          <text x="60" y="104" fontSize="16" fontWeight="700">
            {t.title}
          </text>
          <text x="60" y="122" fontSize="11.5" fill="#53675e">
            {t.period}
          </text>
          <rect x="407" y="88" width="110" height="28" rx="14" fill="#eff4ef" />
          <circle cx="423" cy="102" r="3.2" fill="#18744c" />
          <text x="435" y="105.5" fontSize="10.2" fontWeight="700" letterSpacing="1">
            OVERVIEW
          </text>
          {t.metrics.map((label, i) => (
            <g key={label} transform={`translate(${60 + 155 * i} 139)`}>
              <rect width="146" height="76" rx="11" fill="#f5f4ee" />
              <text x="12" y="26" fontSize="11.6">
                {label}
              </text>
              <path
                d={
                  [
                    "M15 58L30 54L43 56L59 47L72 48L85 40L102 37L126 32",
                    "M15 57L29 59L46 50L61 52L80 45L93 46L110 39L126 37",
                    "M15 60L34 55L50 55L68 49L84 46L101 38L114 36L126 32",
                  ][i]
                }
                fill="none"
                stroke={["#0e5140", "#cd8d0c", "#315b69"][i]}
                strokeWidth="2.4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
        <g stroke="#e9ebe4">
          {[250, 288, 326, 364].map((y) => (
            <path key={y} d={`M61 ${y}H516`} />
          ))}
        </g>
        {[37, 50, 58, 76, 89, 113].map((h, i) => (
          <g key={i}>
            <rect
              x={77 + i * 76}
              y={364 - h}
              width="30"
              height={h}
              rx="4.5"
              fill={i === 5 ? "url(#report-bar)" : "#dce9e2"}
            />
            <text x={92 + i * 76} y="379" textAnchor="middle" fontSize="10.6" fill="#596c61">
              {t.month}
              {i + 1}
            </text>
          </g>
        ))}
        <path
          d="M92 318C128 314 142 304 168 303S215 303 244 292S293 279 320 272S367 262 396 255S442 242 472 230"
          fill="none"
          stroke="#cd8a0a"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <circle cx="472" cy="230" r="5" fill="white" stroke="#cd8a0a" strokeWidth="2.8" />
        <circle cx="65" cy="400" r="3" fill="#9eae9e" />
        <text x="75" y="404" fontSize="10.8" fill="#445b4e">
          {t.sample}
        </text>
        <g filter="url(#sheet-shadow)">
          <rect x="9" y="19" width="273" height="62" rx="14" fill="#fff" />
        </g>
        <rect x="22" y="30" width="40" height="40" rx="11" fill="#fff1ce" />
        <text x="42" y="54" textAnchor="middle" fill="#81520b" fontSize="11.6" fontWeight="700">
          RFQ
        </text>
        <text x="74" y="46" fontSize="13.2" fontWeight="700" fill="#142e22">
          {t.notice}
        </text>
        <text x="74" y="64" fontSize="11.9" fill="#596b60">
          {t.detail}
        </text>
        <g filter="url(#sheet-shadow)">
          <rect x="330" y="385" width="232" height="79" rx="15" fill="#10271e" stroke="#325042" />
        </g>
        <circle cx="348" cy="407" r="3" fill="#e8ad42" />
        <text x="359" y="411" fill="#dbe7de" fontSize="11">
          {t.channels}
        </text>
        <text x="345" y="441" fill="#ffbf4a" fontSize="20" fontWeight="700">
          Google + B2B
        </text>
        <text x="546" y="411" textAnchor="end" fill="#e4e9e0" fontSize="10.5">
          {t.market}
        </text>
        <rect x="18" y="444" width="276" height="40" rx="20" fill="#f4b53e" />
        <circle cx="40" cy="464" r="12" fill="#0d3f2e" />
        <path d="M36 468l8-8m-7 0h7v7" fill="none" stroke="#ffce6a" strokeWidth="1.6" />
        <text x="61" y="468.5" fill="#172c20" fontWeight="700" fontSize="12">
          {t.ribbon}
        </text>
      </svg>
    </figure>
  )
}

export function MiniChart() {
  return (
    <svg viewBox="0 0 260 72" width="260" height="72" className={styles.miniChart} aria-hidden="true">
      {[16, 21, 29, 40, 52, 63].map((h, i) => (
        <rect key={i} x={5 + i * 41} y={71 - h} width="29" height={h} rx="4" fill={i === 5 ? "#10583e" : "#e2ebe4"} />
      ))}
      <path d="M17 52Q68 46 98 39T170 23L223 4" stroke="#cd9018" strokeWidth="2" fill="none" />
      <circle cx="223" cy="4" r="3.5" fill="#cd9018" />
    </svg>
  )
}

export function MarketReport({ locale }: { locale: HomeLocale }) {
  const { seo, report } = HOME_MESSAGES[locale]
  const lines = [
    "M8 196C80 187 133 177 193 164S287 143 337 120S407 94 467 70S541 48 592 29",
    "M8 201Q99 197 181 183T328 151T461 116T592 78",
    "M8 204Q100 203 188 195T334 176T469 151T592 126",
  ]
  const colors = ["#10513e", "#d29319", "#739b8a"]
  return (
    <figure className={styles.marketReport} aria-label={`${seo.chart} · ${report.sample}`}>
      <div className={styles.linePanel}>
        <h3>{seo.chart}</h3>
        <ul className={styles.legend}>
          {seo.markets.map((m, i) => (
            <li key={m}>
              <i style={{ background: colors[i] }} />
              {m}
            </li>
          ))}
        </ul>
        <svg viewBox="0 0 606 234" width="606" height="234" aria-hidden="true">
          {[38, 80, 122, 164, 206].map((y) => (
            <path key={y} d={`M8 ${y}H594`} stroke="#e3e7df" />
          ))}
          <path d={`${lines[0]}V206H8Z`} fill="#e8f0eb" fillOpacity=".85" />
          {lines.map((d, i) => (
            <path key={d} d={d} fill="none" stroke={colors[i]} strokeWidth="3" strokeLinecap="round" />
          ))}
          <circle cx="592" cy="29" r="4.5" fill="white" stroke={colors[0]} strokeWidth="3" />
          {[1, 3, 5, 7, 9, 11].map((m, i) => (
            <text key={m} x={8 + i * 110} y="230" fill="#4f6457" fontSize="11">
              {report.month}
              {m}
            </text>
          ))}
        </svg>
        <span className={styles.dataTag}>{report.sample}</span>
      </div>
      <div className={styles.sourcePanel}>
        <h3>{seo.sources}</h3>
        <div className={styles.sources}>
          <span className={styles.donut} aria-hidden="true">
            RFQ
          </span>
          <ul>
            {seo.channels.map((c, i) => (
              <li key={c}>
                <i style={{ background: ["#10513e", "#d29319", "#36586b", "#85aa98"][i] }} />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <p>{seo.measure}</p>
        <div className={styles.measureList}>
          {seo.measures.map((m, i) => (
            <span key={m}>
              <b>0{i + 1}</b>
              {m}
            </span>
          ))}
        </div>
      </div>
    </figure>
  )
}
