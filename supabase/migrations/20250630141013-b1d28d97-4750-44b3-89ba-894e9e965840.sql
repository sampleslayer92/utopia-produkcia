
-- Drop existing trigger first
DROP TRIGGER IF EXISTS create_or_link_merchant_trigger ON contracts;

-- Create a new function that handles merchant creation on data changes
CREATE OR REPLACE FUNCTION public.create_merchant_on_data_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  merchant_id_var UUID;
  contact_info_record RECORD;
  company_info_record RECORD;
  contract_record RECORD;
BEGIN
  -- Get contract info
  SELECT * INTO contract_record 
  FROM contracts 
  WHERE id = NEW.contract_id 
  LIMIT 1;
  
  -- Only proceed if contract exists
  IF contract_record IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get contact info for this contract
  SELECT * INTO contact_info_record 
  FROM contact_info 
  WHERE contract_id = NEW.contract_id 
  LIMIT 1;
  
  -- Get company info for this contract
  SELECT * INTO company_info_record 
  FROM company_info 
  WHERE contract_id = NEW.contract_id 
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
    
    -- Link contract to merchant if not already linked
    IF contract_record.merchant_id IS NULL OR contract_record.merchant_id != merchant_id_var THEN
      UPDATE contracts 
      SET merchant_id = merchant_id_var 
      WHERE id = NEW.contract_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create triggers for contact_info and company_info tables
CREATE TRIGGER create_merchant_on_contact_info_change
  AFTER INSERT OR UPDATE ON contact_info
  FOR EACH ROW EXECUTE FUNCTION create_merchant_on_data_change();

CREATE TRIGGER create_merchant_on_company_info_change
  AFTER INSERT OR UPDATE ON company_info
  FOR EACH ROW EXECUTE FUNCTION create_merchant_on_data_change();

-- Keep the original trigger for contracts but make it work for any status change
CREATE TRIGGER create_or_link_merchant_trigger
  AFTER UPDATE ON contracts
  FOR EACH ROW 
  WHEN (OLD.merchant_id IS NULL AND NEW.merchant_id IS NULL)
  EXECUTE FUNCTION create_or_link_merchant();
