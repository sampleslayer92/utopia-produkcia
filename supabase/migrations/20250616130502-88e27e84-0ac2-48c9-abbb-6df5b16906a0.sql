
-- Odstránenie duplicitných záznamov v authorized_persons table
-- Ponecháme len najnovšie záznamy pre každý contract_id + person_id pár
WITH ranked_persons AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY contract_id, person_id ORDER BY created_at DESC) as rn
  FROM authorized_persons
)
DELETE FROM authorized_persons 
WHERE id IN (
  SELECT id FROM ranked_persons WHERE rn > 1
);

-- Odstránenie duplicitných záznamov v actual_owners table
WITH ranked_owners AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY contract_id, owner_id ORDER BY created_at DESC) as rn
  FROM actual_owners
)
DELETE FROM actual_owners 
WHERE id IN (
  SELECT id FROM ranked_owners WHERE rn > 1
);

-- Pridanie unique constraint na authorized_persons aby sa zabránilo budúcim duplicitom
ALTER TABLE authorized_persons 
ADD CONSTRAINT authorized_persons_contract_person_unique 
UNIQUE (contract_id, person_id);

-- Pridanie unique constraint na actual_owners aby sa zabránilo budúcim duplicitom
ALTER TABLE actual_owners 
ADD CONSTRAINT actual_owners_contract_owner_unique 
UNIQUE (contract_id, owner_id);
