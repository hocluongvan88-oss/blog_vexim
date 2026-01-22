import { generateObject, generateText } from "ai";
import { z } from "zod";
import * as cheerio from "cheerio";
import { createHash } from "crypto";

// SỬ DỤNG STEALTH PLUGIN ĐỂ BYPASS 412
// Cần cài: npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Kích hoạt Stealth
puppeteer.use(StealthPlugin());

const TIER1_KEYWORDS = [
  "food", "thực phẩm", "import", "export", "xuất khẩu", "nhập khẩu",
  "FDA", "GACC", "MFDS", "regulation", "quy định", "policy", "chính sách",
  "inspection", "kiểm tra", "certificate", "giấy chứng nhận", "registration",
  "đăng ký", "compliance", "seafood", "hải sản", "agricultural", "nông sản",
  "beverage", "đồ uống", "labeling", "nhãn dán", "additive", "phụ gia"
];

const TIER3_VALIDATION_SCHEMA = z.object({
  isRelevant: z.boolean(),
  relevanceScore: z.number().min(0).max(100),
  relevanceReason: z.string(),
  keyPoints: z.array(z.string()),
  affectedProducts: z.array(z.string()),
  impactType: z.enum(["Chính sách mới", "Cảnh báo an toàn", "Thay đổi thủ tục", "Thông tin chung"]),
  requiresConsultancy: z.boolean(),
});

export interface NewsArticle {
  title: string;
  url: string;
  date: string;
  summary: string;
  relevance: "high" | "medium" | "low";
  categories: string[];
  contentHash: string;
  source: "FDA" | "GACC";
  aiAnalysis?: any;
}

export class NewsCrawler {
  private userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

  private generateContentHash(title: string, date: string, url: string): string {
    return createHash("sha256").update(`${title}|${date}|${url}`).digest("hex");
  }

  async crawlFDANews(): Promise<NewsArticle[]> {
    try {
      const response = await fetch("https://www.fda.gov/news-events/fda-newsroom/press-announcements", {
        headers: { "User-Agent": this.userAgent }
      });
      const html = await response.text();
      const $ = cheerio.load(html);
      const results: NewsArticle[] = [];

      $(".node--type-press-announcement").each((_, el) => {
        const title = $(el).find("h2").text().trim();
        const path = $(el).find("a").attr("href");
        const date = $(el).find(".date-display-single").text().trim();
        
        if (title && path) {
          const url = `https://www.fda.gov${path}`;
          results.push({
            title,
            url,
            date,
            summary: "",
            relevance: "low",
            categories: [],
            contentHash: this.generateContentHash(title, date, url),
            source: "FDA"
          });
        }
      });
      return results;
    } catch (error) {
      console.error("Lỗi crawl FDA:", error);
      return [];
    }
  }

  async crawlGACCNews(): Promise<NewsArticle[]> {
    const urls = [
      "http://www.customs.gov.cn/customs/302249/302266/index.html",
      "http://www.customs.gov.cn/customs/302249/2480148/index.html"
    ];
    
    const results: NewsArticle[] = [];
    let browser: any;

    try {
      console.log("[v0] Khởi tạo Stealth Browser để vượt tường lửa GACC...");
      browser = await (puppeteer as any).launch({ 
        headless: "new",
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled', // Xóa dấu vết automation
        ] 
      });

      const page = await browser.newPage();
      
      // Giả lập kích thước màn hình người dùng thật
      await page.setViewport({ width: 1920, height: 1080 });

      for (const url of urls) {
        try {
          console.log(`[v0] Đang truy cập GACC (Stealth Mode): ${url}`);
          
          // Chờ ngẫu nhiên 1-3 giây trước khi load trang để tránh bị phát hiện pattern
          await new Promise(r => setTimeout(r, Math.random() * 2000 + 1000));

          await page.goto(url, { 
            waitUntil: 'networkidle2', 
            timeout: 60000 
          });

          // Lấy nội dung sau khi đã vượt qua JS Challenge
          const html = await page.content();
          const $ = cheerio.load(html);

          const pageArticles: NewsArticle[] = [];
          $(".article-list li, .conList_link li, .newsList li").each((_, el) => {
            const a = $(el).find("a").first();
            const title = a.text().trim();
            const href = a.attr("href");
            const date = $(el).find("span, .date").text().trim();

            if (title && href && title.length > 5) {
              const fullUrl = href.startsWith("http") ? href : `http://www.customs.gov.cn${href}`;
              pageArticles.push({
                title,
                url: fullUrl,
                date: date || new Date().toISOString().split('T')[0],
                summary: "",
                relevance: "low",
                categories: [],
                contentHash: this.generateContentHash(title, date, fullUrl),
                source: "GACC"
              });
            }
          });

          console.log(`[v0] Thành công! Lấy được ${pageArticles.length} tin từ ${url}`);
          results.push(...pageArticles);

        } catch (err) {
          console.error(`[v0] Giao diện GACC ${url} vẫn chặn hoặc timeout:`, err.message);
        }
      }
    } catch (error) {
      console.error("Lỗi nghiêm trọng hệ thống Puppeteer Stealth:", error);
    } finally {
      if (browser) await browser.close();
    }
    
    return results;
  }

  // --- AI LAYERS ---

  private async tier2Analysis(article: NewsArticle): Promise<{ relevance: "high"|"medium"|"low", categories: string[] }> {
    try {
      const { text } = await generateText({
        model: "openai/gpt-4o",
        system: "Chuyên gia pháp lý Vexim Global. Phân loại tin GACC/FDA.",
        prompt: `Phân tích: "${article.title}". Trả về JSON {"relevance": "high|medium|low", "categories": []}.`
      });
      return JSON.parse(text);
    } catch {
      return { relevance: "low", categories: [] };
    }
  }

  private async tier3Validation(article: NewsArticle, fullContent: string) {
    try {
      const { object } = await generateObject({
        model: "openai/gpt-4o",
        schema: TIER3_VALIDATION_SCHEMA,
        prompt: `Phân tích bài viết từ ${article.source}: ${fullContent.substring(0, 4000)}`
      });
      return object;
    } catch {
      return null;
    }
  }

  // --- WORKFLOW ---

  async process() {
    const rawArticles = [
      ...(await this.crawlFDANews()),
      ...(await this.crawlGACCNews())
    ];

    const finalResults: NewsArticle[] = [];

    for (const article of rawArticles) {
      // Tier 1
      const text = (article.title).toLowerCase();
      if (!TIER1_KEYWORDS.some(kw => text.includes(kw.toLowerCase()))) continue;

      // Tier 2
      const t2 = await this.tier2Analysis(article);
      if (t2.relevance === "low") continue;

      // Tier 3
      const content = await this.fetchFullContent(article.url, article.source);
      const t3 = await this.tier3Validation(article, content);

      if (t3?.isRelevant) {
        finalResults.push({
          ...article,
          relevance: t2.relevance,
          categories: t2.categories,
          summary: t3.keyPoints.join(". "),
          aiAnalysis: t3
        });
      }
    }
    return finalResults;
  }

  private async fetchFullContent(url: string, source: string): Promise<string> {
    if (source === "GACC") {
      let browser;
      try {
        browser = await (puppeteer as any).launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
        const html = await page.content();
        await browser.close();
        const $ = cheerio.load(html);
        return $(".article-content, #content, .content").text().trim();
      } catch {
        if (browser) await browser.close();
        return "";
      }
    }
    // FDA fetch
    const res = await fetch(url, { headers: { "User-Agent": this.userAgent } });
    const html = await res.text();
    return cheerio.load(html)("article").text().trim();
  }
}
