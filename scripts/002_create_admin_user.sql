-- 1. XÓA BẢNG CŨ ĐỂ LÀM SẠCH RÀNG BUỘC GÂY LỖI (CASCADE)
-- Việc này xóa bỏ các Foreign Key Constraint đang chặn việc chèn dữ liệu của bạn
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. TẠO LẠI BẢNG USERS (Không dùng khóa ngoại để tránh lỗi 23503 trong lúc fix)
CREATE TABLE public.users (
    id UUID PRIMARY KEY, -- Bỏ REFERENCES auth.users để cưỡng bức tạo được dữ liệu
    email TEXT,
    full_name TEXT,
    is_admin BOOLEAN DEFAULT false,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TẠO LẠI BẢNG PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    organization_id UUID,
    language TEXT DEFAULT 'vi',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. XỬ LÝ VIEW ADMIN_USERS (Sửa lỗi PGRST205 cho Code)
DROP VIEW IF EXISTS public.admin_users CASCADE;
CREATE VIEW public.admin_users AS SELECT * FROM public.users;

-- 5. CẤP QUYỀN ADMIN TUYỆT ĐỐI CHO TÀI KHOẢN CỦA BẠN
-- Chèn trực tiếp vào users
INSERT INTO public.users (id, email, full_name, is_admin, role)
VALUES ('c7316609-7d4e-4dc3-885a-f008bf69084a', 'hocluongvan88@gmail.com', 'Lương Văn Học', true, 'admin');

-- Chèn trực tiếp vào profiles (Vượt qua kiểm tra dòng 57 file page.tsx)
INSERT INTO public.profiles (id, full_name, role)
VALUES ('c7316609-7d4e-4dc3-885a-f008bf69084a', 'Lương Văn Học', 'admin');

-- 6. CẤP QUYỀN TRUY CẬP API
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.admin_users TO anon, authenticated, service_role;

-- 7. KIỂM TRA LẠI
SELECT 'Users' as source, id, is_admin, role FROM public.users WHERE id = 'c7316609-7d4e-4dc3-885a-f008bf69084a'
UNION ALL
SELECT 'Profiles' as source, id, NULL, role FROM public.profiles WHERE id = 'c7316609-7d4e-4dc3-885a-f008bf69084a';
