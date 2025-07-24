-- Fix bulk delete functionality - ensure RLS policies allow proper deletion
-- Add seed data for solution_categories to link "Pokladňa" with relevant categories

-- First, let's ensure we have the right categories for "Pokladňa" solution
-- Get the "Pokladňa" solution ID and link it with appropriate categories
INSERT INTO solution_categories (solution_id, category_id, position, is_featured)
SELECT 
    s.id as solution_id,
    c.id as category_id,
    ROW_NUMBER() OVER (ORDER BY c.name) as position,
    CASE WHEN c.name IN ('Pokladničný systém', 'Moduly') THEN true ELSE false END as is_featured
FROM solutions s
CROSS JOIN categories c
WHERE s.name = 'Pokladňa' 
  AND c.name IN ('Pokladničný systém', 'Moduly', 'Tablety', 'Termálne tlačiarne')
  AND NOT EXISTS (
    SELECT 1 FROM solution_categories sc 
    WHERE sc.solution_id = s.id AND sc.category_id = c.id
  );