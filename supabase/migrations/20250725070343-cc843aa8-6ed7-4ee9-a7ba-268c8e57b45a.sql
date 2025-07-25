-- Add basic translations data for Slovak and English
INSERT INTO translations (key, namespace, language, value, is_system) VALUES
-- Common translations SK
('welcome', 'common', 'sk', 'Vitajte', true),
('save', 'common', 'sk', 'Uložiť', true),
('cancel', 'common', 'sk', 'Zrušiť', true),
('edit', 'common', 'sk', 'Upraviť', true),
('delete', 'common', 'sk', 'Zmazať', true),
('search', 'common', 'sk', 'Vyhľadať', true),
('loading', 'common', 'sk', 'Načítava...', true),

-- Common translations EN
('welcome', 'common', 'en', 'Welcome', true),
('save', 'common', 'en', 'Save', true),
('cancel', 'common', 'en', 'Cancel', true),
('edit', 'common', 'en', 'Edit', true),
('delete', 'common', 'en', 'Delete', true),
('search', 'common', 'en', 'Search', true),
('loading', 'common', 'en', 'Loading...', true),

-- Admin translations SK
('dashboard', 'admin', 'sk', 'Dashboard', true),
('translations', 'admin', 'sk', 'Preklady', true),
('users', 'admin', 'sk', 'Používatelia', true),
('settings', 'admin', 'sk', 'Nastavenia', true),

-- Admin translations EN
('dashboard', 'admin', 'en', 'Dashboard', true),
('translations', 'admin', 'en', 'Translations', true),
('users', 'admin', 'en', 'Users', true),
('settings', 'admin', 'en', 'Settings', true),

-- UI translations SK
('button.submit', 'ui', 'sk', 'Odoslať', true),
('button.reset', 'ui', 'sk', 'Resetovať', true),
('form.required', 'ui', 'sk', 'Povinné pole', true),

-- UI translations EN
('button.submit', 'ui', 'en', 'Submit', true),
('button.reset', 'ui', 'en', 'Reset', true),
('form.required', 'ui', 'en', 'Required field', true);