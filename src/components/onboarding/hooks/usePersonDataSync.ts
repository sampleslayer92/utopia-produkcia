
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
  const isUpdatingRef = useRef(false);

  // Helper to get basic person fields from contact info
  const getBasicPersonFields = (contactInfo: any) => ({
    firstName: contactInfo.firstName || '',
    lastName: contactInfo.lastName || '',
    email: contactInfo.email || '',
    phone: contactInfo.phone || '',
    phonePrefix: contactInfo.phonePrefix || '+421'
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
          id: personId || person.id, // Ensure stable ID
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
          id: personId || owner.id, // Ensure stable ID
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

  // Sync authorized person changes back to contact info
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

      toast({
        title: "Kontaktné údaje aktualizované",
        description: "Zmeny v oprávnenej osobe boli aplikované na kontaktné údaje.",
      });

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  };

  // Sync actual owner changes back to contact info
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

      toast({
        title: "Kontaktné údaje aktualizované", 
        description: "Zmeny v skutočnom majiteľovi boli aplikované na kontaktné údaje.",
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
          id: personId || person.id, // Use contact personId if available
          createdFromContact: true 
        } : person
      );
      updateData({ authorizedPersons: updatedPersons });
    } else {
      const updatedOwners = data.actualOwners.map(owner =>
        owner.id === targetPersonId ? { 
          ...owner, 
          id: personId || owner.id, // Use contact personId if available
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
