import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomFieldDefinition {
  id: string;
  category_id: string | null;
  item_type_id: string | null;
  warehouse_item_id: string | null;
  field_name: string;
  field_key: string;
  field_type: 'text' | 'number' | 'boolean' | 'select' | 'checkbox' | 'textarea' | 'checkbox_group';
  field_options: {
    options?: Array<{ value: string; label: string }>;
  } | null;
  is_required: boolean;
  default_value: string | null;
  validation_rules: any;
  display_order: number;
  help_text: string | null;
  is_active: boolean;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomFieldDefinitionData {
  category_id?: string;
  item_type_id?: string;
  warehouse_item_id?: string;
  field_name: string;
  field_key: string;
  field_type: 'text' | 'number' | 'boolean' | 'select' | 'checkbox' | 'textarea' | 'checkbox_group';
  field_options?: {
    options?: Array<{ value: string; label: string }>;
  };
  is_required?: boolean;
  default_value?: string;
  validation_rules?: any;
  display_order?: number;
  help_text?: string;
  is_template?: boolean;
}

export const useCustomFieldDefinitions = (categoryId?: string, itemTypeId?: string, warehouseItemId?: string) => {
  return useQuery({
    queryKey: ['custom_field_definitions', { categoryId, itemTypeId, warehouseItemId }],
    queryFn: async () => {
      let query = supabase
        .from('custom_field_definitions')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (warehouseItemId) {
        // Get fields for specific product
        query = query.eq('warehouse_item_id', warehouseItemId);
      } else if (categoryId || itemTypeId) {
        // Get template fields from category/item type
        query = query.eq('is_template', true);
        
        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        if (itemTypeId) {
          query = query.eq('item_type_id', itemTypeId);
        }
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as CustomFieldDefinition[];
    },
  });
};

// Hook for product-specific custom fields
export const useProductCustomFields = (warehouseItemId: string) => {
  return useCustomFieldDefinitions(undefined, undefined, warehouseItemId);
};

// Hook for template custom fields from category
export const useTemplateCustomFields = (categoryId?: string, itemTypeId?: string) => {
  return useCustomFieldDefinitions(categoryId, itemTypeId);
};

export const useCreateCustomFieldDefinition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateCustomFieldDefinitionData) => {
      const { data: fieldDefinition, error } = await supabase
        .from('custom_field_definitions')
        .insert([data])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return fieldDefinition;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_field_definitions'] });
      toast({
        title: 'Úspech',
        description: 'Definícia vlastného poľa bola vytvorená',
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

export const useUpdateCustomFieldDefinition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: CustomFieldDefinition) => {
      const { data: fieldDefinition, error } = await supabase
        .from('custom_field_definitions')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return fieldDefinition;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_field_definitions'] });
      toast({
        title: 'Úspech',
        description: 'Definícia vlastného poľa bola aktualizovaná',
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

export const useDeleteCustomFieldDefinition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_field_definitions')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_field_definitions'] });
      toast({
        title: 'Úspech',
        description: 'Definícia vlastného poľa bola zmazaná',
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

// Hook for copying template fields to a product
export const useCopyTemplateFields = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ warehouseItemId, categoryId, itemTypeId }: { warehouseItemId: string; categoryId?: string; itemTypeId?: string }) => {
      // First get template fields
      let query = supabase
        .from('custom_field_definitions')
        .select('*')
        .eq('is_active', true)
        .eq('is_template', true);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (itemTypeId) {
        query = query.eq('item_type_id', itemTypeId);
      }

      const { data: templateFields, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      if (!templateFields || templateFields.length === 0) {
        throw new Error('Žiadne template polia neboli nájdené');
      }

      // Copy fields to product
      const productFields = templateFields.map(field => ({
        warehouse_item_id: warehouseItemId,
        field_name: field.field_name,
        field_key: field.field_key,
        field_type: field.field_type,
        field_options: field.field_options,
        is_required: field.is_required,
        default_value: field.default_value,
        validation_rules: field.validation_rules,
        display_order: field.display_order,
        help_text: field.help_text,
        is_template: false,
        is_active: true
      }));

      const { data: createdFields, error: createError } = await supabase
        .from('custom_field_definitions')
        .insert(productFields)
        .select();

      if (createError) {
        throw createError;
      }

      return createdFields;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_field_definitions'] });
      toast({
        title: 'Úspech',
        description: 'Template polia boli skopírované do produktu',
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