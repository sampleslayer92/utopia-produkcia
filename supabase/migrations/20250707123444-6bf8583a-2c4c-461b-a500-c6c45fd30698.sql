-- Add entity_type to contract_statuses table
ALTER TABLE public.contract_statuses 
ADD COLUMN entity_type text NOT NULL DEFAULT 'contracts';

-- Create enum for entity types
CREATE TYPE public.entity_type AS ENUM ('contracts', 'merchants', 'organizations', 'users', 'teams');

-- Update the column to use the enum
ALTER TABLE public.contract_statuses 
ALTER COLUMN entity_type TYPE entity_type USING entity_type::entity_type;

-- Create index for better performance
CREATE INDEX idx_contract_statuses_entity_type ON public.contract_statuses(entity_type);

-- Insert default statuses for other entity types
INSERT INTO public.contract_statuses (name, label, description, color, category, entity_type, is_system, is_active, position) VALUES
-- Merchant statuses
('new_merchant', 'Nový obchodník', 'Novo registrovaný obchodník', '#3B82F6', 'general', 'merchants', true, true, 0),
('active_merchant', 'Aktívny', 'Aktívny obchodník', '#10B981', 'completed', 'merchants', true, true, 1),
('suspended_merchant', 'Pozastavený', 'Pozastavený obchodník', '#F59E0B', 'in_progress', 'merchants', true, true, 2),
('inactive_merchant', 'Neaktívny', 'Neaktívny obchodník', '#EF4444', 'cancelled', 'merchants', true, true, 3),

-- Organization statuses  
('new_organization', 'Nová organizácia', 'Novo vytvorená organizácia', '#3B82F6', 'general', 'organizations', true, true, 0),
('active_organization', 'Aktívna', 'Aktívna organizácia', '#10B981', 'completed', 'organizations', true, true, 1),
('restructuring', 'Reštrukturalizácia', 'Organizácia v reštrukturalizácii', '#F59E0B', 'in_progress', 'organizations', true, true, 2),
('dissolved', 'Rozpustená', 'Rozpustená organizácia', '#EF4444', 'cancelled', 'organizations', true, true, 3),

-- User statuses
('new_user', 'Nový užívateľ', 'Novo registrovaný užívateľ', '#3B82F6', 'general', 'users', true, true, 0),
('active_user', 'Aktívny', 'Aktívny užívateľ', '#10B981', 'completed', 'users', true, true, 1),
('pending_verification', 'Čaká overenie', 'Čaká na overenie účtu', '#F59E0B', 'in_progress', 'users', true, true, 2),
('suspended_user', 'Pozastavený', 'Pozastavený užívateľ', '#EF4444', 'cancelled', 'users', true, true, 3),

-- Team statuses
('new_team', 'Nový tím', 'Novo vytvorený tím', '#3B82F6', 'general', 'teams', true, true, 0),
('active_team', 'Aktívny', 'Aktívny tím', '#10B981', 'completed', 'teams', true, true, 1),
('reorganizing', 'Reorganizácia', 'Tím v reorganizácii', '#F59E0B', 'in_progress', 'teams', true, true, 2),
('disbanded', 'Rozpustený', 'Rozpustený tím', '#EF4444', 'cancelled', 'teams', true, true, 3);