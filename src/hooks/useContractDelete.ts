
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useContractDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractId: string) => {
      console.log('Deleting contract:', contractId);

      // Delete all related data first - using explicit table names for type safety
      const { error: actualOwnersError } = await supabase
        .from('actual_owners')
        .delete()
        .eq('contract_id', contractId);
      
      if (actualOwnersError) {
        console.error('Error deleting from actual_owners:', actualOwnersError);
        throw new Error('Chyba pri mazaní dát z tabuľky actual_owners');
      }

      const { error: authorizedPersonsError } = await supabase
        .from('authorized_persons')
        .delete()
        .eq('contract_id', contractId);
      
      if (authorizedPersonsError) {
        console.error('Error deleting from authorized_persons:', authorizedPersonsError);
        throw new Error('Chyba pri mazaní dát z tabuľky authorized_persons');
      }

      const { error: businessLocationsError } = await supabase
        .from('business_locations')
        .delete()
        .eq('contract_id', contractId);
      
      if (businessLocationsError) {
        console.error('Error deleting from business_locations:', businessLocationsError);
        throw new Error('Chyba pri mazaní dát z tabuľky business_locations');
      }

      const { error: deviceSelectionError } = await supabase
        .from('device_selection')
        .delete()
        .eq('contract_id', contractId);
      
      if (deviceSelectionError) {
        console.error('Error deleting from device_selection:', deviceSelectionError);
        throw new Error('Chyba pri mazaní dát z tabuľky device_selection');
      }

      const { error: consentsError } = await supabase
        .from('consents')
        .delete()
        .eq('contract_id', contractId);
      
      if (consentsError) {
        console.error('Error deleting from consents:', consentsError);
        throw new Error('Chyba pri mazaní dát z tabuľky consents');
      }

      const { error: contactInfoError } = await supabase
        .from('contact_info')
        .delete()
        .eq('contract_id', contractId);
      
      if (contactInfoError) {
        console.error('Error deleting from contact_info:', contactInfoError);
        throw new Error('Chyba pri mazaní dát z tabuľky contact_info');
      }

      const { error: companyInfoError } = await supabase
        .from('company_info')
        .delete()
        .eq('contract_id', contractId);
      
      if (companyInfoError) {
        console.error('Error deleting from company_info:', companyInfoError);
        throw new Error('Chyba pri mazaní dát z tabuľky company_info');
      }

      const { error: locationAssignmentsError } = await supabase
        .from('location_assignments')
        .delete()
        .eq('contract_id', contractId);
      
      if (locationAssignmentsError) {
        console.error('Error deleting from location_assignments:', locationAssignmentsError);
        throw new Error('Chyba pri mazaní dát z tabuľky location_assignments');
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
