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

-- Insert sample warehouse items (converting hardcoded data)
INSERT INTO warehouse_items (
  name, description, category_id, item_type_id, category, item_type, 
  monthly_fee, company_cost, image_url, specifications, is_active
) VALUES
-- Terminals category devices
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
  '{"features": ["Prepojenie s pokladňou: Podporované", "Zdroj energie: Batéria (8 hodín)", "Pripojenie: SIM, WiFi, Ethernet (s dockom)", "Displej: 5 farebný dotykový", "Pinpad: Nie je možné pripojiť", "Platby: Kontaktné, bezkontaktné, Google/Apple Pay"]}'::jsonb,
  true
),
(
  'PAX A80',
  'Stacionárny terminál pre vysoký objem transakcií', 
  (SELECT id FROM categories WHERE slug = 'terminals'),
  (SELECT id FROM item_types WHERE slug = 'device'),
  'terminals',
  'device',
  20,
  14,
  'https://cdn.prod.website-files.com/66d5d36d3181175e6ea8e618/682e303eed8f5d41b24c13ad_A80%201-p-1080.png',
  '{"features": ["Napájanie: Elektrická sieť 230V", "Pripojenie: Ethernet, WiFi (voliteľne)", "Displej: 2.8 farebný", "Pinpad: Áno (externý)", "Rýchlosť: Vysokorýchlostné spracovanie", "Platby: Všetky typy kariet + NFC"]}'::jsonb,
  true
),
-- Accessories category devices  
(
  'Tablet 10"',
  'Kompaktný tablet pre menšie prevádzky',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  (SELECT id FROM item_types WHERE slug = 'device'),
  'accessories', 
  'device',
  35,
  24.5,
  null,
  '{"features": ["Displej: 10 Full HD dotykový", "OS: Android 12", "RAM: 4GB, Storage: 64GB", "Batéria: 12 hodín prevádzky", "Pripojenie: WiFi, Bluetooth, 4G (voliteľne)"]}'::jsonb,
  true
),
(
  'Tablet 15"', 
  'Veľký tablet pre reštaurácie a obchody',
  (SELECT id FROM categories WHERE slug = 'accessories'),
  (SELECT id FROM item_types WHERE slug = 'device'), 
  'accessories',
  'device',
  45,
  31.5,
  null,
  '{"features": ["Displej: 15.6 Full HD dotykový", "OS: Android 12", "RAM: 6GB, Storage: 128GB", "Batéria: 10 hodín prevádzky", "Pripojenie: WiFi, Bluetooth, Ethernet"]}'::jsonb,
  true
),
-- Software category services
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
),
(
  'Inventory Management',
  'Sledovanie zásob a produktov',
  (SELECT id FROM categories WHERE slug = 'software'),
  (SELECT id FROM item_types WHERE slug = 'service'),
  'software',
  'service',
  10,
  5,
  null,
  '{"features": ["Sledovanie zásob", "Správa produktov", "Automatické objednávky"]}'::jsonb,
  true
),
(
  'Reporting Suite', 
  'Detailné reporty a štatistiky',
  (SELECT id FROM categories WHERE slug = 'software'),
  (SELECT id FROM item_types WHERE slug = 'service'),
  'software',
  'service',
  8,
  4,
  null,
  '{"features": ["Detailné reporty", "Analýzy predaja", "Exporty údajov"]}'::jsonb,
  true
),
-- Technical services
(
  'Inštalácia',
  'Profesionálna inštalácia zariadení',
  (SELECT id FROM categories WHERE slug = 'technical'),
  (SELECT id FROM item_types WHERE slug = 'service'),
  'technical',
  'service',
  0,
  50,
  null, 
  '{"features": ["Profesionálna inštalácia", "Testovanie funkčnosti", "Zaškolenie personálu"]}'::jsonb,
  true
),
(
  'Školenie',
  'Komplexné zaškolenie personálu',
  (SELECT id FROM categories WHERE slug = 'technical'), 
  (SELECT id FROM item_types WHERE slug = 'service'),
  'technical',
  'service',
  0,
  30,
  null,
  '{"features": ["Školenie personálu", "Dokumentácia", "Online podpora"]}'::jsonb,
  true
),
(
  'Technická podpora',
  'Nepretržitá technická podpora',
  (SELECT id FROM categories WHERE slug = 'technical'),
  (SELECT id FROM item_types WHERE slug = 'service'),
  'technical', 
  'service',
  12,
  6,
  null,
  '{"features": ["24/7 podpora", "Vzdialená diagnostika", "Rýchla reakcia"]}'::jsonb,
  true
);

-- Update solutions with proper Slovak names
UPDATE solutions SET 
  name = 'POS Terminály',
  description = 'Moderné platobné terminály pre váš biznis',
  subtitle = 'Rýchle a bezpečné platby'
WHERE name = 'Terminal Solutions' OR id IN (
  SELECT id FROM solutions WHERE name LIKE '%terminal%' OR name LIKE '%Terminal%'
) LIMIT 1;

UPDATE solutions SET
  name = 'E-commerce Riešenia', 
  description = 'Online platby pre váš e-shop',
  subtitle = 'Kompletné riešenie pre online predaj'
WHERE name = 'E-commerce Solutions' OR id IN (
  SELECT id FROM solutions WHERE name LIKE '%ecommerce%' OR name LIKE '%E-commerce%'
) LIMIT 1;

UPDATE solutions SET
  name = 'Mobilné Platby',
  description = 'Platby cez mobilné aplikácie', 
  subtitle = 'Jednoduché mobilné riešenia'
WHERE name = 'Mobile Payments' OR id IN (
  SELECT id FROM solutions WHERE name LIKE '%mobile%' OR name LIKE '%Mobile%'
) LIMIT 1;

UPDATE solutions SET
  name = 'API Integrácie',
  description = 'Vlastné platobné riešenia',
  subtitle = 'Flexibilné API pre vývojárov'
WHERE name = 'API Integrations' OR id IN (
  SELECT id FROM solutions WHERE name LIKE '%api%' OR name LIKE '%API%'
) LIMIT 1;