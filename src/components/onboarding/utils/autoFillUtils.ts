import { OnboardingData, BankAccount, OpeningHours } from "@/types/onboarding";
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

export const createDefaultBusinessLocation = (contactInfo: OnboardingData['contactInfo']) => {
  // Default bank account
  const defaultBankAccount: BankAccount = {
    id: uuidv4(),
    format: 'IBAN',
    iban: '',
    mena: 'EUR'
  };

  // Default opening hours (weekdays open, weekends closed)
  const defaultOpeningHours: OpeningHours[] = [
    { day: "Po", open: "09:00", close: "17:00", otvorene: true },
    { day: "Ut", open: "09:00", close: "17:00", otvorene: true },
    { day: "St", open: "09:00", close: "17:00", otvorene: true },
    { day: "Št", open: "09:00", close: "17:00", otvorene: true },
    { day: "Pi", open: "09:00", close: "17:00", otvorene: true },
    { day: "So", open: "09:00", close: "14:00", otvorene: false },
    { day: "Ne", open: "09:00", close: "17:00", otvorene: false }
  ];

  return {
    id: uuidv4(),
    name: '',
    hasPOS: false,
    address: { 
      street: '', 
      city: '', 
      zipCode: '' 
    },
    iban: '',
    bankAccounts: [defaultBankAccount],
    contactPerson: {
      name: `${contactInfo.firstName} ${contactInfo.lastName}`,
      email: contactInfo.email,
      phone: contactInfo.phone
    },
    businessSector: '',
    businessSubject: '',
    mccCode: '',
    estimatedTurnover: 0,
    monthlyTurnover: 0,
    averageTransaction: 0,
    openingHours: '',
    openingHoursDetailed: defaultOpeningHours,
    seasonality: 'year-round' as const,
    assignedPersons: []
  };
};

export const shouldAutoFillBasedOnContactInfo = (contactInfo: OnboardingData['contactInfo']) => {
  return contactInfo.firstName && 
         contactInfo.lastName && 
         contactInfo.email && 
         contactInfo.phone &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email);
};

// Simplified auto-fill function that doesn't depend on company type
export const getAutoFillUpdatesSimplified = (contactInfo: OnboardingData['contactInfo'], currentData: OnboardingData) => {
  if (!shouldAutoFillBasedOnContactInfo(contactInfo)) {
    return {};
  }

  console.log('Simplified auto-fill triggered with contact info:', contactInfo);

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

  // Always create actual owner record
  if (!existingOwner) {
    console.log('Creating actual owner record');
    const actualOwner = createActualOwnerFromContactInfo(contactInfo);
    updates.actualOwners = [...currentData.actualOwners, actualOwner];
  }

  // Always create authorized person record
  if (!existingAuthorized) {
    console.log('Creating authorized person record');
    const authorizedPerson = createAuthorizedPersonFromContactInfo(contactInfo);
    updates.authorizedPersons = [...currentData.authorizedPersons, authorizedPerson];
    
    // Set as signing person
    updates.consents = {
      ...currentData.consents,
      signingPersonId: authorizedPerson.id
    };
  }

  // Always update company contact person (removed registryType auto-fill)
  console.log('Updating company contact person');
  const companyUpdates: any = {
    contactPerson: {
      ...currentData.companyInfo.contactPerson,
      firstName: contactInfo.firstName,
      lastName: contactInfo.lastName,
      email: contactInfo.email,
      phone: contactInfo.phone,
      isTechnicalPerson: true
    }
  };

  updates.companyInfo = {
    ...currentData.companyInfo,
    ...companyUpdates
  };

  // Always create/update business location
  let updatedBusinessLocations = currentData.businessLocations;
  
  // Create first business location if none exists
  if (updatedBusinessLocations.length === 0) {
    console.log('Creating default business location');
    const defaultLocation = createDefaultBusinessLocation(contactInfo);
    updatedBusinessLocations = [defaultLocation];
  } else {
    // Update existing business locations with contact person
    updatedBusinessLocations = updatedBusinessLocations.map(location => {
      // Only auto-fill if contact person is empty or matches the contact info
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
  }
  
  if (updatedBusinessLocations !== currentData.businessLocations) {
    updates.businessLocations = updatedBusinessLocations;
  }

  console.log('Simplified auto-fill updates generated:', Object.keys(updates));
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
         prev.phonePrefix !== current.phonePrefix ||
         prev.userRole !== current.userRole ||
         prev.companyType !== current.companyType;
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

// Legacy function for backward compatibility
export const getAutoFillUpdates = getAutoFillUpdatesSimplified;

// Keep existing helper functions for backward compatibility
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

export const shouldAutoFillBasedOnRoles = (roles: string[], contactInfo: OnboardingData['contactInfo']) => {
  return roles.length > 0 && 
         contactInfo.firstName && 
         contactInfo.lastName && 
         contactInfo.email && 
         contactInfo.phone &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email);
};

// Legacy helper functions no longer used but kept for backward compatibility
export const requiresBusinessLocation = (roles: string[]) => {
  return roles.includes('Kontaktná osoba na prevádzku') || roles.includes('Majiteľ');
};

export const requiresActualOwner = (roles: string[]) => {
  return roles.includes('Majiteľ');
};

export const requiresAuthorizedPerson = (roles: string[]) => {
  return roles.includes('Konateľ');
};
