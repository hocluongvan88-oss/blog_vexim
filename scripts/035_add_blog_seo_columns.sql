-- Bổ sung 2 cột SEO cho module viết blog
--
-- LÝ DO: UI trình soạn thảo (app/admin/(dashboard)/posts/new + [id]/edit) gửi lên
-- `featured_image_alt` và `focus_keyword` trong mọi lần lưu, nhưng các script trước đó
-- (001_create_posts_table.sql, 005_add_analytics.sql) KHÔNG tạo 2 cột này.
-- Nếu database chưa được thêm tay, PostgREST sẽ trả lỗi:
--   "Could not find the 'featured_image_alt' column of 'posts' in the schema cache"
-- => không thể lưu bất kỳ bài viết nào.
--
-- Cách chạy: Supabase Dashboard -> SQL Editor -> dán và Execute.

ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS featured_image_alt TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS focus_keyword TEXT;

-- (Tùy chọn) Từ khóa SEO dạng mảng, dùng cho thẻ meta keywords khi render bài viết.
-- Hiện UI chưa có chỗ nhập nên KHÔNG bật mặc định để tránh cột "chết".
-- ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Kiểm tra kết quả
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'posts'
ORDER BY ordinal_position;
