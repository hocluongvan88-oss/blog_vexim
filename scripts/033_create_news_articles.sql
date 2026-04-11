-- Create news_articles table for storing crawled FDA/GACC/Federal Register news
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('FDA', 'GACC', 'FEDERAL_REGISTER')),
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  published_date DATE,
  content TEXT,
  summary TEXT,
  category TEXT,
  relevance_score INTEGER DEFAULT 0,
  filter_layer TEXT,
  keywords TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  raw_html TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create crawl_logs table for tracking crawl jobs
CREATE TABLE IF NOT EXISTS crawl_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  articles_found INTEGER DEFAULT 0,
  articles_filtered INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_news_articles_source ON news_articles(source);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_date ON news_articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_relevance ON news_articles(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_crawl_logs_source ON crawl_logs(source);
CREATE INDEX IF NOT EXISTS idx_crawl_logs_created ON crawl_logs(created_at DESC);

-- Enable RLS
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crawl_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for news_articles (public read, admin write)
DROP POLICY IF EXISTS "Public can read published news" ON news_articles;
CREATE POLICY "Public can read published news" ON news_articles
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin can manage all news" ON news_articles;
CREATE POLICY "Admin can manage all news" ON news_articles
  FOR ALL USING (true);

-- Create policies for crawl_logs (admin only)
DROP POLICY IF EXISTS "Admin can manage crawl logs" ON crawl_logs;
CREATE POLICY "Admin can manage crawl logs" ON crawl_logs
  FOR ALL USING (true);

-- Grant permissions
GRANT SELECT ON news_articles TO anon;
GRANT ALL ON news_articles TO authenticated;
GRANT ALL ON news_articles TO service_role;

GRANT ALL ON crawl_logs TO authenticated;
GRANT ALL ON crawl_logs TO service_role;
