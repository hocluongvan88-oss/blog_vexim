# Hướng Dẫn Tích Hợp Chatbot Facebook & Zalo OA

## 📋 Tổng Quan Hệ Thống

Hệ thống chatbot đã được xây dựng sẵn với các tính năng:
- ✅ **AI Groq**: Trả lời tự động bằng AI
- ✅ **Knowledge Base RAG**: Truy xuất thông tin từ kho tài liệu
- ✅ **Agent Handover**: Chuyển sang tư vấn viên khi cần
- ✅ **Multi-platform**: Hỗ trợ Website, Facebook Messenger, Zalo OA
- ✅ **Database**: Lưu toàn bộ lịch sử hội thoại

## 🏗️ Kiến Trúc Hệ Thống

\`\`\`
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Facebook   │      │   Zalo OA    │      │   Website    │
│  Messenger   │      │              │      │   Widget     │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       │  Webhook            │  Webhook            │  API Call
       ▼                     ▼                     ▼
┌───────────────────────────────────────────────────────────┐
│              Next.js API Routes (Vercel)                  │
│  /api/webhooks/facebook  │  /api/webhooks/zalo  │  /api  │
└───────────────┬───────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────┐
│                   AI Service Layer                        │
│   • Load AI Config        • Search Knowledge Base         │
│   • Generate Response     • Analyze Intent                │
│   • Decision: AI vs Agent Handover                        │
└───────────────┬───────────────────────���───────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────┐
│                  Supabase Database                        │
│   • conversations      • knowledge_documents              │
│   • chat_messages      • conversation_handovers           │
│   • ai_config          • knowledge_chunks                 │
└───────────────────────────────────────────────────────────┘
\`\`\`

---

## 🚀 PHẦN 1: TÍCH HỢP FACEBOOK MESSENGER

### Bước 1: Tạo Facebook App

1. **Truy cập**: https://developers.facebook.com
2. **Tạo app mới**:
   - Click "Create App"
   - Chọn "Business" → "Consumer"
   - Đặt tên app: `Vexim Chatbot`
   - Email contact: email công ty
   - Click "Create App"

### Bước 2: Cấu Hình Messenger

1. **Thêm Messenger Product**:
   - Trong dashboard app → Click "Add Product"
   - Chọn "Messenger" → Click "Set Up"

2. **Kết nối Facebook Page**:
   - Scroll xuống "Access Tokens"
   - Click "Add or Remove Pages"
   - Chọn Facebook Page của công ty
   - Click "Generate Token"
   - **Lưu lại token** này (gọi là `FB_PAGE_ACCESS_TOKEN`)

### Bước 3: Setup Webhook

1. **Deploy project lên Vercel** (nếu chưa có):
   \`\`\`bash
   vercel --prod
   \`\`\`
   Lấy URL domain, ví dụ: `https://vexim-blog.vercel.app`

2. **Thêm Environment Variables** trong Vercel:
   \`\`\`
   FB_PAGE_ACCESS_TOKEN=<token từ bước 2>
   FB_VERIFY_TOKEN=vexim_verify_token_2024
   GROQ_API_KEY=<your_groq_api_key>
   \`\`\`

3. **Cấu hình Webhook trong Facebook**:
   - Quay lại Facebook App Dashboard
   - Messenger → Settings → Webhooks
   - Click "Add Callback URL"
   - **Callback URL**: `https://vexim-blog.vercel.app/api/webhooks/facebook`
   - **Verify Token**: `vexim_verify_token_2024` (giống trong env)
   - Click "Verify and Save"

4. **Subscribe to Events**:
   - Sau khi verify thành công
   - Click "Add Subscriptions"
   - Chọn: `messages`, `messaging_postbacks`
   - Click "Save"

### Bước 4: Subscribe Page to App

1. Scroll xuống phần "Webhooks"
2. Chọn Page của bạn
3. Click "Subscribe"
4. Đảm bảo có dấu tích xanh ở `messages`

### Bước 5: Kiểm Tra

1. **Mở Messenger** của Facebook Page
2. Gửi tin nhắn: "Xin chào"
3. **Kiểm tra logs**:
   - Vào Vercel Dashboard → Logs
   - Xem có log `[v0] Facebook webhook received`
4. Bot sẽ tự động trả lời bằng AI

### Xử Lý Lỗi Thường Gặp

#### ❌ "Error validating verification code"
- **Nguyên nhân**: `FB_VERIFY_TOKEN` trong env không khớp với verify token trong Facebook
- **Giải pháp**: Kiểm tra lại 2 giá trị phải giống hệt nhau

#### ❌ "Invalid OAuth access token"
- **Nguyên nhân**: `FB_PAGE_ACCESS_TOKEN` sai hoặc hết hạn
- **Giải pháp**: Generate token mới từ Facebook Developer Console

#### ❌ Webhook không nhận tin nhắn
- **Nguyên nhân**: Page chưa subscribe hoặc thiếu permission
- **Giải pháp**: Kiểm tra lại Subscribe to Events và Page Subscription

---

## 🟦 PHẦN 2: TÍCH HỢP ZALO OA

### Bước 1: Đăng Ký Zalo Official Account

1. **Truy cập**: https://oa.zalo.me
2. **Đăng ký OA**:
   - Login bằng Zalo cá nhân
   - Click "Tạo OA mới"
   - Điền thông tin:
     - Tên OA: `Vexim Global`
     - Lĩnh vực: Dịch vụ tư vấn
     - Mô tả: Tư vấn xuất khẩu, tuân thủ FDA/GACC/MFDS
   - Upload avatar, cover
   - Gửi đăng ký (chờ duyệt 1-3 ngày)

### Bước 2: Tạo Zalo Mini App

1. **Truy cập**: https://developers.zalo.me
2. **Tạo App**:
   - Click "Tạo ứng dụng"
   - Tên app: `Vexim Chatbot`
   - Loại app: "Official Account"
   - Chọn OA vừa tạo
   - Click "Tạo"

### Bước 3: Lấy Access Token

#### Cách 1: Access Token Ngắn Hạn (Testing)

1. Vào app vừa tạo
2. Tab "Công cụ" → "OA Access Token"
3. Click "Lấy mã Token"
4. **Lưu lại token** (hiệu lực 90 ngày)

#### Cách 2: Refresh Token Dài Hạn (Production)

1. Tab "Cài đặt" → "OAuth Settings"
2. Thêm Redirect URL: `https://vexim-blog.vercel.app/api/auth/zalo/callback`
3. Lưu lại:
   - `App ID`
   - `App Secret`
4. Implement OAuth flow để lấy refresh token
   (Code mẫu: https://developers.zalo.me/docs/api/official-account-api/xac-thuc-va-uy-quyen/cach-1-xac-thuc-voi-oauth)

### Bước 4: Setup Webhook

1. **Thêm Environment Variables** trong Vercel:
   \`\`\`
   ZALO_ACCESS_TOKEN=<token từ bước 3>
   ZALO_OA_ID=<OA ID của bạn>
   ZALO_APP_ID=<App ID>
   ZALO_APP_SECRET=<App Secret>
   \`\`\`

2. **Cấu hình Webhook trong Zalo**:
   - Vào Zalo Developer Console
   - Tab "Webhook"
   - **Webhook URL**: `https://vexim-blog.vercel.app/api/webhooks/zalo`
   - Click "Lưu"
   - Click "Bật Webhook"

3. **Subscribe Events**:
   - Chọn events:
     - `user_send_text`: User gửi text
     - `user_send_image`: User gửi ảnh
     - `user_send_link`: User gửi link
   - Click "Lưu"

### Bước 5: Kiểm Tra

1. **Mở Zalo App** trên điện thoại
2. Tìm OA của bạn và nhắn tin
3. **Kiểm tra logs** trong Vercel
4. Bot sẽ tự động trả lời

### Xử Lý Lỗi Thường Gặp

#### ❌ "Invalid access token"
- **Nguyên nhân**: Token hết hạn (90 ngày)
- **Giải pháp**: Generate token mới hoặc implement refresh token

#### ❌ "OA not authorized"
- **Nguyên nhân**: App chưa được OA authorize
- **Giải pháp**: Vào OA Settings → Apps → Authorize app của bạn

#### ❌ Webhook không nhận message
- **Nguyên nhân**: URL webhook sai hoặc chưa verify
- **Giải pháp**: 
  - Kiểm tra URL đúng format
  - Test webhook bằng tool của Zalo Developer

---

## 🎯 PHẦN 3: QUẢN LÝ VÀ GIÁM SÁT

### Admin Dashboard

**Truy cập**: `https://your-domain.com/admin/conversations`

#### Chức năng:

1. **Xem tất cả hội thoại**:
   - Website Chat
   - Facebook Messenger
   - Zalo OA

2. **Cướp quyền AI** (Agent Handover):
   - Click vào conversation
   - Click "Cướp Quyền"
   - Trả lời trực tiếp customer
   - Click "Trả Lại AI" khi xong

3. **Xem lịch sử**:
   - Tất cả tin nhắn được lưu trong database
   - Filter theo platform, status, date

### Database Schema

\`\`\`sql
-- Conversations table
conversations (
  id UUID,
  user_identifier TEXT,      -- FB User ID hoặc Zalo User ID
  platform TEXT,              -- 'facebook' | 'zalo' | 'website'
  status TEXT,                -- 'active' | 'closed'
  created_at TIMESTAMP
)

-- Messages table
chat_messages (
  id UUID,
  conversation_id UUID,
  sender_type TEXT,           -- 'customer' | 'bot' | 'agent'
  message_text TEXT,
  ai_model TEXT,              -- 'openai/gpt-oss-120b'
  ai_confidence FLOAT,        -- 0.0 - 1.0
  created_at TIMESTAMP
)

-- Handovers table
conversation_handovers (
  id UUID,
  conversation_id UUID,
  status TEXT,                -- 'active' | 'completed'
  assigned_agent TEXT,
  reason TEXT,
  created_at TIMESTAMP
)
\`\`\`

### Giám Sát Realtime

1. **Vercel Logs**:
   \`\`\`bash
   vercel logs --follow
   \`\`\`

2. **Supabase Dashboard**:
   - Xem số lượng hội thoại realtime
   - Monitor database queries
   - Check RLS policies

3. **Custom Monitoring** (Optional):
   - Tích hợp Sentry cho error tracking
   - Tích hợp Analytics để track:
     - Số tin nhắn/ngày
     - AI response time
     - Handover rate
     - Customer satisfaction

---

## 🔧 PHẦN 4: NÂNG CAO

### A. Cấu Hình AI Response

File: `/lib/ai-service.ts`

\`\`\`typescript
// Thay đổi system prompt
const SYSTEM_PROMPT = `
Bạn là trợ lý AI của Vexim Global...
(Tùy chỉnh theo nhu cầu)
`

// Thay đổi model Groq
const MODEL = "openai/gpt-oss-120b"  // Llama 3.3 70B đã bị Groq khai tử 16/08/2026

// Thay đổi temperature (creativity)
const TEMPERATURE = 0.7  // 0.0 = chính xác, 1.0 = sáng tạo
\`\`\`

### B. Trigger Auto Handover

File: `/lib/ai-service.ts` - function `analyzeIntent()`

\`\`\`typescript
// Thêm keywords để tự động handover
const urgentKeywords = [
  "khẩn cấp", 
  "gấp", 
  "ngay",
  "urgent",
  "emergency"
]

// Thêm logic phức tạp hơn
if (isUrgent || isComplex || hasLowConfidence) {
  return {
    shouldHandover: true,
    reason: "..."
  }
}
\`\`\`

### C. Custom Facebook Message Templates

File: `/app/api/webhooks/facebook/route.ts`

\`\`\`typescript
// Gửi quick replies
await sendFacebookMessage(recipientId, {
  text: "Bạn muốn tìm hiểu về?",
  quick_replies: [
    {
      content_type: "text",
      title: "FDA (Mỹ)",
      payload: "FDA_INFO"
    },
    {
      content_type: "text",
      title: "GACC (Trung Quốc)",
      payload: "GACC_INFO"
    }
  ]
})
\`\`\`

### D. Zalo Interactive Elements

File: `/app/api/webhooks/zalo/route.ts`

\`\`\`typescript
// Gửi tin nhắn có hình ảnh
await sendZaloMessage(userId, {
  attachment: {
    type: "template",
    payload: {
      template_type: "media",
      elements: [{
        media_type: "image",
        url: "https://your-image-url.com/image.jpg",
        title: "FDA Registration Guide"
      }]
    }
  }
})
\`\`\`

---

## 📊 PHẦN 5: TESTING & DEBUGGING

### Test Facebook Webhook

\`\`\`bash
# Test verification endpoint
curl "https://vexim-blog.vercel.app/api/webhooks/facebook?hub.mode=subscribe&hub.verify_token=vexim_verify_token_2024&hub.challenge=CHALLENGE_STRING"

# Gửi tin nhắn test
# (Dùng Facebook Messenger trực tiếp hoặc Postman với format Facebook)
\`\`\`

### Test Zalo Webhook

\`\`\`bash
# Test với Zalo Developer Console
# → Tab Webhook → "Thử webhook"
\`\`\`

### Debug Common Issues

#### 1. Bot không trả lời

**Check list**:
\`\`\`bash
# 1. Kiểm tra logs
vercel logs --follow

# 2. Kiểm tra env variables
vercel env ls

# 3. Test API endpoint trực tiếp
curl -X POST https://your-domain.com/api/webhooks/facebook \
  -H "Content-Type: application/json" \
  -d '{"entry": [...]}'
\`\`\`

#### 2. AI trả lời sai

**Nguyên nhân**:
- Knowledge base chưa có thông tin
- System prompt chưa rõ ràng
- Temperature quá cao (AI sáng tạo quá mức)

**Giải pháp**:
1. Vào Admin → Kho Tri Thức AI
2. Thêm tài liệu về chủ đề đó
3. Giảm temperature xuống 0.5-0.6

#### 3. Handover không hoạt động

**Check**:
\`\`\`sql
-- Kiểm tra trong Supabase SQL Editor
SELECT * FROM conversation_handovers 
WHERE status = 'active' 
ORDER BY created_at DESC;
\`\`\`

---

## 🎓 PHẦN 6: BEST PRACTICES

### Security

1. **Verify Signatures**:
   \`\`\`typescript
   // Facebook
   const signature = request.headers.get("x-hub-signature-256")
   if (!verifyFacebookSignature(signature, body, FB_APP_SECRET)) {
     return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
   }
   
   // Zalo
   const signature = request.headers.get("X-Zalo-Signature")
   if (!verifyZaloSignature(signature, body, ZALO_APP_SECRET)) {
     return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
   }
   \`\`\`

2. **Rate Limiting**:
   \`\`\`typescript
   // Giới hạn số request từ 1 user
   const userRequests = await rateLimiter.get(userId)
   if (userRequests > 10) {
     return "Bạn đã gửi quá nhiều tin nhắn. Vui lòng chờ 1 phút."
   }
   \`\`\`

3. **Environment Variables**:
   - KHÔNG commit token vào git
   - Dùng Vercel Env Variables
   - Rotate token định kỳ (3-6 tháng)

### Performance

1. **Cache AI Responses**:
   \`\`\`typescript
   // Cache câu hỏi thường gặp
   const cachedResponse = await redis.get(`faq:${messageHash}`)
   if (cachedResponse) return cachedResponse
   \`\`\`

2. **Async Processing**:
   \`\`\`typescript
   // Trả lời ngay, xử lý sau
   await sendQuickReply("Đang xử lý...")
   const aiResponse = await generateAIResponse(...)
   await sendActualResponse(aiResponse)
   \`\`\`

### Monitoring

1. **Track Metrics**:
   - Response time
   - Handover rate
   - Customer satisfaction (thumbs up/down)
   - Popular topics

2. **Error Alerts**:
   - Integrate Sentry
   - Setup alerts trong Vercel
   - Monitor Groq API usage

---

## 📞 SUPPORT

### Khi Gặp Vấn Đề

1. **Check Logs**:
   \`\`\`bash
   vercel logs --follow
   \`\`\`

2. **Test Endpoints**:
   - `/api/webhooks/facebook`
   - `/api/webhooks/zalo`

3. **Verify Environment**:
   \`\`\`bash
   vercel env pull .env.local
   cat .env.local
   \`\`\`

4. **Database Check**:
   - Vào Supabase Dashboard
   - Kiểm tra RLS policies
   - Xem logs database

### Contact

- Email: tech@veximglobal.com
- Zalo: 0123456789
- Facebook: @veximglobal

---

## ✅ CHECKLIST TÍCH HỢP

### Facebook Messenger
- [ ] Tạo Facebook App
- [ ] Kết nối Facebook Page
- [ ] Lấy Page Access Token
- [ ] Setup Webhook URL
- [ ] Verify webhook
- [ ] Subscribe to events
- [ ] Add env variables to Vercel
- [ ] Test gửi tin nhắn
- [ ] Kiểm tra logs
- [ ] Xác nhận bot trả lời

### Zalo OA
- [ ] Đăng ký Zalo OA (chờ duyệt)
- [ ] Tạo Zalo Mini App
- [ ] Lấy Access Token
- [ ] Setup Webhook URL
- [ ] Subscribe to events
- [ ] Add env variables to Vercel
- [ ] Test gửi tin nhắn
- [ ] Kiểm tra logs
- [ ] Xác nhận bot trả lời

### Hệ Thống
- [ ] Groq API key hoạt động
- [ ] Database migrations chạy xong
- [ ] Admin dashboard truy cập được
- [ ] Knowledge base có tài liệu
- [ ] Handover system hoạt động
- [ ] Monitoring setup xong

---

**Chúc bạn tích hợp thành công! 🎉**
