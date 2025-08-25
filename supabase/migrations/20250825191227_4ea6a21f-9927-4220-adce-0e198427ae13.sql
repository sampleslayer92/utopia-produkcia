-- Insert business locations for the new contracts
INSERT INTO public.business_locations (
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
  ('a08e5776-989b-4b9e-9c79-5510590535c6', gen_random_uuid(), 'Nova Tech - Hlavné sídlo', true, 'Novotechnicka 111', 'Bratislava', '83000', 'SK9876543210987654', 'Pavel Technický', 'pavel.technicky@novatech.sk', '+421977777777', 'technology', 60000, 55.50, '08:00-17:00', 'year-round', '2024-01-15 10:30:00+02'),
  ('aa9d64ac-cc6c-4efb-b622-61daabc37e58', gen_random_uuid(), 'Prime Retail - Centrum', true, 'Predajná 222', 'Košice', '04100', 'SK8765432109876543', 'Dana Predajná', 'dana.predajna@primeretail.sk', '+421988888888', 'retail', 140000, 42.75, '09:00-20:00', 'year-round', '2024-01-20 15:00:00+02'),
  ('aa9d64ac-cc6c-4efb-b622-61daabc37e58', gen_random_uuid(), 'Prime Retail - Pobočka 2', true, 'Obchodná 888', 'Košice', '04100', 'SK7654321098765432', 'Martina Obchodná', 'martina.obchodna@primeretail.sk', '+421912888888', 'retail', 90000, 38.90, '10:00-19:00', 'year-round', '2024-01-20 15:00:00+02'),
  ('bdd0a183-ddb8-4138-af3a-173074157725', gen_random_uuid(), 'Fresh Food - Reštaurácia', true, 'Kuchynská 333', 'Žilina', '01100', 'SK6543210987654321', 'Štefan Kuchynský', 'stefan.kuchynsky@freshfood.sk', '+421999999999', 'food', 85000, 22.50, '10:00-22:00', 'year-round', '2024-02-01 09:45:00+02'),
  ('bdd0a183-ddb8-4138-af3a-173074157725', gen_random_uuid(), 'Fresh Food - Pizzeria', true, 'Pizzová 777', 'Žilina', '01100', 'SK5432109876543210', 'Andrea Pizza', 'andrea.pizza@freshfood.sk', '+421913999999', 'food', 55000, 15.75, '16:00-24:00', 'year-round', '2024-02-01 09:45:00+02'),
  ('f365a705-097b-4ea1-8bc4-628718673e81', gen_random_uuid(), 'Elegant Fashion - Showroom', true, 'Elegantná 444', 'Nitra', '95000', 'SK4321098765432109', 'Viera Elegantná', 'viera.elegantna@elegantfashion.sk', '+421900000000', 'fashion', 105000, 95.30, '09:00-18:00', 'seasonal', '2024-02-10 17:15:00+02'),
  ('021b38ca-3434-4ba7-9cfa-d130e8612839', gen_random_uuid(), 'Speed Motors - Autoservis', false, 'Rýchla 555', 'Prešov', '08100', 'SK3210987654321098', 'Robert Rýchly', 'robert.rychly@speedmotors.sk', '+421901111111', 'automotive', 130000, 280.00, '07:00-16:00', 'year-round', '2024-02-15 11:50:00+02'),
  ('60139de8-744d-4a75-80b0-601e4cc001ea', gen_random_uuid(), 'Luxury Beauty - Wellness', true, 'Luxusná 666', 'Banská Bystrica', '97500', 'SK2109876543210987', 'Silvia Luxusná', 'silvia.luxusna@luxurybeauty.sk', '+421902222222', 'beauty', 75000, 52.80, '08:00-19:00', 'year-round', '2024-02-20 13:40:00+02');

-- Insert contract calculations
INSERT INTO public.contract_calculations (
  contract_id,
  total_monthly_profit,
  monthly_turnover,
  created_at
) VALUES 
  ('a08e5776-989b-4b9e-9c79-5510590535c6', 2800, 60000, '2024-01-15 10:30:00+02'),
  ('aa9d64ac-cc6c-4efb-b622-61daabc37e58', 7200, 140000, '2024-01-20 15:00:00+02'),
  ('bdd0a183-ddb8-4138-af3a-173074157725', 5600, 112000, '2024-02-01 09:45:00+02'),
  ('f365a705-097b-4ea1-8bc4-628718673e81', 5250, 105000, '2024-02-10 17:15:00+02'),
  ('021b38ca-3434-4ba7-9cfa-d130e8612839', 6500, 130000, '2024-02-15 11:50:00+02'),
  ('60139de8-744d-4a75-80b0-601e4cc001ea', 3750, 75000, '2024-02-20 13:40:00+02');

-- Insert contract items with warehouse_item_id references
INSERT INTO public.contract_items (
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
  ('a08e5776-989b-4b9e-9c79-5510590535c6', '0bb5955a-527a-4d99-894b-6aa35749f4bb', 'device', 'payment', 'Ingenico Move 5000', 'Mobilný POS terminál', 2, 45.00, 35.00, '2024-01-15 10:30:00+02'),
  ('a08e5776-989b-4b9e-9c79-5510590535c6', '341e7511-ea33-4854-8fd0-97d04a3c9579', 'service', 'payment', 'Online Gateway Pro', 'Platobná brána', 1, 25.00, 15.00, '2024-01-15 10:30:00+02'),
  ('aa9d64ac-cc6c-4efb-b622-61daabc37e58', '174ac2a9-1747-470f-ad0d-ebed6d8e0e93', 'device', 'payment', 'Verifone V400m', 'Stolný POS terminál', 3, 50.00, 40.00, '2024-01-20 15:00:00+02'),
  ('aa9d64ac-cc6c-4efb-b622-61daabc37e58', 'fabd3c0d-9036-40f6-9877-2adf3d07517b', 'device', 'printing', 'Samsung SRP-350III', 'Termálna tlačiareň', 2, 35.00, 25.00, '2024-01-20 15:00:00+02'),
  ('bdd0a183-ddb8-4138-af3a-173074157725', '08697508-c814-4b25-aa18-3f757ac8fde9', 'device', 'payment', 'PAX A920 Pro', 'Android POS terminál', 2, 55.00, 45.00, '2024-02-01 09:45:00+02'),
  ('bdd0a183-ddb8-4138-af3a-173074157725', '0bb5955a-527a-4d99-894b-6aa35749f4bb', 'service', 'payment', 'Restaurant Gateway', 'Platobná brána pre reštaurácie', 1, 30.00, 20.00, '2024-02-01 09:45:00+02'),
  ('f365a705-097b-4ea1-8bc4-628718673e81', '341e7511-ea33-4854-8fd0-97d04a3c9579', 'device', 'payment', 'Ingenico Desk 5000', 'Stolný terminál', 2, 48.00, 38.00, '2024-02-10 17:15:00+02'),
  ('f365a705-097b-4ea1-8bc4-628718673e81', '174ac2a9-1747-470f-ad0d-ebed6d8e0e93', 'service', 'ecommerce', 'E-shop Integration', 'E-shop integrácia', 1, 40.00, 30.00, '2024-02-10 17:15:00+02'),
  ('021b38ca-3434-4ba7-9cfa-d130e8612839', 'fabd3c0d-9036-40f6-9877-2adf3d07517b', 'device', 'printing', 'Epson TM-T88VI', 'Profesionálna tlačiareň', 2, 42.00, 32.00, '2024-02-15 11:50:00+02'),
  ('021b38ca-3434-4ba7-9cfa-d130e8612839', '08697508-c814-4b25-aa18-3f757ac8fde9', 'service', 'payment', 'Automotive Gateway', 'Platobná brána pre autoservisy', 1, 28.00, 18.00, '2024-02-15 11:50:00+02'),
  ('60139de8-744d-4a75-80b0-601e4cc001ea', '0bb5955a-527a-4d99-894b-6aa35749f4bb', 'device', 'payment', 'Verifone VX690', 'Bezdrôtový POS terminál', 1, 52.00, 42.00, '2024-02-20 13:40:00+02'),
  ('60139de8-744d-4a75-80b0-601e4cc001ea', '341e7511-ea33-4854-8fd0-97d04a3c9579', 'service', 'booking', 'Beauty Booking Pro', 'Rezervačný systém', 1, 38.00, 28.00, '2024-02-20 13:40:00+02');