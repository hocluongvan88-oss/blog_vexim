# Tính năng SEO của Vexim Global CMS

## 📊 SEO Checker Real-time

Hệ thống tự động phân tích và đánh giá SEO ngay khi bạn viết bài:

### Các tiêu chí đánh giá:

1. **Tiêu đề (Title)**
   - Độ dài tối ưu: 30-60 ký tự
   - Cảnh báo nếu quá ngắn hoặc quá dài
   - Preview trên Google Search

2. **Meta Description**
   - Độ dài tối ưu: 120-160 ký tự
   - Tự động sử dụng excerpt nếu không nhập
   - Hiển thị trước kết quả tìm kiếm

3. **Nội dung bài viết**
   - Tối thiểu 300 từ để đạt chuẩn SEO
   - Kiểm tra cấu trúc heading (H2, H3)
   - Đếm số lượng hình ảnh và liên kết

4. **Điểm SEO Score**
   - 80-100: Tốt (màu xanh lá)
   - 60-79: Khá (màu vàng)
   - 0-59: Cần cải thiện (màu đỏ)

## 🗺️ Sitemap tự động

- File `/sitemap.xml` được tạo tự động
- Bao gồm tất cả trang dịch vụ và bài blog
- Cập nhật real-time khi có bài mới
- Submit lên Google Search Console: `https://vexim.vn/sitemap.xml`

## 🤖 Robots.txt

- Cho phép Google crawl toàn bộ site
- Chặn /admin/ và /api/ (không index)
- Link đến sitemap.xml

## 📱 Structured Data (Schema Markup)

Mỗi bài viết có JSON-LD schema tự động:

\`\`\`json
{
  "@type": "BlogPosting",
  "headline": "...",
  "datePublished": "...",
  "author": { "@type": "Organization", "name": "Vexim Global" }
}
\`\`\`

**Lợi ích:**
- Rich snippets trên Google (sao, ngày đăng, tác giả)
- Tăng CTR (Click-through rate)
- Hiển thị đẹp hơn trong kết quả tìm kiếm

## 🔍 Open Graph (Social Media)

Mỗi bài viết có Open Graph tags cho:
- Facebook: Title, description, image
- Twitter: Card preview
- LinkedIn: Professional preview

## 📈 URL Structure thân thiện SEO

- Blog posts: `/blog/slug-bai-viet`
- Services: `/services/ten-dich-vu`
- Không có query parameters (?id=123)
- Slug tự động từ tiêu đề (Unicode safe)

## ✅ Checklist SEO khi xuất bản:

1. ✓ Tiêu đề 30-60 ký tự, có từ khóa chính
2. ✓ Meta description 120-160 ký tự, hấp dẫn
3. ✓ Nội dung > 300 từ, có cấu trúc rõ ràng
4. ✓ Có ít nhất 2-3 heading (H2/H3)
5. ✓ Ảnh bìa quality cao, có alt text
6. ✓ Có liên kết nội bộ hoặc external reference
7. ✓ Review Google Search preview
8. ✓ SEO Score > 80 điểm

## 🚀 Tối ưu sau khi xuất bản:

1. Submit sitemap lên Google Search Console
2. Request indexing cho bài mới
3. Share trên social media (OG tags tự động)
4. Monitor rankings với Google Analytics
5. Update nội dung định kỳ (freshness signal)

## 📊 URL Migration từ WordPress

Giữ nguyên structure `/blog/slug` để:
- Không mất ranking hiện tại
- Không cần setup redirects
- Google không cần re-crawl
- Users không bị 404

## 🎯 Best Practices

- Viết cho người đọc trước, SEO sau
- Sử dụng từ khóa tự nhiên, không nhồi nhét
- Nội dung chất lượng > 500 từ
- Update bài cũ thường xuyên
- Internal linking giữa các bài viết
- Mobile-friendly (Next.js responsive)
- Page speed nhanh (Next.js optimization)
