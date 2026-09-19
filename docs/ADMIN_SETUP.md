# Hướng dẫn Tạo Tài Khoản Admin

## Cách truy cập Admin

Bạn có thể truy cập trang đăng nhập admin theo 2 cách:

1. **Từ trang chủ**: Click vào icon "Admin" ở góc phải menu (có icon Shield 🛡️)
2. **Trực tiếp**: Truy cập URL: `/admin/login`

---

## Cách tạo tài khoản Admin

Để tạo tài khoản admin, bạn cần thực hiện 2 bước:

### Bước 1: Tạo user trong Supabase Auth

Có 2 cách:

#### Cách 1: Qua Supabase Dashboard (Khuyên dùng)

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Authentication** → **Users**
4. Click **Add user** → **Create new user**
5. Nhập email và password cho admin
6. Click **Create user**

#### Cách 2: Qua API (Cho developer)

\`\`\`typescript
// Sử dụng Supabase Admin API
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key, KHÔNG phải anon key
)

const { data, error } = await supabaseAdmin.auth.admin.createUser({
  email: 'admin@vexim.com',
  password: 'your-secure-password',
  email_confirm: true // Tự động confirm email
})
\`\`\`

### Bước 2: Thêm user vào bảng admin_users

Sau khi tạo user ở Bước 1, bạn cần thêm email đó vào bảng `admin_users`:

#### Cách 1: Chạy SQL Script trong v0

1. File `scripts/002_create_admin_user.sql` đã được tạo sẵn
2. Mở file đó và sửa email thành email admin của bạn
3. Script sẽ tự động chạy khi deploy

#### Cách 2: Qua Supabase SQL Editor

1. Vào Supabase Dashboard → **SQL Editor**
2. Chạy câu lệnh SQL:

\`\`\`sql
INSERT INTO public.admin_users (email, full_name, role)
VALUES 
  ('admin@vexim.com', 'Tên Admin', 'admin')
ON CONFLICT (email) DO NOTHING;
\`\`\`

Thay đổi:
- `admin@vexim.com` → Email admin của bạn (phải giống với email ở Bước 1)
- `Tên Admin` → Tên hiển thị
- `admin` → Role (admin, editor, hoặc viewer)

---

## Các Role Admin

- **admin**: Toàn quyền, có thể tạo/sửa/xóa bài viết và quản lý admin khác
- **editor**: Có thể tạo/sửa/xóa bài viết
- **viewer**: Chỉ xem, không thể chỉnh sửa

---

## Đăng nhập

1. Truy cập `/admin/login` hoặc click "Admin" ở menu
2. Nhập email và password đã tạo ở Bước 1
3. Click "Đăng nhập"

---

## Lưu ý Bảo mật

- ⚠️ **KHÔNG** chia sẻ Service Role Key với bất kỳ ai
- ⚠️ Chỉ thêm email tin cậy vào bảng `admin_users`
- ✅ Sử dụng password mạnh cho tài khoản admin
- ✅ Row Level Security (RLS) đã được bật để bảo vệ dữ liệu

---

## Xử lý lỗi thường gặp

### "Invalid login credentials"
→ Email hoặc password sai. Kiểm tra lại thông tin đăng nhập.

### "Access denied. Not an admin user."
→ Email chưa được thêm vào bảng `admin_users`. Thực hiện Bước 2 ở trên.

### "User already registered"
→ Email đã tồn tại trong Supabase Auth. Bạn chỉ cần thực hiện Bước 2.

---

## Thêm Admin mới sau này

Để thêm admin mới:

1. Tạo user mới trong Supabase Auth (Bước 1)
2. Chạy SQL:
\`\`\`sql
INSERT INTO public.admin_users (email, full_name, role)
VALUES ('email-moi@vexim.com', 'Tên Admin Mới', 'editor');
\`\`\`

---

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
- Environment variables đã được thêm chưa (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Supabase project đã được connect chưa
- RLS policies đã được tạo chưa (tự động tạo khi chạy script)
