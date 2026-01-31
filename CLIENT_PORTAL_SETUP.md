# Client Portal & Management System

Hệ thống quản lý khách hàng và cổng thông tin cho khách hàng xem thông tin đăng ký FDA.

## Tổng quan

Hệ thống bao gồm 2 phần chính:

1. **Admin Client Management**: Admin tạo và quản lý tài khoản khách hàng
2. **Client Portal**: Khách hàng đăng nhập để xem thông tin FDA registrations của họ

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

Admin có thể tạo client account thông qua trang `/admin/clients`:

\`\`\`
POST /api/clients
{
  "email": "client@example.com",
  "password": "secure_password",
  "company_name": "ABC Company",
  "contact_name": "John Doe",
  "phone": "+84123456789",
  "address": "123 Main St, Ho Chi Minh City"
}
\`\`\`

#### Liên kết FDA Registration với Client

Khi tạo hoặc cập nhật FDA registration, thêm `client_id`:

\`\`\`
POST /api/fda-registrations
{
  "client_id": "uuid-of-client",
  "company_name": "ABC Company",
  "fda_registration_number": "12345678",
  // ... other fields
}
\`\`\`

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

### Admin APIs (Requires Admin Auth)

#### Client Management
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/[id]` - Get client details
- `PATCH /api/clients/[id]` - Update client
- `DELETE /api/clients/[id]` - Delete client

#### FDA Registration Management
- `GET /api/fda-registrations` - List registrations (can filter by client_id)
- `POST /api/fda-registrations` - Create registration (include client_id)
- `PATCH /api/fda-registrations/[id]` - Update registration

### Client APIs (Requires Client Auth)

#### Authentication
- `POST /api/client-auth/login` - Login
- `POST /api/client-auth/logout` - Logout
- `GET /api/client-auth/me` - Get current client info

#### View Registrations
- `GET /api/fda-registrations?client=me` - Get own registrations only

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

Cron job chạy hàng ngày (`/api/fda-registrations/send-reminders`):

1. **FDA Registration Reminders**
   - Gửi 180 ngày trước (6 tháng)
   - Gửi 90 ngày trước (3 tháng)
   - Gửi 30 ngày trước (1 tháng)
   - Gửi khi hết hạn

2. **US Agent Reminders**
   - Động theo số năm hợp đồng (1-5+ năm)
   - Nhắc trước 90 ngày
   - Nhắc trước 30 ngày
   - Nhắc khi hết hạn

### Email Templates

Emails bao gồm:
- Thông tin registration sắp hết hạn
- Link đến client portal
- Contact information
- Call-to-action để gia hạn

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
