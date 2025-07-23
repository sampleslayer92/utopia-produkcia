
-- Create custom field definitions table
CREATE TABLE public.custom_field_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id),
  item_type_id UUID REFERENCES public.item_types(id),
  field_name TEXT NOT NULL,
  field_key TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'boolean', 'select', 'checkbox', 'textarea', 'checkbox_group')),
  field_options JSONB DEFAULT NULL, -- For select options or checkbox groups
  is_required BOOLEAN NOT NULL DEFAULT false,
  default_value TEXT,
  validation_rules JSONB DEFAULT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  help_text TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_field_definitions ENABLE ROW LEVEL SECURITY;

-- Create policies for custom_field_definitions
CREATE POLICY "Admins can manage custom field definitions"
ON public.custom_field_definitions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Partners can view custom field definitions"
ON public.custom_field_definitions
FOR SELECT
USING (has_role(auth.uid(), 'partner'::app_role));

CREATE POLICY "Anyone can view active custom field definitions"
ON public.custom_field_definitions
FOR SELECT
USING (is_active = true);

-- Create updated_at trigger
CREATE TRIGGER update_custom_field_definitions_updated_at
BEFORE UPDATE ON public.custom_field_definitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add custom_fields column to warehouse_items table
ALTER TABLE public.warehouse_items 
ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';

-- Insert sample custom field definitions for payment terminals
INSERT INTO public.custom_field_definitions (
  category_id,
  field_name,
  field_key,
  field_type,
  field_options,
  is_required,
  display_order,
  help_text
) VALUES 
(
  (SELECT id FROM categories WHERE slug = 'terminals'),
  'Typ transakcie',
  'transaction_types',
  'checkbox_group',
  '{"options": [{"value": "tip", "label": "Sprepitné"}, {"value": "manual", "label": "Manuálny vstup"}, {"value": "test", "label": "Test"}]}'::jsonb,
  false,
  1,
  'Vyberte podporované typy transakcií'
),
(
  (SELECT id FROM categories WHERE slug = 'terminals'),
  'Konektivita',
  'connectivity',
  'checkbox_group',
  '{"options": [{"value": "wifi", "label": "WiFi"}, {"value": "ethernet", "label": "Ethernet"}, {"value": "4g", "label": "4G/LTE"}, {"value": "bluetooth", "label": "Bluetooth"}]}'::jsonb,
  true,
  2,
  'Vyberte dostupné možnosti pripojenia'
),
(
  (SELECT id FROM categories WHERE slug = 'terminals'),
  'Veľkosť displeja',
  'display_size',
  'select',
  '{"options": [{"value": "2.8", "label": "2.8 palca"}, {"value": "4.0", "label": "4.0 palca"}, {"value": "5.5", "label": "5.5 palca"}, {"value": "7.0", "label": "7.0 palca"}]}'::jsonb,
  false,
  3,
  'Vyberte veľkosť displeja terminálu'
),
(
  (SELECT id FROM categories WHERE slug = 'terminals'),
  'Má vstavaný printer',
  'has_printer',
  'boolean',
  NULL,
  false,
  4,
  'Má terminál vstavaný printer pre účtenky?'
),
(
  (SELECT id FROM categories WHERE slug = 'terminals'),
  'Certifikácie',
  'certifications',
  'textarea',
  NULL,
  false,
  5,
  'Zadajte certifikácie a štandardy (napr. EMV, PCI-DSS)'
);

-- Insert sample custom fields for software category
INSERT INTO public.custom_field_definitions (
  category_id,
  field_name,
  field_key,
  field_type,
  field_options,
  is_required,
  display_order,
  help_text
) VALUES 
(
  (SELECT id FROM categories WHERE slug = 'software'),
  'Podporované platformy',
  'platforms',
  'checkbox_group',
  '{"options": [{"value": "windows", "label": "Windows"}, {"value": "macos", "label": "macOS"}, {"value": "linux", "label": "Linux"}, {"value": "web", "label": "Web aplikácia"}, {"value": "mobile", "label": "Mobilná aplikácia"}]}'::jsonb,
  true,
  1,
  'Vyberte platformy, na ktorých softvér funguje'
),
(
  (SELECT id FROM categories WHERE slug = 'software'),
  'Maximálny počet používateľov',
  'max_users',
  'number',
  NULL,
  false,
  2,
  'Zadajte maximálny počet súbežných používateľov'
),
(
  (SELECT id FROM categories WHERE slug = 'software'),
  'Má API',
  'has_api',
  'boolean',
  NULL,
  false,
  3,
  'Poskytuje softvér API pre integrácie?'
),
(
  (SELECT id FROM categories WHERE slug = 'software'),
  'Typ licencie',
  'license_type',
  'select',
  '{"options": [{"value": "monthly", "label": "Mesačná licencia"}, {"value": "yearly", "label": "Ročná licencia"}, {"value": "perpetual", "label": "Trvalá licencia"}, {"value": "per_user", "label": "Per používateľ"}]}'::jsonb,
  true,
  4,
  'Vyberte typ licencovania'
);
