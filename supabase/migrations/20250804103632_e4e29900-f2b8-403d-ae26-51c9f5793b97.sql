-- Add visited_steps column to contracts table for proper step tracking
ALTER TABLE contracts ADD COLUMN visited_steps JSONB DEFAULT '[]'::jsonb;