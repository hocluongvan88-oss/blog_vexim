# 🔧 Hướng dẫn cấu hình Email với Zoho Mail

## 📋 Tổng quan

Hệ thống email tự động sẽ:
- ✅ Gửi email xác nhận cho khách hàng ngay lập tức
- ✅ Gửi thông báo lead mới đến admin
- ✅ Bảo vệ chống spam/bot với honeypot + rate limiting
- ✅ Validation dữ liệu (email, số điện thoại Việt Nam)

---

## 🚀 Bước 1: Tạo App Password trên Zoho Mail

### Tại sao cần App Password?

App Password an toàn hơn mật khẩu thông thường và cho phép ứng dụng bên thứ 3 gửi email mà không cần chia sẻ mật khẩu chính.

### Các bước thực hiện:

1. **Đăng nhập Zoho Mail**
   - Truy cập: https://mail.zoho.com
   - Đăng nhập bằng tài khoản Zoho của bạn

2. **Vào phần Security Settings**
   - Click vào icon bánh răng (⚙️) ở góc trên phải
   - Chọn **Settings** → **Security** → **Application-Specific Passwords**

3. **Tạo App Password mới**
   - Click **Generate New Password**
   - Đặt tên: `Vexim Website` (hoặc tên bạn muốn)
   - Click **Generate**
   - **SAO CHÉP** password ngay (chỉ hiển thị 1 lần!)
   - Lưu vào nơi an toàn

---

## 🔐 Bước 2: Cấu hình Environment Variables

### Local Development (Máy tính của bạn):

1. Tạo file `.env.local` trong thư mục gốc của project:

\`\`\`bash
# Copy file mẫu
cp .env.example .env.local
\`\`\`

2. Mở `.env.local` và điền thông tin:

\`\`\`env
ZOHO_EMAIL=info@vexim.vn
ZOHO_PASSWORD=abcd1234efgh5678ijkl  # App Password vừa tạo
ADMIN_EMAIL=admin@vexim.vn           # Email nhận thông báo lead
\`\`\`

3. **LƯU Ý**: File `.env.local` đã được thêm vào `.gitignore`, không bao giờ commit lên Git!

---

### Production (Vercel):

1. **Vào Vercel Dashboard**
   - Truy cập: https://vercel.com
   - Chọn project của bạn

2. **Thêm Environment Variables**
   - Vào **Settings** → **Environment Variables**
   - Thêm 3 biến sau:

| Name | Value | Example |
|------|-------|---------|
| `ZOHO_EMAIL` | Email Zoho của bạn | info@vexim.vn |
| `ZOHO_PASSWORD` | App Password từ Zoho | abcd1234efgh5678 |
| `ADMIN_EMAIL` | Email nhận thông báo | admin@vexim.vn |

3. **Apply cho tất cả Environments**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Redeploy**
   - Sau khi thêm biến, click **Redeploy** để áp dụng

---

## 🧪 Bước 3: Test hệ thống

### Test trên Local:

\`\`\`bash
npm run dev
\`\`\`

1. Mở http://localhost:3000
2. Điền form đăng ký tư vấn
3. Submit và kiểm tra:
   - ✉️ Email xác nhận đến khách hàng
   - 📬 Email thông báo đến admin
   - ✅ Thông báo thành công trên UI

### Test trên Production:

Sau khi deploy lên Vercel, làm tương tự và kiểm tra email.

---

## 🛡️ Tính năng bảo mật đã tích hợp

### 1. **Honeypot Field**
- Field ẩn `website` để bắt bot tự động
- Bot thường tự động điền tất cả field → bị reject

### 2. **Rate Limiting**
- Giới hạn: **3 lần submit/giờ** trên mỗi IP
- Ngăn chặn spam hàng loạt

### 3. **Validation**
- Email: Regex kiểm tra format chuẩn
- Số điện thoại: Chỉ chấp nhận số Việt Nam (0xxx hoặc +84xxx)
- Required fields: Name, Phone, Email

### 4. **Sanitization**
- Dữ liệu được clean trước khi lưu/gửi email
- Ngăn chặn XSS và injection attacks

---

## 📧 Mẫu Email

### Email cho khách hàng:
- ✅ Thiết kế HTML responsive, đẹp mắt
- ✅ Xác nhận thông tin đã đăng ký
- ✅ Cam kết phản hồi trong 24h
- ✅ Thông tin liên hệ nhanh (hotline, email)
- ✅ Branding Vexim Global đầy đủ

### Email cho Admin:
- 🎯 Thông báo lead mới ngay lập tức
- 📋 Đầy đủ thông tin: tên, SĐT, email, dịch vụ
- ⏰ Timestamp (giờ Việt Nam)
- 🔗 Link clickable để gọi/email trực tiếp

---

## 🔧 Troubleshooting

### Lỗi: "Authentication failed"

**Nguyên nhân**: Sai email hoặc App Password

**Giải pháp**:
1. Kiểm tra lại `ZOHO_EMAIL` có đúng không
2. Tạo lại App Password trên Zoho
3. Đảm bảo không có khoảng trắng trong password

---

### Lỗi: "Connection timeout"

**Nguyên nhân**: Firewall chặn port 465

**Giải pháp**:
- Thử đổi port sang 587 và secure: false trong code
- Kiểm tra firewall/antivirus trên máy

---

### Lỗi: "Rate limit exceeded"

**Nguyên nhân**: Submit quá nhiều lần trong 1 giờ

**Giải pháp**:
- Đợi 1 giờ để reset
- Hoặc xóa IP khỏi rate limit tracker (restart server)

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. ✅ Environment variables đã đúng chưa
2. ✅ App Password có hợp lệ không
3. ✅ Internet connection ổn định không
4. ✅ Console logs có lỗi gì không

---

## 🎉 Hoàn tất!

Hệ thống email đã sẵn sàng hoạt động! Mọi form submission sẽ tự động gửi email cho cả khách hàng và admin.

**Lưu ý cuối**: Nên test kỹ trên staging trước khi chạy production để đảm bảo mọi thứ hoạt động tốt.
\`\`\`
