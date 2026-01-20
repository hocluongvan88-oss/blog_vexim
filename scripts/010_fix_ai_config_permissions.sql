-- Fix RLS policies cho ai_config và knowledge base để chatbot có thể đọc

-- Drop existing policies cho ai_config
DROP POLICY IF EXISTS "Admin can manage AI config" ON ai_config;

-- Tạo policies mới cho ai_config
-- Allow anonymous and authenticated users to read config
CREATE POLICY "Allow anonymous read ai_config"
  ON ai_config
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read ai_config"
  ON ai_config
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admin can insert/update/delete
CREATE POLICY "Admin can manage ai_config"
  ON ai_config
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'));

-- Drop existing policies cho knowledge_documents
DROP POLICY IF EXISTS "Admin can manage knowledge documents" ON knowledge_documents;

-- Tạo policies mới cho knowledge_documents
CREATE POLICY "Allow anonymous read active knowledge_documents"
  ON knowledge_documents
  FOR SELECT
  TO anon
  USING (status = 'active');

CREATE POLICY "Allow authenticated read active knowledge_documents"
  ON knowledge_documents
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Admin can manage all
CREATE POLICY "Admin can manage knowledge_documents"
  ON knowledge_documents
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'));

-- Drop existing policies cho knowledge_chunks
DROP POLICY IF EXISTS "Admin can manage knowledge chunks" ON knowledge_chunks;

-- Tạo policies mới cho knowledge_chunks
CREATE POLICY "Allow anonymous read knowledge_chunks"
  ON knowledge_chunks
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read knowledge_chunks"
  ON knowledge_chunks
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin can manage all
CREATE POLICY "Admin can manage knowledge_chunks"
  ON knowledge_chunks
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'));

-- Fix conversation_handovers policies
DROP POLICY IF EXISTS "Admin and agents can view handovers" ON conversation_handovers;
DROP POLICY IF EXISTS "System can insert handovers" ON conversation_handovers;

CREATE POLICY "Allow anonymous insert handovers"
  ON conversation_handovers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert handovers"
  ON conversation_handovers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous read handovers"
  ON conversation_handovers
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read handovers"
  ON conversation_handovers
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin can manage all
CREATE POLICY "Admin can manage handovers"
  ON conversation_handovers
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'))
  WITH CHECK (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'));

COMMENT ON TABLE ai_config IS 'AI configuration - accessible by anonymous users for chatbot';
COMMENT ON TABLE knowledge_documents IS 'Knowledge base documents - active ones readable by anonymous users';
COMMENT ON TABLE knowledge_chunks IS 'Knowledge base chunks - readable by anonymous users';
