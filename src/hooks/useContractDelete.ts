
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContractDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractId: string) => {
      console.log('Deleting contract:', contractId);

      // Vďaka CASCADE DELETE constraints stačí zmazať iba contract
      // Všetky súvisiace dáta sa zmažú automaticky
      const { error: contractError } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId);

      if (contractError) {
        console.error('Error deleting contract:', contractError);
        throw new Error(`Chyba pri mazaní zmluvy: ${contractError.message || contractError.details || 'Neznáma chyba'}`);
      }

      console.log('Contract deleted successfully');
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts-stats'] });
    },
    onError: (error) => {
      console.error('Error deleting contract:', error);
      // Nerobíme toast tu, necháme to na komponent
    }
  });
};
