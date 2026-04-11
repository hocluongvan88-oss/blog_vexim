-- Fix: Update news_articles to use source_name instead of source
-- Since the table already exists with source_name column, we need to align the schema

-- Drop the indexes that reference 'source' column
DROP INDEX IF EXISTS idx_news_articles_source;
DROP INDEX IF EXISTS idx_crawl_logs_source;

-- Drop the check constraint and add proper column if needed
-- The table should use source_name and source_url instead of source

-- Update crawl_logs to use source_name instead of source (if the column exists)
ALTER TABLE crawl_logs RENAME COLUMN source TO source_name;

-- Recreate indexes with correct column names
CREATE INDEX IF NOT EXISTS idx_news_articles_source_name ON news_articles(source_name);
CREATE INDEX IF NOT EXISTS idx_crawl_logs_source_name ON crawl_logs(source_name);

-- Recreate the RLS policies if needed
DROP POLICY IF EXISTS "Admin can manage crawl logs" ON crawl_logs;
CREATE POLICY "Admin can manage crawl logs" ON crawl_logs
  FOR ALL USING (true);
