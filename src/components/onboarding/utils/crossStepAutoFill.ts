
import { OnboardingData, ContactInfo, CompanyInfo, BusinessLocation, BankAccount, AuthorizedPerson, ActualOwner } from "@/types/onboarding";

export const autoFillContactInfo = (
  source: ContactInfo,
  target: ContactInfo,
  update: (field: keyof ContactInfo, value: any) => void
) => {
  if (source.firstName && !target.firstName) {
    update("firstName", source.firstName);
  }
  if (source.lastName && !target.lastName) {
    update("lastName", source.lastName);
  }
  if (source.email && !target.email) {
    update("email", source.email);
  }
  if (source.phone && !target.phone) {
    update("phone", source.phone);
  }
  if (source.phonePrefix && !target.phonePrefix) {
    update("phonePrefix", source.phonePrefix);
  }
};

export const autoFillCompanyInfo = (
  source: CompanyInfo,
  target: CompanyInfo,
  update: (field: keyof CompanyInfo, value: any) => void
) => {
  if (source.companyName && !target.companyName) {
    update("companyName", source.companyName);
  }
  if (source.ico && !target.ico) {
    update("ico", source.ico);
  }
  if (source.dic && !target.dic) {
    update("dic", source.dic);
  }
  if (source.vatNumber && !target.vatNumber) {
    update("vatNumber", source.vatNumber);
  }
  if (source.address && !target.address) {
    update("address", source.address);
  }
};

export const autoFillBusinessLocation = (
  data: OnboardingData,
  location: BusinessLocation,
  update: (field: keyof BusinessLocation, value: any) => void
) => {
  if (data.companyInfo.ico && !location.businessSubject) {
    update("businessSubject", data.companyInfo.ico);
  }

  if (!location.bankAccounts || location.bankAccounts.length === 0) {
    const defaultBankAccount: BankAccount = {
      id: Date.now().toString(),
      typ: 'IBAN',
      iban: '',
      mena: 'EUR'
    };
    update("bankAccounts", [defaultBankAccount]);
  }
};

// Create authorized person from company contact
export const createAuthorizedPersonFromCompanyContact = (companyInfo: CompanyInfo): AuthorizedPerson => ({
  id: Date.now().toString(),
  firstName: companyInfo.contactPerson.firstName,
  lastName: companyInfo.contactPerson.lastName,
  email: companyInfo.contactPerson.email,
  phone: companyInfo.contactPerson.phone,
  phonePrefix: '+421',
  maidenName: '',
  birthDate: '',
  birthPlace: '',
  birthNumber: '',
  permanentAddress: '',
  position: 'Štatutárny orgán',
  documentType: 'OP',
  documentNumber: '',
  documentValidity: '',
  documentIssuer: '',
  documentCountry: 'Slovensko',
  citizenship: 'Slovensko',
  isPoliticallyExposed: false,
  isUSCitizen: false
});

// Create actual owner from company contact
export const createActualOwnerFromCompanyContact = (companyInfo: CompanyInfo): ActualOwner => ({
  id: Date.now().toString(),
  firstName: companyInfo.contactPerson.firstName,
  lastName: companyInfo.contactPerson.lastName,
  maidenName: '',
  birthDate: '',
  birthPlace: '',
  birthNumber: '',
  citizenship: 'Slovensko',
  permanentAddress: '',
  isPoliticallyExposed: false
});

// Create business location from company info
export const createBusinessLocationFromCompanyInfo = (companyInfo: CompanyInfo): BusinessLocation => ({
  id: Date.now().toString(),
  name: companyInfo.companyName,
  hasPOS: false,
  address: companyInfo.address,
  iban: '',
  bankAccounts: [{
    id: Date.now().toString(),
    typ: 'IBAN',
    iban: '',
    mena: 'EUR'
  }],
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
  openingHours: '',
  seasonality: 'year-round'
});

// Check conditions
export const shouldCreateAuthorizedPersonFromContact = (companyInfo: CompanyInfo, authorizedPersons: AuthorizedPerson[]) => {
  if (!companyInfo.contactPerson.firstName || !companyInfo.contactPerson.lastName) {
    return false;
  }
  
  return !authorizedPersons.some(person =>
    person.firstName === companyInfo.contactPerson.firstName &&
    person.lastName === companyInfo.contactPerson.lastName
  );
};

export const shouldCreateActualOwnerFromContact = (contactInfo: ContactInfo, companyInfo: CompanyInfo, actualOwners: ActualOwner[]) => {
  if (!companyInfo.contactPerson.firstName || !companyInfo.contactPerson.lastName) {
    return false;
  }
  
  return !actualOwners.some(owner =>
    owner.firstName === companyInfo.contactPerson.firstName &&
    owner.lastName === companyInfo.contactPerson.lastName
  );
};

// Update signing person
export const updateSigningPersonFromContact = (
  companyInfo: CompanyInfo,
  authorizedPersons: AuthorizedPerson[],
  currentSigningPersonId?: string
) => {
  if (currentSigningPersonId) return currentSigningPersonId;

  const matchingPerson = authorizedPersons.find(person =>
    person.firstName === companyInfo.contactPerson.firstName &&
    person.lastName === companyInfo.contactPerson.lastName
  );

  return matchingPerson?.id;
};

// Sync contact person data
export const syncContactPersonData = (data: OnboardingData, updateData: (data: Partial<OnboardingData>) => void) => {
  const contactPerson = data.companyInfo.contactPerson;
  
  // Find matching authorized person
  const matchingAuthorizedPerson = data.authorizedPersons.find(person =>
    person.firstName === contactPerson.firstName &&
    person.lastName === contactPerson.lastName
  );

  if (matchingAuthorizedPerson) {
    const updatedAuthorizedPersons = data.authorizedPersons.map(person =>
      person.id === matchingAuthorizedPerson.id
        ? {
            ...person,
            email: contactPerson.email,
            phone: contactPerson.phone,
            phonePrefix: data.contactInfo.phonePrefix || '+421'
          }
        : person
    );

    updateData({ authorizedPersons: updatedAuthorizedPersons });
  }
};

// Sync business location addresses
export const syncBusinessLocationAddresses = (data: OnboardingData, updateData: (data: Partial<OnboardingData>) => void) => {
  if (data.companyInfo.headOfficeEqualsOperatingAddress && data.businessLocations.length > 0) {
    const updatedLocations = data.businessLocations.map((location, index) => {
      if (index === 0) { // Only sync first location
        return {
          ...location,
          address: data.companyInfo.address
        };
      }
      return location;
    });

    updateData({ businessLocations: updatedLocations });
  }
};
