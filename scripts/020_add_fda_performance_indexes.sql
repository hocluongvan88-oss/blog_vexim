-- =====================================================
-- FDA TRACKER PERFORMANCE OPTIMIZATION
-- Migration: 020_add_fda_performance_indexes.sql
-- Purpose: Add composite indexes and monitoring tables
-- =====================================================

-- 1. Add composite index for digest queries
CREATE INDEX IF NOT EXISTS idx_fda_subscriptions_active_digest 
  ON fda_subscriptions(is_active, verified, frequency) 
  WHERE is_active = true AND verified = true;

-- 2. Add index for tracking last sent
CREATE INDEX IF NOT EXISTS idx_fda_subscriptions_last_sent 
  ON fda_subscriptions(last_sent_at DESC);

-- 3. Add token expiry field
ALTER TABLE fda_subscriptions 
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP WITH TIME ZONE;

-- 4. Set expiry for existing tokens (24 hours from created_at)
UPDATE fda_subscriptions 
SET token_expires_at = created_at + INTERVAL '24 hours'
WHERE token_expires_at IS NULL AND verification_token IS NOT NULL;

-- 5. Add bounce tracking fields
ALTER TABLE fda_subscriptions 
ADD COLUMN IF NOT EXISTS bounce_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_bounce_at TIMESTAMP WITH TIME ZONE;

-- 6. Add index for bounce tracking
CREATE INDEX IF NOT EXISTS idx_fda_subscriptions_bounce 
  ON fda_subscriptions(bounce_count) 
  WHERE bounce_count > 0;

-- 7. Create cron job monitoring table
CREATE TABLE IF NOT EXISTS cron_job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  frequency TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('running', 'success', 'failed')),
  emails_sent INTEGER DEFAULT 0,
  emails_failed INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Add indexes for cron logs
CREATE INDEX IF NOT EXISTS idx_cron_logs_job_name 
  ON cron_job_logs(job_name, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_cron_logs_status 
  ON cron_job_logs(status, started_at DESC);

-- 9. Improve fda_alerts_cache table structure
ALTER TABLE fda_alerts_cache
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS summary_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS hit_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 10. Add index for cache lookups
CREATE INDEX IF NOT EXISTS idx_fda_cache_category_endpoint 
  ON fda_alerts_cache(category, endpoint, cached_at DESC);

CREATE INDEX IF NOT EXISTS idx_fda_cache_item_id 
  ON fda_alerts_cache((data->>'id'));

-- 11. Add auto-cleanup trigger for expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark tokens as expired if past expiry date
  IF NEW.token_expires_at < NOW() AND NEW.verification_token IS NOT NULL THEN
    NEW.verification_token = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_expired_tokens
  BEFORE UPDATE ON fda_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_expired_tokens();

-- 12. Create function to auto-disable high bounce subscribers
CREATE OR REPLACE FUNCTION auto_disable_bounced_subscribers()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-disable if bounce count reaches 3
  IF NEW.bounce_count >= 3 AND NEW.is_active = true THEN
    NEW.is_active = false;
    NEW.metadata = jsonb_set(
      COALESCE(NEW.metadata, '{}'::jsonb),
      '{auto_disabled_reason}',
      '"high_bounce_rate"'::jsonb
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_disable_bounced
  BEFORE UPDATE ON fda_subscriptions
  FOR EACH ROW
  WHEN (NEW.bounce_count IS DISTINCT FROM OLD.bounce_count)
  EXECUTE FUNCTION auto_disable_bounced_subscribers();

-- 13. RLS policies for cron_job_logs (admin only)
ALTER TABLE cron_job_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view cron logs"
  ON cron_job_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "System can insert cron logs"
  ON cron_job_logs
  FOR INSERT
  WITH CHECK (true);

-- 14. Create helper function for cache hit tracking
CREATE OR REPLACE FUNCTION increment_cache_hit(p_cache_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE fda_alerts_cache
  SET 
    hit_count = hit_count + 1,
    last_accessed_at = NOW()
  WHERE id = p_cache_id;
END;
$$ LANGUAGE plpgsql;

-- 15. Grant permissions
GRANT SELECT, INSERT, UPDATE ON cron_job_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON fda_alerts_cache TO authenticated;
GRANT EXECUTE ON FUNCTION increment_cache_hit TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify indexes were created
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('fda_subscriptions', 'fda_alerts_cache', 'cron_job_logs')
ORDER BY tablename, indexname;

-- Check new columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'fda_subscriptions'
  AND column_name IN ('token_expires_at', 'bounce_count', 'last_bounce_at');

-- Show sample cron_job_logs structure
SELECT * FROM cron_job_logs LIMIT 0;
