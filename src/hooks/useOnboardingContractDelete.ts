
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOnboardingContractDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteContract = async (contractId: string) => {
    setIsDeleting(true);
    
    try {
      console.log('Deleting contract:', contractId);
      
      // S CASCADE DELETE constraints stačí zmazať iba contract
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
