-- Add Pokladňa solution to solutions table
INSERT INTO solutions (name, description, subtitle, color, position, is_active) VALUES
('Pokladňa', 'Komplexné pokladničné riešenie s modulmi a systémami', 'Tablety, systémy a moduly pre vašu prevádzku', '#3B82F6', 2, true)
ON CONFLICT (name) DO NOTHING;