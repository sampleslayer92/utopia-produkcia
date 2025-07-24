-- Add new product categories and items to warehouse_items table

-- Insert new categories if they don't exist
INSERT INTO categories (name, slug, description, color, item_type_filter) VALUES
('Platobný terminál', 'platobny-terminal', 'Platobné terminály a POS zariadenia', '#10B981', 'device'),
('Pokladňa', 'pokladna', 'Pokladničné riešenia a tablety', '#3B82F6', 'device'),
('Pokladničný systém', 'pokladnicny-system', 'Softvérové riešenia pre pokladnice', '#8B5CF6', 'service'),
('Moduly', 'moduly', 'Moduly ku pokladničnému systému', '#F59E0B', 'service'),
('Príslušenstvo', 'prislusenstvo', 'Príslušenstvo a doplnky', '#6B7280', 'device'),
('Ecom platobná brána', 'ecom-platobna-brana', 'Online platobné brány', '#EF4444', 'service'),
('Technický servis', 'technicky-servis', 'Technická podpora a servisné služby', '#14B8A6', 'service')
ON CONFLICT (slug) DO NOTHING;

-- Insert item types if they don't exist
INSERT INTO item_types (name, slug, description, color) VALUES
('Riešenie', 'riesenie', 'Komplexné riešenia', '#3B82F6'),
('Kategória', 'kategoria', 'Kategórie produktov', '#8B5CF6'),
('Modul', 'modul', 'Moduly a rozšírenia', '#F59E0B'),
('Príslušenstvo', 'prislusenstvo', 'Doplnky a príslušenstvo', '#6B7280')
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for referencing
DO $$
DECLARE
    terminal_cat_id uuid;
    pokladna_cat_id uuid;
    system_cat_id uuid;
    moduly_cat_id uuid;
    prislusenstvo_cat_id uuid;
    ecom_cat_id uuid;
    servis_cat_id uuid;
    riesenie_type_id uuid;
    kategoria_type_id uuid;
    modul_type_id uuid;
    prislusenstvo_type_id uuid;
BEGIN
    -- Get category IDs
    SELECT id INTO terminal_cat_id FROM categories WHERE slug = 'platobny-terminal';
    SELECT id INTO pokladna_cat_id FROM categories WHERE slug = 'pokladna';
    SELECT id INTO system_cat_id FROM categories WHERE slug = 'pokladnicny-system';
    SELECT id INTO moduly_cat_id FROM categories WHERE slug = 'moduly';
    SELECT id INTO prislusenstvo_cat_id FROM categories WHERE slug = 'prislusenstvo';
    SELECT id INTO ecom_cat_id FROM categories WHERE slug = 'ecom-platobna-brana';
    SELECT id INTO servis_cat_id FROM categories WHERE slug = 'technicky-servis';
    
    -- Get item type IDs
    SELECT id INTO riesenie_type_id FROM item_types WHERE slug = 'riesenie';
    SELECT id INTO kategoria_type_id FROM item_types WHERE slug = 'kategoria';
    SELECT id INTO modul_type_id FROM item_types WHERE slug = 'modul';
    SELECT id INTO prislusenstvo_type_id FROM item_types WHERE slug = 'prislusenstvo';

    -- Insert Platobný terminál products
    INSERT INTO warehouse_items (name, description, category_id, item_type_id, category, item_type, monthly_fee, company_cost, current_stock, is_active) VALUES
    ('PAX A920 PRO 1GB', 'Platobný terminál PAX A920 PRO s 1GB pamäťou', terminal_cat_id, riesenie_type_id, 'Platobný terminál', 'device', 25.00, 20.00, 10, true),
    ('PAX A920 PRO 2GB', 'Platobný terminál PAX A920 PRO s 2GB pamäťou', terminal_cat_id, riesenie_type_id, 'Platobný terminál', 'device', 30.00, 25.00, 8, true),
    ('PAX A920 MAX', 'Platobný terminál PAX A920 MAX', terminal_cat_id, riesenie_type_id, 'Platobný terminál', 'device', 35.00, 30.00, 5, true),
    ('PAX A80', 'Platobný terminál PAX A80', terminal_cat_id, riesenie_type_id, 'Platobný terminál', 'device', 20.00, 15.00, 15, true),
    ('PAX A35', 'Platobný terminál PAX A35', terminal_cat_id, riesenie_type_id, 'Platobný terminál', 'device', 15.00, 12.00, 20, true),
    ('PIN PAD', 'PIN PAD terminál', terminal_cat_id, riesenie_type_id, 'Platobný terminál', 'device', 10.00, 8.00, 25, true),
    ('GP TOM', 'GP TOM platobný terminál', terminal_cat_id, riesenie_type_id, 'Platobný terminál', 'device', 18.00, 14.00, 12, true);

    -- Insert Pokladňa products
    INSERT INTO warehouse_items (name, description, category_id, item_type_id, category, item_type, monthly_fee, company_cost, current_stock, is_active) VALUES
    ('Tablet 15"', 'Pokladničný tablet 15 palcov', pokladna_cat_id, riesenie_type_id, 'Pokladňa', 'device', 40.00, 35.00, 8, true),
    ('Tablet Pro 15"', 'Profesionálny pokladničný tablet 15 palcov', pokladna_cat_id, riesenie_type_id, 'Pokladňa', 'device', 50.00, 45.00, 6, true),
    ('Tablet 10"', 'Pokladničný tablet 10 palcov', pokladna_cat_id, riesenie_type_id, 'Pokladňa', 'device', 30.00, 25.00, 12, true);

    -- Insert Pokladničný systém products
    INSERT INTO warehouse_items (name, description, category_id, item_type_id, category, item_type, monthly_fee, company_cost, current_stock, is_active) VALUES
    ('VRP', 'VRP pokladničný systém', system_cat_id, kategoria_type_id, 'Pokladničný systém', 'service', 20.00, 15.00, 999, true),
    ('VRP DRIVER', 'VRP DRIVER systém', system_cat_id, kategoria_type_id, 'Pokladničný systém', 'service', 15.00, 12.00, 999, true),
    ('EASY KASA', 'EASY KASA pokladničný systém', system_cat_id, kategoria_type_id, 'Pokladničný systém', 'service', 25.00, 20.00, 999, true),
    ('SMARTPOS', 'SMARTPOS pokladničný systém', system_cat_id, kategoria_type_id, 'Pokladničný systém', 'service', 30.00, 25.00, 999, true);

    -- Insert Moduly products
    INSERT INTO warehouse_items (name, description, category_id, item_type_id, category, item_type, monthly_fee, company_cost, current_stock, is_active) VALUES
    ('Skladové hospodárstvo', 'Modul pre skladové hospodárstvo', moduly_cat_id, modul_type_id, 'Moduly', 'service', 10.00, 8.00, 999, true),
    ('Gastro modul', 'Modul pre gastronomické prevádzky', moduly_cat_id, modul_type_id, 'Moduly', 'service', 15.00, 12.00, 999, true),
    ('Mobilný čašník', 'Modul mobilného čašníka', moduly_cat_id, modul_type_id, 'Moduly', 'service', 12.00, 10.00, 999, true),
    ('Objednávkový systém', 'Modul objednávkového systému', moduly_cat_id, modul_type_id, 'Moduly', 'service', 18.00, 15.00, 999, true),
    ('Vernostný systém', 'Modul vernostného systému', moduly_cat_id, modul_type_id, 'Moduly', 'service', 14.00, 11.00, 999, true),
    ('Rezervačný systém', 'Modul rezervačného systému', moduly_cat_id, modul_type_id, 'Moduly', 'service', 16.00, 13.00, 999, true),
    ('Objednávky zo stolov', 'Modul objednávok zo stolov', moduly_cat_id, modul_type_id, 'Moduly', 'service', 20.00, 16.00, 999, true);

    -- Insert Príslušenstvo products
    INSERT INTO warehouse_items (name, description, category_id, item_type_id, category, item_type, monthly_fee, company_cost, current_stock, is_active) VALUES
    ('CHDÚ', 'Chránená dátová úložná jednotka', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 8.00, 6.00, 50, true),
    ('SIM', 'SIM karta pre terminály', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 5.00, 3.00, 100, true),
    ('Bonovacia tlačiareň', 'Tlačiareň pre bonové pokladnice', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 15.00, 12.00, 20, true),
    ('Dokovacia stanica (len nabíjanie)', 'Dokovacia stanica len na nabíjanie', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 5.00, 4.00, 30, true),
    ('Dokovacia stanica + periférie', 'Dokovacia stanica s perifériami', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 12.00, 10.00, 15, true),
    ('Kryt PAX (silikónový)', 'Silikónový kryt pre PAX terminály', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 3.00, 2.00, 80, true),
    ('router ASUS', 'ASUS router pre internetové pripojenie', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 8.00, 6.00, 25, true),
    ('Peňažná zásuvka - malá', 'Malá peňažná zásuvka', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 10.00, 8.00, 40, true),
    ('Peňažná zásuvka - veľká', 'Veľká peňažná zásuvka', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 15.00, 12.00, 25, true),
    ('Váha', 'Elektronická váha', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 20.00, 16.00, 10, true),
    ('PORTOS CHDÚ', 'PORTOS chránená dátová úložná jednotka', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 12.00, 10.00, 15, true),
    ('PORTOS tlačiareň', 'PORTOS tlačiareň', prislusenstvo_cat_id, prislusenstvo_type_id, 'Príslušenstvo', 'device', 18.00, 15.00, 12, true);

    -- Insert Ecom platobná brána products
    INSERT INTO warehouse_items (name, description, category_id, item_type_id, category, item_type, monthly_fee, company_cost, current_stock, is_active) VALUES
    ('GP Webpay', 'GP Webpay platobná brána pre e-commerce', ecom_cat_id, riesenie_type_id, 'Ecom platobná brána', 'service', 25.00, 20.00, 999, true);

    -- Insert Technický servis products
    INSERT INTO warehouse_items (name, description, category_id, item_type_id, category, item_type, monthly_fee, company_cost, current_stock, is_active) VALUES
    ('Zaškolenie na diaľku', 'Online zaškolenie pre používateľov', servis_cat_id, kategoria_type_id, 'Technický servis', 'service', 50.00, 40.00, 999, true),
    ('Inštalácia na diaľku', 'Vzdialená inštalácia systému', servis_cat_id, kategoria_type_id, 'Technický servis', 'service', 80.00, 60.00, 999, true),
    ('Zaškolenie osobne', 'Osobné zaškolenie na mieste', servis_cat_id, kategoria_type_id, 'Technický servis', 'service', 120.00, 100.00, 999, true),
    ('Inštalácia osobne', 'Osobná inštalácia na mieste', servis_cat_id, kategoria_type_id, 'Technický servis', 'service', 150.00, 120.00, 999, true),
    ('Import PLU', 'Import databázy produktov', servis_cat_id, kategoria_type_id, 'Technický servis', 'service', 30.00, 25.00, 999, true),
    ('Prepojenie na externý software telefonicky', 'Telefonické prepojenie na externý software', servis_cat_id, kategoria_type_id, 'Technický servis', 'service', 40.00, 30.00, 999, true),
    ('Prepojenie na ext. software osobne', 'Osobné prepojenie na externý software', servis_cat_id, kategoria_type_id, 'Technický servis', 'service', 80.00, 60.00, 999, true),
    ('Telefonická podpora 17.00 - 22.00 hod. + víkendy a sviatky', 'Rozšírená telefonická podpora', servis_cat_id, kategoria_type_id, 'Technický servis', 'service', 20.00, 15.00, 999, true);

END $$;