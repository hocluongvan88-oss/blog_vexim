-- Add attachments column to gacc_submissions table
-- This column will store uploaded file information as JSON

-- Add the attachments column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'gacc_submissions' 
    AND column_name = 'attachments'
  ) THEN
    ALTER TABLE gacc_submissions 
    ADD COLUMN attachments jsonb DEFAULT '[]'::jsonb;
    
    -- Add comment
    COMMENT ON COLUMN gacc_submissions.attachments IS 'JSON array of uploaded files with metadata (fieldId, fileName, fileUrl, fileSize, uploadedAt)';
  END IF;
END $$;
