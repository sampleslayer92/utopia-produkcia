
-- Get the user ID for richardplichta@gmail.com and create profile and admin role
DO $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Get the user ID from auth.users table
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'richardplichta@gmail.com';
    
    -- Check if user exists
    IF user_uuid IS NOT NULL THEN
        -- Insert or update profile
        INSERT INTO public.profiles (id, first_name, last_name, email)
        VALUES (user_uuid, 'Richard', 'Plichta', 'richardplichta@gmail.com')
        ON CONFLICT (id) DO UPDATE SET
            first_name = 'Richard',
            last_name = 'Plichta',
            email = 'richardplichta@gmail.com';
            
        -- Insert admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (user_uuid, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Profile and admin role created for user %', user_uuid;
    ELSE
        RAISE NOTICE 'User richardplichta@gmail.com not found in auth.users';
    END IF;
END $$;

-- Also update the password for this user (you may need to do this manually in Supabase dashboard)
-- The password should be set to: 12Xpguru34
