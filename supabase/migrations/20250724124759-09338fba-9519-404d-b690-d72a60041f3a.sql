-- Fix foreign key constraints that prevent deletion of warehouse items
-- Update RLS policies to allow proper deletion operations
-- Add cascade or set null options for foreign key constraints

-- First, drop existing foreign key constraints that prevent deletion
ALTER TABLE quick_sale_items DROP CONSTRAINT IF EXISTS quick_sale_items_warehouse_item_id_fkey;
ALTER TABLE solution_items DROP CONSTRAINT IF EXISTS solution_items_warehouse_item_id_fkey;
ALTER TABLE product_addons DROP CONSTRAINT IF EXISTS product_addons_parent_product_id_fkey;
ALTER TABLE product_addons DROP CONSTRAINT IF EXISTS product_addons_addon_product_id_fkey;
ALTER TABLE contract_items DROP CONSTRAINT IF EXISTS contract_items_item_id_fkey;

-- Re-add foreign key constraints with CASCADE or SET NULL options
ALTER TABLE quick_sale_items
ADD CONSTRAINT quick_sale_items_warehouse_item_id_fkey 
FOREIGN KEY (warehouse_item_id) REFERENCES warehouse_items(id) ON DELETE SET NULL;

ALTER TABLE solution_items
ADD CONSTRAINT solution_items_warehouse_item_id_fkey 
FOREIGN KEY (warehouse_item_id) REFERENCES warehouse_items(id) ON DELETE CASCADE;

ALTER TABLE product_addons
ADD CONSTRAINT product_addons_parent_product_id_fkey 
FOREIGN KEY (parent_product_id) REFERENCES warehouse_items(id) ON DELETE CASCADE;

ALTER TABLE product_addons
ADD CONSTRAINT product_addons_addon_product_id_fkey 
FOREIGN KEY (addon_product_id) REFERENCES warehouse_items(id) ON DELETE CASCADE;

ALTER TABLE contract_items
ADD CONSTRAINT contract_items_item_id_fkey 
FOREIGN KEY (item_id) REFERENCES warehouse_items(id) ON DELETE SET NULL;