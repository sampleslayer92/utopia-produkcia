
import { useEffect, useRef } from 'react';
import { OnboardingData } from '@/types/onboarding';

interface ContactDataSyncOptions {
  onboardingData: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const useContactDataSync = ({ onboardingData, updateData }: ContactDataSyncOptions) => {
  const prevContactInfoRef = useRef(onboardingData.contactInfo);
  const prevCompanyContactRef = useRef(onboardingData.companyInfo.contactPerson);

  const updateContactDerivedData = (
    newContactInfo: OnboardingData['contactInfo'],
    newCompanyContact: OnboardingData['companyInfo']['contactPerson']
  ) => {
    const updates: Partial<OnboardingData> = {};

    // Update authorized persons created from contact
    const updatedAuthorizedPersons = onboardingData.authorizedPersons.map(person => {
      // Check if this person was created from contact data
      if (person.firstName === prevCompanyContactRef.current.firstName &&
          person.lastName === prevCompanyContactRef.current.lastName &&
          person.email === prevCompanyContactRef.current.email) {
        return {
          ...person,
          firstName: newCompanyContact.firstName,
          lastName: newCompanyContact.lastName,
          email: newCompanyContact.email,
          phone: newCompanyContact.phone,
          phonePrefix: newContactInfo.phonePrefix || '+421'
        };
      }
      return person;
    });

    // Update actual owners created from contact
    const updatedActualOwners = onboardingData.actualOwners.map(owner => {
      // Check if this owner was created from contact data
      if (owner.firstName === prevCompanyContactRef.current.firstName &&
          owner.lastName === prevCompanyContactRef.current.lastName) {
        return {
          ...owner,
          firstName: newCompanyContact.firstName,
          lastName: newCompanyContact.lastName
        };
      }
      return owner;
    });

    // Update business locations contact person
    const updatedBusinessLocations = onboardingData.businessLocations.map(location => {
      const currentContactName = `${prevCompanyContactRef.current.firstName} ${prevCompanyContactRef.current.lastName}`;
      if (location.contactPerson.name === currentContactName &&
          location.contactPerson.email === prevCompanyContactRef.current.email) {
        return {
          ...location,
          contactPerson: {
            ...location.contactPerson,
            name: `${newCompanyContact.firstName} ${newCompanyContact.lastName}`,
            email: newCompanyContact.email,
            phone: newCompanyContact.phone
          }
        };
      }
      return location;
    });

    // Check if any updates are needed
    if (updatedAuthorizedPersons.some((person, index) => 
        person !== onboardingData.authorizedPersons[index])) {
      updates.authorizedPersons = updatedAuthorizedPersons;
    }

    if (updatedActualOwners.some((owner, index) => 
        owner !== onboardingData.actualOwners[index])) {
      updates.actualOwners = updatedActualOwners;
    }

    if (updatedBusinessLocations.some((location, index) => 
        location !== onboardingData.businessLocations[index])) {
      updates.businessLocations = updatedBusinessLocations;
    }

    // Update signing person in consents if it was based on contact person
    if (onboardingData.consents.signingPersonId) {
      const signingPerson = onboardingData.authorizedPersons.find(
        person => person.id === onboardingData.consents.signingPersonId
      );
      
      if (signingPerson && 
          signingPerson.firstName === prevCompanyContactRef.current.firstName &&
          signingPerson.lastName === prevCompanyContactRef.current.lastName) {
        // The signing person will be updated through the authorized persons update above
        // No additional action needed
      }
    }

    if (Object.keys(updates).length > 0) {
      console.log('Synchronizing contact data changes:', updates);
      updateData(updates);
    }
  };

  // Watch for changes in contact info and company contact person
  useEffect(() => {
    const currentContactInfo = onboardingData.contactInfo;
    const currentCompanyContact = onboardingData.companyInfo.contactPerson;
    const prevContactInfo = prevContactInfoRef.current;
    const prevCompanyContact = prevCompanyContactRef.current;

    // Check if contact info has changed
    const contactInfoChanged = (
      currentContactInfo.firstName !== prevContactInfo.firstName ||
      currentContactInfo.lastName !== prevContactInfo.lastName ||
      currentContactInfo.email !== prevContactInfo.email ||
      currentContactInfo.phone !== prevContactInfo.phone ||
      currentContactInfo.phonePrefix !== prevContactInfo.phonePrefix
    );

    // Check if company contact person has changed
    const companyContactChanged = (
      currentCompanyContact.firstName !== prevCompanyContact.firstName ||
      currentCompanyContact.lastName !== prevCompanyContact.lastName ||
      currentCompanyContact.email !== prevCompanyContact.email ||
      currentCompanyContact.phone !== prevCompanyContact.phone
    );

    // Only sync if there are actual changes and we have existing persons to update
    if ((contactInfoChanged || companyContactChanged) && 
        (onboardingData.authorizedPersons.length > 0 || 
         onboardingData.actualOwners.length > 0 || 
         onboardingData.businessLocations.length > 0)) {
      
      updateContactDerivedData(currentContactInfo, currentCompanyContact);
    }

    // Update refs for next comparison
    prevContactInfoRef.current = currentContactInfo;
    prevCompanyContactRef.current = currentCompanyContact;
  }, [
    onboardingData.contactInfo.firstName,
    onboardingData.contactInfo.lastName,
    onboardingData.contactInfo.email,
    onboardingData.contactInfo.phone,
    onboardingData.contactInfo.phonePrefix,
    onboardingData.companyInfo.contactPerson.firstName,
    onboardingData.companyInfo.contactPerson.lastName,
    onboardingData.companyInfo.contactPerson.email,
    onboardingData.companyInfo.contactPerson.phone
  ]);

  return {
    updateContactDerivedData
  };
};
