
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOnboardingContractDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteContract = async (contractId: string) => {
    setIsDeleting(true);
    
    try {
      console.log('Deleting contract:', contractId);
      
      // Delete in correct order due to foreign key constraints
      // Delete each table individually to avoid TypeScript type issues
      
      const { error: contactInfoError } = await supabase
        .from('contact_info')
        .delete()
        .eq('contract_id', contractId);
      if (contactInfoError) console.error('Error deleting contact_info:', contactInfoError);

      const { error: companyInfoError } = await supabase
        .from('company_info')
        .delete()
        .eq('contract_id', contractId);
      if (companyInfoError) console.error('Error deleting company_info:', companyInfoError);

      const { error: businessLocationsError } = await supabase
        .from('business_locations')
        .delete()
        .eq('contract_id', contractId);
      if (businessLocationsError) console.error('Error deleting business_locations:', businessLocationsError);

      const { error: deviceSelectionError } = await supabase
        .from('device_selection')
        .delete()
        .eq('contract_id', contractId);
      if (deviceSelectionError) console.error('Error deleting device_selection:', deviceSelectionError);

      const { error: contractItemAddonsError } = await supabase
        .from('contract_item_addons')
        .delete()
        .in('contract_item_id', 
          supabase.from('contract_items').select('id').eq('contract_id', contractId)
        );
      if (contractItemAddonsError) console.error('Error deleting contract_item_addons:', contractItemAddonsError);

      const { error: contractItemsError } = await supabase
        .from('contract_items')
        .delete()
        .eq('contract_id', contractId);
      if (contractItemsError) console.error('Error deleting contract_items:', contractItemsError);

      const { error: contractCalculationsError } = await supabase
        .from('contract_calculations')
        .delete()
        .eq('contract_id', contractId);
      if (contractCalculationsError) console.error('Error deleting contract_calculations:', contractCalculationsError);

      const { error: authorizedPersonsError } = await supabase
        .from('authorized_persons')
        .delete()
        .eq('contract_id', contractId);
      if (authorizedPersonsError) console.error('Error deleting authorized_persons:', authorizedPersonsError);

      const { error: actualOwnersError } = await supabase
        .from('actual_owners')
        .delete()
        .eq('contract_id', contractId);
      if (actualOwnersError) console.error('Error deleting actual_owners:', actualOwnersError);

      const { error: consentsError } = await supabase
        .from('consents')
        .delete()
        .eq('contract_id', contractId);
      if (consentsError) console.error('Error deleting consents:', consentsError);

      const { error: locationAssignmentsError } = await supabase
        .from('location_assignments')
        .delete()
        .eq('contract_id', contractId);
      if (locationAssignmentsError) console.error('Error deleting location_assignments:', locationAssignmentsError);

      // Finally delete the contract itself
      const { error: contractError } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contractId);

      if (contractError) {
        throw new Error(`Chyba pri vymazávaní zmluvy: ${contractError.message}`);
      }

      console.log('Contract deleted successfully');
      
      toast.success('Zmluva vymazaná', {
        description: 'Zmluva a všetky súvisiace údaje boli úspešne vymazané'
      });

      return { success: true };

    } catch (error) {
      console.error('Contract deletion error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba';
      
      toast.error('Chyba pri vymazávaní zmluvy', {
        description: errorMessage
      });

      return { success: false, error };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteContract,
    isDeleting
  };
};
