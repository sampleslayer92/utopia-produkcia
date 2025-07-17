-- Add category_id to solution_items table for better hierarchy
ALTER TABLE public.solution_items 
ADD COLUMN category_id UUID REFERENCES public.categories(id);

-- Add index for better performance on filtering
CREATE INDEX idx_solution_items_category_id ON public.solution_items(category_id);

-- Update existing solution_items to set category_id based on warehouse_item category
UPDATE public.solution_items 
SET category_id = wi.category_id
FROM public.warehouse_items wi
WHERE solution_items.warehouse_item_id = wi.id;