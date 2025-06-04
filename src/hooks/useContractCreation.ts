
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useContractCreation = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createContract = async () => {
    setIsCreating(true);
    
    try {
      console.log('Creating new contract...');
      
      const { data: contract, error } = await supabase
        .from('contracts')
        .insert({
          status: 'draft',
          notes: 'Contract created via onboarding portal'
        })
        .select('id, contract_number')
        .single();

      if (error) {
        console.error('Error creating contract:', error);
        throw error;
      }

      console.log('Contract created successfully:', contract);
      
      toast.success('Zmluva vytvorená!', {
        description: `Číslo zmluvy: ${contract.contract_number}`
      });

      return {
        success: true,
        contractId: contract.id,
        contractNumber: contract.contract_number
      };

    } catch (error) {
      console.error('Contract creation error:', error);
      
      toast.error('Chyba pri vytváraní zmluvy', {
        description: 'Skúste to prosím znova'
      });

      return {
        success: false,
        error: error
      };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createContract,
    isCreating
  };
};
