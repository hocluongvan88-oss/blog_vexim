# BÁO CÁO ĐÁNH GIÁ: CÓ NÊN TÍCH HỢP "AI PLATFORM" VÀO HỆ THỐNG BLOG VEXIM?

> Ngày: 04/10/2026 · Phạm vi khảo sát: toàn bộ repo `blog_vexim` (app/, lib/, components/, scripts/, vercel.json)
>
> Câu hỏi: hệ thống nên tích hợp nền tảng AI với 6 năng lực — (1) phân tích đối thủ, (2) tìm khoảng trống nội dung,
> (3) theo dõi cập nhật FDA/thuế, (4) gợi ý chủ đề có khả năng tạo khách hàng, (5) viết brief & bản nháp,
> (6) kiểm tra cấu trúc SEO — hay không?

---

## 1. KẾT LUẬN NGẮN GỌN

**Không nên tích hợp một nền tảng AI bên ngoài làm xương sống.** Lý do:

1. **3/6 hạng mục đã có sẵn và đang chạy thật trong hệ thống** (theo dõi FDA/thuế, kiểm tra SEO, một phần viết nháp).
   Tích hợp platform ngoài sẽ **trùng lặp** và còn tệ hơn bản đang có ở một số điểm (ví dụ: SEO checker hiện tại
   đã chấm điểm theo *pixel* tiêu đề, phát hiện trùng chủ đề, gắn cảnh báo vào từng khối để "Sửa ngay").
2. **Dữ liệu quyết định nhất lại nằm trong hệ thống này**, không nền tảng ngoài nào thấy được:
   hội thoại chatbot + `service_tag` (khách hỏi gì), hồ sơ FDA/GACC đã làm, `page_views`, danh mục bài viết.
   Đây chính là mỏ vàng để "gợi ý chủ đề tạo khách hàng" — mà lại **chưa ai dùng**.
3. **Hạ tầng AI đã có sẵn** (Groq SDK + AI SDK `generateObject` + zod), nên chi phí biên để thêm 1 năng lực AI
   gần như chỉ là code, không phải hợp đồng thuê bao mới.
4. Chỉ nên **mua/API ngoài cho đúng 1 thứ mà hệ thống không thể tự sinh**: **dữ liệu nhu cầu tìm kiếm**
   (Google Search Console API — miễn phí; hoặc Ahrefs/Semrush API nếu cần volume/keyword difficulty).

**Đề xuất: xây 3 giai đoạn ngay trong hệ thống (~70% hạng mục yêu cầu), chỉ thuê ngoài phần dữ liệu tìm kiếm.**

---

## 2. ĐỐI CHIẾU HIỆN TRẠNG (bằng chứng từ code)

| # | Năng lực bạn yêu cầu | Hiện trạng | Bằng chứng trong repo |
|---|---|---|---|
| 1 | **Phân tích đối thủ** | ❌ **Chưa có gì** | Không có bảng `competitors`, không có scraper đối thủ |
| 2 | **Tìm khoảng trống nội dung** | ⚠️ **Có một phần** | `lib/seo-analysis.ts` có `titleSimilarity()` (chống trùng chủ đề nội bộ) + `suggestQuestions()`; `components/admin/post-sidebar-tools.tsx` gợi ý internal link & FAQ. **Thiếu:** bản đồ chủ đề (topic map) và dữ liệu nhu cầu tìm kiếm |
| 3 | **Theo dõi FDA/thuế** | ✅ **Đã có, khá mạnh** | `lib/news-crawler.ts` (FDA press announcements + China Customs/GACC), `lib/federal-register-crawler.ts` (API Federal Register), AI lọc 3 tầng + chấm `relevanceScore`, bảng `news_articles` + `crawl_logs` (script 033), cron 6h sáng (`vercel.json`), email digest + đăng ký nhận tin (`app/api/fda/subscribe`, `send-digest`), dashboard admin theo nguồn |
| 4 | **Gợi ý chủ đề tạo khách hàng** | ❌ **Chưa có — nhưng DATA ĐÃ SẴN** | Có `conversations` + chatbot `lib/rule-engine.ts` (đã tag `service_tag`, chất lượng lead, handover), `fda_registrations`, `gacc_submissions`, `page_views`, 11 danh mục blog (`lib/blog-categories.ts`) |
| 5 | **Viết brief & bản nháp** | ⚠️ **Có một phần** | `app/api/blog/ai-assistant/route.ts`: improve / shorten / expand / keywords / meta_description / suggest_tags; `components/admin/html-paste-dialog.tsx` (dán nháp từ ChatGPT/Gemini). **Thiếu:** sinh *brief* (dàn ý + câu hỏi + nguồn + từ khoá) và viết bản nháp **trong** hệ thống |
| 6 | **Kiểm tra cấu trúc SEO** | ✅ **Đã có, rất tốt** | `lib/seo-analysis.ts` (điểm SEO kỹ thuật + Answer-readiness, đo pixel tiêu đề, `isQuestionHeading`, phát hiện nguồn chính thống, phát hiện trùng tiêu đề bài cũ), `components/seo-checker.tsx` (sidebar realtime + nút "Sửa ngay" tới từng khối), 24/24 test PASS |

**Tổng kết: 2 hạng mục đã xong, 2 hạng mục đã có 50–70%, 2 hạng mục cần xây mới.**

---

## 3. HAI "ĐIỂM NGHẼN" KỸ THUẬT CẦN XỬ LÝ TRƯỚC

| Vấn đề | Chi tiết | Ảnh hưởng | Cách xử lý |
|---|---|---|---|
| ~~**Embedding đang là mock**~~ ✅ **ĐÃ SỬA** | `lib/ai-service.ts` → nay gọi `lib/embeddings.ts` (Gemini `gemini-embedding-001` miễn phí, hoặc OpenAI `text-embedding-3-small`); `searchKnowledge()` tìm kết hợp ngữ nghĩa (pgvector) + từ khoá, hợp nhất bằng RRF; nút "Nạp embedding cho AI" trong trang Kho tri thức để nạp bù dữ liệu cũ | Trước đây AI không "hiểu" ngữ nghĩa → câu hỏi dùng từ khác với tài liệu là trượt | Đã làm xong: `lib/embeddings.ts`, `scripts/038_add_knowledge_embeddings.sql`, `app/api/knowledge-base/embeddings/route.ts` |
| **`GROQ_API_KEY` chưa có trong `.env` của môi trường này** (chỉ có ZOHO SMTP + `NEXT_PUBLIC_SITE_URL`) | `app/api/blog/ai-assistant/route.ts` trả **500** nếu thiếu key | Mọi tính năng AI mới sẽ chết im lặng | Xác nhận key đã set trên Vercel Production/Preview; thêm cảnh báo rõ trên UI khi thiếu key |
| Crawler dùng `puppeteer-extra` + stealth | Nặng, dễ vượt giới hạn serverless | Cron có thể fail âm thầm | Đã có `cron_job_logs` + trang `/admin/cron-monitor` → cần bật cảnh báo khi job fail 2 ngày liên tiếp |

---

## 4. KIẾN TRÚC ĐỀ XUẤT (tận dụng tối đa cái đang có)

```
                    ┌──────────────────────────────────────────────┐
   NGUỒN DỮ LIỆU     │  ĐÃ CÓ:  FDA · GACC · Federal Register        │
                    │  THÊM:   CBP CSMS (thuế/HTS) · USITC · GSC    │  ← mục 3
                    └───────────────────┬──────────────────────────┘
                                        ▼
                    ┌──────────────────────────────────────────────┐
   TRÍ TUỆ          │  ĐÃ CÓ:  Groq + zod generateObject + AI scoring│
                    │  THÊM:   embedding thật + topic clustering    │
                    └───────────────────┬──────────────────────────┘
                                        ▼
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
┌───────────────┐            ┌──────────────────┐            ┌──────────────────┐
│ TOPIC ENGINE  │            │ LEAD SIGNALS     │            │ BRIEF → DRAFT    │
│ (mục 2 & 1)   │            │ (mục 4)          │            │ (mục 5)          │
│ topic_map     │            │ chatbot tags     │            │ brief generator  │
│ gap vs đối thủ│            │ hồ sơ FDA/GACC   │            │ draft theo brief │
│ + GSC         │            │ page_views       │            │ + SEO gate (mục 6)│
└───────────────┘            └──────────────────┘            └──────────────────┘
                                        ▼
                    ┌──────────────────────────────────────────────┐
                    │ /admin/content-intelligence (1 trang mới)     │
                    │  + nút "Tạo brief" trong /admin/posts/new     │
                    └──────────────────────────────────────────────┘
```

### Bảng dữ liệu mới cần thêm (SQL, chạy trên Supabase)

| Bảng | Cột chính | Dùng cho |
|---|---|---|
| `content_topics` | `id, keyword, cluster, intent, demand_score, difficulty, coverage_status, lead_score, notes` | Bản đồ chủ đề + phát hiện khoảng trống (mục 2, 4) |
| `competitors` | `id, domain, name, rss_url, sitemap_url, is_active` | Danh sách đối thủ (mục 1) |
| `competitor_articles` | `id, competitor_id, url, title, published_at, topics[]` | Bài đối thủ đã viết → so gap (mục 1, 2) |
| `lead_signals` | `id, source ('chatbot'\|'fda'\|'gacc'\|'view'), topic, weight, occurred_at` | Nuôi `lead_score` (mục 4) |
| `post_briefs` | `id, topic_id, outline jsonb, questions text[], sources text[], keywords text[], status` | Brief trước khi viết (mục 5) |
| `search_queries` | `query, impressions, clicks, ctr, position, date` | Đổ từ Google Search Console (mục 2, 4) |

> **Quan trọng:** 4 bảng đầu **không cần API trả phí**. `search_queries` cần GSC API (miễn phí, chỉ cần OAuth).

### API routes mới (theo đúng pattern đang dùng)

| Route | Chức năng | Tái sử dụng |
|---|---|---|
| `POST /api/ai/topics/generate` | Sinh/cập nhật chủ đề + `lead_score` | `requireAdmin()`, Groq, `generateObject` + zod như `news-crawler.ts` |
| `GET /api/ai/gaps` | So khớp `content_topics` ↔ bài đã viết ↔ bài đối thủ | `titleSimilarity()` có sẵn trong `seo-analysis.ts` |
| `POST /api/ai/brief` | Sinh brief (dàn ý + FAQ + nguồn) | `suggestQuestions()`, `getOfficialSources()` có sẵn |
| `POST /api/ai/draft` | Viết nháp từ brief → trả về **blocks** (không phải HTML thô) | `parsedBlocksToBlocks()` trong `lib/content-parsers.ts` |
| `POST /api/cron/competitors` | Crawl RSS/sitemap đối thủ hằng tuần | Mẫu `crawlFederalRegister()` |
| `GET /api/gsc/sync` | Kéo search queries từ GSC | Mới hoàn toàn (OAuth) |

Điểm hay: **brief/draft trả về đúng `Block[]`** mà `BlockEditor` đang dùng → chèn thẳng vào bài, không cần chuyển đổi,
và vẫn qua được `post-payload.ts` để sanitize trước khi lưu.

---

## 5. LỘ TRÌNH ĐỀ XUẤT (theo thứ tự ROI)

### 🟢 Giai đoạn 1 — "Lead-first" (1–2 tuần, ROI cao nhất, không tốn API phí)

1. **Topic Engine từ dữ liệu nội bộ** — gom `service_tag` từ `conversations` + `fda_registrations.category` +
   `gacc_submissions` + top bài theo `page_views` → LLM phân cụm thành chủ đề, cho điểm `lead_score`.
   → Sinh ra câu kiểu: *"37 khách hỏi về 'gia hạn FDA' trong 90 ngày, nhưng blog chỉ có 2 bài về chủ đề này"*.
2. **Trang `/admin/content-intelligence`**: bảng chủ đề (nhu cầu × mức bao phủ × tiềm năng lead),
   nút **"Tạo brief"** và **"Tạo bài nháp"**.
3. **Brief generator** dùng lại `suggestQuestions()` + `getOfficialSources()` + `focus_keyword`.

**Không cần đối thủ, không cần GSC — vẫn ra được danh sách chủ đề đáng viết.**

### 🟡 Giai đoạn 2 — Bịt 2 khoảng trống thật (2–4 tuần)

4. **Nối Google Search Console** (miễn phí): có `impressions/clicks/position` thật →
   phát hiện "có impression nhưng chưa có bài" (khoảng trống nội dung chuẩn xác nhất).
5. **`competitors` + crawl RSS/sitemap** vài đối thủ ngành (logistics, FDA consultant, forwarder) →
   bảng so sánh "đối thủ có bài X, mình chưa có".
6. **Draft generator trong editor**: từ brief → `Block[]` → chèn vào `BlockEditor`, tự chạy `SEOChecker` để chấm ngay.

### 🔵 Giai đoạn 3 — Mở rộng nguồn theo dõi (1–2 tuần)

7. Thêm nguồn **thuế/phí** còn thiếu: **CBP CSMS / HTS (USITC)** cho thuế nhập khẩu & biểu thuế,
   và cổng thông tin thuế–hải quan Việt Nam. Hiện mới có FDA + China Customs + Federal Register.
8. Thêm "cảnh báo theo dõi" cho khách: khi có tin đúng ngành của họ (đã có `fda_subscriptions` + email digest,
   chỉ cần mở rộng theo `service_tag`).
9. ~~Bật **embedding thật + pgvector**~~ ✅ **ĐÃ LÀM** — `lib/embeddings.ts` + `scripts/038_add_knowledge_embeddings.sql` + nút "Nạp embedding cho AI" (Gemini miễn phí hoặc OpenAI). Cần thêm `GEMINI_API_KEY` vào Vercel rồi chạy script 038.

---

## 6. ĐIỀU KHÔNG NÊN LÀM

| Không nên | Vì sao |
|---|---|
| Mua Semrush/Ahrefs/Surfer rồi đồng bộ 2 chiều phức tạp | Chỉ cần **1 API** cho dữ liệu tìm kiếm; phần chấm điểm SEO nội bộ đã tốt hơn nhu cầu và đã nối vào từng khối bài viết |
| Thay `seo-analysis.ts` bằng API SEO ngoài | Đang có **24 test xanh**, chấm theo pixel, gắn lỗi vào khối cụ thể, chạy offline không tốn phí. Thay vào là mất chất lượng |
| Cho AI viết nháp rồi **tự động xuất bản** | Nội dung ngành FDA/GACC sai 1 chữ là rủi ro pháp lý cho khách. Bắt buộc người duyệt (đã có status draft/published) |
| Đổ thẳng HTML từ AI vào `blocks` | Phải đi qua `lib/content-parsers.ts` + `lib/post-payload.ts` để sanitize, tránh `<script>`, link lạ, bảng vỡ |
| Tích hợp "AI agent tự chạy mỗi ngày" không log | Đã có `crawl_logs` + `/admin/cron-monitor`; mọi job AI mới phải ghi log tương tự |

---

## 7. CHI PHÍ ƯỚC TÍNH

| Hạng mục | Chi phí |
|---|---|
| LLM (Groq `llama-3.3-70b` / `gpt-oss`) | ~**$0** ở mức dùng hiện tại; Groq free tier khá rộng. Nếu trả phí: ~$5–20/tháng cho hàng trăm lượt brief/draft |
| Google Search Console API | **Miễn phí** (chỉ cần OAuth + xác minh domain `veximglobal.com`) |
| Embedding thật (tuỳ chọn GĐ3) | ~$0.02/1M token → gần như không đáng kể |
| Supabase | Bảng mới rất nhẹ, nằm trong gói hiện tại |
| **Tổng** | **<$25/tháng**, thay vì $99–500/tháng cho một AI content platform |

---

## 8. TRẢ LỜI TRỰC TIẾP

> **"Có nên tích hợp cái này vào không?"**

- **Với 2 hạng mục đã có (theo dõi FDA, kiểm tra SEO):** KHÔNG tích hợp — đang làm tốt hơn nhu cầu. Chỉ **mở rộng nguồn** (thêm CBP/HTS cho thuế — đây là khoảng trống thật duy nhất của mục 3).
- **Với 2 hạng mục có một phần (khoảng trống nội dung, brief & nháp):** KHÔNG cần platform ngoài, chỉ cần **hoàn thiện trong hệ thống** (Giai đoạn 1 & 2).
- **Với 2 hạng mục chưa có (phân tích đối thủ, gợi ý chủ đề tạo khách hàng):** nên **xây mới**, vì dữ liệu đã nằm sẵn trong hệ thống và không platform ngoài nào truy cập được. Riêng phân tích đối thủ chỉ cần bản tối giản (danh sách đối thủ + RSS/sitemap), không cần công cụ chuyên sâu.
- **Chỉ thuê ngoài đúng 1 thứ:** dữ liệu nhu cầu tìm kiếm (GSC miễn phí là đủ dùng ban đầu).

**Thứ tự nên làm ngay:** Giai đoạn 1 — Topic Engine + trang Content Intelligence + Brief generator.
Đây là phần biến dữ liệu chatbot/hồ sơ khách hàng mà Vexim **đã có sẵn** thành lợi thế cạnh tranh mà đối thủ không sao chép được.
