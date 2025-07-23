
import { supabase } from '@/integrations/supabase/client';
import { useGenericBulkActions } from './useGenericBulkActions';

export const useBulkCategoryActions = () => {
  const bulkDelete = async (categoryIds: string[]) => {
    console.log('Bulk deleting categories:', categoryIds);
    
    // Check if any category has warehouse items
    const { data: itemsCheck } = await supabase
      .from('warehouse_items')
      .select('id, category_id')
      .in('category_id', categoryIds);
    
    if (itemsCheck && itemsCheck.length > 0) {
      throw new Error('Nemôžete vymazať kategórie, ktoré majú priradenú skladové položky. Najprv presuňte položky do inej kategórie.');
    }
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .in('id', categoryIds);
    
    if (error) throw error;
  };

  const bulkActivate = async (categoryIds: string[]) => {
    console.log('Bulk activating categories:', categoryIds);
    
    const { error } = await supabase
      .from('categories')
      .update({ is_active: true })
      .in('id', categoryIds);
    
    if (error) throw error;
  };

  const bulkDeactivate = async (categoryIds: string[]) => {
    console.log('Bulk deactivating categories:', categoryIds);
    
    const { error } = await supabase
      .from('categories')
      .update({ is_active: false })
      .in('id', categoryIds);
    
    if (error) throw error;
  };

  return useGenericBulkActions({
    entityName: 'kategóriu',
    queryKey: ['categories'],
    bulkDelete,
    bulkActivate,
    bulkDeactivate
  });
};
