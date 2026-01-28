-- Fix FDA Registrations RLS to allow admin read access for joins
-- This allows admins to query fda_registrations when joining with client_documents

-- Drop existing admin read policy if it exists
DROP POLICY IF EXISTS "Admins can read all registrations" ON fda_registrations;

-- Create policy to allow admins to read all registrations
-- This is needed for joins in the client documents view
CREATE POLICY "Admins can read all registrations" ON fda_registrations
  FOR SELECT
  USING (
    -- Check if the user is an admin by email
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt()->>'email'
    )
  );
