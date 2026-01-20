-- Fix PGRST205 - Sửa lỗi admin_users là TABLE chứ không phải VIEW
-- Script này sẽ DROP TABLE (không phải VIEW) và tạo lại đúng cách

-- 1. DROP TABLE cũ (vì admin_users đã là TABLE rồi)
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- 2. TẠO TABLE admin_users mới - TABLE thực tế, không phải VIEW
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    is_admin BOOLEAN DEFAULT true,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DISABLE RLS để tất cả có thể truy cập
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- 4. Grant quyền cho tất cả roles
GRANT SELECT ON public.admin_users TO anon, authenticated, service_role;
GRANT ALL ON public.admin_users TO service_role;

-- 5. Insert admin user vào bảng
INSERT INTO public.admin_users (id, email, full_name, is_admin, role)
VALUES ('c7316609-7d4e-4dc3-885a-f008bf69084a', 'hocluongvan88@gmail.com', 'Lương Văn Học', true, 'admin')
ON CONFLICT (id) DO UPDATE SET
    email = 'hocluongvan88@gmail.com',
    full_name = 'Lương Văn Học',
    is_admin = true,
    role = 'admin';

-- 6. Verify
SELECT id, email, full_name, is_admin, role FROM public.admin_users;
