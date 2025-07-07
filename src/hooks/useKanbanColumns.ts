import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface KanbanColumn {
  id: string;
  title: string;
  statuses: string[];
  color: string;
  position: number;
  isActive: boolean;
  userId?: string;
}

export interface KanbanPreferences {
  viewMode: 'kanban' | 'table';
  autoRefresh: boolean;
  cardCompactMode: boolean;
}

export const useKanbanColumns = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [preferences, setPreferences] = useState<KanbanPreferences>({
    viewMode: 'kanban',
    autoRefresh: true,
    cardCompactMode: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch kanban columns
  const fetchColumns = async () => {
    try {
      const { data, error } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('is_active', true)
        .order('position');

      if (error) throw error;

      const formattedColumns: KanbanColumn[] = data?.map(col => ({
        id: col.id,
        title: col.title,
        statuses: col.statuses,
        color: col.color,
        position: col.position,
        isActive: col.is_active,
        userId: col.user_id
      })) || [];

      setColumns(formattedColumns);
    } catch (error) {
      console.error('Error fetching kanban columns:', error);
    }
  };

  // Fetch user preferences
  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_kanban_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences({
          viewMode: data.view_mode as 'kanban' | 'table',
          autoRefresh: data.auto_refresh,
          cardCompactMode: data.card_compact_mode
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  // Update column
  const updateColumn = async (columnId: string, updates: Partial<KanbanColumn>) => {
    try {
      const { error } = await supabase
        .from('kanban_columns')
        .update({
          title: updates.title,
          color: updates.color,
          position: updates.position,
          is_active: updates.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', columnId);

      if (error) throw error;

      // Update local state
      setColumns(prev => prev.map(col => 
        col.id === columnId ? { ...col, ...updates } : col
      ));

      return { success: true };
    } catch (error) {
      console.error('Error updating column:', error);
      return { success: false, error };
    }
  };

  // Create new column
  const createColumn = async (column: Omit<KanbanColumn, 'id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('kanban_columns')
        .insert({
          user_id: user.id,
          title: column.title,
          statuses: column.statuses,
          color: column.color,
          position: column.position,
          is_active: column.isActive
        })
        .select()
        .single();

      if (error) throw error;

      const newColumn: KanbanColumn = {
        id: data.id,
        title: data.title,
        statuses: data.statuses,
        color: data.color,
        position: data.position,
        isActive: data.is_active,
        userId: data.user_id
      };

      setColumns(prev => [...prev, newColumn].sort((a, b) => a.position - b.position));
      return { success: true, data: newColumn };
    } catch (error) {
      console.error('Error creating column:', error);
      return { success: false, error };
    }
  };

  // Delete column
  const deleteColumn = async (columnId: string) => {
    try {
      const { error } = await supabase
        .from('kanban_columns')
        .delete()
        .eq('id', columnId);

      if (error) throw error;

      setColumns(prev => prev.filter(col => col.id !== columnId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting column:', error);
      return { success: false, error };
    }
  };

  // Update preferences
  const updatePreferences = async (newPreferences: Partial<KanbanPreferences>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_kanban_preferences')
        .upsert({
          user_id: user.id,
          view_mode: newPreferences.viewMode || preferences.viewMode,
          auto_refresh: newPreferences.autoRefresh ?? preferences.autoRefresh,
          card_compact_mode: newPreferences.cardCompactMode ?? preferences.cardCompactMode,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setPreferences(prev => ({ ...prev, ...newPreferences }));
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  // Reset to default columns
  const resetToDefault = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Delete user's custom columns
      await supabase
        .from('kanban_columns')
        .delete()
        .eq('user_id', user.id);

      // Refetch columns to get defaults
      await fetchColumns();
      return { success: true };
    } catch (error) {
      console.error('Error resetting to default:', error);
      return { success: false, error };
    }
  };

  // Reorder columns
  const reorderColumns = async (newOrder: KanbanColumn[]) => {
    try {
      const updates = newOrder.map((col, index) => ({
        id: col.id,
        position: index
      }));

      for (const update of updates) {
        await supabase
          .from('kanban_columns')
          .update({ position: update.position })
          .eq('id', update.id);
      }

      setColumns(newOrder);
      return { success: true };
    } catch (error) {
      console.error('Error reordering columns:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchColumns(), fetchPreferences()]);
      setIsLoading(false);
    };

    loadData();
  }, [user]);

  return {
    columns,
    preferences,
    isLoading,
    updateColumn,
    createColumn,
    deleteColumn,
    updatePreferences,
    reorderColumns,
    resetToDefault,
    refetch: () => Promise.all([fetchColumns(), fetchPreferences()])
  };
};