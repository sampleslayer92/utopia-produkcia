
-- Vymazanie aktuálneho nesprávneho admin účtu
DELETE FROM public.user_roles 
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@utopia.com'
);

DELETE FROM auth.users 
WHERE email = 'admin@utopia.com';

-- Úprava handle_new_user funkcie aby automaticky pridelila admin rolu
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Auto-assign admin role to admin@utopia.com
  IF NEW.email = 'admin@utopia.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  -- Auto-assign admin role to other specific accounts if needed
  ELSIF NEW.email IN ('admin@example.com', 'your-admin-email@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Ak trigger neexistuje, vytvoríme ho
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
