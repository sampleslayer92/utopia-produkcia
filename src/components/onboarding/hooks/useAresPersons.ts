import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AuthorizedPerson } from '@/types/contact';
import { AresPersonInfo } from '@/types/ares-persons';
import { fetchCompanyPersons } from '../services/aresPersonsService';
import { v4 as uuidv4 } from 'uuid';

export const useAresPersons = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const convertAresPersonToAuthorized = (aresPerson: AresPersonInfo): AuthorizedPerson => {
    return {
      id: uuidv4(),
      firstName: aresPerson.firstName,
      lastName: aresPerson.lastName,
      position: aresPerson.position,
      email: '', // Needs to be filled manually
      phone: '', // Needs to be filled manually
      phonePrefix: '+421', // Default to Slovak
      birthDate: aresPerson.birthDate || '',
      birthPlace: '', // Needs to be filled manually
      birthNumber: '', // Needs to be filled manually
      permanentAddress: '', // Needs to be filled manually
      citizenship: aresPerson.citizenship || 'SK',
      documentType: 'OP' as const,
      documentNumber: '',
      documentValidity: '',
      documentIssuer: '',
      documentCountry: 'SK',
      isPoliticallyExposed: false,
      isUSCitizen: false,
      createdFromContact: false
    };
  };

  const fetchAndFillPersons = async (ico: string, onSuccess: (persons: AuthorizedPerson[]) => void) => {
    console.log('=== ARES PERSONS HOOK ===');
    console.log('Starting fetch with ICO:', ico);
    
    if (!ico?.trim()) {
      console.error('ICO is empty or not provided');
      toast({
        title: 'Chyba',
        description: 'ICO spoločnosti nie je zadané',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Calling fetchCompanyPersons with ICO:', ico.trim());
      const response = await fetchCompanyPersons(ico.trim());
      console.log('Received response:', JSON.stringify(response, null, 2));
      
      if (!response.success) {
        console.error('Response indicates failure:', response.error);
        
        // Enhanced error messages based on the error type
        let errorMessage = response.error || 'Nepodarilo sa načítať osoby z ARES';
        let errorTitle = 'Chyba pri načítavaní z ARES';
        
        if (response.error?.includes('404') || response.error?.includes('not found')) {
          errorTitle = 'Spoločnosť nenájdená';
          errorMessage = 'Spoločnosť s týmto ICO nebola v ARES nájdená. Skontrolujte, prosím, správnosť ICO.';
        } else if (response.error?.includes('500') || response.error?.includes('API error')) {
          errorTitle = 'Problém so službou ARES';
          errorMessage = 'Služba ARES je momentálne nedostupná. Skúste to neskôr alebo pridajte osoby manuálne.';
        }
        
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: 'destructive'
        });
        return;
      }

      if (!response.data) {
        console.error('Response success but no data');
        toast({
          title: 'Chyba',
          description: 'Žiadne dáta neboli vrátené z ARES',
          variant: 'destructive'
        });
        return;
      }

      const { persons } = response.data;
      console.log('Extracted persons from response:', persons);
      
      if (!persons || persons.length === 0) {
        console.log('No persons found in response');
        
        // Determine company type for better messaging
        const companyName = response.data.companyName || '';
        let noPersonsMessage = 'Pre túto spoločnosť neboli v ARES nájdené žiadne osoby.';
        
        if (companyName.includes('s.r.o.')) {
          noPersonsMessage = 'Pre túto s.r.o. neboli v ARES nájdení žiadni jednateľia alebo prokúristi. Môžete ich pridať manuálne.';
        } else if (!companyName.includes('s.r.o.') && persons?.length === 0) {
          noPersonsMessage = 'Pre túto živnosť neboli v ARES nájdené osobné údaje podnikateľa. Môžete ich pridať manuálne.';
        }
        
        toast({
          title: 'Informácia',
          description: noPersonsMessage,
          variant: 'default'
        });
        return;
      }

      console.log(`Converting ${persons.length} ARES persons to AuthorizedPersons`);
      const authorizedPersons = persons.map(convertAresPersonToAuthorized);
      console.log('Converted authorized persons:', authorizedPersons);
      
      onSuccess(authorizedPersons);

      // Enhanced success message with person count and type
      const personTypes = persons.map(p => p.position).join(', ');
      toast({
        title: 'Úspech',
        description: `Načítané ${persons.length} osôb z ARES: ${personTypes}. Skontrolujte a doplňte chýbajúce údaje.`,
        variant: 'default'
      });

    } catch (error) {
      console.error('Error fetching ARES persons:', error);
      
      let errorMessage = 'Nastala neočakávaná chyba pri načítavaní osôb z ARES';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Problém s pripojením k službe ARES. Skontrolujte internetové pripojenie.';
      } else if (error instanceof Error) {
        errorMessage = `Chyba: ${error.message}`;
      }
      
      toast({
        title: 'Chyba',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchAndFillPersons,
    isLoading
  };
};