-- Siết Row Level Security cho bảng `posts` (module viết blog)
--
-- LÝ DO: script 015_improve_posts_security.sql chỉ chuyển quyền ghi sang `TO authenticated`
-- với `WITH CHECK (true)` => MỌI tài khoản Supabase đã đăng nhập (không cần là admin)
-- đều có thể tạo/sửa/xoá bài viết qua API anon key.
-- Script này giới hạn quyền ghi cho đúng tài khoản nằm trong bảng `admin_users`.
--
-- Lưu ý: bảng `admin_users` đã được DISABLE ROW LEVEL SECURITY và GRANT SELECT cho
-- anon/authenticated ở script 004 nên subquery bên dưới chạy được trong policy.
-- (Khuyến nghị riêng: nên bật lại RLS cho admin_users và chỉ cho service_role đọc.)
--
-- Cách chạy: Supabase Dashboard -> SQL Editor -> dán và Execute.

-- 1. Xoá các policy ghi quá rộng từ script 015
DROP POLICY IF EXISTS "posts_insert_authenticated" ON public.posts;
DROP POLICY IF EXISTS "posts_update_authenticated" ON public.posts;
DROP POLICY IF EXISTS "posts_delete_authenticated" ON public.posts;

-- 2. Chỉ admin (email có trong admin_users) mới được ghi
CREATE POLICY "posts_insert_admin_only"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "posts_update_admin_only"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "posts_delete_admin_only"
  ON public.posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
    )
  );

-- 3. Kiểm tra lại danh sách policy của bảng posts
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'posts'
ORDER BY cmd, policyname;
