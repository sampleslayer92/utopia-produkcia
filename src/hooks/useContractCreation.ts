
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useContractCreation = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createContract = async (retryCount = 0): Promise<{ success: boolean; contractId?: string; contractNumber?: string; error?: any }> => {
    setIsCreating(true);
    
    try {
      console.log(`Creating new contract (attempt ${retryCount + 1})...`);
      
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
        
        // Retry logic for transient errors
        if (retryCount < 2 && (error.code === 'PGRST301' || error.message.includes('timeout'))) {
          console.log('Retrying contract creation...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return createContract(retryCount + 1);
        }
        
        throw error;
      }

      console.log('Contract created successfully:', contract);
      
      // Verify the contract was actually created
      const { data: verification, error: verifyError } = await supabase
        .from('contracts')
        .select('id, contract_number')
        .eq('id', contract.id)
        .single();

      if (verifyError || !verification) {
        console.error('Contract creation verification failed:', verifyError);
        throw new Error('Contract creation could not be verified');
      }

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
        description: retryCount < 2 ? 'Pokúšam sa znova...' : 'Skúste to prosím znova'
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
