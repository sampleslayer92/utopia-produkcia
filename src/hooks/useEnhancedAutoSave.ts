
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

      // Save contact info
      if (onboardingData.contactInfo) {
        const contactPromise = supabase
          .from('contact_info')
          .upsert({
            contract_id: onboardingData.contractId,
            ...onboardingData.contactInfo
          });
        promises.push(contactPromise);
      }

      // Save company info
      if (onboardingData.companyInfo) {
        const companyPromise = supabase
          .from('company_info')
          .upsert({
            contract_id: onboardingData.contractId,
            ...onboardingData.companyInfo
          });
        promises.push(companyPromise);
      }

      // Save business locations
      if (onboardingData.businessLocations && onboardingData.businessLocations.length > 0) {
        const locationPromises = onboardingData.businessLocations.map(location => 
          supabase
            .from('business_locations')
            .upsert({
              contract_id: onboardingData.contractId,
              location_id: location.id || crypto.randomUUID(),
              ...location
            })
        );
        promises.push(...locationPromises);
      }

      // Save authorized persons
      if (onboardingData.authorizedPersons && onboardingData.authorizedPersons.length > 0) {
        const authorizedPromises = onboardingData.authorizedPersons.map(person => 
          supabase
            .from('authorized_persons')
            .upsert({
              contract_id: onboardingData.contractId,
              person_id: person.id || crypto.randomUUID(),
              ...person
            })
        );
        promises.push(...authorizedPromises);
      }

      // Save actual owners
      if (onboardingData.actualOwners && onboardingData.actualOwners.length > 0) {
        const ownerPromises = onboardingData.actualOwners.map(owner => 
          supabase
            .from('actual_owners')
            .upsert({
              contract_id: onboardingData.contractId,
              owner_id: owner.id || crypto.randomUUID(),
              ...owner
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
