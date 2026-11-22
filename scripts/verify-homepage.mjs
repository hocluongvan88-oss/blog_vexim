import assert from "node:assert/strict";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { load } from "cheerio";

const base = (
  process.env.HOME_TEST_BASE_URL || "http://127.0.0.1:3000"
).replace(/\/$/, "");
const get = async (url, language = "vi-VN,vi;q=0.9") => {
  const response = await fetch(`${base}${url}`, {
    headers: { "accept-language": language },
  });
  assert.equal(response.status, 200, url);
  return load(await response.text());
};

const viHome = await get("/");
const home = await get("/en", "en-US,en;q=0.9");
const viPrivacy = await get("/privacy");
const privacy = await get("/en/privacy", "en-US,en;q=0.9");
const fda = await get("/services/fda");
const heading = "Connect with food importers looking for suppliers in Vietnam";
const viHeading =
  "Tìm khách hàng nhập khẩu cho doanh nghiệp thực phẩm Việt Nam";
const siteUrl = "https://www.veximglobal.com";
assert.equal(home("html").attr("lang"), "en");
assert.equal(home("main").first().attr("lang"), "en");
assert.equal(home("h1").text(), heading);
assert.equal(home("h1").length, 1);
assert.equal(
  home("main header, main footer").length,
  0,
  "Global landmarks should sit outside <main>",
);
assert.equal(
  home('head link[rel="canonical"]').attr("href"),
  "https://www.veximglobal.com/en",
);
assert.ok(
  home('head meta[name="description"]')
    .attr("content")
    ?.includes("B2B marketplace"),
);
assert.equal(home('body meta[name="description"]').length, 0);
assert.equal(
  home(
    'head link[rel="preload"][as="font"][href="/fonts/inter-home-latin.woff2"]',
  ).length,
  0,
  "Optional display font should not delay critical resources",
);
assert.equal(
  home('head link[rel="manifest"]').length,
  0,
  "The public homepage is not the admin PWA",
);
assert.equal(
  home('meta[property="og:url"]').attr("content"),
  "https://www.veximglobal.com/en",
);
assert.equal(home('meta[property="og:locale"]').attr("content"), "en_US");
assert.equal(
  home('meta[property="og:image"]').attr("content"),
  "https://www.veximglobal.com/og-image.jpg",
);
assert.equal(privacy("html").attr("lang"), "en");
assert.equal(privacy('head link[rel="manifest"]').length, 0);
assert.equal(viHome("html").attr("lang"), "vi");
assert.equal(viHome("main").first().attr("lang"), "vi");
assert.equal(viHome("h1").text(), viHeading);
assert.equal(viHome("h1").length, 1);
assert.equal(viHome('head link[rel="canonical"]').attr("href"), siteUrl);
assert.equal(viHome('meta[property="og:locale"]').attr("content"), "vi_VN");
assert.equal(
  viHome('meta[property="og:image"]').attr("content"),
  `${siteUrl}/og-image-vi.jpg`,
);
assert.equal(viHome('head link[rel="manifest"]').length, 0);
assert.equal(viPrivacy("html").attr("lang"), "vi");
assert.equal(viPrivacy("main").attr("lang"), "vi");
assert.equal(viPrivacy("h1").text(), "Quyền riêng tư & yêu cầu liên hệ");
assert.equal(
  viPrivacy('head link[rel="canonical"]').attr("href"),
  `${siteUrl}/privacy`,
);
assert.equal(
  privacy('head link[rel="canonical"]').attr("href"),
  `${siteUrl}/en/privacy`,
);
assert.equal(privacy("title").text(), "Privacy & Data Requests | Vexim Global");
assert.equal(
  viPrivacy("title").text(),
  "Quyền riêng tư & Yêu cầu dữ liệu | Vexim Global",
);
// Tiếng Việt là mặc định ở URL gốc; /en là bản tiếng Anh. x-default trỏ về
// bản tiếng Việt vì đó là ngôn ngữ mặc định của site.
for (const [english, vietnamese, path] of [
  [home, viHome, ""],
  [privacy, viPrivacy, "/privacy"],
]) {
  for (const document of [english, vietnamese]) {
    assert.equal(
      document('link[rel="alternate"][hreflang="en"]').attr("href"),
      `${siteUrl}/en${path}`,
    );
    assert.equal(
      document('link[rel="alternate"][hreflang="vi"]').attr("href"),
      `${siteUrl}${path}`,
    );
    assert.equal(
      document('link[rel="alternate"][hreflang="x-default"]').attr("href"),
      `${siteUrl}${path}`,
    );
  }
}
assert.equal(fda("html").attr("lang"), "vi");
assert.equal(home("body").hasClass("font-sans"), false);
assert.equal(viHome("body").hasClass("font-sans"), false);
assert.equal(
  fda("body").hasClass("font-sans"),
  true,
  "Existing Vietnamese service font stays unchanged",
);
assert.equal(
  fda('link[rel="alternate"][hreflang="en"]').length,
  0,
  "Untranslated legal pages must not advertise an English counterpart",
);
assert.equal(fda("[data-language-switcher]").length, 0);
assert.equal(fda('head meta[name="description"]').length, 1);
for (const id of ["solutions", "the-gap", "services", "contact"]) {
  assert.equal(home(`#${id}`).length, 1, id);
  assert.equal(viHome(`#${id}`).length, 1, `VI ${id}`);
}
for (const [label, page, title, prefix] of [
  ["VI", viHome, viHeading, ""],
  ["EN", home, heading, "/en"],
]) {
  const copy = page("main").text();
  for (const id of ["trade", "seo", "website", "news", "faq"])
    assert.equal(page(`main #${id}`).length, 1, `${label} ${id}`);
  assert.equal(page("#solutions article").length, 3);
  assert.equal(page("#faq details").length, 6);
  assert.equal(page("#contact form").length, 1);
  assert.equal(
    page(`#contact select option`).length,
    4,
    "Three services + no preference",
  );
  assert.equal(
    page('#contact input[name="website"][required]').length,
    0,
    "Exporters without a site can enquire",
  );
  assert.ok(
    !/Cashew|Robusta|Black Pepper|Star Anise|W320|hạt điều|hồ tiêu|cà phê|Global Growth Engine|B2B Launchpad|Enterprise Dominance|\[LOGO|\[Tên doanh nghiệp\]|\[X\]/i.test(
      copy,
    ),
    `${label} no product listings, legacy packages or placeholder results`,
  );
  assert.ok(
    !/Top [1-9]|Alibaba|Global Sources/i.test(copy),
    `${label} no unsubstantiated rankings`,
  );
  assert.ok(
    copy.includes(label === "VI" ? "Dữ liệu minh họa" : "Illustrative data"),
  );
  for (const href of [
    "/services/fda",
    "/services/gacc",
    "/services/us-agent",
    "/services/cosmetics/mocra-registration",
    "/blog",
    "/client-portal",
    `${prefix}/privacy`,
    "https://veximtrade.com",
    "https://veximtrade.com/supplier/register",
  ])
    assert.ok(page(`a[href="${href}"]`).length, href);
  for (const lang of ["vi", "en"])
    assert.ok(
      page(`[data-language-switcher] a[lang="${lang}"][href$="?lang=${lang}"]`)
        .length,
    );
  for (const el of page("a[href]").toArray()) {
    const url = new URL(page(el).attr("href"), `${siteUrl}${prefix}/`);
    if (
      url.origin === siteUrl &&
      ["/", "/en"].includes(url.pathname) &&
      url.hash
    )
      assert.equal(page(url.hash).length, 1, `Unresolved fragment: ${url}`);
  }
  const tradeImage = page(
    '#solutions img[src="/home/export/veximtrade-marketplace.webp"]',
  );
  assert.equal(tradeImage.length, 1);
  assert.ok(tradeImage.attr("alt"));
  assert.equal(tradeImage.attr("width"), "760");
  assert.equal(tradeImage.attr("height"), "312");
  assert.ok(
    page('#solutions a[href="https://www.veximtrade.com/"]').length,
    "The genuine marketplace capture links to its source",
  );
  assert.ok(
    readFileSync("public/home/export/veximtrade-marketplace.webp").length <
      120000,
  );
  const routes = page('#trade img[src="/home/export/routes.svg"]');
  assert.equal(routes.length, 1);
  assert.ok(routes.attr("alt"));
  assert.ok(routes.attr("width"));
  assert.ok(routes.attr("height"));
  assert.ok(
    page(
      '#seo a[href="https://www.google.com/search?q=Vietnamese+food+exporters"]',
    ).length,
    "Show the exact live food-exporter search query instead of an unverified SERP image",
  );
  assert.ok(
    !page("#seo img").length,
    "Do not misrepresent a non-food search screenshot as export SEO evidence",
  );
  assert.ok(
    page('#website a[href="https://naturefoods.com.vn/"]').length,
    "Link the verified public food-export website example",
  );
  assert.ok(
    page('#website a[href="https://naturefoods.com.vn/"]').text().length > 0,
  );
  assert.ok(
    !page('#website img[src*="factory"], #website img[src*="device"]').length,
    "Do not fake a screenshot of the referenced website",
  );
  const audienceImage = page(
    '#audience img[src="/home/export/food-processing-team.webp"]',
  );
  assert.equal(audienceImage.length, 1);
  assert.ok(audienceImage.attr("alt"));
  assert.ok(audienceImage.attr("width"));
  assert.ok(audienceImage.attr("height"));
  assert.ok(
    readFileSync("public/home/export/food-processing-team.webp").length <
      120000,
  );
  assert.equal(
    page("#audience figcaption").length,
    0,
    "Drop the redundant illustrative-photo caption",
  );
  assert.equal(
    page("#solutions small").length,
    0,
    "Drop the redundant screenshot caption",
  );
  const example = page("#website aside");
  assert.equal(
    page("#website aside small, #website aside .eyebrow").length,
    0,
    "Drop the public-example label and source note from the website block",
  );
  assert.equal(
    example.find('a[href="https://naturefoods.com.vn/"]').length,
    1,
    "Keep one clear link to the referenced website",
  );
  assert.ok(
    /naturefoods\.com\.vn/.test(example.text()),
    "Show the referenced domain in the example card",
  );
  assert.equal(
    page('script#home-page-schema[type="application/ld+json"]').length,
    1,
  );
  const service = JSON.parse(page("script#home-page-schema").html())[
    "@graph"
  ].find((node) => node["@type"] === "Service");
  assert.equal(service.name, title);
  assert.deepEqual(
    service.hasOfferCatalog.itemListElement.map((x) => x.itemOffered.name),
    page("#solutions h3")
      .map((_, h) => page(h).text())
      .get(),
  );
}
assert.ok(readFileSync("public/og-image.jpg").length < 300_000);
assert.ok(readFileSync("public/og-image-vi.jpg").length < 300_000);
const sitemapResponse = await fetch(`${base}/sitemap.xml`);
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
for (const url of [`${siteUrl}/en`, `${siteUrl}/en/privacy`])
  assert.ok(sitemap.includes(`<loc>${url}</loc>`), `sitemap ${url}`);
assert.ok(
  sitemap.includes(`<loc>${siteUrl}</loc>`),
  "sitemap default-language home",
);
assert.ok(
  sitemap.includes(`<loc>${siteUrl}/privacy</loc>`),
  "sitemap default-language privacy",
);
// Định tuyến ngôn ngữ: tiếng Việt là mặc định, khách quốc tế được chuyển sang
// /en, và lựa chọn thủ công (?lang=) được ghi cookie để không bị chuyển lại.
{
  const status = async (path, headers) => {
    const response = await fetch(`${base}${path}`, {
      headers,
      redirect: "manual",
    });
    return {
      code: response.status,
      location: response.headers.get("location"),
      cookies: response.headers.getSetCookie?.() ?? [],
    };
  };
  const english = { "accept-language": "en-US,en;q=0.9" };
  const vietnamese = { "accept-language": "vi-VN,vi;q=0.9" };

  assert.equal(
    (await status("/", {})).code,
    200,
    "no Accept-Language falls back to Vietnamese",
  );
  const enBrowser = await status("/", english);
  assert.equal(
    enBrowser.code,
    307,
    "English browser is redirected to the English page",
  );
  assert.ok(enBrowser.location?.endsWith("/en"), "redirects to /en");
  assert.equal(
    (await status("/privacy", english)).location?.endsWith("/en/privacy"),
    true,
  );
  assert.equal(
    (await status("/en", english)).code,
    200,
    "English page never bounces back",
  );
  assert.equal((await status("/", vietnamese)).code, 200);
  assert.equal(
    (await status("/", { "accept-language": "en;q=0.2, vi;q=0.9" })).code,
    200,
    "quality values decide",
  );
  assert.equal(
    (await status("/", { "accept-language": "fr-FR,fr;q=0.9" })).code,
    200,
    "unrelated languages stay on Vietnamese",
  );

  // Bấm "VI" trên bản tiếng Anh ghi cookie để lần sau trình duyệt tiếng Anh
  // không bị chuyển hướng nữa.
  const chooseVi = await status("/?lang=vi", english);
  assert.equal(chooseVi.code, 307);
  assert.ok(
    chooseVi.cookies.some((cookie) => cookie.startsWith("vexim_locale=vi")),
    "manual choice is persisted",
  );
  assert.equal(
    (await status("/", { ...english, cookie: "vexim_locale=vi" })).code,
    200,
    "remembered choice wins over the browser language",
  );
  assert.equal(
    (
      await status("/", { ...vietnamese, cookie: "vexim_locale=en" })
    ).location?.endsWith("/en"),
    true,
    "remembered English choice redirects",
  );

  // URL tiếng Việt cũ giữ 308 về URL mới để không mất tín hiệu SEO.
  const oldHome = await status("/vi", {});
  assert.equal(oldHome.code, 308);
  assert.ok(oldHome.location?.endsWith("/"), "/vi -> /");
  assert.equal(
    (await status("/vi/privacy", {})).location?.endsWith("/privacy"),
    true,
    "/vi/privacy -> /privacy",
  );
}
assert.ok(sitemap.includes('hreflang="vi"'));
const serviceSitemapEntry = sitemap.slice(
  sitemap.indexOf(`<loc>${siteUrl}/services/fda</loc>`),
  sitemap.indexOf(
    "</url>",
    sitemap.indexOf(`<loc>${siteUrl}/services/fda</loc>`),
  ),
);
assert.ok(serviceSitemapEntry.includes(`<loc>${siteUrl}/services/fda</loc>`));
assert.ok(
  !serviceSitemapEntry.includes('hreflang="en"'),
  "Unreviewed service translations must not be in sitemap",
);
const bad = await fetch(`${base}/api/digital-audit`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    website: "javascript:alert(1)",
    company: "Factory",
    markets: "US",
    email: "a@example.com",
  }),
});
assert.equal(bad.status, 400);
const injected = await fetch(`${base}/api/digital-audit`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: "https://invalid.example",
  },
  body: "{}",
});
assert.equal(injected.status, 403);
const honeypot = await fetch(`${base}/api/digital-audit`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ fax: "filled-by-bot" }),
});
assert.deepEqual(await honeypot.json(), { success: true });
const sameOrigin = await fetch(`${base}/api/digital-audit`, {
  method: "POST",
  headers: { "Content-Type": "application/json", origin: new URL(base).origin },
  body: JSON.stringify({ fax: "testing-same-origin" }),
});
assert.equal(
  sameOrigin.status,
  200,
  "Form accepts a browser request at the public host",
);
console.log(
  "PASS: bilingual SSR, privacy, hreflang, navigation, real artwork, no product catalogue, service schema and form endpoint",
);

const executablePath = process.env.BROWSER_EXECUTABLE_PATH;
if (!executablePath) {
  console.log("Set BROWSER_EXECUTABLE_PATH for browser checks.");
  process.exit(0);
}
const { default: puppeteer } = await import("puppeteer-core");
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const screenshots = process.env.HOME_TEST_SCREENSHOT_DIR;
if (screenshots) mkdirSync(screenshots, { recursive: true });
try {
  for (const locale of ["vi", "en"]) {
    const pathname = locale === "vi" ? "/" : "/en";
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.evaluateOnNewDocument(() => {
      window.__homeCLS = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (!entry.hadRecentInput) window.__homeCLS += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.setExtraHTTPHeaders({ "Accept-Language": locale });
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    for (const width of [
      320, 390, 620, 768, 820, 1024, 1141, 1244, 1440, 1920,
    ]) {
      await page.setViewport({ width, height: width < 500 ? 844 : 900 });
      await page.goto(`${base}${pathname}`, { waitUntil: "networkidle2" });
      const state = await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map(async (image) => {
            image.loading = "eager";
            await image.decode();
          }),
        );
        const rect = (selector) =>
          document.querySelector(selector).getBoundingClientRect().toJSON();
        return {
          cls: window.__homeCLS,
          width: document.documentElement.scrollWidth,
          lang: document.documentElement.lang,
          h1: document.querySelector("h1").textContent,
          hero: rect('div[class*="heroCopy"]'),
          report: rect('figure[class*="heroStage"]'),
          brand: rect('header a[class*="brand"]'),
          menu: rect('button[aria-controls="home-mobile-nav"]'),
          cta: rect('header a[href$="#contact"][class]'),
          cards: [...document.querySelectorAll("#solutions article")].map(
            (el) => el.getBoundingClientRect().top,
          ),
        };
      });
      assert.equal(state.lang, locale);
      assert.equal(state.h1, locale === "vi" ? viHeading : heading);
      assert.ok(
        state.cls < 0.1,
        `Unexpected initial layout shift ${state.cls} at ${locale}/${width}`,
      );
      assert.equal(state.width, width, `Overflow at ${locale}/${width}`);
      if (width > 820)
        assert.ok(state.report.left > state.hero.right, "Desktop split hero");
      else
        assert.ok(
          state.report.top >= state.hero.bottom + 16,
          "Stacked mobile report",
        );
      assert.ok(
        width <= 620
          ? state.cards[1] > state.cards[0]
          : Math.abs(state.cards[1] - state.cards[0]) < 1,
        "Responsive services grid",
      );
      if (state.menu.width) {
        assert.ok(
          state.menu.width >= 42 &&
            state.cta.left >= state.brand.right &&
            state.menu.left >= state.cta.right &&
            state.menu.right <= width,
          `Header overlap at ${locale}/${width}`,
        );
        await page.locator('button[aria-controls="home-mobile-nav"]').click();
        await page.locator('#home-mobile-nav a[href$="#seo"]').click();
        assert.equal(
          await page.$eval("#home-mobile-nav", (el) => el.hidden),
          true,
        );
        assert.equal(new URL(page.url()).hash, "#seo");
      }
      await page.evaluate(() => scrollTo({ top: 500, behavior: "instant" }));
      assert.ok(
        Math.abs(
          await page.$eval("header", (el) => el.getBoundingClientRect().top),
        ) < 1,
        "Sticky header",
      );
      if (screenshots && [390, 1440].includes(width)) {
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await page.screenshot({
          path: path.join(screenshots, `home-${locale}-${width}.png`),
          fullPage: true,
        });
      }
    }
    await page.locator("#faq details:nth-child(2) summary").click();
    assert.equal(
      await page.$eval("#faq details:nth-child(2)", (el) => el.open),
      true,
    );
    await page.locator('#website a[href="#contact"]').click();
    assert.equal(
      await page.$eval("#contact select", (el) => el.value),
      "website",
    );
    let posted,
      ok = false;
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (!request.url().endsWith("/api/digital-audit"))
        return void request.continue();
      posted = JSON.parse(request.postData());
      void request.respond({
        status: ok ? 200 : 503,
        contentType: "application/json",
        body: JSON.stringify({ success: ok }),
      });
    });
    await page.locator("#audit-company").fill("Example Factory");
    await page.locator("#audit-email").fill("sales@factory.example");
    await page.locator("#audit-markets").fill("EU");
    await page.locator('#contact button[type="submit"]').click();
    await page.waitForSelector('#contact [role="alert"]');
    const href = await page.$eval(
      '#contact a[href^="mailto:"]',
      (el) => el.href,
    );
    assert.ok(decodeURIComponent(href).includes("Example Factory"));
    assert.equal(
      posted.scope,
      locale === "vi" ? "Website xuất khẩu" : "Export websites",
    );
    assert.equal(posted.website, "", "No website yet is a valid enquiry");
    ok = true;
    await page.locator('#contact button[type="submit"]').click();
    await page.waitForSelector('#contact [role="status"]');
    assert.equal(await page.$('#contact [role="alert"]'), null);
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      `PASS ${locale}: 320–1920px, decoded images, responsive header, FAQ, service CTA, inline enquiry success/fallback (no mail sent)`,
    );
  }
  const choose = await browser.newPage();
  await choose.setViewport({ width: 390, height: 844 });
  await choose.setExtraHTTPHeaders({ "Accept-Language": "vi-VN" });
  await choose.goto(`${base}/privacy`, { waitUntil: "networkidle2" });
  for (const [lang, target] of [
    ["en", "/en/privacy"],
    ["vi", "/privacy"],
  ]) {
    await Promise.all([
      choose.waitForNavigation({ waitUntil: "networkidle2" }),
      choose.locator(`[data-language-switcher] a[lang="${lang}"]`).click(),
    ]);
    assert.equal(new URL(choose.url()).pathname, target);
    assert.equal(await choose.$eval("html", (el) => el.lang), lang);
    assert.ok(
      await choose.evaluate(
        (value) => document.cookie.includes(`vexim_locale=${value}`),
        lang,
      ),
    );
  }
  await choose.close();
} finally {
  await browser.close();
}
