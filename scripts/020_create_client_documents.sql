-- Client Documents System
-- Quản lý tài liệu cho khách hàng (certificates, contracts, reports)

BEGIN;

-- Table for client documents
CREATE TABLE IF NOT EXISTS public.client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.fda_registrations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL, -- 'certificate', 'contract', 'invoice', 'report', 'other'
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER, -- in bytes
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  is_visible_to_client BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON public.client_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_registration_id ON public.client_documents(registration_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_type ON public.client_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_client_documents_created_at ON public.client_documents(created_at DESC);

-- RLS Policies
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage all client documents" ON public.client_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_client_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS update_client_documents_updated_at_trigger ON public.client_documents;
CREATE TRIGGER update_client_documents_updated_at_trigger
  BEFORE UPDATE ON public.client_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_client_documents_updated_at();

COMMIT;
