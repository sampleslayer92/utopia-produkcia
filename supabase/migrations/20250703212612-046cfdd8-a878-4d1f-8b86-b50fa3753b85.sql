-- Reverse migration: Restore deleted tables and columns
-- This restores items removed in migration 20250703210441

-- Restore user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Restore contract_item_addons table
CREATE TABLE IF NOT EXISTS contract_item_addons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_item_id uuid NOT NULL,
  addon_id text NOT NULL,
  addon_name text NOT NULL,
  count integer NOT NULL DEFAULT 1,
  monthly_fee numeric NOT NULL DEFAULT 0,
  company_cost numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Restore contract_templates table
CREATE TABLE IF NOT EXISTS contract_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  template_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Restore deleted columns
ALTER TABLE authorized_persons ADD COLUMN IF NOT EXISTS maiden_name text;
ALTER TABLE actual_owners ADD COLUMN IF NOT EXISTS maiden_name text;
ALTER TABLE business_locations ADD COLUMN IF NOT EXISTS seasonal_weeks integer;
ALTER TABLE device_selection ADD COLUMN IF NOT EXISTS note text;
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS sales_note text;
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS user_role text;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS lost_notes text;

-- Enable RLS on restored tables
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for restored tables
CREATE POLICY "Users can manage their own sessions" ON user_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow all operations on contract_item_addons" ON contract_item_addons
  FOR ALL USING (true);

CREATE POLICY "Admins can manage contract templates" ON contract_templates
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "All users can view active templates" ON contract_templates
  FOR SELECT USING (is_active = true);