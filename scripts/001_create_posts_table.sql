-- Tạo bảng posts cho CMS Vexim Global
-- Bảng này lưu trữ tất cả bài viết blog về dịch vụ xuất nhập khẩu

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- WordPress migration fields
  wordpress_id INTEGER UNIQUE,
  wordpress_url TEXT
);

-- Tạo index cho hiệu suất truy vấn
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);

-- Tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy: Ai cũng có thể đọc bài viết đã xuất bản (public access)
CREATE POLICY "posts_select_published"
  ON public.posts FOR SELECT
  USING (status = 'published');

-- Policy: Cho phép đọc tất cả bài viết (kể cả draft) để hiển thị trong admin
-- Tạm thời cho phép không cần auth để demo
CREATE POLICY "posts_select_all"
  ON public.posts FOR SELECT
  USING (true);

-- Policy: Cho phép insert bài viết mới (tạm thời không cần auth)
CREATE POLICY "posts_insert"
  ON public.posts FOR INSERT
  WITH CHECK (true);

-- Policy: Cho phép update bài viết (tạm thời không cần auth)
CREATE POLICY "posts_update"
  ON public.posts FOR UPDATE
  USING (true);

-- Policy: Cho phép delete bài viết (tạm thời không cần auth)
CREATE POLICY "posts_delete"
  ON public.posts FOR DELETE
  USING (true);

-- Chèn dữ liệu mẫu
INSERT INTO public.posts (title, slug, excerpt, content, category, featured_image, status, published_at, meta_title, meta_description) VALUES
('Hướng dẫn đăng ký FDA cho doanh nghiệp xuất khẩu thực phẩm', 'huong-dan-dang-ky-fda-cho-doanh-nghiep-xuat-khau-thuc-pham', 'Quy trình đăng ký FDA chi tiết giúp doanh nghiệp Việt Nam xuất khẩu thực phẩm sang Mỹ hợp pháp', '<h2>Tại sao cần đăng ký FDA?</h2><p>FDA (Food and Drug Administration) là cơ quan quản lý thực phẩm và dược phẩm của Hoa Kỳ. Bất kỳ cơ sở sản xuất, chế biến, đóng gói hoặc lưu trữ thực phẩm xuất khẩu vào Mỹ đều phải đăng ký với FDA.</p><h2>Quy trình đăng ký FDA</h2><p>Bước 1: Chuẩn bị hồ sơ doanh nghiệp...</p>', 'FDA', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800', 'published', NOW(), 'Hướng dẫn đăng ký FDA cho xuất khẩu thực phẩm | Vexim Global', 'Quy trình đăng ký FDA chi tiết, chính xác cho doanh nghiệp Việt Nam muốn xuất khẩu thực phẩm sang thị trường Mỹ'),

-- Sửa INTERVAL syntax từ ''7 days'' thành '7 days'
('Mã GACC Trung Quốc: Chìa khóa xuất khẩu sang thị trường tỷ dân', 'ma-gacc-trung-quoc-chia-khoa-xuat-khau-sang-thi-truong-ty-dan', 'Tất cả những gì bạn cần biết về mã GACC để xuất khẩu hàng hóa sang Trung Quốc hợp pháp', '<h2>Mã GACC là gì?</h2><p>GACC (General Administration of Customs of China) là Tổng cục Hải quan Trung Quốc. Mã GACC là mã số đăng ký bắt buộc cho các cơ sở sản xuất, chế biến xuất khẩu thực phẩm vào Trung Quốc.</p><h2>Sản phẩm nào cần mã GACC?</h2><p>Thực phẩm tươi sống, thực phẩm chế biến, thực phẩm đóng gói...</p>', 'GACC', 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800', 'published', NOW() - INTERVAL '7 days', 'Mã GACC Trung Quốc: Hướng dẫn đăng ký xuất khẩu | Vexim', 'Hướng dẫn chi tiết cách đăng ký mã GACC để xuất khẩu thực phẩm sang Trung Quốc. Quy trình nhanh chóng, đảm bảo thành công'),

-- Sửa INTERVAL syntax từ ''14 days'' thành '14 days'
('FSMA 204: Quy định truy xuất nguồn gốc thực phẩm mới nhất của FDA', 'fsma-204-quy-dinh-truy-xuat-nguon-goc-thuc-pham-moi-nhat-fda', 'Quy định FSMA 204 yêu cầu doanh nghiệp phải ghi chép và chia sẻ thông tin truy xuất nguồn gốc cho các loại thực phẩm có nguy cơ cao', '<h2>FSMA 204 là gì?</h2><p>FSMA 204 (Food Safety Modernization Act Section 204) là quy định truy xuất nguồn gốc thực phẩm của FDA, có hiệu lực từ ngày 20/01/2026.</p><h2>Danh sách Food Traceability List (FTL)</h2><p>Các loại thực phẩm bắt buộc phải truy xuất nguồn gốc bao gồm: phô mai mềm, trứng, salad xanh, dưa pepino, hải sản...</p>', 'Truy xuất nguồn gốc', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', 'published', NOW() - INTERVAL '14 days', 'FSMA 204: Quy định truy xuất nguồn gốc FDA 2026 | Vexim Global', 'Giải thích chi tiết FSMA 204 - quy định truy xuất nguồn gốc thực phẩm mới nhất của FDA có hiệu lực từ 2026');
