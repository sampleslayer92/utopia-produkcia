
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  icon_url?: string;
  color: string;
  item_type_filter: 'device' | 'service' | 'both';
  is_active: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  icon_url?: string;
  color?: string;
  item_type_filter?: 'device' | 'service' | 'both';
  position?: number;
}

export interface UpdateCategoryData extends CreateCategoryData {
  id: string;
  is_active?: boolean;
}

export const useCategories = (activeOnly = false) => {
  return useQuery({
    queryKey: ['categories', { activeOnly }],
    queryFn: async () => {
      let query = supabase
        .from('categories')
        .select('*')
        .order('position', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Category[];
    },
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as Category;
    },
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateCategoryData) => {
      const { data: category, error } = await supabase
        .from('categories')
        .insert([data])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Úspech',
        description: 'Kategória bola vytvorená',
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

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateCategoryData) => {
      const { data: category, error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category'] });
      toast({
        title: 'Úspech',
        description: 'Kategória bola aktualizovaná',
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

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // First check if category has warehouse items
      const { data: itemsCheck } = await supabase
        .from('warehouse_items')
        .select('id')
        .eq('category_id', id)
        .limit(1);

      if (itemsCheck && itemsCheck.length > 0) {
        throw new Error('Nemôžete vymazať kategóriu, ktorá má priradenú skladové položky. Najprv presuňte položky do inej kategórie.');
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category-counts'] });
      toast({
        title: 'Úspech',
        description: 'Kategória bola zmazaná',
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
