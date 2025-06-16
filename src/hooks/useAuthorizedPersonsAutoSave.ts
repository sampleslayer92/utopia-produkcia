
import { useEffect, useRef } from 'react';
import { AuthorizedPerson } from '@/types/onboarding';
import { useAuthorizedPersonsCrud } from './useAuthorizedPersonsCrud';

interface UseAuthorizedPersonsAutoSaveOptions {
  contractId: string;
  authorizedPersons: AuthorizedPerson[];
  delay?: number;
}

export const useAuthorizedPersonsAutoSave = ({
  contractId,
  authorizedPersons,
  delay = 2000
}: UseAuthorizedPersonsAutoSaveOptions) => {
  const { upsertPerson } = useAuthorizedPersonsCrud(contractId);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<string>('');

  useEffect(() => {
    if (!contractId || authorizedPersons.length === 0) return;

    const currentDataString = JSON.stringify(authorizedPersons);
    
    // Skip if data hasn't changed
    if (currentDataString === previousDataRef.current) return;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        // Find persons that have changed and need saving
        const personsToSave = authorizedPersons.filter(person => {
          // Only save if person has basic required fields
          return person.firstName && person.lastName && person.email && person.id;
        });

        // Upsert each person that needs saving
        for (const person of personsToSave) {
          console.log('Auto-saving authorized person:', person.id);
          await upsertPerson.mutateAsync({
            personId: person.id,
            personData: {
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
            }
          });
        }
        
        previousDataRef.current = currentDataString;
        console.log('Auto-save completed for authorized persons');
      } catch (error) {
        console.error('Auto-save failed for authorized persons:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [authorizedPersons, contractId, delay, upsertPerson]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
