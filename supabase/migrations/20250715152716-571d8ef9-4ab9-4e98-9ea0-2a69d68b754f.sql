-- Create solution_categories table to link solutions with categories
CREATE TABLE public.solution_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  solution_id UUID NOT NULL,
  category_id UUID NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT solution_categories_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES public.solutions(id) ON DELETE CASCADE,
  CONSTRAINT solution_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE,
  CONSTRAINT solution_categories_unique_solution_category UNIQUE (solution_id, category_id)
);

-- Enable RLS on solution_categories
ALTER TABLE public.solution_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for solution_categories
CREATE POLICY "Admins can manage all solution categories"
ON public.solution_categories
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Partners can view solution categories"
ON public.solution_categories
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'partner'::app_role));

CREATE POLICY "Anyone can view solution categories for active solutions"
ON public.solution_categories
FOR SELECT
TO authenticated
USING (solution_id IN (
  SELECT id FROM public.solutions WHERE is_active = true
));

-- Create trigger for updated_at
CREATE TRIGGER update_solution_categories_updated_at
BEFORE UPDATE ON public.solution_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_solution_categories_solution_id ON public.solution_categories(solution_id);
CREATE INDEX idx_solution_categories_category_id ON public.solution_categories(category_id);
CREATE INDEX idx_solution_categories_position ON public.solution_categories(solution_id, position);