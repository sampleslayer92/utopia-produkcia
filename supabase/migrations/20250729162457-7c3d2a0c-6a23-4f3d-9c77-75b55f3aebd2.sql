-- Enable real-time for onboarding configuration tables
ALTER TABLE public.onboarding_configurations REPLICA IDENTITY FULL;
ALTER TABLE public.onboarding_steps REPLICA IDENTITY FULL;
ALTER TABLE public.onboarding_fields REPLICA IDENTITY FULL;

-- Add tables to real-time publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.onboarding_configurations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.onboarding_steps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.onboarding_fields;