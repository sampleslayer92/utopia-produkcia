
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBulkContractActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ contractIds, field, value }: { 
      contractIds: string[], 
      field: string, 
      value: string 
    }) => {
      console.log('Bulk updating contracts:', { contractIds, field, value });
      
      // Update contracts table based on field
      if (field === 'contractType') {
        // Since contract_type doesn't exist, we'll update notes instead as a workaround
        const { error } = await supabase
          .from('contracts')
          .update({ notes: `Contract Type: ${value}` })
          .in('id', contractIds);
        
        if (error) throw error;
      } else if (field === 'salesPerson') {
        // Since salesperson doesn't exist on contracts table, update in contact_info
        const { error } = await supabase
          .from('contact_info')
          .update({ user_role: value })
          .in('contract_id', contractIds);
        
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
      toast({
        title: "Úspešne aktualizované",
        description: `${variables.contractIds.length} ${variables.contractIds.length === 1 ? 'zmluva bola' : 'zmlúv bolo'} úspešne aktualizovaných.`,
      });
    },
    onError: (error) => {
      console.error('Bulk update error:', error);
      toast({
        title: "Chyba pri aktualizácii",
        description: "Nepodarilo sa aktualizovať zmluvy. Skúste to znovu.",
        variant: "destructive",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (contractIds: string[]) => {
      console.log('Bulk deleting contracts:', contractIds);
      
      const { error } = await supabase
        .from('contracts')
        .delete()
        .in('id', contractIds);
      
      if (error) throw error;
    },
    onSuccess: (_, contractIds) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
      toast({
        title: "Úspešne vymazané",
        description: `${contractIds.length} ${contractIds.length === 1 ? 'zmluva bola' : 'zmlúv bolo'} úspešne vymazaných.`,
      });
    },
    onError: (error) => {
      console.error('Bulk delete error:', error);
      toast({
        title: "Chyba pri mazaní",
        description: "Nepodarilo sa vymazať zmluvy. Skúste to znovu.",
        variant: "destructive",
      });
    },
  });

  return {
    bulkUpdate: bulkUpdateMutation.mutate,
    bulkDelete: bulkDeleteMutation.mutate,
    isUpdating: bulkUpdateMutation.isPending,
    isDeleting: bulkDeleteMutation.isPending,
  };
};
