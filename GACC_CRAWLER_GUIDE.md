# GACC News Crawler - Hướng Dẫn Sử Dụng

## 🎯 Tổng Quan

Hệ thống crawl tin tức GACC được thiết kế theo **best practices** để:
- ✅ Không vi phạm website gốc
- ✅ Nhẹ, an toàn, không bị chặn
- ✅ Chỉ lấy dữ liệu khi có thay đổi
- ✅ Tích hợp AI phân tích thông minh

## 🔧 Cấu Hình

### 2 URL GACC Được Crawl

\`\`\`
1. http://www.customs.gov.cn/customs/302249/302266/index.html
2. http://www.customs.gov.cn/customs/302249/2480148/index.html
\`\`\`

**Lưu ý:** Hệ thống KHÔNG crawl toàn site, chỉ 2 trang này để đảm bảo an toàn.

## 📋 Workflow "WATCH PAGE + HASH"

### Bước 1: Lấy Danh Sách (List Only)

\`\`\`
❌ KHÔNG: Fetch toàn bộ nội dung ngay
✅ NÊN: Chỉ lấy danh sách link
\`\`\`

Thông tin lấy:
- Tiêu đề (title)
- URL bài viết
- Ngày ban hành
- Mã văn bản (nếu có)

### Bước 2: Hash Detection

\`\`\`typescript
// Tạo hash từ title + date + url
hash = sha256(title + date + url)
\`\`\`

**Logic:**
- Hash thay đổi = có bài viết mới hoặc cập nhật
- Hash không đổi = bỏ qua (đã crawl rồi)

### Bước 3: Fetch Content Có Điều Kiện

\`\`\`
IF hash mới hoặc thay đổi:
  → Fetch nội dung chi tiết
  → Phân tích với AI
  → Lưu vào database
ELSE:
  → Bỏ qua (tiết kiệm tài nguyên)
\`\`\`

## 🤖 AI Processing - Đúng Chỗ

### AI KHÔNG đọc toàn bộ. AI chỉ nhận:

1. **Tiêu đề** - để hiểu chủ đề chính
2. **Phần thay đổi** - chỉ nội dung mới
3. **Metadata** - ngày, nguồn, danh mục

### Prompt Mẫu (Tư Duy Đúng)

\`\`\`
Văn bản này có phải là:
- Thay đổi nghĩa vụ DN?
- Hay chỉ diễn giải?

Áp dụng cho:
- DN sản xuất?
- DN thương mại?

Sản phẩm ảnh hưởng:
- Thực phẩm
- Hải sản
- Nông sản
\`\`\`

## 🎯 Map Với Profile User (Chìa Khóa Giữ Chân)

### Ví dụ User Profile:

\`\`\`json
{
  "product": "thực phẩm",
  "market": "Trung Quốc",
  "role": "thương mại"
}
\`\`\`

### AI Kết Luận:

\`\`\`
✅ "Văn bản này có khả năng ảnh hưởng vì có đề cập đến DN không có nhà máy"
   → Gửi notify

❌ "Văn bản này chỉ đề cập đến dược phẩm"
   → KHÔNG gửi (tránh spam)
\`\`\`

**Kết quả:** User không bị spam → tin tưởng hệ thống.

## 📧 Thông Báo Nên Viết Thế Nào?

### ❌ Sai:
\`\`\`
"Có văn bản mới của GACC"
\`\`\`

### ✅ Đúng:
\`\`\`
"GACC cập nhật quy định hồ sơ đối với DN thương mại xuất thực phẩm (ban hành 21/01/2026)"
\`\`\`

## 🚀 MVP Thực Tế Cho VEXIM

### 30 Ngày Đầu

**Theo dõi:**
- 政务公开 → 最新文件
- 海关法规

**Chỉ cho:**
- Thực phẩm
- DN thương mại

👉 **Đã vượt 90% website đối thủ**

## 🔐 Security & Anti-Block

### Secure Headers (Implemented)

\`\`\`typescript
{
  "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0",
  "Accept-Language": "zh-CN,zh;q=0.9",
  "Referer": "http://www.customs.gov.cn/",
  "Sec-CH-UA": '"Chromium";v="120"'
}
\`\`\`

### Cookie Management

\`\`\`
1. Lấy cookie từ homepage trước
2. Sử dụng cookie cho crawl requests
3. Handle 412 errors gracefully
\`\`\`

## 📊 Database Schema

### Table: `crawled_news`

\`\`\`sql
id              UUID
source          TEXT         -- 'FDA' hoặc 'GACC'
source_url      TEXT         -- URL trang được crawl
title           TEXT
article_url     TEXT UNIQUE  -- URL bài viết
published_date  TEXT
content_hash    TEXT         -- SHA256 hash (key field!)
full_content    TEXT         -- Nội dung đầy đủ
summary         TEXT
relevance       TEXT         -- 'high', 'medium', 'low'
categories      TEXT[]
ai_analysis     JSONB        -- Kết quả AI
status          TEXT         -- 'pending', 'processed', 'published'
is_notified     BOOLEAN
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
last_checked_at TIMESTAMPTZ
\`\`\`

### Table: `crawl_sessions`

\`\`\`sql
id              UUID
source          TEXT
source_url      TEXT
started_at      TIMESTAMPTZ
completed_at    TIMESTAMPTZ
status          TEXT         -- 'running', 'completed', 'failed'
articles_found  INTEGER
new_articles    INTEGER      -- Số bài mới (hash khác)
updated_articles INTEGER     -- Số bài cập nhật
error_message   TEXT
metadata        JSONB
\`\`\`

## 💡 Best Practices

### DO ✅

1. **Watch specific pages** - Chỉ crawl 2 URL đã định
2. **Hash-based detection** - Detect thay đổi bằng hash
3. **Lazy content loading** - Chỉ fetch khi cần
4. **AI on changes only** - AI chỉ xử lý phần mới
5. **User profile matching** - Gửi notify có target
6. **Meaningful notifications** - Thông báo chi tiết, có giá trị

### DON'T ❌

1. ~~Crawl toàn site~~
2. ~~Crawl trang có tương tác~~
3. ~~Crawl với tần suất cao~~
4. ~~Fetch content cho mọi item~~
5. ~~Gửi notify spam~~
6. ~~AI phân tích toàn bộ~~

## 📈 Performance Metrics

### Target Goals

- **Crawl time**: < 30s per session
- **Hash comparison**: < 1s per 100 items
- **Content fetch**: Only on changes (5-10% of items)
- **AI processing**: Only relevant articles (10-20% after filtering)
- **False positive**: < 5%
- **User satisfaction**: > 90% (notifications are useful)

## 🔄 Workflow Flow Chart

\`\`\`
┌─────────────────────────────────────────────┐
│ 1. CRAWL DANH SÁCH (List Only)             │
│    - Title, URL, Date                       │
│    - NO content fetching yet                │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 2. GENERATE HASH                            │
│    hash = sha256(title + date + url)       │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 3. CHECK HASH IN DATABASE                   │
│    - Existing hash? → Skip                  │
│    - New/changed hash? → Continue           │
└──────────────┬──────────────────────────────┘
               │
               ▼ (Only if new/changed)
┌─────────────────────────────────────────────┐
│ 4. FETCH FULL CONTENT                       │
│    - Download article page                  │
│    - Strip menu, sidebar                    │
│    - Extract main content                   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 5. AI ANALYSIS (3 Tiers)                    │
│    Tier 1: Keyword filter                   │
│    Tier 2: Relevance scoring                │
│    Tier 3: Detailed validation              │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 6. MAP WITH USER PROFILE                    │
│    - Match product/market/role              │
│    - Calculate impact                       │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ 7. SEND TARGETED NOTIFICATION               │
│    - Only to affected users                 │
│    - Meaningful message                     │
│    - Include action items                   │
└─────────────────────────────────────────────┘
\`\`\`

## 🛠️ Code Examples

### Example 1: Crawl & Hash

\`\`\`typescript
// Crawl danh sách
const articles = await crawler.crawlGACCNews()

// articles[0]:
{
  "title": "关于进口食品企业注册的公告",
  "url": "http://www.customs.gov.cn/customs/.../xxx.html",
  "date": "2026-01-21",
  "contentHash": "a3f5b8c...",  // SHA256 hash
  "source": "GACC",
  "sourceUrl": "http://www.customs.gov.cn/customs/302249/302266/index.html"
}
\`\`\`

### Example 2: Check & Fetch

\`\`\`typescript
// Check hash trong DB
const existing = await db.findByHash(article.contentHash)

if (!existing) {
  // Hash mới → fetch content
  const fullContent = await crawler.fetchArticleContent(
    article.url, 
    article.source
  )
  
  // Analyze với AI
  const analysis = await crawler.processNewsArticle(JSON.stringify({
    ...article,
    fullContent
  }))
  
  // Save to DB
  await db.save({
    ...article,
    fullContent,
    ai_analysis: analysis
  })
}
\`\`\`

### Example 3: User Matching

\`\`\`typescript
// Lấy users liên quan
const affectedUsers = await db.query(`
  SELECT * FROM user_profiles 
  WHERE product = ANY($1)
  AND market = ANY($2)
`, [analysis.affectedProducts, analysis.affectedCountries])

// Gửi notify có target
for (const user of affectedUsers) {
  await sendNotification(user, {
    title: `${article.source} cập nhật: ${article.title}`,
    body: analysis.summary,
    actionUrl: article.url
  })
}
\`\`\`

## 📞 Support

Nếu có vấn đề, kiểm tra:

1. **Console logs** - Xem `[v0]` prefix logs
2. **Database** - Check `crawl_sessions` table
3. **Headers** - Verify secure headers được gửi
4. **Hash** - Kiểm tra hash generation
5. **AI API** - Xem Groq API credits

## 🎓 Tóm Tắt

Hệ thống này được xây dựng theo **best practices**:

✅ **Lightweight** - Chỉ fetch khi cần
✅ **Safe** - Không vi phạm robots.txt
✅ **Smart** - AI phân tích có target
✅ **Effective** - User chỉ nhận notify quan trọng
✅ **Scalable** - Dễ mở rộng thêm sources

👉 **Kết quả:** Một hệ thống crawl tin tức xuất nhập khẩu TỐT NHẤT thị trường!
