-- Add client_id to FDA Registrations
-- Liên kết mỗi FDA registration với một client account

-- Add client_id column
ALTER TABLE fda_registrations
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_fda_registrations_client_id ON fda_registrations(client_id);

-- Update RLS policies to include client access
DROP POLICY IF EXISTS "Clients can view own FDA registrations" ON fda_registrations;

CREATE POLICY "Clients can view own FDA registrations"
ON fda_registrations
FOR SELECT
USING (
  client_id IN (
    SELECT id FROM clients WHERE email = current_setting('request.jwt.claim.email', true)
  )
);

-- Allow service role full access
ALTER TABLE fda_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role has full access to FDA registrations" ON fda_registrations;

CREATE POLICY "Service role has full access to FDA registrations"
ON fda_registrations
FOR ALL
USING (true)
WITH CHECK (true);

COMMENT ON COLUMN fda_registrations.client_id IS 'Links FDA registration to a client account';
