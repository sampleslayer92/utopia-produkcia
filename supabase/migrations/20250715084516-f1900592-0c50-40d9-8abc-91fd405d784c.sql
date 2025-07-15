-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  icon_url TEXT,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  item_type_filter TEXT NOT NULL DEFAULT 'both' CHECK (item_type_filter IN ('device', 'service', 'both')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create item_types table
CREATE TABLE public.item_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  icon_url TEXT,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  is_active BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to warehouse_items
ALTER TABLE public.warehouse_items 
ADD COLUMN category_id UUID REFERENCES public.categories(id),
ADD COLUMN item_type_id UUID REFERENCES public.item_types(id);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_types ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories
CREATE POLICY "Admins can manage all categories" 
ON public.categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active categories" 
ON public.categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Partners can view categories" 
ON public.categories 
FOR SELECT 
USING (has_role(auth.uid(), 'partner'::app_role));

-- RLS policies for item_types
CREATE POLICY "Admins can manage all item types" 
ON public.item_types 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active item types" 
ON public.item_types 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Partners can view item types" 
ON public.item_types 
FOR SELECT 
USING (has_role(auth.uid(), 'partner'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_item_types_updated_at
BEFORE UPDATE ON public.item_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories (Slovak names)
INSERT INTO public.categories (name, slug, description, icon_name, color, item_type_filter, position) VALUES
('Platobné terminály', 'platobne-terminaly', 'POS terminály a platobné zariadenia', 'CreditCard', '#3B82F6', 'device', 1),
('Softvér', 'software', 'Softvérové riešenia a aplikácie', 'MonitorSpeaker', '#10B981', 'service', 2),
('Technická podpora', 'technicka-podpora', 'Technické služby a podpora', 'Settings', '#F59E0B', 'service', 3),
('Príslušenstvo', 'prislusenstvo', 'Doplnky a príslušenstvo', 'Package', '#8B5CF6', 'device', 4),
('Integrované riešenia', 'integrovane-riesenia', 'Komplexné systémy', 'Layers', '#EF4444', 'both', 5);

-- Insert default item types
INSERT INTO public.item_types (name, slug, description, icon_name, color, position) VALUES
('Zariadenie', 'device', 'Fyzické zariadenia a hardware', 'Smartphone', '#3B82F6', 1),
('Služba', 'service', 'Služby a softvérové riešenia', 'Globe', '#10B981', 2);

-- Migrate existing warehouse_items data
UPDATE public.warehouse_items 
SET item_type_id = (
  SELECT id FROM public.item_types 
  WHERE slug = CASE 
    WHEN warehouse_items.item_type = 'device' THEN 'device'
    WHEN warehouse_items.item_type = 'service' THEN 'service' 
    ELSE 'device'
  END
  LIMIT 1
);

-- Migrate categories based on existing category strings
UPDATE public.warehouse_items 
SET category_id = (
  SELECT id FROM public.categories 
  WHERE slug = CASE 
    WHEN warehouse_items.category ILIKE '%terminal%' OR warehouse_items.category ILIKE '%pos%' THEN 'platobne-terminaly'
    WHEN warehouse_items.category ILIKE '%software%' OR warehouse_items.category ILIKE '%softvér%' THEN 'software'
    WHEN warehouse_items.category ILIKE '%podpora%' OR warehouse_items.category ILIKE '%support%' THEN 'technicka-podpora'
    WHEN warehouse_items.category ILIKE '%príslušenstvo%' OR warehouse_items.category ILIKE '%accessory%' THEN 'prislusenstvo'
    ELSE 'integrovane-riesenia'
  END
  LIMIT 1
);

-- Add solution category filters
ALTER TABLE public.solution_items 
ADD COLUMN category_filters UUID[],
ADD COLUMN item_type_filters UUID[];

-- Create indexes for better performance
CREATE INDEX idx_warehouse_items_category_id ON public.warehouse_items(category_id);
CREATE INDEX idx_warehouse_items_item_type_id ON public.warehouse_items(item_type_id);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);
CREATE INDEX idx_categories_position ON public.categories(position);
CREATE INDEX idx_item_types_is_active ON public.item_types(is_active);
CREATE INDEX idx_item_types_position ON public.item_types(position);