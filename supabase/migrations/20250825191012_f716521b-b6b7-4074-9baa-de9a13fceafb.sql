-- Demo data migration with unique company names and ICO numbers
-- Insert merchants with completely different names
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
  ('f1b2c3d4-5e6f-7890-1234-567890abcdef', 'Digital Wave Slovakia s.r.o.', '98765432', 'SK9876543210', 'SK9876543210', 'Martin Krátky', 'martin.kratky@digitalwave.sk', '+421911111111', 'Dlhá 456', 'Trnava', '91701', '2024-01-15 10:00:00+02'),
  ('f2c3d4e5-6f70-8901-2345-678901bcdef0', 'Commerce Hub a.s.', '87654321', 'SK8765432109', 'SK8765432109', 'Eva Zelená', 'eva.zelena@commercehub.sk', '+421922222222', 'Krátka 789', 'Trenčín', '91100', '2024-01-20 14:30:00+02'),
  ('f3d4e5f6-7081-9012-3456-789012cdef01', 'Food Paradise s.r.o.', '76543210', 'SK7654321098', 'SK7654321098', 'Tomáš Jedlý', 'tomas.jedny@foodparadise.sk', '+421933333333', 'Jedálenská 123', 'Martin', '03601', '2024-02-01 09:15:00+02'),
  ('f4e5f6a7-8192-0123-4567-890123def012', 'Style Studio s.r.o.', '65432109', 'SK6543210987', 'SK6543210987', 'Lucia Módna', 'lucia.modna@stylestudio.sk', '+421944444444', 'Štýlová 654', 'Poprad', '05801', '2024-02-10 16:45:00+02'),
  ('f5f6a7b8-92a3-1234-5678-901234ef0123', 'Motor Expert Plus s.r.o.', '54321098', 'SK5432109876', 'SK5432109876', 'Ján Motorový', 'jan.motorovy@motorexpert.sk', '+421955555555', 'Motorová 987', 'Michalovce', '07101', '2024-02-15 11:20:00+02'),
  ('f6a7b8c9-a3b4-2345-6789-012345f01234', 'Beauty Heaven s.r.o.', '43210987', 'SK4321098765', 'SK4321098765', 'Adriana Pekná', 'adriana.pekna@beautyheaven.sk', '+421966666666', 'Pekná 321', 'Levoča', '05401', '2024-02-20 13:10:00+02');

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
  ('f1111111-1111-1111-1111-111111111111', 'f1b2c3d4-5e6f-7890-1234-567890abcdef', 'ZML-2024-101', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-01-15 10:30:00+02', '2024-01-15 12:00:00+02'),
  ('f2222222-2222-2222-2222-222222222222', 'f2c3d4e5-6f70-8901-2345-678901bcdef0', 'ZML-2024-102', 'approved', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-01-20 15:00:00+02', '2024-01-20 16:30:00+02'),
  ('f3333333-3333-3333-3333-333333333333', 'f3d4e5f6-7081-9012-3456-789012cdef01', 'ZML-2024-103', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-01 09:45:00+02', '2024-02-01 11:15:00+02'),
  ('f4444444-4444-4444-4444-444444444444', 'f4e5f6a7-8192-0123-4567-890123def012', 'ZML-2024-104', 'pending_approval', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-10 17:15:00+02', NULL),
  ('f5555555-5555-5555-5555-555555555555', 'f5f6a7b8-92a3-1234-5678-901234ef0123', 'ZML-2024-105', 'draft', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-15 11:50:00+02', NULL),
  ('f6666666-6666-6666-6666-666666666666', 'f6a7b8c9-a3b4-2345-6789-012345f01234', 'ZML-2024-106', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-20 13:40:00+02', '2024-02-20 15:00:00+02');

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
  ('fa111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', gen_random_uuid(), 'Digital Wave - Hlavná pobočka', true, 'Dlhá 456', 'Trnava', '91701', 'SK9876543210987654', 'Martin Krátky', 'martin.kratky@digitalwave.sk', '+421911111111', 'technology', 60000, 55.50, '08:00-17:00', 'year-round', '2024-01-15 10:30:00+02'),
  ('fb222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', gen_random_uuid(), 'Commerce Hub - Hlavné centrum', true, 'Krátka 789', 'Trenčín', '91100', 'SK8765432109876543', 'Eva Zelená', 'eva.zelena@commercehub.sk', '+421922222222', 'retail', 140000, 42.75, '09:00-20:00', 'year-round', '2024-01-20 15:00:00+02'),
  ('fb222223-2222-2222-2222-222222222223', 'f2222222-2222-2222-2222-222222222222', gen_random_uuid(), 'Commerce Hub - Pobočka centrum', true, 'Obchodná 123', 'Trenčín', '91100', 'SK7654321098765432', 'Igor Obchodný', 'igor.obchodny@commercehub.sk', '+421912222222', 'retail', 90000, 38.90, '10:00-19:00', 'year-round', '2024-01-20 15:00:00+02'),
  ('fc333333-3333-3333-3333-333333333333', 'f3333333-3333-3333-3333-333333333333', gen_random_uuid(), 'Food Paradise - Reštaurácia', true, 'Jedálenská 123', 'Martin', '03601', 'SK6543210987654321', 'Tomáš Jedlý', 'tomas.jedny@foodparadise.sk', '+421933333333', 'food', 85000, 22.50, '10:00-22:00', 'year-round', '2024-02-01 09:45:00+02'),
  ('fc333334-3333-3333-3333-333333333334', 'f3333333-3333-3333-3333-333333333333', gen_random_uuid(), 'Food Paradise - Pizzeria', true, 'Pizzová 456', 'Martin', '03601', 'SK5432109876543210', 'Mário Kuchár', 'mario.kuchar@foodparadise.sk', '+421913333333', 'food', 55000, 15.75, '16:00-24:00', 'year-round', '2024-02-01 09:45:00+02'),
  ('fd444444-4444-4444-4444-444444444444', 'f4444444-4444-4444-4444-444444444444', gen_random_uuid(), 'Style Studio - Showroom', true, 'Štýlová 654', 'Poprad', '05801', 'SK4321098765432109', 'Lucia Módna', 'lucia.modna@stylestudio.sk', '+421944444444', 'fashion', 105000, 95.30, '09:00-18:00', 'seasonal', '2024-02-10 17:15:00+02'),
  ('fe555555-5555-5555-5555-555555555555', 'f5555555-5555-5555-5555-555555555555', gen_random_uuid(), 'Motor Expert - Autoservis', false, 'Motorová 987', 'Michalovce', '07101', 'SK3210987654321098', 'Ján Motorový', 'jan.motorovy@motorexpert.sk', '+421955555555', 'automotive', 130000, 280.00, '07:00-16:00', 'year-round', '2024-02-15 11:50:00+02'),
  ('ff666666-6666-6666-6666-666666666667', 'f6a7b8c9-a3b4-2345-6789-012345f01234', gen_random_uuid(), 'Beauty Heaven - Salón', true, 'Pekná 321', 'Levoča', '05401', 'SK2109876543210987', 'Adriana Pekná', 'adriana.pekna@beautyheaven.sk', '+421966666666', 'beauty', 75000, 52.80, '08:00-19:00', 'year-round', '2024-02-20 13:40:00+02');

-- Insert contract calculations
INSERT INTO public.contract_calculations (
  id,
  contract_id,
  total_monthly_profit,
  monthly_turnover,
  created_at
) VALUES 
  ('fc111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 2800, 60000, '2024-01-15 10:30:00+02'),
  ('fc222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', 7200, 140000, '2024-01-20 15:00:00+02'),
  ('fc333333-3333-3333-3333-333333333333', 'f3333333-3333-3333-3333-333333333333', 5600, 112000, '2024-02-01 09:45:00+02'),
  ('fc444444-4444-4444-4444-444444444444', 'f4444444-4444-4444-4444-444444444444', 5250, 105000, '2024-02-10 17:15:00+02'),
  ('fc555555-5555-5555-5555-555555555555', 'f5555555-5555-5555-5555-555555555555', 6500, 130000, '2024-02-15 11:50:00+02'),
  ('fc666666-6666-6666-6666-666666666666', 'f6666666-6666-6666-6666-666666666666', 3750, 75000, '2024-02-20 13:40:00+02');

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