// Inline critical CSS. All presentation colors are declared as design tokens on :root.
export const TRADE_CSS = String.raw`
:root {
  --ink: #14231b;
  --text-2: #3d4c43;
  --text-3: #4a5a50;
  --primary: #1e5a3a;
  --primary-hover: #123826;
  --eyebrow: #8a4510;
  --eyebrow-dark: #e9b88a;
  --bg: #ffffff;
  --bg-soft: #f2f5f0;
  --line: #dde3da;
  --nut: #d5ab72;
  --nut-light: #f5e5cb;
  --nut-dark: #9b6a36;
  --pepper: #44483b;
  --spice: #a5633e;
  --spice-light: #e8c7a1;
  --shadow: 0 18px 65px rgb(20 35 27 / 0.07);
  color-scheme: light;
}
@font-face {
  font-family: Trade Fallback;
  src: local(Arial);
  size-adjust: 99%;
  ascent-override: 110%;
  descent-override: 28%;
  line-gap-override: 0%;
}
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
  color: var(--ink);
  background: var(--bg);
  font-family:
    Be Vietnam Pro,
    Trade Fallback,
    sans-serif;
  font-size: clamp(16px, 1.67vw, 17px);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
h1,
h2,
h3,
p,
figure {
  margin: 0;
}
a {
  color: inherit;
  text-underline-offset: 4px;
}
a,
button,
summary {
  -webkit-tap-highlight-color: transparent;
}
a:focus-visible,
button:focus-visible,
summary:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}
.dark a:focus-visible,
.closing a:focus-visible {
  outline-color: var(--bg);
}
svg {
  display: block;
  flex-shrink: 0;
}
img {
  max-width: 100%;
}
.wrap {
  width: min(1200px, calc(100% - 48px));
  margin-inline: auto;
}
section {
  padding-block: 96px;
  scroll-margin-top: 88px;
}
.soft {
  background: var(--bg-soft);
}
.eyebrow {
  color: var(--eyebrow);
  font-size: clamp(13px, 1.37vw, 14px);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 10px;
}
.eyebrow:before {
  content: "";
  width: 24px;
  height: 1px;
  background: currentColor;
}
.section-head {
  max-width: 780px;
  margin-bottom: 44px;
}
h1 {
  font-size: clamp(34px, 5.1vw, 52px);
  line-height: 1.12;
  letter-spacing: -0.045em;
  font-weight: 700;
  text-wrap: pretty;
}
h2 {
  font-size: clamp(28px, 3.52vw, 36px);
  line-height: 1.2;
  letter-spacing: -0.035em;
  font-weight: 700;
  text-wrap: pretty;
}
h3 {
  font-size: clamp(18px, 2.05vw, 21px);
  line-height: 1.4;
  letter-spacing: -0.02em;
  font-weight: 600;
}
.section-head h2 {
  margin-top: 16px;
}
.section-head > p:last-child:not(.eyebrow) {
  margin-top: 20px;
  color: var(--text-2);
}
.small {
  font-size: 14px;
  color: var(--text-3);
}
.button {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 13px 22px;
  border: 1px solid var(--primary);
  border-radius: 8px;
  color: var(--bg);
  background: var(--primary);
  font-size: 14px;
  line-height: 1.5;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition:
    background 0.16s,
    border-color 0.16s;
}
.button:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}
.button.outline {
  background: transparent;
  color: var(--primary);
  border-color: var(--line);
}
.button.outline:hover {
  border-color: var(--primary);
  background: var(--bg);
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.skip {
  position: fixed;
  left: 16px;
  top: 12px;
  z-index: 100;
  transform: translateY(-200%);
  background: var(--bg);
  color: var(--primary);
  padding: 12px 18px;
  border-radius: 8px;
}
.skip:focus {
  transform: translateY(0);
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 72px;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
}
.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.04em;
  line-height: 1.2;
  min-height: 44px;
}
.brand svg {
  width: 34px;
  height: 34px;
  color: var(--primary);
}
.brand .trade-word {
  font-weight: 500;
}
.desktop-nav {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-left: auto;
}
.desktop-nav a {
  text-decoration: none;
  font-size: 14px;
  color: var(--text-2);
  padding-block: 14px;
  font-weight: 500;
}
.desktop-nav a:hover {
  color: var(--primary);
  text-decoration: underline;
}
.mobile-menu {
  display: none;
}
.header-register {
  white-space: nowrap;
  font-size: 13px;
  padding: 12px 17px;
}
.menu-icon {
  width: 22px;
  height: 22px;
}
.hero {
  padding-block: 76px 68px;
  border-bottom: 1px solid var(--line);
  position: relative;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 70px;
  align-items: center;
}
.hero-copy .eyebrow {
  margin-bottom: 24px;
  max-width: 470px;
}
.hero h1 span {
  color: var(--primary);
}
.hero-description {
  color: var(--text-2);
  font-size: clamp(17px, 1.86vw, 19px);
  line-height: 1.65;
  margin-top: 26px;
  max-width: 600px;
}
.hero-copy-line {
  display: block;
}
.hero .actions {
  margin-top: 32px;
}
.hero-note {
  margin-top: 22px;
  max-width: 500px;
  color: var(--text-3);
  font-size: 13px;
  line-height: 1.7;
  display: flex;
  align-items: flex-start;
  gap: 9px;
}
.hero-note svg {
  margin-top: 3px;
  color: var(--primary);
}
.hero-aside {
  position: relative;
  padding: 16px 12px 16px 16px;
}
.profile {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
  position: relative;
}
.profile-top {
  padding: 18px 22px;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.profile-top .brand {
  font-size: 15px;
  min-height: 0;
  gap: 7px;
}
.profile-top .brand svg {
  width: 22px;
  height: 22px;
}
.sample-pill {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--text-3);
  border: 1px solid var(--line);
  padding: 4px 8px;
  border-radius: 20px;
  font-weight: 600;
  white-space: nowrap;
}
.product-art {
  height: 172px;
  background: var(--bg-soft);
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
}
.product-art > svg {
  width: 100%;
  height: 100%;
}
.product-art .product-label {
  position: absolute;
  top: 17px;
  left: 22px;
  font-size: 10px;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--text-3);
}
.profile-body {
  padding: 22px;
}
.profile-body .origin {
  font-size: 11px;
  color: var(--text-3);
  display: flex;
  align-items: center;
  gap: 5px;
}
.profile-body .profile-title {
  font-size: 20px;
  font-weight: 600;
  margin-top: 8px;
}
.profile-body .company {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 6px;
}
.specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 20px 0;
  border-block: 1px solid var(--line);
}
.specs div {
  padding: 12px 0;
}
.specs div + div {
  padding-left: 16px;
  border-left: 1px solid var(--line);
}
.specs dt {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-3);
}
.specs dd {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 600;
}
.sample-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--primary);
}
.illustrated-rfq {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 12px;
  background: var(--primary);
  color: var(--bg);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}
.hero-aside figcaption {
  font-size: 11px;
  color: var(--text-3);
  margin-top: 14px;
  text-align: center;
}
.hero-aside:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 70%;
  height: 64%;
  border: 1px solid var(--line);
  border-radius: 20px;
}
.hero-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-top: 50px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
  color: var(--text-3);
  font-size: 12px;
}
.hero-bottom span {
  display: flex;
  gap: 8px;
  align-items: center;
}
.hero-bottom svg {
  color: var(--primary);
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}
.problem {
  padding: 28px 0 0;
  border-top: 1px solid var(--line);
}
.problem .index {
  font-size: 12px;
  font-weight: 600;
  color: var(--eyebrow);
  display: block;
  margin-bottom: 22px;
}
.problem p {
  color: var(--text-2);
  font-size: 16px;
  margin-top: 14px;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}
.feature {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 26px 24px;
}
.feature .icon-box {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--bg-soft);
  color: var(--primary);
  margin-bottom: 28px;
}
.feature h3 {
  font-size: 19px;
}
.feature p {
  margin-top: 13px;
  font-size: clamp(16px, 1.67vw, 17px);
  color: var(--text-2);
  line-height: 1.75;
}
.feature-note {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: var(--text-3);
  margin-top: 28px;
  font-size: 14px;
}
.feature-note svg {
  color: var(--primary);
  margin-top: 2px;
}
.verification-layout {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 90px;
  align-items: start;
}
.verification-layout .section-head {
  margin-bottom: 0;
}
.verification-layout .disclaimer {
  border-left: 3px solid var(--primary);
  padding-left: 18px;
  color: var(--primary);
  font-size: 16px;
  font-weight: 500;
  margin-top: 28px;
}
.verification-list {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: verification;
}
.verification-list li {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 20px;
  padding: 24px 0;
  border-top: 1px solid var(--line);
  counter-increment: verification;
}
.verification-list li:before {
  content: "0" counter(verification);
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  width: 40px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 50%;
  display: grid;
  place-items: center;
}
.verification-list li:first-child {
  padding-top: 0;
  border-top: 0;
}
.verification-list p {
  font-size: clamp(16px, 1.67vw, 17px);
  color: var(--text-2);
  margin-top: 10px;
}
.dark {
  background: var(--ink);
  color: var(--bg);
}
.dark .eyebrow {
  color: var(--eyebrow-dark);
}
.commitment-layout {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 90px;
}
.commitment-layout .section-head {
  margin: 0;
}
.dark .section-head > p:last-child {
  color: var(--bg-soft);
}
.commitment-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--eyebrow-dark);
  margin-bottom: 24px;
}
.commitments {
  list-style: none;
  padding: 0;
  margin: 0;
}
.commitments li {
  display: flex;
  gap: 16px;
  padding: 24px 0;
  border-top: 1px solid var(--text-3);
}
.commitments svg {
  color: var(--eyebrow-dark);
  margin-top: 3px;
}
.commitments h3 {
  font-size: 19px;
}
.commitments p {
  font-size: clamp(16px, 1.67vw, 17px);
  margin-top: 10px;
  color: var(--bg-soft);
}
.category {
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg);
}
.category-art {
  height: 174px;
  background: var(--bg-soft);
  display: grid;
  place-items: center;
  border-bottom: 1px solid var(--line);
}
.category-art svg {
  width: 100%;
  height: 100%;
}
.category-body {
  padding: 26px;
}
.category .category-kicker {
  display: block;
  font-size: 11px;
  color: var(--eyebrow);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 10px;
}
.category h3 {
  font-size: 22px;
}
.category p.description {
  font-size: clamp(16px, 1.67vw, 17px);
  color: var(--text-2);
  margin-top: 14px;
  line-height: 1.75;
}
.category-specs {
  border-top: 1px solid var(--line);
  padding-top: 16px;
  margin-top: 22px;
  font-size: 12px;
  color: var(--text-3);
}
.category-footnote {
  font-size: 14px;
  color: var(--text-3);
  margin-top: 24px;
  max-width: 800px;
}
.steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 28px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.steps li {
  border-top: 1px solid var(--line);
  padding-top: 22px;
}
.steps .step-number {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  display: block;
  margin-bottom: 20px;
}
.steps h3 {
  font-size: 19px;
}
.steps p {
  font-size: clamp(16px, 1.67vw, 17px);
  color: var(--text-2);
  margin-top: 12px;
}
.closing {
  margin-top: 60px;
  padding: 46px 48px;
  background: var(--primary);
  border-radius: 16px;
  color: var(--bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}
.closing-title {
  font-size: clamp(24px, 2.2vw, 30px);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.025em;
  max-width: 580px;
}
.closing p.small {
  color: var(--bg-soft);
  margin-top: 12px;
}
.closing .button {
  flex-shrink: 0;
  background: var(--bg);
  border-color: var(--bg);
  color: var(--primary);
}
.closing .button:hover {
  background: var(--bg-soft);
  border-color: var(--bg-soft);
}
.site-footer {
  padding: 48px 0 24px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.2fr 0.8fr;
  gap: 40px;
}
.footer-brand-note {
  color: var(--text-3);
  font-size: 13px;
  max-width: 260px;
  margin-top: 16px;
}
.site-footer address {
  font-style: normal;
  font-size: 13px;
  line-height: 1.9;
  color: var(--text-2);
}
.site-footer address strong {
  display: block;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 6px;
}
.footer-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 13px;
  gap: 3px;
}
.footer-links a,
.footer-links span {
  min-height: 44px;
  display: flex;
  align-items: center;
}
.footer-links span {
  color: var(--text-3);
}
.footer-bottom {
  border-top: 1px solid var(--line);
  margin-top: 36px;
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: var(--text-3);
}
.site-footer address a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.category h3 a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.menu-summary {
  cursor: pointer;
  list-style: none;
  min-height: 44px;
  min-width: 44px;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  border: 1px solid var(--line);
  border-radius: 8px;
}
.menu-summary::-webkit-details-marker {
  display: none;
}
@media (min-width: 640px) and (max-width: 1023px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .hero-copy {
    max-width: 740px;
  }
  .hero-aside {
    max-width: 520px;
    width: 100%;
    justify-self: center;
  }
  .hero h1 {
    max-width: 750px;
  }
  .grid-3,
  .feature-grid,
  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .verification-layout,
  .commitment-layout {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
  .footer-links {
    grid-column: 2;
  }
  .desktop-nav {
    gap: 14px;
  }
  .desktop-nav a {
    font-size: 12px;
  }
  .header-inner {
    gap: 16px;
  }
  .brand {
    font-size: 17px;
  }
  .header-register {
    font-size: 12px;
    padding-inline: 12px;
  }
}
@media (max-width: 1023px) {
  .desktop-nav {
    display: none;
  }
  .mobile-menu {
    display: block;
    order: 3;
  }
  .menu-summary {
    display: flex;
  }
  .header-inner {
    gap: 12px;
  }
  .header-register {
    margin-left: auto;
  }
  .mobile-menu nav {
    position: absolute;
    top: 71px;
    left: 0;
    right: 0;
    display: grid;
    padding: 16px 24px;
    background: var(--bg);
    border-bottom: 1px solid var(--line);
    box-shadow: var(--shadow);
  }
  .mobile-menu nav a {
    display: flex;
    align-items: center;
    min-height: 48px;
    text-decoration: none;
    font-size: 15px;
    color: var(--text-2);
  }
  .mobile-menu[open] .menu-summary {
    background: var(--bg-soft);
  }
}
@media (max-width: 639px) {
  section {
    padding-block: 64px;
  }
  .site-header {
    height: 68px;
  }
  .hero {
    padding-block: 48px 32px;
  }
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .hero-copy .eyebrow {
    font-size: 13px;
    letter-spacing: 0.05em;
    margin-bottom: 20px;
  }
  .hero-copy .eyebrow:before {
    width: 16px;
  }
  .hero-description {
    margin-top: 24px;
  }
  .hero .actions {
    display: grid;
    grid-template-columns: 1fr;
    margin-top: 28px;
  }
  .button {
    padding: 13px 18px;
    font-size: 14px;
  }
  .hero-note {
    font-size: 12px;
    margin-top: 18px;
  }
  .hero-aside {
    padding: 8px 0 0;
    width: 100%;
    max-width: 450px;
    justify-self: center;
  }
  .hero-aside:before {
    display: none;
  }
  .hero-bottom {
    display: grid;
    gap: 12px;
    margin-top: 28px;
    padding-top: 20px;
    font-size: 11px;
  }
  .hero-bottom span {
    gap: 8px;
  }
  .product-art {
    height: 150px;
  }
  .profile-top {
    padding: 14px 18px;
  }
  .profile-body {
    padding: 18px;
  }
  .sample-pill {
    font-size: 8px;
  }
  .profile-top .brand {
    font-size: 13px;
  }
  .profile-top .brand svg {
    width: 19px;
    height: 19px;
  }
  .hero-aside figcaption {
    font-size: 10px;
  }
  .grid-3,
  .feature-grid,
  .steps,
  .verification-layout,
  .commitment-layout,
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .section-head {
    margin-bottom: 32px;
  }
  .problem {
    padding-top: 22px;
  }
  .problem .index {
    margin-bottom: 12px;
  }
  .problem p {
    font-size: 16px;
  }
  .grid-3 {
    gap: 28px;
  }
  .feature-grid {
    gap: 16px;
  }
  .feature {
    padding: 24px;
  }
  .feature .icon-box {
    margin-bottom: 20px;
  }
  .feature h3,
  .category h3,
  .commitments h3,
  .steps h3 {
    font-size: 18px;
  }
  .verification-layout {
    gap: 36px;
  }
  .verification-list li {
    gap: 14px;
    padding-block: 22px;
  }
  .verification-list h3 {
    font-size: 18px;
  }
  .verification-list p {
    font-size: 15px;
  }
  .commitment-layout {
    gap: 32px;
  }
  .commitments li {
    padding-block: 22px;
  }
  .category-art {
    height: 168px;
  }
  .category-body {
    padding: 24px;
  }
  .steps {
    gap: 26px;
  }
  .steps .step-number {
    margin-bottom: 12px;
  }
  .closing {
    margin-top: 40px;
    padding: 30px 24px;
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }
  .closing-title {
    font-size: 24px;
  }
  .closing .button {
    width: 100%;
  }
  .site-footer {
    padding-top: 36px;
  }
  .footer-grid {
    gap: 28px;
  }
  .footer-links {
    gap: 0;
  }
  .footer-bottom {
    margin-top: 24px;
  }
  .brand {
    font-size: 15px;
    gap: 7px;
  }
  .brand > span {
    display: flex;
    flex-direction: column;
  }
  .brand .trade-word {
    font-size: 14px;
    letter-spacing: 0.02em;
  }
  .brand svg {
    width: 29px;
    height: 29px;
  }
  .header-inner {
    gap: 9px;
  }
  .header-register {
    white-space: normal;
    width: 126px;
    font-size: 11px;
    min-height: 48px;
    padding: 7px 10px;
    gap: 4px;
  }
  .header-register svg {
    display: none;
  }
  .menu-summary {
    width: 44px;
  }
  .mobile-menu nav {
    top: 67px;
  }
}
@media (max-width: 359px) {
  .header-register {
    width: 116px;
  }
  .header-inner {
    gap: 7px;
  }
  .brand {
    font-size: 14px;
  }
  .brand svg {
    width: 25px;
    height: 25px;
  }
  .brand .trade-word {
    font-size: 13px;
  }
  .wrap {
    width: calc(100% - 48px);
  }
  .hero-copy .eyebrow {
    font-size: 13px;
  }
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *:before,
  *:after {
    transition: none !important;
    animation: none !important;
  }
}
`
