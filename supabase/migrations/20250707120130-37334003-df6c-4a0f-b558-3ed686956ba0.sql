-- Create contract_statuses table for dynamic status management
CREATE TABLE public.contract_statuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#6B7280',
  is_system BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general', -- 'general', 'in_progress', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contract_statuses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active contract statuses" 
ON public.contract_statuses 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage contract statuses" 
ON public.contract_statuses 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_contract_statuses_updated_at
BEFORE UPDATE ON public.contract_statuses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert system (default) statuses
INSERT INTO public.contract_statuses (name, label, description, color, is_system, position, category) VALUES
('draft', 'Draft', 'Nové žiadosti v koncepte', '#6B7280', true, 0, 'general'),
('in_progress', 'In Progress', 'Žiadosti v spracovaní', '#3B82F6', true, 1, 'in_progress'),
('sent_to_client', 'Sent to Client', 'Odoslané klientovi na kontrolu', '#8B5CF6', true, 2, 'in_progress'),
('email_viewed', 'Email Viewed', 'Email zobrazený klientom', '#EC4899', true, 3, 'in_progress'),
('contract_generated', 'Contract Generated', 'Kontrakt vygenerovaný', '#F59E0B', true, 4, 'in_progress'),
('waiting_for_signature', 'Waiting for Signature', 'Čaká na podpis', '#F97316', true, 5, 'in_progress'),
('signed', 'Signed', 'Podpísané', '#10B981', true, 6, 'completed'),
('approved', 'Approved', 'Schválené', '#059669', true, 7, 'completed'),
('lost', 'Lost', 'Stratené', '#EF4444', true, 8, 'cancelled'),
('rejected', 'Rejected', 'Zamietnuté', '#DC2626', true, 9, 'cancelled');

-- Create index for better performance
CREATE INDEX idx_contract_statuses_active ON public.contract_statuses(is_active);
CREATE INDEX idx_contract_statuses_category ON public.contract_statuses(category);
CREATE INDEX idx_contract_statuses_position ON public.contract_statuses(position);