-- Fix RLS policies for FDA registrations to use admin_users instead of auth.users
-- This fixes the "permission denied for table users" error

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage FDA registrations" ON fda_registrations;
DROP POLICY IF EXISTS "Admins can manage renewal reminders" ON fda_renewal_reminders;

-- Create new policies that use admin_users table instead of auth.users
CREATE POLICY "Admins can manage FDA registrations"
  ON fda_registrations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage renewal reminders"
  ON fda_renewal_reminders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

COMMENT ON POLICY "Admins can manage FDA registrations" ON fda_registrations IS 'Only users listed in admin_users table can access FDA registrations';
COMMENT ON POLICY "Admins can manage renewal reminders" ON fda_renewal_reminders IS 'Only users listed in admin_users table can access renewal reminders';
