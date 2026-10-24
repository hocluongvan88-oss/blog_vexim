// Apple-inspired editorial layout. Local brand type, no proprietary fonts or UI assets.
export const TRADE_CSS = String.raw`
:root {
  --ink: #1d1d1f;
  --text-2: #515154;
  --text-3: #626268;
  --primary: #1e5a3a;
  --primary-hover: #123826;
  --eyebrow: #1e5a3a;
  --eyebrow-dark: #b7dcc4;
  --bg: #ffffff;
  --bg-soft: #f5f5f7;
  --line: #d2d2d7;
  --glass: rgb(255 255 255 / 0.88);
  --shadow: 0 20px 65px rgb(29 29 31 / 0.08);
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
  background: var(--bg);
  color: var(--ink);
  font-family:
    Be Vietnam Pro,
    Trade Fallback,
    sans-serif;
  font-size: clamp(16px, 1.67vw, 17px);
  line-height: 1.65;
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
  text-underline-offset: 5px;
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
  outline-offset: 4px;
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
  display: block;
  max-width: 100%;
  height: auto;
}
.wrap {
  width: min(1200px, calc(100% - 48px));
  margin-inline: auto;
}
section {
  padding-block: 112px;
  scroll-margin-top: 88px;
}
.soft {
  background: var(--bg-soft);
}
.eyebrow {
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--eyebrow);
  margin-bottom: 18px;
}
h1 {
  font-size: clamp(38px, 4.2vw, 60px);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.055em;
  text-wrap: balance;
}
h2 {
  font-size: clamp(32px, 3.65vw, 50px);
  font-weight: 700;
  line-height: 1.16;
  letter-spacing: -0.045em;
  text-wrap: balance;
}
h3 {
  font-size: clamp(19px, 1.6vw, 22px);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.025em;
}
.section-head {
  max-width: 800px;
  margin-bottom: 52px;
}
.section-head > p:last-child:not(.eyebrow) {
  margin-top: 22px;
  color: var(--text-2);
  font-size: 17px;
  max-width: 700px;
}
.small {
  font-size: 14px;
  color: var(--text-3);
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 50px;
  padding: 14px 25px;
  border: 1px solid var(--primary);
  border-radius: 999px;
  background: var(--primary);
  color: var(--bg);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  text-decoration: none;
  text-align: center;
  transition:
    background 0.2s,
    transform 0.2s;
}
.button:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}
.button.outline {
  background: transparent;
  border-color: transparent;
  color: var(--primary);
  padding-inline: 10px;
}
.button.outline:hover {
  text-decoration: underline;
}
.button.outline svg {
  width: 16px;
}
.actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 22px;
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
  border-radius: 12px;
}
.skip:focus {
  transform: translateY(0);
}
.site-header {
  height: 72px;
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--glass);
  backdrop-filter: saturate(160%) blur(24px);
  -webkit-backdrop-filter: saturate(160%) blur(24px);
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
  gap: 9px;
  min-height: 44px;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.04em;
  text-decoration: none;
}
.brand svg {
  color: var(--primary);
  width: 29px;
  height: 29px;
}
.brand .trade-word {
  font-weight: 500;
}
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-left: auto;
}
.desktop-nav a {
  font-size: 12px;
  color: var(--text-2);
  text-decoration: none;
  min-height: 44px;
  display: flex;
  align-items: center;
}
.desktop-nav a:hover {
  color: var(--primary);
}
.header-register {
  font-size: 12px;
  min-height: 48px;
  padding: 12px 20px;
  white-space: nowrap;
}
.header-register svg {
  width: 14px;
}
.mobile-menu {
  display: none;
}
.menu-summary {
  list-style: none;
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--primary);
}
.menu-summary::-webkit-details-marker {
  display: none;
}
.hero.soft {
  background: var(--bg);
  padding-block: 64px 44px;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
}
.hero-copy {
  text-align: center;
  max-width: 1200px;
  margin: auto;
}
.hero-copy .eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid var(--line);
  border-radius: 99px;
  padding: 7px 15px;
  font-size: 11px;
  margin-bottom: 24px;
}
.hero-copy .eyebrow:before {
  content: "";
  width: 5px;
  height: 5px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--primary);
}
.hero h1 {
  max-width: 1200px;
  margin-inline: auto;
}
.hero-intro-line,
.hero-accent {
  display: inline;
}
.hero-accent {
  color: var(--primary);
}
.hero-description {
  color: var(--text-2);
  font-size: clamp(17px, 1.5vw, 19px);
  line-height: 1.7;
  max-width: 820px;
  margin: 26px auto 0;
}
.hero-copy-line {
  display: block;
  text-wrap: balance;
}
.hero .actions {
  justify-content: center;
  margin-top: 28px;
}
.hero-note {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  max-width: 700px;
  margin: 20px auto 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-3);
}
.hero-note svg {
  margin-top: 2px;
  width: 14px;
  height: 14px;
  color: var(--primary);
}
.hero-aside {
  width: 100%;
  min-width: 0;
}
.hero-stage {
  height: 560px;
  position: relative;
  border-radius: 32px;
  isolation: isolate;
}
.stage-media {
  height: 100%;
  overflow: hidden;
  border-radius: 32px;
  background: var(--bg-soft);
}
.stage-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 48%;
}
.stage-caption {
  position: absolute;
  top: 36px;
  left: 42px;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.02em;
  color: var(--ink);
}
.profile {
  position: absolute;
  right: 42px;
  top: 50%;
  transform: translateY(-50%);
  width: 320px;
  background: var(--glass);
  border: 1px solid var(--bg);
  border-radius: 22px;
  box-shadow: 0 24px 70px rgb(29 29 31 / 0.14);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  overflow: hidden;
}
.profile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 17px 18px;
  background: var(--bg);
}
.profile-top .brand {
  font-size: 12px;
  gap: 5px;
  min-height: 0;
}
.profile-top .brand svg {
  width: 19px;
  height: 19px;
}
.sample-pill {
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-3);
  border: 1px solid var(--line);
  border-radius: 99px;
  padding: 4px 7px;
  white-space: nowrap;
}
.product-art {
  height: 120px;
  overflow: hidden;
  position: relative;
  background: var(--bg-soft);
}
.product-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 35% 53%;
}
.product-label {
  position: absolute;
  left: 18px;
  top: 12px;
  z-index: 1;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--ink);
}
.profile-body {
  padding: 19px;
}
.origin {
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 10px;
  color: var(--text-3);
}
.profile-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.025em;
  margin-top: 7px;
}
.company {
  font-size: 10px;
  color: var(--text-3);
  margin-top: 4px;
}
.specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-block: 1px solid var(--line);
  margin: 16px 0;
}
.specs div {
  padding: 10px 0;
}
.specs div + div {
  padding-left: 14px;
  border-left: 1px solid var(--line);
}
.specs dt {
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-3);
}
.specs dd {
  margin: 3px 0 0;
  font-size: 11px;
  font-weight: 600;
}
.sample-check {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  color: var(--primary);
}
.illustrated-rfq {
  margin-top: 14px;
  padding: 10px 12px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 500;
  background: var(--primary);
  color: var(--bg);
  border-radius: 99px;
}
.hero-aside figcaption {
  text-align: center;
  margin-top: 19px;
  font-size: 11px;
  color: var(--text-3);
}
.image-disclosure {
  font-size: 10px;
  color: var(--text-3);
  text-align: center;
  margin-top: 4px;
}
.hero-bottom {
  display: flex;
  justify-content: center;
  gap: 48px;
  align-items: center;
  margin-top: 36px;
  font-size: 12px;
  color: var(--text-3);
}
.hero-bottom span {
  display: flex;
  align-items: center;
  gap: 8px;
}
.hero-bottom svg {
  color: var(--primary);
}
section[aria-labelledby="van-de-title"] {
  background: var(--bg-soft);
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}
.problem {
  border-top: 1px solid var(--line);
  padding-top: 24px;
}
.problem .index {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
  margin-bottom: 30px;
}
.problem h3 {
  max-width: 290px;
}
.problem p {
  font-size: 16px;
  line-height: 1.75;
  color: var(--text-2);
  margin-top: 16px;
  max-width: 340px;
}
#cach-hoat-dong {
  background: var(--bg);
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}
.feature {
  border-radius: 24px;
  background: var(--bg-soft);
  padding: 32px 25px;
  transition: transform 0.2s;
}
.feature:hover {
  transform: translateY(-4px);
}
.icon-box {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  color: var(--primary);
  margin-bottom: 46px;
}
.icon-box svg {
  width: 30px;
  height: 30px;
  stroke-width: 1.3;
}
.feature h3 {
  font-size: 20px;
}
.feature p {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-2);
  margin-top: 14px;
}
.feature-note {
  font-size: 13px;
  color: var(--text-3);
  margin-top: 28px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 900px;
}
.feature-note svg {
  color: var(--primary);
  margin-top: 2px;
}
#xac-minh {
  padding-top: 20px;
}
.verification-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 96px;
  background: var(--bg-soft);
  border-radius: 32px;
  padding: 56px;
}
.verification-layout .section-head {
  margin: 0;
}
.verification-layout .section-head h2 {
  font-size: 44px;
}
.verification-layout .section-head > p:last-child:not(.eyebrow) {
  font-size: 15px;
}
.verification-layout .disclaimer {
  margin-top: 28px;
  padding: 20px 0 0;
  border-top: 1px solid var(--line);
  font-weight: 500;
}
.verification-list {
  list-style: none;
  margin: 0;
  padding: 0;
  counter-reset: verification;
}
.verification-list li {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 18px;
  counter-increment: verification;
  padding: 25px 0;
  border-top: 1px solid var(--line);
}
.verification-list li:first-child {
  padding-top: 0;
  border-top: 0;
}
.verification-list li:last-child {
  padding-bottom: 0;
}
.verification-list li:before {
  content: "0" counter(verification);
  color: var(--primary);
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 1.3;
}
.verification-list h3 {
  font-size: 19px;
}
.verification-list p {
  font-size: 15px;
  color: var(--text-2);
  line-height: 1.8;
  margin-top: 10px;
}
.dark {
  background: var(--ink);
  color: var(--bg);
  position: relative;
  overflow: hidden;
}
.dark .eyebrow {
  color: var(--eyebrow-dark);
}
.commitment-layout {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 110px;
  align-items: start;
}
.commitment-layout .section-head {
  margin: 0;
}
.commitment-layout h2 {
  font-size: clamp(36px, 4.2vw, 58px);
  max-width: 520px;
}
.dark .section-head > p:last-child {
  color: var(--bg-soft);
  font-size: 17px;
  max-width: 500px;
}
.commitment-title {
  font-size: 12px;
  letter-spacing: 0.025em;
  color: var(--eyebrow-dark);
  margin-bottom: 28px;
}
.commitments {
  margin: 0;
  padding: 0;
  list-style: none;
}
.commitments li {
  padding: 25px 0;
  border-top: 1px solid var(--text-3);
  display: flex;
  gap: 15px;
}
.commitments svg {
  margin-top: 4px;
  color: var(--eyebrow-dark);
}
.commitments h3 {
  font-size: 21px;
}
.commitments p {
  font-size: 15px;
  line-height: 1.8;
  color: var(--bg-soft);
  margin-top: 13px;
}
#danh-muc .section-head {
  max-width: 820px;
}
.category {
  border-radius: 24px;
  background: var(--bg-soft);
  overflow: hidden;
  transition: transform 0.2s;
}
.category:hover {
  transform: translateY(-4px);
}
.category-art {
  aspect-ratio: 3/2;
  overflow: hidden;
  background: var(--bg-soft);
}
.category-art img,
.category-art svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.category-art img {
  transition: transform 0.45s;
}
.category:hover img {
  transform: scale(1.035);
}
.category-body {
  padding: 28px;
}
.category h3 {
  font-size: 27px;
  line-height: 1.35;
}
.category-kicker {
  display: block;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.5;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--primary);
  margin-bottom: 9px;
}
.category p.description {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-2);
  margin-top: 14px;
}
.category-specs {
  font-size: 11px;
  color: var(--text-3);
  border-top: 1px solid var(--line);
  padding-top: 17px;
  margin-top: 24px;
}
.category-footnote {
  font-size: 13px;
  color: var(--text-3);
  max-width: 850px;
  margin-top: 28px;
}
.category h3 a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.steps li {
  border-top: 1px solid var(--line);
  padding-top: 24px;
}
.step-number {
  display: block;
  font-size: 40px;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.06em;
  color: var(--primary);
  margin-bottom: 22px;
}
.steps h3 {
  font-size: 20px;
}
.steps p {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-2);
  margin-top: 12px;
}
.closing {
  margin-top: 70px;
  padding: 64px 48px;
  border-radius: 32px;
  background: var(--primary);
  color: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 28px;
}
.closing-title {
  font-size: clamp(30px, 3.3vw, 46px);
  font-weight: 600;
  line-height: 1.18;
  letter-spacing: -0.04em;
  max-width: 760px;
}
.closing .small {
  margin-top: 20px;
  font-size: 16px;
  color: var(--bg-soft);
}
.closing .button {
  background: var(--bg);
  border-color: var(--bg);
  color: var(--primary);
  padding-inline: 28px;
}
.closing .button:hover {
  background: var(--bg-soft);
}
.site-footer {
  padding: 48px 0 22px;
  background: var(--bg);
}
.footer-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.25fr 0.8fr;
  gap: 48px;
}
.footer-brand-note {
  color: var(--text-3);
  font-size: 12px;
  max-width: 240px;
  line-height: 1.8;
  margin-top: 16px;
}
.site-footer address {
  font-size: 12px;
  font-style: normal;
  color: var(--text-2);
  line-height: 1.9;
}
.site-footer address strong {
  display: block;
  color: var(--ink);
  font-weight: 600;
  margin-bottom: 5px;
}
.site-footer address a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.footer-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 12px;
  gap: 0;
}
.footer-links a,
.footer-links span {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-links span {
  color: var(--text-3);
}
.footer-bottom {
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 35px;
  padding-top: 18px;
  font-size: 10px;
  color: var(--text-3);
}
@media (min-width: 640px) and (max-width: 1023px) {
  .grid-3,
  .feature-grid,
  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .hero h1 {
    font-size: 54px;
    max-width: 900px;
  }
  .hero-copy {
    max-width: 860px;
  }
  .hero-description {
    max-width: 700px;
    font-size: 18px;
  }
  .hero-grid {
    gap: 40px;
  }
  .hero-stage {
    height: 470px;
  }
  .profile {
    width: 290px;
    right: 24px;
  }
  .stage-caption {
    top: 26px;
    left: 28px;
    font-size: 15px;
  }
  .hero-bottom {
    gap: 20px;
    font-size: 11px;
  }
  .verification-layout {
    gap: 36px;
    padding: 36px;
  }
  .verification-layout .section-head h2 {
    font-size: 34px;
  }
  .commitment-layout {
    gap: 44px;
  }
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
  .footer-links {
    grid-column: 2;
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
  .header-register {
    margin-left: auto;
  }
  .header-inner {
    gap: 12px;
  }
  .mobile-menu nav {
    position: absolute;
    top: 71px;
    left: 0;
    right: 0;
    padding: 16px 24px;
    display: grid;
    background: var(--bg);
    box-shadow: var(--shadow);
    border-bottom: 1px solid var(--line);
  }
  .mobile-menu nav a {
    display: flex;
    align-items: center;
    min-height: 48px;
    font-size: 15px;
    text-decoration: none;
    color: var(--text-2);
  }
  .mobile-menu[open] summary {
    background: var(--bg-soft);
  }
}
@media (max-width: 639px) {
  section {
    padding-block: 68px;
  }
  .site-header {
    height: 68px;
  }
  .header-inner {
    gap: 9px;
  }
  .site-header .header-register {
    width: 126px;
    white-space: normal;
    font-size: 11px;
    min-height: 48px;
    height: 48px;
    padding: 7px 10px;
  }
  .header-register svg {
    display: none;
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
    letter-spacing: 0;
  }
  .brand svg {
    width: 28px;
    height: 28px;
  }
  .mobile-menu nav {
    top: 67px;
  }
  .hero.soft {
    padding-block: 42px 32px;
  }
  .hero-grid {
    gap: 34px;
  }
  .hero-copy .eyebrow {
    font-size: 9px;
    letter-spacing: 0.035em;
    padding: 7px 10px;
    margin-bottom: 23px;
    max-width: 100%;
  }
  .hero h1 {
    font-size: 34px;
    line-height: 1.15;
    letter-spacing: -0.045em;
  }
  .hero-description {
    font-size: 16px;
    line-height: 1.75;
    margin-top: 24px;
  }
  .hero .actions {
    margin-top: 25px;
    gap: 8px;
    flex-direction: column;
  }
  .button {
    font-size: 14px;
    min-height: 50px;
    padding: 14px 23px;
  }
  .hero .button.outline {
    min-height: 44px;
  }
  .hero-note {
    font-size: 11px;
    margin-top: 15px;
    gap: 7px;
  }
  .hero-note svg {
    width: 13px;
    height: 13px;
    margin-top: 3px;
  }
  .hero-stage {
    height: auto;
    border-radius: 24px;
    background: var(--bg-soft);
    padding-bottom: 22px;
  }
  .stage-media {
    height: 240px;
    border-radius: 24px 24px 0 0;
  }
  .stage-photo {
    object-position: 26% 53%;
  }
  .stage-caption {
    top: 18px;
    left: 20px;
    font-size: 11px;
  }
  .profile {
    position: relative;
    top: auto;
    right: auto;
    transform: none;
    width: calc(100% - 32px);
    max-width: 340px;
    margin: -24px auto 0;
    border-radius: 20px;
    box-shadow: 0 12px 35px rgb(29 29 31 / 0.08);
  }
  .profile-top .brand {
    display: flex;
    flex-direction: row;
    font-size: 12px;
  }
  .profile-top .brand > span {
    display: inline;
  }
  .profile-top {
    padding: 15px 16px;
  }
  .sample-pill {
    font-size: 6px;
  }
  .product-art {
    height: 110px;
  }
  .profile-body {
    padding: 17px;
  }
  .hero-aside figcaption {
    font-size: 10px;
    margin-top: 15px;
  }
  .image-disclosure {
    font-size: 9px;
    max-width: 320px;
    margin-inline: auto;
  }
  .hero-bottom {
    display: grid;
    justify-content: center;
    gap: 12px;
    font-size: 11px;
    margin-top: 26px;
  }
  .hero-bottom span {
    justify-content: center;
  }
  .section-head {
    margin-bottom: 32px;
  }
  .eyebrow {
    font-size: 10px;
    margin-bottom: 15px;
  }
  h2 {
    font-size: 32px;
    line-height: 1.2;
  }
  .section-head > p:last-child:not(.eyebrow) {
    font-size: 16px;
  }
  .grid-3,
  .feature-grid,
  .steps,
  .verification-layout,
  .commitment-layout,
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .grid-3 {
    gap: 20px;
  }
  .problem .index {
    margin-bottom: 16px;
  }
  .problem {
    padding-top: 22px;
  }
  .problem h3 {
    max-width: none;
    font-size: 21px;
  }
  .problem p {
    font-size: 16px;
    max-width: none;
  }
  .feature-grid {
    gap: 14px;
  }
  .feature {
    padding: 28px;
    border-radius: 22px;
  }
  .feature .icon-box {
    margin-bottom: 26px;
  }
  .feature h3 {
    font-size: 21px;
  }
  .feature p {
    font-size: 16px;
  }
  .feature-note {
    font-size: 12px;
    margin-top: 22px;
  }
  #xac-minh {
    padding-top: 8px;
  }
  .verification-layout {
    padding: 28px 24px;
    gap: 30px;
    border-radius: 24px;
  }
  .verification-layout .section-head h2 {
    font-size: 30px;
  }
  .verification-layout .section-head > p:not(.eyebrow) {
    font-size: 15px;
  }
  .verification-list li {
    grid-template-columns: 30px 1fr;
    gap: 12px;
    padding-block: 22px;
  }
  .verification-list li:before {
    font-size: 20px;
  }
  .verification-list h3 {
    font-size: 18px;
  }
  .verification-list p {
    font-size: 15px;
  }
  .commitment-layout {
    gap: 35px;
  }
  .commitment-layout h2 {
    font-size: 36px;
    max-width: 400px;
  }
  .dark .section-head > p:last-child {
    font-size: 16px;
  }
  .commitment-title {
    font-size: 11px;
    margin-bottom: 20px;
  }
  .commitments h3 {
    font-size: 20px;
  }
  .commitments p {
    font-size: 15px;
  }
  .commitments li {
    padding-block: 24px;
  }
  .category-art {
    aspect-ratio: 3/2;
  }
  .category-body {
    padding: 25px;
  }
  .category h3 {
    font-size: 27px;
  }
  .category p.description {
    font-size: 16px;
  }
  .category-kicker {
    font-size: 10px;
  }
  .category-footnote {
    font-size: 12px;
  }
  .steps {
    gap: 28px;
  }
  .step-number {
    font-size: 34px;
    margin-bottom: 16px;
  }
  .steps h3 {
    font-size: 20px;
  }
  .steps p {
    font-size: 16px;
  }
  .closing {
    padding: 38px 25px;
    gap: 25px;
    margin-top: 40px;
    border-radius: 24px;
  }
  .closing-title {
    font-size: 30px;
  }
  .closing .small {
    font-size: 14px;
    margin-top: 18px;
  }
  .closing .button {
    padding-inline: 20px;
    font-size: 13px;
  }
  .site-footer {
    padding-top: 35px;
  }
  .footer-grid {
    gap: 28px;
  }
  .footer-links {
    grid-column: auto;
  }
  .footer-bottom {
    margin-top: 24px;
  }
  .footer-brand-note {
    max-width: 300px;
  }
}
@media (max-width: 359px) {
  .header-register {
    width: 116px;
  }
  .header-inner {
    gap: 7px;
  }
  .brand svg {
    width: 25px;
    height: 25px;
  }
  .brand {
    font-size: 14px;
  }
  .brand .trade-word {
    font-size: 13px;
  }
  .hero h1 {
    font-size: 32px;
  }
  .hero-copy .eyebrow {
    font-size: 8px;
  }
  .sample-pill {
    padding-inline: 4px;
  }
  .profile-top {
    padding-inline: 12px;
  }
  .profile-body {
    padding: 15px;
  }
  .sample-check {
    font-size: 8px;
  }
  .verification-layout {
    padding-inline: 20px;
  }
  .hero-note {
    font-size: 10px;
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
