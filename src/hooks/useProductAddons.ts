import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProductAddon {
  id: string;
  parent_product_id: string;
  addon_product_id: string;
  is_required: boolean;
  is_default_selected: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Joined data from warehouse_items
  addon_product?: {
    id: string;
    name: string;
    description: string;
    monthly_fee: number;
    company_cost: number;
    category: string;
    item_type: string;
  };
}

export interface CreateProductAddonData {
  parent_product_id: string;
  addon_product_id: string;
  is_required?: boolean;
  is_default_selected?: boolean;
  display_order?: number;
}

export interface UpdateProductAddonData {
  is_required?: boolean;
  is_default_selected?: boolean;
  display_order?: number;
}

// Get all product addons with optional filtering
export const useProductAddons = (filters?: {
  parent_product_id?: string;
  addon_product_id?: string;
}) => {
  return useQuery({
    queryKey: ['product_addons', filters],
    queryFn: async () => {
      let query = supabase
        .from('product_addons')
        .select(`
          *,
          addon_product:warehouse_items!addon_product_id(
            id,
            name,
            description,
            monthly_fee,
            company_cost,
            category,
            item_type
          )
        `)
        .order('display_order', { ascending: true });

      if (filters?.parent_product_id) {
        query = query.eq('parent_product_id', filters.parent_product_id);
      }

      if (filters?.addon_product_id) {
        query = query.eq('addon_product_id', filters.addon_product_id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching product addons:', error);
        throw error;
      }

      return data as ProductAddon[];
    },
  });
};

// Get addons for a specific parent product
export const useProductAddonsByParent = (parentProductId: string) => {
  return useProductAddons({ parent_product_id: parentProductId });
};

// Get all products that have addons assigned
export const useProductsWithAddons = () => {
  return useQuery({
    queryKey: ['products_with_addons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warehouse_items')
        .select(`
          id,
          name,
          description,
          category,
          item_type,
          product_addons:product_addons!parent_product_id(
            id,
            addon_product_id,
            is_required,
            is_default_selected,
            display_order,
            addon_product:warehouse_items!addon_product_id(
              id,
              name,
              description,
              monthly_fee,
              company_cost,
              category,
              item_type
            )
          )
        `)
        .eq('is_active', true)
        .not('product_addons', 'is', null);

      if (error) {
        console.error('Error fetching products with addons:', error);
        throw error;
      }

      return data;
    },
  });
};

// Create a new product addon relationship
export const useCreateProductAddon = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateProductAddonData) => {
      const { data: result, error } = await supabase
        .from('product_addons')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product_addons'] });
      queryClient.invalidateQueries({ queryKey: ['products_with_addons'] });
      toast({
        title: "Úspech",
        description: "Doplnok bol úspešne priradený k produktu.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating product addon:', error);
      toast({
        title: "Chyba",
        description: error.message || "Nepodarilo sa priradiť doplnok k produktu.",
        variant: "destructive",
      });
    },
  });
};

// Update an existing product addon
export const useUpdateProductAddon = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateProductAddonData & { id: string }) => {
      const { data: result, error } = await supabase
        .from('product_addons')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product_addons'] });
      queryClient.invalidateQueries({ queryKey: ['products_with_addons'] });
      toast({
        title: "Úspech",
        description: "Nastavenia doplnku boli úspešne aktualizované.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating product addon:', error);
      toast({
        title: "Chyba",
        description: error.message || "Nepodarilo sa aktualizovať nastavenia doplnku.",
        variant: "destructive",
      });
    },
  });
};

// Remove a product addon relationship
export const useDeleteProductAddon = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_addons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product_addons'] });
      queryClient.invalidateQueries({ queryKey: ['products_with_addons'] });
      toast({
        title: "Úspech",
        description: "Doplnok bol úspešne odstránený z produktu.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting product addon:', error);
      toast({
        title: "Chyba",
        description: error.message || "Nepodarilo sa odstrániť doplnok z produktu.",
        variant: "destructive",
      });
    },
  });
};

// Get available items that can be addons (excluding self and already assigned)
export const useAvailableAddons = (parentProductId: string) => {
  return useQuery({
    queryKey: ['available_addons', parentProductId],
    queryFn: async () => {
      // Get currently assigned addons
      const { data: currentAddons } = await supabase
        .from('product_addons')
        .select('addon_product_id')
        .eq('parent_product_id', parentProductId);

      const assignedIds = currentAddons?.map(addon => addon.addon_product_id) || [];

      // Get all warehouse items excluding parent and already assigned
      let query = supabase
        .from('warehouse_items')
        .select('*')
        .eq('is_active', true)
        .neq('id', parentProductId);

      if (assignedIds.length > 0) {
        query = query.not('id', 'in', `(${assignedIds.join(',')})`);
      }

      const { data, error } = await query.order('name');

      if (error) {
        console.error('Error fetching available addons:', error);
        throw error;
      }

      return data;
    },
    enabled: !!parentProductId,
  });
};