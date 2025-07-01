
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMerchantCreation } from './useMerchantCreation';

export const useContractCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { ensureMerchantExists } = useMerchantCreation();

  const createContract = async (retryCount = 0): Promise<{ success: boolean; contractId?: string; contractNumber?: string; error?: any }> => {
    setIsCreating(true);
    
    try {
      console.log(`Creating new contract (attempt ${retryCount + 1})...`);
      
      // Get current user ID for attribution
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting current user:', userError);
        throw new Error('Nie je možné identifikovať používateľa');
      }

      const { data: contract, error } = await supabase
        .from('contracts')
        .insert({
          status: 'draft',
          notes: 'Contract created via onboarding portal',
          created_by: user?.id // Automatically assign the creator
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
        .select('id, contract_number, created_by')
        .eq('id', contract.id)
        .single();

      if (verifyError || !verification) {
        console.error('Contract creation verification failed:', verifyError);
        throw new Error('Contract creation could not be verified');
      }

      toast.success('Zmluva vytvorená!', {
        description: `Číslo zmluvy: ${contract.contract_number}`
      });

      console.log('Contract created with attribution:', {
        contractId: contract.id,
        contractNumber: contract.contract_number,
        createdBy: verification.created_by
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

  const createContractWithMerchant = async (retryCount = 0) => {
    const contractResult = await createContract(retryCount);
    
    if (!contractResult.success || !contractResult.contractId) {
      return contractResult;
    }

    // Return contract info, merchant will be created later by triggers
    return {
      success: true,
      contractId: contractResult.contractId,
      contractNumber: contractResult.contractNumber,
      merchantNote: 'Merchant will be created automatically when contact and company info are provided'
    };
  };

  const validateContractAndMerchant = async (contractId: string) => {
    try {
      console.log('Validating contract and merchant for:', contractId);
      
      // Validate merchant creation
      const merchantResult = await ensureMerchantExists(contractId);
      
      if (!merchantResult.success) {
        console.warn('Merchant validation failed, but contract exists');
        return {
          success: true, // Contract exists even if merchant creation failed
          contractId,
          merchantCreated: false,
          merchantError: merchantResult.error
        };
      }

      return {
        success: true,
        contractId,
        merchantCreated: true,
        merchant: merchantResult.merchant
      };
    } catch (error) {
      console.error('Contract and merchant validation error:', error);
      return {
        success: false,
        error
      };
    }
  };

  return {
    createContract,
    createContractWithMerchant,
    validateContractAndMerchant,
    isCreating
  };
};
