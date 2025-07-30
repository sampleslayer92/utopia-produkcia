-- Create onboarding_configurations table
CREATE TABLE public.onboarding_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage onboarding configurations" 
ON public.onboarding_configurations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active configurations" 
ON public.onboarding_configurations 
FOR SELECT 
USING (is_active = true);

-- Add trigger for timestamps
CREATE TRIGGER update_onboarding_configurations_updated_at
BEFORE UPDATE ON public.onboarding_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key relationship to existing onboarding_steps table
ALTER TABLE public.onboarding_steps 
ADD CONSTRAINT fk_onboarding_steps_configuration 
FOREIGN KEY (configuration_id) REFERENCES public.onboarding_configurations(id) 
ON DELETE CASCADE;