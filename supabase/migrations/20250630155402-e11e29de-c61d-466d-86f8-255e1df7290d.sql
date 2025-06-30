
-- Vytvorenie admin používateľa v auth.users tabuľke
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
  'admin@utopia.com',
  crypt('admin', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Admin"}',
  '{}',
  false,
  'authenticated'
);

-- Pridanie admin role do user_roles tabuľky
INSERT INTO public.user_roles (user_id, role)
SELECT 
  u.id,
  'admin'::app_role
FROM auth.users u
WHERE u.email = 'admin@utopia.com'
ON CONFLICT (user_id, role) DO NOTHING;
