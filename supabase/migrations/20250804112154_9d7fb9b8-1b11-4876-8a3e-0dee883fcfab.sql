-- Create step_modules table for storing modules in onboarding steps
CREATE TABLE public.step_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id UUID NOT NULL,
  module_key TEXT NOT NULL,
  module_name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.step_modules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage step modules" 
ON public.step_modules 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view enabled modules" 
ON public.step_modules 
FOR SELECT 
USING (
  is_enabled = true AND 
  step_id IN (
    SELECT s.id FROM onboarding_steps s 
    JOIN onboarding_configurations c ON s.configuration_id = c.id 
    WHERE s.is_enabled = true AND c.is_active = true
  )
);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_step_modules_updated_at
BEFORE UPDATE ON public.step_modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();