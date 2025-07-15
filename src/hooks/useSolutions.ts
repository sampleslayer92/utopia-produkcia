import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types
export interface Solution {
  id: string;
  name: string;
  description: string | null;
  subtitle: string | null;
  icon_name: string | null;
  icon_url: string | null;
  color: string;
  position: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSolutionData {
  name: string;
  description?: string;
  subtitle?: string;
  icon_name?: string;
  icon_url?: string;
  color?: string;
  position?: number;
  is_active?: boolean;
}

export interface UpdateSolutionData extends Partial<CreateSolutionData> {
  id: string;
}

// Hooks
export const useSolutions = (activeOnly = false) => {
  return useQuery({
    queryKey: ['solutions', { activeOnly }],
    queryFn: async () => {
      let query = supabase
        .from('solutions')
        .select('*')
        .order('position', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Solution[];
    },
  });
};

export const useSolution = (id: string) => {
  return useQuery({
    queryKey: ['solution', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as Solution;
    },
    enabled: !!id,
  });
};

export const useCreateSolution = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSolutionData) => {
      const { data: result, error } = await supabase
        .from('solutions')
        .insert(data)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
      toast({
        title: 'Riešenie vytvorené',
        description: 'Nové riešenie bolo úspešne vytvorené.',
      });
    },
    onError: (error) => {
      console.error('Error creating solution:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa vytvoriť riešenie.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSolution = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateSolutionData) => {
      const { data: result, error } = await supabase
        .from('solutions')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
      queryClient.invalidateQueries({ queryKey: ['solution'] });
      toast({
        title: 'Riešenie aktualizované',
        description: 'Zmeny boli úspešne uložené.',
      });
    },
    onError: (error) => {
      console.error('Error updating solution:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa aktualizovať riešenie.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteSolution = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('solutions')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
      toast({
        title: 'Riešenie vymazané',
        description: 'Riešenie bolo úspešne vymazané.',
      });
    },
    onError: (error) => {
      console.error('Error deleting solution:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa vymazať riešenie.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSolutionsOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (solutions: { id: string; position: number }[]) => {
      const updates = solutions.map(({ id, position }) =>
        supabase
          .from('solutions')
          .update({ position })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Failed to update some solutions');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
      toast({
        title: 'Poradie aktualizované',
        description: 'Poradie riešení bolo úspešne zmenené.',
      });
    },
    onError: (error) => {
      console.error('Error updating solutions order:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa zmeniť poradie riešení.',
        variant: 'destructive',
      });
    },
  });
};