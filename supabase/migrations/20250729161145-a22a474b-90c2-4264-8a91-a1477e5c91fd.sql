-- Create onboarding configurations table
CREATE TABLE public.onboarding_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create onboarding steps table
CREATE TABLE public.onboarding_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  configuration_id UUID NOT NULL REFERENCES public.onboarding_configurations(id) ON DELETE CASCADE,
  step_key TEXT NOT NULL, -- 'contact_info', 'company_info', etc.
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(configuration_id, step_key)
);

-- Create onboarding fields table
CREATE TABLE public.onboarding_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id UUID NOT NULL REFERENCES public.onboarding_steps(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL, -- 'firstName', 'lastName', etc.
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'email', 'select', 'checkbox', 'date'
  field_options JSONB, -- for select options, validation rules, etc.
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(step_id, field_key)
);

-- Enable RLS
ALTER TABLE public.onboarding_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_fields ENABLE ROW LEVEL SECURITY;

-- RLS Policies for onboarding_configurations
CREATE POLICY "Admins can manage onboarding configurations" 
ON public.onboarding_configurations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active configurations" 
ON public.onboarding_configurations 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for onboarding_steps
CREATE POLICY "Admins can manage onboarding steps" 
ON public.onboarding_steps 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view enabled steps" 
ON public.onboarding_steps 
FOR SELECT 
USING (is_enabled = true AND configuration_id IN (
  SELECT id FROM public.onboarding_configurations WHERE is_active = true
));

-- RLS Policies for onboarding_fields
CREATE POLICY "Admins can manage onboarding fields" 
ON public.onboarding_fields 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view enabled fields" 
ON public.onboarding_fields 
FOR SELECT 
USING (is_enabled = true AND step_id IN (
  SELECT s.id FROM public.onboarding_steps s
  JOIN public.onboarding_configurations c ON s.configuration_id = c.id
  WHERE s.is_enabled = true AND c.is_active = true
));

-- Create trigger for updated_at
CREATE TRIGGER update_onboarding_configurations_updated_at
BEFORE UPDATE ON public.onboarding_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_steps_updated_at
BEFORE UPDATE ON public.onboarding_steps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_fields_updated_at
BEFORE UPDATE ON public.onboarding_fields
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default configuration with standard onboarding steps
INSERT INTO public.onboarding_configurations (name, description, is_active, is_default) 
VALUES ('Standard Onboarding', 'Default onboarding process with all standard steps', true, true);

-- Get the default configuration ID
DO $$
DECLARE
    config_id UUID;
    step_contact_id UUID;
    step_company_id UUID;
    step_business_id UUID;
    step_device_id UUID;
    step_fees_id UUID;
    step_persons_id UUID;
    step_consents_id UUID;
BEGIN
    SELECT id INTO config_id FROM public.onboarding_configurations WHERE is_default = true LIMIT 1;
    
    -- Insert default steps
    INSERT INTO public.onboarding_steps (configuration_id, step_key, title, description, position) VALUES
    (config_id, 'contact_info', 'Contact Information', 'Basic contact information', 0) RETURNING id INTO step_contact_id;
    
    INSERT INTO public.onboarding_steps (configuration_id, step_key, title, description, position) VALUES
    (config_id, 'company_info', 'Company Information', 'Legal entity information', 1) RETURNING id INTO step_company_id;
    
    INSERT INTO public.onboarding_steps (configuration_id, step_key, title, description, position) VALUES
    (config_id, 'business_locations', 'Business Locations', 'Business location details', 2) RETURNING id INTO step_business_id;
    
    INSERT INTO public.onboarding_steps (configuration_id, step_key, title, description, position) VALUES
    (config_id, 'device_selection', 'Device Selection', 'Select payment devices and services', 3) RETURNING id INTO step_device_id;
    
    INSERT INTO public.onboarding_steps (configuration_id, step_key, title, description, position) VALUES
    (config_id, 'fees', 'Fees and Calculations', 'Review pricing and calculations', 4) RETURNING id INTO step_fees_id;
    
    INSERT INTO public.onboarding_steps (configuration_id, step_key, title, description, position) VALUES
    (config_id, 'persons_and_owners', 'Authorized Persons & Owners', 'Define authorized persons and actual owners', 5) RETURNING id INTO step_persons_id;
    
    INSERT INTO public.onboarding_steps (configuration_id, step_key, title, description, position) VALUES
    (config_id, 'consents', 'Consents and Signature', 'Final consents and signature', 6) RETURNING id INTO step_consents_id;
    
    -- Insert default fields for contact_info step
    INSERT INTO public.onboarding_fields (step_id, field_key, field_label, field_type, is_required, position) VALUES
    (step_contact_id, 'firstName', 'First Name', 'text', true, 0),
    (step_contact_id, 'lastName', 'Last Name', 'text', true, 1),
    (step_contact_id, 'email', 'Email', 'email', true, 2),
    (step_contact_id, 'phone', 'Phone Number', 'text', true, 3),
    (step_contact_id, 'salesNote', 'Sales Note', 'textarea', false, 4);
    
    -- Insert default fields for company_info step
    INSERT INTO public.onboarding_fields (step_id, field_key, field_label, field_type, is_required, position) VALUES
    (step_company_id, 'companyName', 'Company Name', 'text', true, 0),
    (step_company_id, 'ico', 'IČO', 'text', true, 1),
    (step_company_id, 'dic', 'DIČ', 'text', false, 2),
    (step_company_id, 'vatNumber', 'VAT Number', 'text', false, 3),
    (step_company_id, 'registeredAddress', 'Registered Address', 'textarea', true, 4);
    
END $$;