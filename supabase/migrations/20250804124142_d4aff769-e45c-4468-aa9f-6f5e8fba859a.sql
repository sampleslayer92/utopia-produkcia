-- Kompletná migrácia pre opravu dynamického onboarding systému
-- Vymazanie existujúcich nesprávnych dát
DELETE FROM step_modules;
DELETE FROM onboarding_fields;

-- Vloženie správnych modulov pre každý krok s wrapper keys
-- Používam skutočné UUID z databázy

-- Krok 1: contact-info -> ContactInfoWrapper
INSERT INTO step_modules (step_id, module_key, module_name, position, is_enabled, configuration)
VALUES (
  (SELECT id FROM onboarding_steps WHERE step_key = 'contact-info' LIMIT 1),
  'ContactInfoWrapper',
  'Contact Information',
  0,
  true,
  '{}'::jsonb
);

-- Krok 2: company-info -> CompanyInfoWrapper  
INSERT INTO step_modules (step_id, module_key, module_name, position, is_enabled, configuration)
VALUES (
  (SELECT id FROM onboarding_steps WHERE step_key = 'company-info' LIMIT 1),
  'CompanyInfoWrapper',
  'Company Information', 
  0,
  true,
  '{}'::jsonb
);

-- Krok 3: business-locations -> BusinessLocationWrapper
INSERT INTO step_modules (step_id, module_key, module_name, position, is_enabled, configuration)
VALUES (
  (SELECT id FROM onboarding_steps WHERE step_key = 'business-locations' LIMIT 1),
  'BusinessLocationWrapper',
  'Business Locations',
  0,
  true,
  '{}'::jsonb
);

-- Krok 4: device-selection -> SolutionSelectionWrapper
INSERT INTO step_modules (step_id, module_key, module_name, position, is_enabled, configuration)
VALUES (
  (SELECT id FROM onboarding_steps WHERE step_key = 'device-selection' LIMIT 1),
  'SolutionSelectionWrapper',
  'Solution Selection',
  0,
  true,
  '{}'::jsonb
);

-- Krok 5: fees -> FeesWrapper
INSERT INTO step_modules (step_id, module_key, module_name, position, is_enabled, configuration)
VALUES (
  (SELECT id FROM onboarding_steps WHERE step_key = 'fees' LIMIT 1),
  'FeesWrapper',
  'Fees Calculator',
  0,
  true,
  '{}'::jsonb
);

-- Krok 6: persons-owners -> AuthorizedPersonsWrapper + ActualOwnersWrapper
INSERT INTO step_modules (step_id, module_key, module_name, position, is_enabled, configuration)
VALUES 
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'persons-owners' LIMIT 1),
  'AuthorizedPersonsWrapper',
  'Authorized Persons',
  0,
  true,
  '{}'::jsonb
),
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'persons-owners' LIMIT 1),
  'ActualOwnersWrapper',
  'Actual Owners',
  1,
  true,
  '{}'::jsonb
);

-- Krok 7: consents -> ConsentsWrapper
INSERT INTO step_modules (step_id, module_key, module_name, position, is_enabled, configuration)
VALUES (
  (SELECT id FROM onboarding_steps WHERE step_key = 'consents' LIMIT 1),
  'ConsentsWrapper',
  'Consents',
  0,
  true,
  '{}'::jsonb
);

-- Pridanie polí pre kroky ktoré ich potrebujú
-- Krok 3: business-locations
INSERT INTO onboarding_fields (step_id, field_key, field_label, field_type, is_required, is_enabled, position)
VALUES 
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'business-locations' LIMIT 1),
  'businessLocations',
  'Business Locations',
  'array',
  true,
  true,
  0
);

-- Krok 4: device-selection  
INSERT INTO onboarding_fields (step_id, field_key, field_label, field_type, is_required, is_enabled, position)
VALUES 
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'device-selection' LIMIT 1),
  'deviceSelection.note',
  'Selection Notes',
  'textarea',
  false,
  true,
  0
),
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'device-selection' LIMIT 1),
  'deviceSelection.mifRegulatedCards',
  'MIF Regulated Cards',
  'number',
  true,
  true,
  1
),
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'device-selection' LIMIT 1),
  'deviceSelection.mifUnregulatedCards',
  'MIF Unregulated Cards', 
  'number',
  true,
  true,
  2
);

-- Krok 5: fees
INSERT INTO onboarding_fields (step_id, field_key, field_label, field_type, is_required, is_enabled, position)
VALUES 
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'fees' LIMIT 1),
  'fees.monthlyTurnover',
  'Monthly Turnover',
  'number',
  true,
  true,
  0
),
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'fees' LIMIT 1),
  'fees.totalCustomerPayments',
  'Total Customer Payments',
  'number',
  true,
  true,
  1
),
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'fees' LIMIT 1),
  'fees.totalCompanyCosts',
  'Total Company Costs',
  'number',
  true,
  true,
  2
);

-- Krok 6: persons-owners
INSERT INTO onboarding_fields (step_id, field_key, field_label, field_type, is_required, is_enabled, position)
VALUES 
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'persons-owners' LIMIT 1),
  'authorizedPersons',
  'Authorized Persons',
  'array',
  true,
  true,
  0
),
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'persons-owners' LIMIT 1),
  'actualOwners',
  'Actual Owners',
  'array',
  true,
  true,
  1
);

-- Krok 7: consents
INSERT INTO onboarding_fields (step_id, field_key, field_label, field_type, is_required, is_enabled, position)
VALUES 
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'consents' LIMIT 1),
  'consents.gdprConsent',
  'GDPR Consent',
  'checkbox',
  true,
  true,
  0
),
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'consents' LIMIT 1),
  'consents.termsConsent',
  'Terms Consent',
  'checkbox',
  true,
  true,
  1
),
(
  (SELECT id FROM onboarding_steps WHERE step_key = 'consents' LIMIT 1),
  'consents.electronicCommunicationConsent',
  'Electronic Communication Consent',
  'checkbox',
  true,
  true,
  2
);