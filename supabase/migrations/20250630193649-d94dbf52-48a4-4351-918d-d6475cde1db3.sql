
-- Vymazať všetky admin roly a admin účty
DELETE FROM public.user_roles 
WHERE role = 'admin';

DELETE FROM auth.users 
WHERE email LIKE '%admin%';

-- Vytvoriť nový admin účet so správnym heslom
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
