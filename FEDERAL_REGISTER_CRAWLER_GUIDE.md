# Federal Register Crawler System - Hướng dẫn sử dụng

## Tổng quan

Hệ thống crawler tự động lấy tin tức quy định FDA từ Federal Register mỗi ngày, sau đó sử dụng ChatGPT để phân tích, tóm tắt bằng tiếng Việt và gợi ý hành động cho các doanh nghiệp xuất nhập khẩu.

## Các nguồn dữ liệu

### 1. Federal Register (Mỹ) 🇺🇸
- **URL**: https://www.federalregister.gov/api/v1/documents.json
- **Nội dung**: Quy định chính thức của FDA về:
  - **Cosmetics**: Quy định MoCRA (Modernization of Cosmetics Regulation Act)
  - **Drugs**: Quy định về dược phẩm
  - **Food**: Quy định về thực phẩm, an toàn thực phẩm
- **Update**: Hàng ngày khi có quy định mới
- **Lợi ích**: Nhanh nhất, chính xác, có metadata đầy đủ

### 2. FDA.gov (Mỹ)
- Thông báo báo chí
- Cảnh báo an toàn
- Withdrawal / Recall

### 3. GACC (Trung Quốc)
- Quy định xuất nhập khẩu
- Đăng ký cơ sở

## Hệ thống lọc 3 lớp

```
┌─────────────────────────────────────────────────────────┐
│              Tier 1: API Query Filter                    │
│  Lọc theo từ khóa (cosmetic, drug, food) trực tiếp API │
│  ✓ Nhanh, chính xác, giảm tải xử lý                    │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│            Tier 2: AI Analysis (ChatGPT)               │
│  • Tóm tắt tiếng Việt (2-3 câu dễ hiểu)              │
│  • Đánh giá mức độ liên quan (relevance_score)        │
│  • Trích xuất key points & deadline                    │
│  • Gợi ý hành động cần thiết                          │
│  ✓ Lọc documents không liên quan (score < 50)        │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│          Tier 3: Admin Review & Approval               │
│  • Xem xét nội dung phân tích AI                      │
│  • Approve/Reject/Publish bài viết                    │
│  • Chỉnh sửa thông tin nếu cần                        │
│  ✓ Đảm bảo chất lượng trước khi gửi khách             │
└─────────────────────────────────────────────────────────┘
```

## Cách sử dụng

### 1. Dashboard Admin

Truy cập: `/admin/news-crawler`

**Buttons:**
- **Federal Register (7 ngày)**: Crawl 7 ngày qua từ Federal Register
- **FDA News**: Crawl thông báo FDA
- **GACC News**: Crawl GACC regulations
- **Crawl All Sources**: Crawl toàn bộ

### 2. Crawl Manual

```bash
# Crawl 7 ngày từ Federal Register
curl -X POST http://localhost:3000/api/news/crawl \
  -H "Content-Type: application/json" \
  -d '{"source": "FEDERAL_REGISTER", "daysBack": 7}'

# Crawl toàn bộ sources
curl -X POST http://localhost:3000/api/news/crawl
```

### 3. Cron Job Tự động

- **Thời gian**: Mỗi ngày lúc **6:00 AM UTC** (13:00 giờ Việt Nam)
- **Endpoint**: `/api/news/cron`
- **Yêu cầu**: Header `Authorization: Bearer {CRON_SECRET}`
- **Config**: `vercel.json` 

```json
{
  "crons": [
    {
      "path": "/api/news/cron",
      "schedule": "0 6 * * *"  // Cron format (mỗi ngày lúc 6 AM UTC)
    }
  ]
}
```

## Database Schema

### news_articles
```sql
CREATE TABLE news_articles (
  id UUID PRIMARY KEY,
  source TEXT,              -- 'FDA', 'GACC', 'FEDERAL_REGISTER'
  title TEXT,
  url TEXT UNIQUE,
  published_date DATE,
  content TEXT,
  summary TEXT,             -- Tiếng Việt từ AI
  category TEXT,            -- 'FDA - Cosmetics', 'FDA - Drugs', etc
  relevance_score INTEGER,  -- 0-100 từ AI phân tích
  filter_layer TEXT,        -- 'tier1', 'tier2', 'tier3'
  keywords TEXT[],          -- Tiếng Việt từ AI
  status TEXT,              -- 'pending', 'approved', 'rejected', 'published'
  raw_html TEXT,            -- JSON metadata + AI analysis
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### crawl_logs
```sql
CREATE TABLE crawl_logs (
  id UUID PRIMARY KEY,
  source TEXT,
  status TEXT,              -- 'running', 'completed', 'failed'
  articles_found INTEGER,
  articles_filtered INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
```

## AI Phân tích (ChatGPT)

Mỗi document được phân tích bằng ChatGPT để:

1. **Tóm tắt Tiếng Việt** (2-3 câu dễ hiểu)
2. **Key Points** (3-5 điểm quan trọng)
3. **Relevance Score** (0-100)
   - 80+: Rất quan trọng (must read)
   - 60-79: Quan trọng
   - 50-59: Có liên quan
   - <50: Bỏ qua
4. **Affected Products** (sản phẩm bị ảnh hưởng)
5. **Action Required** (hành động cần làm)
6. **Deadline** (ngày deadline quan trọng)
7. **Keywords Tiếng Việt**

**Example AI Output:**
```json
{
  "summary_vi": "FDA yêu cầu bổ sung cảnh báo về thành phần này trên nhãn mỹ phẩm từ ngày 1/3/2024. Tất cả sản phẩm đánh dấu lại phải có cảnh báo rõ ràng.",
  "key_points": [
    "Yêu cầu nhãn mới từ 1/3/2024",
    "Áp dụng cho tất cả cosmetics chứa thành phần X",
    "Phạt nếu không tuân thủ"
  ],
  "impact_level": "high",
  "affected_products": ["Kem chống nắng", "Kem dưỡng da"],
  "action_required": "Cập nhật nhãn sản phẩm trước 1/3/2024",
  "deadline": "2024-03-01",
  "relevance_score": 92,
  "keywords_vi": ["nhãn sản phẩm", "cosmetics", "thành phần", "cảnh báo"]
}
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (Optional - nếu không có, sẽ dùng Vercel AI Gateway)
OPENAI_API_KEY=your_openai_key

# Cron Security
CRON_SECRET=your_secret_key_for_cron
```

## Setup Database

### Tùy chọn 1: Qua Admin Dashboard
1. Truy cập `/admin/news-crawler`
2. Nhấn "Crawl Federal Register (7 ngày)"
3. Hệ thống sẽ tự tạo tables nếu chưa có

### Tùy chọn 2: Manual SQL
Chạy `scripts/033_create_news_articles.sql` trên Supabase SQL editor

### Tùy chọn 3: Dùng Node.js Script
```bash
npm run ts-node scripts/setup-news-db.ts
```

## Monitoring & Logs

### Xem logs crawl
```bash
curl http://localhost:3000/api/news/list
```

### Xem articles đã crawl
```bash
# Tất cả
curl http://localhost:3000/api/news/list?limit=50

# Theo source
curl http://localhost:3000/api/news/list?source=FEDERAL_REGISTER

# Theo trạng thái
curl http://localhost:3000/api/news/list?status=pending

# Theo relevance
curl http://localhost:3000/api/news/list?minRelevance=80
```

## Troubleshooting

### Lỗi "Database connection failed"
- Kiểm tra SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY
- Đảm bảo Supabase project đang active

### AI không phân tích được
- Kiểm tra OPENAI_API_KEY hoặc AI_GATEWAY_API_KEY
- Kiểm tra rate limit (ChatGPT có giới hạn requests/phút)
- Xem logs chi tiết: `npm run dev` (dev mode)

### Crawl quá chậm
- Mỗi document cần ~1-2s để AI phân tích
- 25 documents = 25-50s crawl
- Nếu bị timeout, giảm `per_page` hoặc `daysBack`

### Cron job không chạy
- Verify `CRON_SECRET` env var
- Kiểm tra vercel.json schedule format (Cron format)
- Xem logs Vercel Deployment

## API Endpoints

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/news/crawl` | POST | Manual crawl | Optional |
| `/api/news/list` | GET | List articles | No |
| `/api/news/cron` | GET | Cron job | CRON_SECRET |
| `/api/news/update-status` | POST | Update article status | Authenticated |

## Performance Notes

- **Federal Register API**: ~0.5s per request
- **AI Analysis**: ~1-2s per document (ChatGPT)
- **Total time**: 25 documents ≈ 30-60s
- **Indexing**: Automatic với PostgreSQL indexes
- **Rate limiting**: 
  - Federal Register: Public API (no limit)
  - ChatGPT: 3,500 requests/min (free tier)

## Next Steps

1. ✅ Setup database tables
2. ✅ Configure environment variables  
3. ✅ Test manual crawl từ admin dashboard
4. ✅ Monitor first crawl results
5. ✅ Deploy & enable cron job
6. ✅ Notify customers of new feature

## Support

Nếu có issues:
1. Kiểm tra console logs (`npm run dev`)
2. Xem database records `news_articles` và `crawl_logs`
3. Verify AI responses trong `raw_html` JSON
4. Check Vercel Deployment logs
