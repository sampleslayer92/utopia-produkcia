
-- Create enum for contract source
CREATE TYPE contract_source AS ENUM (
  'telesales',
  'facebook',
  'web',
  'email',
  'referral',
  'other'
);

-- Create enum for lost reasons
CREATE TYPE lost_reason AS ENUM (
  'no_response',
  'price_too_high',
  'competitor_chosen',
  'not_interested',
  'technical_issues',
  'other'
);

-- Update contract_status enum to include new statuses
ALTER TYPE contract_status ADD VALUE 'in_progress';
ALTER TYPE contract_status ADD VALUE 'sent_to_client';
ALTER TYPE contract_status ADD VALUE 'email_viewed';
ALTER TYPE contract_status ADD VALUE 'step_completed';
ALTER TYPE contract_status ADD VALUE 'contract_generated';
ALTER TYPE contract_status ADD VALUE 'signed';
ALTER TYPE contract_status ADD VALUE 'waiting_for_signature';
ALTER TYPE contract_status ADD VALUE 'lost';

-- Add new columns to contracts table
ALTER TABLE contracts 
ADD COLUMN source contract_source DEFAULT 'web',
ADD COLUMN current_step INTEGER DEFAULT 1,
ADD COLUMN lost_reason lost_reason,
ADD COLUMN lost_notes TEXT,
ADD COLUMN email_viewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN contract_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN signed_at TIMESTAMP WITH TIME ZONE;

-- Create index for better performance on source and status filtering
CREATE INDEX idx_contracts_source ON contracts(source);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_current_step ON contracts(current_step);
