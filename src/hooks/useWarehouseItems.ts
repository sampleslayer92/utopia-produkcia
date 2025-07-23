import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WarehouseItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  category_id?: string;
  item_type: 'device' | 'service';
  item_type_id?: string;
  monthly_fee: number;
  setup_fee: number;
  company_cost: number;
  specifications?: any;
  custom_fields?: any;
  image_url?: string;
  is_active: boolean;
  min_stock?: number;
  current_stock?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Relations
  categories?: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon_name?: string;
    icon_url?: string;
  };
  item_types?: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon_name?: string;
    icon_url?: string;
  };
}

export interface CreateWarehouseItemData {
  name: string;
  description?: string;
  category?: string;
  category_id?: string;
  item_type?: string;
  item_type_id?: string;
  monthly_fee: number;
  setup_fee: number;
  company_cost: number;
  specifications?: any;
  custom_fields?: any;
  image_url?: string;
  min_stock?: number;
  current_stock?: number;
  is_active?: boolean;
}

export interface UpdateWarehouseItemData extends Partial<CreateWarehouseItemData> {
  id: string;
}

export const useWarehouseItems = (filters?: {
  item_type?: 'device' | 'service';
  item_type_id?: string;
  category?: string;
  category_id?: string;
  search?: string;
  is_active?: boolean;
}) => {
  return useQuery({
    queryKey: ['warehouse-items', filters],
    queryFn: async () => {
      let query = supabase
        .from('warehouse_items')
        .select(`
          *,
          categories:category_id (
            id,
            name,
            slug,
            color,
            icon_name,
            icon_url
          ),
          item_types:item_type_id (
            id,
            name,
            slug,
            color,
            icon_name,
            icon_url
          )
        `)
        .order('created_at', { ascending: false });

      if (filters?.item_type) {
        query = query.eq('item_type', filters.item_type);
      }

      if (filters?.item_type_id) {
        query = query.eq('item_type_id', filters.item_type_id);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as WarehouseItem[];
    },
  });
};

export const useWarehouseItem = (id: string) => {
  return useQuery({
    queryKey: ['warehouse-item', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warehouse_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as WarehouseItem;
    },
    enabled: !!id,
  });
};

export const useCreateWarehouseItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateWarehouseItemData) => {
      const { data: result, error } = await supabase
        .from('warehouse_items')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast({
        title: 'Úspech',
        description: 'Položka bola úspešne vytvorená',
      });
    },
    onError: (error) => {
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa vytvoriť položku',
        variant: 'destructive',
      });
      console.error('Error creating warehouse item:', error);
    },
  });
};

export const useUpdateWarehouseItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateWarehouseItemData) => {
      const { data: result, error } = await supabase
        .from('warehouse_items')
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
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-item'] });
      toast({
        title: 'Úspech',
        description: 'Položka bola úspešne aktualizovaná',
      });
    },
    onError: (error) => {
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa aktualizovať položku',
        variant: 'destructive',
      });
      console.error('Error updating warehouse item:', error);
    },
  });
};

export const useDeleteWarehouseItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('warehouse_items')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast({
        title: 'Úspech',
        description: 'Položka bola úspešne vymazaná',
      });
    },
    onError: (error) => {
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa vymazať položku',
        variant: 'destructive',
      });
      console.error('Error deleting warehouse item:', error);
    },
  });
};