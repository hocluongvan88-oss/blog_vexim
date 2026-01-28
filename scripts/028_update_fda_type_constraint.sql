-- Update FDA registration_type check constraint to allow proper values
-- This fixes the constraint to match the form options

-- Drop old constraint
ALTER TABLE fda_registrations 
DROP CONSTRAINT IF EXISTS fda_registrations_type_check;

-- Add new constraint with correct values
ALTER TABLE fda_registrations 
ADD CONSTRAINT fda_registrations_type_check 
CHECK (registration_type IN (
  'Food Facility', 
  'Drug Establishment', 
  'Medical Device', 
  'Cosmetic', 
  'Dietary Supplement', 
  'Infant Formula', 
  'Other'
));

-- Verify constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'fda_registrations'::regclass 
  AND conname = 'fda_registrations_type_check';
