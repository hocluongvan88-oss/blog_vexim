-- Fix knowledge_documents table schema
ALTER TABLE knowledge_documents 
ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'text',
ADD COLUMN IF NOT EXISTS chunks_count INTEGER DEFAULT 0;

-- Update knowledge_chunks table to match API expectations
ALTER TABLE knowledge_chunks 
RENAME COLUMN chunk_text TO content;

ALTER TABLE knowledge_chunks 
ADD COLUMN IF NOT EXISTS token_count INTEGER DEFAULT 0;

-- Drop the old index and recreate with new column name
DROP INDEX IF EXISTS idx_knowledge_chunks_chunk_text_fts;
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_content_fts  
  ON knowledge_chunks USING gin(to_tsvector('english', content));

-- Refresh schema
NOTIFY pgrst, 'reload schema';
