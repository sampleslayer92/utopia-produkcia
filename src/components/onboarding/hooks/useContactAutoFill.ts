
import { useCallback } from 'react';
import { OnboardingData } from '@/types/onboarding';
import { useToast } from '@/hooks/use-toast';
import {
  createAuthorizedPersonFromContactInfo,
  createActualOwnerFromContactInfo,
  canAutoFillFromContactInfo,
  findContactInAuthorizedPersons,
  findContactInActualOwners
} from '../utils/crossStepAutoFill';

interface UseContactAutoFillProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const useContactAutoFill = ({ data, updateData }: UseContactAutoFillProps) => {
  const { toast } = useToast();

  // Auto-fill authorized person from contact info
  const autoFillAuthorizedPerson = useCallback(() => {
    if (!canAutoFillFromContactInfo(data.contactInfo)) {
      toast({
        title: "Nedostatočné údaje",
        description: "Pre auto-fill je potrebné vyplniť meno, priezvisko, email a telefón v kontaktných údajoch.",
        variant: "destructive"
      });
      return false;
    }

    const existingPerson = findContactInAuthorizedPersons(data.contactInfo, data.authorizedPersons);
    
    if (existingPerson) {
      toast({
        title: "Osoba už existuje",
        description: "Kontaktná osoba už je v zozname oprávnených osôb.",
      });
      return false;
    }

    const newAuthorizedPerson = createAuthorizedPersonFromContactInfo(data.contactInfo);
    
    updateData({
      authorizedPersons: [...data.authorizedPersons, newAuthorizedPerson]
    });

    toast({
      title: "Automatické vyplnenie",
      description: "Kontaktná osoba bola pridaná do oprávnených osôb.",
    });

    return true;
  }, [data.contactInfo, data.authorizedPersons, updateData, toast]);

  // Auto-fill actual owner from contact info
  const autoFillActualOwner = useCallback(() => {
    if (!canAutoFillFromContactInfo(data.contactInfo)) {
      toast({
        title: "Nedostatočné údaje",
        description: "Pre auto-fill je potrebné vyplniť meno, priezvisko, email a telefón v kontaktných údajoch.",
        variant: "destructive"
      });
      return false;
    }

    const existingOwner = findContactInActualOwners(data.contactInfo, data.actualOwners);
    
    if (existingOwner) {
      toast({
        title: "Osoba už existuje",
        description: "Kontaktná osoba už je v zozname skutočných majiteľov.",
      });
      return false;
    }

    const newActualOwner = createActualOwnerFromContactInfo(data.contactInfo);
    
    updateData({
      actualOwners: [...data.actualOwners, newActualOwner]
    });

    toast({
      title: "Automatické vyplnenie",
      description: "Kontaktná osoba bola pridaná do skutočných majiteľov.",
    });

    return true;
  }, [data.contactInfo, data.actualOwners, updateData, toast]);

  // Check if auto-fill is available
  const canAutoFill = canAutoFillFromContactInfo(data.contactInfo);
  
  // Check if contact already exists in steps
  const contactExistsInAuthorized = Boolean(findContactInAuthorizedPersons(data.contactInfo, data.authorizedPersons));
  const contactExistsInActualOwners = Boolean(findContactInActualOwners(data.contactInfo, data.actualOwners));

  return {
    autoFillAuthorizedPerson,
    autoFillActualOwner,
    canAutoFill,
    contactExistsInAuthorized,
    contactExistsInActualOwners
  };
};
