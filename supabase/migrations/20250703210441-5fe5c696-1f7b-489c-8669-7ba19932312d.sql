-- Performance indexy pre často používané stĺpce
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON contracts(created_by);
CREATE INDEX IF NOT EXISTS idx_contracts_merchant_id ON contracts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_contracts_source ON contracts(source);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON contracts(created_at);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_created_by ON profiles(created_by);

CREATE INDEX IF NOT EXISTS idx_merchants_contact_email ON merchants(contact_person_email);
CREATE INDEX IF NOT EXISTS idx_merchants_ico ON merchants(ico);
CREATE INDEX IF NOT EXISTS idx_merchants_company_name ON merchants(company_name);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

CREATE INDEX IF NOT EXISTS idx_business_locations_contract_id ON business_locations(contract_id);
CREATE INDEX IF NOT EXISTS idx_business_locations_address_city ON business_locations(address_city);

-- Composite indexy pre komplexné queries
CREATE INDEX IF NOT EXISTS idx_contracts_status_created_by ON contracts(status, created_by);
CREATE INDEX IF NOT EXISTS idx_contracts_status_source ON contracts(status, source);
CREATE INDEX IF NOT EXISTS idx_profiles_active_created_by ON profiles(is_active, created_by);

-- Vyčistenie nepoužívaných tabuliek
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS contract_item_addons CASCADE;
DROP TABLE IF EXISTS contract_templates CASCADE;

-- Odstránenie nepoužívaných stĺpcev
ALTER TABLE authorized_persons DROP COLUMN IF EXISTS maiden_name;
ALTER TABLE actual_owners DROP COLUMN IF EXISTS maiden_name;
ALTER TABLE business_locations DROP COLUMN IF EXISTS seasonal_weeks;
ALTER TABLE device_selection DROP COLUMN IF EXISTS note;
ALTER TABLE contact_info DROP COLUMN IF EXISTS sales_note;
ALTER TABLE contact_info DROP COLUMN IF EXISTS user_role;
ALTER TABLE contracts DROP COLUMN IF EXISTS notes;
ALTER TABLE contracts DROP COLUMN IF EXISTS lost_notes;