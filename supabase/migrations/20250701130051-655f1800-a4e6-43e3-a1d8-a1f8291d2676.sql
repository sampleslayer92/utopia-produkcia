
-- Create storage bucket for contracts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contracts', 'contracts', false);

-- Create RLS policies for contracts bucket
CREATE POLICY "Admins can upload contract documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'contracts' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view contract documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'contracts' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Merchants can view their contract documents" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'contracts' 
  AND has_role(auth.uid(), 'merchant'::app_role)
  AND name LIKE CONCAT('%/', (
    SELECT c.contract_number 
    FROM contracts c 
    JOIN merchants m ON c.merchant_id = m.id 
    WHERE m.contact_person_email = auth.email()
    LIMIT 1
  ), '%')
);

-- Add document management columns to contracts table
ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS document_url TEXT,
ADD COLUMN IF NOT EXISTS signed_document_url TEXT,
ADD COLUMN IF NOT EXISTS document_uploaded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS document_signed_at TIMESTAMP WITH TIME ZONE;

-- Create contract_templates table for template management
CREATE TABLE IF NOT EXISTS contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL DEFAULT 'standard',
  is_active BOOLEAN NOT NULL DEFAULT true,
  template_config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contract_templates
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for contract_templates
CREATE POLICY "Admins can manage contract templates" 
ON contract_templates FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create step_analytics table for performance monitoring
CREATE TABLE IF NOT EXISTS step_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL,
  step_number INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on step_analytics
ALTER TABLE step_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for step_analytics
CREATE POLICY "Admins can view all analytics" 
ON step_analytics FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow insert for step analytics" 
ON step_analytics FOR INSERT 
WITH CHECK (true);

-- Create error_logs table for error handling
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID,
  step_number INTEGER,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  user_agent TEXT,
  session_id TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on error_logs
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for error_logs
CREATE POLICY "Admins can manage error logs" 
ON error_logs FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow insert for error logs" 
ON error_logs FOR INSERT 
WITH CHECK (true);

-- Create user_sessions table for real-time collaboration
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  session_id TEXT NOT NULL,
  current_step INTEGER,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
CREATE POLICY "Users can manage their own sessions" 
ON user_sessions FOR ALL 
USING (user_email = auth.email());

CREATE POLICY "Admins can view all sessions" 
ON user_sessions FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));
