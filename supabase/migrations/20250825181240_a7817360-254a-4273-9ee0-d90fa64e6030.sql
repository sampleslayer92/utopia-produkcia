
-- Reset existing data partially and add realistic test data
BEGIN;

-- 1. CREATE REALISTIC MERCHANTS (Slovak companies)
INSERT INTO merchants (company_name, ico, dic, vat_number, contact_person_name, contact_person_email, contact_person_phone, address_street, address_city, address_zip_code, created_at) VALUES
('Tesco Stores SR, a.s.', '31321828', '2020317643', 'SK2020317643', 'Ján Novák', 'jan.novak@tesco.sk', '+421905123456', 'Metodova 6', 'Bratislava', '82108', '2024-01-15 10:30:00'),
('LIDL Slovenská republika, v.o.s.', '35799417', '2020216726', 'SK2020216726', 'Mária Svobodová', 'maria.svobodova@lidl.sk', '+421905234567', 'Röntgenova 26', 'Bratislava', '85101', '2024-02-10 14:20:00'),
('Slovenská pošta, a.s.', '36631124', '2022287249', 'SK2022287249', 'Peter Kováč', 'peter.kovac@posta.sk', '+421905345678', 'Partizánska cesta 9', 'Bratislava', '97542', '2024-01-25 09:15:00'),
('Orange Slovensko, a.s.', '35697270', '2020270983', 'SK2020270983', 'Eva Horváthová', 'eva.horvathova@orange.sk', '+421905456789', 'Metodova 8', 'Bratislava', '82108', '2024-03-05 11:45:00'),
('KAUFLAND Slovenská republika v.o.s.', '35723505', '2020235956', 'SK2020235956', 'Tomáš Balog', 'tomas.balog@kaufland.sk', '+421905567890', 'Einsteinova 18', 'Bratislava', '85101', '2024-02-20 16:30:00'),
('Reštaurácia U Slona', '52485421', '2120485421', '', 'Anna Novotná', 'anna.novotna@uslona.sk', '+421905678901', 'Hlavné námestie 12', 'Košice', '04001', '2024-03-15 08:00:00'),
('Fitko Gym s.r.o.', '48956321', '2120956321', 'SK2120956321', 'Milan Hrubý', 'milan.hruby@fitko.sk', '+421905789012', 'Športová 5', 'Žilina', '01001', '2024-04-01 12:00:00'),
('Café Central', '45123789', '2120123789', '', 'Zuzana Kratochvílová', 'zuzana@cafecentral.sk', '+421905890123', 'Obchodná 15', 'Bratislava', '81106', '2024-03-20 07:30:00'),
('Autoservis MOTOR s.r.o.', '47852963', '2120852963', 'SK2120852963', 'Róbert Šimko', 'robert.simko@motor.sk', '+421905901234', 'Priemyselná 22', 'Trenčín', '91101', '2024-02-28 15:45:00'),
('Lekáreň ZDRAVIE', '46789123', '2120789123', '', 'PharmDr. Alena Krejčová', 'alena.krejcova@zdravie.sk', '+421906012345', 'Námestie SNP 8', 'Banská Bystrica', '97401', '2024-04-10 13:20:00'),
('Hotel GRAND', '49654321', '2120654321', 'SK2120654321', 'Martin Procházka', 'martin.prochazka@hotelgrand.sk', '+421906123456', 'Hviezdoslavovo námestie 3', 'Bratislava', '81102', '2024-01-30 10:00:00'),
('Cukráreň SLADKÝ SEN', '43987654', '2120987654', '', 'Daniela Michalková', 'daniela@sladkysen.sk', '+421906234567', 'Tolstého 5', 'Prešov', '08001', '2024-03-25 14:15:00'),
('Kaderníctvo STYLE', '42135798', '2120135798', '', 'Veronika Plačková', 'veronika@style.sk', '+421906345678', 'Mlynské nivy 10', 'Bratislava', '82109', '2024-04-05 11:30:00'),
('Potraviny FRESH s.r.o.', '50741852', '2120741852', 'SK2120741852', 'Ľubomír Gajdoš', 'lubomir.gajdos@fresh.sk', '+421906456789', 'Bojnická 12', 'Prievidza', '97101', '2024-02-15 09:45:00'),
('Pizzeria MAMA MIA', '44963852', '2120963852', '', 'Giuseppe Romano', 'giuseppe@mamamia.sk', '+421906567890', 'Špitálska 20', 'Bratislava', '81108', '2024-03-10 18:00:00'),
('Elektro SERVIS s.r.o.', '48159753', '2120159753', 'SK2120159753', 'Michal Horník', 'michal.hornik@elektro.sk', '+421906678901', 'Továrenská 8', 'Nitra', '94901', '2024-02-05 16:20:00'),
('Kvetinárstvo RUŽA', '41753951', '2120753951', '', 'Helena Bartošová', 'helena@ruza.sk', '+421906789012', 'Mudroňova 15', 'Košice', '04011', '2024-04-15 10:10:00'),
('Čistiareň PERFECT', '45896147', '2120896147', '', 'Vladimír Tokár', 'vladimir@perfect.sk', '+421906890123', 'Radlinského 7', 'Bratislava', '81107', '2024-03-28 13:40:00');

-- 2. CREATE BUSINESS LOCATIONS FOR MERCHANTS
INSERT INTO business_locations (contract_id, location_id, name, has_pos, address_street, address_city, address_zip_code, iban, contact_person_name, contact_person_email, contact_person_phone, business_sector, estimated_turnover, average_transaction, opening_hours, seasonality, seasonal_weeks, created_at) 
SELECT 
    c.id as contract_id,
    gen_random_uuid() as location_id,
    CASE 
        WHEN m.company_name LIKE '%Tesco%' THEN m.company_name || ' - Hlavná predajňa'
        WHEN m.company_name LIKE '%LIDL%' THEN m.company_name || ' - Centrum'
        WHEN m.company_name LIKE '%pošta%' THEN m.company_name || ' - Pobočka ' || m.address_city
        ELSE m.company_name || ' - Hlavná pobočka'
    END as name,
    CASE 
        WHEN m.company_name LIKE '%Reštaurácia%' OR m.company_name LIKE '%Café%' OR m.company_name LIKE '%Pizzeria%' THEN true
        WHEN m.company_name LIKE '%Tesco%' OR m.company_name LIKE '%LIDL%' OR m.company_name LIKE '%KAUFLAND%' THEN true
        WHEN m.company_name LIKE '%Lekáreň%' OR m.company_name LIKE '%Potraviny%' THEN true
        ELSE (random() > 0.4)::boolean
    END as has_pos,
    m.address_street,
    m.address_city,
    m.address_zip_code,
    'SK' || lpad(floor(random() * 10000000000000000)::text, 16, '0') as iban,
    m.contact_person_name,
    m.contact_person_email,
    m.contact_person_phone,
    CASE 
        WHEN m.company_name LIKE '%Tesco%' OR m.company_name LIKE '%LIDL%' OR m.company_name LIKE '%KAUFLAND%' THEN 'Maloobchod - potraviny'
        WHEN m.company_name LIKE '%Reštaurácia%' OR m.company_name LIKE '%Café%' OR m.company_name LIKE '%Pizzeria%' THEN 'Gastronómia'
        WHEN m.company_name LIKE '%Hotel%' THEN 'Ubytovanie'
        WHEN m.company_name LIKE '%Fitko%' THEN 'Šport a rekreácia'
        WHEN m.company_name LIKE '%Lekáreň%' THEN 'Zdravotníctvo'
        WHEN m.company_name LIKE '%Autoservis%' OR m.company_name LIKE '%Elektro%' THEN 'Služby - opravy'
        WHEN m.company_name LIKE '%Kaderníctvo%' OR m.company_name LIKE '%Čistiareň%' THEN 'Služby - osobné'
        WHEN m.company_name LIKE '%pošta%' OR m.company_name LIKE '%Orange%' THEN 'Telekomunikácie'
        ELSE 'Ostatné'
    END as business_sector,
    CASE 
        WHEN m.company_name LIKE '%Tesco%' OR m.company_name LIKE '%LIDL%' OR m.company_name LIKE '%KAUFLAND%' THEN floor(random() * 40000 + 25000)::numeric
        WHEN m.company_name LIKE '%Hotel%' THEN floor(random() * 30000 + 15000)::numeric
        WHEN m.company_name LIKE '%Reštaurácia%' OR m.company_name LIKE '%Pizzeria%' THEN floor(random() * 20000 + 8000)::numeric
        WHEN m.company_name LIKE '%pošta%' OR m.company_name LIKE '%Orange%' THEN floor(random() * 35000 + 20000)::numeric
        WHEN m.company_name LIKE '%Autoservis%' THEN floor(random() * 15000 + 5000)::numeric
        ELSE floor(random() * 10000 + 2000)::numeric
    END as estimated_turnover,
    CASE 
        WHEN m.company_name LIKE '%Tesco%' OR m.company_name LIKE '%LIDL%' OR m.company_name LIKE '%KAUFLAND%' THEN floor(random() * 30 + 15)::numeric
        WHEN m.company_name LIKE '%Hotel%' THEN floor(random() * 200 + 80)::numeric
        WHEN m.company_name LIKE '%Reštaurácia%' OR m.company_name LIKE '%Café%' OR m.company_name LIKE '%Pizzeria%' THEN floor(random() * 25 + 12)::numeric
        WHEN m.company_name LIKE '%Autoservis%' OR m.company_name LIKE '%Elektro%' THEN floor(random() * 150 + 50)::numeric
        ELSE floor(random() * 40 + 10)::numeric
    END as average_transaction,
    CASE 
        WHEN m.company_name LIKE '%Tesco%' OR m.company_name LIKE '%LIDL%' OR m.company_name LIKE '%KAUFLAND%' THEN 'Po-Ne 8:00-22:00'
        WHEN m.company_name LIKE '%Reštaurácia%' OR m.company_name LIKE '%Pizzeria%' THEN 'Po-Ne 11:00-23:00'
        WHEN m.company_name LIKE '%Café%' THEN 'Po-Pi 7:00-18:00, So-Ne 9:00-16:00'
        WHEN m.company_name LIKE '%Hotel%' THEN '24/7'
        WHEN m.company_name LIKE '%Lekáreň%' THEN 'Po-Pi 8:00-18:00, So 8:00-12:00'
        ELSE 'Po-Pi 8:00-17:00'
    END as opening_hours,
    CASE 
        WHEN m.company_name LIKE '%Hotel%' OR m.company_name LIKE '%Reštaurácia%' THEN 'seasonal'::seasonality_type
        ELSE 'year_round'::seasonality_type
    END as seasonality,
    CASE 
        WHEN m.company_name LIKE '%Hotel%' OR m.company_name LIKE '%Reštaurácia%' THEN floor(random() * 15 + 10)::integer
        ELSE NULL
    END as seasonal_weeks,
    m.created_at
FROM contracts c
JOIN merchants m ON true -- Cross join to create locations for all merchants
WHERE c.merchant_id IS NULL -- Only for contracts without merchants yet
LIMIT 45; -- Create about 45 locations

-- 3. LINK CONTRACTS TO MERCHANTS AND SET REALISTIC STATUSES
WITH contract_merchant_assignments AS (
    SELECT 
        c.id as contract_id,
        m.id as merchant_id,
        ROW_NUMBER() OVER (ORDER BY c.created_at) as rn,
        COUNT(*) OVER () as total_contracts
    FROM contracts c
    CROSS JOIN (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as merchant_rn
        FROM merchants 
        WHERE company_name NOT IN ('Admin Merchant', 'Test Merchant')
    ) m
    WHERE c.merchant_id IS NULL
),
status_distribution AS (
    SELECT 
        contract_id,
        merchant_id,
        CASE 
            WHEN (rn::float / total_contracts) <= 0.20 THEN 'draft'
            WHEN (rn::float / total_contracts) <= 0.50 THEN 'submitted'
            WHEN (rn::float / total_contracts) <= 0.75 THEN 'approved'
            WHEN (rn::float / total_contracts) <= 0.90 THEN 'signed'
            WHEN (rn::float / total_contracts) <= 0.97 THEN 'lost'
            ELSE 'rejected'
        END as new_status,
        CASE 
            WHEN (rn::float / total_contracts) <= 0.50 THEN current_step
            WHEN (rn::float / total_contracts) <= 0.75 THEN 7
            ELSE current_step
        END as new_step
    FROM contract_merchant_assignments cma
    JOIN contracts c ON c.id = cma.contract_id
    WHERE (cma.rn - 1) % 4 = (cma.merchant_id::text::bytea)[1] % 4 -- Distribute evenly
)
UPDATE contracts 
SET 
    merchant_id = sd.merchant_id,
    status = sd.new_status::contract_status,
    current_step = sd.new_step,
    submitted_at = CASE 
        WHEN sd.new_status IN ('submitted', 'approved', 'signed') 
        THEN created_at + interval '2 days' + (random() * interval '5 days')
        ELSE NULL 
    END,
    signed_at = CASE 
        WHEN sd.new_status = 'signed' 
        THEN created_at + interval '10 days' + (random() * interval '15 days')
        ELSE NULL 
    END,
    lost_reason = CASE 
        WHEN sd.new_status = 'lost' 
        THEN (ARRAY['price_too_high', 'chose_competitor', 'not_ready', 'no_response'])[floor(random() * 4 + 1)]
        ELSE NULL 
    END,
    updated_at = now()
FROM status_distribution sd
WHERE contracts.id = sd.contract_id;

-- 4. CREATE CONTRACT CALCULATIONS FOR APPROVED/SIGNED CONTRACTS
INSERT INTO contract_calculations (
    contract_id, 
    monthly_turnover, 
    total_customer_payments, 
    total_company_costs, 
    effective_regulated, 
    effective_unregulated, 
    regulated_fee, 
    unregulated_fee, 
    transaction_margin, 
    service_margin, 
    total_monthly_profit,
    calculation_data
)
SELECT 
    c.id,
    bl.estimated_turnover as monthly_turnover,
    (bl.estimated_turnover * 0.025)::numeric as total_customer_payments, -- 2.5% payment processing
    (bl.estimated_turnover * 0.015)::numeric as total_company_costs, -- 1.5% company costs
    (bl.estimated_turnover * 0.6)::numeric as effective_regulated, -- 60% regulated cards
    (bl.estimated_turnover * 0.4)::numeric as effective_unregulated, -- 40% unregulated
    (bl.estimated_turnover * 0.008)::numeric as regulated_fee, -- 0.8% regulated fee
    (bl.estimated_turnover * 0.012)::numeric as unregulated_fee, -- 1.2% unregulated fee
    (bl.estimated_turnover * 0.005)::numeric as transaction_margin, -- 0.5% transaction margin
    (bl.estimated_turnover * 0.005)::numeric as service_margin, -- 0.5% service margin
    (bl.estimated_turnover * 0.01)::numeric as total_monthly_profit, -- 1% total profit
    jsonb_build_object(
        'customer_breakdown', jsonb_build_object(
            'payment_processing', (bl.estimated_turnover * 0.02)::numeric,
            'transaction_fees', (bl.estimated_turnover * 0.005)::numeric
        ),
        'company_breakdown', jsonb_build_object(
            'equipment_costs', (bl.estimated_turnover * 0.008)::numeric,
            'service_costs', (bl.estimated_turnover * 0.007)::numeric
        )
    ) as calculation_data
FROM contracts c
JOIN business_locations bl ON bl.contract_id = c.id
WHERE c.status IN ('approved', 'signed')
AND NOT EXISTS (SELECT 1 FROM contract_calculations cc WHERE cc.contract_id = c.id);

-- 5. CREATE CONTRACT ITEMS (DEVICES AND SERVICES)
INSERT INTO contract_items (
    contract_id, 
    item_id, 
    item_type, 
    category, 
    name, 
    description, 
    count, 
    monthly_fee, 
    company_cost
)
SELECT 
    c.id as contract_id,
    gen_random_uuid() as item_id,
    'device' as item_type,
    CASE 
        WHEN bl.has_pos THEN 'pos_terminal'
        ELSE 'software'
    END as category,
    CASE 
        WHEN bl.has_pos AND random() < 0.6 THEN 'PAX A920 Pro'
        WHEN bl.has_pos AND random() < 0.8 THEN 'PAX A80'
        WHEN bl.has_pos THEN 'Tablet POS 15"'
        WHEN random() < 0.5 THEN 'SoftPOS Tablet 10"'
        ELSE 'E-commerce Gateway'
    END as name,
    CASE 
        WHEN bl.has_pos THEN 'Mobilný platobný terminál'
        ELSE 'Softvérové riešenie pre platby'
    END as description,
    CASE 
        WHEN bl.estimated_turnover > 20000 THEN floor(random() * 3 + 2)::integer
        ELSE 1
    END as count,
    CASE 
        WHEN bl.has_pos AND bl.estimated_turnover > 20000 THEN floor(random() * 20 + 35)::numeric
        WHEN bl.has_pos THEN floor(random() * 15 + 25)::numeric
        ELSE floor(random() * 10 + 15)::numeric
    END as monthly_fee,
    CASE 
        WHEN bl.has_pos THEN floor(random() * 15 + 20)::numeric
        ELSE floor(random() * 8 + 10)::numeric
    END as company_cost
FROM contracts c
JOIN business_locations bl ON bl.contract_id = c.id
WHERE c.status IN ('submitted', 'approved', 'signed')
AND NOT EXISTS (SELECT 1 FROM contract_items ci WHERE ci.contract_id = c.id);

-- Add additional service items for some contracts
INSERT INTO contract_items (
    contract_id, 
    item_id, 
    item_type, 
    category, 
    name, 
    description, 
    count, 
    monthly_fee, 
    company_cost
)
SELECT 
    c.id as contract_id,
    gen_random_uuid() as item_id,
    'service' as item_type,
    'support' as category,
    (ARRAY['24/7 Podpora', 'Technická podpora', 'Výmena zariadenia', 'Reporting služby'])[floor(random() * 4 + 1)] as name,
    'Doplnková služba' as description,
    1 as count,
    floor(random() * 15 + 5)::numeric as monthly_fee,
    floor(random() * 8 + 3)::numeric as company_cost
FROM contracts c
JOIN business_locations bl ON bl.contract_id = c.id
WHERE c.status IN ('approved', 'signed')
AND random() < 0.4 -- 40% of contracts get additional services
AND NOT EXISTS (
    SELECT 1 FROM contract_items ci 
    WHERE ci.contract_id = c.id 
    AND ci.item_type = 'service'
);

-- 6. ADD MORE WAREHOUSE ITEMS
INSERT INTO warehouse_items (name, description, category, item_type, monthly_fee, setup_fee, company_cost, current_stock, min_stock, is_active, created_at) VALUES
('PAX A920 Pro', 'Prémiový Android platobný terminál s dotykovým displejom', 'pos_terminal', 'device', 45.00, 150.00, 35.00, 25, 5, true, now()),
('PAX A80', 'Kompaktný mobilný platobný terminál', 'pos_terminal', 'device', 35.00, 100.00, 28.00, 30, 8, true, now()),
('SoftPOS Tablet 10"', 'Tablet s platobnou aplikáciou pre malé prevádzky', 'software', 'device', 25.00, 50.00, 18.00, 40, 10, true, now()),
('Tablet POS 15"', 'Veľký tablet pre komplexné POS riešenia', 'software', 'device', 55.00, 200.00, 42.00, 15, 3, true, now()),
('E-commerce Gateway', 'Online platobná brána pre webshopy', 'gateway', 'service', 15.00, 25.00, 8.00, 999, 50, true, now()),
('24/7 Technická podpora', 'Nepretržitá technická podpora', 'support', 'service', 12.00, 0.00, 6.00, 999, 100, true, now()),
('Výmena zariadenia', 'Služba výmeny pokazeného zariadenia', 'support', 'service', 8.00, 0.00, 4.00, 999, 50, true, now()),
('Reporting Dashboard', 'Pokročilé reportovacie nástroje', 'analytics', 'service', 20.00, 30.00, 12.00, 999, 25, true, now()),
('Mobilná aplikácia', 'Vlastná mobilná aplikácia pre zákazníkov', 'software', 'service', 30.00, 100.00, 18.00, 999, 20, true, now()),
('API integrácia', 'Pokročilá API integrácia so systémami zákazníka', 'integration', 'service', 25.00, 80.00, 15.00, 999, 30, true, now());

-- 7. DISTRIBUTE CONTRACTS OVER TIME (LAST 12 MONTHS)
UPDATE contracts 
SET created_at = now() - (random() * interval '365 days')
WHERE merchant_id IS NOT NULL;

-- Update related timestamps
UPDATE contracts 
SET 
    submitted_at = CASE 
        WHEN status IN ('submitted', 'approved', 'signed') 
        THEN created_at + interval '1 day' + (random() * interval '7 days')
        ELSE NULL 
    END,
    signed_at = CASE 
        WHEN status = 'signed' 
        THEN created_at + interval '5 days' + (random() * interval '20 days')
        ELSE NULL 
    END
WHERE merchant_id IS NOT NULL;

-- Update business locations created_at to match contracts
UPDATE business_locations 
SET created_at = c.created_at + (random() * interval '2 days')
FROM contracts c 
WHERE business_locations.contract_id = c.id;

COMMIT;
