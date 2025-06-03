
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { toast } from 'sonner';
import {
  insertContactInfo,
  insertCompanyInfo,
  insertBusinessLocations,
  insertDeviceSelection,
  insertAuthorizedPersons,
  insertActualOwners,
  insertConsents
} from './contract/useContractSubmissionHandlers';

export const useContractSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContract = async (onboardingData: OnboardingData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Starting contract submission...', onboardingData);
      
      // 1. Create main contract
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .insert({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          notes: 'Contract submitted via onboarding portal'
        })
        .select('id, contract_number')
        .single();

      if (contractError) {
        console.error('Contract creation error:', contractError);
        throw contractError;
      }

      console.log('Contract created:', contract);
      const contractId = contract.id;

      // Insert all sections
      await insertContactInfo(contractId, onboardingData.contactInfo);
      await insertCompanyInfo(contractId, onboardingData.companyInfo);
      await insertBusinessLocations(contractId, onboardingData.businessLocations);
      await insertDeviceSelection(contractId, onboardingData.deviceSelection, onboardingData.fees);
      await insertAuthorizedPersons(contractId, onboardingData.authorizedPersons);
      await insertActualOwners(contractId, onboardingData.actualOwners);
      await insertConsents(contractId, onboardingData.consents);

      console.log('Contract submission completed successfully');
      
      toast.success('Registrácia úspešne odoslaná!', {
        description: `Číslo zmluvy: ${contract.contract_number}`
      });

      return {
        success: true,
        contractId: contractId,
        contractNumber: contract.contract_number
      };

    } catch (error) {
      console.error('Contract submission error:', error);
      
      toast.error('Chyba pri odosielaní registrácie', {
        description: 'Skúste to prosím znova alebo kontaktujte podporu'
      });

      return {
        success: false,
        error: error
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitContract,
    isSubmitting
  };
};
