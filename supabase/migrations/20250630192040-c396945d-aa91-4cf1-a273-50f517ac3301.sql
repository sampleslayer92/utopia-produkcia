
-- Vymazať existujúci problematický admin účet ak existuje
DELETE FROM public.user_roles 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%admin%'
);

DELETE FROM auth.users 
WHERE email LIKE '%admin%';

-- Vytvoriť nový admin účet s platným emailom
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  raw_app_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('Admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"login": "admin"}',
  '{}',
  false,
  'authenticated'
);

-- Pridať admin rolu
INSERT INTO public.user_roles (user_id, role)
SELECT 
  u.id,
  'admin'::app_role
FROM auth.users u
WHERE u.email = 'admin@example.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Aktualizovať handle_new_user funkciu aby podporovala admin@example.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Auto-assign admin role to admin emails
  IF NEW.email IN ('admin@example.com', 'admin@utopia.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$;
