
import { OnboardingData } from "@/types/onboarding";
import { v4 as uuidv4 } from "uuid";

export const getPersonDataFromContactInfo = (contactInfo: OnboardingData['contactInfo']) => ({
  salutation: contactInfo.salutation,
  firstName: contactInfo.firstName,
  lastName: contactInfo.lastName,
  email: contactInfo.email,
  phone: contactInfo.phone,
  phonePrefix: contactInfo.phonePrefix
});

export const createAuthorizedPersonFromContactInfo = (contactInfo: OnboardingData['contactInfo']) => ({
  id: uuidv4(),
  firstName: contactInfo.firstName,
  lastName: contactInfo.lastName,
  email: contactInfo.email,
  phone: contactInfo.phone,
  maidenName: '',
  birthDate: '',
  birthPlace: '',
  birthNumber: '',
  permanentAddress: '',
  position: 'Konateľ',
  documentType: 'OP' as const,
  documentNumber: '',
  documentValidity: '',
  documentIssuer: '',
  documentCountry: 'Slovensko',
  citizenship: 'Slovensko',
  isPoliticallyExposed: false,
  isUSCitizen: false
});

export const createActualOwnerFromContactInfo = (contactInfo: OnboardingData['contactInfo']) => ({
  id: uuidv4(),
  firstName: contactInfo.firstName,
  lastName: contactInfo.lastName,
  maidenName: '',
  birthDate: '',
  birthPlace: '',
  birthNumber: '',
  citizenship: 'Slovensko',
  permanentAddress: '',
  isPoliticallyExposed: false
});

export const createDefaultBusinessLocation = (contactInfo: OnboardingData['contactInfo'], hasBusinessContactRole: boolean) => ({
  id: uuidv4(),
  name: '',
  hasPOS: false,
  address: { 
    street: '', 
    city: '', 
    zipCode: '' 
  },
  iban: '',
  contactPerson: hasBusinessContactRole ? {
    name: `${contactInfo.firstName} ${contactInfo.lastName}`,
    email: contactInfo.email,
    phone: contactInfo.phone
  } : {
    name: '',
    email: '',
    phone: ''
  },
  businessSector: '',
  estimatedTurnover: 0,
  averageTransaction: 0,
  openingHours: '',
  seasonality: 'year-round' as const,
  assignedPersons: []
});

export const shouldAutoFillBasedOnRoles = (roles: string[], contactInfo: OnboardingData['contactInfo']) => {
  return roles.length > 0 && 
         contactInfo.firstName && 
         contactInfo.lastName && 
         contactInfo.email && 
         contactInfo.phone &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email);
};

export const updateBusinessLocationsContactPerson = (
  businessLocations: OnboardingData['businessLocations'], 
  contactInfo: OnboardingData['contactInfo'],
  roles: string[]
) => {
  // Only update if user has relevant role
  const hasBusinessContactRole = roles.includes('Kontaktná osoba na prevádzku') || roles.includes('Majiteľ');
  
  if (!hasBusinessContactRole || !shouldAutoFillBasedOnRoles(roles, contactInfo)) {
    return businessLocations;
  }

  return businessLocations.map(location => {
    // Only auto-fill if contact person is empty or matches the previous contact info
    const shouldUpdate = !location.contactPerson.name || 
                        location.contactPerson.email === contactInfo.email ||
                        location.contactPerson.name === `${contactInfo.firstName} ${contactInfo.lastName}`;

    if (shouldUpdate) {
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
};

export const getAutoFillUpdates = (roles: string[], contactInfo: OnboardingData['contactInfo'], currentData: OnboardingData) => {
  if (!shouldAutoFillBasedOnRoles(roles, contactInfo)) {
    return {};
  }

  console.log('Auto-fill triggered with roles:', roles, 'and contact info:', contactInfo);

  const updates: Partial<OnboardingData> = {};

  // Check for existing records to avoid duplicates
  const existingAuthorized = currentData.authorizedPersons.find(p => 
    p.firstName === contactInfo.firstName && 
    p.lastName === contactInfo.lastName && 
    p.email === contactInfo.email
  );

  const existingOwner = currentData.actualOwners.find(p => 
    p.firstName === contactInfo.firstName && 
    p.lastName === contactInfo.lastName
  );

  // Handle Majiteľ role - create actual owner record
  if (roles.includes('Majiteľ') && !existingOwner) {
    console.log('Creating actual owner record for Majiteľ role');
    const actualOwner = createActualOwnerFromContactInfo(contactInfo);
    updates.actualOwners = [...currentData.actualOwners, actualOwner];
  }

  // Handle Konateľ role - create authorized person record
  if (roles.includes('Konateľ') && !existingAuthorized) {
    console.log('Creating authorized person record for Konateľ role');
    const authorizedPerson = createAuthorizedPersonFromContactInfo(contactInfo);
    updates.authorizedPersons = [...currentData.authorizedPersons, authorizedPerson];
    
    // Set as signing person
    updates.consents = {
      ...currentData.consents,
      signingPersonId: authorizedPerson.id
    };
  }

  // Handle Kontaktná osoba pre technické záležitosti
  if (roles.includes('Kontaktná osoba pre technické záležitosti')) {
    console.log('Updating technical contact person');
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

  // Handle business location creation and updates
  const hasBusinessContactRole = roles.includes('Kontaktná osoba na prevádzku') || roles.includes('Majiteľ');
  
  if (hasBusinessContactRole) {
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
        roles
      );
    }
    
    if (updatedBusinessLocations !== currentData.businessLocations) {
      updates.businessLocations = updatedBusinessLocations;
    }
  }

  console.log('Auto-fill updates generated:', Object.keys(updates));
  return updates;
};

// Helper function to check if contact info has changed significantly
export const hasContactInfoChanged = (
  prev: OnboardingData['contactInfo'], 
  current: OnboardingData['contactInfo']
) => {
  return prev.firstName !== current.firstName ||
         prev.lastName !== current.lastName ||
         prev.email !== current.email ||
         prev.phone !== current.phone ||
         prev.phonePrefix !== current.phonePrefix;
};

// Helper function to format phone number consistently
export const formatPhoneForDisplay = (phone: string, prefix: string = '+421') => {
  if (!phone) return '';
  
  // Remove any existing formatting
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on prefix
  if (prefix === '+421' || prefix === '+420') {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').slice(0, 11);
  }
  return cleaned.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1 $2 $3').slice(0, 13);
};

// Helper function to check if roles have business location requirements
export const requiresBusinessLocation = (roles: string[]) => {
  return roles.includes('Kontaktná osoba na prevádzku') || roles.includes('Majiteľ');
};

// Helper function to check if roles require actual owner record
export const requiresActualOwner = (roles: string[]) => {
  return roles.includes('Majiteľ');
};

// Helper function to check if roles require authorized person record
export const requiresAuthorizedPerson = (roles: string[]) => {
  return roles.includes('Konateľ');
};
