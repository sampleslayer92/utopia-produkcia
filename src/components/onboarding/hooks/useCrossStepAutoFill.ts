import { useCallback, useEffect } from "react";
import { OnboardingData } from "@/types/onboarding";
import {
  createAuthorizedPersonFromCompanyContact,
  createActualOwnerFromCompanyContact,
  createBusinessLocationFromCompanyInfo,
  shouldCreateOrUpdateAuthorizedPersonFromContact,
  shouldCreateOrUpdateActualOwnerFromContact,
  updateExistingAuthorizedPerson,
  updateExistingActualOwner,
  updateSigningPersonFromContact,
  syncContactPersonData,
  syncBusinessLocationAddresses
} from "../utils/crossStepAutoFill";
import { useToast } from "@/hooks/use-toast";

interface UseCrossStepAutoFillProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  currentStep: number;
}

export const useCrossStepAutoFill = ({ data, updateData, currentStep }: UseCrossStepAutoFillProps) => {
  const { toast } = useToast();

  // Auto-fill authorized person when moving to step 5 (Authorized Persons)
  const autoFillAuthorizedPerson = useCallback(() => {
    const { action, existingPerson } = shouldCreateOrUpdateAuthorizedPersonFromContact(
      data.companyInfo, 
      data.contactInfo,
      data.authorizedPersons
    );
    
    if (action === 'create') {
      const newAuthorizedPerson = createAuthorizedPersonFromCompanyContact(data.companyInfo, data.contactInfo);
      
      updateData({
        authorizedPersons: [...data.authorizedPersons, newAuthorizedPerson]
      });

      toast({
        title: "Automatické vyplnenie",
        description: "Kontaktná osoba spoločnosti bola pridaná do oprávnených osôb",
      });

      return newAuthorizedPerson.id;
    } else if (action === 'update' && existingPerson) {
      const updatedPerson = updateExistingAuthorizedPerson(existingPerson, data.companyInfo, data.contactInfo);
      
      updateData({
        authorizedPersons: data.authorizedPersons.map(person => 
          person.id === existingPerson.id ? updatedPerson : person
        )
      });

      toast({
        title: "Automatická aktualizácia",
        description: "Údaje oprávnenej osoby boli aktualizované podľa kontaktných údajov",
      });

      return updatedPerson.id;
    }
    
    return null;
  }, [data.companyInfo, data.contactInfo, data.authorizedPersons, updateData, toast]);

  // Auto-fill actual owner when moving to step 6 (Actual Owners)
  const autoFillActualOwner = useCallback(() => {
    const { action, existingOwner } = shouldCreateOrUpdateActualOwnerFromContact(
      data.contactInfo,
      data.companyInfo, 
      data.actualOwners
    );
    
    if (action === 'create') {
      const newActualOwner = createActualOwnerFromCompanyContact(data.companyInfo, data.contactInfo);
      
      updateData({
        actualOwners: [...data.actualOwners, newActualOwner]
      });

      toast({
        title: "Automatické vyplnenie",
        description: "Kontaktná osoba bola pridaná ako skutočný majiteľ",
      });
    } else if (action === 'update' && existingOwner) {
      const updatedOwner = updateExistingActualOwner(existingOwner, data.companyInfo);
      
      updateData({
        actualOwners: data.actualOwners.map(owner => 
          owner.id === existingOwner.id ? updatedOwner : owner
        )
      });

      toast({
        title: "Automatická aktualizácia",
        description: "Údaje skutočného majiteľa boli aktualizované podľa kontaktných údajov",
      });
    }
  }, [data.contactInfo, data.companyInfo, data.actualOwners, updateData, toast]);

  // Auto-fill business location when head office equals operating address
  const autoFillBusinessLocation = useCallback(() => {
    if (data.companyInfo.headOfficeEqualsOperatingAddress && data.businessLocations.length === 0) {
      const newBusinessLocation = createBusinessLocationFromCompanyInfo(data.companyInfo);
      
      updateData({
        businessLocations: [newBusinessLocation]
      });

      toast({
        title: "Automatické vyplnenie",
        description: "Prevádzka bola vytvorená s adresou sídla spoločnosti",
      });
    }
  }, [data.companyInfo, data.businessLocations, updateData, toast]);

  // Auto-fill signing person when moving to step 7 (Consents)
  const autoFillSigningPerson = useCallback(() => {
    const signingPersonId = updateSigningPersonFromContact(
      data.companyInfo,
      data.contactInfo,
      data.authorizedPersons,
      data.consents.signingPersonId
    );

    if (signingPersonId && signingPersonId !== data.consents.signingPersonId) {
      updateData({
        consents: {
          ...data.consents,
          signingPersonId
        }
      });

      toast({
        title: "Automatické vyplnenie",
        description: "Kontaktná osoba bola nastavená ako podpisujúca osoba",
      });
    }
  }, [data.companyInfo, data.contactInfo, data.authorizedPersons, data.consents, updateData, toast]);

  // Sync contact person data across steps
  const syncContactData = useCallback(() => {
    syncContactPersonData(data, updateData);
    
    toast({
      title: "Údaje synchronizované",
      description: "Kontaktné údaje boli aktualizované vo všetkých krokoch",
    });
  }, [data, updateData, toast]);

  // Sync business location addresses
  const syncAddresses = useCallback(() => {
    syncBusinessLocationAddresses(data, updateData);
    
    toast({
      title: "Adresy synchronizované",
      description: "Adresy prevádzok boli aktualizované podľa sídla spoločnosti",
    });
  }, [data, updateData, toast]);

  // Apply all available auto-fills
  const applyAllSuggestions = useCallback(() => {
    let applied = 0;

    const authorizedPersonResult = shouldCreateOrUpdateAuthorizedPersonFromContact(data.companyInfo, data.contactInfo, data.authorizedPersons);
    if (authorizedPersonResult.action === 'create' || authorizedPersonResult.action === 'update') {
      autoFillAuthorizedPerson();
      applied++;
    }

    const actualOwnerResult = shouldCreateOrUpdateActualOwnerFromContact(data.contactInfo, data.companyInfo, data.actualOwners);
    if (actualOwnerResult.action === 'create' || actualOwnerResult.action === 'update') {
      autoFillActualOwner();
      applied++;
    }

    if (data.companyInfo.headOfficeEqualsOperatingAddress && data.businessLocations.length === 0) {
      autoFillBusinessLocation();
      applied++;
    }

    if (applied > 0) {
      toast({
        title: "Hromadné vyplnenie",
        description: `Aplikované ${applied} automatické návrhy`,
      });
    }
  }, [data, autoFillAuthorizedPerson, autoFillActualOwner, autoFillBusinessLocation, toast]);

  // Trigger auto-fills based on current step
  useEffect(() => {
    if (currentStep === 2) { // Business Locations
      autoFillBusinessLocation();
    } else if (currentStep === 5) { // Authorized Persons
      autoFillAuthorizedPerson();
    } else if (currentStep === 6) { // Actual Owners
      autoFillActualOwner();
    } else if (currentStep === 7) { // Consents
      autoFillSigningPerson();
    }
  }, [currentStep, autoFillBusinessLocation, autoFillAuthorizedPerson, autoFillActualOwner, autoFillSigningPerson]);

  return {
    autoFillAuthorizedPerson,
    autoFillActualOwner,
    autoFillBusinessLocation,
    autoFillSigningPerson,
    syncContactData,
    syncAddresses,
    applyAllSuggestions
  };
};
