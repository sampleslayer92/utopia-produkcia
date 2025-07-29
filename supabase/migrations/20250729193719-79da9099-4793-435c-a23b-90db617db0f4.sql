-- Ensure the onboarding tables exist with proper structure
CREATE TABLE IF NOT EXISTS public.onboarding_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding_configurations
CREATE POLICY "Admins can manage all onboarding configurations" 
ON public.onboarding_configurations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active configurations" 
ON public.onboarding_configurations 
FOR SELECT 
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_onboarding_configurations_updated_at
BEFORE UPDATE ON public.onboarding_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Onboarding steps table should already exist, but ensure proper structure
-- Check if we need to add any missing columns to onboarding_steps
DO $$
BEGIN
  -- Add is_required column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'onboarding_steps' 
                 AND column_name = 'is_required') THEN
    ALTER TABLE public.onboarding_steps ADD COLUMN is_required BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- Onboarding fields table should already exist and has the right structure

-- Insert default configuration if none exists
INSERT INTO public.onboarding_configurations (name, description, is_active, is_default)
SELECT 'Standard Onboarding', 'Default onboarding process with all standard steps', true, true
WHERE NOT EXISTS (
  SELECT 1 FROM public.onboarding_configurations WHERE is_default = true
);