# Hệ thống Quản lý Đăng ký FDA

## Tổng quan

Hệ thống quản lý đăng ký FDA được thiết kế để theo dõi và quản lý các đăng ký FDA của khách hàng, bao gồm:

- Thông tin công ty và người liên hệ
- Thông tin đăng ký FDA (Registration Number, FEI, DUNS)
- **Thông tin đăng nhập FDA được mã hóa** (User ID, Password, PIN) theo chuẩn ISO 27001
- Thông tin US Agent (nếu có)
- Hệ thống nhắc nhở tự động trước kỳ gia hạn (3-6 tháng)
- Nhắc nhở gia hạn hợp đồng US Agent (động theo số năm đăng ký)

## Tính năng chính

### 1. Quản lý đăng ký FDA

#### Thông tin lưu trữ:

- **Thông tin công ty**: Tên, địa chỉ, điện thoại, email
- **Thông tin liên hệ**: Người liên hệ, chức danh, email
- **Thông tin đăng ký**:
  - Loại đăng ký (Food Facility, Drug, Device, Cosmetic, etc.)
  - Số đăng ký FDA
  - FEI Number
  - DUNS Number
  - Ngày đăng ký, gia hạn, hết hạn
- **Thông tin đăng nhập FDA** (được mã hóa AES-256):
  - FDA User ID
  - FDA Password
  - FDA PIN
- **Thông tin US Agent**:
  - Tên công ty Agent
  - Người liên hệ
  - Ngày bắt đầu/kết thúc hợp đồng
  - Số năm hợp đồng (1, 2, 3, 4, 5 hoặc nhiều hơn)

### 2. Bảo mật thông tin (ISO 27001)

#### Mã hóa dữ liệu nhạy cảm:

Hệ thống sử dụng **AES-256 encryption** thông qua PostgreSQL `pgcrypto` extension:

\`\`\`sql
-- Mã hóa
SELECT encrypt_fda_credential('sensitive_data', encryption_key);

-- Giải mã (chỉ khi cần thiết)
SELECT decrypt_fda_credential(encrypted_data, encryption_key);
\`\`\`

#### Các biện pháp bảo mật:

1. **Mã hóa tại database level**: Dữ liệu được mã hóa trước khi lưu vào database
2. **Encryption key riêng biệt**: Key lưu trong environment variables, không commit vào Git
3. **RLS (Row Level Security)**: Chỉ admin được phép truy cập
4. **Audit trail**: Theo dõi created_by, created_at, updated_at
5. **Giải mã có kiểm soát**: Chỉ giải mã khi user yêu cầu xem credentials (query param `?credentials=true`)

### 3. Hệ thống nhắc nhở tự động

#### Nhắc nhở gia hạn FDA:

- Tự động gửi email trước **3-6 tháng** (có thể tùy chỉnh) khi đến kỳ gia hạn
- Đối với thực phẩm: Thường gia hạn vào các năm chẵn (2024, 2026, etc.)
- Email chứa:
  - Thông tin công ty
  - Loại đăng ký
  - Số đăng ký FDA
  - Ngày hết hạn (highlight màu đỏ)
  - Link liên hệ gia hạn

#### Nhắc nhở gia hạn US Agent:

- Tự động tính toán dựa trên số năm hợp đồng
- Nhắc trước **3 tháng** khi hợp đồng Agent sắp hết hạn
- Email chứa:
  - Thông tin Agent hiện tại
  - Ngày hết hạn hợp đồng
  - Thời hạn hợp đồng (1, 2, 3, 4, 5 năm)
  - Link gia hạn/đăng ký Agent mới

#### Cron Job:

\`\`\`json
{
  "path": "/api/fda-registrations/send-reminders",
  "schedule": "0 9 * * *"
}
\`\`\`

Chạy **mỗi ngày lúc 9:00 AM** để:
1. Generate reminders cho các registration sắp hết hạn
2. Gửi email cho các reminder pending
3. Cập nhật trạng thái reminder (sent/failed)

### 4. Tự động cập nhật trạng thái

Hệ thống tự động cập nhật trạng thái registration dựa trên ngày hết hạn:

- **active**: Còn hơn 6 tháng
- **pending_renewal**: Còn ít hơn 6 tháng
- **expired**: Đã quá ngày hết hạn
- **cancelled**: Đã hủy bỏ (manual)

## Cài đặt

### 1. Chạy migration SQL

\`\`\`bash
# Tạo bảng và functions
psql -h your_host -U your_user -d your_db -f scripts/022_create_fda_registrations.sql
\`\`\`

Hoặc chạy qua Supabase SQL Editor.

### 2. Tạo Encryption Key

\`\`\`bash
# Generate encryption key
openssl rand -base64 32
\`\`\`

Thêm vào `.env.local`:

\`\`\`env
FDA_ENCRYPTION_KEY=your_generated_32_byte_key_here
CRON_SECRET=your_cron_secret_here
\`\`\`

**⚠️ LƯU Ý**: 
- KHÔNG commit encryption key vào Git
- Lưu key an toàn, nếu mất key sẽ không thể giải mã dữ liệu
- Backup key vào hệ thống quản lý secrets (1Password, LastPass, etc.)

### 3. Cấu hình Vercel Cron

Cron job đã được thêm vào `vercel-cron.json`:

\`\`\`json
{
  "path": "/api/fda-registrations/send-reminders",
  "schedule": "0 9 * * *"
}
\`\`\`

Sau khi deploy, cron sẽ tự động chạy hàng ngày.

## Sử dụng

### Admin Panel

Truy cập: `/admin/fda-registrations`

#### Chức năng:

1. **Xem danh sách**: Hiển thị tất cả registrations với filter theo status
2. **Tìm kiếm**: Theo tên công ty hoặc số đăng ký
3. **Thêm mới**: Form nhập đầy đủ thông tin
4. **Xem chi tiết**: Xem thông tin registration
5. **Chỉnh sửa**: Cập nhật thông tin
6. **Xóa**: Xóa registration (có confirm)
7. **Xem credentials**: Giải mã và hiển thị FDA credentials (cần quyền admin)

#### Thống kê dashboard:

- Tổng số registrations
- Số lượng đang hoạt động
- Số lượng sắp hết hạn (warning)
- Số lượng đã hết hạn (danger)

### API Endpoints

#### 1. Lấy danh sách registrations

\`\`\`bash
GET /api/fda-registrations?status=active&search=company_name
\`\`\`

**Query parameters**:
- `status`: all | active | pending_renewal | expired | cancelled
- `search`: Tìm theo company_name hoặc registration_number

#### 2. Tạo registration mới

\`\`\`bash
POST /api/fda-registrations
Content-Type: application/json

{
  "company_name": "ABC Company",
  "company_address": "123 Street",
  "contact_name": "John Doe",
  "contact_email": "john@abc.com",
  "registration_type": "Food Facility",
  "expiration_date": "2026-12-31",
  "fda_user_id": "user123",
  "fda_password": "pass123",
  "fda_pin": "1234",
  "uses_us_agent": true,
  "agent_contract_years": 3,
  ...
}
\`\`\`

#### 3. Lấy chi tiết registration

\`\`\`bash
# Không có credentials
GET /api/fda-registrations/{id}

# Có credentials (giải mã)
GET /api/fda-registrations/{id}?credentials=true
\`\`\`

#### 4. Cập nhật registration

\`\`\`bash
PUT /api/fda-registrations/{id}
Content-Type: application/json

{
  "company_name": "Updated Name",
  "fda_password": "new_password",
  ...
}
\`\`\`

#### 5. Xóa registration

\`\`\`bash
DELETE /api/fda-registrations/{id}
\`\`\`

#### 6. Gửi nhắc nhở (manual trigger)

\`\`\`bash
POST /api/fda-registrations/send-reminders
Authorization: Bearer YOUR_CRON_SECRET
\`\`\`

## Database Schema

### Table: `fda_registrations`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| company_name | TEXT | Tên công ty |
| registration_type | TEXT | Loại đăng ký |
| registration_number | TEXT | Số đăng ký FDA |
| expiration_date | DATE | Ngày hết hạn |
| fda_user_id_encrypted | BYTEA | FDA User ID (encrypted) |
| fda_password_encrypted | BYTEA | FDA Password (encrypted) |
| fda_pin_encrypted | BYTEA | FDA PIN (encrypted) |
| uses_us_agent | BOOLEAN | Có sử dụng US Agent |
| agent_contract_years | INTEGER | Số năm hợp đồng Agent |
| reminder_months_before | INTEGER | Nhắc trước bao nhiêu tháng |
| status | TEXT | active/pending_renewal/expired/cancelled |
| ... | | Các trường khác |

### Table: `fda_renewal_reminders`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| registration_id | UUID | FK to fda_registrations |
| reminder_type | TEXT | fda_renewal / agent_renewal |
| reminder_date | DATE | Ngày cần gửi reminder |
| months_before | INTEGER | Số tháng trước hết hạn |
| status | TEXT | pending / sent / failed |
| sent_at | TIMESTAMP | Thời điểm gửi |
| ... | | Các trường khác |

## Best Practices

### Bảo mật

1. **Không log credentials**: Không log FDA credentials ra console hoặc file
2. **HTTPS only**: Luôn sử dụng HTTPS khi truyền credentials
3. **Rotate keys định kỳ**: Thay đổi encryption key 6-12 tháng/lần
4. **Audit access**: Log mọi lần access credentials (WHO, WHEN, WHY)
5. **Restrict API access**: Chỉ admin được phép gọi API

### Quản lý Reminders

1. **Test trước khi production**: Test email templates với test data
2. **Monitor cron logs**: Kiểm tra logs để đảm bảo cron chạy đúng
3. **Handle failures**: Có retry mechanism cho failed reminders
4. **Update contacts**: Đảm bảo contact email luôn up-to-date

### Data Management

1. **Backup encryption key**: Lưu key ở nhiều nơi an toàn
2. **Regular backups**: Backup database định kỳ
3. **Soft delete**: Xem xét soft delete thay vì hard delete
4. **Archive old data**: Archive các registration đã expired lâu

## Troubleshooting

### Email không được gửi

1. Kiểm tra SMTP credentials trong `.env.local`
2. Kiểm tra cron secret đúng chưa
3. Xem logs tại `/admin/cron-monitor`
4. Test manual trigger: `POST /api/fda-registrations/send-reminders`

### Không giải mã được credentials

1. Kiểm tra `FDA_ENCRYPTION_KEY` có đúng không
2. Key có bị thay đổi so với lúc encrypt không?
3. Data có bị corrupt không?

### Cron job không chạy

1. Kiểm tra `vercel-cron.json` đã deploy chưa
2. Xem Vercel dashboard > Cron Jobs
3. Kiểm tra timezone của cron schedule

## Support

Liên hệ team development nếu cần hỗ trợ:
- Email: dev@veximglobal.com
- Hotline: 0373 685 634
