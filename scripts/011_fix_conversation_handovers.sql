-- Add missing columns to conversation_handovers table

ALTER TABLE conversation_handovers 
ADD COLUMN IF NOT EXISTS agent_name TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS released_at TIMESTAMP WITH TIME ZONE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_conversation_handovers_conversation_id 
  ON conversation_handovers(conversation_id);
  
CREATE INDEX IF NOT EXISTS idx_conversation_handovers_status 
  ON conversation_handovers(status);

-- Update RLS policies to allow updates
DROP POLICY IF EXISTS "System can update handovers" ON conversation_handovers;
CREATE POLICY "System can update handovers" 
  ON conversation_handovers 
  FOR UPDATE 
  USING (true);

-- Add metadata column to conversations if missing
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Refresh schema
NOTIFY pgrst, 'reload schema';

-- Comment
COMMENT ON COLUMN conversation_handovers.status IS 'Status: active, released';
COMMENT ON COLUMN conversation_handovers.agent_name IS 'Name of agent who took over';
COMMENT ON COLUMN conversation_handovers.released_at IS 'When conversation was released back to AI';
