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
    if (!ico?.trim()) {
      toast({
        title: 'Chyba',
        description: 'ICO spoločnosti nie je zadané',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetchCompanyPersons(ico.trim());
      
      if (!response.success || !response.data) {
        toast({
          title: 'Chyba',
          description: response.error || 'Nepodarilo sa načítať osoby z ARES',
          variant: 'destructive'
        });
        return;
      }

      const { persons } = response.data;
      
      if (persons.length === 0) {
        toast({
          title: 'Informácia',
          description: 'Pre túto spoločnosť neboli v ARES nájdené žiadne osoby',
          variant: 'default'
        });
        return;
      }

      const authorizedPersons = persons.map(convertAresPersonToAuthorized);
      onSuccess(authorizedPersons);

      toast({
        title: 'Úspech',
        description: `Načítané ${persons.length} osôb z ARES. Skontrolujte a doplňte chýbajúce údaje.`,
        variant: 'default'
      });

    } catch (error) {
      console.error('Error fetching ARES persons:', error);
      toast({
        title: 'Chyba',
        description: 'Nastala neočakávaná chyba pri načítavaní osôb z ARES',
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