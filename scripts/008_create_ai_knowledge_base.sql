-- 1. Khởi tạo các bảng (Giữ nguyên logic IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, 
  tags TEXT[],
  source_url TEXT,
  status TEXT DEFAULT 'active', 
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_chunk_text_fts  
  ON knowledge_chunks USING gin(to_tsvector('english', chunk_text));

CREATE TABLE IF NOT EXISTS ai_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_handovers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  from_type TEXT NOT NULL, 
  to_type TEXT NOT NULL,
  reason TEXT,
  agent_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Cập nhật cột bổ sung cho các bảng hiện có
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS assigned_agent_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS handover_mode TEXT DEFAULT 'auto',
ADD COLUMN IF NOT EXISTS ai_confidence FLOAT DEFAULT 0.0;

ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS ai_model TEXT,
ADD COLUMN IF NOT EXISTS ai_confidence FLOAT,
ADD COLUMN IF NOT EXISTS sources_used TEXT[];

-- 3. Kích hoạt RLS
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_handovers ENABLE ROW LEVEL SECURITY;

-- 4. GIẢI PHÁP SỬA LỖI: Xóa Policy cũ trước khi tạo mới để tránh lỗi 42710
DO $$ 
BEGIN
    -- Xử lý cho knowledge_documents
    DROP POLICY IF EXISTS "Admin can manage knowledge documents" ON knowledge_documents;
    CREATE POLICY "Admin can manage knowledge documents" ON knowledge_documents FOR ALL
    USING (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'));

    -- Xử lý cho knowledge_chunks
    DROP POLICY IF EXISTS "Admin can manage knowledge chunks" ON knowledge_chunks;
    CREATE POLICY "Admin can manage knowledge chunks" ON knowledge_chunks FOR ALL
    USING (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'));

    -- Xử lý cho ai_config
    DROP POLICY IF EXISTS "Admin can manage AI config" ON ai_config;
    CREATE POLICY "Admin can manage AI config" ON ai_config FOR ALL
    USING (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'));

    -- Xử lý cho handovers
    DROP POLICY IF EXISTS "Admin and agents can view handovers" ON conversation_handovers;
    CREATE POLICY "Admin and agents can view handovers" ON conversation_handovers FOR SELECT
    USING (auth.jwt() ->> 'email' IN ('admin@veximglobal.com', 'hocluongvan88@gmail.com'));

    DROP POLICY IF EXISTS "System can insert handovers" ON conversation_handovers;
    CREATE POLICY "System can insert handovers" ON conversation_handovers FOR INSERT
    WITH CHECK (true);
END $$;

-- 5. Chèn cấu hình mặc định (Groq Llama 3)
INSERT INTO ai_config (key, value, description) VALUES
  ('groq_model', '"llama-3.3-70b-versatile"', 'Tên mô hình AI trên Groq'),
  ('max_tokens', '1024', 'Số lượng token tối đa'),
  ('temperature', '0.7', 'Độ sáng tạo của AI'),
  ('rag_enabled', 'true', 'Bật tính năng tra cứu kiến thức (RAG)'),
  ('system_prompt', '"Bạn là chuyên gia tư vấn pháp lý của Vexim Global. Hãy trả lời cực nhanh, chính xác về FDA, GACC bằng tiếng Việt chuyên nghiệp."', 'Câu lệnh hệ thống')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 6. Làm mới Schema
NOTIFY pgrst, 'reload schema';
