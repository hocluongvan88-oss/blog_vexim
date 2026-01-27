-- FINAL FIX: Remove RLS completely or use service_role bypass
-- The issue is that RLS policies cannot access auth.users table when called from API routes
-- Solution: Disable RLS entirely since we're checking permissions in the API layer

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can manage FDA registrations" ON fda_registrations;
DROP POLICY IF EXISTS "Admins can manage renewal reminders" ON fda_renewal_reminders;

-- Disable RLS on these tables since we handle auth in API layer
ALTER TABLE fda_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE fda_renewal_reminders DISABLE ROW LEVEL SECURITY;

-- Add comments explaining the security model
COMMENT ON TABLE fda_registrations IS 'Security handled in API layer - admin auth checked before queries';
COMMENT ON TABLE fda_renewal_reminders IS 'Security handled in API layer - admin auth checked before queries';

-- Verify RLS is disabled
DO $$
DECLARE
  fda_rls_enabled boolean;
  reminders_rls_enabled boolean;
BEGIN
  SELECT relrowsecurity INTO fda_rls_enabled
  FROM pg_class
  WHERE relname = 'fda_registrations';
  
  SELECT relrowsecurity INTO reminders_rls_enabled
  FROM pg_class
  WHERE relname = 'fda_renewal_reminders';
  
  IF fda_rls_enabled THEN
    RAISE WARNING 'RLS still enabled on fda_registrations';
  ELSE
    RAISE NOTICE '✓ RLS disabled on fda_registrations';
  END IF;
  
  IF reminders_rls_enabled THEN
    RAISE WARNING 'RLS still enabled on fda_renewal_reminders';
  ELSE
    RAISE NOTICE '✓ RLS disabled on fda_renewal_reminders';
  END IF;
END;
$$;
