
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DynamicCard } from '@/types/onboarding';
import { toast } from '@/hooks/use-toast';

export const useContractItems = (contractId: string) => {
  const queryClient = useQueryClient();

  const addItemMutation = useMutation({
    mutationFn: async (item: DynamicCard) => {
      console.log('Adding contract item:', item);

      // Insert main contract item
      const { data: contractItem, error: itemError } = await supabase
        .from('contract_items')
        .insert({
          contract_id: contractId,
          item_id: item.id,
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
              name: addon.name,
              description: addon.description || '',
              category: addon.category,
              quantity: addon.customQuantity || 1,
              monthly_fee: addon.monthlyFee,
              company_cost: addon.companyCost || 0,
              is_per_device: addon.isPerDevice
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
      // Use the same query key as useContractQueries
      queryClient.invalidateQueries({ queryKey: ['contract-complete', contractId] });
      toast({
        title: "Položka pridaná",
        description: "Zariadenie/služba bola úspešne pridaná do zmluvy.",
      });
    },
    onError: (error) => {
      console.error('Error adding contract item:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať položku do zmluvy.",
        variant: "destructive",
      });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, updates }: { itemId: string; updates: Partial<DynamicCard> }) => {
      console.log('Updating contract item:', itemId, updates);

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
