-- Cải thiện Row Level Security cho bảng posts
-- Script này tăng cường bảo mật cho production

-- Drop các policies cũ không an toàn
DROP POLICY IF EXISTS "posts_select_all" ON public.posts;
DROP POLICY IF EXISTS "posts_insert" ON public.posts;
DROP POLICY IF EXISTS "posts_update" ON public.posts;
DROP POLICY IF EXISTS "posts_delete" ON public.posts;

-- Policy 1: Public có thể đọc bài viết đã xuất bản
-- Giữ nguyên policy này vì nó đã đúng
-- CREATE POLICY "posts_select_published" đã tồn tại

-- Policy 2: Authenticated users có thể đọc tất cả bài viết (bao gồm draft)
-- Thay thế policy cũ cho phép "true"
CREATE POLICY "posts_select_authenticated"
  ON public.posts FOR SELECT
  TO authenticated
  USING (true);

-- Policy 3: Authenticated users có thể insert bài viết mới
-- Thay vì cho phép tất cả (true), chỉ cho phép authenticated users
CREATE POLICY "posts_insert_authenticated"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 4: Authenticated users có thể update bài viết
-- Thay vì cho phép tất cả (true), chỉ cho phép authenticated users
CREATE POLICY "posts_update_authenticated"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 5: Authenticated users có thể delete bài viết
-- Thay vì cho phép tất cả (true), chỉ cho phép authenticated users
CREATE POLICY "posts_delete_authenticated"
  ON public.posts FOR DELETE
  TO authenticated
  USING (true);

-- Note: Để production thực sự an toàn, nên:
-- 1. Tạo bảng admin_users riêng
-- 2. Chỉ cho phép admin_users thực hiện INSERT/UPDATE/DELETE
-- 3. Check auth.uid() trong policies
-- 
-- Ví dụ policy chỉ cho admin:
-- CREATE POLICY "posts_insert_admin_only"
--   ON public.posts FOR INSERT
--   TO authenticated
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM admin_users
--       WHERE admin_users.user_id = auth.uid()
--       AND admin_users.is_active = true
--     )
--   );
