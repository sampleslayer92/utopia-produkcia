-- Vymazať existujúce nesprávne dáta
DELETE FROM step_modules;
DELETE FROM onboarding_fields;
DELETE FROM onboarding_steps;
DELETE FROM shareable_onboarding_links;
UPDATE onboarding_configurations SET is_active = false;

-- Vytvoriť novú konfiguráciu
INSERT INTO onboarding_configurations (id, name, description, is_active) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Statický onboarding 1:1', 'Presná kópia statického onboardingu', true);

-- Vytvoriť 7 krokov presne ako v statickom onboardingu
INSERT INTO onboarding_steps (id, configuration_id, step_key, title, description, position, is_enabled) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'contact-info', 'Kontaktné údaje', 'Zadajte vaše kontaktné informácie', 0, true),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'company-info', 'Údaje o spoločnosti', 'Zadajte údaje o vašej spoločnosti', 1, true),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'business-locations', 'Prevádzky', 'Definujte vaše prevádzkové miesta', 2, true),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'device-selection', 'Zariadenia a služby', 'Vyberte si zariadenia a služby', 3, true),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'fees', 'Poplatky', 'Kalkulácia poplatkov a ziskovosti', 4, true),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'persons-owners', 'Osoby a vlastníci', 'Oprávnené osoby a vlastníci', 5, true),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'consents', 'Súhlasy a podpis', 'Súhlasy a elektronický podpis', 6, true);

-- Pridať moduly pre každý krok
INSERT INTO step_modules (step_id, module_key, module_name, position, is_enabled, configuration) VALUES
-- Contact Info krok
('550e8400-e29b-41d4-a716-446655440001', 'contact_info', 'Kontaktné informácie', 0, true, '{}'),

-- Company Info krok  
('550e8400-e29b-41d4-a716-446655440002', 'company_info', 'Údaje o spoločnosti', 0, true, '{}'),

-- Business Locations krok
('550e8400-e29b-41d4-a716-446655440003', 'business_location', 'Prevádzkové miesta', 0, true, '{}'),

-- Device Selection krok - obsahuje 3 moduly
('550e8400-e29b-41d4-a716-446655440004', 'solution_selection', 'Výber riešení', 0, true, '{}'),
('550e8400-e29b-41d4-a716-446655440004', 'device_catalog', 'Katalóg zariadení', 1, true, '{}'),

-- Fees krok
('550e8400-e29b-41d4-a716-446655440005', 'calculator', 'Kalkulačka ziskovosti', 0, true, '{}'),

-- Persons and Owners krok - obsahuje 2 moduly
('550e8400-e29b-41d4-a716-446655440006', 'authorized_persons', 'Oprávnené osoby', 0, true, '{}'),
('550e8400-e29b-41d4-a716-446655440006', 'actual_owners', 'Skutoční vlastníci', 1, true, '{}'),

-- Consents krok
('550e8400-e29b-41d4-a716-446655440007', 'consents', 'Súhlasy a podpis', 0, true, '{}');

-- Pridať základné polia pre contact-info krok
INSERT INTO onboarding_fields (step_id, field_key, field_label, field_type, is_required, is_enabled, position) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'firstName', 'Meno', 'text', true, true, 0),
('550e8400-e29b-41d4-a716-446655440001', 'lastName', 'Priezvisko', 'text', true, true, 1),
('550e8400-e29b-41d4-a716-446655440001', 'email', 'Email', 'email', true, true, 2),
('550e8400-e29b-41d4-a716-446655440001', 'phone', 'Telefón', 'tel', true, true, 3);

-- Pridať základné polia pre company-info krok
INSERT INTO onboarding_fields (step_id, field_key, field_label, field_type, is_required, is_enabled, position) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'companyName', 'Názov spoločnosti', 'text', true, true, 0),
('550e8400-e29b-41d4-a716-446655440002', 'ico', 'IČO', 'text', true, true, 1),
('550e8400-e29b-41d4-a716-446655440002', 'dic', 'DIČ', 'text', false, true, 2),
('550e8400-e29b-41d4-a716-446655440002', 'vatNumber', 'IČ DPH', 'text', false, true, 3);

-- Vytvoriť testovací zdieľaný link
INSERT INTO shareable_onboarding_links (id, configuration_id, name, url, is_active) VALUES
('test-link-001', '550e8400-e29b-41d4-a716-446655440000', 'Testovací link pre statický onboarding', '/onboarding/shared/test-link-001', true);