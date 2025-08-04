-- Create table for shareable onboarding links
CREATE TABLE IF NOT EXISTS public.shareable_onboarding_links (
  id TEXT PRIMARY KEY,
  configuration_id UUID NOT NULL REFERENCES public.onboarding_configurations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shareable_onboarding_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage shareable links" ON public.shareable_onboarding_links
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active shareable links" ON public.shareable_onboarding_links
  FOR SELECT USING (is_active = true);

-- Add trigger for updating timestamps
CREATE TRIGGER update_shareable_onboarding_links_updated_at
  BEFORE UPDATE ON public.shareable_onboarding_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();