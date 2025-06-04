
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
      const tablesToClear = [
        'contact_info',
        'company_info', 
        'business_locations',
        'device_selection',
        'contract_items',
        'contract_item_addons',
        'contract_calculations',
        'authorized_persons',
        'actual_owners',
        'consents',
        'location_assignments'
      ] as const;

      // Delete all related records
      for (const table of tablesToClear) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('contract_id', contractId);
          
        if (error) {
          console.error(`Error deleting from ${table}:`, error);
          // Continue with other tables even if one fails
        }
      }

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
