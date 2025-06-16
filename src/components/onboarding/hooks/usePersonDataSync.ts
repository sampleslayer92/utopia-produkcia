
import { useEffect, useRef } from 'react';
import { OnboardingData, AuthorizedPerson, ActualOwner } from '@/types/onboarding';
import { useToast } from '@/hooks/use-toast';

interface PersonSyncOptions {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  enableSync?: boolean;
}

export const usePersonDataSync = ({ data, updateData, enableSync = true }: PersonSyncOptions) => {
  const { toast } = useToast();
  const previousContactRef = useRef<string>('');
  const previousAuthorizedRef = useRef<string>('');
  const previousActualOwnersRef = useRef<string>('');
  const isUpdatingRef = useRef(false);

  // Helper to get basic person fields from contact info
  const getBasicPersonFields = (contactInfo: any) => ({
    firstName: contactInfo.firstName || '',
    lastName: contactInfo.lastName || '',
    email: contactInfo.email || '',
    phone: contactInfo.phone || '',
    phonePrefix: contactInfo.phonePrefix || '+421'
  });

  // Helper to get common fields between authorized person and actual owner
  const getCommonPersonFields = (person: AuthorizedPerson | ActualOwner) => ({
    firstName: person.firstName,
    lastName: person.lastName,
    birthDate: 'birthDate' in person ? person.birthDate : '',
    birthPlace: 'birthPlace' in person ? person.birthPlace : '',
    birthNumber: 'birthNumber' in person ? person.birthNumber : '',
    citizenship: person.citizenship,
    permanentAddress: person.permanentAddress,
    isPoliticallyExposed: person.isPoliticallyExposed
  });

  // Helper to find linked persons using stable person ID
  const findLinkedPersons = () => {
    const personId = data.contactInfo.personId;
    
    const linkedAuthorizedPersons = data.authorizedPersons.filter(
      person => person.id === personId || person.createdFromContact || person.email === data.contactInfo.email
    );
    const linkedActualOwners = data.actualOwners.filter(
      owner => owner.id === personId || owner.createdFromContact || 
      (owner.firstName === data.contactInfo.firstName && owner.lastName === data.contactInfo.lastName)
    );
    
    return { linkedAuthorizedPersons, linkedActualOwners };
  };

  // Sync contact info changes to linked persons
  useEffect(() => {
    if (!enableSync || isUpdatingRef.current) return;

    const currentContactString = JSON.stringify(getBasicPersonFields(data.contactInfo));
    
    if (currentContactString === previousContactRef.current) return;
    
    const { linkedAuthorizedPersons, linkedActualOwners } = findLinkedPersons();
    
    if (linkedAuthorizedPersons.length === 0 && linkedActualOwners.length === 0) {
      previousContactRef.current = currentContactString;
      return;
    }

    const basicFields = getBasicPersonFields(data.contactInfo);
    const personId = data.contactInfo.personId;
    let hasChanges = false;

    // Update linked authorized persons
    const updatedAuthorizedPersons = data.authorizedPersons.map(person => {
      if (person.id === personId || person.createdFromContact || person.email === data.contactInfo.email) {
        hasChanges = true;
        return {
          ...person,
          id: personId || person.id,
          firstName: basicFields.firstName,
          lastName: basicFields.lastName,
          email: basicFields.email,
          phone: basicFields.phone,
          phonePrefix: basicFields.phonePrefix,
          createdFromContact: true
        };
      }
      return person;
    });

    // Update linked actual owners
    const updatedActualOwners = data.actualOwners.map(owner => {
      if (owner.id === personId || owner.createdFromContact || 
          (owner.firstName === data.contactInfo.firstName && owner.lastName === data.contactInfo.lastName)) {
        hasChanges = true;
        return {
          ...owner,
          id: personId || owner.id,
          firstName: basicFields.firstName,
          lastName: basicFields.lastName,
          createdFromContact: true
        };
      }
      return owner;
    });

    if (hasChanges) {
      isUpdatingRef.current = true;
      
      updateData({
        authorizedPersons: updatedAuthorizedPersons,
        actualOwners: updatedActualOwners
      });

      toast({
        title: "Údaje synchronizované",
        description: "Zmeny v kontaktných údajoch boli automaticky aplikované na prepojené osoby.",
      });

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }

    previousContactRef.current = currentContactString;
  }, [data.contactInfo, data.authorizedPersons, data.actualOwners, updateData, enableSync, toast]);

  // Sync authorized person changes to actual owners and back to contact info
  useEffect(() => {
    if (!enableSync || isUpdatingRef.current) return;

    const currentAuthorizedString = JSON.stringify(data.authorizedPersons.map(p => getCommonPersonFields(p)));
    
    if (currentAuthorizedString === previousAuthorizedRef.current) return;

    let hasChanges = false;
    const updatedActualOwners = [...data.actualOwners];
    const updatedContactInfo = { ...data.contactInfo };

    // Check each authorized person for updates
    data.authorizedPersons.forEach(authorizedPerson => {
      if (!authorizedPerson.createdFromContact && !authorizedPerson.id) return;

      // Find corresponding actual owner by personId or name
      const actualOwnerIndex = updatedActualOwners.findIndex(owner => 
        owner.id === authorizedPerson.id || 
        (owner.createdFromContact && owner.firstName === authorizedPerson.firstName && owner.lastName === authorizedPerson.lastName)
      );

      if (actualOwnerIndex !== -1) {
        const existingOwner = updatedActualOwners[actualOwnerIndex];
        const authorizedFields = getCommonPersonFields(authorizedPerson);
        const ownerFields = getCommonPersonFields(existingOwner);

        // Check if fields are different
        if (JSON.stringify(authorizedFields) !== JSON.stringify(ownerFields)) {
          updatedActualOwners[actualOwnerIndex] = {
            ...existingOwner,
            firstName: authorizedPerson.firstName,
            lastName: authorizedPerson.lastName,
            birthDate: authorizedPerson.birthDate,
            birthPlace: authorizedPerson.birthPlace,
            birthNumber: authorizedPerson.birthNumber,
            citizenship: authorizedPerson.citizenship,
            permanentAddress: authorizedPerson.permanentAddress,
            isPoliticallyExposed: authorizedPerson.isPoliticallyExposed,
            id: authorizedPerson.id, // Ensure same ID
            createdFromContact: true
          };
          hasChanges = true;
        }
      }

      // Update contact info if this authorized person is the contact person
      if (authorizedPerson.id === data.contactInfo.personId || 
          (authorizedPerson.createdFromContact && authorizedPerson.email === data.contactInfo.email)) {
        updatedContactInfo.firstName = authorizedPerson.firstName;
        updatedContactInfo.lastName = authorizedPerson.lastName;
        updatedContactInfo.email = authorizedPerson.email;
        updatedContactInfo.phone = authorizedPerson.phone;
        updatedContactInfo.phonePrefix = authorizedPerson.phonePrefix || '+421';
        hasChanges = true;
      }
    });

    if (hasChanges) {
      isUpdatingRef.current = true;
      
      updateData({
        actualOwners: updatedActualOwners,
        contactInfo: updatedContactInfo
      });

      toast({
        title: "Údaje synchronizované",
        description: "Zmeny v oprávnených osobách boli automaticky aplikované na skutočných majiteľov a kontaktné údaje.",
      });

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }

    previousAuthorizedRef.current = currentAuthorizedString;
  }, [data.authorizedPersons, data.actualOwners, data.contactInfo, updateData, enableSync, toast]);

  // Sync actual owner changes to authorized persons and back to contact info
  useEffect(() => {
    if (!enableSync || isUpdatingRef.current) return;

    const currentActualOwnersString = JSON.stringify(data.actualOwners.map(o => getCommonPersonFields(o)));
    
    if (currentActualOwnersString === previousActualOwnersRef.current) return;

    let hasChanges = false;
    const updatedAuthorizedPersons = [...data.authorizedPersons];
    const updatedContactInfo = { ...data.contactInfo };

    // Check each actual owner for updates
    data.actualOwners.forEach(actualOwner => {
      if (!actualOwner.createdFromContact && !actualOwner.id) return;

      // Find corresponding authorized person by personId or name
      const authorizedPersonIndex = updatedAuthorizedPersons.findIndex(person => 
        person.id === actualOwner.id || 
        (person.createdFromContact && person.firstName === actualOwner.firstName && person.lastName === actualOwner.lastName)
      );

      if (authorizedPersonIndex !== -1) {
        const existingPerson = updatedAuthorizedPersons[authorizedPersonIndex];
        const ownerFields = getCommonPersonFields(actualOwner);
        const personFields = getCommonPersonFields(existingPerson);

        // Check if fields are different
        if (JSON.stringify(ownerFields) !== JSON.stringify(personFields)) {
          updatedAuthorizedPersons[authorizedPersonIndex] = {
            ...existingPerson,
            firstName: actualOwner.firstName,
            lastName: actualOwner.lastName,
            birthDate: actualOwner.birthDate,
            birthPlace: actualOwner.birthPlace,
            birthNumber: actualOwner.birthNumber,
            citizenship: actualOwner.citizenship,
            permanentAddress: actualOwner.permanentAddress,
            isPoliticallyExposed: actualOwner.isPoliticallyExposed,
            id: actualOwner.id, // Ensure same ID
            createdFromContact: true
          };
          hasChanges = true;
        }
      }

      // Update contact info if this actual owner is the contact person
      if (actualOwner.id === data.contactInfo.personId || 
          (actualOwner.createdFromContact && actualOwner.firstName === data.contactInfo.firstName && actualOwner.lastName === data.contactInfo.lastName)) {
        updatedContactInfo.firstName = actualOwner.firstName;
        updatedContactInfo.lastName = actualOwner.lastName;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      isUpdatingRef.current = true;
      
      updateData({
        authorizedPersons: updatedAuthorizedPersons,
        contactInfo: updatedContactInfo
      });

      toast({
        title: "Údaje synchronizované",
        description: "Zmeny v skutočných majiteľoch boli automaticky aplikované na oprávnené osoby a kontaktné údaje.",
      });

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }

    previousActualOwnersRef.current = currentActualOwnersString;
  }, [data.actualOwners, data.authorizedPersons, data.contactInfo, updateData, enableSync, toast]);

  // Legacy sync functions (kept for backward compatibility)
  const syncAuthorizedPersonToContact = (updatedPerson: AuthorizedPerson) => {
    if (!enableSync || isUpdatingRef.current) return;

    const personId = data.contactInfo.personId;
    if (updatedPerson.id === personId || updatedPerson.createdFromContact || updatedPerson.email === data.contactInfo.email) {
      isUpdatingRef.current = true;

      updateData({
        contactInfo: {
          ...data.contactInfo,
          firstName: updatedPerson.firstName,
          lastName: updatedPerson.lastName,
          email: updatedPerson.email,
          phone: updatedPerson.phone,
          phonePrefix: updatedPerson.phonePrefix || '+421'
        }
      });

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  };

  const syncActualOwnerToContact = (updatedOwner: ActualOwner) => {
    if (!enableSync || isUpdatingRef.current) return;

    const personId = data.contactInfo.personId;
    if (updatedOwner.id === personId || updatedOwner.createdFromContact) {
      isUpdatingRef.current = true;

      updateData({
        contactInfo: {
          ...data.contactInfo,
          firstName: updatedOwner.firstName,
          lastName: updatedOwner.lastName
        }
      });

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  };

  // Helper to mark person as linked to contact
  const linkPersonToContact = (targetPersonId: string, personType: 'authorized' | 'actual') => {
    const personId = data.contactInfo.personId;
    
    if (personType === 'authorized') {
      const updatedPersons = data.authorizedPersons.map(person =>
        person.id === targetPersonId ? { 
          ...person, 
          id: personId || person.id,
          createdFromContact: true 
        } : person
      );
      updateData({ authorizedPersons: updatedPersons });
    } else {
      const updatedOwners = data.actualOwners.map(owner =>
        owner.id === targetPersonId ? { 
          ...owner, 
          id: personId || owner.id,
          createdFromContact: true 
        } : owner
      );
      updateData({ actualOwners: updatedOwners });
    }
  };

  // Helper to unlink person from contact
  const unlinkPersonFromContact = (targetPersonId: string, personType: 'authorized' | 'actual') => {
    if (personType === 'authorized') {
      const updatedPersons = data.authorizedPersons.map(person =>
        person.id === targetPersonId ? { ...person, createdFromContact: false } : person
      );
      updateData({ authorizedPersons: updatedPersons });
    } else {
      const updatedOwners = data.actualOwners.map(owner =>
        owner.id === targetPersonId ? { ...owner, createdFromContact: false } : owner
      );
      updateData({ actualOwners: updatedOwners });
    }
  };

  return {
    syncAuthorizedPersonToContact,
    syncActualOwnerToContact,
    linkPersonToContact,
    unlinkPersonFromContact,
    findLinkedPersons,
    isUpdating: isUpdatingRef.current
  };
};
