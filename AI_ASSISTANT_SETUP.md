# Hướng dẫn cài đặt AI Writing Assistant

AI Writing Assistant sử dụng Groq API để cung cấp các tính năng hỗ trợ viết nội dung. Để kích hoạt tính năng này, bạn cần cấu hình API key.

## Bước 1: Đăng ký tài khoản Groq

1. Truy cập [https://console.groq.com](https://console.groq.com)
2. Đăng ký tài khoản mới (hoặc đăng nhập nếu đã có)
3. Groq cung cấp free tier rất hào phóng cho các ứng dụng

## Bước 2: Tạo API Key

1. Sau khi đăng nhập, vào mục **API Keys**
2. Nhấn **Create API Key**
3. Đặt tên cho key (ví dụ: "Vexim Blog AI Assistant")
4. Copy API key (chỉ hiển thị 1 lần duy nhất!)

## Bước 3: Cấu hình trong dự án

### Phát triển local (Development)

Thêm vào file `.env.local`:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Triển khai trên Vercel (Production)

1. Vào project settings trên Vercel Dashboard
2. Chọn tab **Environment Variables**
3. Thêm biến mới:
   - **Name**: `GROQ_API_KEY`
   - **Value**: (paste API key của bạn)
   - **Environment**: Production, Preview, Development
4. Nhấn **Save**
5. Redeploy project để áp dụng

## Bước 4: Kiểm tra

1. Vào trang tạo bài viết mới: `/admin/posts/new`
2. Nhập một số nội dung vào editor
3. Chọn văn bản và thử các tính năng AI:
   - Cải thiện văn phong
   - Rút ngắn văn bản
   - Mở rộng ý tưởng
   - Thêm từ khóa SEO
   - Tạo Meta Description
   - Đề xuất Tags

## Tính năng AI Writing Assistant

### 1. Cải thiện văn phong
- Tự động làm mượt văn bản
- Chuyên nghiệp hơn, dễ đọc hơn
- Giữ nguyên ý nghĩa gốc

### 2. Rút ngắn văn bản
- Cắt giảm 30-50% độ dài
- Giữ lại thông tin quan trọng
- Loại bỏ từ ngữ thừa

### 3. Mở rộng ý tưởng
- Thêm chi tiết, ví dụ cụ thể
- Tăng độ dài 150-200%
- Phong phú hóa nội dung

### 4. Thêm từ khóa SEO
- Tối ưu cho công cụ tìm kiếm
- Tự nhiên, không kỳ quặc
- Focus vào xuất nhập khẩu, FDA, GACC, MFDS

### 5. Tạo Meta Description
- Độ dài tối ưu 150-160 ký tự
- Chứa từ khóa chính
- Hấp dẫn, kêu gọi hành động

### 6. Đề xuất Tags
- 5-8 tags phù hợp
- Dựa trên nội dung bài viết
- Liên quan đến lĩnh vực xuất nhập khẩu

## Khắc phục sự cố

### Lỗi: "GROQ_API_KEY chưa được cấu hình"

**Nguyên nhân**: Chưa thêm API key vào environment variables

**Giải pháp**:
1. Kiểm tra file `.env.local` (local) hoặc Vercel settings (production)
2. Đảm bảo tên biến chính xác: `GROQ_API_KEY`
3. Không có khoảng trắng thừa
4. Restart development server sau khi thêm biến

### Lỗi: "AI request failed"

**Nguyên nhân**: API key không hợp lệ hoặc hết quota

**Giải pháp**:
1. Kiểm tra API key còn hoạt động trên Groq Console
2. Kiểm tra quota sử dụng
3. Tạo API key mới nếu cần

### Button không phản hồi

**Kiểm tra**:
1. Mở Developer Console (F12)
2. Xem tab Console có lỗi gì không
3. Xem tab Network để kiểm tra request/response

## Mô hình AI sử dụng

- **Model**: `llama-3.3-70b-versatile`
- **Provider**: Groq (ultra-fast inference)
- **Language**: Tiếng Việt
- **Use cases**: Content writing, SEO optimization

## Giới hạn sử dụng

- Free tier: ~6,000 requests/minute
- Không cần thẻ tín dụng cho free tier
- Rất phù hợp cho blog và CMS

## Liên hệ hỗ trợ

Nếu gặp vấn đề khi cấu hình, vui lòng kiểm tra:
1. Console logs trong browser
2. Server logs trong Vercel
3. API key status trên Groq Console
