import { OnboardingData, AuthorizedPerson, ActualOwner, BusinessLocation, BankAccount, OpeningHours } from "@/types/onboarding";
import { v4 as uuidv4 } from "uuid";

export const createAuthorizedPersonFromCompanyContact = (companyInfo: OnboardingData['companyInfo'], contactInfo?: OnboardingData['contactInfo']): AuthorizedPerson => {
  const position = getDefaultPositionByRegistryType(companyInfo.registryType);
  
  return {
    id: uuidv4(),
    firstName: companyInfo.contactPerson.firstName,
    lastName: companyInfo.contactPerson.lastName,
    email: companyInfo.contactPerson.email,
    phone: companyInfo.contactPerson.phone,
    phonePrefix: contactInfo?.phonePrefix || '+421', // Use contact prefix or default
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
    documentBackUrl: ''
  };
};

export const createActualOwnerFromCompanyContact = (companyInfo: OnboardingData['companyInfo']): ActualOwner => {
  return {
    id: uuidv4(),
    firstName: companyInfo.contactPerson.firstName,
    lastName: companyInfo.contactPerson.lastName,
    maidenName: '',
    birthDate: '',
    birthPlace: '',
    birthNumber: '',
    citizenship: getDefaultCountryByICO(companyInfo.ico),
    permanentAddress: '',
    isPoliticallyExposed: false
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
    assignedPersons: []
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

export const shouldCreateAuthorizedPersonFromContact = (
  companyInfo: OnboardingData['companyInfo'], 
  authorizedPersons: AuthorizedPerson[]
): boolean => {
  if (!companyInfo.contactPerson.firstName || !companyInfo.contactPerson.lastName) {
    return false;
  }

  // Check if contact person already exists in authorized persons
  const exists = authorizedPersons.some(person => 
    person.firstName === companyInfo.contactPerson.firstName &&
    person.lastName === companyInfo.contactPerson.lastName &&
    person.email === companyInfo.contactPerson.email
  );

  return !exists;
};

export const shouldCreateActualOwnerFromContact = (
  contactInfo: OnboardingData['contactInfo'],
  companyInfo: OnboardingData['companyInfo'], 
  actualOwners: ActualOwner[]
): boolean => {
  // Only auto-create if contact person has "Majiteľ" role
  const hasOwnerRole = contactInfo.userRoles?.includes('Majiteľ') || contactInfo.userRole === 'Majiteľ';
  
  if (!hasOwnerRole || !companyInfo.contactPerson.firstName || !companyInfo.contactPerson.lastName) {
    return false;
  }

  // Check if contact person already exists in actual owners
  const exists = actualOwners.some(owner => 
    owner.firstName === companyInfo.contactPerson.firstName &&
    owner.lastName === companyInfo.contactPerson.lastName
  );

  return !exists;
};

export const updateSigningPersonFromContact = (
  companyInfo: OnboardingData['companyInfo'],
  authorizedPersons: AuthorizedPerson[],
  currentSigningPersonId?: string
): string | undefined => {
  // If there's already a signing person set, don't change it
  if (currentSigningPersonId) {
    return currentSigningPersonId;
  }

  // Find the contact person in authorized persons
  const contactAsAuthorized = authorizedPersons.find(person =>
    person.firstName === companyInfo.contactPerson.firstName &&
    person.lastName === companyInfo.contactPerson.lastName &&
    person.email === companyInfo.contactPerson.email
  );

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

  // Check for duplicate persons between authorized and actual owners
  data.authorizedPersons.forEach(authPerson => {
    const duplicateOwner = data.actualOwners.find(owner =>
      owner.firstName === authPerson.firstName && 
      owner.lastName === authPerson.lastName
    );
    
    if (duplicateOwner) {
      duplicates.push({
        type: 'duplicate-person',
        message: `${authPerson.firstName} ${authPerson.lastName} je v oprávnených osobách aj skutočných majiteľoch`,
        action: 'merge-person-data'
      });
    }
  });

  return duplicates;
};

export const getDataConsistencyIssues = (data: OnboardingData) => {
  const issues: Array<{ type: string; message: string; action: string }> = [];

  // Check if contact person is missing from authorized persons
  if (!shouldCreateAuthorizedPersonFromContact(data.companyInfo, data.authorizedPersons) &&
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
  if (shouldCreateAuthorizedPersonFromContact(data.companyInfo, data.authorizedPersons)) {
    suggestions.push('Pridať kontaktnú osobu spoločnosti do oprávnených osôb');
  }

  if (shouldCreateActualOwnerFromContact(data.contactInfo, data.companyInfo, data.actualOwners)) {
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
