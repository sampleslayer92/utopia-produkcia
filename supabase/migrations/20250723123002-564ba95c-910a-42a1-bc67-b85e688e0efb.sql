
-- Pridať nové stĺpce do custom_field_definitions tabuľky
ALTER TABLE public.custom_field_definitions 
ADD COLUMN warehouse_item_id UUID REFERENCES public.warehouse_items(id) ON DELETE CASCADE,
ADD COLUMN is_template BOOLEAN NOT NULL DEFAULT false;

-- Nastaviť existujúce záznamy ako template
UPDATE public.custom_field_definitions 
SET is_template = true 
WHERE category_id IS NOT NULL OR item_type_id IS NOT NULL;

-- Pridať indexy pre lepšiu performance
CREATE INDEX idx_custom_field_definitions_warehouse_item_id ON public.custom_field_definitions(warehouse_item_id);
CREATE INDEX idx_custom_field_definitions_is_template ON public.custom_field_definitions(is_template);

-- Aktualizovať RLS policies
DROP POLICY IF EXISTS "Anyone can view active custom field definitions" ON public.custom_field_definitions;
DROP POLICY IF EXISTS "Partners can view custom field definitions" ON public.custom_field_definitions;

CREATE POLICY "Anyone can view active custom field definitions"
ON public.custom_field_definitions
FOR SELECT
USING (is_active = true AND (is_template = true OR warehouse_item_id IS NOT NULL));

CREATE POLICY "Partners can view custom field definitions"
ON public.custom_field_definitions
FOR SELECT
USING (has_role(auth.uid(), 'partner'::app_role));

CREATE POLICY "Partners can create product custom fields"
ON public.custom_field_definitions
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'partner'::app_role) AND warehouse_item_id IS NOT NULL);

CREATE POLICY "Partners can update product custom fields"
ON public.custom_field_definitions
FOR UPDATE
USING (has_role(auth.uid(), 'partner'::app_role) AND warehouse_item_id IS NOT NULL);

CREATE POLICY "Partners can delete product custom fields"
ON public.custom_field_definitions
FOR DELETE
USING (has_role(auth.uid(), 'partner'::app_role) AND warehouse_item_id IS NOT NULL);
