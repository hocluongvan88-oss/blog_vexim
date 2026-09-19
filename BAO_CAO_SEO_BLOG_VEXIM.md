# BÁO CÁO SEO — MODULE VIẾT BLOG VEXIM GLOBAL

**Ngày:** 18/09/2026 · **Phạm vi:** `components/seo-checker.tsx`, `app/blog/*`, `app/sitemap.ts`, `app/robots.ts`, metadata toàn site, `lib/blocks-to-html.tsx`, editor.
**Câu hỏi cần trả lời:**
1. Tính năng SEO hiện tại có chuẩn so với thuật toán Google hiện nay không?
2. Có nội dung trực quan nào giúp writer biết cần bổ sung gì vào bài không?

> File mockup trực quan đi kèm: **`mockups/seo-panel-cho-writer.html`** (mở trực tiếp trong trình duyệt).
>
> **Cập nhật 18/09/2026:** các hạng mục **P1 + P2** trong báo cáo này **đã được triển khai vào mã nguồn** (E-E-A-T theo hướng cấp tổ chức, không cần migration DB). Chi tiết từng việc, file đã sửa và kết quả kiểm chứng ở **mục 8**.

---

## 1. Trả lời ngắn (TL;DR)

| Khu vực | Đánh giá | Nhận xét |
|---|---|---|
| **Kỹ thuật on-page** (canonical, JSON-LD, breadcrumb, sitemap, robots, OG/Twitter, alt ảnh) | 🟢 **~75% đạt chuẩn** | Nền tảng khá tốt, có nhiều thứ nhiều site Việt Nam còn thiếu. |
| **"SEO checker" trong trình soạn thảo** | 🟠 **Lệch chuẩn một phần** | Chấm điểm theo 3 quan niệm đã bị Google phủ nhận (mật độ từ khóa, mốc 300 từ, meta keywords) và **thiếu hẳn** nhóm tín hiệu Google dùng từ 2024–2026. |
| **Nội dung trực quan cho writer** | 🔴 **Rất thiếu** | Chỉ có 1 khối "Phân tích SEO" ở sidebar phải + 1 cảnh báo alt trong khối ảnh. Không có gợi ý tại chỗ (inline), không có khung bài mẫu, không gợi ý FAQ/nguồn/liên kết nội bộ, không kiểm tra ảnh bìa, không nhắc cập nhật bài cũ. |
| **Tín hiệu E-E-A-T / YMYL** | 🔴 **Thiếu hoàn toàn** | Blog tư vấn FDA/GACC/MFDS là chủ đề ảnh hưởng quyết định kinh doanh → Google xếp vào nhóm cần bằng chứng chuyên môn. Hiện không có tác giả, không có người kiểm duyệt, không có nguồn trích dẫn. |
| **Tối ưu cho AI Overviews / AI Mode** | 🟠 **Chưa có gì** | Không kiểm tra "trả lời trực tiếp trong 40–80 từ đầu mỗi mục", không có block FAQ/nguồn, không gợi ý bảng/danh sách bước. |

**3 lỗi kỹ thuật đang âm thầm mất điểm** (không phải quan điểm, là lỗi thật trong mã nguồn):
1. `public/og-image.jpg` **không tồn tại** nhưng `app/layout.tsx:60` trỏ tới → ảnh chia sẻ mặc định 404 trên toàn site.
2. `public/logo.png` **không tồn tại** nhưng JSON-LD `publisher.logo` trỏ tới (`app/blog/[slug]/page.tsx:169`) → Structured data sai (Google yêu cầu logo crawl được).
3. Đổi slug bài viết **không có redirect 301** → mất toàn bộ tín hiệu của URL cũ (UI chỉ cảnh báo suông).

---

## 2. Đối chiếu chi tiết với hướng dẫn Google (cập nhật 09/2026)

Chú thích: ✅ đạt · 🟡 đạt một phần / lệch nhẹ · 🔴 thiếu hoặc sai.

### Nhóm A — Kỹ thuật on-page

| # | Tiêu chí | Trạng thái | Thực tế trong mã nguồn |
|---|---|---|---|
| A1 | Mỗi bài có `<title>` riêng | ✅ | `generateMetadata()` dùng `meta_title \|\| title`. |
| A2 | Title đúng độ dài hiển thị | 🟡 | Checker cảnh báo theo **ký tự** 30–60 (`seo-checker.tsx:53-61`). Google đo bằng **pixel** (~600px desktop, mobile cắt sớm hơn) và **không có giới hạn ký tự cứng**; Google còn có thể thay title nếu H1/nội dung mô tả khác đi. |
| A3 | H1 khớp với title | 🟡 | H1 = `post.title`; meta title có thể khác H1 → dễ bị Google viết lại tiêu đề. Không có cảnh báo nào cho việc này. |
| A4 | Meta description | 🟡 | Có, nhưng cắt bằng `substring(0,157) + "..."` (`[slug]/page.tsx:57-60`) → có thể cắt giữa từ. Checker chấm điểm theo 120–160 ký tự; Google khẳng định meta description **không phải yếu tố xếp hạng**, chỉ ảnh hưởng CTR và Google tự viết lại ~65% trường hợp. |
| A5 | Thẻ `<meta name="keywords">` | 🔴 | Vẫn được render (`app/layout.tsx:29`, `app/blog/page.tsx:19`, category page, và `[slug]/page.tsx:74` đưa `focus_keyword` vào). Google **bỏ qua thẻ này từ 2009** → chỉ làm lộ danh sách từ khóa cho đối thủ, không có lợi ích. |
| A6 | Canonical | ✅ | Có cho bài, danh sách blog, trang danh mục. |
| A7 | Cấu trúc heading | 🟡 | Editor chỉ cho H2–H4 (tốt, tránh nhiều H1), nhưng checker chỉ **đếm** H2/H3, không kiểm tra thứ bậc (H2 → H4 nhảy cấp), không kiểm tra heading quá dài, không kiểm tra heading dạng câu hỏi. |
| A8 | Anchor cho heading (jump link) | 🔴 | `blocksToHTML()` không sinh `id` cho heading; `BlogTableOfContents` phải gán `heading-N` bằng JS sau 100ms (`blog-table-of-contents.tsx:33-39`). Hệ quả: không có anchor cố định trong HTML gốc (không share được "link tới mục", AI/Google khó trích dẫn theo đoạn). |
| A9 | Ảnh: alt / caption | ✅ (đã sửa) | `blocks-to-html.tsx` dùng đúng `alt`, escape attribute; checker cảnh báo ảnh thiếu alt. |
| A10 | Ảnh bìa đủ chuẩn Discover | 🔴 | Không kiểm tra kích thước khi upload (`image-uploader.tsx` chỉ chặn 5MB). Google Discover yêu cầu ảnh **≥1200px** ngang, >300.000 pixel tổng, tỷ lệ 16:9. Metadata còn hardcode `width=1200 height=630` bất kể ảnh thật. |
| A11 | OG/Twitter image | 🔴 | `/og-image.jpg` **không tồn tại** trong `public/`. Bài **không có ảnh bìa** thì metadata đặt `images: []` → khả năng cao mất `og:image` (Next merge field-level). |
| A12 | JSON-LD `BlogPosting` | 🟡 | Có headline/description/image/datePublished/dateModified/author/publisher/mainEntityOfPage. Thiếu: `@id`, `inLanguage`, `articleSection`, `keywords`, `wordCount`, `isAccessibleForFree`; `author` là Organization **không có URL**; `publisher.logo` trỏ file không tồn tại (A11 nói trên). |
| A13 | Breadcrumb | 🟡 | Có cả hiển thị và schema, nhưng schema `[slug]` chỉ có 3 cấp *Trang chủ › Blog › Bài* — **thiếu cấp danh mục** (URL đang là `/blog/<slug>`, menu danh mục là đường dẫn chính). |
| A14 | Sitemap | 🟡 | Có bài + category + trang tĩnh. Nhưng `lastModified: new Date()` cho trang tĩnh/danh mục → mỗi lần generate lại báo "vừa sửa" (nhiễu); `priority`/`changeFrequency` **đã bị Google bỏ qua**; không khai báo ảnh. |
| A15 | robots.txt | ✅ | Allow `/`, disallow `/admin/`, `/api/`, có trỏ sitemap. |
| A16 | `max-image-preview:large` | ✅ | Có trong `app/layout.tsx:46` → không bị chặn khả năng hiện ảnh lớn ở Discover. |
| A17 | Ngôn ngữ | ✅ | `<html lang="vi">`, một ngôn ngữ nên không cần hreflang. |
| A18 | `<time datetime>` + ngày cập nhật | 🔴 | Trang bài chỉ in `<span>{formatDate(post.published_at)}</span>`, **không hiển thị "Cập nhật lần cuối"** dù `updated_at` có trong schema. Google dùng độ mới thực tế; người đọc cũng cần biết bài còn đúng không. |

### Nhóm B — Nội dung & khả năng được trích dẫn (AI Overviews / AI Mode)

| # | Tiêu chí | Trạng thái | Thực tế |
|---|---|---|---|
| B1 | **Answer-first** (câu trả lời trực tiếp 40–80 từ ở đầu mỗi mục) | 🔴 | Không có kiểm tra nào. Đây là yếu tố quan trọng nhất để được AI Overview trích dẫn — theo các nghiên cứu 2026, **khoảng 44–55% trích dẫn được lấy từ 30% nội dung đầu trang**. |
| B2 | Bảng so sánh / danh sách bước | 🟡 | Editor có block table/list, parser markdown hỗ trợ bảng — nhưng checker **không nhắc** writer dùng chúng ở các mục phù hợp. |
| B3 | Khối FAQ / Q&A | 🔴 | Không có block FAQ, không gợi ý câu hỏi. (Lưu ý: Google **đã khai tử FAQ rich result từ 07/05/2026 cho mọi site** — không nên hứa "rich snippet"; nhưng Q&A dạng chữ vẫn giúp trích dẫn và trả lời truy vấn dài.) |
| B4 | Nguồn trích dẫn | 🔴 | Không có trường nguồn. Checker chỉ **đếm** link ngoài, không phân biệt nguồn chính thống (FDA, GACC, MFDS, công báo) với nguồn tham khảo chung. Với nội dung tuân thủ, đây là điểm yếu lớn nhất về độ tin cậy. |
| B5 | Số liệu + nguồn + hàm ý | 🔴 | Không có gợi ý dạng "stat + source + implication" — mẫu câu được AI trích dẫn nhiều nhất. |
| B6 | Độ mới (freshness) | 🟡 | Có `dateModified` trong schema/OG, nhưng không hiện cho người đọc, không nhắc writer cập nhật bài cũ, và `post-preview-dialog.tsx` còn hardcode "Ngày xuất bản: hôm nay" (ảo giác về thời gian). |
| B7 | Chống trùng lặp / cannibalization | 🔴 | Không kiểm tra trùng tiêu đề / focus keyword với bài đã có trong DB. Khi dùng AI viết hàng loạt, rủi ro 2–3 bài cùng chủ đề ("scaled content abuse" + tự cạnh tranh từ khóa). |
| B8 | Độ dài nội dung | 🟡 | Checker đặt mốc "nên ≥300 từ" và trừ điểm khi <100 từ. Google khẳng định **số từ không phải yếu tố xếp hạng** — nên đổi thành "độ sâu chủ đề" (đủ ý, ví dụ, số liệu, FAQ) thay vì đếm từ. |
| B9 | Mật độ từ khóa | 🔴 | Checker cho điểm theo 0.5–2% và cảnh báo "có thể bị coi là spam" khi >3% (`seo-checker.tsx:241-249`). Google: **không có mật độ vàng**, không dùng mật độ làm tín hiệu; chỉ nhồi nhét mới bị phạt. → Nên chuyển sang kiểm tra **vị trí** (title, H1, 100 từ đầu, 1–2 H2, alt) + **thực thể liên quan** (semantic coverage). |

### Nhóm C — E-E-A-T & YMYL

| # | Tiêu chí | Trạng thái | Thực tế |
|---|---|---|---|
| C1 | Tác giả là người thật, có hồ sơ | 🔴 | Bảng `posts` **không có cột tác giả** (`scripts/001_create_posts_table.sql`); trang in cứng "Vexim Global"; schema `author` = Organization. Google (bản cập nhật hướng dẫn 10/12/2025) hỏi rõ *ai tạo nội dung, tạo thế nào, vì sao* — blog tuân thủ FDA/GACC là chủ đề cần bằng chứng chuyên môn. |
| C2 | Người kiểm duyệt chuyên môn (reviewed-by) | 🔴 | Không có. Với nội dung ảnh hưởng quyết định kinh doanh/an toàn thực phẩm, đây là tín hiệu tin cậy mạnh nhất còn thiếu. |
| C3 | Minh bạch quy trình AI | 🟡 | Có AI Writing Assistant viết/thêm nội dung, không có ghi chú biên tập/kiểm duyệt. Google **không yêu cầu** công bố dùng AI, nhưng nên có bước "người duyệt nội dung AI" như một phần của quality gate. |
| C4 | Trang tác giả / tổ chức có `sameAs` | 🔴 | Chưa rà được (ngoài module blog), nhưng schema hiện tại không có `sameAs` (LinkedIn, Facebook, hồ sơ pháp lý) → khó xác thực thực thể. |

### Nhóm D — Liên kết nội bộ & cấu trúc site

| # | Tiêu chí | Trạng thái | Thực tế |
|---|---|---|---|
| D1 | Chèn liên kết nội bộ ngay khi viết | ✅ | Inline toolbar có ô tìm bài để chèn link (`inline-toolbar.tsx:190-215` → `/api/blog/search`). |
| D2 | Gợi ý link nội bộ theo chủ đề | 🟡 | `BlogInternalLinks` hard-code map danh mục → dịch vụ (trùng lặp với `relatedService` trong `lib/blog-categories.ts`); không gợi ý **bài viết liên quan** khi đang viết. |
| D3 | Phát hiện bài mồ côi | 🔴 | Không có. |
| D4 | Chất lượng anchor text | 🟡 | Card/list dùng "Đọc thêm" lặp lại; Google dùng anchor text như tín hiệu mô tả đích → nên dùng anchor mô tả chủ đề. |
| D5 | Phân trang danh sách | 🔴 | `/blog` lấy 60 bài mới nhất, **không phân trang** (`app/blog/page.tsx:49`) → bài cũ hơn chỉ vào được bằng sitemap/category; trang category lại **không giới hạn** (tải toàn bộ). |
| D6 | Slug đổi → 301 | 🔴 | Không có bảng lịch sử slug/redirect. Đổi slug = URL cũ 404 = mất tín hiệu + mất backlink. |
| D7 | Hiệu năng truy vấn bài chi tiết | 🟡 | `generateMetadata()` và page đều `select("*")` → **2 truy vấn nặng/1 lượt xem**, kéo cả cột `content`. |

### Nhóm E — Trải nghiệm người dùng / Core Web Vitals

Ngưỡng "tốt" hiện hành: **LCP ≤ 2,5s · INP ≤ 200ms · CLS ≤ 0,1** (đo ở bách phân vị 75, tách mobile/desktop). Trên toàn web chỉ ~56% origin đạt cả 3 (CrUX 05/2026).

| # | Rủi ro | Trạng thái | Thực tế |
|---|---|---|---|
| E1 | LCP | 🟠 | `next.config.mjs` đặt `images.unoptimized: true` + dùng `<img>` thô, không `srcset` → mobile tải ảnh gốc (thường >1MB). Ảnh bìa có `width/height` (tốt cho CLS) nhưng không tối ưu dung lượng. |
| E2 | CLS | 🟠 | Ảnh **trong nội dung** do `blocksToHTML()` sinh không có `width/height` → nội dung nhảy khi ảnh tải xong. |
| E3 | INP (admin) | 🟠 | `seo-checker.tsx:253` chạy lại **mỗi lần gõ phím** (deps gồm `content`, `blocks`) và tính toán khá nặng (regex toàn bài + `JSON.stringify` gián tiếp) → gõ bài dài sẽ giật. |
| E4 | JS trang bài viết | 🟡 | `BlogSidebar` là client component có `framer-motion`; TOC/ViewTracker/share là client → tăng JS. Chưa có bằng chứng định lượng nhưng nên đo bằng PageSpeed thực tế. |
| E5 | Trang quản trị | ✅ | Không ảnh hưởng SEO công khai (noindex qua robots + layout admin). |

### Nhóm F — Đo lường

| # | Tiêu chí | Trạng thái | Thực tế |
|---|---|---|---|
| F1 | Đo lượt xem | ✅ | `ViewTracker` → `/api/analytics/track-view`. |
| F2 | Dữ liệu Search Console cho writer | 🔴 | Không có. Writer không biết bài nào đang có impression/CTR/truy vấn nào, không biết bài nào tụt hạng để cập nhật. |
| F3 | Theo dõi trích dẫn AI | 🔴 | Không có (tuỳ chọn nâng cao). |
| F4 | Lưu điểm SEO theo thời điểm | 🔴 | Điểm SEO chỉ tính ở client, không lưu → không so sánh trước/sau. |

---

## 3. Ba nhóm vấn đề gốc rễ

### 3.1 Checker đang "chấm điểm theo SEO 2015"
Ba tiêu chí nặng nhất trong thang điểm — **mật độ từ khóa**, **mốc 300 từ**, **meta keywords** — đều đã bị Google phủ nhận công khai. Ngược lại, thang điểm **không có** tiêu chí nào cho: câu trả lời trực tiếp, nguồn trích dẫn, tác giả/kiểm duyệt, số liệu, FAQ, độ mới, trùng lặp chủ đề.

Hệ quả thực tế: writer có thể đạt **100/100** với một bài 2.000 từ nhồi từ khóa, không nguồn, không tác giả, không trả lời trực tiếp — và **0 điểm** với một bài 600 từ súc tích, có số liệu FDA dẫn nguồn, có tác giả chuyên môn. Đây là kiểu hướng dẫn đang bị Google xử lý kém nhất ("scaled content abuse", "little original value").

### 3.2 Không có tín hiệu E-E-A-T — rủi ro cao nhất với ngách này
Nội dung FDA/GACC/MFDS quyết định việc doanh nghiệp có xuất được hàng hay không → Google xếp vào nhóm cần độ tin cậy cao. Hiện tại: không tác giả, không chức danh, không người kiểm duyệt, không nguồn, không ngày cập nhật hiển thị. Đây là việc **rẻ hơn nhiều** so với viết thêm 50 bài, và tác động trực tiếp tới cả Search lẫn AI Overviews.

### 3.3 "Trực quan cho writer" gần như bằng không
Hiện chỉ có: một khối điểm ở sidebar phải (phải cuộn xuống mới thấy, điểm nhảy theo từng ký tự) + một chữ đỏ dưới ô alt trong khối ảnh + chữ đỏ dưới ô alt của ảnh bìa. Không có hướng dẫn nào xuất hiện **tại đúng chỗ cần sửa**, không có gợi ý cụ thể (thêm gì, viết gì), không có mẫu khung bài.

---

## 4. "Nội dung trực quan cho writer": hiện có gì / cần gì

| Việc writer cần được nhắc | Hiện tại | Đề xuất (trực quan) |
|---|---|---|
| Tiêu đề dài/ngắn ra sao trên Google | Cảnh báo theo ký tự | **Thước pixel** + preview SERP desktop/mobile ngay trên ô tiêu đề |
| Đoạn đầu có trả lời thẳng câu hỏi không | ❌ | **Badge "Answer-first"** ngay trên khối đoạn văn: xanh khi 40–80 từ & trả lời trực tiếp, vàng khi dài dòng, đỏ khi mở bài chung chung |
| Mục này nên là H2 dạng câu hỏi | ❌ | Gợi ý "Biến thành câu hỏi" + đếm số H2 đang là câu hỏi |
| Chỗ này nên có bảng/danh sách bước | ❌ | Gợi ý ngữ cảnh: thấy ≥3 mục liệt kê trong đoạn → "Chuyển thành danh sách/bảng" (1 click) |
| Ảnh bìa có đủ chuẩn Discover | ❌ | Đo kích thước ngay khi upload, cảnh báo "900px < 1200px", nút nén/đổi ảnh |
| Ảnh trong bài thiếu alt | Chỉ hiện khi mở khối ảnh | **Badge đỏ trên khối ảnh** + danh sách "3 ảnh chưa có alt" bấm tới đúng khối |
| Cần nguồn chính thống nào | ❌ | Panel "Nguồn tham khảo": gợi ý link FDA/GACC/MFDS theo danh mục, chèn nhanh dạng "Theo FDA (link)…" |
| Câu hỏi người đọc hay hỏi | ❌ | Panel "Câu hỏi nên trả lời" (gợi ý theo focus keyword) + nút "Thêm H2 + trả lời" hoặc tạo khối FAQ |
| Nên link nội bộ tới đâu | Chỉ có ô tìm kiếm | Panel **3 bài liên quan + anchor text gợi ý** + nút "Chèn link" |
| Bài này có trùng chủ đề bài cũ | ❌ | Cảnh báo ngay khi nhập tiêu đề: "Trùng 78% với bài … (đã có)" + nút xem/merge |
| Bài đã cũ, cần cập nhật | ❌ | Badge trên danh sách bài viết: "8 tháng chưa cập nhật", "có 12 link hỏng" |
| Đổi slug có làm mất URL cũ | Cảnh báo suông | Tự động ghi lịch sử slug + tạo 301, hiện "URL cũ sẽ chuyển hướng →" |
| Bao nhiêu % khả năng được AI trích dẫn | ❌ | **Điểm "Answer-readiness"** riêng, tách khỏi điểm SEO kỹ thuật |
| Toàn bộ việc cần làm | 1 danh sách phẳng 15–20 dòng, phân nhóm rối | **3 nhóm ưu tiên**: Bắt buộc / Nên có / Tốt hơn nữa, mỗi dòng có nút **"Sửa ngay"** nhảy tới đúng khối |

---

## 5. Đề xuất UI (đã dựng mockup)

📄 **`mockups/seo-panel-cho-writer.html`** — mockup tĩnh mô tả bố cục đề xuất, gồm:

**Cột trái — Editor với badge tại chỗ (inline):**
- Khối đoạn văn: chip 🟡 *"Mở bài 210 từ mới vào ý — nên trả lời trực tiếp trong 40–80 từ"*
- Khối danh sách: chip 🔵 *"Có thể chuyển thành bảng so sánh"*
- Khối ảnh: chip 🔴 *"Ảnh này thiếu alt (SEO + accessibility)"* — bấm để nhảy đến ô alt
- Khối heading: chip 🔵 *"Mục này chưa có câu trả lời trực tiếp trong 2 câu đầu"*

**Cột phải — 2 điểm số tách biệt + 5 widget hành động:**
1. **SEO kỹ thuật 92/100** và **Answer-readiness 46/100** (hai thang riêng, có thanh tiến trình + màu).
2. **Việc cần làm** theo 3 tab ưu tiên, mỗi dòng có nút "Sửa ngay".
3. **Preview SERP** desktop ≈600px + mobile, dùng **slug thật**, có chỉ báo "title bị cắt ở 578px".
4. **Câu hỏi nên trả lời** (gợi ý theo từ khóa) → 1 click tạo H2 + khối trả lời/FAQ.
5. **Liên kết nội bộ gợi ý** (3 bài + anchor text đề xuất) → 1 click chèn.
6. **Nguồn & kiểm duyệt**: chọn nguồn chính thống, gán người kiểm duyệt, hiện "Cập nhật lần cuối".
7. **Ảnh bìa**: cảnh báo 900×506 < 1200px (Discover) + nút nén/tối ưu.

---

## 6. Lộ trình triển khai đề xuất

### P1 — Sửa sai & bịt lỗ (nửa ngày, tác động ngay)
| Việc | File |
|---|---|
| Thêm `public/og-image.jpg` + sửa `logo` trong JSON-LD (dùng `icon-512.png` hoặc file thật) | `public/`, `app/layout.tsx`, `app/blog/[slug]/page.tsx` |
| Bỏ `<meta name="keywords">` (bỏ `keywords` khỏi metadata các trang blog) | `app/layout.tsx`, `app/blog/page.tsx`, category page, `[slug]/page.tsx` |
| Hiển thị **"Cập nhật lần cuối"** + `<time datetime>` | `app/blog/[slug]/page.tsx` |
| Sinh `id` cho heading trong `blocksToHTML()` (slug hóa, không trùng) để TOC/anchor nằm trong HTML gốc | `lib/blocks-to-html.tsx`, `blog-table-of-contents.tsx` |
| Bổ sung `inLanguage`, `articleSection`, `wordCount`, `keywords`, `@id` vào BlogPosting; thêm cấp danh mục vào breadcrumb schema | `app/blog/[slug]/page.tsx` |
| Bỏ `select("*")` ở `generateMetadata` + page (dùng `POST_DETAIL_COLUMNS`) | `app/blog/[slug]/page.tsx` |
| Thêm `width/height` cho ảnh trong nội dung (chống CLS) | `lib/blocks-to-html.tsx` |

### P2 — Rework SEO checker theo chuẩn hiện hành (1–2 ngày)
| Việc | Chi tiết |
|---|---|
| Bỏ "mật độ từ khóa" khỏi thang điểm | Thay bằng **keyword placement** (title/H1/100 từ đầu/1–2 H2/alt) + cảnh báo nhồi nhét khi lặp bất thường |
| Bỏ mốc "300 từ" | Thay bằng **độ sâu chủ đề**: số H2, có ví dụ/số liệu/bảng, có FAQ, có nguồn |
| Tách 2 điểm | **SEO kỹ thuật** (bắt buộc/nên có) và **Answer-readiness** (cho AI Overviews) |
| Checks mới | answer-first 40–80 từ đầu mỗi H2; H2 dạng câu hỏi; có nguồn chính thống; có ≥1 bảng/danh sách bước; trùng tiêu đề/focus keyword với bài cũ; ảnh bìa ≥1200px; độ mới (>6 tháng → nhắc cập nhật) |
| Debounce + tách nhóm | Tính lại sau 400ms khi ngừng gõ, chỉ hiện việc cần làm (không hiện "success" tràn lan) |

### P3 — Trực quan hóa & E-E-A-T (3–5 ngày, cần migration DB)
| Việc | Chi tiết |
|---|---|
| Migration `posts`: `author_id`/`author_name`, `reviewer_name`, `reviewer_title`, `sources JSONB`, `last_reviewed_at`, `slug_history TEXT[]` | `scripts/0xx_add_blog_eeat.sql` |
| UI: khối "Tác giả & kiểm duyệt", bảng chọn người, ngày kiểm duyệt 
| UI: panel "Nguồn tham khảo" + render khối "Nguồn & tham chiếu" cuối bài 
| UI: badge inline trong editor (answer-first, alt, bảng/danh sách, FAQ) + nút "Sửa ngay" 
| UI: panel "Câu hỏi nên trả lời" + "Liên kết nội bộ gợi ý" (dùng `focus_keyword` + category để truy vấn bài liên quan) 
| 301 redirect khi đổi slug: `slug_history` + bảng `post_redirects` (hoặc middleware tra cứu) 
| Ảnh: kiểm tra ≥1200px khi upload, gợi ý nén; bật lại tối ưu ảnh (`images.unoptimized: false` hoặc tự host ảnh WebP) 
| Phân trang `/blog` (URL crawl được) + giới hạn trang category 
| (Tuỳ chọn) Dashboard Search Console API: impression/CTR/query theo bài, cảnh báo bài tụt hạng 

---

## 7. Những gì đang làm tốt — giữ nguyên

- JSON-LD `BlogPosting` + `BreadcrumbList` + `CollectionPage` cho trang danh mục; có OG/Twitter card, canonical, `lang="vi"`.
- `max-image-preview:large` + `max-snippet:-1` (đúng hướng Discover).
- Sitemap động có bài + danh mục; robots disallow `/admin`, `/api`.
- Trang danh mục có tiêu đề/mô tả/keywords riêng (đã gom về `lib/blog-categories.ts`) — tránh "thin category page".
- Editor hỗ trợ block bảng/danh sách/ảnh có alt-caption, parser markdown/HTML giữ định dạng — nền tảng rất tốt để dạy writer viết theo cấu trúc dễ được trích dẫn.
- Có TOC, thời gian đọc, breadcrumb hiển thị, liên kết dịch vụ liên quan, bài liên quan, chia sẻ, đếm lượt xem.
- Ảnh bìa có `width/height` + `loading="eager"` (tốt cho LCP/CLS).

---

## 8. Trạng thái triển khai (cập nhật 18/09/2026)

Phạm vi đã chốt với chủ dự án: **P1 + P2**, E-E-A-T theo hướng **cấp tổ chức (org_only)** — không thêm bảng tác giả, không migration DB.

### P1 — Đã hoàn tất

| Việc | File | Kết quả |
|---|---|---|
| Tạo 2 ảnh còn thiếu | `public/og-image.jpg` (1200×630, JPEG), `public/logo.png` (512×512) | Hết lỗi 404 ở thẻ OG và ở `Organization.logo` |
| Bỏ `<meta name="keywords">` | `app/layout.tsx`, `app/blog/page.tsx`, `app/blog/category/[category]/page.tsx`, `app/blog/[slug]/page.tsx` | Không còn xuất thẻ vô nghĩa với Google, không lộ danh sách từ khóa |
| "Cập nhật lần cuối" + `<time datetime>` | `app/blog/[slug]/page.tsx` | Chỉ hiện khi `updated_at` lệch `published_at` hơn 1 ngày (tránh nhiễu) |
| Sinh `id` cho heading ngay trên server | `lib/heading-anchors.ts` (mới), `lib/blocks-to-html.tsx`, `components/blog-table-of-contents.tsx`, `app/blog/[slug]/page.tsx` | Mục lục dùng đúng id thật trong HTML; bỏ hack `setTimeout(100)` + `heading-N`; bài lưu dạng HTML thô cũng được bù id |
| Mở rộng `BlogPosting` | `app/blog/[slug]/page.tsx` | Thêm `@id`, `alternativeHeadline`, `inLanguage`, `articleSection`, `keywords`, `wordCount`, `isAccessibleForFree`; breadcrumb lên 4 cấp (có danh mục) |
| Thay `select("*")` | `app/blog/[slug]/page.tsx` (2 chỗ) | Dùng `POST_DETAIL_COLUMNS` |
| `width`/`height` cho ảnh trong bài (chống CLS) | `components/block-editor/blocks/image-block.tsx`, `components/block-editor/types.ts`, `lib/post-payload.ts`, `lib/blocks-to-html.tsx` | Kích thước thật được đo ngay khi chèn ảnh, lưu vào block rồi render thành thuộc tính |
| `FAQPage` sinh tự động | `app/blog/[slug]/page.tsx` | Trích các H2/H3 dạng câu hỏi + đoạn trả lời (tối thiểu 2 cặp). **Không hứa rich result** — Google khai tử FAQ rich result từ 07/05/2026, dữ liệu chỉ dùng để máy hiểu trang |
| Đồ thị thực thể toàn site | `app/layout.tsx`, `app/page.tsx` | `Organization` + `WebSite` có `@id` cố định đặt ở layout (mọi trang đều có), nhờ đó `publisher.@id` của BlogPosting phân giải được; bỏ `SearchAction` (sitelinks search box đã bị Google khai tử, site cũng không có endpoint `?search=`) |
| Sitemap chính xác | `app/sitemap.ts`, `lib/site-routes.ts` (mới) | Bỏ `lastModified: new Date()` giả; `lastModified` chỉ đặt khi đo được (bài viết, danh mục). Bổ sung **24 route công khai** còn thiếu (toàn bộ `/services/food/*`, `/services/cosmetics/*`, `/services/gacc/assessment`, `/services/fsvp`, `/services/fda-label-check`, `/services/llc-ein`, `/fda-tracker`) |
| Khu vực đăng nhập không bị index | `app/robots.ts`, `app/client-portal/layout.tsx` | `Disallow: /client-portal/` + `noindex` cho trang portal |
| Ưu tiên LCP cho ảnh bìa | `app/blog/[slug]/page.tsx` | `fetchPriority="high"` + alt lấy từ `featured_image_alt` đã nhập (trước đây bỏ qua trường này) |
| Cảnh báo ảnh nhỏ khi upload | `components/image-uploader.tsx`, `components/block-editor/blocks/image-block.tsx` | Hiện kích thước thật + cảnh báo khi <1200px (chuẩn thẻ lớn Google Discover) |
| Cảnh báo đổi slug bài đã đăng | `app/admin/(dashboard)/posts/[id]/edit/page.tsx` | Nói rõ địa chỉ cũ sẽ 404 và hướng dẫn tạo 301 ở hosting/CDN (đây là cách xử lý **không cần migration**) |

### P2 — Đã hoàn tất

| Việc | File |
|---|---|
| Bộ phân tích SEO mới: 2 điểm (kỹ thuật / answer-readiness), ngân sách tiêu đề theo **pixel**, kiểm tra vị trí từ khóa, độ sâu chủ đề, nguồn chính thống, FAQ, bảng/danh sách bước, liên kết nội bộ, alt ảnh, trùng tiêu đề (Jaccard), độ mới | `lib/seo-analysis.ts` (mới) |
| Panel checker: 2 vòng điểm, 3 chip tổng quan, xem trước SERP theo px, nhóm việc "Cần sửa" có nút **Sửa ngay** (cuộn tới đúng block), mục "Đã đạt" thu gọn | `components/seo-checker.tsx` |
| Công cụ sidebar cho writer: nguồn tham khảo chính thống theo danh mục, gợi ý câu hỏi nên trả lời, chèn nhanh khối | `components/admin/post-sidebar-tools.tsx` (mới), `lib/official-sources.ts` (mới) |
| Đo kích thước ảnh phía client + ngưỡng Discover | `hooks/use-image-dimensions.ts` (mới) |
| Debounce khi gõ | `hooks/use-debounced-value.ts` (mới) |
| Nối vào cả 2 trang soạn bài, nạp ngày đăng/ngày sửa thật cho checker và bản xem trước | `app/admin/(dashboard)/posts/new/page.tsx`, `app/admin/(dashboard)/posts/[id]/edit/page.tsx`, `components/admin/post-preview-dialog.tsx` |

### Việc nhỏ còn tồn (không cần migration, có thể làm bất cứ lúc nào)

- Khoảng 20 trang dịch vụ (`app/services/**`) vẫn còn `keywords:` trong metadata. Google bỏ qua thẻ này từ 2009 nên **không ảnh hưởng xếp hạng** — chỉ là dọn dẹp cho nhất quán (module blog đã bỏ xong).
- Bật lại tối ưu ảnh của Next (`images.unoptimized: false`) sẽ cần thay thẻ `<img>` bằng `next/image` ở trang bài viết và kiểm tra lại host ảnh Supabase.

### P3 — Chưa làm (cần migration DB, đã tách khỏi phạm vi)

`author_id`/`reviewer_*`, `sources JSONB`, `last_reviewed_at`, `slug_history` + bảng `post_redirects` (301 tự động), phân trang `/blog`, Search Console API, bật lại tối ưu ảnh (`images.unoptimized: false`). Xem mục 6 để biết chi tiết.

### Kiểm chứng sau khi triển khai

- **Harness kiểm chứng đã commit kèm mã nguồn** tại `scripts/verify-seo/` (chạy bằng `npx esbuild ... && node ...`, xem `scripts/verify-seo/README.md`):
  - `anchors.test.ts` — **18/18 PASS**: slug tiếng Việt, chống trùng id, idempotent khi chạy lại, ảnh có `width/height`, alt không lọt thẻ HTML, bài lưu dạng HTML thô cũng được bù id.
  - `analysis.test.ts` — **24/24 PASS**: bài "tốt" đạt điểm cao và không có lỗi; bài "yếu" bị cảnh báo đúng các nhóm (nguồn, FAQ, liên kết nội bộ, alt, ảnh bìa, trùng tiêu đề, bài cũ); mọi cảnh báo đều trỏ tới block để bấm "Sửa ngay".
- `npx tsc --noEmit`: **0 lỗi** trong toàn bộ file module blog/SEO (72 lỗi còn lại là lỗi thiếu type của thư viện ngoài, có trước và không liên quan).
- Việc còn lại phía chủ dự án: chạy `scripts/035_add_blog_seo_columns.sql` + `scripts/036_harden_posts_rls.sql` trên Supabase (nếu chưa) để cột `focus_keyword`/`featured_image_alt` tồn tại khi lưu bài.

---

## 9. Nguồn tham khảo chính

- Google Search Central — *Influencing your title links*: https://developers.google.com/search/docs/appearance/title-link
- Google Search Central — hướng dẫn nội dung hữu ích (bản cập nhật 10/12/2025) & chính sách spam *scaled content abuse*: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google — AI features & website controls (không cần schema/llms.txt đặc biệt cho AI Overviews/AI Mode): https://developers.google.com/search/docs/appearance/ai-features
- Google Search Central — FAQ structured data (khai tử rich result 07/05/2026): https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Google Search Central — Article/BlogPosting structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Google Search Central — Google Discover requirements (ảnh ≥1200px, `max-image-preview:large`): https://developers.google.com/search/docs/appearance/google-discover
- web.dev — Core Web Vitals thresholds (LCP ≤2,5s · INP ≤200ms · CLS ≤0,1, p75): https://web.dev/articles/vitals
- Tổng hợp 2026 về mật độ từ khóa / số từ không phải yếu tố xếp hạng: https://www.babylovegrowth.ai/en/blog/keyword-density-for-seo-what-actually-matters-in-2026 · https://technologywisdom.com/seo-myths-in-2026/
- Meta description không phải yếu tố xếp hạng: https://www.clickrank.ai/meta-description-a-google-ranking-factor/
- AI Overviews — trích dẫn tập trung 30% đầu trang, answer-first 40–80 từ: https://www.digitalapplied.com/blog/content-strategy-ai-overviews-post-io-guide-2026 · https://llmpulse.ai/blog/optimize-for-google-ai-overviews/
- Discover core update 02/2026 (page experience là yêu cầu, chống clickbait): https://launchcodex.com/blog/industry-news-shifts/what-is-google-discover/
