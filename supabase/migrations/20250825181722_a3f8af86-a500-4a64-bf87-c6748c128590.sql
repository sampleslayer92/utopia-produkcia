
-- KROK 3: Finálne naplnenie databázy - finančné údaje a kontraktné položky

-- Najprv skontrolovať aktuálny stav
SELECT 'Current state check:' as info, '' as details
UNION ALL
SELECT 'Total merchants:', COUNT(*)::text FROM merchants
UNION ALL
SELECT 'Total contracts:', COUNT(*)::text FROM contracts
UNION ALL
SELECT 'Contracts with merchants:', COUNT(*)::text FROM contracts WHERE merchant_id IS NOT NULL
UNION ALL
SELECT 'Business locations:', COUNT(*)::text FROM business_locations
UNION ALL
SELECT 'Contract calculations:', COUNT(*)::text FROM contract_calculations
UNION ALL
SELECT 'Contract items:', COUNT(*)::text FROM contract_items;

-- Vytvoriť contract_calculations pre zmluvy ktoré ich nemajú
INSERT INTO contract_calculations (
  contract_id, monthly_turnover, total_customer_payments, total_company_costs,
  effective_regulated, effective_unregulated, regulated_fee, unregulated_fee,
  transaction_margin, service_margin, total_monthly_profit
)
SELECT 
  c.id as contract_id,
  COALESCE(bl.monthly_turnover, 15000) as monthly_turnover,
  COALESCE(bl.monthly_turnover, 15000) * 0.025 as total_customer_payments,
  COALESCE(bl.monthly_turnover, 15000) * 0.012 as total_company_costs,
  0.20 as effective_regulated,
  0.80 as effective_unregulated,
  COALESCE(bl.monthly_turnover, 15000) * 0.025 * 0.20 as regulated_fee,
  COALESCE(bl.monthly_turnover, 15000) * 0.025 * 0.80 as unregulated_fee,
  COALESCE(bl.monthly_turnover, 15000) * 0.008 as transaction_margin,
  COALESCE(bl.monthly_turnover, 15000) * 0.005 as service_margin,
  COALESCE(bl.monthly_turnover, 15000) * 0.013 as total_monthly_profit
FROM contracts c
LEFT JOIN business_locations bl ON bl.merchant_id = c.merchant_id
WHERE c.id NOT IN (SELECT contract_id FROM contract_calculations)
  AND c.merchant_id IS NOT NULL;

-- Vytvoriť contract_items pre zmluvy ktoré ich nemajú
INSERT INTO contract_items (
  contract_id, name, description, item_type, category, count, monthly_fee, company_cost
)
SELECT 
  c.id as contract_id,
  CASE 
    WHEN RANDOM() < 0.3 THEN 'PAX A920 Pro'
    WHEN RANDOM() < 0.6 THEN 'PAX A80'
    WHEN RANDOM() < 0.8 THEN 'Tablet 15"'
    ELSE 'Tablet 10"'
  END as name,
  CASE 
    WHEN RANDOM() < 0.3 THEN 'Profesionálny POS terminál s dotykovým displejom'
    WHEN RANDOM() < 0.6 THEN 'Kompaktný POS terminál pre malé prevádzky'
    WHEN RANDOM() < 0.8 THEN 'Veľký tablet pre SoftPOS riešenia'
    ELSE 'Štandardný tablet pre SoftPOS'
  END as description,
  'device' as item_type,
  CASE 
    WHEN RANDOM() < 0.5 THEN 'pos_terminal'
    ELSE 'tablet'
  END as category,
  CASE 
    WHEN m.company_name LIKE '%Tesco%' OR m.company_name LIKE '%LIDL%' THEN 3 + (RANDOM() * 5)::int
    WHEN m.company_name LIKE '%Hotel%' THEN 2 + (RANDOM() * 3)::int
    ELSE 1 + (RANDOM() * 2)::int
  END as count,
  CASE 
    WHEN RANDOM() < 0.3 THEN 45.00
    WHEN RANDOM() < 0.6 THEN 35.00
    WHEN RANDOM() < 0.8 THEN 25.00
    ELSE 20.00
  END as monthly_fee,
  CASE 
    WHEN RANDOM() < 0.3 THEN 25.00
    WHEN RANDOM() < 0.6 THEN 20.00
    WHEN RANDOM() < 0.8 THEN 15.00
    ELSE 12.00
  END as company_cost
FROM contracts c
JOIN merchants m ON m.id = c.merchant_id
WHERE c.id NOT IN (SELECT DISTINCT contract_id FROM contract_items WHERE contract_id IS NOT NULL)
  AND c.merchant_id IS NOT NULL;

-- Pridať service položky pre niektoré zmluvy
INSERT INTO contract_items (
  contract_id, name, description, item_type, category, count, monthly_fee, company_cost
)
SELECT 
  c.id as contract_id,
  CASE 
    WHEN RANDOM() < 0.4 THEN 'Technická podpora 24/7'
    WHEN RANDOM() < 0.7 THEN 'Reporting & Analytics'
    ELSE 'Fraud Protection'
  END as name,
  CASE 
    WHEN RANDOM() < 0.4 THEN 'Nepretržitá technická podpora pre všetky zariadenia'
    WHEN RANDOM() < 0.7 THEN 'Pokročilé reporty a analytické nástroje'
    ELSE 'Ochrana pred podvodnými transakciami'
  END as description,
  'service' as item_type,
  'support' as category,
  1 as count,
  CASE 
    WHEN RANDOM() < 0.4 THEN 15.00
    WHEN RANDOM() < 0.7 THEN 10.00
    ELSE 8.00
  END as monthly_fee,
  CASE 
    WHEN RANDOM() < 0.4 THEN 8.00
    WHEN RANDOM() < 0.7 THEN 5.00
    ELSE 3.00
  END as company_cost
FROM contracts c
WHERE c.merchant_id IS NOT NULL 
  AND RANDOM() < 0.6  -- Len 60% zmlúv bude mať service položky
ORDER BY RANDOM()
LIMIT 30;

-- Aktualizovať dátumy pre realistickejšie zobrazenie
UPDATE contracts 
SET 
  submitted_at = CASE 
    WHEN status IN ('submitted', 'approved', 'signed') THEN created_at + INTERVAL '1 day' * (1 + RANDOM() * 5)::int
    ELSE NULL
  END,
  signed_at = CASE 
    WHEN status = 'signed' THEN created_at + INTERVAL '1 day' * (7 + RANDOM() * 14)::int
    ELSE NULL
  END,
  contract_generated_at = CASE 
    WHEN status IN ('signed', 'approved') THEN created_at + INTERVAL '1 day' * (5 + RANDOM() * 10)::int
    ELSE NULL
  END;

-- Finálne overenie stavu
SELECT 'FINAL DATABASE STATE:' as info, '' as details
UNION ALL
SELECT 'Merchants:', COUNT(*)::text FROM merchants
UNION ALL
SELECT 'Contracts total:', COUNT(*)::text FROM contracts
UNION ALL
SELECT 'Contracts - signed:', COUNT(*)::text FROM contracts WHERE status = 'signed'
UNION ALL
SELECT 'Contracts - submitted:', COUNT(*)::text FROM contracts WHERE status = 'submitted'
UNION ALL
SELECT 'Contracts - approved:', COUNT(*)::text FROM contracts WHERE status = 'approved'
UNION ALL
SELECT 'Contracts - draft:', COUNT(*)::text FROM contracts WHERE status = 'draft'
UNION ALL
SELECT 'Business locations:', COUNT(*)::text FROM business_locations
UNION ALL
SELECT 'Contract calculations:', COUNT(*)::text FROM contract_calculations
UNION ALL
SELECT 'Contract items:', COUNT(*)::text FROM contract_items
UNION ALL
SELECT 'Average monthly profit:', ROUND(AVG(total_monthly_profit)::numeric, 2)::text || ' EUR' FROM contract_calculations;
