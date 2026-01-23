-- Add email column to gacc_submissions table
-- This migration adds the email field to store customer email for GACC submissions

-- Add email column
ALTER TABLE gacc_submissions
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN gacc_submissions.email IS 'Customer email address for contact and confirmation';

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_gacc_submissions_email ON gacc_submissions(email);
