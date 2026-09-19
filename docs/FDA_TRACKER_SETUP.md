# FDA Tracker - Hướng Dẫn Cài Đặt và Vận Hành

## Tổng Quan Hệ Thống

FDA Tracker là hệ thống theo dõi và cảnh báo tự động về các thu hồi sản phẩm từ FDA (Food and Drug Administration - Mỹ). Hệ thống bao gồm:

### 1. **Frontend Components**
- `FDAAlertBadge` - Badge cảnh báo floating hiển thị trên homepage
- `FDATrackerDashboard` - Dashboard chính với freemium model (3 items miễn phí)
- `FDASubscriptionDialog` - Dialog đăng ký chi tiết với options
- `FDASubscriptionInline` - Form đăng ký inline (3 variants: default, compact, cta)

### 2. **Backend Services**
- `fdaApi` - Service fetch dữ liệu từ FDA.gov API
- `fdaAI` - Service tạo tóm tắt tiếng Việt với AI (Groq)
- `emailService` - Service gửi email qua Resend API

### 3. **Database**
- `fda_subscriptions` - Lưu thông tin người đăng ký
- `fda_alerts_cache` - Cache kết quả FDA API (giảm API calls)

### 4. **API Endpoints**
- `POST /api/fda/subscribe` - Đăng ký nhận cảnh báo
- `GET /api/fda/subscribe?email=xxx` - Kiểm tra trạng thái đăng ký
- `DELETE /api/fda/subscribe?email=xxx&token=xxx` - Hủy đăng ký
- `GET /api/fda/verify?email=xxx&token=xxx` - Xác thực email
- `GET /api/fda/send-digest?frequency=daily|weekly` - Cron job gửi email

---

## Cài Đặt Hệ Thống

### Bước 1: Database Setup

Chạy migration script để tạo bảng:

\`\`\`bash
# Trong v0 interface, execute script:
scripts/017_create_fda_subscriptions.sql
\`\`\`

Hoặc chạy SQL trực tiếp trong Supabase:

\`\`\`sql
-- Tạo bảng fda_subscriptions
CREATE TABLE IF NOT EXISTS fda_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  categories TEXT[] NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'weekly',
  is_active BOOLEAN NOT NULL DEFAULT true,
  verified BOOLEAN NOT NULL DEFAULT false,
  verification_token TEXT,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo indexes
CREATE INDEX idx_fda_subscriptions_email ON fda_subscriptions(email);
CREATE INDEX idx_fda_subscriptions_active ON fda_subscriptions(is_active);
CREATE INDEX idx_fda_subscriptions_verified ON fda_subscriptions(verified);

-- Enable RLS
ALTER TABLE fda_subscriptions ENABLE ROW LEVEL SECURITY;
\`\`\`

### Bước 2: Environment Variables

Thêm các biến môi trường sau vào Vercel (hoặc .env.local):

\`\`\`bash
# Supabase (đã có sẵn)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend API (để gửi email)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Cron Secret (để bảo vệ endpoint)
CRON_SECRET=your-random-secret-key-here

# Base URL (production)
NEXT_PUBLIC_BASE_URL=https://vexim.vn

# Groq API (cho AI summary - Optional)
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
\`\`\`

#### Lấy Resend API Key:

1. Đăng ký tài khoản tại: https://resend.com
2. Vào Dashboard → API Keys → Create API Key
3. Copy key và thêm vào environment variables
4. Verify domain `veximglobal.vn` trong Resend để gửi email từ domain này

### Bước 3: Setup Cron Jobs

#### Option A: Sử dụng Vercel Cron (Recommended)

File `vercel-cron.json` đã được tạo với cấu hình:

\`\`\`json
{
  "crons": [
    {
      "path": "/api/fda/send-digest?frequency=daily",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/fda/send-digest?frequency=weekly",
      "schedule": "0 8 * * 1"
    }
  ]
}
\`\`\`

- **Daily digest**: Chạy lúc 8:00 sáng mỗi ngày
- **Weekly digest**: Chạy lúc 8:00 sáng thứ 2 hàng tuần

**Lưu ý**: Vercel Cron chỉ available trên Vercel Pro plan. Nếu dùng free plan, dùng Option B.

#### Option B: Sử dụng Cron-Job.org (Free)

1. Đăng ký tại: https://cron-job.org
2. Tạo 2 cron jobs:

**Daily Job:**
- URL: `https://vexim.vn/api/fda/send-digest?frequency=daily`
- Schedule: `0 8 * * *` (8:00 AM daily)
- Headers: `Authorization: Bearer YOUR_CRON_SECRET`

**Weekly Job:**
- URL: `https://vexim.vn/api/fda/send-digest?frequency=weekly`
- Schedule: `0 8 * * 1` (8:00 AM Monday)
- Headers: `Authorization: Bearer YOUR_CRON_SECRET`

### Bước 4: Test Hệ Thống

#### Test 1: Đăng ký email

1. Vào `https://vexim.vn/fda-tracker`
2. Click "Đăng ký nhận cảnh báo"
3. Nhập email và chọn danh mục
4. Kiểm tra email xác thực

#### Test 2: Xác thực email

1. Mở email xác thực
2. Click link "Xác nhận email của tôi"
3. Kiểm tra trang confirmation

#### Test 3: Gửi email thủ công (DEV)

\`\`\`bash
# Gọi API để trigger gửi email
curl -X GET "https://vexim.vn/api/fda/send-digest?frequency=daily" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
\`\`\`

#### Test 4: Hủy đăng ký

1. Click link "Hủy đăng ký" trong email
2. Kiểm tra trang confirmation

---

## Kiến Trúc Hệ Thống

### Flow Đăng Ký:

\`\`\`
User fills form → POST /api/fda/subscribe
                    ↓
              Insert to DB (verified=false)
                    ↓
              Send verification email
                    ↓
              User clicks link
                    ↓
              GET /api/fda/verify
                    ↓
              Update verified=true
                    ↓
              Show success page
\`\`\`

### Flow Gửi Email Định Kỳ:

\`\`\`
Cron triggers → GET /api/fda/send-digest?frequency=daily
                    ↓
              emailService.sendAlertDigest('daily')
                    ↓
              Query active subscribers
                    ↓
              Fetch latest FDA alerts
                    ↓
              Filter by categories
                    ↓
              Generate email HTML
                    ↓
              Send via Resend API
                    ↓
              Update last_sent_at
\`\`\`

### Flow Cảnh Báo Khẩn Cấp (Immediate):

\`\`\`
New critical FDA alert detected
                    ↓
              fdaAI.generateVietnameseSummary()
                    ↓
              emailService.sendImmediateAlert()
                    ↓
              Query immediate subscribers
                    ↓
              Send email to matching categories
\`\`\`

---

## Email Templates

Hệ thống có 4 loại email:

### 1. Verification Email
- Subject: "Xác nhận đăng ký cảnh báo FDA - Vexim Global"
- Gửi khi: User đăng ký mới
- Template: `getVerificationEmailHTML()`

### 2. Daily/Weekly Digest
- Subject: "🚨 Tóm tắt cảnh báo FDA [hôm nay/tuần này] - Vexim Global"
- Gửi khi: Cron job chạy
- Template: `getAlertEmailHTML()`
- Bao gồm: Top 5 cảnh báo + link xem thêm

### 3. Immediate Alert
- Subject: "🚨 CẢNH BÁO FDA KHẨN CẤP: [Tên sản phẩm] - Vexim Global"
- Gửi khi: Phát hiện cảnh báo mức độ cao (Class I)
- Template: `getImmediateAlertEmailHTML()`

### 4. Unsubscribe Confirmation
- Subject: "Đã hủy đăng ký cảnh báo FDA - Vexim Global"
- Gửi khi: User hủy đăng ký
- Template: `getUnsubscribeEmailHTML()`

---

## Freemium Model

### Free Tier:
- Xem 3 cảnh báo đầu tiên
- Không cần đăng ký

### Email Subscription:
- Nhận tất cả cảnh báo qua email
- Tóm tắt tiếng Việt với AI
- Lựa chọn tần suất: daily/weekly/immediate
- Chọn categories: food/drug/cosmetic/device

---

## Monitoring & Maintenance

### Kiểm tra logs:

\`\`\`bash
# Vercel logs
vercel logs --follow

# Hoặc trong Vercel dashboard → Logs
\`\`\`

### Metrics cần theo dõi:

1. **Subscription metrics**:
   - Total subscribers
   - Verified vs unverified
   - Active vs inactive
   - Category distribution

\`\`\`sql
-- Query statistics
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE verified) as verified,
  COUNT(*) FILTER (WHERE is_active) as active,
  frequency,
  categories
FROM fda_subscriptions
GROUP BY frequency, categories;
\`\`\`

2. **Email metrics**:
   - Emails sent (check Resend dashboard)
   - Open rate
   - Click rate
   - Bounce rate

3. **FDA API usage**:
   - API calls per day
   - Cache hit rate
   - Failed requests

### Cleanup old cache:

\`\`\`sql
-- Run weekly to cleanup expired cache
DELETE FROM fda_alerts_cache
WHERE expires_at < NOW();
\`\`\`

---

## Troubleshooting

### Issue: Email không gửi được

**Check:**
1. RESEND_API_KEY có đúng không?
2. Domain đã verify trong Resend chưa?
3. Email có trong spam không?

**Solution:**
- Verify domain trong Resend
- Check Resend logs để xem lỗi chi tiết
- Test với email khác (Gmail, Outlook)

### Issue: Cron job không chạy

**Check:**
1. Vercel plan có support cron không?
2. CRON_SECRET có đúng không?
3. Endpoint có return 200 không?

**Solution:**
- Dùng cron-job.org nếu Vercel free plan
- Check logs của cron job
- Test endpoint thủ công với curl

### Issue: FDA API rate limit

**Check:**
1. Có quá nhiều request không?
2. Cache có hoạt động không?

**Solution:**
- Implement better caching
- Reduce API calls frequency
- Use cached data when possible

---

## Next Steps

### Enhancements:

1. **AI Summary cho tất cả alerts**
   - Hiện tại: Chỉ generate on-demand
   - Cải tiến: Pre-generate và cache

2. **User Dashboard**
   - Trang quản lý subscription
   - Xem lịch sử alerts
   - Customize preferences

3. **Analytics**
   - Track email open/click rates
   - User engagement metrics
   - Popular categories

4. **Mobile App**
   - Push notifications
   - Offline mode
   - Quick alerts

5. **Premium Features**
   - Custom alert rules
   - Export to PDF
   - Priority support

---

## Support

Nếu cần hỗ trợ:
- Email: tech@veximglobal.vn
- Phone: 0373 685 634

---

**Cập nhật lần cuối**: ${new Date().toLocaleDateString("vi-VN")}
