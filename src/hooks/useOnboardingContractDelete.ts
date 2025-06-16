
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOnboardingContractDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteContract = async (contractId: string) => {
    setIsDeleting(true);
    
    try {
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

    } catch (error) {
      console.error('Contract deletion error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba';
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteContract,
    isDeleting
  };
};
