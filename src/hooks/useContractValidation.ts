
import { supabase } from '@/integrations/supabase/client';

export const useContractValidation = () => {
  const validateContractExists = async (contractId: string): Promise<boolean> => {
    if (!contractId || contractId === 'undefined') {
      console.error('Invalid contract ID provided:', contractId);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('id')
        .eq('id', contractId)
        .single();

      if (error) {
        console.error('Error validating contract existence:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Contract validation failed:', error);
      return false;
    }
  };

  const ensureContractExists = async (contractId: string): Promise<{ exists: boolean; contractId: string }> => {
    const exists = await validateContractExists(contractId);
    
    if (!exists) {
      console.warn(`Contract ${contractId} does not exist, attempting to create new one`);
      
      try {
        const { data: newContract, error } = await supabase
          .from('contracts')
          .insert({
            status: 'draft',
            notes: 'Contract recreated due to validation failure'
          })
          .select('id, contract_number')
          .single();

        if (error) {
          console.error('Failed to create replacement contract:', error);
          throw error;
        }

        console.log('Created replacement contract:', newContract);
        return { exists: true, contractId: newContract.id };
      } catch (error) {
        console.error('Failed to create replacement contract:', error);
        return { exists: false, contractId };
      }
    }

    return { exists: true, contractId };
  };

  return {
    validateContractExists,
    ensureContractExists
  };
};
