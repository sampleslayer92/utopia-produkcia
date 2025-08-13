-- Add ContactInfoWrapper module to step_modules for step 1
INSERT INTO step_modules (step_id, module_key, module_name, position, is_enabled, configuration)
SELECT 
  s.id,
  'ContactInfoWrapper',
  'Contact Information',
  0,
  true,
  '{}'::jsonb
FROM onboarding_steps s
JOIN onboarding_configurations c ON s.configuration_id = c.id
WHERE s.step_key = 'contact-info' 
  AND c.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM step_modules sm 
    WHERE sm.step_id = s.id AND sm.module_key = 'ContactInfoWrapper'
  );

-- Add all necessary fields for contact-info step
INSERT INTO onboarding_fields (step_id, field_key, field_label, field_type, position, is_required, is_enabled, field_options)
SELECT 
  s.id,
  field_key,
  field_label,
  field_type,
  position,
  is_required,
  is_enabled,
  field_options
FROM onboarding_steps s
JOIN onboarding_configurations c ON s.configuration_id = c.id
CROSS JOIN (
  VALUES 
    ('country', 'Krajina', 'select', 0, true, true, '{"options": [
      {"value": "SK", "label": "Slovensko", "flag": "🇸🇰", "prefix": "+421"},
      {"value": "CZ", "label": "Česká republika", "flag": "🇨🇿", "prefix": "+420"},
      {"value": "AT", "label": "Rakúsko", "flag": "🇦🇹", "prefix": "+43"},
      {"value": "HU", "label": "Maďarsko", "flag": "🇭🇺", "prefix": "+36"},
      {"value": "PL", "label": "Poľsko", "flag": "🇵🇱", "prefix": "+48"},
      {"value": "DE", "label": "Nemecko", "flag": "🇩🇪", "prefix": "+49"},
      {"value": "GB", "label": "Veľká Británia", "flag": "🇬🇧", "prefix": "+44"},
      {"value": "FR", "label": "Francúzsko", "flag": "🇫🇷", "prefix": "+33"},
      {"value": "IT", "label": "Taliansko", "flag": "🇮🇹", "prefix": "+39"},
      {"value": "ES", "label": "Španielsko", "flag": "🇪🇸", "prefix": "+34"}
    ]}'::jsonb),
    ('salutation', 'Oslovenie', 'select', 1, false, true, '{"options": [
      {"value": "Pan", "label": "Pan"},
      {"value": "Pani", "label": "Pani"}
    ]}'::jsonb),
    ('firstName', 'Meno', 'text', 2, true, true, '{}'::jsonb),
    ('lastName', 'Priezvisko', 'text', 3, true, true, '{}'::jsonb),
    ('email', 'Email', 'email', 4, true, true, '{}'::jsonb),
    ('phone', 'Telefón', 'phone', 5, true, true, '{}'::jsonb),
    ('salesNote', 'Predajná poznámka', 'textarea', 6, false, true, '{}'::jsonb)
) AS fields(field_key, field_label, field_type, position, is_required, is_enabled, field_options)
WHERE s.step_key = 'contact-info' 
  AND c.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM onboarding_fields of 
    WHERE of.step_id = s.id AND of.field_key = fields.field_key
  );