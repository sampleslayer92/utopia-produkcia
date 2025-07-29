-- Add missing fields for all onboarding steps
-- First, get the step IDs for the active configuration
WITH active_config AS (
  SELECT id FROM onboarding_configurations WHERE is_active = true LIMIT 1
),
step_ids AS (
  SELECT s.id, s.step_key 
  FROM onboarding_steps s 
  JOIN active_config c ON s.configuration_id = c.id
)

-- Insert fields for business_locations step
INSERT INTO onboarding_fields (step_id, field_key, field_label, field_type, is_required, is_enabled, position, field_options)
SELECT s.id, 'business_location_manager', 'Business Location Manager', 'custom', false, true, 1, 
  '{"component": "business_location_manager", "description": "Manage business locations and their details"}'::jsonb
FROM step_ids s WHERE s.step_key = 'business_locations'

UNION ALL

-- Insert fields for device_selection step  
SELECT s.id, 'device_selector', 'Device Selection Interface', 'custom', true, true, 1,
  '{"component": "device_selector", "description": "Select devices and services for the contract"}'::jsonb
FROM step_ids s WHERE s.step_key = 'device_selection'

UNION ALL
SELECT s.id, 'mif_regulated_cards', 'MIF Regulated Cards', 'number', false, true, 2,
  '{"min": 0, "max": 100, "step": 0.01, "placeholder": "0.00"}'::jsonb
FROM step_ids s WHERE s.step_key = 'device_selection'

UNION ALL
SELECT s.id, 'mif_unregulated_cards', 'MIF Unregulated Cards', 'number', false, true, 3,
  '{"min": 0, "max": 100, "step": 0.01, "placeholder": "0.00"}'::jsonb
FROM step_ids s WHERE s.step_key = 'device_selection'

UNION ALL
SELECT s.id, 'transaction_types', 'Transaction Types', 'select', false, true, 4,
  '{"multiple": true, "options": [{"label": "Contactless", "value": "contactless"}, {"label": "Chip & PIN", "value": "chip_pin"}, {"label": "Online", "value": "online"}]}'::jsonb
FROM step_ids s WHERE s.step_key = 'device_selection'

UNION ALL

-- Insert fields for fees step
SELECT s.id, 'profit_calculator', 'Profit Calculator', 'custom', true, true, 1,
  '{"component": "profit_calculator", "description": "Calculate monthly profits and fees"}'::jsonb
FROM step_ids s WHERE s.step_key = 'fees'

UNION ALL
SELECT s.id, 'monthly_turnover', 'Monthly Turnover', 'number', false, true, 2,
  '{"min": 0, "step": 0.01, "placeholder": "Enter monthly turnover"}'::jsonb
FROM step_ids s WHERE s.step_key = 'fees'

UNION ALL
SELECT s.id, 'transaction_margin', 'Transaction Margin', 'number', false, true, 3,
  '{"min": 0, "max": 100, "step": 0.01, "placeholder": "Margin percentage"}'::jsonb
FROM step_ids s WHERE s.step_key = 'fees'

UNION ALL

-- Insert fields for persons_and_owners step
SELECT s.id, 'authorized_persons_section', 'Authorized Persons', 'custom', true, true, 1,
  '{"component": "authorized_persons", "description": "Manage authorized persons for the contract"}'::jsonb
FROM step_ids s WHERE s.step_key = 'persons_and_owners'

UNION ALL
SELECT s.id, 'actual_owners_section', 'Actual Owners', 'custom', true, true, 2,
  '{"component": "actual_owners", "description": "Manage actual owners information"}'::jsonb
FROM step_ids s WHERE s.step_key = 'persons_and_owners'

UNION ALL
SELECT s.id, 'auto_fill_from_contact', 'Auto-fill from Contact', 'custom', false, true, 3,
  '{"component": "auto_fill_button", "description": "Auto-fill person data from contact information"}'::jsonb
FROM step_ids s WHERE s.step_key = 'persons_and_owners'

UNION ALL

-- Insert fields for consents step
SELECT s.id, 'gdpr_consent', 'GDPR Consent', 'checkbox', true, true, 1,
  '{"label": "I agree to GDPR terms and conditions", "required": true}'::jsonb
FROM step_ids s WHERE s.step_key = 'consents'

UNION ALL
SELECT s.id, 'terms_consent', 'Terms and Conditions', 'checkbox', true, true, 2,
  '{"label": "I agree to the terms and conditions", "required": true}'::jsonb
FROM step_ids s WHERE s.step_key = 'consents'

UNION ALL
SELECT s.id, 'electronic_communication_consent', 'Electronic Communication', 'checkbox', false, true, 3,
  '{"label": "I agree to receive electronic communications", "required": false}'::jsonb
FROM step_ids s WHERE s.step_key = 'consents'

UNION ALL
SELECT s.id, 'signature_section', 'Digital Signature', 'custom', true, true, 4,
  '{"component": "signature_pad", "description": "Digital signature and consent confirmation"}'::jsonb
FROM step_ids s WHERE s.step_key = 'consents';