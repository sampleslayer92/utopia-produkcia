
-- Create profiles table for additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create profiles" 
ON public.profiles FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update profiles" 
ON public.profiles FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Add partner role to existing enum (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid 
        WHERE t.typname = 'app_role' AND e.enumlabel = 'partner'
    ) THEN
        ALTER TYPE app_role ADD VALUE 'partner';
    END IF;
END $$;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email
  );
  
  -- Auto-assign admin role to specific emails
  IF NEW.email IN ('admin@utopia.com', 'admin@example.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add created_by column to contracts table
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Update contracts RLS policies to include creator-based access
CREATE POLICY "Partners can view their own contracts" 
ON public.contracts FOR SELECT 
USING (
  has_role(auth.uid(), 'partner'::app_role) 
  AND created_by = auth.uid()
);

CREATE POLICY "Partners can create contracts" 
ON public.contracts FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'partner'::app_role) 
  AND created_by = auth.uid()
);

CREATE POLICY "Partners can update their own contracts" 
ON public.contracts FOR UPDATE 
USING (
  has_role(auth.uid(), 'partner'::app_role) 
  AND created_by = auth.uid()
);

-- Update other related tables to support partner access
CREATE POLICY "Partners can view related contact_info" 
ON public.contact_info FOR SELECT 
USING (
  has_role(auth.uid(), 'partner'::app_role) 
  AND contract_id IN (
    SELECT id FROM contracts WHERE created_by = auth.uid()
  )
);

CREATE POLICY "Partners can view related company_info" 
ON public.company_info FOR SELECT 
USING (
  has_role(auth.uid(), 'partner'::app_role) 
  AND contract_id IN (
    SELECT id FROM contracts WHERE created_by = auth.uid()
  )
);

CREATE POLICY "Partners can view related business_locations" 
ON public.business_locations FOR SELECT 
USING (
  has_role(auth.uid(), 'partner'::app_role) 
  AND contract_id IN (
    SELECT id FROM contracts WHERE created_by = auth.uid()
  )
);

CREATE POLICY "Partners can view related contract_items" 
ON public.contract_items FOR SELECT 
USING (
  has_role(auth.uid(), 'partner'::app_role) 
  AND contract_id IN (
    SELECT id FROM contracts WHERE created_by = auth.uid()
  )
);

CREATE POLICY "Partners can view related contract_calculations" 
ON public.contract_calculations FOR SELECT 
USING (
  has_role(auth.uid(), 'partner'::app_role) 
  AND contract_id IN (
    SELECT id FROM contracts WHERE created_by = auth.uid()
  )
);
