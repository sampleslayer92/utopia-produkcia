-- Create warehouse_items table for managing inventory
CREATE TABLE public.warehouse_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  item_type TEXT NOT NULL DEFAULT 'device', -- 'device' or 'service'
  monthly_fee NUMERIC NOT NULL DEFAULT 0,
  setup_fee NUMERIC NOT NULL DEFAULT 0,
  company_cost NUMERIC NOT NULL DEFAULT 0,
  specifications JSONB DEFAULT '{}',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  min_stock INTEGER DEFAULT 0,
  current_stock INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.warehouse_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins and partners can view warehouse items" 
ON public.warehouse_items 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'partner'::app_role));

CREATE POLICY "Admins and partners can create warehouse items" 
ON public.warehouse_items 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'partner'::app_role));

CREATE POLICY "Admins and partners can update warehouse items" 
ON public.warehouse_items 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'partner'::app_role));

CREATE POLICY "Admins can delete warehouse items" 
ON public.warehouse_items 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_warehouse_items_updated_at
BEFORE UPDATE ON public.warehouse_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data from existing catalogs
INSERT INTO public.warehouse_items (name, description, category, item_type, monthly_fee, setup_fee, company_cost, specifications) VALUES
-- Devices
('PAX A920 Pro', 'Professional payment terminal with advanced features', 'pos_terminals', 'device', 25.00, 0.00, 15.00, '{"connectivity": ["WiFi", "4G", "Bluetooth"], "display": "5.5 inch color touchscreen", "printer": "built-in thermal"}'),
('PAX A77', 'Compact countertop payment terminal', 'pos_terminals', 'device', 20.00, 0.00, 12.00, '{"connectivity": ["WiFi", "Ethernet"], "display": "2.8 inch color", "printer": "built-in thermal"}'),
('Castles S1F2', 'Mobile payment terminal for on-the-go transactions', 'pos_terminals', 'device', 22.00, 0.00, 14.00, '{"connectivity": ["WiFi", "4G"], "display": "4 inch touchscreen", "battery": "rechargeable"}'),
('Samsung Galaxy Tab A8', 'Tablet for POS applications', 'tablets', 'device', 15.00, 0.00, 8.00, '{"screen": "10.5 inch", "storage": "32GB", "connectivity": ["WiFi"]}'),
('iPad Air', 'Premium tablet for professional POS setup', 'tablets', 'device', 30.00, 0.00, 18.00, '{"screen": "10.9 inch Liquid Retina", "storage": "64GB", "connectivity": ["WiFi"]}'),

-- Services  
('POS Software Basic', 'Basic point of sale software solution', 'software', 'service', 12.00, 50.00, 5.00, '{"features": ["inventory management", "sales reporting"], "users": 1}'),
('POS Software Pro', 'Advanced POS software with analytics', 'software', 'service', 25.00, 100.00, 10.00, '{"features": ["advanced analytics", "multi-user", "inventory", "customer management"], "users": 5}'),
('Payment Processing', 'Secure payment processing service', 'processing', 'service', 8.00, 0.00, 3.00, '{"supported_cards": ["Visa", "Mastercard", "Maestro"], "security": "PCI DSS compliant"}'),
('Technical Support', '24/7 technical support and maintenance', 'support', 'service', 15.00, 0.00, 8.00, '{"availability": "24/7", "response_time": "1 hour", "languages": ["SK", "EN"]}'),
('Analytics Dashboard', 'Advanced business analytics and reporting', 'analytics', 'service', 18.00, 75.00, 7.00, '{"features": ["real-time reporting", "custom dashboards", "data export"], "retention": "2 years"}');