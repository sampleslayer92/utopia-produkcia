
import { supabase } from '@/integrations/supabase/client';
import { useGenericBulkActions } from './useGenericBulkActions';

export const useBulkItemTypeActions = () => {
  const bulkDelete = async (itemTypeIds: string[]) => {
    console.log('Bulk deleting item types:', itemTypeIds);
    
    // Check if any item type has warehouse items
    const { data: itemsCheck } = await supabase
      .from('warehouse_items')
      .select('id, item_type_id')
      .in('item_type_id', itemTypeIds);
    
    if (itemsCheck && itemsCheck.length > 0) {
      throw new Error('Nemôžete vymazať typy položiek, ktoré majú priradenú skladové položky. Najprv presuňte položky do iného typu.');
    }
    
    const { error } = await supabase
      .from('item_types')
      .delete()
      .in('id', itemTypeIds);
    
    if (error) throw error;
  };

  const bulkActivate = async (itemTypeIds: string[]) => {
    console.log('Bulk activating item types:', itemTypeIds);
    
    const { error } = await supabase
      .from('item_types')
      .update({ is_active: true })
      .in('id', itemTypeIds);
    
    if (error) throw error;
  };

  const bulkDeactivate = async (itemTypeIds: string[]) => {
    console.log('Bulk deactivating item types:', itemTypeIds);
    
    const { error } = await supabase
      .from('item_types')
      .update({ is_active: false })
      .in('id', itemTypeIds);
    
    if (error) throw error;
  };

  return useGenericBulkActions({
    entityName: 'typ položky',
    queryKey: ['item-types'],
    bulkDelete,
    bulkActivate,
    bulkDeactivate
  });
};
