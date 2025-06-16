
-- Pridanie RLS políc pre DELETE operácie na všetky tabuľky súvisiace so zmluvami
-- Predpokladáme že admin má plné oprávnenia (môžeme pridať auth check neskôr)

-- Enable RLS a pridaj DELETE policy pre actual_owners
ALTER TABLE public.actual_owners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for actual_owners" ON public.actual_owners;
CREATE POLICY "Allow all operations for actual_owners" 
  ON public.actual_owners 
  FOR ALL 
  USING (true);

-- Enable RLS a pridaj DELETE policy pre authorized_persons  
ALTER TABLE public.authorized_persons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for authorized_persons" ON public.authorized_persons;
CREATE POLICY "Allow all operations for authorized_persons" 
  ON public.authorized_persons 
  FOR ALL 
  USING (true);

-- Enable RLS a pridaj DELETE policy pre business_locations
ALTER TABLE public.business_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for business_locations" ON public.business_locations;
CREATE POLICY "Allow all operations for business_locations" 
  ON public.business_locations 
  FOR ALL 
  USING (true);

-- Enable RLS a pridaj DELETE policy pre device_selection
ALTER TABLE public.device_selection ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for device_selection" ON public.device_selection;
CREATE POLICY "Allow all operations for device_selection" 
  ON public.device_selection 
  FOR ALL 
  USING (true);

-- Enable RLS a pridaj DELETE policy pre consents
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for consents" ON public.consents;
CREATE POLICY "Allow all operations for consents" 
  ON public.consents 
  FOR ALL 
  USING (true);

-- Enable RLS a pridaj DELETE policy pre contact_info
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for contact_info" ON public.contact_info;
CREATE POLICY "Allow all operations for contact_info" 
  ON public.contact_info 
  FOR ALL 
  USING (true);

-- Enable RLS a pridaj DELETE policy pre company_info
ALTER TABLE public.company_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for company_info" ON public.company_info;
CREATE POLICY "Allow all operations for company_info" 
  ON public.company_info 
  FOR ALL 
  USING (true);

-- Enable RLS a pridaj DELETE policy pre location_assignments
ALTER TABLE public.location_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for location_assignments" ON public.location_assignments;
CREATE POLICY "Allow all operations for location_assignments" 
  ON public.location_assignments 
  FOR ALL 
  USING (true);

-- Enable RLS a pridaj DELETE policy pre contract_items
ALTER TABLE public.contract_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for contract_items" ON public.contract_items;
CREATE POLICY "Allow all operations for contract_items" 
  ON public.contract_items 
  FOR ALL 
  USING (true);

-- Enable RLS a pridaj DELETE policy pre contract_item_addons
ALTER TABLE public.contract_item_addons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for contract_item_addons" ON public.contract_item_addons;
CREATE POLICY "Allow all operations for contract_item_addons" 
  ON public.contract_item_addons 
  FOR ALL 
  USING (true);

-- Enable RLS a pridaj DELETE policy pre contract_calculations
ALTER TABLE public.contract_calculations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for contract_calculations" ON public.contract_calculations;
CREATE POLICY "Allow all operations for contract_calculations" 
  ON public.contract_calculations 
  FOR ALL 
  USING (true);

-- Enable RLS a pridaj DELETE policy pre contracts
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations for contracts" ON public.contracts;
CREATE POLICY "Allow all operations for contracts" 
  ON public.contracts 
  FOR ALL 
  USING (true);

-- Pridanie foreign key constraints s CASCADE DELETE pre automatické mazanie súvisiacich dát
-- Najprv odstránime existujúce constrainty ak existujú a pridáme nové s CASCADE

-- Actual owners
ALTER TABLE public.actual_owners 
DROP CONSTRAINT IF EXISTS actual_owners_contract_id_fkey;

ALTER TABLE public.actual_owners 
ADD CONSTRAINT actual_owners_contract_id_fkey 
FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

-- Authorized persons
ALTER TABLE public.authorized_persons 
DROP CONSTRAINT IF EXISTS authorized_persons_contract_id_fkey;

ALTER TABLE public.authorized_persons 
ADD CONSTRAINT authorized_persons_contract_id_fkey 
FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

-- Business locations
ALTER TABLE public.business_locations 
DROP CONSTRAINT IF EXISTS business_locations_contract_id_fkey;

ALTER TABLE public.business_locations 
ADD CONSTRAINT business_locations_contract_id_fkey 
FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

-- Device selection
ALTER TABLE public.device_selection 
DROP CONSTRAINT IF EXISTS device_selection_contract_id_fkey;

ALTER TABLE public.device_selection 
ADD CONSTRAINT device_selection_contract_id_fkey 
FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

-- Consents
ALTER TABLE public.consents 
DROP CONSTRAINT IF EXISTS consents_contract_id_fkey;

ALTER TABLE public.consents 
ADD CONSTRAINT consents_contract_id_fkey 
FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

-- Contact info
ALTER TABLE public.contact_info 
DROP CONSTRAINT IF EXISTS contact_info_contract_id_fkey;

ALTER TABLE public.contact_info 
ADD CONSTRAINT contact_info_contract_id_fkey 
FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

-- Company info
ALTER TABLE public.company_info 
DROP CONSTRAINT IF EXISTS company_info_contract_id_fkey;

ALTER TABLE public.company_info 
ADD CONSTRAINT company_info_contract_id_fkey 
FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

-- Location assignments
ALTER TABLE public.location_assignments 
DROP CONSTRAINT IF EXISTS location_assignments_contract_id_fkey;

ALTER TABLE public.location_assignments 
ADD CONSTRAINT location_assignments_contract_id_fkey 
FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

-- Contract items
ALTER TABLE public.contract_items 
DROP CONSTRAINT IF EXISTS contract_items_contract_id_fkey;

ALTER TABLE public.contract_items 
ADD CONSTRAINT contract_items_contract_id_fkey 
FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;

-- Contract item addons (závisí od contract_items)
ALTER TABLE public.contract_item_addons 
DROP CONSTRAINT IF EXISTS contract_item_addons_contract_item_id_fkey;

ALTER TABLE public.contract_item_addons 
ADD CONSTRAINT contract_item_addons_contract_item_id_fkey 
FOREIGN KEY (contract_item_id) REFERENCES public.contract_items(id) ON DELETE CASCADE;

-- Contract calculations
ALTER TABLE public.contract_calculations 
DROP CONSTRAINT IF EXISTS contract_calculations_contract_id_fkey;

ALTER TABLE public.contract_calculations 
ADD CONSTRAINT contract_calculations_contract_id_fkey 
FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE;
