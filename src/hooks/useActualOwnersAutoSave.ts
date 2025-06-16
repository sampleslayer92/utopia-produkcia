
import { useEffect, useRef } from 'react';
import { ActualOwner } from '@/types/onboarding';
import { useActualOwnersCrud } from './useActualOwnersCrud';

interface UseActualOwnersAutoSaveOptions {
  contractId: string;
  actualOwners: ActualOwner[];
  delay?: number;
}

export const useActualOwnersAutoSave = ({
  contractId,
  actualOwners,
  delay = 2000
}: UseActualOwnersAutoSaveOptions) => {
  const { updateOwner } = useActualOwnersCrud(contractId);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<string>('');

  useEffect(() => {
    if (!contractId || actualOwners.length === 0) return;

    const currentDataString = JSON.stringify(actualOwners);
    
    // Skip if data hasn't changed
    if (currentDataString === previousDataRef.current) return;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        // Find owners that have changed and need updating
        const ownersToUpdate = actualOwners.filter(owner => {
          // Only update if owner has basic required fields and looks like it needs saving
          return owner.firstName && owner.lastName;
        });

        // Update each owner that needs saving
        for (const owner of ownersToUpdate) {
          if (owner.id) {
            console.log('Auto-saving actual owner:', owner.id);
            await updateOwner.mutateAsync({
              ownerId: owner.id,
              updates: {
                first_name: owner.firstName,
                last_name: owner.lastName,
                maiden_name: owner.maidenName || null,
                birth_date: owner.birthDate || '1900-01-01',
                birth_place: owner.birthPlace || '',
                birth_number: owner.birthNumber || '',
                citizenship: owner.citizenship || 'SK',
                permanent_address: owner.permanentAddress || '',
                is_politically_exposed: owner.isPoliticallyExposed || false
              }
            });
          }
        }
        
        previousDataRef.current = currentDataString;
        console.log('Auto-save completed for actual owners');
      } catch (error) {
        console.error('Auto-save failed for actual owners:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [actualOwners, contractId, delay, updateOwner]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
