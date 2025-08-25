-- Demo data for presentation - Slovak companies and contracts (CORRECTED)
-- Insert merchants (Slovak companies)
INSERT INTO merchants (id, company_name, ico, dic, vat_number, contact_person_name, contact_person_email, contact_person_phone, address_street, address_city, address_zip_code) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Reštaurácia U Janka', '12345678', '1023456789', 'SK1023456789', 'Ján Novák', 'jan.novak@ujanka.sk', '+421901234567', 'Hlavná 15', 'Bratislava', '81101'),
('550e8400-e29b-41d4-a716-446655440002', 'Fashion Store Moda', '23456789', '1034567890', 'SK1034567890', 'Anna Kováčová', 'anna@fashionmoda.sk', '+421902345678', 'Obchodná 8', 'Košice', '04001'),
('550e8400-e29b-41d4-a716-446655440003', 'Autoservis Speed', '34567890', '1045678901', '', 'Peter Horváth', 'peter@autospeed.sk', '+421903456789', 'Technická 22', 'Žilina', '01001'),
('550e8400-e29b-41d4-a716-446655440004', 'Kaderníctvo Bella', '45678901', '1056789012', 'SK1056789012', 'Mária Svobodová', 'maria@bella.sk', '+421904567890', 'Kvetná 5', 'Nitra', '94901'),
('550e8400-e29b-41d4-a716-446655440005', 'Fitness Gold Gym', '56789012', '1067890123', 'SK1067890123', 'Tomáš Baláž', 'tomas@goldgym.sk', '+421905678901', 'Športová 33', 'Trnava', '91701'),
('550e8400-e29b-41d4-a716-446655440006', 'Kaviareň Café Central', '67890123', '1078901234', '', 'Eva Dudášová', 'eva@cafecentral.sk', '+421906789012', 'Námestie 12', 'Banská Bystrica', '97401'),
('550e8400-e29b-41d4-a716-446655440007', 'Lekáreň Zdravie Plus', '78901234', '1089012345', 'SK1089012345', 'MUDr. Pavel Varga', 'pavel@zdravieplus.sk', '+421907890123', 'Lekárska 7', 'Prešov', '08001'),
('550e8400-e29b-41d4-a716-446655440008', 'Kvetinárstvo Ruža', '89012345', '1090123456', '', 'Zuzana Bartošová', 'zuzana@ruza.sk', '+421908901234', 'Sadová 18', 'Trenčín', '91101'),
('550e8400-e29b-41d4-a716-446655440009', 'Pizza Express', '90123456', '1101234567', 'SK1101234567', 'Martin Sedlák', 'martin@pizzaexpress.sk', '+421909012345', 'Pizzová 25', 'Poprad', '05801'),
('550e8400-e29b-41d4-a716-446655440010', 'Elektro Mega', '01234567', '1112345678', 'SK1112345678', 'Ladislav Krupa', 'ladislav@elektromega.sk', '+421910123456', 'Elektrická 44', 'Martin', '03601'),
('550e8400-e29b-41d4-a716-446655440011', 'Wellness Spa Relax', '11234567', '1123456789', 'SK1123456789', 'Silvia Marková', 'silvia@sparelax.sk', '+421911234567', 'Kúpeľná 9', 'Piešťany', '92101'),
('550e8400-e29b-41d4-a716-446655440012', 'Pub Irish Corner', '21234567', '1134567890', '', 'Brian O''Connor', 'brian@irishcorner.sk', '+421912345678', 'Írska 3', 'Bratislava', '81102'),
('550e8400-e29b-41d4-a716-446655440013', 'Cukráreň Sweet Dreams', '31234567', '1145678901', 'SK1145678901', 'Katarína Blažková', 'katarina@sweetdreams.sk', '+421913456789', 'Sladká 11', 'Košice', '04002'),
('550e8400-e29b-41d4-a716-446655440014', 'Optika Clear Vision', '41234567', '1156789012', 'SK1156789012', 'Michal Jurčo', 'michal@clearvision.sk', '+421914567890', 'Zraková 16', 'Žilina', '01002'),
('550e8400-e29b-41d4-a716-446655440015', 'Hračkárstvo Detský svet', '51234567', '1167890123', '', 'Lenka Paulínyová', 'lenka@detskysvet.sk', '+421915678901', 'Detská 20', 'Nitra', '94902');

-- Insert contracts with various statuses and realistic data
INSERT INTO contracts (id, contract_number, merchant_id, status, source, notes, created_by) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'C-2024-001', '550e8400-e29b-41d4-a716-446655440001', 'approved', 'web', 'Reštaurácia s vysokým obratom, veľký potenciál', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440002', 'C-2024-002', '550e8400-e29b-41d4-a716-446655440002', 'signed', 'telesales', 'Fashion store v centre mesta', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440003', 'C-2024-003', '550e8400-e29b-41d4-a716-446655440003', 'in_progress', 'referral', 'Autoservis potrebuje mobilný terminál', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440004', 'C-2024-004', '550e8400-e29b-41d4-a716-446655440004', 'signed', 'web', 'Malé kaderníctvo, základný balík', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440005', 'C-2024-005', '550e8400-e29b-41d4-a716-446655440005', 'approved', 'telesales', 'Fitness centrum s veľkým počtom členov', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440006', 'C-2024-006', '550e8400-e29b-41d4-a716-446655440006', 'lost', 'web', 'Kaviareň v centre mesta', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440007', 'C-2024-007', '550e8400-e29b-41d4-a716-446655440007', 'signed', 'referral', 'Lekáreň potrebuje bezpečné platby', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440008', 'C-2024-008', '550e8400-e29b-41d4-a716-446655440008', 'draft', 'web', 'Kvetinárstvo, sezónna prevádzka', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440009', 'C-2024-009', '550e8400-e29b-41d4-a716-446655440009', 'signed', 'telesales', 'Pizza reštaurácia s rozvozom', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440010', 'C-2024-010', '550e8400-e29b-41d4-a716-446655440010', 'approved', 'web', 'Veľký elektro obchod', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440011', 'C-2024-011', '550e8400-e29b-41d4-a716-446655440011', 'in_progress', 'referral', 'Wellness centrum, luxusná kategória', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440012', 'C-2024-012', '550e8400-e29b-41d4-a716-446655440012', 'lost', 'telesales', 'Pub s nočným programom', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440013', 'C-2024-013', '550e8400-e29b-41d4-a716-446655440013', 'signed', 'web', 'Cukráreň s vlastnou výrobou', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440014', 'C-2024-014', '550e8400-e29b-41d4-a716-446655440014', 'approved', 'referral', 'Optika s očným vyšetrením', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440015', 'C-2024-015', '550e8400-e29b-41d4-a716-446655440015', 'draft', 'web', 'Hračkárstvo, veľa malých nákupov', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440016', 'C-2024-016', '550e8400-e29b-41d4-a716-446655440001', 'signed', 'referral', 'Druhá pobočka reštaurácie', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440017', 'C-2024-017', '550e8400-e29b-41d4-a716-446655440005', 'approved', 'telesales', 'Fitness - premium balík', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440018', 'C-2024-018', '550e8400-e29b-41d4-a716-446655440010', 'in_progress', 'web', 'Elektro - rozšírenie na e-shop', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440019', 'C-2024-019', '550e8400-e29b-41d4-a716-446655440002', 'lost', 'telesales', 'Fashion - seasonal extension', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52'),
('660e8400-e29b-41d4-a716-446655440020', 'C-2024-020', '550e8400-e29b-41d4-a716-446655440007', 'signed', 'referral', 'Lekáreň - rozšírenie služieb', 'bb8c1b26-2f92-4d1e-a5a7-8b9c0d3e4f52');

-- Set proper lost_reason for lost contracts
UPDATE contracts SET lost_reason = 'competition' WHERE id = '660e8400-e29b-41d4-a716-446655440006';
UPDATE contracts SET lost_reason = 'time' WHERE id = '660e8400-e29b-41d4-a716-446655440012';
UPDATE contracts SET lost_reason = 'budget' WHERE id = '660e8400-e29b-41d4-a716-446655440019';

-- Add lost notes
UPDATE contracts SET lost_notes = 'Konkurencia ponúkla lepšie podmienky' WHERE id = '660e8400-e29b-41d4-a716-446655440006';
UPDATE contracts SET lost_notes = 'Dlhé schvaľovanie, zákazník stratil záujem' WHERE id = '660e8400-e29b-41d4-a716-446655440012';
UPDATE contracts SET lost_notes = 'Nedostatočný obrat v zimnom období' WHERE id = '660e8400-e29b-41d4-a716-446655440019';

-- Insert business locations
INSERT INTO business_locations (id, contract_id, name, has_pos, address_street, address_city, address_zip_code, iban, contact_person_name, contact_person_email, contact_person_phone, business_sector, estimated_turnover, average_transaction, opening_hours, seasonality) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Reštaurácia U Janka - Hlavná', true, 'Hlavná 15', 'Bratislava', '81101', 'SK3112000000198742637541', 'Ján Novák', 'jan.novak@ujanka.sk', '+421901234567', 'Reštaurácie a jedlá', 45000, 28.50, 'Po-Ne: 11:00-23:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Fashion Store Moda', true, 'Obchodná 8', 'Košice', '04001', 'SK6409000000007103123456', 'Anna Kováčová', 'anna@fashionmoda.sk', '+421902345678', 'Odevnictví a móda', 32000, 65.80, 'Po-Pi: 9:00-19:00, So: 9:00-17:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'Autoservis Speed', false, 'Technická 22', 'Žilina', '01001', 'SK2775000000001234567890', 'Peter Horváth', 'peter@autospeed.sk', '+421903456789', 'Oprava vozidiel', 28000, 156.30, 'Po-Pi: 7:30-17:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'Kaderníctvo Bella', true, 'Kvetná 5', 'Nitra', '94901', 'SK8809000000005103987456', 'Mária Svobodová', 'maria@bella.sk', '+421904567890', 'Kozmetické služby', 18000, 45.20, 'Ut-So: 8:00-18:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'Fitness Gold Gym', true, 'Športová 33', 'Trnava', '91701', 'SK1211000000001987654321', 'Tomáš Baláž', 'tomas@goldgym.sk', '+421905678901', 'Fitness a wellness', 55000, 89.90, 'Po-Ne: 6:00-22:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440007', 'Lekáreň Zdravie Plus', true, 'Lekárska 7', 'Prešov', '08001', 'SK4965000000003210987654', 'MUDr. Pavel Varga', 'pavel@zdravieplus.sk', '+421907890123', 'Zdravotníctvo', 95000, 23.70, 'Po-Pi: 7:00-19:00, So: 8:00-14:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440008', 'Kvetinárstvo Ruža', true, 'Sadová 18', 'Trenčín', '91101', 'SK7575000000009876543210', 'Zuzana Bartošová', 'zuzana@ruza.sk', '+421908901234', 'Kvety a záhrady', 22000, 35.60, 'Po-Pi: 8:00-17:00, So: 8:00-14:00', 'seasonal'),
('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440009', 'Pizza Express', true, 'Pizzová 25', 'Poprad', '05801', 'SK3365000000004567123890', 'Martin Sedlák', 'martin@pizzaexpress.sk', '+421909012345', 'Reštaurácie a jedlá', 38000, 18.90, 'Po-Ne: 10:00-22:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440010', 'Elektro Mega - Predajňa', true, 'Elektrická 44', 'Martin', '03601', 'SK5512000000007890123456', 'Ladislav Krupa', 'ladislav@elektromega.sk', '+421910123456', 'Elektrotechnika', 125000, 245.80, 'Po-Pi: 8:00-18:00, So: 8:00-16:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440011', 'Wellness Spa Relax', true, 'Kúpeľná 9', 'Piešťany', '92101', 'SK9900000000002468135790', 'Silvia Marková', 'silvia@sparelax.sk', '+421911234567', 'Wellness a spa', 85000, 125.50, 'Po-Ne: 9:00-21:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440013', 'Cukráreň Sweet Dreams', true, 'Sladká 11', 'Košice', '04002', 'SK1365000000008642097531', 'Katarína Blažková', 'katarina@sweetdreams.sk', '+421913456789', 'Cukrárstvo', 29000, 12.80, 'Ut-Ne: 7:00-19:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440014', 'Optika Clear Vision', true, 'Zraková 16', 'Žilina', '01002', 'SK7409000000001357924680', 'Michal Jurčo', 'michal@clearvision.sk', '+421914567890', 'Zdravotníctvo', 42000, 178.90, 'Po-Pi: 8:30-17:30, So: 9:00-13:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440015', 'Hračkárstvo Detský svet', true, 'Detská 20', 'Nitra', '94902', 'SK2511000000006789012345', 'Lenka Paulínyová', 'lenka@detskysvet.sk', '+421915678901', 'Hračky a detské potreby', 35000, 28.40, 'Po-Pi: 9:00-18:00, So: 9:00-16:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440016', 'Reštaurácia U Janka - Petržalka', true, 'Juzná 45', 'Bratislava', '85101', 'SK8912000000003456789012', 'Jana Nováková', 'jana.novakova@ujanka.sk', '+421901234568', 'Reštaurácie a jedlá', 38000, 26.30, 'Po-Ne: 11:00-23:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440017', 'Fitness Gold Gym - Premium', true, 'Fitness 12', 'Trnava', '91702', 'SK4675000000009012345678', 'Tomáš Baláž', 'tomas@goldgym.sk', '+421905678902', 'Fitness a wellness', 78000, 125.90, 'Po-Ne: 5:00-23:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440016', '660e8400-e29b-41d4-a716-446655440018', 'Elektro Mega - E-shop centrum', false, 'Skladová 8', 'Martin', '03602', 'SK1175000000005678901234', 'Peter Novotný', 'peter@elektromega.sk', '+421910123457', 'Elektrotechnika', 185000, 456.20, 'Po-Pi: 7:00-19:00', 'year-round'),
('770e8400-e29b-41d4-a716-446655440017', '660e8400-e29b-41d4-a716-446655440020', 'Lekáreň Zdravie Plus - Centrum', true, 'Centrálna 3', 'Prešov', '08002', 'SK6609000000007891234560', 'PharmDr. Eva Nováková', 'eva@zdravieplus.sk', '+421907890124', 'Zdravotníctvo', 112000, 28.90, 'Po-Ne: 7:00-22:00', 'year-round');

-- Insert contract calculations
INSERT INTO contract_calculations (id, contract_id, monthly_turnover, total_customer_payments, total_company_costs, effective_regulated, effective_unregulated, regulated_fee, unregulated_fee, transaction_margin, service_margin, total_monthly_profit, calculation_data) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 45000, 335.49, 89.99, 1.2, 2.1, 245.50, 89.99, 155.51, 89.99, 245.50, '{"items": [], "breakdown": {"customerPayments": 335.49, "companyCosts": 89.99}}'),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 32000, 256.80, 67.50, 1.1, 1.9, 189.30, 67.50, 122.30, 67.50, 189.30, '{"items": [], "breakdown": {"customerPayments": 256.80, "companyCosts": 67.50}}'),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 28000, 201.75, 45.00, 1.0, 1.8, 156.75, 45.00, 111.75, 45.00, 156.75, '{"items": [], "breakdown": {"customerPayments": 201.75, "companyCosts": 45.00}}'),
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 18000, 134.19, 35.99, 0.8, 1.5, 98.20, 35.99, 62.21, 35.99, 98.20, '{"items": [], "breakdown": {"customerPayments": 134.19, "companyCosts": 35.99}}'),
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 55000, 459.80, 125.00, 1.4, 2.3, 334.80, 125.00, 209.80, 125.00, 334.80, '{"items": [], "breakdown": {"customerPayments": 459.80, "companyCosts": 125.00}}'),
('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440007', 95000, 234.40, 55.50, 1.1, 2.0, 178.90, 55.50, 123.40, 55.50, 178.90, '{"items": [], "breakdown": {"customerPayments": 234.40, "companyCosts": 55.50}}'),
('880e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440009', 38000, 384.60, 95.00, 1.3, 2.2, 289.60, 95.00, 194.60, 95.00, 289.60, '{"items": [], "breakdown": {"customerPayments": 384.60, "companyCosts": 95.00}}'),
('880e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440010', 125000, 757.19, 189.99, 1.5, 2.5, 567.20, 189.99, 377.21, 189.99, 567.20, '{"items": [], "breakdown": {"customerPayments": 757.19, "companyCosts": 189.99}}'),
('880e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440011', 85000, 610.30, 165.00, 1.4, 2.4, 445.30, 165.00, 280.30, 165.00, 445.30, '{"items": [], "breakdown": {"customerPayments": 610.30, "companyCosts": 165.00}}'),
('880e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440013', 29000, 184.69, 49.99, 1.0, 1.7, 134.70, 49.99, 84.71, 49.99, 134.70, '{"items": [], "breakdown": {"customerPayments": 184.69, "companyCosts": 49.99}}'),
('880e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440014', 42000, 277.90, 79.50, 1.2, 2.0, 198.40, 79.50, 118.90, 79.50, 198.40, '{"items": [], "breakdown": {"customerPayments": 277.90, "companyCosts": 79.50}}');

-- Insert contract items (devices and services)
INSERT INTO contract_items (id, contract_id, name, description, item_type, category, count, monthly_fee, company_cost) VALUES
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'POS Terminál Basic', 'Základný POS terminál pre reštaurácie', 'device', 'pos-terminals', 1, 45.99, 25.50),
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Platobná brána Premium', 'Pokročilá platobná brána s analýzami', 'service', 'payment-gateway', 1, 44.00, 24.49),
('990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Fashion POS Systém', 'POS systém optimalizovaný pre oblečenie', 'device', 'pos-terminals', 1, 67.50, 35.25),
('990e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'Mobilný terminál', 'Prenosný terminál pre autoservis', 'device', 'mobile-terminals', 1, 45.00, 22.50),
('990e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440004', 'Základný POS', 'Jednoduché riešenie pre malé prevádzky', 'device', 'pos-terminals', 1, 35.99, 18.50),
('990e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440005', 'Fitness POS Pro', 'Špecializovaný systém pre fitness centrá', 'device', 'pos-terminals', 2, 62.50, 32.50),
('990e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440005', 'Členská karta systém', 'Systém pre správu členských kariet', 'service', 'membership', 1, 62.50, 32.50),
('990e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440007', 'Lekárenský POS', 'Certifikovaný systém pre lekárne', 'device', 'pos-terminals', 1, 55.50, 28.75),
('990e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440009', 'Pizza POS + Rozvoz', 'POS s integráciou rozvozových služieb', 'device', 'pos-terminals', 1, 95.00, 48.00),
('990e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440010', 'E-commerce brána', 'Platobná brána pre online obchody', 'service', 'payment-gateway', 1, 89.99, 45.99),
('990e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440010', 'Retail POS Systém', 'Pokročilý systém pre maloobchod', 'device', 'pos-terminals', 2, 100.00, 54.00),
('990e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440011', 'Spa & Wellness POS', 'Systém pre wellness centrá', 'device', 'pos-terminals', 1, 165.00, 85.00),
('990e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440013', 'Cukrárenský POS', 'POS pre cukrárne a pekárne', 'device', 'pos-terminals', 1, 49.99, 25.99),
('990e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440014', 'Optika POS', 'Špecializovaný systém pre optiky', 'device', 'pos-terminals', 1, 79.50, 42.50);

-- Insert device selection data
INSERT INTO device_selection (id, contract_id, mif_regulated_cards, mif_unregulated_cards, transaction_types, note) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 1.2, 2.1, '["chip_pin", "contactless", "online"]', 'Reštaurácia s vysokým objemom transakcií'),
('aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 1.1, 1.9, '["chip_pin", "contactless"]', 'Fashion store so stredným objemom'),
('aa0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 1.0, 1.8, '["chip_pin", "manual"]', 'Autoservis s vyššími čiastkami'),
('aa0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 0.8, 1.5, '["chip_pin", "contactless"]', 'Malé kaderníctvo'),
('aa0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 1.4, 2.3, '["chip_pin", "contactless", "online"]', 'Fitness centrum s členstvami'),
('aa0e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440007', 1.1, 2.0, '["chip_pin", "contactless"]', 'Lekáreň s pravidelnými zákazníkmi'),
('aa0e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440009', 1.3, 2.2, '["chip_pin", "contactless", "online"]', 'Pizza s rozvozom'),
('aa0e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440010', 1.5, 2.5, '["chip_pin", "contactless", "online"]', 'Veľký elektro obchod'),
('aa0e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440011', 1.4, 2.4, '["chip_pin", "contactless"]', 'Luxusné wellness centrum'),
('aa0e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440013', 1.0, 1.7, '["chip_pin", "contactless"]', 'Cukráreň s malými nákupmi'),
('aa0e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440014', 1.2, 2.0, '["chip_pin", "contactless"]', 'Optika s vyšším AOV');