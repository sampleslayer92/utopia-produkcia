-- Fix the foreign key constraint issue in contract_items
-- The problem is that onboarding generates UUIDs that don't exist in warehouse_items
-- We'll make item_id nullable and add a warehouse_item_id for proper referencing

-- First, drop the existing foreign key constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'contract_items_item_id_fkey' 
        AND table_name = 'contract_items'
    ) THEN
        ALTER TABLE contract_items DROP CONSTRAINT contract_items_item_id_fkey;
    END IF;
END $$;

-- Make item_id nullable to allow custom products from onboarding
ALTER TABLE contract_items ALTER COLUMN item_id DROP NOT NULL;

-- Add warehouse_item_id for proper referencing to warehouse items
ALTER TABLE contract_items ADD COLUMN IF NOT EXISTS warehouse_item_id UUID;

-- Add foreign key constraint for warehouse_item_id
ALTER TABLE contract_items 
ADD CONSTRAINT contract_items_warehouse_item_id_fkey 
FOREIGN KEY (warehouse_item_id) REFERENCES warehouse_items(id) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_contract_items_warehouse_item_id ON contract_items(warehouse_item_id);

-- Add check constraint to ensure either item_id or warehouse_item_id is present
ALTER TABLE contract_items 
ADD CONSTRAINT check_item_reference 
CHECK (item_id IS NOT NULL OR warehouse_item_id IS NOT NULL);