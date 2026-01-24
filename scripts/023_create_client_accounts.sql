-- Client Management System
-- Allows admin to create client accounts who can view their FDA registrations

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- bcrypt hash
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Add client_id to fda_registrations
ALTER TABLE fda_registrations 
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_fda_registrations_client_id ON fda_registrations(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- RLS Policies for clients table (allow service role access for API)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage all clients (for API routes)
CREATE POLICY "Service role full access to clients"
  ON clients FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to read clients for login verification
CREATE POLICY "Allow anon read for login"
  ON clients FOR SELECT
  TO anon
  USING (true);

-- Update RLS for fda_registrations to allow service role access
CREATE POLICY "Service role full access to fda_registrations"
  ON fda_registrations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create client sessions table for custom auth
CREATE TABLE IF NOT EXISTS client_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_sessions_token ON client_sessions(token);
CREATE INDEX IF NOT EXISTS idx_client_sessions_client_id ON client_sessions(client_id);

-- RLS for client_sessions
ALTER TABLE client_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to client_sessions"
  ON client_sessions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to check sessions
CREATE POLICY "Allow anon read sessions"
  ON client_sessions FOR SELECT
  TO anon
  USING (true);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_client_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM client_sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION cleanup_expired_client_sessions() TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_expired_client_sessions() TO anon;

-- Create notification preferences for clients
CREATE TABLE IF NOT EXISTS client_notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  zalo_enabled BOOLEAN DEFAULT false,
  zalo_phone TEXT,
  reminder_days INTEGER[] DEFAULT ARRAY[90, 180], -- Days before expiry to send reminders
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id)
);

-- RLS for notification preferences
ALTER TABLE client_notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to client_notification_preferences"
  ON client_notification_preferences FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add some helpful comments
COMMENT ON TABLE clients IS 'Client accounts - customers who can view their FDA registrations';
COMMENT ON TABLE client_sessions IS 'Custom session management for client authentication';
COMMENT ON TABLE client_notification_preferences IS 'Notification settings for each client';
COMMENT ON COLUMN fda_registrations.client_id IS 'Links registration to a client account';
