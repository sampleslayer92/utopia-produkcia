
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
      
      // Validate required fields
      if (!onboardingData.contactInfo.firstName || !onboardingData.contactInfo.lastName) {
        throw new Error('Meno a priezvisko sú povinné');
      }
      
      if (!onboardingData.contactInfo.email) {
        throw new Error('Email je povinný');
      }
      
      if (!onboardingData.companyInfo.companyName) {
        throw new Error('Názov spoločnosti je povinný');
      }

      let contractId = onboardingData.contractId;
      let contractNumber = onboardingData.contractNumber;

      if (contractId) {
        // Update existing contract to submitted status
        console.log('Updating existing contract:', contractId);
        
        const { data: contract, error: updateError } = await supabase
          .from('contracts')
          .update({
            status: 'submitted',
            submitted_at: new Date().toISOString(),
            notes: 'Contract submitted via onboarding portal'
          })
          .eq('id', contractId)
          .select('id, contract_number')
          .single();

        if (updateError) {
          console.error('Contract update error:', updateError);
          throw new Error(`Chyba pri aktualizácii zmluvy: ${updateError.message}`);
        }

        console.log('Contract updated:', contract);
        contractNumber = contract.contract_number;
      } else {
        // Fallback: Create new contract if somehow contractId is missing
        console.log('Creating new contract as fallback...');
        
        const { data: contract, error: contractError } = await supabase
          .from('contracts')
          .insert({
            status: 'submitted',
            submitted_at: new Date().toISOString(),
            notes: 'Contract submitted via onboarding portal (fallback creation)'
          })
          .select('id, contract_number')
          .single();

        if (contractError) {
          console.error('Contract creation error:', contractError);
          throw new Error(`Chyba pri vytváraní zmluvy: ${contractError.message}`);
        }

        console.log('Fallback contract created:', contract);
        contractId = contract.id;
        contractNumber = contract.contract_number;
      }

      // Clear existing data for this contract before inserting new data
      console.log('Clearing existing contract data...');
      
      await Promise.all([
        supabase.from('contact_info').delete().eq('contract_id', contractId),
        supabase.from('company_info').delete().eq('contract_id', contractId),
        supabase.from('business_locations').delete().eq('contract_id', contractId),
        supabase.from('device_selection').delete().eq('contract_id', contractId),
        supabase.from('contract_items').delete().eq('contract_id', contractId),
        supabase.from('contract_calculations').delete().eq('contract_id', contractId),
        supabase.from('authorized_persons').delete().eq('contract_id', contractId),
        supabase.from('actual_owners').delete().eq('contract_id', contractId),
        supabase.from('consents').delete().eq('contract_id', contractId)
      ]);

      // Insert all sections with error handling
      try {
        await insertContactInfo(contractId, onboardingData.contactInfo);
        console.log('Contact info inserted successfully');
      } catch (error) {
        console.error('Contact info insertion error:', error);
        throw new Error('Chyba pri ukladaní kontaktných údajov');
      }

      try {
        await insertCompanyInfo(contractId, onboardingData.companyInfo);
        console.log('Company info inserted successfully');
      } catch (error) {
        console.error('Company info insertion error:', error);
        throw new Error('Chyba pri ukladaní údajov o spoločnosti');
      }

      try {
        await insertBusinessLocations(contractId, onboardingData.businessLocations);
        console.log('Business locations inserted successfully');
      } catch (error) {
        console.error('Business locations insertion error:', error);
        throw new Error('Chyba pri ukladaní prevádzok');
      }

      try {
        await insertDeviceSelection(contractId, onboardingData.deviceSelection, onboardingData.fees);
        console.log('Device selection inserted successfully');
      } catch (error) {
        console.error('Device selection insertion error:', error);
        throw new Error('Chyba pri ukladaní zariadení a služieb');
      }

      try {
        await insertAuthorizedPersons(contractId, onboardingData.authorizedPersons);
        console.log('Authorized persons inserted successfully');
      } catch (error) {
        console.error('Authorized persons insertion error:', error);
        throw new Error('Chyba pri ukladaní oprávnených osôb');
      }

      try {
        await insertActualOwners(contractId, onboardingData.actualOwners);
        console.log('Actual owners inserted successfully');
      } catch (error) {
        console.error('Actual owners insertion error:', error);
        throw new Error('Chyba pri ukladaní skutočných vlastníkov');
      }

      try {
        await insertConsents(contractId, onboardingData.consents);
        console.log('Consents inserted successfully');
      } catch (error) {
        console.error('Consents insertion error:', error);
        throw new Error('Chyba pri ukladaní súhlasov');
      }

      console.log('Contract submission completed successfully');
      
      toast.success('Registrácia úspešne odoslaná!', {
        description: `Číslo zmluvy: ${contractNumber}`
      });

      return {
        success: true,
        contractId: contractId,
        contractNumber: contractNumber
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
