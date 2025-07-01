
-- Add foreign key constraint between contracts.created_by and profiles.id
ALTER TABLE contracts 
ADD CONSTRAINT fk_contracts_created_by 
FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- Create index for better performance on joins
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON contracts(created_by);
