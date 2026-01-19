# 📚 Hướng dẫn sử dụng CMS Vexim Global

## 🎯 Tổng quan

Hệ thống CMS (Content Management System) của Vexim Global cho phép bạn quản lý bài viết blog một cách chuyên nghiệp với:

- ✅ Tích hợp Supabase database thực
- ✅ Rich text editor với formatting tools
- ✅ SEO optimization tích hợp sẵn
- ✅ Migration từ WordPress an toàn
- ✅ Responsive và user-friendly

---

## 🚀 Bước 1: Setup Database (Chỉ làm 1 lần)

### Chạy SQL Script trong v0

1. Mở file `scripts/001_create_posts_table.sql`
2. Click nút **▶ Run** ở góc phải trên
3. Đợi thông báo "Executed successfully"

**Hoặc chạy trực tiếp trong Supabase Dashboard:**

1. Vào Supabase Dashboard → SQL Editor
2. Copy nội dung file `scripts/001_create_posts_table.sql`
3. Paste và Execute

### Kiểm tra table đã tạo thành công:

\`\`\`sql
SELECT * FROM posts LIMIT 5;
\`\`\`

---

## ✍️ Bước 2: Tạo bài viết mới

### Truy cập trang Admin

URL: `https://your-domain.com/admin/posts/new`

### Các bước tạo bài:

1. **Thông tin cơ bản:**
   - **Tiêu đề**: Tên bài viết (bắt buộc)
   - **Danh mục**: Chọn category phù hợp
   - **Mô tả ngắn**: Hiển thị trong listing page (tối đa 200 ký tự)

2. **Nội dung bài viết:**
   - Sử dụng Rich Text Editor
   - Toolbar có: Bold, Italic, Link, H2, H3, List
   - Hỗ trợ HTML để chèn ảnh, video

3. **Ảnh bìa (Featured Image):**
   - Upload ảnh từ máy tính
   - Hoặc dán URL ảnh từ Unsplash/CDN
   - Tỷ lệ khuyến nghị: 16:9 (1200x675px)

4. **SEO Settings:**
   - **Meta Title**: Tối ưu cho Google (50-60 ký tự)
   - **Meta Description**: Mô tả cho SERP (150-160 ký tự)

5. **Xuất bản:**
   - **Lưu nháp**: Chưa hiển thị công khai
   - **Xuất bản**: Publish ngay lập tức

---

## 📥 Bước 3: Migration từ WordPress

### Chuẩn bị (trên WordPress cũ)

1. **Cài plugin WP All Export**
2. Export dữ liệu với cấu hình:

\`\`\`
- Post Title
- Post Content (HTML)
- Post Slug
- Category
- Featured Image URL
- Published Date
- Meta Description (Yoast SEO)
\`\`\`

3. Save file `wordpress-export.xml`

### Chạy Migration Script

**Prerequisites:**
\`\`\`bash
pip install mysql-connector-python python-dotenv requests
\`\`\`

**Cấu hình `.env`:**
\`\`\`env
# WordPress Database
WP_DB_HOST=localhost
WP_DB_NAME=wordpress_db
WP_DB_USER=root
WP_DB_PASSWORD=your_password

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
\`\`\`

**Chạy script:**
\`\`\`bash
python scripts/migrate_wordpress.py
\`\`\`

**Output:**
\`\`\`
✓ Connected to WordPress database
✓ Connected to Supabase
✓ Migrating 45 posts...
  [1/45] Migrated: "Hướng dẫn đăng ký FDA..."
  [2/45] Migrated: "GACC 2024 cập nhật..."
  ...
✓ Migration completed: 45/45 posts
\`\`\`

---

## 🔒 Bước 4: Bảo mật Admin CMS

### Option 1: Middleware Protection (Recommended)

Tạo file `proxy.ts`:

\`\`\`typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Bảo vệ route /admin/*
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // TODO: Check authentication
    const isAuthenticated = false // Implement your auth logic
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}
\`\`\`

### Option 2: Supabase Auth (Advanced)

Tích hợp Supabase Authentication để có admin dashboard hoàn chỉnh.

---

## 🎨 Bước 5: Sử dụng Blog

### Xem danh sách bài viết

URL: `https://your-domain.com/blog`

**Features:**
- Filter theo category
- Responsive grid layout
- Pagination (tự động nếu >50 bài)

### Xem chi tiết bài viết

URL: `https://your-domain.com/blog/ten-bai-viet`

**SEO-friendly:**
- ✅ Meta tags tự động từ database
- ✅ Open Graph cho social share
- ✅ Structured data (Schema.org)

---

## 📊 Bước 6: SEO Migration (Quan trọng!)

### Giữ nguyên URL structure

WordPress cũ: `vexim.vn/blog/huong-dan-fda`
Vexim mới: `vexim.vn/blog/huong-dan-fda`

**✅ Không cần redirect - URL giống 100%**

### Checklist SEO:

- [ ] Slug giữ nguyên từ WordPress
- [ ] Meta title/description đã migrate
- [ ] Featured images có alt text
- [ ] Internal links đã update
- [ ] XML sitemap đã tạo
- [ ] Google Search Console đã verify

### Tạo Sitemap

Tạo file `app/sitemap.ts`:

\`\`\`typescript
import { createStaticClient } from '@/lib/supabase/server'

export default async function sitemap() {
  const supabase = createStaticClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published')

  const blogUrls = posts?.map((post) => ({
    url: `https://vexim.vn/blog/${post.slug}`,
    lastModified: post.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  return [
    {
      url: 'https://vexim.vn',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://vexim.vn/blog',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...blogUrls,
  ]
}
\`\`\`

---

## 🔧 Troubleshooting

### Lỗi: "posts table does not exist"

**Giải pháp:** Chạy lại SQL script `001_create_posts_table.sql`

### Lỗi: "Permission denied for table posts"

**Giải pháp:** Check RLS policies trong Supabase:
\`\`\`sql
-- Cho phép public đọc bài published
CREATE POLICY "Allow public read published posts"
ON posts FOR SELECT
USING (status = 'published');
\`\`\`

### Migration bị lỗi character encoding

**Giải pháp:** Sửa script Python:
\`\`\`python
# Thêm encoding UTF-8
connection = mysql.connector.connect(
    ...
    charset='utf8mb4',
    use_unicode=True
)
\`\`\`

---

## 📞 Support

Nếu gặp vấn đề, liên hệ:
- Email: tech@vexim.vn
- Documentation: https://docs.vexim.vn

---

## 🎓 Best Practices

1. **Backup trước khi migrate:** Export WordPress database
2. **Test trên staging:** Migrate lên staging environment trước
3. **SEO redirect:** Setup 301 redirect nếu URL structure khác
4. **Image optimization:** Compress ảnh trước khi upload
5. **Content review:** Review lại format sau migration

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-14
