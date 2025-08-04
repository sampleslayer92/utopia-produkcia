-- Oprava module_key hodnôt aby zodpovedali registrovaným modulom
UPDATE step_modules SET module_key = 'profit_calculator' WHERE module_key = 'calculator';

-- Pridať chýbajúci ContactInfoWrapper modul pre contact-info krok ak neexistuje wrapper registrácia
-- Najprv vytvoriť ContactInfoWrapper registráciu v ModuleRegistration ak neexistuje