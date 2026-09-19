# Web Push Notifications - Hướng Dẫn Cài Đặt

## Tính năng đã xây dựng

Hệ thống Web Push Notifications đã được tích hợp hoàn chỉnh với các tính năng:

### 1. Browser Push Notifications (Web Push)
✅ Thông báo hiển thị ngoài trình duyệt ngay cả khi admin không mở tab
✅ Hoạt động trên cả desktop và mobile
✅ Có thể click để mở trực tiếp cuộc hội thoại
✅ Hỗ trợ Chrome, Firefox, Edge, Opera, Safari (macOS 16.1+)
✅ Service Worker để xử lý notifications khi offline
✅ VAPID authentication để bảo mật

### 2. Email Notifications
✅ Gửi email tự động khi có khách hàng mới được AI chuyển qua
✅ Email HTML đẹp với thông tin đầy đủ
✅ Quản lý danh sách email nhận thông báo
✅ Tích hợp với Resend API

## Files đã tạo

\`\`\`
/public/
  ├── sw.js                                    # Service Worker
  ├── manifest.json                            # PWA Manifest
  ├── icon-192.png                            # App icon 192x192
  ├── icon-512.png                            # App icon 512x512
  └── badge-72.png                            # Notification badge

/hooks/
  └── use-push-notification.ts                # React hook for push

/components/admin/
  ├── push-notification-settings.tsx          # UI quản lý push
  └── notification-settings.tsx               # UI quản lý email (đã có)

/app/api/notifications/
  └── send-push/route.ts                      # API gửi push

/scripts/
  └── 014_create_push_subscriptions.sql       # Database schema

/lib/
  └── notification-service.tsx                # Service đã update
\`\`\`

## Cách sử dụng

### 1. Cài đặt package

\`\`\`bash
npm install web-push
# hoặc
yarn add web-push
# hoặc
pnpm add web-push
\`\`\`

### 2. Tạo VAPID Keys (Bắt buộc cho production)

\`\`\`bash
npx web-push generate-vapid-keys
\`\`\`

Output sẽ như sau:
\`\`\`
Public Key: BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xYjNBM...
Private Key: UzQbzQLV3rPf7cT8Qh6s1WKmJN9FGBdX2YP0vLkCnHI
\`\`\`

### 3. Thêm Environment Variables

Thêm vào `.env.local`:

\`\`\`env
# Web Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xYjNBM...
VAPID_PRIVATE_KEY=UzQbzQLV3rPf7cT8Qh6s1WKmJN9FGBdX2YP0vLkCnHI
VAPID_EMAIL=admin@vexim.com

# Internal API Key (để gọi API send-push)
INTERNAL_API_KEY=vexim-internal-api-key-change-this-in-production

# Email Notifications (đã có)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Site URL
NEXT_PUBLIC_SITE_URL=https://vexim.vn
\`\`\`

### 4. Chạy SQL Script

Chạy script để tạo bảng `push_subscriptions`:

\`\`\`sql
-- Trong Supabase SQL Editor hoặc từ v0
\i scripts/014_create_push_subscriptions.sql
\`\`\`

### 5. Bật thông báo trong Admin Settings

1. Đăng nhập vào Admin Dashboard: `/admin`
2. Vào **Settings** → Tab **Thông báo**
3. Trong phần **Thông Báo Push**:
   - Click "Bật thông báo push"
   - Cho phép quyền notification khi trình duyệt hỏi
   - Test bằng button "Gửi thông báo test"
4. Trong phần **Thông Báo Email**:
   - Thêm email của admin cần nhận thông báo
   - Click "Lưu cấu hình"

## Cách hoạt động

### Flow khi có khách hàng mới:

1. AI bot quyết định chuyển cuộc hội thoại cho agent
2. `notifyAdminNewHandover()` được gọi trong `/app/api/chatbot/send-ai/route.ts`
3. Hệ thống gửi đồng thời:
   - **Web Push**: Qua `/api/notifications/send-push`
     - Lấy tất cả push subscriptions từ database
     - Gửi notification qua `web-push` library
     - Admin nhận thông báo ngay lập tức
   - **Email**: Qua Resend API
     - Lấy danh sách email từ `ai_config`
     - Gửi email HTML với thông tin chi tiết
     - Admin nhận email sau vài giây
4. Admin click vào notification → Mở trực tiếp cuộc hội thoại

### Service Worker Flow:

\`\`\`
Browser                Service Worker           Server
   |                         |                      |
   |-- Register SW ----------|                      |
   |                         |                      |
   |-- Subscribe Push ------>|                      |
   |                         |-- Save to DB ------->|
   |                         |                      |
   |                         |<-- Push Event -------|
   |<-- Show Notification ---|                      |
   |                         |                      |
   |-- Click Notification -->|                      |
   |<-- Open/Focus Tab ------|                      |
\`\`\`

## Test thông báo

### Test Push Notification:

1. Vào `/admin/settings` → Tab Thông báo
2. Click "Gửi thông báo test"
3. Bạn sẽ thấy notification hiện lên

### Test tích hợp với AI Bot:

1. Mở chat widget trên website
2. Hỏi câu hỏi phức tạp hoặc nói "Tôi muốn nói chuyện với người thật"
3. AI sẽ chuyển qua agent
4. Admin sẽ nhận:
   - Web Push notification (ngay lập tức)
   - Email notification (sau vài giây)

## Troubleshooting

### Push notifications không hoạt động:

1. **Kiểm tra browser support**:
   - Chrome/Edge: ✅ Hỗ trợ đầy đủ
   - Firefox: ✅ Hỗ trợ đầy đủ
   - Safari: ⚠️ Chỉ macOS 16.1+ và iOS 16.4+
   - iOS Safari: ⚠️ Yêu cầu Add to Home Screen

2. **Kiểm tra permissions**:
   - Vào browser settings → Notifications
   - Đảm bảo site được cho phép gửi notifications

3. **Kiểm tra Service Worker**:
   \`\`\`javascript
   // Trong browser console
   navigator.serviceWorker.getRegistrations().then(regs => {
     console.log('Service Workers:', regs)
   })
   \`\`\`

4. **Kiểm tra VAPID keys**:
   - Đảm bảo PUBLIC và PRIVATE key khớp nhau
   - Không share PRIVATE key

### Email notifications không hoạt động:

1. Kiểm tra `RESEND_API_KEY` có đúng không
2. Verify domain email với Resend
3. Kiểm tra spam folder

## Production Checklist

- [ ] Generate VAPID keys mới (không dùng keys mặc định)
- [ ] Thêm VAPID keys vào Vercel Environment Variables
- [ ] Thêm `RESEND_API_KEY` vào Vercel
- [ ] Verify domain email với Resend
- [ ] Đổi `INTERNAL_API_KEY` thành key bảo mật
- [ ] Test trên production URL
- [ ] Kiểm tra HTTPS (bắt buộc cho Push API)
- [ ] Test trên nhiều trình duyệt/thiết bị

## Browser Compatibility

| Browser | Desktop | Mobile | PWA Required |
|---------|---------|--------|--------------|
| Chrome  | ✅ 42+  | ✅ 42+ | ❌           |
| Firefox | ✅ 44+  | ✅ 44+ | ❌           |
| Safari  | ✅ 16.1+| ✅ 16.4+| ✅ (iOS)    |
| Edge    | ✅ 17+  | ✅ 17+ | ❌           |
| Opera   | ✅ 29+  | ✅ 29+ | ❌           |

## Security Notes

⚠️ **QUAN TRỌNG**:
- Không commit VAPID Private Key vào Git
- Không share VAPID keys công khai
- Sử dụng HTTPS trong production (Push API yêu cầu)
- Rotate API keys định kỳ
- Giới hạn rate limiting cho `/api/notifications/send-push`

## Next Steps

Sau khi setup xong, bạn có thể:
- [ ] Customize notification UI/sound
- [ ] Thêm notification preferences cho từng admin
- [ ] Tích hợp với analytics để track click-through rate
- [ ] Thêm rich notifications với images
- [ ] Schedule notifications
- [ ] Group notifications theo conversation

## Support

Nếu có vấn đề, kiểm tra:
1. Browser console cho errors
2. Service Worker status tại `chrome://serviceworker-internals`
3. Network tab để xem API calls
4. Supabase logs để debug database

---

**Tác giả**: v0.dev  
**Ngày tạo**: 2026-01-20  
**Version**: 1.0.0
