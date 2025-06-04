
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBulkContractActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const bulkUpdateType = useMutation({
    mutationFn: async ({ contractIds, contractType }: { contractIds: string[], contractType: string }) => {
      console.log('Bulk updating contract type:', { contractIds, contractType });
      
      const { error } = await supabase
        .from('contracts')
        .update({ contract_type: contractType })
        .in('id', contractIds);

      if (error) {
        console.error('Error updating contract types:', error);
        throw error;
      }
    },
    onSuccess: (_, { contractIds }) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
      toast({
        title: "Typ zmluvy aktualizovaný",
        description: `Typ zmluvy bol úspešne zmenený pre ${contractIds.length} zmlúv.`,
      });
    },
    onError: (error) => {
      console.error('Bulk update type error:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať typ zmluvy.",
        variant: "destructive",
      });
    },
  });

  const bulkUpdateSalesperson = useMutation({
    mutationFn: async ({ contractIds, salesperson }: { contractIds: string[], salesperson: string }) => {
      console.log('Bulk updating salesperson:', { contractIds, salesperson });
      
      const { error } = await supabase
        .from('contracts')
        .update({ salesperson })
        .in('id', contractIds);

      if (error) {
        console.error('Error updating salesperson:', error);
        throw error;
      }
    },
    onSuccess: (_, { contractIds }) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
      toast({
        title: "Obchodník aktualizovaný",
        description: `Obchodník bol úspešne zmenený pre ${contractIds.length} zmlúv.`,
      });
    },
    onError: (error) => {
      console.error('Bulk update salesperson error:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať obchodníka.",
        variant: "destructive",
      });
    },
  });

  const bulkDelete = useMutation({
    mutationFn: async (contractIds: string[]) => {
      console.log('Bulk deleting contracts:', contractIds);
      
      const { error } = await supabase
        .from('contracts')
        .delete()
        .in('id', contractIds);

      if (error) {
        console.error('Error deleting contracts:', error);
        throw error;
      }
    },
    onSuccess: (_, contractIds) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
      toast({
        title: "Zmluvy vymazané",
        description: `${contractIds.length} zmlúv bolo úspešne vymazaných.`,
      });
    },
    onError: (error) => {
      console.error('Bulk delete error:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vymazať zmluvy.",
        variant: "destructive",
      });
    },
  });

  return {
    bulkUpdateType,
    bulkUpdateSalesperson,
    bulkDelete,
    isLoading: bulkUpdateType.isPending || bulkUpdateSalesperson.isPending || bulkDelete.isPending,
  };
};
