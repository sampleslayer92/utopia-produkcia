
-- Create merchants table to store unique merchants
CREATE TABLE public.merchants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  ico TEXT,
  dic TEXT,
  vat_number TEXT,
  contact_person_name TEXT NOT NULL,
  contact_person_email TEXT NOT NULL,
  contact_person_phone TEXT,
  address_street TEXT,
  address_city TEXT,
  address_zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_name, ico)
);

-- Add merchant_id to contracts table
ALTER TABLE public.contracts 
ADD COLUMN merchant_id UUID REFERENCES public.merchants(id);

-- Create index for better performance
CREATE INDEX idx_contracts_merchant_id ON public.contracts(merchant_id);

-- Enable RLS on merchants table
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for merchants
CREATE POLICY "Anyone can view merchants" 
  ON public.merchants 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create merchants" 
  ON public.merchants 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update merchants" 
  ON public.merchants 
  FOR UPDATE 
  USING (true);

-- Function to automatically create or link merchant when contract is submitted
CREATE OR REPLACE FUNCTION public.create_or_link_merchant()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  merchant_id_var UUID;
  contact_info_record RECORD;
  company_info_record RECORD;
BEGIN
  -- Only process when contract status changes to 'submitted'
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status != 'submitted') THEN
    -- Get contact info for this contract
    SELECT * INTO contact_info_record 
    FROM contact_info 
    WHERE contract_id = NEW.id 
    LIMIT 1;
    
    -- Get company info for this contract
    SELECT * INTO company_info_record 
    FROM company_info 
    WHERE contract_id = NEW.id 
    LIMIT 1;
    
    -- Only proceed if we have both contact and company info
    IF contact_info_record IS NOT NULL AND company_info_record IS NOT NULL THEN
      -- Try to find existing merchant
      SELECT id INTO merchant_id_var
      FROM merchants
      WHERE company_name = company_info_record.company_name
        AND (ico = company_info_record.ico OR (ico IS NULL AND company_info_record.ico IS NULL))
      LIMIT 1;
      
      -- If merchant doesn't exist, create new one
      IF merchant_id_var IS NULL THEN
        INSERT INTO merchants (
          company_name,
          ico,
          dic,
          vat_number,
          contact_person_name,
          contact_person_email,
          contact_person_phone,
          address_street,
          address_city,
          address_zip_code
        ) VALUES (
          company_info_record.company_name,
          company_info_record.ico,
          company_info_record.dic,
          company_info_record.vat_number,
          CONCAT(contact_info_record.first_name, ' ', contact_info_record.last_name),
          contact_info_record.email,
          contact_info_record.phone,
          company_info_record.address_street,
          company_info_record.address_city,
          company_info_record.address_zip_code
        ) RETURNING id INTO merchant_id_var;
      END IF;
      
      -- Link contract to merchant
      UPDATE contracts 
      SET merchant_id = merchant_id_var 
      WHERE id = NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create/link merchants
CREATE TRIGGER trigger_create_or_link_merchant
  AFTER UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.create_or_link_merchant();
