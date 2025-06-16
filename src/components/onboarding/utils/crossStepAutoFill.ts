
import { OnboardingData, AuthorizedPerson, ActualOwner, BusinessLocation, BankAccount, OpeningHours } from "@/types/onboarding";
import { v4 as uuidv4 } from "uuid";

export const createAuthorizedPersonFromCompanyContact = (companyInfo: OnboardingData['companyInfo'], contactInfo?: OnboardingData['contactInfo']): AuthorizedPerson => {
  const position = getDefaultPositionByRegistryType(companyInfo.registryType);
  
  // Use contactInfo personId if available, otherwise generate new one
  const personId = contactInfo?.personId || uuidv4();
  
  return {
    id: personId, // Use stable person ID
    firstName: companyInfo.contactPerson.firstName,
    lastName: companyInfo.contactPerson.lastName,
    email: companyInfo.contactPerson.email,
    phone: companyInfo.contactPerson.phone,
    phonePrefix: contactInfo?.phonePrefix || '+421',
    maidenName: '',
    birthDate: '',
    birthPlace: '',
    birthNumber: '',
    permanentAddress: '',
    position,
    documentType: 'OP',
    documentNumber: '',
    documentValidity: '',
    documentIssuer: '',
    documentCountry: getDefaultCountryByICO(companyInfo.ico),
    citizenship: getDefaultCountryByICO(companyInfo.ico),
    isPoliticallyExposed: false,
    isUSCitizen: false,
    documentFrontUrl: '',
    documentBackUrl: '',
    createdFromContact: true
  };
};

export const createActualOwnerFromCompanyContact = (companyInfo: OnboardingData['companyInfo'], contactInfo?: OnboardingData['contactInfo']): ActualOwner => {
  // Use contactInfo personId if available, otherwise generate new one
  const personId = contactInfo?.personId || uuidv4();
  
  return {
    id: personId, // Use stable person ID
    firstName: companyInfo.contactPerson.firstName,
    lastName: companyInfo.contactPerson.lastName,
    maidenName: '',
    birthDate: '',
    birthPlace: '',
    birthNumber: '',
    citizenship: getDefaultCountryByICO(companyInfo.ico),
    permanentAddress: '',
    isPoliticallyExposed: false,
    createdFromContact: true
  };
};

// New function to update existing authorized person instead of creating new one
export const updateExistingAuthorizedPerson = (
  existingPerson: AuthorizedPerson,
  companyInfo: OnboardingData['companyInfo'],
  contactInfo?: OnboardingData['contactInfo']
): AuthorizedPerson => {
  return {
    ...existingPerson,
    firstName: companyInfo.contactPerson.firstName,
    lastName: companyInfo.contactPerson.lastName,
    email: companyInfo.contactPerson.email,
    phone: companyInfo.contactPerson.phone,
    phonePrefix: contactInfo?.phonePrefix || existingPerson.phonePrefix || '+421',
    createdFromContact: true
  };
};

// New function to update existing actual owner instead of creating new one
export const updateExistingActualOwner = (
  existingOwner: ActualOwner,
  companyInfo: OnboardingData['companyInfo']
): ActualOwner => {
  return {
    ...existingOwner,
    firstName: companyInfo.contactPerson.firstName,
    lastName: companyInfo.contactPerson.lastName,
    createdFromContact: true
  };
};

export const createBusinessLocationFromCompanyInfo = (companyInfo: OnboardingData['companyInfo']): BusinessLocation => {
  const defaultBankAccount: BankAccount = {
    id: uuidv4(),
    format: 'IBAN',
    iban: '',
    mena: getDefaultCurrencyByICO(companyInfo.ico)
  };

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
    name: companyInfo.companyName,
    hasPOS: false,
    address: {
      street: companyInfo.address.street,
      city: companyInfo.address.city,
      zipCode: companyInfo.address.zipCode
    },
    iban: '',
    bankAccounts: [defaultBankAccount],
    contactPerson: {
      name: `${companyInfo.contactPerson.firstName} ${companyInfo.contactPerson.lastName}`,
      email: companyInfo.contactPerson.email,
      phone: companyInfo.contactPerson.phone
    },
    businessSector: getDefaultBusinessSectorByRegistryType(companyInfo.registryType),
    businessSubject: '',
    mccCode: '',
    estimatedTurnover: 0,
    monthlyTurnover: 0,
    averageTransaction: 0,
    openingHours: 'Po-Pi: 09:00-17:00',
    openingHoursDetailed: defaultOpeningHours,
    seasonality: 'year-round',
    assignedPersons: [],
    createdFromContact: true
  };
};

export const getDefaultPositionByRegistryType = (registryType: string): string => {
  switch (registryType) {
    case 'S.r.o.':
      return 'Konateľ';
    case 'Akciová spoločnosť':
      return 'Predstavenstvo';
    case 'Živnosť':
      return 'Fyzická osoba - podnikateľ';
    case 'Nezisková organizácia':
      return 'Štatutárny zástupca';
    default:
      return 'Konateľ';
  }
};

export const getDefaultCountryByICO = (ico: string): string => {
  // Slovak ICO starts with specific patterns
  if (ico && ico.length === 8 && /^\d+$/.test(ico)) {
    return 'Slovensko';
  }
  // Czech ICO patterns
  if (ico && ico.length === 8 && /^\d+$/.test(ico)) {
    return 'Česká republika';
  }
  return 'Slovensko'; // Default
};

export const getDefaultCurrencyByICO = (ico: string): 'EUR' | 'CZK' | 'USD' => {
  const country = getDefaultCountryByICO(ico);
  switch (country) {
    case 'Česká republika':
      return 'CZK';
    case 'Slovensko':
    default:
      return 'EUR';
  }
};

export const getDefaultBusinessSectorByRegistryType = (registryType: string): string => {
  switch (registryType) {
    case 'Nezisková organizácia':
      return 'Neziskový sektor';
    case 'Živnosť':
      return 'Služby';
    case 'S.r.o.':
    case 'Akciová spoločnosť':
    default:
      return 'Obchod a služby';
  }
};

export const shouldCreateOrUpdateAuthorizedPersonFromContact = (
  companyInfo: OnboardingData['companyInfo'],
  contactInfo: OnboardingData['contactInfo'], 
  authorizedPersons: AuthorizedPerson[]
): { action: 'create' | 'update' | 'none'; existingPerson?: AuthorizedPerson } => {
  if (!companyInfo.contactPerson.firstName || !companyInfo.contactPerson.lastName) {
    return { action: 'none' };
  }

  // First check by personId if available
  if (contactInfo.personId) {
    const existingByPersonId = authorizedPersons.find(person => person.id === contactInfo.personId);
    if (existingByPersonId) {
      return { action: 'update', existingPerson: existingByPersonId };
    }
  }

  // Check if contact person already exists by name and email
  const existingByContact = authorizedPersons.find(person => 
    person.firstName === companyInfo.contactPerson.firstName &&
    person.lastName === companyInfo.contactPerson.lastName &&
    person.email === companyInfo.contactPerson.email
  );

  if (existingByContact) {
    return { action: 'update', existingPerson: existingByContact };
  }

  return { action: 'create' };
};

export const shouldCreateOrUpdateActualOwnerFromContact = (
  contactInfo: OnboardingData['contactInfo'],
  companyInfo: OnboardingData['companyInfo'], 
  actualOwners: ActualOwner[]
): { action: 'create' | 'update' | 'none'; existingOwner?: ActualOwner } => {
  // Only auto-create if contact person has "Majiteľ" role
  const hasOwnerRole = contactInfo.userRoles?.includes('Majiteľ') || contactInfo.userRole === 'Majiteľ';
  
  if (!hasOwnerRole || !companyInfo.contactPerson.firstName || !companyInfo.contactPerson.lastName) {
    return { action: 'none' };
  }

  // First check by personId if available
  if (contactInfo.personId) {
    const existingByPersonId = actualOwners.find(owner => owner.id === contactInfo.personId);
    if (existingByPersonId) {
      return { action: 'update', existingOwner: existingByPersonId };
    }
  }

  // Check if contact person already exists by name
  const existingByContact = actualOwners.find(owner => 
    owner.firstName === companyInfo.contactPerson.firstName &&
    owner.lastName === companyInfo.contactPerson.lastName
  );

  if (existingByContact) {
    return { action: 'update', existingOwner: existingByContact };
  }

  return { action: 'create' };
};

export const updateSigningPersonFromContact = (
  companyInfo: OnboardingData['companyInfo'],
  contactInfo: OnboardingData['contactInfo'],
  authorizedPersons: AuthorizedPerson[],
  currentSigningPersonId?: string
): string | undefined => {
  // If there's already a signing person set, don't change it
  if (currentSigningPersonId) {
    return currentSigningPersonId;
  }

  // Find the contact person in authorized persons by personId first, then by contact details
  let contactAsAuthorized: AuthorizedPerson | undefined;
  
  if (contactInfo.personId) {
    contactAsAuthorized = authorizedPersons.find(person => person.id === contactInfo.personId);
  }
  
  if (!contactAsAuthorized) {
    contactAsAuthorized = authorizedPersons.find(person =>
      person.firstName === companyInfo.contactPerson.firstName &&
      person.lastName === companyInfo.contactPerson.lastName &&
      person.email === companyInfo.contactPerson.email
    );
  }

  return contactAsAuthorized?.id;
};

export const findDuplicatePersons = (data: OnboardingData) => {
  const duplicates: Array<{ type: string; message: string; action: string }> = [];

  // Check if contact person exists in authorized persons but with different data
  const contactInAuthorized = data.authorizedPersons.find(person =>
    person.firstName === data.companyInfo.contactPerson.firstName &&
    person.lastName === data.companyInfo.contactPerson.lastName
  );

  if (contactInAuthorized) {
    // Check for email differences
    if (contactInAuthorized.email !== data.companyInfo.contactPerson.email) {
      duplicates.push({
        type: 'email-mismatch',
        message: 'Kontaktná osoba má rozdielny email v oprávnených osobách',
        action: 'sync-contact-email'
      });
    }

    // Check for phone differences (handle both old format and new format)
    const contactFullPhone = `${data.contactInfo.phonePrefix}${data.contactInfo.phone}`;
    const authorizedFullPhone = `${contactInAuthorized.phonePrefix || '+421'}${contactInAuthorized.phone}`;
    
    if (contactFullPhone !== authorizedFullPhone) {
      duplicates.push({
        type: 'phone-mismatch',
        message: 'Kontaktná osoba má rozdielne telefónne číslo v oprávnených osobách',
        action: 'sync-contact-phone'
      });
    }
  }

  // Removed the duplicate person check between authorized persons and actual owners
  // It's normal for the same person to be in both sections

  return duplicates;
};

export const getDataConsistencyIssues = (data: OnboardingData) => {
  const issues: Array<{ type: string; message: string; action: string }> = [];

  // Check if contact person is missing from authorized persons
  const shouldCreateResult = shouldCreateOrUpdateAuthorizedPersonFromContact(data.companyInfo, data.contactInfo, data.authorizedPersons);
  if (shouldCreateResult.action === 'create' &&
      !data.authorizedPersons.some(person =>
        person.firstName === data.companyInfo.contactPerson.firstName &&
        person.lastName === data.companyInfo.contactPerson.lastName
      )) {
    issues.push({
      type: 'missing-contact-in-authorized',
      message: 'Kontaktná osoba spoločnosti nie je v zozname oprávnených osôb',
      action: 'add-contact-to-authorized'
    });
  }

  // Check if head office address doesn't match business locations when it should
  if (data.companyInfo.headOfficeEqualsOperatingAddress && data.businessLocations.length > 0) {
    const hasMatchingLocation = data.businessLocations.some(location =>
      location.address.street === data.companyInfo.address.street &&
      location.address.city === data.companyInfo.address.city &&
      location.address.zipCode === data.companyInfo.address.zipCode
    );

    if (!hasMatchingLocation) {
      issues.push({
        type: 'address-mismatch',
        message: 'Žiadna prevádzka nemá adresu sídla spoločnosti',
        action: 'sync-business-location-address'
      });
    }
  }

  return issues;
};

export const getAutoFillSuggestions = (data: OnboardingData) => {
  const suggestions: string[] = [];

  // Check for potential auto-fills
  if (shouldCreateOrUpdateAuthorizedPersonFromContact(data.companyInfo, data.contactInfo, data.authorizedPersons).action === 'create') {
    suggestions.push('Pridať kontaktnú osobu spoločnosti do oprávnených osôb');
  }

  if (shouldCreateOrUpdateActualOwnerFromContact(data.contactInfo, data.companyInfo, data.actualOwners).action === 'create') {
    suggestions.push('Pridať kontaktnú osobu ako skutočného majiteľa');
  }

  if (data.companyInfo.headOfficeEqualsOperatingAddress && data.businessLocations.length === 0) {
    suggestions.push('Vytvoriť prevádzku s adresou sídla spoločnosti');
  }

  // Add suggestions for duplicates and consistency issues
  const duplicates = findDuplicatePersons(data);
  const issues = getDataConsistencyIssues(data);

  duplicates.forEach(duplicate => {
    suggestions.push(duplicate.message);
  });

  issues.forEach(issue => {
    suggestions.push(issue.message);
  });

  return suggestions;
};

export const syncContactPersonData = (
  data: OnboardingData,
  updateData: (data: Partial<OnboardingData>) => void
) => {
  const updatedAuthorizedPersons = data.authorizedPersons.map(person => {
    if (person.firstName === data.companyInfo.contactPerson.firstName &&
        person.lastName === data.companyInfo.contactPerson.lastName) {
      return {
        ...person,
        email: data.companyInfo.contactPerson.email,
        phone: data.companyInfo.contactPerson.phone,
        phonePrefix: data.contactInfo.phonePrefix || '+421'
      };
    }
    return person;
  });

  updateData({ authorizedPersons: updatedAuthorizedPersons });
};

export const syncBusinessLocationAddresses = (
  data: OnboardingData,
  updateData: (data: Partial<OnboardingData>) => void
) => {
  if (data.companyInfo.headOfficeEqualsOperatingAddress) {
    const updatedLocations = data.businessLocations.map(location => ({
      ...location,
      address: {
        street: data.companyInfo.address.street,
        city: data.companyInfo.address.city,
        zipCode: data.companyInfo.address.zipCode
      }
    }));

    updateData({ businessLocations: updatedLocations });
  }
};
