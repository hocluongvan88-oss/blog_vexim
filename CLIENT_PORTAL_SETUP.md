# Client Portal & Management System

Hệ thống quản lý khách hàng và cổng thông tin cho khách hàng xem thông tin đăng ký FDA.

## Tổng quan

Hệ thống hiện chỉ còn **Client Portal**: khách hàng đăng nhập để xem thông tin FDA registrations và tài liệu của họ.

> **Đã gỡ (11/2026):** các trang quản trị `/admin/clients`, `/admin/fda-registrations`, `/admin/gacc-submissions`, `/admin/news-crawler` cùng API `/api/clients*`, `/api/fda-registrations*`, `/api/gacc*`, `/api/news*` và cron gửi email nhắc hạn FDA. Tài khoản khách hàng nay tạo trực tiếp bằng SQL (xem `scripts/create_client_manual.mjs`), dữ liệu vẫn nằm trong Supabase.

## Database Schema

### Bảng `clients`
- Lưu trữ thông tin tài khoản khách hàng
- Mật khẩu được hash với bcrypt
- Có thể active/inactive account

### Bảng `client_sessions`
- Quản lý phiên đăng nhập của khách hàng
- Token expire sau 7 ngày
- Tự động cleanup expired sessions

### Bảng `client_notification_preferences`
- Cài đặt thông báo cho từng khách hàng
- Email/Zalo notification
- Số ngày nhắc trước khi hết hạn

### Cập nhật `fda_registrations`
- Thêm `client_id` để liên kết với khách hàng
- RLS policy cho phép khách hàng chỉ xem registrations của họ

## Setup

### 1. Chạy Migration

\`\`\`bash
# Chạy script tạo client management system
psql -h your-db-host -U your-user -d your-db -f scripts/023_create_client_accounts.sql
\`\`\`

### 2. Admin Functions

#### Tạo tài khoản khách hàng mới

Trang quản trị đã bị gỡ, nên tài khoản khách hàng được tạo trực tiếp trong database bằng script sinh hash mật khẩu:

\`\`\`bash
node scripts/create_client_manual.mjs
\`\`\`

Script in ra câu `INSERT INTO clients (...)` với `password_hash` (scrypt) để chạy trên Supabase SQL editor.

#### Liên kết FDA Registration với Client

Cập nhật trực tiếp cột `client_id` của bảng `fda_registrations` trong Supabase SQL editor. Không còn API quản trị nào ghi vào bảng này.

### 3. Client Portal Access

#### Client Login

Khách hàng truy cập: `https://www.veximglobal.com/client-portal/login`

API:
\`\`\`
POST /api/client-auth/login
{
  "email": "client@example.com",
  "password": "password"
}

Response:
{
  "client": {
    "id": "uuid",
    "email": "client@example.com",
    "company_name": "ABC Company",
    "contact_name": "John Doe"
  },
  "token": "session_token"
}
\`\`\`

Session token được lưu trong HTTP-only cookie và expire sau 7 ngày.

#### Client Dashboard

Sau khi đăng nhập, khách hàng có thể:

1. **Xem danh sách FDA Registrations của họ**
   - Registration number
   - Product category
   - Expiry dates (FDA & US Agent)
   - Status

2. **Nhận thông báo tự động**
   - Email nhắc nhở trước 3-6 tháng khi FDA hết hạn
   - Email nhắc nhở khi US Agent hết hạn
   - Zalo notification (nếu enable)

3. **Quản lý notification preferences**
   - Enable/disable email hoặc Zalo
   - Tùy chỉnh số ngày nhắc trước

## API Endpoints

### Admin APIs

Không còn API quản trị khách hàng/đăng ký FDA (đã gỡ cùng các trang `/admin/clients` và `/admin/fda-registrations`).

### Client APIs (Requires Client Auth)

#### Authentication
- `POST /api/client-auth/login` - Login
- `POST /api/client-auth/logout` - Logout
- `GET /api/client-auth/me` - Get current client info

#### View Registrations & Documents
- `GET /api/client-auth/registrations` - Danh sách đăng ký FDA của chính khách hàng
- `GET /api/client-auth/documents` - Tài liệu/chứng nhận của chính khách hàng

## Security Features

### 1. Password Security
- Passwords hashed with bcrypt (10 rounds)
- Never returned in API responses
- Can be reset by admin

### 2. Session Management
- HTTP-only cookies
- 7-day expiration
- Automatic cleanup of expired sessions
- Token-based authentication

### 3. Row Level Security (RLS)
- Clients can only see their own data
- Admins have full access
- Enforced at database level

### 4. FDA Credentials Encryption
- FDA User ID/Password/PIN encrypted with AES-256
- Encryption key stored in environment variables
- Meets ISO 27001 standards

## Notification System

### Auto Reminders

Cron nhắc hạn tự động (`/api/fda-registrations/send-reminders` + `vercel-cron.json`), hai email nhắc hạn FDA/US Agent (`lib/email-fda-registration.tsx`) **đã bị gỡ** (11/2026) cùng trang quản lý đăng ký FDA. Việc nhắc hạn hiện do chuyên viên thực hiện thủ công; nếu cần bật lại, phải dựng lại API + template và thêm lại cron.

### Email Templates còn dùng

- `lib/email-consultation.tsx` — xác nhận yêu cầu tư vấn cho khách + thông báo lead mới cho admin

### Zalo Integration (Optional)

Nếu client enable Zalo notifications:
- Gửi qua Zalo OA
- Require Zalo phone number
- Same timing as email

## Client Portal Features

### Dashboard
- Overview of all registrations
- Status indicators (active, expiring soon, expired)
- Expiry timeline

### Registration Details
- Full registration information
- Document history
- Renewal history

### Notification Settings
- Toggle email/Zalo
- Customize reminder days
- Save preferences

## Best Practices

### For Admins

1. **Creating Clients**
   - Use strong passwords (min 8 characters)
   - Verify email before creating
   - Link registrations immediately after creating client

2. **Managing Registrations**
   - Always assign to a client_id
   - Keep expiry dates accurate
   - Update status regularly

3. **Security**
   - Never share FDA credentials over email
   - Use encrypted channels for sensitive data
   - Regularly audit client access

### For Clients

1. **Login Security**
   - Use strong passwords
   - Don't share credentials
   - Logout after use

2. **Monitoring**
   - Check portal regularly
   - Update notification preferences
   - Report any issues immediately

## Troubleshooting

### Client Can't Login
1. Check if account is active
2. Verify password is correct
3. Check if session expired
4. Contact admin to reset password

### Not Receiving Reminders
1. Check notification preferences
2. Verify email address
3. Check spam folder
4. Ensure registration has valid expiry dates

### Can't See Registrations
1. Verify client_id is linked to registrations
2. Check RLS policies
3. Ensure account is active

## Future Enhancements

1. Self-service password reset
2. Multi-factor authentication
3. Document upload from client portal
4. Renewal request workflow
5. Payment integration
6. Mobile app

## Support

For issues or questions:
- Admin: Contact system administrator
- Clients: Email support@veximglobal.com or call +84-XXX-XXX-XXX
