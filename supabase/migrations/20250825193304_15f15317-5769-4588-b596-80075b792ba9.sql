-- Update 6 draft contracts from August 2025 to approved status
UPDATE contracts 
SET status = 'approved', updated_at = now()
WHERE created_at >= '2025-08-01' 
AND status = 'draft'
AND id IN (
  SELECT id FROM contracts 
  WHERE created_at >= '2025-08-01' 
  AND status = 'draft'
  ORDER BY created_at DESC
  LIMIT 6
);

-- Add contract calculations for the approved contracts from August 2025
WITH august_approved AS (
  SELECT id, row_number() OVER (ORDER BY created_at) as rn
  FROM contracts 
  WHERE created_at >= '2025-08-01' 
  AND status = 'approved'
  AND id NOT IN (SELECT contract_id FROM contract_calculations)
)
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
  id,
  CASE 
    WHEN rn = 1 THEN 95000.00
    WHEN rn = 2 THEN 78000.00
    WHEN rn = 3 THEN 110000.00
    WHEN rn = 4 THEN 85000.00
    WHEN rn = 5 THEN 92000.00
    WHEN rn = 6 THEN 88000.00
    ELSE 90000.00
  END as monthly_turnover,
  CASE 
    WHEN rn = 1 THEN 95000.00
    WHEN rn = 2 THEN 78000.00
    WHEN rn = 3 THEN 110000.00
    WHEN rn = 4 THEN 85000.00
    WHEN rn = 5 THEN 92000.00
    WHEN rn = 6 THEN 88000.00
    ELSE 90000.00
  END as total_customer_payments,
  CASE 
    WHEN rn = 1 THEN 89500.00
    WHEN rn = 2 THEN 74100.00
    WHEN rn = 3 THEN 104500.00
    WHEN rn = 4 THEN 80750.00
    WHEN rn = 5 THEN 87400.00
    WHEN rn = 6 THEN 83600.00
    ELSE 85500.00
  END as total_company_costs,
  CASE 
    WHEN rn = 1 THEN 75000.00
    WHEN rn = 2 THEN 58000.00
    WHEN rn = 3 THEN 85000.00
    WHEN rn = 4 THEN 65000.00
    WHEN rn = 5 THEN 72000.00
    WHEN rn = 6 THEN 68000.00
    ELSE 70000.00
  END as effective_regulated,
  CASE 
    WHEN rn = 1 THEN 20000.00
    WHEN rn = 2 THEN 20000.00
    WHEN rn = 3 THEN 25000.00
    WHEN rn = 4 THEN 20000.00
    WHEN rn = 5 THEN 20000.00
    WHEN rn = 6 THEN 20000.00
    ELSE 20000.00
  END as effective_unregulated,
  1.2 as regulated_fee,
  2.8 as unregulated_fee,
  CASE 
    WHEN rn = 1 THEN 2800.00
    WHEN rn = 2 THEN 2160.00
    WHEN rn = 3 THEN 3720.00
    WHEN rn = 4 THEN 2380.00
    WHEN rn = 5 THEN 2760.00
    WHEN rn = 6 THEN 2480.00
    ELSE 2650.00
  END as transaction_margin,
  CASE 
    WHEN rn = 1 THEN 2700.00
    WHEN rn = 2 THEN 1740.00
    WHEN rn = 3 THEN 2780.00
    WHEN rn = 4 THEN 1870.00
    WHEN rn = 5 THEN 2040.00
    WHEN rn = 6 THEN 1920.00
    ELSE 2175.00
  END as service_margin,
  CASE 
    WHEN rn = 1 THEN 5500.00
    WHEN rn = 2 THEN 3900.00
    WHEN rn = 3 THEN 5500.00
    WHEN rn = 4 THEN 4250.00
    WHEN rn = 5 THEN 4600.00
    WHEN rn = 6 THEN 4400.00
    ELSE 4700.00
  END as total_monthly_profit,
  '{}'::jsonb as calculation_data
FROM august_approved;