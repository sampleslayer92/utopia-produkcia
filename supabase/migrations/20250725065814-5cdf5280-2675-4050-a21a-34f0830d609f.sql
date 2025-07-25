-- Create translations table for managing i18n translations
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  namespace TEXT NOT NULL,
  language TEXT NOT NULL,
  value TEXT NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(key, namespace, language)
);

-- Enable RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policies for translations
CREATE POLICY "Admins can manage all translations" 
ON public.translations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view translations" 
ON public.translations 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_translations_updated_at
BEFORE UPDATE ON public.translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_translations_namespace_language ON public.translations(namespace, language);
CREATE INDEX idx_translations_key_namespace ON public.translations(key, namespace);
CREATE INDEX idx_translations_language ON public.translations(language);