
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DynamicCard } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';
import { useContractValidation } from './useContractValidation';

export const useContractItems = (contractId: string) => {
  const queryClient = useQueryClient();
  const { validateContractExists } = useContractValidation();

  const addItemMutation = useMutation({
    mutationFn: async (item: DynamicCard) => {
      console.log('Adding contract item:', item);

      // Validate contract exists before adding item
      const contractExists = await validateContractExists(contractId);
      if (!contractExists) {
        throw new Error(`Zmluva s ID ${contractId} neexistuje. Prosím obnovte stránku a skúste znova.`);
      }

      // Check if this is a warehouse item or custom onboarding item
      let warehouseItemId: string | null = null;
      
      // Try to find matching warehouse item by catalogId
      if (item.catalogId) {
        const { data: warehouseItem } = await supabase
          .from('warehouse_items')
          .select('id')
          .eq('id', item.catalogId)
          .maybeSingle();
        
        warehouseItemId = warehouseItem?.id || null;
      }

      // Check if item with same item_id already exists
      const { data: existingItems, error: checkError } = await supabase
        .from('contract_items')
        .select('id, item_id')
        .eq('contract_id', contractId)
        .eq('item_id', item.id);

      if (checkError) {
        console.error('Error checking existing items:', checkError);
        throw checkError;
      }

      if (existingItems && existingItems.length > 0) {
        console.log('Item already exists, updating instead of inserting');
        // Update existing item instead of creating duplicate
        const { data: updatedItem, error: updateError } = await supabase
          .from('contract_items')
          .update({
            count: item.count,
            monthly_fee: item.monthlyFee,
            company_cost: item.companyCost || 0,
            name: item.name,
            description: item.description,
            category: item.category,
            warehouse_item_id: warehouseItemId
          })
          .eq('id', existingItems[0].id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating existing item:', updateError);
          throw updateError;
        }

        return updatedItem;
      }

      // Insert main contract item (only if it doesn't exist)
      const { data: contractItem, error: itemError } = await supabase
        .from('contract_items')
        .insert({
          contract_id: contractId,
          item_id: item.id, // Keep the onboarding UUID as item_id
          warehouse_item_id: warehouseItemId, // Reference to warehouse item if exists
          item_type: item.type,
          category: item.category,
          name: item.name,
          description: item.description,
          count: item.count,
          monthly_fee: item.monthlyFee,
          company_cost: item.companyCost || 0
        })
        .select()
        .single();

      if (itemError) {
        console.error('Error inserting contract item:', itemError);
        
        // Provide more specific error messages
        if (itemError.code === '23503') {
          throw new Error(`Zmluva s ID ${contractId} neexistuje. Prosím obnovte stránku a skúste znova.`);
        }
        
        throw itemError;
      }

      console.log('Contract item inserted successfully:', contractItem);

      // Insert addons if any
      if (item.addons && item.addons.length > 0) {
        console.log('Inserting addons:', item.addons);
        const { error: addonsError } = await supabase
          .from('contract_item_addons')
          .insert(
            item.addons.map(addon => ({
              contract_item_id: contractItem.id,
              addon_id: addon.id,
              addon_name: addon.name,
              count: addon.customQuantity || 1,
              monthly_fee: addon.monthlyFee || 0,
              company_cost: addon.companyCost || 0
            }))
          );

        if (addonsError) {
          console.error('Error inserting addons:', addonsError);
          throw addonsError;
        }
      }

      return contractItem;
    },
    onSuccess: () => {
      console.log('Item added successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['contract-complete', contractId] });
      toast({
        title: "Položka pridaná",
        description: "Zariadenie/služba bola úspešne pridaná do zmluvy.",
      });
    },
    onError: (error) => {
      console.error('Error adding contract item:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Nepodarilo sa pridať položku do zmluvy.';
      
      toast({
        title: "Chyba",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, updates }: { itemId: string; updates: Partial<DynamicCard> }) => {
      console.log('Updating contract item:', itemId, updates);

      // Validate contract exists before updating item
      const contractExists = await validateContractExists(contractId);
      if (!contractExists) {
        throw new Error(`Zmluva s ID ${contractId} neexistuje.`);
      }

      const { error } = await supabase
        .from('contract_items')
        .update({
          count: updates.count,
          monthly_fee: updates.monthlyFee,
          company_cost: updates.companyCost
        })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating contract item:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Item updated successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['contract-complete', contractId] });
      toast({
        title: "Položka aktualizovaná",
        description: "Zmeny boli úspešne uložené.",
      });
    },
    onError: (error) => {
      console.error('Error updating contract item:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať položku.",
        variant: "destructive",
      });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      console.log('Deleting contract item:', itemId);

      // Delete addons first (foreign key constraint)
      const { error: addonsError } = await supabase
        .from('contract_item_addons')
        .delete()
        .eq('contract_item_id', itemId);

      if (addonsError) {
        console.error('Error deleting addons:', addonsError);
        throw addonsError;
      }

      // Delete main item
      const { error: itemError } = await supabase
        .from('contract_items')
        .delete()
        .eq('id', itemId);

      if (itemError) {
        console.error('Error deleting item:', itemError);
        throw itemError;
      }

      console.log('Item deleted successfully');
    },
    onSuccess: () => {
      console.log('Item deleted successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['contract-complete', contractId] });
      toast({
        title: "Položka odstránená",
        description: "Zariadenie/služba bola úspešne odstránená zo zmluvy.",
      });
    },
    onError: (error) => {
      console.error('Error deleting contract item:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa odstrániť položku zo zmluvy.",
        variant: "destructive",
      });
    }
  });

  return {
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation,
    isAdding: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isDeleting: deleteItemMutation.isPending
  };
};
