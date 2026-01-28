-- Fix RLS for clients table
-- The API already handles authentication via admin check, so we can safely disable RLS

-- Drop all existing policies on clients table
DROP POLICY IF EXISTS "Service role full access to clients" ON clients;
DROP POLICY IF EXISTS "Allow anon read for login" ON clients;

-- Disable RLS entirely on clients table since API handles auth
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Same for client_sessions
DROP POLICY IF EXISTS "Service role full access to client_sessions" ON client_sessions;
DROP POLICY IF EXISTS "Allow anon read sessions" ON client_sessions;
ALTER TABLE client_sessions DISABLE ROW LEVEL SECURITY;

-- And client_notification_preferences
DROP POLICY IF EXISTS "Service role full access to client_notification_preferences" ON client_notification_preferences;
ALTER TABLE client_notification_preferences DISABLE ROW LEVEL SECURITY;

-- Add comments
COMMENT ON TABLE clients IS 'Client accounts - RLS disabled, auth handled in API layer';
COMMENT ON TABLE client_sessions IS 'Client sessions - RLS disabled, auth handled in API layer';
