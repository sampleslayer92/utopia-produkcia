
-- DIAGNOSTIKA A POSTUPNÉ NAPLNENIE DATABÁZY
-- Krok 1: Skontrolovať a dočasne upraviť RLS politiky pre migráciu

-- Najprv skontrolujme aktuálny stav
SELECT 'Current merchants count:' as info, COUNT(*) as count FROM merchants
UNION ALL
SELECT 'Current contracts count:', COUNT(*) FROM contracts
UNION ALL
SELECT 'Contracts with merchants:', COUNT(*) FROM contracts WHERE merchant_id IS NOT NULL;

-- Dočasne povoliť všetkým vkladanie do merchants (pre migráciu)
DROP POLICY IF EXISTS "Anyone can view merchants" ON merchants;
DROP POLICY IF EXISTS "Authenticated users can create merchants" ON merchants;

CREATE POLICY "Allow all for migration" ON merchants FOR ALL USING (true) WITH CHECK (true);

-- Vytvoriť nových realistických slovenských merchantov
INSERT INTO merchants (
    company_name, ico, dic, vat_number, 
    contact_person_name, contact_person_email, contact_person_phone,
    address_street, address_city, address_zip_code
) VALUES
('Tesco Stores SR, a.s.', '31321828', '2020317643', 'SK2020317643', 
 'Ján Novák', 'jan.novak@tesco.sk', '+421905123456', 
 'Metodova 6', 'Bratislava', '82108'),

('LIDL Slovenská republika, v.o.s.', '35799417', '2020216726', 'SK2020216726', 
 'Mária Svobodová', 'maria.svobodova@lidl.sk', '+421905234567', 
 'Röntgenova 26', 'Bratislava', '85101'),

('Reštaurácia U Slona', '52485421', '2120485421', NULL, 
 'Anna Novotná', 'anna.novotna@uslona.sk', '+421905678901', 
 'Hlavné námestie 12', 'Košice', '04001'),

('Café Central', '45123789', '2120123789', NULL, 
 'Zuzana Kratochvílová', 'zuzana@cafecentral.sk', '+421905890123', 
 'Obchodná 15', 'Bratislava', '81106'),

('Autoservis MOTOR s.r.o.', '47852963', '2120852963', 'SK2120852963', 
 'Róbert Šimko', 'robert.simko@motor.sk', '+421905901234', 
 'Priemyselná 22', 'Trenčín', '91101'),

('Lekáreň ZDRAVIE', '46789123', '2120789123', NULL, 
 'PharmDr. Alena Krejčová', 'alena.krejcova@zdravie.sk', '+421906012345', 
 'Námestie SNP 8', 'Banská Bystrica', '97401'),

('Hotel GRAND', '49654321', '2120654321', 'SK2120654321', 
 'Martin Procházka', 'martin.prochazka@hotelgrand.sk', '+421906123456', 
 'Hviezdoslavovo námestie 3', 'Bratislava', '81102'),

('Pizzeria MAMA MIA', '44963852', '2120963852', NULL, 
 'Giuseppe Romano', 'giuseppe@mamamia.sk', '+421906567890', 
 'Špitálska 20', 'Bratislava', '81108'),

('Potraviny FRESH s.r.o.', '50741852', '2120741852', 'SK2120741852', 
 'Ľubomír Gajdoš', 'lubomir.gajdos@fresh.sk', '+421906456789', 
 'Bojnická 12', 'Prievidza', '97101'),

('Kvetinárstvo RUŽA', '41753951', '2120753951', NULL, 
 'Helena Bartošová', 'helena@ruza.sk', '+421906789012', 
 'Mudroňova 15', 'Košice', '04011');

-- Overiť že sa merchantovia vytvorili
SELECT 'New merchants created:' as info, COUNT(*) as count 
FROM merchants 
WHERE company_name IN ('Tesco Stores SR, a.s.', 'LIDL Slovenská republika, v.o.s.');

-- Obnoviť pôvodné RLS politiky
DROP POLICY "Allow all for migration" ON merchants;

CREATE POLICY "Anyone can view merchants" ON merchants FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create merchants" ON merchants FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update merchants" ON merchants FOR UPDATE USING (true);
CREATE POLICY "Admins can delete merchants" ON merchants FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all merchants" ON merchants FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Merchants can view their own data" ON merchants FOR SELECT USING (has_role(auth.uid(), 'merchant'::app_role) AND contact_person_email = auth.email());
