-- Tạo bảng conversations (hội thoại)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'website', 'facebook', 'zalo'
  status TEXT DEFAULT 'active', -- 'active', 'closed', 'pending'
  last_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng chat_messages (tin nhắn)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL, -- 'customer', 'bot', 'agent'
  message_text TEXT NOT NULL,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo indexes để tăng hiệu suất
CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies cho conversations (chỉ admin có thể xem)
CREATE POLICY "Admin can view all conversations"
  ON conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN ('admin@veximglobal.com', 'your-admin-email@example.com')
    )
  );

CREATE POLICY "System can insert conversations"
  ON conversations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update conversations"
  ON conversations
  FOR UPDATE
  USING (true);

-- Policies cho chat_messages
CREATE POLICY "Admin can view all messages"
  ON chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN ('admin@veximglobal.com', 'your-admin-email@example.com')
    )
  );

CREATE POLICY "System can insert messages"
  ON chat_messages
  FOR INSERT
  WITH CHECK (true);

-- Function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger để tự động cập nhật updated_at
CREATE TRIGGER update_conversations_timestamp
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Thêm comment
COMMENT ON TABLE conversations IS 'Bảng lưu trữ các cuộc hội thoại từ website, Facebook, Zalo';
COMMENT ON TABLE chat_messages IS 'Bảng lưu trữ tất cả tin nhắn trong các cuộc hội thoại';
