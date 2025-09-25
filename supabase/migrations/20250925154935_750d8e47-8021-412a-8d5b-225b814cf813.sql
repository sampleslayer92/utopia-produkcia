-- Clear all contract and merchant data for greenfield setup
-- Delete in correct order to respect foreign key constraints

-- Step 1: Clear analytics and logs
DELETE FROM step_analytics;
DELETE FROM error_logs;

-- Step 2: Clear contract-related data (from most dependent to least)
DELETE FROM location_assignments;
DELETE FROM contract_documents;  
DELETE FROM contract_calculations;
DELETE FROM contract_item_addons;
DELETE FROM contract_items;
DELETE FROM authorized_persons;
DELETE FROM actual_owners;
DELETE FROM consents;
DELETE FROM device_selection;

-- Step 3: Clear main contract and business data
DELETE FROM contracts;
DELETE FROM business_locations;
DELETE FROM merchants;

-- Step 4: Clear person data that might be orphaned
DELETE FROM persons WHERE is_predefined = false;

-- Step 5: Reset sequences to start fresh
-- Reset contract number sequence
SELECT setval('contract_number_seq', 1, false);

-- Reset quick sale number sequence if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'quick_sale_number_seq') THEN
        PERFORM setval('quick_sale_number_seq', 1, false);
    END IF;
END $$;

-- Verification: Show counts of remaining records
SELECT 
    'contracts' as table_name,
    count(*) as remaining_records
FROM contracts
UNION ALL
SELECT 'merchants', count(*) FROM merchants
UNION ALL  
SELECT 'business_locations', count(*) FROM business_locations
UNION ALL
SELECT 'contract_items', count(*) FROM contract_items
UNION ALL
SELECT 'authorized_persons', count(*) FROM authorized_persons
UNION ALL
SELECT 'actual_owners', count(*) FROM actual_owners
ORDER BY table_name;