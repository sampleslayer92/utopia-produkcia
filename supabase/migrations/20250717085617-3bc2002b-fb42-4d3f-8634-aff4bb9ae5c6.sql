-- Create product_addons table for managing related items/accessories
CREATE TABLE public.product_addons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_product_id UUID NOT NULL,
  addon_product_id UUID NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_default_selected BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(parent_product_id, addon_product_id)
);

-- Enable Row Level Security
ALTER TABLE public.product_addons ENABLE ROW LEVEL SECURITY;

-- Create policies for product_addons
CREATE POLICY "Admins and partners can manage product addons" 
ON public.product_addons 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'partner'::app_role));

CREATE POLICY "Anyone can view product addons for active products" 
ON public.product_addons 
FOR SELECT 
USING (
  parent_product_id IN (
    SELECT id FROM warehouse_items WHERE is_active = true
  ) AND 
  addon_product_id IN (
    SELECT id FROM warehouse_items WHERE is_active = true
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_product_addons_updated_at
BEFORE UPDATE ON public.product_addons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraints
ALTER TABLE public.product_addons 
ADD CONSTRAINT fk_product_addons_parent 
FOREIGN KEY (parent_product_id) REFERENCES public.warehouse_items(id) ON DELETE CASCADE;

ALTER TABLE public.product_addons 
ADD CONSTRAINT fk_product_addons_addon 
FOREIGN KEY (addon_product_id) REFERENCES public.warehouse_items(id) ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX idx_product_addons_parent ON public.product_addons(parent_product_id);
CREATE INDEX idx_product_addons_addon ON public.product_addons(addon_product_id);