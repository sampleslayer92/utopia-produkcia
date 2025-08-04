-- Add RLS policies for merchant access to their contracts and related data

-- Ensure merchants can view their own contracts
CREATE POLICY "Merchants can view their own contracts" 
ON public.contracts 
FOR SELECT 
USING (
  merchant_id IN (
    SELECT id FROM merchants 
    WHERE contact_person_email = auth.email()
  )
);

-- Ensure merchants can view their business locations 
CREATE POLICY "Merchants can view their business locations"
ON public.business_locations
FOR SELECT
USING (
  merchant_id IN (
    SELECT id FROM merchants 
    WHERE contact_person_email = auth.email()
  )
);

-- Allow merchants to update their own business locations
CREATE POLICY "Merchants can update their business locations"
ON public.business_locations
FOR UPDATE
USING (
  merchant_id IN (
    SELECT id FROM merchants 
    WHERE contact_person_email = auth.email()
  )
);

-- Allow merchants to create their own business locations
CREATE POLICY "Merchants can create their business locations"
ON public.business_locations
FOR INSERT
WITH CHECK (
  merchant_id IN (
    SELECT id FROM merchants 
    WHERE contact_person_email = auth.email()
  )
);

-- Allow merchants to update their own merchant info
CREATE POLICY "Merchants can update their own info"
ON public.merchants
FOR UPDATE
USING (contact_person_email = auth.email());

-- Ensure contracts table has RLS enabled
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Ensure business_locations table has RLS enabled  
ALTER TABLE public.business_locations ENABLE ROW LEVEL SECURITY;