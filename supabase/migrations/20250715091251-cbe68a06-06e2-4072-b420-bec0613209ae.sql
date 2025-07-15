-- Insert sample categories
INSERT INTO categories (name, slug, description, icon_name, color, item_type_filter, position) VALUES
('Terminály', 'terminals', 'Platobné terminály a POS zariadenia', 'CreditCard', '#3B82F6', 'device', 1),
('Softvérové riešenia', 'software', 'Aplikácie a softvérové služby', 'Monitor', '#10B981', 'service', 2),
('Technické služby', 'technical', 'Inštalácie a technická podpora', 'Wrench', '#F59E0B', 'service', 3),
('Príslušenstvo', 'accessories', 'Doplnkové zariadenia a príslušenstvo', 'Package', '#8B5CF6', 'device', 4);

-- Insert sample item types
INSERT INTO item_types (name, slug, description, icon_name, color, position) VALUES
('Zariadenie', 'device', 'Fyzické zariadenia a hardware', 'Package', '#3B82F6', 1),
('Služba', 'service', 'Softvérové riešenia a služby', 'Settings', '#10B981', 2);

-- Insert sample warehouse items
INSERT INTO warehouse_items (
  name, description, category_id, item_type_id, category, item_type, 
  monthly_fee, company_cost, image_url, specifications, is_active
) VALUES
(
  'PAX A920 PRO',
  'Mobilný terminál s vysokým výkonom',
  (SELECT id FROM categories WHERE slug = 'terminals'),
  (SELECT id FROM item_types WHERE slug = 'device'),
  'terminals',
  'device',
  25,
  17.5,
  'https://cdn.prod.website-files.com/66d5d36d3181175e6ea8e618/682e2fdceed81a55890e46aa_A920%20Pro%201-p-1080.png',
  '{"features": ["Prepojenie s pokladňou: Podporované", "Zdroj energie: Batéria (8 hodín)", "Pripojenie: SIM, WiFi, Ethernet (s dockom)", "Displej: 5 farebný dotykový", "Platby: Kontaktné, bezkontaktné, Google/Apple Pay"]}'::jsonb,
  true
),
(
  'POS Software',
  'Komplexný pokladničný systém',
  (SELECT id FROM categories WHERE slug = 'software'),
  (SELECT id FROM item_types WHERE slug = 'service'),
  'software',
  'service', 
  15,
  8,
  null,
  '{"features": ["Kompletný pokladničný systém", "Správa produktov", "Reporty a štatistiky"]}'::jsonb,
  true
);

-- Create sample solutions if they don't exist
INSERT INTO solutions (name, description, subtitle, icon_name, color, position, is_active) VALUES
('POS Terminály', 'Moderné platobné terminály pre váš biznis', 'Rýchle a bezpečné platby', 'CreditCard', '#3B82F6', 1, true),
('E-commerce Riešenia', 'Online platby pre váš e-shop', 'Kompletné riešenie pre online predaj', 'Globe', '#10B981', 2, true),
('Mobilné Platby', 'Platby cez mobilné aplikácie', 'Jednoduché mobilné riešenia', 'Smartphone', '#F59E0B', 3, true),
('API Integrácie', 'Vlastné platobné riešenia', 'Flexibilné API pre vývojárov', 'Code', '#8B5CF6', 4, true)
ON CONFLICT (name) DO NOTHING;