
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useContractDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractId: string) => {
      console.log('Deleting contract:', contractId);

      // Delete all related data first
      const tables = [
        'actual_owners',
        'authorized_persons', 
        'business_locations',
        'device_selection',
        'consents',
        'contact_info',
        'company_info',
        'location_assignments'
      ];

      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('contract_id', contractId);
        
        if (error) {
          console.error(`Error deleting from ${table}:`, error);
          throw new Error(`Chyba pri mazaní dát z tabuľky ${table}`);
        }
      }

      // Finally delete the contract
      const { error: contractError } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId);

      if (contractError) {
        console.error('Error deleting contract:', contractError);
        throw contractError;
      }

      console.log('Contract deleted successfully');
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts-stats'] });
      toast({
        title: "Zmluva zmazaná",
        description: "Zmluva bola úspešne zmazaná.",
      });
    },
    onError: (error) => {
      console.error('Error deleting contract:', error);
      toast({
        title: "Chyba pri mazaní",
        description: "Nepodarilo sa zmazať zmluvu. Skúste to znovu.",
        variant: "destructive",
      });
    }
  });
};
