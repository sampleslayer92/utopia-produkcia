import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ItemType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  icon_url?: string;
  color: string;
  is_active: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateItemTypeData {
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  icon_url?: string;
  color?: string;
  position?: number;
}

export interface UpdateItemTypeData extends CreateItemTypeData {
  id: string;
  is_active?: boolean;
}

export const useItemTypes = (activeOnly = false) => {
  return useQuery({
    queryKey: ['item-types', { activeOnly }],
    queryFn: async () => {
      let query = supabase
        .from('item_types')
        .select('*')
        .order('position', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as ItemType[];
    },
  });
};

export const useItemType = (id: string) => {
  return useQuery({
    queryKey: ['item-type', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('item_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as ItemType;
    },
    enabled: !!id,
  });
};

export const useCreateItemType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateItemTypeData) => {
      const { data: itemType, error } = await supabase
        .from('item_types')
        .insert([data])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return itemType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-types'] });
      toast({
        title: 'Úspech',
        description: 'Typ položky bol vytvorený',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Chyba',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateItemType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateItemTypeData) => {
      const { data: itemType, error } = await supabase
        .from('item_types')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return itemType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-types'] });
      queryClient.invalidateQueries({ queryKey: ['item-type'] });
      toast({
        title: 'Úspech',
        description: 'Typ položky bol aktualizovaný',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Chyba',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteItemType = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('item_types')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-types'] });
      toast({
        title: 'Úspech',
        description: 'Typ položky bol zmazaný',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Chyba',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};