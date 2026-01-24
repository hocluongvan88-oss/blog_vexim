-- =====================================================
-- PHASE 2: HIGH PRIORITY IMPROVEMENTS
-- H-3: Token expiry
-- H-4: Email bounce handling  
-- C-4: AI summary cache
-- H-2: Rate limiting
-- =====================================================

-- =====================================================
-- H-3: ADD TOKEN EXPIRY TO FDA SUBSCRIPTIONS
-- =====================================================

-- Add token_expires_at column
ALTER TABLE fda_subscriptions
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP WITH TIME ZONE;

-- Set expiry for existing tokens (24 hours from creation)
UPDATE fda_subscriptions
SET token_expires_at = created_at + INTERVAL '24 hours'
WHERE token_expires_at IS NULL;

-- Make token_expires_at required for new rows
ALTER TABLE fda_subscriptions
ALTER COLUMN token_expires_at SET DEFAULT (NOW() + INTERVAL '24 hours');

COMMENT ON COLUMN fda_subscriptions.token_expires_at IS 'Verification token expiration timestamp (24 hours from creation)';

-- =====================================================
-- H-4: EMAIL BOUNCE HANDLING
-- =====================================================

-- Add bounce tracking columns
ALTER TABLE fda_subscriptions
ADD COLUMN IF NOT EXISTS bounce_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_bounce_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS bounce_type TEXT;

COMMENT ON COLUMN fda_subscriptions.bounce_count IS 'Number of email bounces (auto-disable after 3)';
COMMENT ON COLUMN fda_subscriptions.last_bounce_at IS 'Timestamp of last email bounce';
COMMENT ON COLUMN fda_subscriptions.bounce_type IS 'Type of bounce: hard, soft, complaint';

-- Create index for bounce queries
CREATE INDEX IF NOT EXISTS idx_fda_subscriptions_bounce 
ON fda_subscriptions(bounce_count, is_active) 
WHERE bounce_count > 0;

-- =====================================================
-- C-4: AI SUMMARY CACHE IN FDA_ALERTS_CACHE
-- =====================================================

-- Add AI summary fields to cache table
ALTER TABLE fda_alerts_cache
ADD COLUMN IF NOT EXISTS ai_summaries JSONB;

COMMENT ON COLUMN fda_alerts_cache.ai_summaries IS 'Cached AI-generated Vietnamese summaries for FDA items {item_id: summary_text}';

-- Create GIN index for JSONB queries
CREATE INDEX IF NOT EXISTS idx_fda_alerts_cache_ai_summaries 
ON fda_alerts_cache USING GIN(ai_summaries);

-- =====================================================
-- H-2: RATE LIMITING TABLE
-- =====================================================

-- Create rate_limits table for API endpoint rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- IP address, email, or API key
    endpoint TEXT NOT NULL,   -- API endpoint path
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Composite index for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limits_identifier_endpoint 
ON rate_limits(identifier, endpoint, window_start);

-- Index for cleanup old entries
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start 
ON rate_limits(window_start DESC);

COMMENT ON TABLE rate_limits IS 'Rate limiting tracking for API endpoints (IP-based throttling)';
COMMENT ON COLUMN rate_limits.identifier IS 'Client identifier (IP address, email, or API key)';
COMMENT ON COLUMN rate_limits.endpoint IS 'API endpoint being rate limited';
COMMENT ON COLUMN rate_limits.request_count IS 'Number of requests in current window';
COMMENT ON COLUMN rate_limits.window_start IS 'Start of current rate limit window';

-- Enable RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admin can view rate limits"
    ON rate_limits FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin');

-- =====================================================
-- CLEANUP FUNCTION FOR RATE LIMITS
-- =====================================================

-- Function to clean up old rate limit entries (older than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM rate_limits
    WHERE window_start < NOW() - INTERVAL '1 hour';
    
    RAISE NOTICE 'Cleaned up old rate limit entries';
END;
$$;

COMMENT ON FUNCTION cleanup_old_rate_limits IS 'Removes rate limit entries older than 1 hour';

-- =====================================================
-- UPDATE INDEXES FROM PHASE 1 (if not already applied)
-- =====================================================

-- Composite index for cron digest queries
CREATE INDEX IF NOT EXISTS idx_fda_subscriptions_active_digest 
ON fda_subscriptions(is_active, verified, frequency) 
WHERE is_active = true AND verified = true;

-- Index for last_sent_at tracking
CREATE INDEX IF NOT EXISTS idx_fda_subscriptions_last_sent 
ON fda_subscriptions(last_sent_at DESC);

-- Index for verification token with expiry
CREATE INDEX IF NOT EXISTS idx_fda_subscriptions_verification 
ON fda_subscriptions(verification_token, token_expires_at)
WHERE verified = false;

-- =====================================================
-- SUMMARY & VERIFICATION
-- =====================================================

-- Verify all new columns exist
DO $$
DECLARE
    missing_columns TEXT[];
BEGIN
    SELECT ARRAY_AGG(column_name)
    INTO missing_columns
    FROM (
        SELECT 'token_expires_at' AS column_name
        WHERE NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'fda_subscriptions' AND column_name = 'token_expires_at'
        )
        UNION ALL
        SELECT 'bounce_count'
        WHERE NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'fda_subscriptions' AND column_name = 'bounce_count'
        )
        UNION ALL
        SELECT 'ai_summaries'
        WHERE NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'fda_alerts_cache' AND column_name = 'ai_summaries'
        )
    ) AS missing;

    IF missing_columns IS NOT NULL THEN
        RAISE WARNING 'Missing columns: %', array_to_string(missing_columns, ', ');
    ELSE
        RAISE NOTICE 'Phase 2 migration completed successfully!';
        RAISE NOTICE '✓ Token expiry added';
        RAISE NOTICE '✓ Email bounce tracking added';
        RAISE NOTICE '✓ AI summary cache added';
        RAISE NOTICE '✓ Rate limiting table created';
    END IF;
END;
$$;
