-- Fix client_documents RLS policies to properly check admin access by email
-- This matches how the API routes authenticate admins

BEGIN;

-- Drop existing policy
DROP POLICY IF EXISTS "Admins can manage all client documents" ON public.client_documents;

-- Create new policy that checks admin by email (matching API route logic)
CREATE POLICY "Admins can manage all client documents" ON public.client_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Also add policy for clients to view their own documents
CREATE POLICY "Clients can view their visible documents" ON public.client_documents
  FOR SELECT
  USING (
    is_visible_to_client = true
    AND client_id IN (
      SELECT id FROM public.clients
      WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

COMMIT;
