
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
      
      // Enhanced validation
      if (!onboardingData.contactInfo.firstName || !onboardingData.contactInfo.lastName) {
        throw new Error('Meno a priezvisko sú povinné');
      }
      
      if (!onboardingData.contactInfo.email) {
        throw new Error('Email je povinný');
      }
      
      if (!onboardingData.companyInfo.companyName) {
        throw new Error('Názov spoločnosti je povinný');
      }

      if (!onboardingData.contractId) {
        throw new Error('Zmluva nebola vytvorená. Prosím obnovte stránku a skúste znova.');
      }

      // Additional validation for enum fields
      if (onboardingData.companyInfo.registryType === '') {
        onboardingData.companyInfo.registryType = 'other';
      }
      
      // Use existing contract ID
      const contractId = onboardingData.contractId;
      console.log('Using existing contract:', contractId);

      // Update contract status to submitted
      const { error: statusError } = await supabase
        .from('contracts')
        .update({ 
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .eq('id', contractId);

      if (statusError) {
        console.error('Contract status update error:', statusError);
        throw new Error(`Chyba pri aktualizácii stavu zmluvy: ${statusError.message}`);
      }

      // Get updated contract info
      const { data: contract, error: contractError } = await supabase
        .from('contracts')
        .select('id, contract_number')
        .eq('id', contractId)
        .single();

      if (contractError || !contract) {
        console.error('Contract fetch error:', contractError);
        throw new Error(`Chyba pri načítaní zmluvy: ${contractError?.message || 'Zmluva nenájdená'}`);
      }

      // Insert all sections with enhanced error handling
      try {
        await insertContactInfo(contractId, onboardingData.contactInfo);
        console.log('Contact info inserted successfully');
      } catch (error) {
        console.error('Contact info insertion error:', error);
        throw new Error(`Chyba pri ukladaní kontaktných údajov: ${error instanceof Error ? error.message : 'Neznáma chyba'}`);
      }

      try {
        await insertCompanyInfo(contractId, onboardingData.companyInfo);
        console.log('Company info inserted successfully');
      } catch (error) {
        console.error('Company info insertion error:', error);
        throw new Error(`Chyba pri ukladaní údajov o spoločnosti: ${error instanceof Error ? error.message : 'Neznáma chyba'}`);
      }

      try {
        await insertBusinessLocations(contractId, onboardingData.businessLocations);
        console.log('Business locations inserted successfully');
      } catch (error) {
        console.error('Business locations insertion error:', error);
        throw new Error(`Chyba pri ukladaní prevádzok: ${error instanceof Error ? error.message : 'Neznáma chyba'}`);
      }

      try {
        await insertDeviceSelection(contractId, onboardingData.deviceSelection, onboardingData.fees);
        console.log('Device selection inserted successfully');
      } catch (error) {
        console.error('Device selection insertion error:', error);
        throw new Error(`Chyba pri ukladaní zariadení: ${error instanceof Error ? error.message : 'Neznáma chyba'}`);
      }

      try {
        await insertAuthorizedPersons(contractId, onboardingData.authorizedPersons);
        console.log('Authorized persons inserted successfully');
      } catch (error) {
        console.error('Authorized persons insertion error:', error);
        throw new Error(`Chyba pri ukladaní oprávnených osôb: ${error instanceof Error ? error.message : 'Neznáma chyba'}`);
      }

      try {
        await insertActualOwners(contractId, onboardingData.actualOwners);
        console.log('Actual owners inserted successfully');
      } catch (error) {
        console.error('Actual owners insertion error:', error);
        throw new Error(`Chyba pri ukladaní skutočných vlastníkov: ${error instanceof Error ? error.message : 'Neznáma chyba'}`);
      }

      try {
        await insertConsents(contractId, onboardingData.consents);
        console.log('Consents inserted successfully');
      } catch (error) {
        console.error('Consents insertion error:', error);
        throw new Error(`Chyba pri ukladaní súhlasov: ${error instanceof Error ? error.message : 'Neznáma chyba'}`);
      }

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
      
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba';
      
      toast.error('Chyba pri odosielaní registrácie', {
        description: errorMessage
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
