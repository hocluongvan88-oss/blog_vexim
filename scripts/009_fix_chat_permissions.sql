-- Fix RLS policies để cho phép chatbot hoạt động với anonymous users

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can view all conversations" ON conversations;
DROP POLICY IF EXISTS "System can insert conversations" ON conversations;
DROP POLICY IF EXISTS "System can update conversations" ON conversations;
DROP POLICY IF EXISTS "Admin can view all messages" ON chat_messages;
DROP POLICY IF EXISTS "System can insert messages" ON chat_messages;

-- Policies mới cho conversations
-- Allow anonymous users to insert and update their own conversations
CREATE POLICY "Allow anonymous insert conversations"
  ON conversations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update conversations"
  ON conversations
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update conversations"
  ON conversations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select conversations"
  ON conversations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated select conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies mới cho chat_messages
-- Allow anonymous users to insert and select messages
CREATE POLICY "Allow anonymous insert messages"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select messages"
  ON chat_messages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated select messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Note: Admin panel sẽ cần authenticate với Supabase auth để quản lý conversations
COMMENT ON TABLE conversations IS 'Chatbot conversations - RLS policies updated for anonymous access';
