-- Add missing foreign key constraint for contract_item_addons
-- This fixes the JOIN issue in contract queries

ALTER TABLE contract_item_addons 
ADD CONSTRAINT contract_item_addons_contract_item_id_fkey 
FOREIGN KEY (contract_item_id) 
REFERENCES contract_items(id) 
ON DELETE CASCADE;