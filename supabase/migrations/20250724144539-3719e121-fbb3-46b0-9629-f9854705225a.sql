-- Pridanie nových statusov do contract_status enum
ALTER TYPE contract_status ADD VALUE IF NOT EXISTS 'pending_approval';
ALTER TYPE contract_status ADD VALUE IF NOT EXISTS 'request_draft';