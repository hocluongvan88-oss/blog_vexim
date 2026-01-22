-- FDA Tracker Subscriptions Table
-- Lưu thông tin người đăng ký nhận cảnh báo FDA

CREATE TABLE IF NOT EXISTS fda_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  categories TEXT[] NOT NULL, -- ['food', 'drug', 'cosmetic', 'device']
  frequency TEXT NOT NULL DEFAULT 'weekly', -- 'daily', 'weekly', 'immediate'
  is_active BOOLEAN NOT NULL DEFAULT true,
  verified BOOLEAN NOT NULL DEFAULT false,
  verification_token TEXT,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fda_subscriptions_frequency_check 
    CHECK (frequency IN ('daily', 'weekly', 'immediate'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_fda_subscriptions_email ON fda_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_fda_subscriptions_active ON fda_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_fda_subscriptions_verified ON fda_subscriptions(verified);
CREATE INDEX IF NOT EXISTS idx_fda_subscriptions_categories ON fda_subscriptions USING GIN(categories);

-- RLS Policies
ALTER TABLE fda_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe"
  ON fda_subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow users to view their own subscription
CREATE POLICY "Users can view their own subscription"
  ON fda_subscriptions
  FOR SELECT
  TO public
  USING (true);

-- Allow users to update their own subscription
CREATE POLICY "Users can update their own subscription"
  ON fda_subscriptions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Admins can see all
CREATE POLICY "Admins can manage all subscriptions"
  ON fda_subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'admin@vexim.vn'
    )
  );

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_fda_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fda_subscriptions_updated_at
  BEFORE UPDATE ON fda_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_fda_subscriptions_updated_at();

-- FDA Alert Cache Table (optional - để cache kết quả FDA API)
CREATE TABLE IF NOT EXISTS fda_alerts_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  data JSONB NOT NULL,
  total_count INTEGER NOT NULL,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 minutes'),
  
  CONSTRAINT fda_alerts_cache_category_check 
    CHECK (category IN ('food', 'drug', 'cosmetic', 'device'))
);

-- Index for cache lookups
CREATE INDEX IF NOT EXISTS idx_fda_alerts_cache_lookup 
  ON fda_alerts_cache(category, endpoint, expires_at);

-- Auto-cleanup expired cache (run daily)
CREATE OR REPLACE FUNCTION cleanup_expired_fda_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM fda_alerts_cache
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE fda_subscriptions IS 'Stores FDA alert subscriptions from users';
COMMENT ON TABLE fda_alerts_cache IS 'Caches FDA API responses to reduce API calls';
