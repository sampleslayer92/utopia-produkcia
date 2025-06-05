
import { OnboardingData } from "@/types/onboarding";
import { createAuthorizedPersonFromContactInfo, createActualOwnerFromContactInfo } from "./personFactories";
import { createDefaultBusinessLocation, updateBusinessLocationsContactPerson } from "./businessLocationFactories";
import { shouldAutoFillBasedOnRole } from "./autoFillHelpers";

export const handleMajitelRole = (
  contactInfo: OnboardingData['contactInfo'],
  currentData: OnboardingData
) => {
  const updates: Partial<OnboardingData> = {};
  
  const existingOwner = currentData.actualOwners.find(p => 
    p.firstName === contactInfo.firstName && 
    p.lastName === contactInfo.lastName
  );

  if (!existingOwner) {
    console.log('Creating actual owner record for Majiteľ role');
    const actualOwner = createActualOwnerFromContactInfo(contactInfo);
    updates.actualOwners = [...currentData.actualOwners, actualOwner];
  }

  return updates;
};

export const handleKonatelRole = (
  contactInfo: OnboardingData['contactInfo'],
  currentData: OnboardingData
) => {
  const updates: Partial<OnboardingData> = {};

  // Check for existing authorized person
  const existingAuthorized = currentData.authorizedPersons.find(p => 
    p.firstName === contactInfo.firstName && 
    p.lastName === contactInfo.lastName && 
    p.email === contactInfo.email
  );

  // Add to authorized persons if not exists
  if (!existingAuthorized) {
    console.log('Creating authorized person record for Konateľ role');
    const authorizedPerson = createAuthorizedPersonFromContactInfo(contactInfo);
    updates.authorizedPersons = [...currentData.authorizedPersons, authorizedPerson];
    
    // Set as signing person
    updates.consents = {
      ...currentData.consents,
      signingPersonId: authorizedPerson.id
    };
  }

  // Set as technical person if empty
  const currentTechnicalPerson = currentData.companyInfo.contactPerson;
  const isTechnicalPersonEmpty = !currentTechnicalPerson.firstName && !currentTechnicalPerson.lastName;
  
  if (isTechnicalPersonEmpty) {
    console.log('Setting Konateľ as technical contact person');
    updates.companyInfo = {
      ...currentData.companyInfo,
      contactPerson: {
        ...currentData.companyInfo.contactPerson,
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        isTechnicalPerson: true
      }
    };
  }

  // Handle business locations
  let updatedBusinessLocations = currentData.businessLocations;
  if (updatedBusinessLocations.length === 0) {
    console.log('Creating default business location for Konateľ role');
    const defaultLocation = createDefaultBusinessLocation(contactInfo, true);
    updatedBusinessLocations = [defaultLocation];
  } else {
    // Update existing business locations if no contact set
    updatedBusinessLocations = updatedBusinessLocations.map(location => {
      if (!location.contactPerson.name) {
        return {
          ...location,
          contactPerson: {
            name: `${contactInfo.firstName} ${contactInfo.lastName}`,
            email: contactInfo.email,
            phone: contactInfo.phone
          }
        };
      }
      return location;
    });
  }
  
  if (updatedBusinessLocations !== currentData.businessLocations) {
    updates.businessLocations = updatedBusinessLocations;
  }

  return updates;
};

export const handleTechnicalContactRole = (
  contactInfo: OnboardingData['contactInfo'],
  currentData: OnboardingData
) => {
  console.log('Updating technical contact person');
  return {
    companyInfo: {
      ...currentData.companyInfo,
      contactPerson: {
        ...currentData.companyInfo.contactPerson,
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        isTechnicalPerson: true
      }
    }
  };
};

export const handleBusinessContactRole = (
  contactInfo: OnboardingData['contactInfo'],
  currentData: OnboardingData
) => {
  let updatedBusinessLocations = currentData.businessLocations;
  
  // Create first business location if none exists
  if (updatedBusinessLocations.length === 0) {
    console.log('Creating default business location for business contact role');
    const defaultLocation = createDefaultBusinessLocation(contactInfo, true);
    updatedBusinessLocations = [defaultLocation];
  } else {
    // Update existing business locations
    updatedBusinessLocations = updateBusinessLocationsContactPerson(
      updatedBusinessLocations, 
      contactInfo, 
      'Kontaktná osoba na prevádzku'
    );
  }
  
  const updates: Partial<OnboardingData> = {};
  if (updatedBusinessLocations !== currentData.businessLocations) {
    updates.businessLocations = updatedBusinessLocations;
  }

  return updates;
};

export const getAutoFillUpdates = (role: string, contactInfo: OnboardingData['contactInfo'], currentData: OnboardingData) => {
  if (!shouldAutoFillBasedOnRole(role, contactInfo)) {
    return {};
  }

  console.log('Auto-fill triggered with role:', role, 'and contact info:', contactInfo);

  switch (role) {
    case 'Majiteľ':
      return handleMajitelRole(contactInfo, currentData);
    case 'Konateľ':
      return handleKonatelRole(contactInfo, currentData);
    case 'Kontaktná osoba pre technické záležitosti':
      return handleTechnicalContactRole(contactInfo, currentData);
    case 'Kontaktná osoba na prevádzku':
      return handleBusinessContactRole(contactInfo, currentData);
    default:
      return {};
  }
};
