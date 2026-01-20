# Hướng dẫn Import Bài viết từ WordPress

Script này giúp bạn import dữ liệu bài viết từ WordPress XML export vào Supabase database với tính năng làm sạch và chuẩn hóa dữ liệu tự động.

## Tính năng

✅ **Parse WordPress XML** - Đọc và phân tích cú pháp file WordPress export
✅ **Làm sạch HTML** - Loại bỏ WordPress block comments và HTML không cần thiết
✅ **Tạo excerpt tự động** - Trích xuất 200 ký tự đầu từ nội dung
✅ **Tạo slug SEO-friendly** - Chuyển đổi tiêu đề thành URL slug chuẩn
✅ **Phân loại category** - Tự động gán category từ WordPress
✅ **Chống duplicate** - Kiểm tra và bỏ qua bài viết đã tồn tại
✅ **Chỉ import published posts** - Bỏ qua draft, pages, attachments

## Chuẩn bị

### 1. Xuất dữ liệu từ WordPress

Trong WordPress Admin:
1. Vào **Tools → Export**
2. Chọn **Posts** hoặc **All content**
3. Click **Download Export File**
4. Lưu file XML

### 2. Upload file XML

Đặt file XML vào thư mục `user_read_only_context/text_attachments/`

### 3. Kiểm tra Environment Variables

Đảm bảo các biến môi trường sau đã được cấu hình:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Cách sử dụng

### Chạy import

Trong terminal v0, chạy lệnh:

\`\`\`bash
npm run import:wordpress
\`\`\`

Hoặc nếu bạn muốn test với một file cụ thể, sửa mảng `xmlFiles` trong file `scripts/import-wordpress-posts.ts`:

\`\`\`typescript
const xmlFiles = [
  "user_read_only_context/text_attachments/your-export-file.xml",
]
\`\`\`

## Quá trình xử lý

Script sẽ tự động:

1. **Đọc file XML** - Parse toàn bộ cấu trúc WordPress export
2. **Lọc nội dung** - Chỉ xử lý `post` type với status `publish`
3. **Làm sạch dữ liệu**:
   - Loại bỏ WordPress block comments (`<!-- wp:...`)
   - Chuẩn hóa HTML
   - Tạo plain text excerpt
   - Chuyển đổi tiêu đề thành slug SEO-friendly
4. **Import vào database**:
   - Kiểm tra duplicate bằng `wordpress_id`
   - Insert bài viết mới vào table `posts`
   - Ghi log chi tiết quá trình

## Kết quả

Sau khi chạy xong, bạn sẽ thấy:

\`\`\`
[v0] Import completed!
[v0] Imported: 25 posts
[v0] Skipped: 10 items
\`\`\`

## Cấu trúc dữ liệu import

Mỗi bài viết sẽ có các field:

| Field | Mô tả |
|-------|-------|
| `wordpress_id` | ID gốc từ WordPress |
| `title` | Tiêu đề bài viết |
| `slug` | URL slug (SEO-friendly) |
| `excerpt` | Đoạn trích ngắn (200 ký tự) |
| `content` | Nội dung HTML đã làm sạch |
| `category` | Danh mục (từ WordPress) |
| `status` | Trạng thái: "published" |
| `published_at` | Ngày xuất bản |
| `wordpress_url` | URL gốc từ WordPress |
| `meta_title` | SEO title (copy từ title) |
| `meta_description` | SEO description (copy từ excerpt) |

## Xử lý lỗi

Nếu gặp lỗi:

1. **File not found** - Kiểm tra đường dẫn file XML
2. **Database error** - Xem log chi tiết, có thể do:
   - Thiếu environment variables
   - Schema không khớp
   - Duplicate slug/ID
3. **Parse error** - File XML có thể bị corrupt, thử export lại từ WordPress

## Sau khi import

1. Kiểm tra dữ liệu trong Supabase dashboard
2. Xem bài viết tại `/blog` trên website
3. Có thể chỉnh sửa bài viết trong Admin Panel (`/admin/posts`)

## Lưu ý

- Script tự động bỏ qua bài viết đã tồn tại (dựa vào `wordpress_id`)
- Chỉ import posts có status = "publish"
- Nếu muốn import lại, xóa dữ liệu cũ trong database trước
- Featured images không được import tự động (cần upload riêng)

## Hỗ trợ

Nếu cần hỗ trợ, kiểm tra:
- Console logs trong terminal
- Supabase dashboard → Table Editor → posts
- Row Level Security policies có thể chặn insert
\`\`\`
