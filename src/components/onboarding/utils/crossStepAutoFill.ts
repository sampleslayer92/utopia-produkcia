
import { OnboardingData, AuthorizedPerson, ActualOwner, BusinessLocation, BankAccount, OpeningHours } from "@/types/onboarding";
import { v4 as uuidv4 } from "uuid";

export const createAuthorizedPersonFromCompanyContact = (companyInfo: OnboardingData['companyInfo']): AuthorizedPerson => {
  const position = getDefaultPositionByRegistryType(companyInfo.registryType);
  
  return {
    id: uuidv4(),
    firstName: companyInfo.contactPerson.firstName,
    lastName: companyInfo.contactPerson.lastName,
    email: companyInfo.contactPerson.email,
    phone: companyInfo.contactPerson.phone,
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
    documentCountry: 'Slovensko',
    citizenship: 'Slovensko',
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
    citizenship: 'Slovensko',
    permanentAddress: '',
    isPoliticallyExposed: false
  };
};

export const createBusinessLocationFromCompanyInfo = (companyInfo: OnboardingData['companyInfo']): BusinessLocation => {
  const defaultBankAccount: BankAccount = {
    id: uuidv4(),
    format: 'IBAN',
    iban: '',
    mena: 'EUR'
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
    businessSector: '',
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

  return suggestions;
};
