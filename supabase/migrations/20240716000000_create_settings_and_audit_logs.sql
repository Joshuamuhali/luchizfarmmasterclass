-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  masterclass_title TEXT NOT NULL DEFAULT 'Pig Farming Masterclass',
  masterclass_date TEXT NOT NULL DEFAULT '2024-08-05',
  masterclass_time TEXT NOT NULL DEFAULT '19:30',
  whatsapp_link TEXT NOT NULL DEFAULT '',
  price DECIMAL(10, 2) NOT NULL DEFAULT 400,
  max_seats INTEGER NOT NULL DEFAULT 250,
  airtel_money_number TEXT NOT NULL DEFAULT '',
  account_name TEXT NOT NULL DEFAULT 'Luchiz Farm',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL, -- registration, content, announcement, settings
  target_id INTEGER,
  target_name TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_settings_id ON settings(id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_type ON audit_logs(target_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for settings
-- Everyone can view settings
CREATE POLICY "Everyone can view settings" ON settings
  FOR SELECT USING (true);

-- Admins can update settings
CREATE POLICY "Admins can update settings" ON settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admins can insert settings
CREATE POLICY "Admins can insert settings" ON settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for audit_logs
-- Admins can view all audit logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admins can insert audit logs
CREATE POLICY "Admins can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Create trigger for settings updated_at
CREATE OR REPLACE FUNCTION update_settings_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_settings_updated_at_column();

-- Insert default settings
INSERT INTO settings (masterclass_title, masterclass_date, masterclass_time, price, max_seats)
VALUES ('Pig Farming Masterclass', '2026-08-15', '19:30', 400, 250)
ON CONFLICT (id) DO NOTHING;