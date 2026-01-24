-- FDA Registrations Management System
-- Quản lý thông tin đăng ký FDA của các công ty/khách hàng
-- Bao gồm mã hóa an toàn cho thông tin nhạy cảm (User ID, Password, PIN)

-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create FDA Registrations table
CREATE TABLE IF NOT EXISTS fda_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Company Information
  company_name TEXT NOT NULL,
  company_name_english TEXT,
  company_address TEXT NOT NULL,
  company_city TEXT,
  company_state TEXT,
  company_country TEXT NOT NULL DEFAULT 'Vietnam',
  company_phone TEXT,
  company_email TEXT,
  
  -- Contact Person
  contact_name TEXT NOT NULL,
  contact_title TEXT,
  contact_phone TEXT,
  contact_email TEXT NOT NULL,
  
  -- Registration Information
  registration_type TEXT NOT NULL, -- 'Food Facility', 'Drug', 'Device', 'Cosmetic', etc.
  registration_number TEXT, -- FDA Registration Number sau khi đăng ký
  fei_number TEXT, -- Facility Establishment Identifier
  duns_number TEXT, -- Data Universal Numbering System
  
  -- Registration Dates
  initial_registration_date DATE,
  last_renewal_date DATE,
  expiration_date DATE NOT NULL,
  next_renewal_date DATE,
  
  -- FDA Account Credentials (ENCRYPTED)
  fda_user_id_encrypted BYTEA, -- Encrypted FDA User ID
  fda_password_encrypted BYTEA, -- Encrypted FDA Password  
  fda_pin_encrypted BYTEA, -- Encrypted FDA PIN
  
  -- US Agent Information (if applicable)
  uses_us_agent BOOLEAN DEFAULT false,
  agent_company_name TEXT,
  agent_name TEXT,
  agent_phone TEXT,
  agent_email TEXT,
  agent_address TEXT,
  agent_contract_start_date DATE,
  agent_contract_end_date DATE,
  agent_contract_years INTEGER, -- Số năm hợp đồng: 1, 2, 3, 4, 5 hoặc nhiều hơn
  
  -- Facility/Product Details
  facility_type TEXT,
  product_categories TEXT[], -- Array of product categories
  products_description TEXT,
  
  -- Reminder Settings
  reminder_months_before INTEGER DEFAULT 6, -- Nhắc trước bao nhiêu tháng (mặc định 6 tháng)
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Status & Notes
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'pending_renewal', 'cancelled'
  notes TEXT,
  internal_notes TEXT, -- Ghi chú nội bộ, không hiển thị cho khách hàng
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fda_registrations_status_check 
    CHECK (status IN ('active', 'expired', 'pending_renewal', 'cancelled')),
  CONSTRAINT fda_registrations_type_check
    CHECK (registration_type IN ('Food Facility', 'Drug Establishment', 'Medical Device', 'Cosmetic', 'Dietary Supplement', 'Infant Formula', 'Other'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_fda_registrations_company ON fda_registrations(company_name);
CREATE INDEX IF NOT EXISTS idx_fda_registrations_status ON fda_registrations(status);
CREATE INDEX IF NOT EXISTS idx_fda_registrations_expiration ON fda_registrations(expiration_date);
CREATE INDEX IF NOT EXISTS idx_fda_registrations_renewal ON fda_registrations(next_renewal_date);
CREATE INDEX IF NOT EXISTS idx_fda_registrations_agent_expiration ON fda_registrations(agent_contract_end_date);
CREATE INDEX IF NOT EXISTS idx_fda_registrations_registration_number ON fda_registrations(registration_number);

-- Function to encrypt sensitive data
-- Sử dụng AES-256 encryption theo tiêu chuẩn ISO 27001
CREATE OR REPLACE FUNCTION encrypt_fda_credential(plaintext TEXT, encryption_key TEXT)
RETURNS BYTEA AS $$
BEGIN
  IF plaintext IS NULL OR plaintext = '' THEN
    RETURN NULL;
  END IF;
  RETURN pgp_sym_encrypt(plaintext, encryption_key, 'cipher-algo=aes256');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_fda_credential(encrypted BYTEA, encryption_key TEXT)
RETURNS TEXT AS $$
BEGIN
  IF encrypted IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN pgp_sym_decrypt(encrypted, encryption_key, 'cipher-algo=aes256');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_fda_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fda_registrations_updated_at
  BEFORE UPDATE ON fda_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_fda_registrations_updated_at();

-- Auto-update status based on dates
CREATE OR REPLACE FUNCTION update_fda_registration_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update status based on expiration date
  IF NEW.expiration_date < CURRENT_DATE THEN
    NEW.status = 'expired';
  ELSIF NEW.expiration_date <= CURRENT_DATE + INTERVAL '6 months' THEN
    NEW.status = 'pending_renewal';
  ELSE
    NEW.status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fda_registrations_status_update
  BEFORE INSERT OR UPDATE OF expiration_date ON fda_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_fda_registration_status();

-- Table for tracking renewal reminders
CREATE TABLE IF NOT EXISTS fda_renewal_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES fda_registrations(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'fda_renewal', 'agent_renewal'
  reminder_date DATE NOT NULL,
  months_before INTEGER NOT NULL,
  sent_via TEXT[], -- ['email', 'zalo']
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fda_renewal_reminders_type_check
    CHECK (reminder_type IN ('fda_renewal', 'agent_renewal')),
  CONSTRAINT fda_renewal_reminders_status_check
    CHECK (status IN ('pending', 'sent', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_fda_renewal_reminders_date ON fda_renewal_reminders(reminder_date, status);
CREATE INDEX IF NOT EXISTS idx_fda_renewal_reminders_registration ON fda_renewal_reminders(registration_id);

-- RLS Policies
ALTER TABLE fda_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fda_renewal_reminders ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can access FDA registrations
CREATE POLICY "Admins can manage FDA registrations"
  ON fda_registrations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        auth.users.email = 'admin@vexim.vn' 
        OR auth.users.raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

CREATE POLICY "Admins can manage renewal reminders"
  ON fda_renewal_reminders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (
        auth.users.email = 'admin@vexim.vn'
        OR auth.users.raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- Function to generate renewal reminders automatically
-- Chạy hàng ngày để tạo reminder cho các registration sắp hết hạn
CREATE OR REPLACE FUNCTION generate_fda_renewal_reminders()
RETURNS void AS $$
DECLARE
  reg RECORD;
  reminder_date DATE;
BEGIN
  -- Loop through active registrations
  FOR reg IN 
    SELECT * FROM fda_registrations 
    WHERE status IN ('active', 'pending_renewal')
    AND expiration_date IS NOT NULL
  LOOP
    -- Calculate reminder dates based on reminder_months_before
    reminder_date := reg.expiration_date - (reg.reminder_months_before || ' months')::INTERVAL;
    
    -- Create FDA renewal reminder if not exists and date is within next 7 days
    IF reminder_date <= CURRENT_DATE + INTERVAL '7 days' 
       AND reminder_date >= CURRENT_DATE THEN
      INSERT INTO fda_renewal_reminders (
        registration_id, 
        reminder_type, 
        reminder_date,
        months_before,
        sent_via
      )
      VALUES (
        reg.id, 
        'fda_renewal', 
        reminder_date,
        reg.reminder_months_before,
        ARRAY['email']
      )
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Create US Agent renewal reminder if applicable
    IF reg.uses_us_agent 
       AND reg.agent_contract_end_date IS NOT NULL 
       AND reg.agent_contract_end_date > CURRENT_DATE THEN
      
      reminder_date := reg.agent_contract_end_date - INTERVAL '3 months';
      
      IF reminder_date <= CURRENT_DATE + INTERVAL '7 days'
         AND reminder_date >= CURRENT_DATE THEN
        INSERT INTO fda_renewal_reminders (
          registration_id,
          reminder_type,
          reminder_date,
          months_before,
          sent_via
        )
        VALUES (
          reg.id,
          'agent_renewal',
          reminder_date,
          3,
          ARRAY['email']
        )
        ON CONFLICT DO NOTHING;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE fda_registrations IS 'Quản lý thông tin đăng ký FDA của các công ty khách hàng';
COMMENT ON TABLE fda_renewal_reminders IS 'Theo dõi và quản lý các lời nhắc gia hạn FDA và US Agent';
COMMENT ON COLUMN fda_registrations.fda_user_id_encrypted IS 'FDA User ID được mã hóa AES-256';
COMMENT ON COLUMN fda_registrations.fda_password_encrypted IS 'FDA Password được mã hóa AES-256';
COMMENT ON COLUMN fda_registrations.fda_pin_encrypted IS 'FDA PIN được mã hóa AES-256';
COMMENT ON FUNCTION encrypt_fda_credential IS 'Mã hóa thông tin nhạy cảm FDA bằng AES-256 (ISO 27001)';
COMMENT ON FUNCTION decrypt_fda_credential IS 'Giải mã thông tin nhạy cảm FDA';
COMMENT ON FUNCTION generate_fda_renewal_reminders IS 'Tự động tạo nhắc nhở gia hạn cho FDA và US Agent';
