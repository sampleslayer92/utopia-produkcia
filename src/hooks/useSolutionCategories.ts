import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SolutionCategory {
  id: string;
  solution_id: string;
  category_id: string;
  position: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon_name: string | null;
    icon_url: string | null;
    description: string | null;
    is_active: boolean;
  };
}

export interface CreateSolutionCategoryData {
  solution_id: string;
  category_id: string;
  position?: number;
  is_featured?: boolean;
}

export interface UpdateSolutionCategoryData extends CreateSolutionCategoryData {
  id: string;
}

// Get solution categories for a specific solution
export const useSolutionCategories = (solutionId?: string) => {
  return useQuery({
    queryKey: ['solution-categories', solutionId],
    queryFn: async () => {
      let query = supabase
        .from('solution_categories')
        .select(`
          *,
          category:categories(*)
        `)
        .order('position', { ascending: true });
      
      if (solutionId) {
        query = query.eq('solution_id', solutionId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching solution categories:', error);
        throw error;
      }
      
      return data as SolutionCategory[];
    },
    enabled: !!solutionId,
  });
};

// Create solution category
export const useCreateSolutionCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSolutionCategoryData) => {
      const { data: result, error } = await supabase
        .from('solution_categories')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating solution category:', error);
        throw error;
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solution-categories'] });
      toast({
        title: 'Success',
        description: 'Category added to solution successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating solution category:', error);
      toast({
        title: 'Error',
        description: 'Failed to add category to solution',
        variant: 'destructive',
      });
    },
  });
};

// Update solution category
export const useUpdateSolutionCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateSolutionCategoryData) => {
      const { data, error } = await supabase
        .from('solution_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating solution category:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solution-categories'] });
      toast({
        title: 'Success',
        description: 'Solution category updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating solution category:', error);
      toast({
        title: 'Error',
        description: 'Failed to update solution category',
        variant: 'destructive',
      });
    },
  });
};

// Delete solution category
export const useDeleteSolutionCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('solution_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting solution category:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solution-categories'] });
      toast({
        title: 'Success',
        description: 'Category removed from solution successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting solution category:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove category from solution',
        variant: 'destructive',
      });
    },
  });
};

// Update solution categories order
export const useUpdateSolutionCategoriesOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (categories: Array<{ id: string; position: number }>) => {
      const updates = categories.map(cat => 
        supabase
          .from('solution_categories')
          .update({ position: cat.position })
          .eq('id', cat.id)
      );

      const results = await Promise.all(updates);
      
      for (const result of results) {
        if (result.error) {
          console.error('Error updating solution category position:', result.error);
          throw result.error;
        }
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solution-categories'] });
      toast({
        title: 'Success',
        description: 'Category order updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating solution categories order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category order',
        variant: 'destructive',
      });
    },
  });
};