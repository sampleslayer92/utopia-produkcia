-- Demo data migration with valid contract status values
-- Insert merchants
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
  ('a1b2c3d4-5e6f-7890-1234-567890abcdef', 'Tech Solutions s.r.o.', '12345678', 'SK1234567890', 'SK1234567890', 'Ján Novák', 'jan.novak@techsolutions.sk', '+421901234567', 'Hlavná 123', 'Bratislava', '81000', '2024-01-15 10:00:00+02'),
  ('b2c3d4e5-6f70-8901-2345-678901bcdef0', 'Retail Master a.s.', '23456789', 'SK2345678901', 'SK2345678901', 'Mária Svobodová', 'maria.svoboda@retailmaster.sk', '+421902345678', 'Obchodná 456', 'Košice', '04000', '2024-01-20 14:30:00+02'),
  ('c3d4e5f6-7081-9012-3456-789012cdef01', 'Gastro Express s.r.o.', '34567890', 'SK3456789012', 'SK3456789012', 'Peter Dvořák', 'peter.dvorak@gastroexpress.sk', '+421903456789', 'Reštauračná 789', 'Žilina', '01000', '2024-02-01 09:15:00+02'),
  ('d4e5f6a7-8192-0123-4567-890123def012', 'Fashion Boutique s.r.o.', '45678901', 'SK4567890123', 'SK4567890123', 'Anna Krásna', 'anna.krasna@fashionboutique.sk', '+421904567890', 'Módna 321', 'Nitra', '94900', '2024-02-10 16:45:00+02'),
  ('e5f6a7b8-92a3-1234-5678-901234ef0123', 'Auto Service Plus s.r.o.', '56789012', 'SK5678901234', 'SK5678901234', 'Milan Rychlý', 'milan.rychly@autoserviceplus.sk', '+421905678901', 'Servisná 654', 'Prešov', '08000', '2024-02-15 11:20:00+02'),
  ('f6a7b8c9-a3b4-2345-6789-012345f01234', 'Beauty Salon Luxe s.r.o.', '67890123', 'SK6789012345', 'SK6789012345', 'Zuzana Krásna', 'zuzana.krasna@beautysalonluxe.sk', '+421906789012', 'Krásna 987', 'Banská Bystrica', '97400', '2024-02-20 13:10:00+02');

-- Insert contracts with valid created_by from profiles table and valid status values
INSERT INTO public.contracts (
  id,
  merchant_id,
  contract_number,
  status,
  created_by,
  created_at,
  submitted_at
) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'a1b2c3d4-5e6f-7890-1234-567890abcdef', 'ZML-2024-001', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-01-15 10:30:00+02', '2024-01-15 12:00:00+02'),
  ('22222222-2222-2222-2222-222222222222', 'b2c3d4e5-6f70-8901-2345-678901bcdef0', 'ZML-2024-002', 'approved', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-01-20 15:00:00+02', '2024-01-20 16:30:00+02'),
  ('33333333-3333-3333-3333-333333333333', 'c3d4e5f6-7081-9012-3456-789012cdef01', 'ZML-2024-003', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-01 09:45:00+02', '2024-02-01 11:15:00+02'),
  ('44444444-4444-4444-4444-444444444444', 'd4e5f6a7-8192-0123-4567-890123def012', 'ZML-2024-004', 'pending_approval', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-10 17:15:00+02', NULL),
  ('55555555-5555-5555-5555-555555555555', 'e5f6a7b8-92a3-1234-5678-901234ef0123', 'ZML-2024-005', 'draft', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-15 11:50:00+02', NULL),
  ('66666666-6666-6666-6666-666666666666', 'f6a7b8c9-a3b4-2345-6789-012345f01234', 'ZML-2024-006', 'signed', '2cefd2ed-7236-404d-870c-157b9f4e8e6a', '2024-02-20 13:40:00+02', '2024-02-20 15:00:00+02');

-- Insert business locations
INSERT INTO public.business_locations (
  id,
  contract_id,
  name,
  contact_person_name,
  contact_person_phone,
  address_street,
  address_city,
  address_zip_code,
  estimated_turnover,
  has_pos,
  sector,
  created_at
) VALUES 
  ('aa11aa11-1111-1111-1111-11111111aa11', '11111111-1111-1111-1111-111111111111', 'Tech Solutions - Hlavná pobočka', 'Ján Novák', '+421901234567', 'Hlavná 123', 'Bratislava', '81000', 50000, true, 'technology', '2024-01-15 10:30:00+02'),
  ('bb22bb22-2222-2222-2222-22222222bb22', '22222222-2222-2222-2222-222222222222', 'Retail Master - Centrála', 'Mária Svobodová', '+421902345678', 'Obchodná 456', 'Košice', '04000', 120000, true, 'retail', '2024-01-20 15:00:00+02'),
  ('bb22bb23-2222-2222-2222-22222222bb23', '22222222-2222-2222-2222-222222222222', 'Retail Master - Pobočka 2', 'Eva Nováková', '+421912345678', 'Nákupná 789', 'Košice', '04000', 80000, true, 'retail', '2024-01-20 15:00:00+02'),
  ('cc33cc33-3333-3333-3333-33333333cc33', '33333333-3333-3333-3333-333333333333', 'Gastro Express - Reštaurácia', 'Peter Dvořák', '+421903456789', 'Reštauračná 789', 'Žilina', '01000', 75000, true, 'food', '2024-02-01 09:45:00+02'),
  ('cc33cc34-3333-3333-3333-33333333cc34', '33333333-3333-3333-3333-333333333333', 'Gastro Express - Kaviareň', 'Lucia Kávová', '+421913456789', 'Káviarna 456', 'Žilina', '01000', 45000, true, 'food', '2024-02-01 09:45:00+02'),
  ('dd44dd44-4444-4444-4444-44444444dd44', '44444444-4444-4444-4444-444444444444', 'Fashion Boutique - Showroom', 'Anna Krásna', '+421904567890', 'Módna 321', 'Nitra', '94900', 95000, true, 'fashion', '2024-02-10 17:15:00+02'),
  ('ee55ee55-5555-5555-5555-55555555ee55', '55555555-5555-5555-5555-555555555555', 'Auto Service Plus - Servis', 'Milan Rychlý', '+421905678901', 'Servisná 654', 'Prešov', '08000', 110000, false, 'automotive', '2024-02-15 11:50:00+02'),
  ('ff66ff66-6666-6666-6666-66666666ff66', '66666666-6666-6666-6666-666666666666', 'Beauty Salon Luxe - Salón', 'Zuzana Krásna', '+421906789012', 'Krásna 987', 'Banská Bystrica', '97400', 65000, true, 'beauty', '2024-02-20 13:40:00+02');

-- Insert contract calculations
INSERT INTO public.contract_calculations (
  id,
  contract_id,
  total_monthly_profit,
  monthly_turnover,
  created_at
) VALUES 
  ('ca1c1111-1111-1111-1111-11111111ca1c', '11111111-1111-1111-1111-111111111111', 2500, 50000, '2024-01-15 10:30:00+02'),
  ('ca2c2222-2222-2222-2222-22222222ca2c', '22222222-2222-2222-2222-222222222222', 6000, 120000, '2024-01-20 15:00:00+02'),
  ('ca3c3333-3333-3333-3333-33333333ca3c', '33333333-3333-3333-3333-333333333333', 4800, 96000, '2024-02-01 09:45:00+02'),
  ('ca4c4444-4444-4444-4444-44444444ca4c', '44444444-4444-4444-4444-444444444444', 4750, 95000, '2024-02-10 17:15:00+02'),
  ('ca5c5555-5555-5555-5555-55555555ca5c', '55555555-5555-5555-5555-555555555555', 5500, 110000, '2024-02-15 11:50:00+02'),
  ('ca6c6666-6666-6666-6666-66666666ca6c', '66666666-6666-6666-6666-666666666666', 3250, 65000, '2024-02-20 13:40:00+02');

-- Insert contract items
INSERT INTO public.contract_items (
  id,
  contract_id,
  device_type,
  device_model,
  monthly_fee,
  pos_terminal_id,
  quantity,
  created_at
) VALUES 
  ('it111111-1111-1111-1111-11111111it11', '11111111-1111-1111-1111-111111111111', 'POS_TERMINAL', 'Ingenico Move 5000', 45.00, 'POS001', 2, '2024-01-15 10:30:00+02'),
  ('it111112-1111-1111-1111-11111111it12', '11111111-1111-1111-1111-111111111111', 'PAYMENT_GATEWAY', 'Online Gateway Pro', 25.00, NULL, 1, '2024-01-15 10:30:00+02'),
  ('it222222-2222-2222-2222-22222222it22', '22222222-2222-2222-2222-222222222222', 'POS_TERMINAL', 'Verifone V400m', 50.00, 'POS002', 3, '2024-01-20 15:00:00+02'),
  ('it222223-2222-2222-2222-22222222it23', '22222222-2222-2222-2222-222222222222', 'CASH_REGISTER', 'Samsung SRP-350III', 35.00, NULL, 2, '2024-01-20 15:00:00+02'),
  ('it333333-3333-3333-3333-33333333it33', '33333333-3333-3333-3333-333333333333', 'POS_TERMINAL', 'PAX A920 Pro', 55.00, 'POS003', 2, '2024-02-01 09:45:00+02'),
  ('it333334-3333-3333-3333-33333333it34', '33333333-3333-3333-3333-333333333333', 'PAYMENT_GATEWAY', 'Restaurant Gateway', 30.00, NULL, 2, '2024-02-01 09:45:00+02'),
  ('it444444-4444-4444-4444-44444444it44', '44444444-4444-4444-4444-444444444444', 'POS_TERMINAL', 'Ingenico Desk 5000', 48.00, 'POS004', 2, '2024-02-10 17:15:00+02'),
  ('it444445-4444-4444-4444-44444444it45', '44444444-4444-4444-4444-444444444444', 'E_COMMERCE', 'E-shop Integration', 40.00, NULL, 1, '2024-02-10 17:15:00+02'),
  ('it555555-5555-5555-5555-55555555it55', '55555555-5555-5555-5555-555555555555', 'CASH_REGISTER', 'Epson TM-T88VI', 42.00, NULL, 3, '2024-02-15 11:50:00+02'),
  ('it555556-5555-5555-5555-55555555it56', '55555555-5555-5555-5555-555555555555', 'PAYMENT_GATEWAY', 'Automotive Gateway', 28.00, NULL, 1, '2024-02-15 11:50:00+02'),
  ('it666666-6666-6666-6666-66666666it66', '66666666-6666-6666-6666-666666666666', 'POS_TERMINAL', 'Verifone VX690', 52.00, 'POS005', 1, '2024-02-20 13:40:00+02'),
  ('it666667-6666-6666-6666-66666666it67', '66666666-6666-6666-6666-666666666666', 'APPOINTMENT_SYSTEM', 'Beauty Booking Pro', 38.00, NULL, 1, '2024-02-20 13:40:00+02');

-- Insert device selections for contract items
INSERT INTO public.device_selections (
  id,
  contract_item_id,
  device_type,
  device_model,
  monthly_fee,
  created_at
) VALUES 
  ('dv111111-1111-1111-1111-11111111dv11', 'it111111-1111-1111-1111-11111111it11', 'POS_TERMINAL', 'Ingenico Move 5000', 45.00, '2024-01-15 10:30:00+02'),
  ('dv111112-1111-1111-1111-11111111dv12', 'it111112-1111-1111-1111-11111111it12', 'PAYMENT_GATEWAY', 'Online Gateway Pro', 25.00, '2024-01-15 10:30:00+02'),
  ('dv222222-2222-2222-2222-22222222dv22', 'it222222-2222-2222-2222-22222222it22', 'POS_TERMINAL', 'Verifone V400m', 50.00, '2024-01-20 15:00:00+02'),
  ('dv222223-2222-2222-2222-22222222dv23', 'it222223-2222-2222-2222-22222222it23', 'CASH_REGISTER', 'Samsung SRP-350III', 35.00, '2024-01-20 15:00:00+02'),
  ('dv333333-3333-3333-3333-33333333dv33', 'it333333-3333-3333-3333-33333333it33', 'POS_TERMINAL', 'PAX A920 Pro', 55.00, '2024-02-01 09:45:00+02'),
  ('dv333334-3333-3333-3333-33333333dv34', 'it333334-3333-3333-3333-33333333it34', 'PAYMENT_GATEWAY', 'Restaurant Gateway', 30.00, '2024-02-01 09:45:00+02'),
  ('dv444444-4444-4444-4444-44444444dv44', 'it444444-4444-4444-4444-44444444it44', 'POS_TERMINAL', 'Ingenico Desk 5000', 48.00, '2024-02-10 17:15:00+02'),
  ('dv444445-4444-4444-4444-44444444dv45', 'it444445-4444-4444-4444-44444444it45', 'E_COMMERCE', 'E-shop Integration', 40.00, '2024-02-10 17:15:00+02'),
  ('dv555555-5555-5555-5555-55555555dv55', 'it555555-5555-5555-5555-55555555it55', 'CASH_REGISTER', 'Epson TM-T88VI', 42.00, '2024-02-15 11:50:00+02'),
  ('dv555556-5555-5555-5555-55555555dv56', 'it555556-5555-5555-5555-55555555it56', 'PAYMENT_GATEWAY', 'Automotive Gateway', 28.00, '2024-02-15 11:50:00+02'),
  ('dv666666-6666-6666-6666-66666666dv66', 'it666666-6666-6666-6666-66666666it66', 'POS_TERMINAL', 'Verifone VX690', 52.00, '2024-02-20 13:40:00+02'),
  ('dv666667-6666-6666-6666-66666666dv67', 'it666667-6666-6666-6666-66666666it67', 'APPOINTMENT_SYSTEM', 'Beauty Booking Pro', 38.00, '2024-02-20 13:40:00+02');