-- Create customers table for quick sales
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  ico TEXT,
  dic TEXT,
  vat_number TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quick_sales table (invoice header)
CREATE TABLE public.quick_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  sale_number TEXT NOT NULL DEFAULT ('QS-' || to_char(now(), 'YYYY') || '-' || lpad((nextval('quick_sale_number_seq'::regclass))::text, 6, '0')),
  sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  vat_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  discount_percentage NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quick_sale_items table (invoice items)
CREATE TABLE public.quick_sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quick_sale_id UUID NOT NULL REFERENCES public.quick_sales(id) ON DELETE CASCADE,
  warehouse_item_id UUID REFERENCES public.warehouse_items(id),
  item_name TEXT NOT NULL,
  item_description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  vat_rate NUMERIC NOT NULL DEFAULT 20,
  line_total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sequence for quick sale numbering
CREATE SEQUENCE IF NOT EXISTS quick_sale_number_seq START 1;

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_sale_items ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Admins and partners can manage customers" 
ON public.customers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'partner'::app_role));

-- Create policies for quick_sales
CREATE POLICY "Admins and partners can manage quick sales" 
ON public.quick_sales 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'partner'::app_role));

-- Create policies for quick_sale_items
CREATE POLICY "Admins and partners can manage quick sale items" 
ON public.quick_sale_items 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'partner'::app_role));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quick_sales_updated_at
BEFORE UPDATE ON public.quick_sales
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quick_sale_items_updated_at
BEFORE UPDATE ON public.quick_sale_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();