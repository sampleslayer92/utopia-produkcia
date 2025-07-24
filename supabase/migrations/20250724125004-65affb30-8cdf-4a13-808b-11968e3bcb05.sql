-- Clean up orphaned data first before fixing foreign keys
-- Delete contract_items that reference non-existent warehouse_items
DELETE FROM contract_items 
WHERE item_id NOT IN (SELECT id FROM warehouse_items);

-- Clean up other orphaned references if any
DELETE FROM quick_sale_items 
WHERE warehouse_item_id IS NOT NULL 
  AND warehouse_item_id NOT IN (SELECT id FROM warehouse_items);

DELETE FROM solution_items 
WHERE warehouse_item_id NOT IN (SELECT id FROM warehouse_items);

DELETE FROM product_addons 
WHERE parent_product_id NOT IN (SELECT id FROM warehouse_items)
   OR addon_product_id NOT IN (SELECT id FROM warehouse_items);

-- Now fix foreign key constraints with proper CASCADE/SET NULL options
-- Drop existing constraints
ALTER TABLE quick_sale_items DROP CONSTRAINT IF EXISTS quick_sale_items_warehouse_item_id_fkey;
ALTER TABLE solution_items DROP CONSTRAINT IF EXISTS solution_items_warehouse_item_id_fkey;
ALTER TABLE product_addons DROP CONSTRAINT IF EXISTS product_addons_parent_product_id_fkey;
ALTER TABLE product_addons DROP CONSTRAINT IF EXISTS product_addons_addon_product_id_fkey;
ALTER TABLE contract_items DROP CONSTRAINT IF EXISTS contract_items_item_id_fkey;

-- Re-add with proper cascade options
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