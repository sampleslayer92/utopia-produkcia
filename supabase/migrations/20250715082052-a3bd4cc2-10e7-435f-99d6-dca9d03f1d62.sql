-- Create solutions table for managing onboarding solutions
CREATE TABLE public.solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subtitle TEXT,
  icon_name TEXT, -- Lucide icon name
  icon_url TEXT, -- Custom icon URL
  color TEXT DEFAULT '#3B82F6',
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create solution_items table for linking warehouse items to solutions
CREATE TABLE public.solution_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  solution_id UUID NOT NULL REFERENCES public.solutions(id) ON DELETE CASCADE,
  warehouse_item_id UUID NOT NULL REFERENCES public.warehouse_items(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(solution_id, warehouse_item_id)
);

-- Enable RLS
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solution_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for solutions
CREATE POLICY "Anyone can view active solutions" 
ON public.solutions 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all solutions" 
ON public.solutions 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Partners can view solutions" 
ON public.solutions 
FOR SELECT 
USING (has_role(auth.uid(), 'partner'::app_role));

-- RLS policies for solution_items
CREATE POLICY "Anyone can view solution items for active solutions" 
ON public.solution_items 
FOR SELECT 
USING (solution_id IN (
  SELECT id FROM public.solutions WHERE is_active = true
));

CREATE POLICY "Admins can manage all solution items" 
ON public.solution_items 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Partners can view solution items" 
ON public.solution_items 
FOR SELECT 
USING (has_role(auth.uid(), 'partner'::app_role));

-- Create update triggers for timestamps
CREATE TRIGGER update_solutions_updated_at
BEFORE UPDATE ON public.solutions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_solution_items_updated_at
BEFORE UPDATE ON public.solution_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_solutions_position ON public.solutions(position);
CREATE INDEX idx_solutions_active ON public.solutions(is_active);
CREATE INDEX idx_solution_items_solution_id ON public.solution_items(solution_id);
CREATE INDEX idx_solution_items_warehouse_item_id ON public.solution_items(warehouse_item_id);
CREATE INDEX idx_solution_items_position ON public.solution_items(position);

-- Insert default solutions to match current onboarding
INSERT INTO public.solutions (name, description, subtitle, icon_name, position, is_active) VALUES
('POS Terminály', 'Moderné platobné terminály pre váš biznis', 'Bezpečné a rýchle platby kartou', 'CreditCard', 1, true),
('E-commerce Riešenia', 'Online platby pre váš e-shop', 'Integrujte platby do vášho webu', 'ShoppingCart', 2, true),
('Mobilné Platby', 'Platby cez mobilné aplikácie', 'QR kódy a bezkontaktné platby', 'Smartphone', 3, true),
('API Integrácie', 'Vlastné platobné riešenia', 'Flexibilné API pre vývojárov', 'Code', 4, true);