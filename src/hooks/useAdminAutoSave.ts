import { useCallback, useRef, useEffect } from 'react';
import { OnboardingData } from '@/types/onboarding';
import { supabase } from '@/integrations/supabase/client';
import { insertContactInfo, insertCompanyInfo, insertBusinessLocations } from './contract/useContractSubmissionHandlers';
import { toast } from 'sonner';

interface UseAdminAutoSaveOptions {
  enabled: boolean;
  delay?: number;
}

export const useAdminAutoSave = ({ enabled, delay = 2000 }: UseAdminAutoSaveOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const saveToDatabase = useCallback(async (data: OnboardingData) => {
    if (!data.contractId || isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      console.log('🔄 Auto-saving onboarding data to database:', data.contractId);

      // Save contact info if changed
      if (data.contactInfo.firstName || data.contactInfo.lastName || data.contactInfo.email) {
        try {
          // Clear existing contact info first
          await supabase
            .from('contact_info')
            .delete()
            .eq('contract_id', data.contractId);

          await insertContactInfo(data.contractId, data.contactInfo);
          console.log('✅ Contact info auto-saved');
        } catch (error) {
          console.error('❌ Failed to auto-save contact info:', error);
        }
      }

      // Save company info if changed
      if (data.companyInfo.companyName || data.companyInfo.ico) {
        try {
          // Clear existing company info first
          await supabase
            .from('company_info')
            .delete()
            .eq('contract_id', data.contractId);

          await insertCompanyInfo(data.contractId, data.companyInfo, data.contactInfo);
          console.log('✅ Company info auto-saved');
        } catch (error) {
          console.error('❌ Failed to auto-save company info:', error);
        }
      }

      // Save business locations if any exist
      if (data.businessLocations && data.businessLocations.length > 0) {
        try {
          // Clear existing business locations first
          await supabase
            .from('business_locations')
            .delete()
            .eq('contract_id', data.contractId);

          await insertBusinessLocations(data.contractId, data.businessLocations);
          console.log('✅ Business locations auto-saved');
        } catch (error) {
          console.error('❌ Failed to auto-save business locations:', error);
        }
      }

      // Save authorized persons if any exist
      if (data.authorizedPersons && data.authorizedPersons.length > 0) {
        try {
          // Clear existing authorized persons first
          await supabase
            .from('authorized_persons')
            .delete()
            .eq('contract_id', data.contractId);

          const personsData = data.authorizedPersons.map(person => ({
            contract_id: data.contractId!,
            person_id: person.id,
            first_name: person.firstName || 'Nezadané',
            last_name: person.lastName || 'Nezadané',
            email: person.email || '',
            phone: person.phone || '',
            maiden_name: person.maidenName || null,
            birth_date: person.birthDate || '1900-01-01',
            birth_place: person.birthPlace || 'Nezadané',
            birth_number: person.birthNumber || '',
            permanent_address: person.permanentAddress || 'Nezadané',
            position: person.position || 'Nezadané',
            document_type: person.documentType || 'OP',
            document_number: person.documentNumber || '',
            document_validity: person.documentValidity || '2099-12-31',
            document_issuer: person.documentIssuer || 'Nezadané',
            document_country: person.documentCountry || 'SK',
            citizenship: person.citizenship || 'SK',
            is_politically_exposed: person.isPoliticallyExposed || false,
            is_us_citizen: person.isUSCitizen || false
          }));

          await supabase
            .from('authorized_persons')
            .insert(personsData);
          console.log('✅ Authorized persons auto-saved');
        } catch (error) {
          console.error('❌ Failed to auto-save authorized persons:', error);
        }
      }

      // Save actual owners if any exist
      if (data.actualOwners && data.actualOwners.length > 0) {
        try {
          // Clear existing actual owners first
          await supabase
            .from('actual_owners')
            .delete()
            .eq('contract_id', data.contractId);

          const ownersData = data.actualOwners.map(owner => ({
            contract_id: data.contractId!,
            owner_id: owner.id,
            first_name: owner.firstName || 'Nezadané',
            last_name: owner.lastName || 'Nezadané',
            maiden_name: owner.maidenName || null,
            birth_date: owner.birthDate || '1900-01-01',
            birth_place: owner.birthPlace || 'Nezadané',
            birth_number: owner.birthNumber || '',
            citizenship: owner.citizenship || 'SK',
            permanent_address: owner.permanentAddress || 'Nezadané',
            is_politically_exposed: owner.isPoliticallyExposed || false
          }));

          await supabase
            .from('actual_owners')
            .insert(ownersData);
          console.log('✅ Actual owners auto-saved');
        } catch (error) {
          console.error('❌ Failed to auto-save actual owners:', error);
        }
      }

      // Save consents
      try {
        // Clear existing consents first
        await supabase
          .from('consents')
          .delete()
          .eq('contract_id', data.contractId);

        await supabase
          .from('consents')
          .insert({
            contract_id: data.contractId,
            gdpr_consent: data.consents.gdpr || false,
            terms_consent: data.consents.terms || false,
            electronic_communication_consent: data.consents.electronicCommunication || false,
            signature_date: data.consents.signatureDate || null,
            signing_person_id: data.consents.signingPersonId || null
          });
        console.log('✅ Consents auto-saved');
      } catch (error) {
        console.error('❌ Failed to auto-save consents:', error);
      }

      console.log('🎉 Auto-save completed successfully');
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
      // Don't show error toast for auto-save failures to avoid spam
    } finally {
      isSavingRef.current = false;
    }
  }, []);

  const scheduleAutoSave = useCallback((data: OnboardingData) => {
    if (!enabled || !data.contractId) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if data has actually changed
    const currentDataString = JSON.stringify(data);
    if (currentDataString === lastSavedDataRef.current) {
      return; // No changes, skip save
    }

    // Schedule new save
    timeoutRef.current = setTimeout(() => {
      lastSavedDataRef.current = currentDataString;
      saveToDatabase(data);
    }, delay);
  }, [enabled, delay, saveToDatabase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const forceSave = useCallback(async (data: OnboardingData) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await saveToDatabase(data);
  }, [saveToDatabase]);

  return {
    scheduleAutoSave,
    forceSave,
    isSaving: isSavingRef.current
  };
};