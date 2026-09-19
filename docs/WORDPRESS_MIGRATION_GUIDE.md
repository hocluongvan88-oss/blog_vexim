# Hướng dẫn Migration WordPress sang Supabase CMS

## Tại sao migration này an toàn cho SEO?

1. **Giữ nguyên URL structure**: `/blog/ten-bai-viet` không thay đổi
2. **Slug không thay đổi**: Mỗi bài viết giữ nguyên slug từ WordPress
3. **301 Redirects**: Lưu `wordpress_url` để setup redirect nếu cần
4. **Meta tags**: Migrate đầy đủ meta title và description

## Quy trình Migration (3 bước)

### Bước 1: Export dữ liệu từ WordPress

#### Phương án A: Export qua WordPress Admin (Khuyến nghị)

1. Đăng nhập WordPress admin tại `vexim.vn/wp-admin`
2. Vào **Tools → Export**
3. Chọn **Posts**
4. Click **Download Export File**
5. Bạn sẽ có file `wordpress.YYYY-MM-DD.xml`

#### Phương án B: Export trực tiếp từ Database

Nếu bạn có quyền truy cập phpMyAdmin hoặc MySQL CLI:

\`\`\`sql
SELECT 
    ID as wordpress_id,
    post_title as title,
    post_name as slug,
    post_excerpt as excerpt,
    post_content as content,
    post_status as status,
    post_date as published_at
FROM wp_posts 
WHERE post_type = 'post' 
  AND post_status IN ('publish', 'draft')
ORDER BY post_date DESC;
\`\`\`

Export kết quả ra CSV.

### Bước 2: Chạy Migration Script

**Nếu có file XML:**

\`\`\`bash
python scripts/migrate_wordpress.py --source wordpress.xml --output migration.sql
\`\`\`

**Nếu có CSV:**

\`\`\`bash
python scripts/migrate_wordpress.py --source posts.csv --output migration.sql
\`\`\`

**Nếu kết nối trực tiếp database:**

\`\`\`bash
python scripts/migrate_wordpress.py \
  --db "mysql://username:password@host:3306/database_name" \
  --output migration.sql
\`\`\`

Script sẽ:
- ✅ Parse tất cả bài viết
- ✅ Làm sạch HTML (loại bỏ WordPress shortcodes)
- ✅ Giữ nguyên slug
- ✅ Tạo meta tags nếu chưa có
- ✅ Generate file SQL

### Bước 3: Import vào Supabase

Script đã được tích hợp trong v0, chỉ cần chạy:

1. Mở v0 chat
2. Paste nội dung file `migration.sql` vào chat
3. Hoặc upload file và nói: "Chạy script migration này"

v0 sẽ tự động execute script trực tiếp vào Supabase database.

## Kiểm tra sau Migration

### 1. Verify số lượng bài viết

\`\`\`sql
SELECT COUNT(*) FROM posts;
SELECT COUNT(*) FROM posts WHERE status = 'published';
\`\`\`

### 2. Kiểm tra slugs có trùng không

\`\`\`sql
SELECT slug, COUNT(*) 
FROM posts 
GROUP BY slug 
HAVING COUNT(*) > 1;
\`\`\`

### 3. Test một vài bài viết

- Truy cập `vexim.vn/blog/slug-bai-viet-cu`
- Xem có hiển thị đúng không
- Kiểm tra ảnh bìa có load được không

### 4. Verify SEO

- Check meta tags bằng View Page Source
- Dùng Google Search Console để fetch mới
- Kiểm tra sitemap: `vexim.vn/sitemap.xml`

## Setup 301 Redirects (Nếu cần)

Nếu URL cũ khác với URL mới, thêm vào `proxy.ts`:

\`\`\`typescript
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // 301 redirect từ URL WordPress cũ
  const oldPaths = {
    '/tin-tuc/slug-cu': '/blog/slug-moi',
    '/dich-vu/slug-cu': '/blog/slug-moi',
  }
  
  if (oldPaths[url.pathname]) {
    url.pathname = oldPaths[url.pathname]
    return NextResponse.redirect(url, 301)
  }
  
  return NextResponse.next()
}
\`\`\`

## Rollback Plan

Nếu có vấn đề, rollback ngay:

\`\`\`sql
-- Xóa tất cả posts đã migrate
DELETE FROM posts WHERE wordpress_id IS NOT NULL;

-- Hoặc xóa toàn bộ
TRUNCATE TABLE posts CASCADE;
\`\`\`

Sau đó import lại bảng cũ từ WordPress.

## FAQs

**Q: Mất bao lâu để migrate?**
A: 100 bài viết ~ 2-5 phút

**Q: Có mất ảnh không?**
A: Không. Script giữ nguyên URL ảnh từ WordPress media library

**Q: Google có index lại không?**
A: Không cần. Vì URL không đổi, Google vẫn giữ nguyên ranking

**Q: Có cần báo Google không?**
A: Không bắt buộc, nhưng nên submit sitemap mới trong Search Console

**Q: Comments có migrate được không?**
A: Script hiện tại chưa hỗ trợ. Nếu cần, có thể extend để migrate bảng `wp_comments`

## Hỗ trợ

Nếu gặp vấn đề trong quá trình migration, liên hệ:
- Email: tech@vexim.vn
- Hoặc chat trực tiếp với v0
