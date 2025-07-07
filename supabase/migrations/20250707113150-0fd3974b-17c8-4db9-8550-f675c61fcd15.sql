-- Create kanban_columns table for custom column configurations
CREATE TABLE public.kanban_columns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  statuses TEXT[] NOT NULL DEFAULT '{}',
  color TEXT NOT NULL DEFAULT '#6B7280',
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own kanban columns" 
ON public.kanban_columns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own kanban columns" 
ON public.kanban_columns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own kanban columns" 
ON public.kanban_columns 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own kanban columns" 
ON public.kanban_columns 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create user_kanban_preferences table for personal settings
CREATE TABLE public.user_kanban_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  view_mode TEXT NOT NULL DEFAULT 'kanban', -- 'kanban' or 'table'
  auto_refresh BOOLEAN NOT NULL DEFAULT true,
  card_compact_mode BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_kanban_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user preferences
CREATE POLICY "Users can manage their kanban preferences" 
ON public.user_kanban_preferences 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_kanban_columns_updated_at
BEFORE UPDATE ON public.kanban_columns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_kanban_preferences_updated_at
BEFORE UPDATE ON public.user_kanban_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default kanban columns for existing functionality
INSERT INTO public.kanban_columns (user_id, title, statuses, color, position) VALUES
(NULL, 'Nové žiadosti', ARRAY['draft', 'in_progress'], '#6B7280', 0),
(NULL, 'V spracovaní', ARRAY['sent_to_client', 'email_viewed'], '#3B82F6', 1),
(NULL, 'Na schválenie', ARRAY['contract_generated', 'waiting_for_signature'], '#F59E0B', 2),
(NULL, 'Dokončené', ARRAY['signed', 'approved'], '#10B981', 3),
(NULL, 'Zastavené', ARRAY['lost', 'rejected'], '#EF4444', 4);

-- Update policies to allow viewing of default columns (where user_id is NULL)
DROP POLICY "Users can view their own kanban columns" ON public.kanban_columns;
CREATE POLICY "Users can view kanban columns" 
ON public.kanban_columns 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);