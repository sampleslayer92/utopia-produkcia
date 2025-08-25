-- Demo data migration with completely new UUIDs
-- Insert merchants with new UUIDs
INSERT INTO public.merchants (
  id,
  company_name,
  ico,
  dic,
  vat_number,
  contact_person_name,
  contact_person_email,
  contact_person_phone,
  address_street,
  address_city,
  address_zip_code,
  created_at
) VALUES 
  ('f1b2c3d4-5e6f-7890-1234-567890abcdef', 'Tech Solutions s.r.o.', '12345678', 'SK1234567890', 'SK1234567890', 'Ján Novák', 'jan.novak@techsolutions.sk', '+421901234567', 'Hlavná 123', 'Bratislava', '81000', '2024-01-15 10:00:00+02'),
  ('f2c3d4e5-6f70-8901-2345-678901bcdef0', 'Retail Master a.s.', '23456789', 'SK2345678901', 'SK2345678901', 'Mária Svobodová', 'maria.svoboda@retailmaster.sk', '+421902345678', 'Obchodná 456', 'Košice', '04000', '2024-01-20 14:30:00+02'),
  ('f3d4e5f6-7081-9012-3456-789012cdef01', 'Gastro Express s.r.o.', '34567890', 'SK3456789012', 'SK3456789012', 'Peter Dvořák', 'peter.dvorak@gastroexpress.sk', '+421903456789', 'Reštauračná 789', 'Žilina', '01000', '2024-02-01 09:15:00+02'),
  ('f4e5f6a7-8192-0123-4567-890123def012', 'Fashion Boutique s.r.o.', '45678901', 'SK4567890123', 'SK4567890123', 'Anna Krásna', 'anna.krasna@fashionboutique.sk', '+421904567890', 'Módna 321', 'Nitra', '94900', '2024-02-10 16:45:00+02'),
  ('f5f6a7b8-92a3-1234-5678-901234ef0123', 'Auto Service Plus s.r.o.', '56789012', 'SK5678901234', 'SK5678901234', 'Milan Rychlý', 'milan.rychly@autoserviceplus.sk', '+421905678901', 'Servisná 654', 'Prešov', '08000', '2024-02-15 11:20:00+02'),
  ('f6a7b8c9-a3b4-2345-6789-012345f01234', 'Beauty Salon Luxe s.r.o.', '67890123', 'SK6789012345', 'SK6789012345', 'Zuzana Krásna', 'zuzana.krasna@beautysalonluxe.sk', '+421906789012', 'Krásna 987', 'Banská Bystrica', '97400', '2024-02-20 13:10:00+02');

-- Insert contracts with new UUIDs
INSERT INTO public.contracts (
  id,
  merchant_id,
  contract_number,
  status,
  created_by,
  created_at,
  submitted_at
) VALUES 
  ('f1111111-1111-1111-1111-111111111111', 'f1b2c3d4-5e6f-7890-1234-567890abcdef', 'ZML-2024-001', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-01-15 10:30:00+02', '2024-01-15 12:00:00+02'),
  ('f2222222-2222-2222-2222-222222222222', 'f2c3d4e5-6f70-8901-2345-678901bcdef0', 'ZML-2024-002', 'approved', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-01-20 15:00:00+02', '2024-01-20 16:30:00+02'),
  ('f3333333-3333-3333-3333-333333333333', 'f3d4e5f6-7081-9012-3456-789012cdef01', 'ZML-2024-003', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-01 09:45:00+02', '2024-02-01 11:15:00+02'),
  ('f4444444-4444-4444-4444-444444444444', 'f4e5f6a7-8192-0123-4567-890123def012', 'ZML-2024-004', 'pending_approval', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-10 17:15:00+02', NULL),
  ('f5555555-5555-5555-5555-555555555555', 'f5f6a7b8-92a3-1234-5678-901234ef0123', 'ZML-2024-005', 'draft', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-15 11:50:00+02', NULL),
  ('f6666666-6666-6666-6666-666666666666', 'f6a7b8c9-a3b4-2345-6789-012345f01234', 'ZML-2024-006', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-20 13:40:00+02', '2024-02-20 15:00:00+02');

-- Insert business locations
INSERT INTO public.business_locations (
  id,
  contract_id,
  location_id,
  name,
  has_pos,
  address_street,
  address_city,
  address_zip_code,
  iban,
  contact_person_name,
  contact_person_email,
  contact_person_phone,
  business_sector,
  estimated_turnover,
  average_transaction,
  opening_hours,
  seasonality,
  created_at
) VALUES 
  ('fa111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', gen_random_uuid(), 'Tech Solutions - Hlavná pobočka', true, 'Hlavná 123', 'Bratislava', '81000', 'SK1234567890123456', 'Ján Novák', 'jan.novak@techsolutions.sk', '+421901234567', 'technology', 50000, 45.50, '08:00-18:00', 'year-round', '2024-01-15 10:30:00+02'),
  ('fb222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', gen_random_uuid(), 'Retail Master - Centrála', true, 'Obchodná 456', 'Košice', '04000', 'SK2345678901234567', 'Mária Svobodová', 'maria.svoboda@retailmaster.sk', '+421902345678', 'retail', 120000, 32.75, '09:00-21:00', 'year-round', '2024-01-20 15:00:00+02'),
  ('fb222223-2222-2222-2222-222222222223', 'f2222222-2222-2222-2222-222222222222', gen_random_uuid(), 'Retail Master - Pobočka 2', true, 'Nákupná 789', 'Košice', '04000', 'SK3456789012345678', 'Eva Nováková', 'eva.novakova@retailmaster.sk', '+421912345678', 'retail', 80000, 28.90, '10:00-20:00', 'year-round', '2024-01-20 15:00:00+02'),
  ('fc333333-3333-3333-3333-333333333333', 'f3333333-3333-3333-3333-333333333333', gen_random_uuid(), 'Gastro Express - Reštaurácia', true, 'Reštauračná 789', 'Žilina', '01000', 'SK4567890123456789', 'Peter Dvořák', 'peter.dvorak@gastroexpress.sk', '+421903456789', 'food', 75000, 18.50, '11:00-23:00', 'year-round', '2024-02-01 09:45:00+02'),
  ('fc333334-3333-3333-3333-333333333334', 'f3333333-3333-3333-3333-333333333333', gen_random_uuid(), 'Gastro Express - Kaviareň', true, 'Káviarna 456', 'Žilina', '01000', 'SK5678901234567890', 'Lucia Kávová', 'lucia.kavova@gastroexpress.sk', '+421913456789', 'food', 45000, 8.75, '07:00-19:00', 'year-round', '2024-02-01 09:45:00+02'),
  ('fd444444-4444-4444-4444-444444444444', 'f4444444-4444-4444-4444-444444444444', gen_random_uuid(), 'Fashion Boutique - Showroom', true, 'Módna 321', 'Nitra', '94900', 'SK6789012345678901', 'Anna Krásna', 'anna.krasna@fashionboutique.sk', '+421904567890', 'fashion', 95000, 85.30, '10:00-19:00', 'seasonal', '2024-02-10 17:15:00+02'),
  ('fe555555-5555-5555-5555-555555555555', 'f5555555-5555-5555-5555-555555555555', gen_random_uuid(), 'Auto Service Plus - Servis', false, 'Servisná 654', 'Prešov', '08000', 'SK7890123456789012', 'Milan Rychlý', 'milan.rychly@autoserviceplus.sk', '+421905678901', 'automotive', 110000, 250.00, '07:30-17:00', 'year-round', '2024-02-15 11:50:00+02'),
  ('ff666666-6666-6666-6666-666666666667', 'f6666666-6666-6666-6666-666666666666', gen_random_uuid(), 'Beauty Salon Luxe - Salón', true, 'Krásna 987', 'Banská Bystrica', '97400', 'SK8901234567890123', 'Zuzana Krásna', 'zuzana.krasna@beautysalonluxe.sk', '+421906789012', 'beauty', 65000, 42.80, '09:00-20:00', 'year-round', '2024-02-20 13:40:00+02');

-- Insert contract calculations
INSERT INTO public.contract_calculations (
  id,
  contract_id,
  total_monthly_profit,
  monthly_turnover,
  created_at
) VALUES 
  ('fc111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 2500, 50000, '2024-01-15 10:30:00+02'),
  ('fc222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', 6000, 120000, '2024-01-20 15:00:00+02'),
  ('fc333333-3333-3333-3333-333333333333', 'f3333333-3333-3333-3333-333333333333', 4800, 96000, '2024-02-01 09:45:00+02'),
  ('fc444444-4444-4444-4444-444444444444', 'f4444444-4444-4444-4444-444444444444', 4750, 95000, '2024-02-10 17:15:00+02'),
  ('fc555555-5555-5555-5555-555555555555', 'f5555555-5555-5555-5555-555555555555', 5500, 110000, '2024-02-15 11:50:00+02'),
  ('fc666666-6666-6666-6666-666666666666', 'f6666666-6666-6666-6666-666666666666', 3250, 65000, '2024-02-20 13:40:00+02');

-- Insert contract items with warehouse_item_id references
INSERT INTO public.contract_items (
  id,
  contract_id,
  warehouse_item_id,
  item_type,
  category,
  name,
  description,
  count,
  monthly_fee,
  company_cost,
  created_at
) VALUES 
  ('f1111111-1111-1111-1111-111111111f11', 'f1111111-1111-1111-1111-111111111111', '0bb5955a-527a-4d99-894b-6aa35749f4bb', 'device', 'payment', 'Ingenico Move 5000', 'Mobilný POS terminál', 2, 45.00, 35.00, '2024-01-15 10:30:00+02'),
  ('f1111111-1111-1111-1111-111111111f12', 'f1111111-1111-1111-1111-111111111111', '341e7511-ea33-4854-8fd0-97d04a3c9579', 'service', 'payment', 'Online Gateway Pro', 'Platobná brána pre e-commerce', 1, 25.00, 15.00, '2024-01-15 10:30:00+02'),
  ('f2222222-2222-2222-2222-222222222f22', 'f2222222-2222-2222-2222-222222222222', '174ac2a9-1747-470f-ad0d-ebed6d8e0e93', 'device', 'payment', 'Verifone V400m', 'Stolný POS terminál', 3, 50.00, 40.00, '2024-01-20 15:00:00+02'),
  ('f2222222-2222-2222-2222-222222222f23', 'f2222222-2222-2222-2222-222222222222', 'fabd3c0d-9036-40f6-9877-2adf3d07517b', 'device', 'printing', 'Samsung SRP-350III', 'Termálna tlačiareň účteniek', 2, 35.00, 25.00, '2024-01-20 15:00:00+02'),
  ('f3333333-3333-3333-3333-333333333f33', 'f3333333-3333-3333-3333-333333333333', '08697508-c814-4b25-aa18-3f757ac8fde9', 'device', 'payment', 'PAX A920 Pro', 'Android POS terminál', 2, 55.00, 45.00, '2024-02-01 09:45:00+02'),
  ('f3333333-3333-3333-3333-333333333f34', 'f3333333-3333-3333-3333-333333333333', '0bb5955a-527a-4d99-894b-6aa35749f4bb', 'service', 'payment', 'Restaurant Gateway', 'Platobná brána pre reštaurácie', 2, 30.00, 20.00, '2024-02-01 09:45:00+02'),
  ('f4444444-4444-4444-4444-444444444f44', 'f4444444-4444-4444-4444-444444444444', '341e7511-ea33-4854-8fd0-97d04a3c9579', 'device', 'payment', 'Ingenico Desk 5000', 'Stolný platobný terminál', 2, 48.00, 38.00, '2024-02-10 17:15:00+02'),
  ('f4444444-4444-4444-4444-444444444f45', 'f4444444-4444-4444-4444-444444444444', '174ac2a9-1747-470f-ad0d-ebed6d8e0e93', 'service', 'ecommerce', 'E-shop Integration', 'Integrácia s e-shopom', 1, 40.00, 30.00, '2024-02-10 17:15:00+02'),
  ('f5555555-5555-5555-5555-555555555f55', 'f5555555-5555-5555-5555-555555555555', 'fabd3c0d-9036-40f6-9877-2adf3d07517b', 'device', 'printing', 'Epson TM-T88VI', 'Profesionálna tlačiareň', 3, 42.00, 32.00, '2024-02-15 11:50:00+02'),
  ('f5555555-5555-5555-5555-555555555f56', 'f5555555-5555-5555-5555-555555555555', '08697508-c814-4b25-aa18-3f757ac8fde9', 'service', 'payment', 'Automotive Gateway', 'Platobná brána pre autoservisy', 1, 28.00, 18.00, '2024-02-15 11:50:00+02'),
  ('f6666666-6666-6666-6666-666666666f66', 'f6666666-6666-6666-6666-666666666666', '0bb5955a-527a-4d99-894b-6aa35749f4bb', 'device', 'payment', 'Verifone VX690', 'Bezdrôtový POS terminál', 1, 52.00, 42.00, '2024-02-20 13:40:00+02'),
  ('f6666666-6666-6666-6666-666666666f67', 'f6666666-6666-6666-6666-666666666666', '341e7511-ea33-4854-8fd0-97d04a3c9579', 'service', 'booking', 'Beauty Booking Pro', 'Rezervačný systém pre salóny', 1, 38.00, 28.00, '2024-02-20 13:40:00+02');