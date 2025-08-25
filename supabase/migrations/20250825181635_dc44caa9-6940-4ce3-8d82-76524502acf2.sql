
-- KROK 2: Prepojenie existujúcich zmlúv s novými merchantmi a vytváranie business locations
-- Najprv skontrolovať koľko máme merchantov a zmlúv

SELECT 'Total merchants now:' as info, COUNT(*) as count FROM merchants
UNION ALL
SELECT 'Contracts without merchants:', COUNT(*) FROM contracts WHERE merchant_id IS NULL
UNION ALL
SELECT 'Total contracts:', COUNT(*) FROM contracts;

-- Náhodne priradiť merchantov k existujúcim zmluvám bez merchant_id
WITH random_merchants AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY RANDOM()) as rn 
  FROM merchants
),
contracts_to_update AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY RANDOM()) as rn 
  FROM contracts 
  WHERE merchant_id IS NULL
)
UPDATE contracts 
SET merchant_id = (
  SELECT rm.id 
  FROM random_merchants rm 
  WHERE rm.rn = ((contracts_to_update.rn - 1) % (SELECT COUNT(*) FROM merchants)) + 1
)
FROM contracts_to_update
WHERE contracts.id = contracts_to_update.id;

-- Aktualizovať statusy zmlúv pre realistickú distribúciu
UPDATE contracts SET status = 'submitted' WHERE id IN (
  SELECT id FROM contracts WHERE status = 'draft' ORDER BY RANDOM() LIMIT 20
);

UPDATE contracts SET status = 'approved' WHERE id IN (
  SELECT id FROM contracts WHERE status = 'draft' ORDER BY RANDOM() LIMIT 15
);

UPDATE contracts SET status = 'signed' WHERE id IN (
  SELECT id FROM contracts WHERE status = 'approved' ORDER BY RANDOM() LIMIT 8
);

UPDATE contracts SET status = 'rejected' WHERE id IN (
  SELECT id FROM contracts WHERE status = 'draft' ORDER BY RANDOM() LIMIT 3
);

UPDATE contracts SET status = 'lost' WHERE id IN (
  SELECT id FROM contracts WHERE status = 'draft' ORDER BY RANDOM() LIMIT 5
);

-- Vytvoriť business locations pre každého merchanta
INSERT INTO business_locations (
  name, address_street, address_city, address_zip_code, 
  monthly_turnover, seasonal_type, merchant_id, created_at
)
SELECT 
  CASE 
    WHEN m.company_name LIKE '%Tesco%' THEN 'Tesco Hypermarket ' || m.address_city
    WHEN m.company_name LIKE '%LIDL%' THEN 'LIDL Market ' || m.address_city
    WHEN m.company_name LIKE '%Reštaurácia%' THEN m.company_name || ' - Hlavná prevádzka'
    WHEN m.company_name LIKE '%Café%' THEN m.company_name || ' - Centrum'
    WHEN m.company_name LIKE '%Autoservis%' THEN m.company_name || ' - Servis'
    WHEN m.company_name LIKE '%Lekáreň%' THEN m.company_name || ' - Hlavná pobočka'
    WHEN m.company_name LIKE '%Hotel%' THEN m.company_name || ' - Reception'
    WHEN m.company_name LIKE '%Pizzeria%' THEN m.company_name || ' - Reštaurácia'
    WHEN m.company_name LIKE '%Potraviny%' THEN m.company_name || ' - Predajňa'
    ELSE m.company_name || ' - Prevádzka'
  END as name,
  m.address_street,
  m.address_city,
  m.address_zip_code,
  CASE 
    WHEN m.company_name LIKE '%Tesco%' THEN 65000
    WHEN m.company_name LIKE '%LIDL%' THEN 58000
    WHEN m.company_name LIKE '%Hotel%' THEN 35000
    WHEN m.company_name LIKE '%Autoservis%' THEN 28000
    WHEN m.company_name LIKE '%Potraviny%' THEN 25000
    WHEN m.company_name LIKE '%Reštaurácia%' THEN 15000
    WHEN m.company_name LIKE '%Pizzeria%' THEN 12000
    WHEN m.company_name LIKE '%Café%' THEN 8000
    WHEN m.company_name LIKE '%Lekáreň%' THEN 18000
    ELSE 10000 + (RANDOM() * 15000)::int
  END as monthly_turnover,
  CASE 
    WHEN m.company_name LIKE '%Hotel%' THEN 'seasonal'
    WHEN m.company_name LIKE '%Café%' THEN 'seasonal'  
    ELSE 'year_round'
  END::seasonality_type as seasonal_type,
  m.id as merchant_id,
  NOW() - INTERVAL '1 day' * (RANDOM() * 365)::int as created_at
FROM merchants m;

-- Pridať ešte niekoľko dodatočných locations pre väčších merchantov
INSERT INTO business_locations (
  name, address_street, address_city, address_zip_code, 
  monthly_turnover, seasonal_type, merchant_id, created_at
)
SELECT 
  m.company_name || ' - Pobočka 2',
  'Nákupné centrum Aupark',
  'Bratislava',
  '85101',
  (SELECT monthly_turnover * 0.7 FROM business_locations WHERE merchant_id = m.id LIMIT 1),
  'year_round'::seasonality_type,
  m.id,
  NOW() - INTERVAL '1 day' * (RANDOM() * 200)::int
FROM merchants m 
WHERE m.company_name LIKE '%Tesco%' OR m.company_name LIKE '%LIDL%' OR m.company_name LIKE '%FRESH%';

-- Overiť výsledky
SELECT 'Contracts with merchants now:' as info, COUNT(*) as count 
FROM contracts WHERE merchant_id IS NOT NULL
UNION ALL
SELECT 'Business locations created:', COUNT(*) FROM business_locations
UNION ALL
SELECT 'Merchants with locations:', COUNT(DISTINCT merchant_id) FROM business_locations;
