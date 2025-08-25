-- Demo data migration using gen_random_uuid() for all IDs
-- Insert merchants with auto-generated UUIDs
INSERT INTO public.merchants (
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
  ('Nova Tech Solutions s.r.o.', '11122233', 'SK1112223344', 'SK1112223344', 'Pavel Technický', 'pavel.technicky@novatech.sk', '+421977777777', 'Novotechnicka 111', 'Bratislava', '83000', '2024-01-15 10:00:00+02'),
  ('Prime Retail s.r.o.', '22233344', 'SK2223334455', 'SK2223334455', 'Dana Predajná', 'dana.predajna@primeretail.sk', '+421988888888', 'Predajná 222', 'Košice', '04100', '2024-01-20 14:30:00+02'),
  ('Fresh Food Group s.r.o.', '33344455', 'SK3334445566', 'SK3334445566', 'Štefan Kuchynský', 'stefan.kuchynsky@freshfood.sk', '+421999999999', 'Kuchynská 333', 'Žilina', '01100', '2024-02-01 09:15:00+02'),
  ('Elegant Fashion s.r.o.', '44455566', 'SK4445556677', 'SK4445556677', 'Viera Elegantná', 'viera.elegantna@elegantfashion.sk', '+421900000000', 'Elegantná 444', 'Nitra', '95000', '2024-02-10 16:45:00+02'),
  ('Speed Motors s.r.o.', '55566677', 'SK5556667788', 'SK5556667788', 'Robert Rýchly', 'robert.rychly@speedmotors.sk', '+421901111111', 'Rýchla 555', 'Prešov', '08100', '2024-02-15 11:20:00+02'),
  ('Luxury Beauty s.r.o.', '66677788', 'SK6667778899', 'SK6667778899', 'Silvia Luxusná', 'silvia.luxusna@luxurybeauty.sk', '+421902222222', 'Luxusná 666', 'Banská Bystrica', '97500', '2024-02-20 13:10:00+02')
RETURNING id, company_name;