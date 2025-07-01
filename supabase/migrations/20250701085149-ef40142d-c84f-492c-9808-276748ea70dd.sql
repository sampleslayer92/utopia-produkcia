
-- Upravíme trigger funkciu aby fungovala pre všetky statusy, nie len 'submitted'
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
  -- Logujeme pre debugging
  RAISE LOG 'Trigger create_or_link_merchant called for contract: %', NEW.id;
  
  -- Spracujeme keď sa zmluva aktualizuje alebo vytvorí a nemá merchant_id
  IF NEW.merchant_id IS NULL THEN
    -- Získame contact info pre túto zmluvu
    SELECT * INTO contact_info_record 
    FROM contact_info 
    WHERE contract_id = NEW.id 
    LIMIT 1;
    
    -- Získame company info pre túto zmluvu
    SELECT * INTO company_info_record 
    FROM company_info 
    WHERE contract_id = NEW.id 
    LIMIT 1;
    
    -- Logujeme či sme našli potrebné údaje
    RAISE LOG 'Contact info found: %, Company info found: %', 
      (contact_info_record IS NOT NULL), 
      (company_info_record IS NOT NULL);
    
    -- Pokračujeme len ak máme contact aj company info
    IF contact_info_record IS NOT NULL AND company_info_record IS NOT NULL THEN
      -- Pokúsime sa nájsť existujúceho merchanta
      SELECT id INTO merchant_id_var
      FROM merchants
      WHERE company_name = company_info_record.company_name
        AND (ico = company_info_record.ico OR (ico IS NULL AND company_info_record.ico IS NULL))
      LIMIT 1;
      
      RAISE LOG 'Existing merchant found: %', (merchant_id_var IS NOT NULL);
      
      -- Ak merchant neexistuje, vytvoríme nového
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
        
        RAISE LOG 'New merchant created with id: %', merchant_id_var;
      END IF;
      
      -- Prepojíme zmluvu s merchantom
      UPDATE contracts 
      SET merchant_id = merchant_id_var 
      WHERE id = NEW.id;
      
      RAISE LOG 'Contract % linked to merchant %', NEW.id, merchant_id_var;
    ELSE
      RAISE LOG 'Missing contact_info or company_info for contract %', NEW.id;
    END IF;
  ELSE
    RAISE LOG 'Contract % already has merchant_id: %', NEW.id, NEW.merchant_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Upravíme trigger aby sa spúšťal pre všetky INSERT a UPDATE operácie
DROP TRIGGER IF EXISTS trigger_create_or_link_merchant ON public.contracts;
DROP TRIGGER IF EXISTS create_or_link_merchant_trigger ON public.contracts;

CREATE TRIGGER create_or_link_merchant_trigger
  AFTER INSERT OR UPDATE ON public.contracts
  FOR EACH ROW 
  EXECUTE FUNCTION create_or_link_merchant();

-- Upravíme aj funkciu pre data changes aby fungovala rovnako
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
  -- Logujeme pre debugging
  RAISE LOG 'Data change trigger called for contract: %', NEW.contract_id;
  
  -- Získame info o zmluve
  SELECT * INTO contract_record 
  FROM contracts 
  WHERE id = NEW.contract_id 
  LIMIT 1;
  
  -- Pokračujeme len ak zmluva existuje
  IF contract_record IS NULL THEN
    RAISE LOG 'Contract % not found', NEW.contract_id;
    RETURN NEW;
  END IF;
  
  -- Ak už má zmluva merchant_id, nerobíme nič
  IF contract_record.merchant_id IS NOT NULL THEN
    RAISE LOG 'Contract % already has merchant_id: %', NEW.contract_id, contract_record.merchant_id;
    RETURN NEW;
  END IF;
  
  -- Získame contact info pre túto zmluvu
  SELECT * INTO contact_info_record 
  FROM contact_info 
  WHERE contract_id = NEW.contract_id 
  LIMIT 1;
  
  -- Získame company info pre túto zmluvu
  SELECT * INTO company_info_record 
  FROM company_info 
  WHERE contract_id = NEW.contract_id 
  LIMIT 1;
  
  -- Pokračujeme len ak máme contact aj company info
  IF contact_info_record IS NOT NULL AND company_info_record IS NOT NULL THEN
    -- Pokúsime sa nájsť existujúceho merchanta
    SELECT id INTO merchant_id_var
    FROM merchants
    WHERE company_name = company_info_record.company_name
      AND (ico = company_info_record.ico OR (ico IS NULL AND company_info_record.ico IS NULL))
    LIMIT 1;
    
    -- Ak merchant neexistuje, vytvoríme nového
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
      
      RAISE LOG 'New merchant created from data change with id: %', merchant_id_var;
    END IF;
    
    -- Prepojíme zmluvu s merchantom
    UPDATE contracts 
    SET merchant_id = merchant_id_var 
    WHERE id = NEW.contract_id;
    
    RAISE LOG 'Contract % linked to merchant % from data change', NEW.contract_id, merchant_id_var;
  ELSE
    RAISE LOG 'Missing contact_info or company_info for contract % in data change', NEW.contract_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Manuálne vytvoríme merchants pre existujúce zmluvy ktoré nemají merchant_id
DO $$
DECLARE
  contract_record RECORD;
  contact_info_record RECORD;
  company_info_record RECORD;
  merchant_id_var UUID;
  contracts_processed INTEGER := 0;
  merchants_created INTEGER := 0;
BEGIN
  RAISE LOG 'Starting manual merchant creation for existing contracts...';
  
  -- Prejdeme všetky zmluvy bez merchant_id
  FOR contract_record IN 
    SELECT * FROM contracts WHERE merchant_id IS NULL
  LOOP
    contracts_processed := contracts_processed + 1;
    
    -- Získame contact info
    SELECT * INTO contact_info_record 
    FROM contact_info 
    WHERE contract_id = contract_record.id 
    LIMIT 1;
    
    -- Získame company info
    SELECT * INTO company_info_record 
    FROM company_info 
    WHERE contract_id = contract_record.id 
    LIMIT 1;
    
    -- Ak máme oba údaje, vytvoríme merchanta
    IF contact_info_record IS NOT NULL AND company_info_record IS NOT NULL THEN
      -- Pokúsime sa nájsť existujúceho merchanta
      SELECT id INTO merchant_id_var
      FROM merchants
      WHERE company_name = company_info_record.company_name
        AND (ico = company_info_record.ico OR (ico IS NULL AND company_info_record.ico IS NULL))
      LIMIT 1;
      
      -- Ak merchant neexistuje, vytvoríme nového
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
        
        merchants_created := merchants_created + 1;
        RAISE LOG 'Created merchant % for company %', merchant_id_var, company_info_record.company_name;
      END IF;
      
      -- Prepojíme zmluvu s merchantom
      UPDATE contracts 
      SET merchant_id = merchant_id_var 
      WHERE id = contract_record.id;
      
      RAISE LOG 'Linked contract % (%) to merchant %', 
        contract_record.contract_number, contract_record.id, merchant_id_var;
    ELSE
      RAISE LOG 'Contract % (%) missing contact or company info', 
        contract_record.contract_number, contract_record.id;
    END IF;
  END LOOP;
  
  RAISE LOG 'Manual merchant creation completed. Processed % contracts, created % merchants', 
    contracts_processed, merchants_created;
END $$;
