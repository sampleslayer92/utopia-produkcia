import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BulkUpdateData {
  itemIds: string[];
  updates: {
    is_active?: boolean;
    category_id?: string;
    item_type_id?: string;
    monthly_fee?: number;
    setup_fee?: number;
    company_cost?: number;
  };
}

export const useBulkUpdateWarehouseItems = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ itemIds, updates }: BulkUpdateData) => {
      const { data, error } = await supabase
        .from('warehouse_items')
        .update(updates)
        .in('id', itemIds)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast({
        title: 'Úspech',
        description: `Aktualizovaných ${data.length} položiek`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa aktualizovať položky',
        variant: 'destructive',
      });
      console.error('Error bulk updating warehouse items:', error);
    },
  });
};

export const useBulkDeleteWarehouseItems = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (itemIds: string[]) => {
      const { data, error } = await supabase
        .from('warehouse_items')
        .delete()
        .in('id', itemIds)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast({
        title: 'Úspech',
        description: `Zmazaných ${data.length} položiek`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa zmazať položky',
        variant: 'destructive',
      });
      console.error('Error bulk deleting warehouse items:', error);
    },
  });
};

export const useBulkImportWarehouseItems = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (items: any[]) => {
      const user = await supabase.auth.getUser();
      const itemsWithUser = items.map(item => ({
        ...item,
        created_by: user.data.user?.id,
      }));

      const { data, error } = await supabase
        .from('warehouse_items')
        .insert(itemsWithUser)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast({
        title: 'Úspech',
        description: `Importovaných ${data.length} položiek`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa importovať položky',
        variant: 'destructive',
      });
      console.error('Error importing warehouse items:', error);
    },
  });
};