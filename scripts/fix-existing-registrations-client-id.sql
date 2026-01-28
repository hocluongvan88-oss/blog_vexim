-- Fix existing FDA registrations by linking them to correct clients based on contact email
-- This script will match registrations to clients by email address

-- Step 1: Show current state (registrations without client_id)
SELECT 
  id,
  company_name,
  contact_name,
  contact_email,
  client_id
FROM fda_registrations 
WHERE client_id IS NULL;

-- Step 2: Update registrations by matching contact_email with client email
UPDATE fda_registrations fr
SET client_id = c.id
FROM clients c
WHERE fr.contact_email = c.email
  AND fr.client_id IS NULL;

-- Step 3: Verify the update
SELECT 
  fr.id,
  fr.company_name,
  fr.contact_name,
  fr.contact_email,
  fr.client_id,
  c.company_name as client_company,
  c.email as client_email
FROM fda_registrations fr
LEFT JOIN clients c ON fr.client_id = c.id
ORDER BY fr.created_at DESC;

-- Step 4: Show any registrations that still don't have a client_id (need manual fixing)
SELECT 
  id,
  company_name,
  contact_name,
  contact_email,
  'No matching client found' as issue
FROM fda_registrations 
WHERE client_id IS NULL;
