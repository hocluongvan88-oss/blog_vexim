# 🔌 API Documentation - Vexim CMS

## Base URL

\`\`\`
https://your-domain.com/api
\`\`\`

---

## 📝 Posts API

### GET `/api/posts`

Lấy danh sách tất cả bài viết published.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | string | Filter theo danh mục | `?category=FDA` |
| `limit` | number | Số bài viết tối đa | `?limit=10` |
| `offset` | number | Bỏ qua N bài đầu | `?offset=20` |

**Response:**

\`\`\`json
{
  "data": [
    {
      "id": "uuid-here",
      "title": "Hướng dẫn đăng ký FDA 2026",
      "slug": "huong-dan-dang-ky-fda-2026",
      "excerpt": "Quy trình đăng ký FDA mới nhất...",
      "content": "<p>Full HTML content...</p>",
      "category": "FDA",
      "featured_image": "https://...",
      "status": "published",
      "published_at": "2026-01-15T00:00:00Z",
      "meta_title": "Hướng dẫn đăng ký FDA 2026 - Vexim",
      "meta_description": "Quy trình đăng ký...",
      "created_at": "2026-01-10T00:00:00Z",
      "updated_at": "2026-01-14T00:00:00Z"
    }
  ],
  "count": 45
}
\`\`\`

---

### POST `/api/posts`

Tạo bài viết mới.

**Headers:**
\`\`\`
Content-Type: application/json
Authorization: Bearer {token}
\`\`\`

**Body:**

\`\`\`json
{
  "title": "Tiêu đề bài viết",
  "slug": "tieu-de-bai-viet",
  "excerpt": "Mô tả ngắn",
  "content": "<p>Nội dung HTML</p>",
  "category": "FDA",
  "featured_image": "https://example.com/image.jpg",
  "status": "draft",
  "meta_title": "SEO Title",
  "meta_description": "SEO Description"
}
\`\`\`

**Response:**

\`\`\`json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "title": "Tiêu đề bài viết",
    ...
  }
}
\`\`\`

---

### GET `/api/posts/{id}`

Lấy chi tiết 1 bài viết.

**Response:**

\`\`\`json
{
  "data": {
    "id": "uuid",
    "title": "...",
    ...
  }
}
\`\`\`

---

### PUT `/api/posts/{id}`

Cập nhật bài viết.

**Body:** Giống POST

**Response:**

\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "updated_at": "2026-01-14T10:30:00Z"
  }
}
\`\`\`

---

### DELETE `/api/posts/{id}`

Xóa bài viết.

**Response:**

\`\`\`json
{
  "success": true,
  "message": "Post deleted successfully"
}
\`\`\`

---

## 🔒 Authentication

Coming soon: JWT-based authentication with Supabase Auth.

---

## 📊 Database Schema

### Table: `posts`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `title` | TEXT | NOT NULL | Tiêu đề bài viết |
| `slug` | TEXT | UNIQUE, NOT NULL | URL-friendly slug |
| `excerpt` | TEXT | | Mô tả ngắn |
| `content` | TEXT | | HTML content |
| `category` | TEXT | | Danh mục |
| `featured_image` | TEXT | | URL ảnh bìa |
| `status` | TEXT | DEFAULT 'draft' | draft/published |
| `published_at` | TIMESTAMPTZ | | Ngày xuất bản |
| `meta_title` | TEXT | | SEO title |
| `meta_description` | TEXT | | SEO description |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Ngày tạo |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Ngày cập nhật |

---

## 🛡️ RLS Policies

\`\`\`sql
-- Public có thể đọc bài published
CREATE POLICY "Allow public read published posts"
ON posts FOR SELECT
USING (status = 'published');

-- Admin có thể làm mọi thứ (TODO: Thêm auth check)
CREATE POLICY "Allow admin full access"
ON posts FOR ALL
USING (true);
\`\`\`

---

## 🚀 Rate Limiting

Coming soon: API rate limiting với Vercel Edge Config.

---

**Version:** 1.0.0
