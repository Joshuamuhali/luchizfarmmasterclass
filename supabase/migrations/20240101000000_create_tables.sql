-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  nrc TEXT,
  transaction_reference TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'airtel_money',
  amount DECIMAL(10, 2) NOT NULL DEFAULT 400,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create pdf_downloads table
CREATE TABLE IF NOT EXISTS pdf_downloads (
  id SERIAL PRIMARY KEY,
  registration_id INTEGER REFERENCES registrations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  downloaded_at TIMESTAMP DEFAULT NOW()
);

-- Create leads table for lead qualification
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  questionnaire_answers JSONB DEFAULT '{}',
  lead_score INTEGER DEFAULT 0,
  lead_priority TEXT DEFAULT 'low', -- high, medium, low
  lead_status TEXT DEFAULT 'new', -- new, qualified, follow_up, nurture, invited, registered
  farming_stage TEXT, -- existing_farmer, starter, researcher
  purchase_intent TEXT, -- high, medium, low
  recommended_action TEXT, -- allow_registration, follow_up, nurture
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add lead_id reference to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lead_id INTEGER REFERENCES leads(id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(lead_priority);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(lead_score);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  publish_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expiry_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_pdf_downloads_user_id ON pdf_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_downloads_registration_id ON pdf_downloads(registration_id);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for registrations table
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to get user registration
CREATE OR REPLACE FUNCTION get_user_registration(p_user_id UUID)
RETURNS TABLE (
  id INTEGER,
  user_id UUID,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  transaction_reference TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.user_id, r.full_name, r.phone, r.email, r.transaction_reference, r.status, r.created_at
  FROM registrations r
  WHERE r.user_id = p_user_id
  ORDER BY r.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is approved
CREATE OR REPLACE FUNCTION is_user_approved(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM registrations
    WHERE user_id = p_user_id AND status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for registrations
-- Users can view their own registration
CREATE POLICY "Users can view own registration" ON registrations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own registration
CREATE POLICY "Users can insert own registration" ON registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all registrations (you'll need to implement admin check)
CREATE POLICY "Admins can view all registrations" ON registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admins can update all registrations
CREATE POLICY "Admins can update all registrations" ON registrations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for pdf_downloads
-- Users can view their own downloads
CREATE POLICY "Users can view own downloads" ON pdf_downloads
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own downloads
CREATE POLICY "Users can insert own downloads" ON pdf_downloads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all downloads
CREATE POLICY "Admins can view all downloads" ON pdf_downloads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for announcements
-- Everyone can view active announcements
CREATE POLICY "Everyone can view active announcements" ON announcements
  FOR SELECT USING (is_active = true);

-- Admins can manage announcements
CREATE POLICY "Admins can insert announcements" ON announcements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can update announcements" ON announcements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can delete announcements" ON announcements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );