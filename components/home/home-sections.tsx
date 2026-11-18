import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  ADDRESS,
  ORGANIZATION_NAME,
  PHONE_DISPLAY,
  PUBLIC_EMAIL,
  SOCIAL_PROFILES,
} from "@/lib/business-profile";
import { VEXIM_PHONE_TEL_URL, VEXIM_ZALO_URL } from "@/lib/contact-info";
import { HOME_MESSAGES } from "@/lib/home-i18n";
import { HOME_HERO, HOME_SOLUTIONS } from "@/lib/homepage-content";
import { homePath, privacyPath, type HomeLocale } from "@/lib/locale-routes";
import { TRADE } from "@/lib/vexim-trade-content";
import { ConsultationForm, ConsultationLink } from "./consultation-form";
import { HeroReport, MarketReport, MiniChart } from "./report-graphics";
import s from "./home.module.css";

type Props = { locale: HomeLocale };
type Pairs = readonly (readonly [string, string])[];
const art = "/home/export/";
const caseLink = "/services/fda#case-libra";
const exporterSearch =
  "https://www.google.com/search?q=Vietnamese+food+exporters";
const arrow = <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />;
const external = (
  <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
);

function SectionHead({
  label,
  title,
  intro,
  children,
}: {
  label: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className={s.sectionHead}>
      <div>
        <p className={s.eyebrow}>{label}</p>
        <h2>{title}</h2>
      </div>
      {intro && <p className={s.lede}>{intro}</p>}
      {children}
    </div>
  );
}

function Points({
  items,
  numbered = false,
}: {
  items: Pairs;
  numbered?: boolean;
}) {
  return (
    <ul className={s.points}>
      {items.map(([title, text], i) => (
        <li key={title}>
          {numbered && (
            <span className={s.index} aria-hidden="true">
              0{i + 1}
            </span>
          )}
          <div>
            <strong>{title}</strong>
            <p>{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Photo({
  name,
  alt,
  sizes = "(max-width: 800px) 92vw, 560px",
}: {
  name: string;
  alt: string;
  sizes?: string;
}) {
  return (
    <img
      src={`/home/${name}-800.webp`}
      srcSet={`/home/${name}-800.webp 800w, /home/${name}.webp 1200w`}
      sizes={sizes}
      width={800}
      height={436}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}

export function HomeHero({ locale }: Props) {
  const t = HOME_HERO[locale];
  return (
    <section className={`${s.hero} ${s.pattern}`} aria-labelledby="hero-title">
      <svg
        className={s.globe}
        viewBox="0 0 640 640"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="320" cy="320" r="305" />
        <ellipse cx="320" cy="320" rx="184" ry="305" />
        <ellipse cx="320" cy="320" rx="65" ry="305" />
        <ellipse cx="320" cy="320" rx="305" ry="125" />
        <ellipse cx="320" cy="320" rx="305" ry="232" />
        <path d="M15 320h610M320 15v610" />
      </svg>
      <div className={s.heroInner}>
        <div className={s.heroCopy}>
          <p className={s.heroBadge}>
            <b>B2B</b>
            {t.badge}
          </p>
          <h1 id="hero-title">
            {t.lead} <em>{t.accent}</em>
          </h1>
          <p className={s.heroDescription}>{t.description}</p>
          <div className={s.actions}>
            <a
              href={TRADE.register}
              target="_blank"
              rel="noopener noreferrer"
              className={`${s.button} ${s.gold}`}
            >
              {t.register}
              {arrow}
            </a>
            <ConsultationLink
              service="seo"
              className={`${s.button} ${s.outline}`}
            >
              {t.consult}
            </ConsultationLink>
          </div>
          <ul className={s.signals}>
            {t.signals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>
        <HeroReport locale={locale} />
      </div>
    </section>
  );
}

export function Partners({ locale }: Props) {
  const brands = [
    ["libra", "Libra"],
    ["green-foods", "Green Foods"],
    ["bimifoods", "BimiFoods"],
    ["dann-food", "Dann Food"],
    ["pham-gia", "Pham Gia"],
  ];
  return (
    <section className={s.partners} aria-label={HOME_MESSAGES[locale].partners}>
      <div className={s.container}>
        <p className={s.eyebrow}>{HOME_MESSAGES[locale].partners}</p>
        <ul>
          {brands.map(([id, name]) => (
            <li key={id}>
              <img
                src={`${art}logo-${id}.webp`}
                width={120}
                height={42}
                alt={name}
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CoreSolutions({ locale }: Props) {
  const t = HOME_MESSAGES[locale].solutions;
  return (
    <section id="solutions" className={`${s.section} ${s.paper}`}>
      <div className={s.container}>
        <SectionHead {...t} />
        <div className={s.solutionGrid}>
          {HOME_SOLUTIONS[locale].map((item, i) => (
            <article key={item.id} className={s.solution}>
              <p className={s.eyebrow}>
                0{i + 1} <span>/</span> {item.label}
              </p>
              <h3>
                <a href={`#${item.id}`}>
                  {item.name}
                  <span className={s.circleLink}>{arrow}</span>
                </a>
              </h3>
              <p>{item.description}</p>
              {i === 0 ? (
                <a
                  className={s.tradeScreen}
                  href="https://www.veximtrade.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`${art}veximtrade-marketplace.webp`}
                    alt={t.screen}
                    width={760}
                    height={241}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ) : i === 1 ? (
                <MiniChart />
              ) : (
                <div className={s.wireframe} aria-hidden="true">
                  <div className={s.windowBar}>
                    <i />
                    <i />
                    <i />
                  </div>
                  <div>
                    <b />
                    <span />
                    <span />
                    <em />
                  </div>
                </div>
              )}
              {i === 0 && (
                <small className={s.captureSource}>
                  {locale === "vi"
                    ? "Ảnh chụp veximtrade.com · mở ảnh để xem sàn"
                    : "Screenshot of veximtrade.com · open the image to visit"}
                </small>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Marketplace({ locale }: Props) {
  const t = HOME_MESSAGES[locale].trade;
  return (
    <section id="trade" className={`${s.section} ${s.trade} ${s.pattern}`}>
      <div className={s.container}>
        <SectionHead {...t} />
        <div className={s.tradeSteps}>
          <figure className={s.map}>
            <div>
              <span className={s.eyebrow}>{t.mapTitle}</span>
              <small>VN → GLOBAL</small>
            </div>
            <img
              src={`${art}routes.svg`}
              alt={t.mapAlt}
              width={680}
              height={310}
              loading="lazy"
            />
            <figcaption>{t.mapNote}</figcaption>
          </figure>
          <div>
            <h3 className={s.eyebrow}>{t.stepsLabel}</h3>
            <ol className={s.steps}>
              {t.steps.map(([title, body], i) => (
                <li key={title}>
                  <span aria-hidden="true">{i + 1}</span>
                  <div>
                    <h4>{title}</h4>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className={s.tradeBenefits}>
          <figure className={s.meeting}>
            <Photo name="buyer-meeting" alt={t.photoAlt} />
            <figcaption>
              <small>VEXIM TRADE / B2B</small>
              {t.photoCaption}
            </figcaption>
          </figure>
          <div>
            <h3 className={s.subhead}>{t.benefitsTitle}</h3>
            <Points items={t.benefits} />
            <div className={s.actions}>
              <a
                className={`${s.button} ${s.gold}`}
                href={TRADE.register}
                target="_blank"
                rel="noopener noreferrer"
              >
                {HOME_HERO[locale].register}
                {arrow}
              </a>
              <a
                className={`${s.button} ${s.outline}`}
                href="https://www.veximtrade.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.visit}
                {external}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InternationalSEO({ locale }: Props) {
  const t = HOME_MESSAGES[locale].seo;
  return (
    <section id="seo" className={`${s.section} ${s.paper}`}>
      <div className={s.container}>
        <SectionHead {...t} />
        <MarketReport locale={locale} />
        <div id="the-gap" className={s.gap}>
          <div>
            <h3 className={s.subhead}>{t.gap}</h3>
            <p>{t.gapIntro}</p>
          </div>
          <Points items={t.gaps} numbered />
        </div>
        <h3 className={s.subhead}>{t.work}</h3>
        <ol className={s.work}>
          {t.items.map(([title, text], i) => (
            <li key={title}>
              <b aria-hidden="true">0{i + 1}</b>
              <h4>{title}</h4>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className={`${s.geo} ${s.pattern}`}>
          <div>
            <p className={s.eyebrow}>{t.geo}</p>
            <h3>{t.geoTitle}</h3>
            <p>{t.geoText}</p>
            <small>{t.noPromise}</small>
            <ConsultationLink service="seo" className={`${s.button} ${s.gold}`}>
              {t.cta}
              {arrow}
            </ConsultationLink>
          </div>
          <div className={s.searchEvidence}>
            <p className={s.searchEyebrow}>{t.search.label}</p>
            <h4>{t.search.query}</h4>
            <p>{t.search.note}</p>
            <a href={exporterSearch} target="_blank" rel="noopener noreferrer">
              {t.search.link} {external}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExportWebsite({ locale }: Props) {
  const t = HOME_MESSAGES[locale].website;
  return (
    <section id="website" className={`${s.section} ${s.white}`}>
      <div className={`${s.container} ${s.website}`}>
        <div>
          <p className={s.eyebrow}>{t.label}</p>
          <h2>{t.title}</h2>
          <p className={s.lede}>{t.intro}</p>
          <Points items={t.features} />
          <ConsultationLink service="website" className={s.button}>
            {t.cta}
            {arrow}
          </ConsultationLink>
        </div>
        <aside className={s.websiteExample} aria-label={t.demo}>
          <p className={s.eyebrow}>{t.exampleLabel}</p>
          <h3>{t.exampleName}</h3>
          <p>{t.exampleText}</p>
          <a href={t.exampleUrl} target="_blank" rel="noopener noreferrer">
            {t.exampleLink} {external}
          </a>
          <small>{t.exampleSource}</small>
        </aside>
      </div>
    </section>
  );
}

export function Delivery({ locale }: Props) {
  const { process, audience, why } = HOME_MESSAGES[locale];
  return (
    <>
      <section className={`${s.section} ${s.paper}`}>
        <div className={s.container}>
          <div className={s.centerHead}>
            <p className={s.eyebrow}>{process.label}</p>
            <h2>{process.title}</h2>
          </div>
          <ol className={s.timeline}>
            {process.steps.map(([title, text], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section id="audience" className={`${s.section} ${s.white}`}>
        <div className={`${s.container} ${s.audience}`}>
          <figure className={s.audiencePhoto}>
            <img
              src={`${art}food-processing-team.webp`}
              alt={audience.alt}
              width={750}
              height={499}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{audience.photoCaption}</figcaption>
          </figure>
          <div>
            <p className={s.eyebrow}>{audience.label}</p>
            <h2>{audience.title}</h2>
            <Points items={audience.items} numbered />
          </div>
        </div>
      </section>
      <section className={`${s.section} ${s.why} ${s.pattern}`}>
        <div className={s.container}>
          <SectionHead label={why.label} title={why.title}>
            <a href="#contact" className={`${s.button} ${s.gold}`}>
              {locale === "vi"
                ? "Nhận tư vấn miễn phí"
                : "Get a free consultation"}
              {arrow}
            </a>
          </SectionHead>
          <ol>
            {why.items.map(([title, text], i) => (
              <li key={title}>
                <b aria-hidden="true">0{i + 1}</b>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

export function ProjectsAndNews({ locale }: Props) {
  const { project, legal, news } = HOME_MESSAGES[locale];
  const images = [
    "/images/fda/libra-factory.webp",
    `${art}dossier-detail.webp`,
    `${art}registration-detail.webp`,
  ];
  const topics = ["Tin tức thị trường", "FDA", "GACC"];
  const photos = ["port-logistics", "quality-lab", "warehouse-loading"];
  return (
    <>
      <section className={`${s.section} ${s.paper}`}>
        <div className={s.container}>
          <SectionHead {...project} />
          <div className={s.cases}>
            {project.cards.map(([label, title, text], i) => (
              <article key={label}>
                <div>
                  <img
                    src={images[i]}
                    width={660}
                    height={345}
                    alt={label + " · Libra Vietnam"}
                    loading="lazy"
                  />
                  <span>{label}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <a className={s.textLink} href={caseLink}>
            {project.link}
            {arrow}
          </a>
          <div className={s.legal} id="services">
            <div>
              <p className={s.eyebrow}>{legal.label}</p>
              <h3>{legal.title}</h3>
              <p>{legal.intro}</p>
            </div>
            <div className={s.actions}>
              <a className={s.button} href="/services/fda">
                {legal.fda}
              </a>
              <a className={`${s.button} ${s.outline}`} href="/services/gacc">
                {legal.gacc}
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="news" className={`${s.section} ${s.white}`}>
        <div className={s.container}>
          <SectionHead label={news.label} title={news.title}>
            <a className={s.textLink} href="/blog">
              {news.all}
              {arrow}
            </a>
          </SectionHead>
          <div className={s.newsGrid}>
            {news.cards.map(([tag, title], i) => (
              <a
                href={`/blog/category/${encodeURIComponent(topics[i])}`}
                key={tag}
              >
                <Photo name={photos[i]} alt="" />
                <div>
                  <span className={s.eyebrow}>{tag}</span>
                  <h3>{title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function FAQAndContact({ locale }: Props) {
  const { faq, contact } = HOME_MESSAGES[locale];
  return (
    <>
      <section id="faq" className={`${s.section} ${s.paper}`}>
        <div className={`${s.container} ${s.faq}`}>
          <div>
            <p className={s.eyebrow}>{faq.label}</p>
            <h2>{faq.title}</h2>
            <p>
              {faq.hotline} <a href={VEXIM_PHONE_TEL_URL}>{PHONE_DISPLAY}</a>.
            </p>
          </div>
          <div className={s.questions}>
            {faq.items.map(([q, answer], i) => (
              <details name="home-faq" key={q} open={i === 0}>
                <summary>{q}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section
        id="contact"
        className={`${s.section} ${s.contact} ${s.pattern}`}
      >
        <div className={`${s.container} ${s.contactInner}`}>
          <div>
            <p className={s.eyebrow}>{contact.label}</p>
            <h2>{contact.title}</h2>
            <p className={s.lede}>{contact.intro}</p>
            <div className={s.contactLinks}>
              <a href={VEXIM_PHONE_TEL_URL}>
                <small>Hotline</small>
                {PHONE_DISPLAY}
              </a>
              <a href={VEXIM_ZALO_URL}>
                <small>Zalo</small>
                {contact.zalo} ↗
              </a>
            </div>
          </div>
          <ConsultationForm locale={locale} options={HOME_SOLUTIONS[locale]} />
        </div>
      </section>
    </>
  );
}

export function HomeFooter({ locale }: Props) {
  const t = HOME_MESSAGES[locale].footer;
  const base = homePath(locale);
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.footerGrid}>
          <div>
            <h2>{t.company}</h2>
            <p>VEXIM GLOBAL CO., LTD.</p>
            <address>
              {ADDRESS.streetAddress}
              <br />
              {ADDRESS.addressLocality}, {t.country}
            </address>
          </div>
          <div>
            <h3>{t.solutions}</h3>
            {HOME_SOLUTIONS[locale].map((x) => (
              <a key={x.id} href={`${base}#${x.id}`}>
                {x.name}
              </a>
            ))}
            <a
              href="https://www.veximtrade.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              veximtrade.com ↗
            </a>
          </div>
          <div>
            <h3>{t.resources}</h3>
            <a href="/services/fda">FDA</a>
            <a href="/services/gacc">GACC</a>
            <a href="/services/us-agent">US Agent</a>
            <a href="/services/cosmetics/mocra-registration">MoCRA</a>
            <a href="/blog">{t.blog}</a>
            <a href="/client-portal">{t.portal}</a>
          </div>
          <div>
            <h3>{t.contact}</h3>
            <a href={VEXIM_PHONE_TEL_URL}>{PHONE_DISPLAY}</a>
            <a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a>
            <a href={SOCIAL_PROFILES.facebook}>Facebook ↗</a>
            <a href={SOCIAL_PROFILES.linkedin}>LinkedIn ↗</a>
          </div>
        </div>
        <div className={s.footerBottom}>
          <span>
            © {new Date().getFullYear()} {ORGANIZATION_NAME}. {t.rights}
          </span>
          <a href={privacyPath(locale)}>{t.privacy}</a>
        </div>
      </div>
    </footer>
  );
}
