-- Bảng theo dõi tin tức đã crawl với hash-based detection
CREATE TABLE IF NOT EXISTS public.crawled_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL, -- 'FDA' hoặc 'GACC'
  source_url TEXT NOT NULL, -- URL trang được crawl
  title TEXT NOT NULL,
  article_url TEXT NOT NULL UNIQUE, -- URL bài viết (unique)
  published_date TEXT,
  content_hash TEXT, -- SHA256 hash của title + date + url
  full_content TEXT, -- Nội dung đầy đủ (chỉ lấy khi có thay đổi)
  summary TEXT,
  relevance TEXT, -- 'high', 'medium', 'low'
  categories TEXT[], -- Array các danh mục
  ai_analysis JSONB, -- Kết quả phân tích từ AI
  status TEXT DEFAULT 'pending', -- 'pending', 'processed', 'published', 'archived'
  is_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index cho performance
CREATE INDEX IF NOT EXISTS idx_crawled_news_source ON public.crawled_news(source);
CREATE INDEX IF NOT EXISTS idx_crawled_news_status ON public.crawled_news(status);
CREATE INDEX IF NOT EXISTS idx_crawled_news_content_hash ON public.crawled_news(content_hash);
CREATE INDEX IF NOT EXISTS idx_crawled_news_created_at ON public.crawled_news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crawled_news_article_url ON public.crawled_news(article_url);

-- RLS policies
ALTER TABLE public.crawled_news ENABLE ROW LEVEL SECURITY;

-- Admin có thể làm mọi thứ
CREATE POLICY "Admins can do everything on crawled_news" ON public.crawled_news
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Public có thể đọc tin đã published
CREATE POLICY "Public can read published news" ON public.crawled_news
  FOR SELECT
  USING (status = 'published');

-- Function để update updated_at
CREATE OR REPLACE FUNCTION update_crawled_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS update_crawled_news_updated_at_trigger ON public.crawled_news;
CREATE TRIGGER update_crawled_news_updated_at_trigger
  BEFORE UPDATE ON public.crawled_news
  FOR EACH ROW
  EXECUTE FUNCTION update_crawled_news_updated_at();

-- Bảng theo dõi crawl sessions
CREATE TABLE IF NOT EXISTS public.crawl_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running', -- 'running', 'completed', 'failed'
  articles_found INTEGER DEFAULT 0,
  new_articles INTEGER DEFAULT 0,
  updated_articles INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_crawl_sessions_source ON public.crawl_sessions(source);
CREATE INDEX IF NOT EXISTS idx_crawl_sessions_started_at ON public.crawl_sessions(started_at DESC);

COMMIT;
