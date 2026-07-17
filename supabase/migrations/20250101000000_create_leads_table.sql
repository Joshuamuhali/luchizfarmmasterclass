-- Create leads table for lead qualification system
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  
  -- Personal Information
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Questionnaire Responses
  current_farming_status TEXT,  -- commercially, small_scale, not_yet
  start_timeline TEXT,          -- operating, within_3_months, within_6_months, exploring
  has_land TEXT,                -- yes, no
  main_challenge TEXT,          -- starting, feed_costs, pig_health, marketing, general_knowledge
  joining_reason TEXT,          -- start_commercial, expand_farm, learn_before_investing, general_interest
  investment_status TEXT,       -- yes, partially, no
  
  -- Lead Qualification
  lead_score INTEGER DEFAULT 0,
  lead_rating TEXT DEFAULT 'needs_nurturing',  -- qualified, needs_nurturing
  
  -- Payment Status
  payment_status TEXT DEFAULT 'not_started',  -- not_started, conversation_started, proof_submitted, verified, rejected
  payment_verified_at TIMESTAMP,
  payment_verified_by TEXT,
  payment_notes TEXT,
  
  -- Access Status
  access_status TEXT DEFAULT 'not_eligible',  -- not_eligible, awaiting_payment, payment_confirmed, group_access_granted
  group_access_granted_at TIMESTAMP,
  group_access_granted_by TEXT,
  
  -- Tracking
  whatsapp_contacted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_lead_rating ON leads(lead_rating);
CREATE INDEX IF NOT EXISTS idx_leads_payment_status ON leads(payment_status);
CREATE INDEX IF NOT EXISTS idx_leads_access_status ON leads(access_status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- Insert default settings if not exists
INSERT INTO settings (id, masterclass_title, masterclass_date, masterclass_time, price, max_seats, airtel_money_number, account_name, whatsapp_number, registration_open, created_at, updated_at)
VALUES (
  1,
  'Luchiz Farm Masterclass',
  '2026-08-05',
  '19:30',
  400,
  250,
  '0979654602',
  'Luchiz Farm',
  '0979654602',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  whatsapp_number = EXCLUDED.whatsapp_number,
  updated_at = NOW();

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can submit a lead)
CREATE POLICY "Allow public lead submission" ON leads
  FOR INSERT WITH CHECK (true);

-- Create policy for admin to view all leads
CREATE POLICY "Allow admin to view all leads" ON leads
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create policy for admin to update leads
CREATE POLICY "Allow admin to update leads" ON leads
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create policy for public status check
CREATE POLICY "Allow public status check" ON leads
  FOR SELECT USING (false); -- Will be handled by API with proper validation