
import { supabase } from '@/integrations/supabase/client';
import { useMerchantCreation } from './useMerchantCreation';

export const useContractValidation = () => {
  const { checkMerchantStatus, ensureMerchantExists } = useMerchantCreation();

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

  const validateContractComplete = async (contractId: string) => {
    try {
      console.log('Validating complete contract setup for:', contractId);
      
      // Check merchant status
      const merchantStatus = await checkMerchantStatus(contractId);
      
      if (!merchantStatus.success) {
        return {
          success: false,
          error: merchantStatus.error,
          details: 'Failed to check merchant status'
        };
      }

      const status = merchantStatus.status;
      
      // Log current status
      console.log('Contract validation status:', {
        contractId: status.contractId,
        hasContactInfo: status.hasContactInfo,
        hasCompanyInfo: status.hasCompanyInfo,
        hasMerchant: status.hasMerchant,
        missingData: status.missingData
      });

      // If we have all required data but no merchant, try to create one
      if (status.hasContactInfo && status.hasCompanyInfo && !status.hasMerchant) {
        console.log('All data available but no merchant, attempting to create...');
        
        const merchantResult = await ensureMerchantExists(contractId);
        
        if (merchantResult.success) {
          return {
            success: true,
            contractId,
            merchantCreated: true,
            merchant: merchantResult.merchant,
            status: 'complete'
          };
        } else {
          return {
            success: false,
            error: merchantResult.error,
            details: 'Failed to create merchant despite having required data'
          };
        }
      }

      return {
        success: true,
        contractId,
        status: status.hasMerchant ? 'complete' : 'incomplete',
        merchantCreated: status.hasMerchant,
        missingData: status.missingData,
        details: status
      };

    } catch (error) {
      console.error('Contract complete validation failed:', error);
      return {
        success: false,
        error,
        details: 'Validation process failed'
      };
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
    validateContractComplete,
    ensureContractExists
  };
};
