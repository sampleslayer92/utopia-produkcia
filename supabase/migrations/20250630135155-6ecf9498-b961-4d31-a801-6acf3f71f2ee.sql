
-- Update existing submitted contracts to trigger merchant creation
-- This will fix any existing data that doesn't have merchants
UPDATE public.contracts 
SET updated_at = now() 
WHERE status = 'submitted' 
  AND merchant_id IS NULL
  AND EXISTS (
    SELECT 1 FROM contact_info WHERE contract_id = contracts.id
  )
  AND EXISTS (
    SELECT 1 FROM company_info WHERE contract_id = contracts.id
  );
