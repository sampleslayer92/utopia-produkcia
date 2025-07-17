import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { WarehouseItem } from './useWarehouseItems';

// Types
export interface SolutionItem {
  id: string;
  solution_id: string;
  warehouse_item_id: string;
  category_id?: string;
  position: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  warehouse_item?: WarehouseItem;
}

export interface CreateSolutionItemData {
  solution_id: string;
  warehouse_item_id: string;
  category_id?: string;
  position?: number;
  is_featured?: boolean;
}

export interface UpdateSolutionItemData extends CreateSolutionItemData {
  id: string;
}

// Hooks
export const useSolutionItems = (solutionId?: string) => {
  return useQuery({
    queryKey: ['solution-items', solutionId],
    queryFn: async () => {
      let query = supabase
        .from('solution_items')
        .select(`
          *,
          warehouse_item:warehouse_items(*)
        `)
        .order('position', { ascending: true });

      if (solutionId) {
        query = query.eq('solution_id', solutionId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as SolutionItem[];
    },
    enabled: !!solutionId,
  });
};

export const useSolutionProducts = (solutionIds: string[]) => {
  return useQuery({
    queryKey: ['solution-products', solutionIds],
    queryFn: async () => {
      if (solutionIds.length === 0) return [];

      const { data, error } = await supabase
        .from('solution_items')
        .select(`
          *,
          warehouse_item:warehouse_items(*)
        `)
        .in('solution_id', solutionIds)
        .eq('warehouse_items.is_active', true)
        .order('position', { ascending: true });

      if (error) {
        throw error;
      }

      return data as SolutionItem[];
    },
    enabled: solutionIds.length > 0,
  });
};

export const useCreateSolutionItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSolutionItemData) => {
      const { data: result, error } = await supabase
        .from('solution_items')
        .insert(data)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solution-items'] });
      queryClient.invalidateQueries({ queryKey: ['solution-products'] });
      toast({
        title: 'Produkt pridaný',
        description: 'Produkt bol úspešne pridaný do riešenia.',
      });
    },
    onError: (error) => {
      console.error('Error creating solution item:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa pridať produkt do riešenia.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSolutionItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateSolutionItemData) => {
      const { data: result, error } = await supabase
        .from('solution_items')
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
      queryClient.invalidateQueries({ queryKey: ['solution-items'] });
      queryClient.invalidateQueries({ queryKey: ['solution-products'] });
      toast({
        title: 'Položka aktualizovaná',
        description: 'Zmeny boli úspešne uložené.',
      });
    },
    onError: (error) => {
      console.error('Error updating solution item:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa aktualizovať položku.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteSolutionItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('solution_items')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solution-items'] });
      queryClient.invalidateQueries({ queryKey: ['solution-products'] });
      toast({
        title: 'Produkt odobraný',
        description: 'Produkt bol úspešne odobraný z riešenia.',
      });
    },
    onError: (error) => {
      console.error('Error deleting solution item:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa odobrať produkt z riešenia.',
        variant: 'destructive',
      });
    },
  });
};

export const useBulkAddSolutionItems = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (items: CreateSolutionItemData[]) => {
      const { data, error } = await supabase
        .from('solution_items')
        .insert(items)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solution-items'] });
      queryClient.invalidateQueries({ queryKey: ['solution-products'] });
      toast({
        title: 'Produkty pridané',
        description: `${data.length} produktov bolo úspešne pridaných.`,
      });
    },
    onError: (error) => {
      console.error('Error adding solution items:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa pridať produkty do riešenia.',
        variant: 'destructive',
      });
    },
  });
};