
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CustomFieldDefinition {
  id: string;
  category_id: string | null;
  item_type_id: string | null;
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
  created_at: string;
  updated_at: string;
}

export interface CreateCustomFieldDefinitionData {
  category_id?: string;
  item_type_id?: string;
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
}

export const useCustomFieldDefinitions = (categoryId?: string, itemTypeId?: string) => {
  return useQuery({
    queryKey: ['custom_field_definitions', { categoryId, itemTypeId }],
    queryFn: async () => {
      console.log('Fetching custom field definitions for:', { categoryId, itemTypeId });
      
      let query = supabase
        .from('custom_field_definitions')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      // Only filter if both category and item type are provided
      if (categoryId && itemTypeId) {
        query = query.or(`category_id.eq.${categoryId},item_type_id.eq.${itemTypeId}`);
      } else if (categoryId) {
        query = query.eq('category_id', categoryId);
      } else if (itemTypeId) {
        query = query.eq('item_type_id', itemTypeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching custom field definitions:', error);
        throw error;
      }

      console.log('Fetched custom field definitions:', data);
      return data as CustomFieldDefinition[];
    },
    enabled: !!(categoryId || itemTypeId), // Only run if at least one filter is provided
  });
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
