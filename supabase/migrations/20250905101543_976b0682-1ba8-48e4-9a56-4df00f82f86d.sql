-- Create enum for person roles
CREATE TYPE public.person_role_type AS ENUM (
  'contact_person',
  'authorized_person', 
  'actual_owner',
  'statutory_representative'
);

-- Create persons table for storing unique individuals
CREATE TABLE public.persons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  birth_place TEXT,
  birth_number TEXT,
  permanent_address TEXT,
  citizenship TEXT DEFAULT 'SK',
  maiden_name TEXT,
  document_type document_type DEFAULT 'OP',
  document_number TEXT,
  document_issuer TEXT,
  document_country TEXT DEFAULT 'SK',
  document_validity DATE,
  position TEXT,
  is_politically_exposed BOOLEAN DEFAULT false,
  is_us_citizen BOOLEAN DEFAULT false,
  is_predefined BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create person_roles table for contract-specific role assignments
CREATE TABLE public.person_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL,
  person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  role_type person_role_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(contract_id, person_id, role_type)
);

-- Enable RLS on both tables
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for persons
CREATE POLICY "Allow all operations on persons" 
ON public.persons
FOR ALL 
USING (true)
WITH CHECK (true);

-- RLS policies for person_roles  
CREATE POLICY "Allow all operations on person_roles"
ON public.person_roles
FOR ALL
USING (true) 
WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_persons_updated_at
BEFORE UPDATE ON public.persons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_person_roles_updated_at
BEFORE UPDATE ON public.person_roles  
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert predefined persons
INSERT INTO public.persons (
  first_name, last_name, email, phone, birth_date, birth_place, 
  permanent_address, is_predefined
) VALUES 
(
  'Marián', 'Lapoš', 'marian.lapos@example.com', '+421901234567',
  '1985-03-15', 'Bratislava', 'Hlavná 123, 811 01 Bratislava', true
),
(
  'Miroslav', 'Vilím', 'miroslav.vilim@example.com', '+421902345678', 
  '1978-07-22', 'Košice', 'Školská 456, 040 01 Košice', true
),
(
  'Andrej', 'Kucsera', 'andrej.kucsera@example.com', '+421903456789',
  '1982-11-08', 'Žilina', 'Nábrežná 789, 010 01 Žilina', true
);