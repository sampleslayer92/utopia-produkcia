
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

// Helper function to get client IP (placeholder - would need real implementation)
const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP:', error);
    return 'Unknown';
  }
};

// Function to generate contract documents
const generateContractDocuments = async (contractId: string) => {
  const { error } = await supabase
    .from('contract_documents')
    .insert([
      {
        contract_id: contractId,
        document_type: 'g1',
        document_name: 'Zmluva o poskytnutí služieb (G1)',
        status: 'generated',
        generated_at: new Date().toISOString()
      },
      {
        contract_id: contractId,
        document_type: 'g2', 
        document_name: 'Zmluva o akceptácii platieb (G2)',
        status: 'generated',
        generated_at: new Date().toISOString()
      }
    ]);
    
  if (error) {
    throw error;
  }
};

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

      // Additional validation for enum fields - use default value instead of 'other'
      if (!onboardingData.companyInfo.registryType) {
        onboardingData.companyInfo.registryType = 'Živnosť';
      }
      
      // Use existing contract ID
      const contractId = onboardingData.contractId;
      console.log('Using existing contract:', contractId);

      // Update contract status to pending_approval and save signature
      const currentTimestamp = new Date().toISOString();
      const { error: statusError } = await supabase
        .from('contracts')
        .update({ 
          status: 'pending_approval',
          submitted_at: currentTimestamp,
          signature_url: onboardingData.consents.signatureUrl,
          signature_date: onboardingData.consents.signatureDate ? new Date(onboardingData.consents.signatureDate).toISOString() : currentTimestamp,
          signature_ip: await getClientIP()
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
        await insertCompanyInfo(contractId, onboardingData.companyInfo, onboardingData.contactInfo);
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
      
      // Generate G1 and G2 documents automatically
      try {
        await generateContractDocuments(contractId);
        console.log('Contract documents generated successfully');
      } catch (docError) {
        console.error('Failed to generate documents:', docError);
        // Don't fail the submission if document generation fails
      }
      
      toast.success('Žiadosť úspešne odoslaná!', {
        description: `Číslo žiadosti: ${contract.contract_number}. Čaká na schválenie administrátorom.`
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
