-- Pridanie nových statusov pre žiadosti a kontrakty
UPDATE contract_statuses SET is_active = true WHERE name IN ('pending_approval', 'approved', 'rejected');

-- Pridanie nového statusu pre čakanie na dokončenie žiadosti
INSERT INTO contract_statuses (name, label, color, category, entity_type, position) 
VALUES ('request_draft', 'Žiadosť - Rozpracovaná', '#6B7280', 'request', 'contracts', 1)
ON CONFLICT (name) DO NOTHING;

-- Aktualizácia statusu pre odoslané žiadosti  
UPDATE contract_statuses SET label = 'Žiadosť - Čaká na schválenie', category = 'request' WHERE name = 'pending_approval';

-- Pridanie statusu pre zamietnuté žiadosti
UPDATE contract_statuses SET label = 'Žiadosť - Zamietnutá', color = '#DC2626', category = 'request' WHERE name = 'rejected';

-- Pridanie statusu pre schválené kontrakty
UPDATE contract_statuses SET label = 'Kontrakt - Schválený', color = '#059669', category = 'contract' WHERE name = 'approved';

-- Aktualizácia pozícií pre logické poradie
UPDATE contract_statuses SET position = 0 WHERE name = 'draft';
UPDATE contract_statuses SET position = 1 WHERE name = 'request_draft';
UPDATE contract_statuses SET position = 2 WHERE name = 'pending_approval';
UPDATE contract_statuses SET position = 3 WHERE name = 'approved';
UPDATE contract_statuses SET position = 4 WHERE name = 'rejected';

-- Pridanie stĺpca pre ukladanie podpisu do contracts tabuľky
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS signature_url TEXT;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS signature_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS signature_ip TEXT;