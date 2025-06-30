
import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { useToast } from '@/hooks/use-toast';

interface UseEnhancedAutoSaveProps {
  data: OnboardingData;
  enabled?: boolean;
  debounceMs?: number;
}

export const useEnhancedAutoSave = ({ 
  data, 
  enabled = true, 
  debounceMs = 2000 
}: UseEnhancedAutoSaveProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  const saveMutation = useMutation({
    mutationFn: async (onboardingData: OnboardingData) => {
      if (!onboardingData.contractId) {
        throw new Error('Contract ID is required');
      }

      console.log('Enhanced auto-save: Starting save process for contract:', onboardingData.contractId);

      const promises = [];

      // Save contact info with proper field mapping
      if (onboardingData.contactInfo) {
        const contactPromise = supabase
          .from('contact_info')
          .upsert({
            contract_id: onboardingData.contractId,
            first_name: onboardingData.contactInfo.firstName,
            last_name: onboardingData.contactInfo.lastName,
            email: onboardingData.contactInfo.email,
            phone: onboardingData.contactInfo.phone || '',
            phone_prefix: onboardingData.contactInfo.phonePrefix || '+421',
            salutation: onboardingData.contactInfo.salutation || null,
            sales_note: onboardingData.contactInfo.salesNote || null,
            user_role: onboardingData.contactInfo.userRole || null
          });
        promises.push(contactPromise);
      }

      // Save company info with proper field mapping
      if (onboardingData.companyInfo) {
        const companyPromise = supabase
          .from('company_info')
          .upsert({
            contract_id: onboardingData.contractId,
            ico: onboardingData.companyInfo.ico || '',
            dic: onboardingData.companyInfo.dic || '',
            company_name: onboardingData.companyInfo.companyName,
            registry_type: onboardingData.companyInfo.registryType || 'other',
            is_vat_payer: onboardingData.companyInfo.isVatPayer || false,
            vat_number: onboardingData.companyInfo.vatNumber || null,
            court: onboardingData.companyInfo.court || null,
            section: onboardingData.companyInfo.section || null,
            insert_number: onboardingData.companyInfo.insertNumber || null,
            address_street: onboardingData.companyInfo.address?.street || '',
            address_city: onboardingData.companyInfo.address?.city || '',
            address_zip_code: onboardingData.companyInfo.address?.zipCode || '00000',
            contact_address_same_as_main: onboardingData.companyInfo.contactAddressSameAsMain || true,
            contact_address_street: onboardingData.companyInfo.contactAddress?.street || null,
            contact_address_city: onboardingData.companyInfo.contactAddress?.city || null,
            contact_address_zip_code: onboardingData.companyInfo.contactAddress?.zipCode || null,
            contact_person_name: `${onboardingData.companyInfo.contactPerson?.firstName || ''} ${onboardingData.companyInfo.contactPerson?.lastName || ''}`.trim(),
            contact_person_first_name: onboardingData.companyInfo.contactPerson?.firstName || '',
            contact_person_last_name: onboardingData.companyInfo.contactPerson?.lastName || '',
            contact_person_email: onboardingData.companyInfo.contactPerson?.email || '',
            contact_person_phone: onboardingData.companyInfo.contactPerson?.phone || '',
            contact_person_is_technical: onboardingData.companyInfo.contactPerson?.isTechnicalPerson || false
          });
        promises.push(companyPromise);
      }

      // Save business locations with proper field mapping
      if (onboardingData.businessLocations && onboardingData.businessLocations.length > 0) {
        const locationPromises = onboardingData.businessLocations.map(location => 
          supabase
            .from('business_locations')
            .upsert({
              contract_id: onboardingData.contractId,
              location_id: location.id || crypto.randomUUID(),
              name: location.name,
              address_street: location.address?.street || '',
              address_city: location.address?.city || '',
              address_zip_code: location.address?.zipCode || '00000',
              iban: location.iban || '',
              business_sector: location.businessSector || '',
              contact_person_name: location.contactPerson?.name || '',
              contact_person_phone: location.contactPerson?.phone || '',
              contact_person_email: location.contactPerson?.email || '',
              has_pos: location.hasPOS || false,
              estimated_turnover: location.estimatedTurnover || 0,
              average_transaction: location.averageTransaction || 0,
              seasonality: location.seasonality || 'year-round',
              seasonal_weeks: location.seasonalWeeks || null,
              opening_hours: location.openingHours || ''
            })
        );
        promises.push(...locationPromises);
      }

      // Save authorized persons with proper field mapping
      if (onboardingData.authorizedPersons && onboardingData.authorizedPersons.length > 0) {
        const authorizedPromises = onboardingData.authorizedPersons.map(person => 
          supabase
            .from('authorized_persons')
            .upsert({
              contract_id: onboardingData.contractId,
              person_id: person.id || crypto.randomUUID(),
              first_name: person.firstName,
              last_name: person.lastName,
              email: person.email,
              phone: person.phone || '',
              maiden_name: person.maidenName || null,
              birth_date: person.birthDate || '1900-01-01',
              birth_place: person.birthPlace || '',
              birth_number: person.birthNumber || '',
              permanent_address: person.permanentAddress || '',
              position: person.position || '',
              document_type: person.documentType || 'OP',
              document_number: person.documentNumber || '',
              document_validity: person.documentValidity || '2099-12-31',
              document_issuer: person.documentIssuer || '',
              document_country: person.documentCountry || 'SK',
              citizenship: person.citizenship || 'SK',
              is_politically_exposed: person.isPoliticallyExposed || false,
              is_us_citizen: person.isUSCitizen || false
            })
        );
        promises.push(...authorizedPromises);
      }

      // Save actual owners with proper field mapping
      if (onboardingData.actualOwners && onboardingData.actualOwners.length > 0) {
        const ownerPromises = onboardingData.actualOwners.map(owner => 
          supabase
            .from('actual_owners')
            .upsert({
              contract_id: onboardingData.contractId,
              owner_id: owner.id || crypto.randomUUID(),
              first_name: owner.firstName,
              last_name: owner.lastName,
              maiden_name: owner.maidenName || null,
              birth_date: owner.birthDate || '1900-01-01',
              birth_place: owner.birthPlace || '',
              birth_number: owner.birthNumber || '',
              citizenship: owner.citizenship || 'SK',
              permanent_address: owner.permanentAddress || '',
              is_politically_exposed: owner.isPoliticallyExposed || false
            })
        );
        promises.push(...ownerPromises);
      }

      const results = await Promise.all(promises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Enhanced auto-save errors:', errors);
        throw new Error(`Failed to save: ${errors.map(e => e.error?.message).join(', ')}`);
      }

      console.log('Enhanced auto-save: All data saved successfully');
      return results;
    },
    onSuccess: () => {
      // Invalidate queries to refresh merchant data
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      queryClient.invalidateQueries({ queryKey: ['contract-complete', data.contractId] });
      queryClient.invalidateQueries({ queryKey: ['contract-data', data.contractId] });
      
      console.log('Enhanced auto-save: Success - data saved and queries invalidated');
    },
    onError: (error) => {
      console.error('Enhanced auto-save error:', error);
      toast({
        title: "Chyba pri ukladaní",
        description: "Nepodarilo sa automaticky uložiť zmeny.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (!enabled || !data.contractId) return;

    const currentDataString = JSON.stringify(data);
    
    if (currentDataString === lastSavedRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      console.log('Enhanced auto-save: Triggering save after debounce');
      lastSavedRef.current = currentDataString;
      saveMutation.mutate(data);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, debounceMs, saveMutation]);

  return {
    isSaving: saveMutation.isPending,
    lastSaved: lastSavedRef.current,
    forceSave: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      saveMutation.mutate(data);
    }
  };
};
