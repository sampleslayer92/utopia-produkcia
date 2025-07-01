
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMerchantCreation = () => {
  const [isCreating, setIsCreating] = useState(false);

  const validateMerchantCreation = async (contractId: string) => {
    try {
      console.log('Validating merchant creation for contract:', contractId);
      
      // Check if contract exists and has merchant_id
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select('id, contract_number, merchant_id')
        .eq('id', contractId)
        .single();

      if (contractError) {
        console.error('Error fetching contract:', contractError);
        return { success: false, error: contractError };
      }

      if (!contract.merchant_id) {
        console.warn('Contract does not have merchant_id, attempting to trigger creation');
        
        // Try to trigger merchant creation by updating the contract
        const { error: updateError } = await supabase
          .from('contracts')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', contractId);

        if (updateError) {
          console.error('Error triggering merchant creation:', updateError);
          return { success: false, error: updateError };
        }

        // Wait a bit and check again
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: updatedContract } = await supabase
          .from('contracts')
          .select('merchant_id')
          .eq('id', contractId)
          .single();

        if (!updatedContract?.merchant_id) {
          console.error('Merchant creation failed even after trigger');
          return { 
            success: false, 
            error: { message: 'Merchant creation failed - missing contact or company info' }
          };
        }
      }

      // Validate that merchant exists in merchants table
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('*')
        .eq('id', contract.merchant_id)
        .single();

      if (merchantError || !merchant) {
        console.error('Merchant validation failed:', merchantError);
        return { success: false, error: merchantError };
      }

      console.log('Merchant validation successful:', merchant);
      return { 
        success: true, 
        merchant,
        contract: {
          id: contract.id,
          contract_number: contract.contract_number,
          merchant_id: contract.merchant_id
        }
      };

    } catch (error) {
      console.error('Merchant validation error:', error);
      return { success: false, error };
    }
  };

  const ensureMerchantExists = async (contractId: string) => {
    setIsCreating(true);
    
    try {
      console.log('Ensuring merchant exists for contract:', contractId);
      
      const result = await validateMerchantCreation(contractId);
      
      if (result.success) {
        toast.success('Merchant úspešne vytvorený/validovaný', {
          description: `Spoločnosť: ${result.merchant.company_name}`
        });
        
        return {
          success: true,
          merchant: result.merchant,
          contract: result.contract
        };
      } else {
        const errorMessage = result.error?.message || 'Nepodarilo sa vytvoriť merchanta';
        
        toast.error('Chyba pri vytváraní merchanta', {
          description: errorMessage
        });
        
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Error ensuring merchant exists:', error);
      
      toast.error('Chyba pri vytváraní merchanta', {
        description: 'Neočakávaná chyba'
      });
      
      return {
        success: false,
        error
      };
    } finally {
      setIsCreating(false);
    }
  };

  const checkMerchantStatus = async (contractId: string) => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          id,
          contract_number,
          merchant_id,
          merchants (
            id,
            company_name,
            contact_person_name,
            contact_person_email
          ),
          contact_info (
            first_name,
            last_name,
            email
          ),
          company_info (
            company_name,
            ico
          )
        `)
        .eq('id', contractId)
        .single();

      if (error) {
        console.error('Error checking merchant status:', error);
        return { success: false, error };
      }

      const hasContactInfo = !!data.contact_info;
      const hasCompanyInfo = !!data.company_info;
      const hasMerchant = !!data.merchant_id && !!data.merchants;

      return {
        success: true,
        status: {
          contractId: data.id,
          contractNumber: data.contract_number,
          hasContactInfo,
          hasCompanyInfo,
          hasMerchant,
          merchantInfo: data.merchants,
          missingData: {
            contactInfo: !hasContactInfo,
            companyInfo: !hasCompanyInfo
          }
        }
      };
    } catch (error) {
      console.error('Error checking merchant status:', error);
      return { success: false, error };
    }
  };

  return {
    validateMerchantCreation,
    ensureMerchantExists,
    checkMerchantStatus,
    isCreating
  };
};
