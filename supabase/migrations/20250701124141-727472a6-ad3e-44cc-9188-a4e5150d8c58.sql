
-- Odstránime všetky triggers a funkcie s CASCADE pre úplné vyčistenie
DROP TRIGGER IF EXISTS create_merchant_auth_trigger ON public.merchants CASCADE;
DROP FUNCTION IF EXISTS public.create_merchant_auth_account() CASCADE;

-- Odstránime aj ostatné merchant creation triggery ak existujú
DROP TRIGGER IF EXISTS create_or_link_merchant_trigger ON public.contracts CASCADE;
DROP TRIGGER IF EXISTS contact_info_merchant_trigger ON public.contact_info CASCADE;
DROP TRIGGER IF EXISTS company_info_merchant_trigger ON public.company_info CASCADE;
DROP FUNCTION IF EXISTS public.create_or_link_merchant() CASCADE;
DROP FUNCTION IF EXISTS public.create_merchant_on_data_change() CASCADE;

-- Teraz bezpečne vytvoríme merchants pre existujúce zmluvy
DO $$
DECLARE
  contract_record RECORD;
  contact_info_record RECORD;
  company_info_record RECORD;
  merchant_id_var UUID;
  contracts_fixed INTEGER := 0;
BEGIN
  RAISE LOG 'Starting manual merchant creation for contracts without merchants...';
  
  -- Prejdeme všetky zmluvy bez merchant_id ktoré majú complete údaje
  FOR contract_record IN 
    SELECT c.* FROM contracts c
    WHERE c.merchant_id IS NULL
    AND EXISTS (SELECT 1 FROM contact_info ci WHERE ci.contract_id = c.id)
    AND EXISTS (SELECT 1 FROM company_info co WHERE co.contract_id = c.id)
  LOOP
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
    
    -- Skontrolujeme že máme potrebné údaje
    IF contact_info_record.first_name IS NOT NULL 
       AND contact_info_record.last_name IS NOT NULL
       AND contact_info_record.email IS NOT NULL
       AND company_info_record.company_name IS NOT NULL 
       AND company_info_record.ico IS NOT NULL THEN
      
      -- Pokúsime sa nájsť existujúceho merchanta
      SELECT id INTO merchant_id_var
      FROM merchants
      WHERE company_name = company_info_record.company_name
        AND ico = company_info_record.ico
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
        
        RAISE LOG 'Created merchant % for company %', merchant_id_var, company_info_record.company_name;
      END IF;
      
      -- Prepojíme zmluvu s merchantom
      UPDATE contracts 
      SET merchant_id = merchant_id_var 
      WHERE id = contract_record.id;
      
      contracts_fixed := contracts_fixed + 1;
      
      RAISE LOG 'Fixed contract % (%) - linked to merchant %', 
        contract_record.contract_number, contract_record.id, merchant_id_var;
    ELSE
      RAISE LOG 'Contract % (%) has incomplete data - skipping', 
        contract_record.contract_number, contract_record.id;
    END IF;
  END LOOP;
  
  RAISE LOG 'Manual merchant creation completed. Fixed % contracts', contracts_fixed;
END $$;
