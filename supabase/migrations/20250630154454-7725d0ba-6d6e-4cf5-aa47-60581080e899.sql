
-- Najprv vytvoríme RLS polícy pre merchants tabuľku
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

-- Admins môžu vidieť všetkých merchantov
CREATE POLICY "Admins can view all merchants" 
ON public.merchants 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Merchant používatelia môžu vidieť len seba
CREATE POLICY "Merchants can view their own data" 
ON public.merchants 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'merchant') AND 
  contact_person_email = auth.email()
);

-- Rozšírime RLS polícy pre contracts tabuľku
CREATE POLICY "Merchants can view their own contracts" 
ON public.contracts 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'merchant') AND 
  merchant_id IN (
    SELECT id FROM public.merchants 
    WHERE contact_person_email = auth.email()
  )
);

-- RLS polícy pre contract_items
CREATE POLICY "Merchants can view their contract items" 
ON public.contract_items 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'merchant') AND 
  contract_id IN (
    SELECT c.id FROM public.contracts c
    JOIN public.merchants m ON c.merchant_id = m.id
    WHERE m.contact_person_email = auth.email()
  )
);

-- RLS polícy pre contact_info
CREATE POLICY "Merchants can view their contact info" 
ON public.contact_info 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'merchant') AND 
  contract_id IN (
    SELECT c.id FROM public.contracts c
    JOIN public.merchants m ON c.merchant_id = m.id
    WHERE m.contact_person_email = auth.email()
  )
);

-- RLS polícy pre company_info
CREATE POLICY "Merchants can view their company info" 
ON public.company_info 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'merchant') AND 
  contract_id IN (
    SELECT c.id FROM public.contracts c
    JOIN public.merchants m ON c.merchant_id = m.id
    WHERE m.contact_person_email = auth.email()
  )
);

-- RLS polícy pre business_locations
CREATE POLICY "Merchants can view their business locations" 
ON public.business_locations 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'merchant') AND 
  contract_id IN (
    SELECT c.id FROM public.contracts c
    JOIN public.merchants m ON c.merchant_id = m.id
    WHERE m.contact_person_email = auth.email()
  )
);

-- RLS polícy pre contract_calculations
CREATE POLICY "Merchants can view their contract calculations" 
ON public.contract_calculations 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'merchant') AND 
  contract_id IN (
    SELECT c.id FROM public.contracts c
    JOIN public.merchants m ON c.merchant_id = m.id
    WHERE m.contact_person_email = auth.email()
  )
);

-- Funkcia pre vytvorenie merchant účtu
CREATE OR REPLACE FUNCTION public.create_merchant_auth_account()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Vytvoríme auth účet pre nového merchanta
  -- Poznámka: Toto môže zlyhať ak email už existuje, čo je v poriadku
  BEGIN
    -- Vytvoríme používateľa s dočasným heslom
    INSERT INTO auth.users (
      email, 
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data
    ) VALUES (
      NEW.contact_person_email,
      crypt('admin', gen_salt('bf')), -- heslo "admin"
      now(),
      now(),
      now(),
      jsonb_build_object(
        'company_name', NEW.company_name,
        'contact_person_name', NEW.contact_person_name
      )
    ) RETURNING id INTO new_user_id;
    
    -- Pridelíme mu merchant rolu
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new_user_id, 'merchant');
    
  EXCEPTION 
    WHEN unique_violation THEN
      -- Ak už používateľ existuje, len pridáme rolu ak ju nemá
      SELECT id INTO new_user_id 
      FROM auth.users 
      WHERE email = NEW.contact_person_email;
      
      INSERT INTO public.user_roles (user_id, role)
      VALUES (new_user_id, 'merchant')
      ON CONFLICT (user_id, role) DO NOTHING;
  END;
  
  RETURN NEW;
END;
$$;

-- Trigger na merchants tabuľke
CREATE TRIGGER create_merchant_auth_trigger
  AFTER INSERT ON public.merchants
  FOR EACH ROW
  EXECUTE FUNCTION public.create_merchant_auth_account();
