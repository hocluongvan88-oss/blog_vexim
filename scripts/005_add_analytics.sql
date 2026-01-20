-- Thêm các trường analytics vào bảng posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views_this_month INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS last_view_reset TIMESTAMPTZ DEFAULT NOW();

-- Tạo index cho analytics
CREATE INDEX IF NOT EXISTS idx_posts_views ON public.posts(views_count DESC);

-- Tạo bảng page_views để theo dõi chi tiết lượt xem
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index cho page_views
CREATE INDEX IF NOT EXISTS idx_page_views_post_id ON public.page_views(post_id);
CREATE INDEX IF NOT EXISTS idx_page_views_date ON public.page_views(viewed_at DESC);

-- Enable RLS cho page_views
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Policy: Cho phép đọc và insert page views
CREATE POLICY "page_views_select"
  ON public.page_views FOR SELECT
  USING (true);

CREATE POLICY "page_views_insert"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

-- Function để reset views hàng tháng
CREATE OR REPLACE FUNCTION public.reset_monthly_views()
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET views_this_month = 0,
      last_view_reset = NOW()
  WHERE last_view_reset < DATE_TRUNC('month', NOW());
END;
$$ LANGUAGE plpgsql;

-- Tạo bảng analytics_summary để lưu tổng hợp
CREATE TABLE IF NOT EXISTS public.analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value INTEGER DEFAULT 0,
  period TEXT NOT NULL, -- 'daily', 'monthly', 'yearly'
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_name, period, date)
);

-- Index cho analytics_summary
CREATE INDEX IF NOT EXISTS idx_analytics_summary_date ON public.analytics_summary(date DESC);

-- Enable RLS
ALTER TABLE public.analytics_summary ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "analytics_summary_select"
  ON public.analytics_summary FOR SELECT
  USING (true);

CREATE POLICY "analytics_summary_insert"
  ON public.analytics_summary FOR INSERT
  WITH CHECK (true);

-- Cập nhật views cho các bài viết hiện có (dữ liệu giả để demo)
UPDATE public.posts 
SET views_count = FLOOR(RANDOM() * 5000 + 1000)::INTEGER,
    views_this_month = FLOOR(RANDOM() * 1000 + 100)::INTEGER
WHERE views_count = 0;
