
import { OnboardingData, BankAccount, ContactInfo } from "@/types/onboarding";

export const createContactInfoSuggestion = (data: OnboardingData) => {
  const { companyInfo } = data;
  const suggestion = `${companyInfo.companyName}\n${companyInfo.address.street}, ${companyInfo.address.city} ${companyInfo.address.zipCode}`;
  return suggestion;
};

export const createDefaultBankAccount = (): BankAccount => ({
  id: Date.now().toString(),
  typ: 'IBAN',
  iban: '',
  mena: 'EUR'
});

export const createBusinessLocationSuggestion = (data: OnboardingData) => {
  const { companyInfo } = data;
  const suggestion = {
    name: companyInfo.companyName,
    address: {
      street: companyInfo.address.street,
      city: companyInfo.address.city,
      zipCode: companyInfo.address.zipCode
    },
    contactPerson: {
      name: `${companyInfo.contactPerson.firstName} ${companyInfo.contactPerson.lastName}`,
      email: companyInfo.contactPerson.email,
      phone: companyInfo.contactPerson.phone
    },
    bankAccounts: [createDefaultBankAccount()]
  };
  return suggestion;
};

// Helper function to extract person data from contact info
export const getPersonDataFromContactInfo = (contactInfo: ContactInfo) => {
  return {
    salutation: contactInfo.salutation,
    firstName: contactInfo.firstName,
    lastName: contactInfo.lastName,
    email: contactInfo.email,
    phone: contactInfo.phone,
    phonePrefix: contactInfo.phonePrefix
  };
};

// Check if contact info has changed
export const hasContactInfoChanged = (prev: ContactInfo, current: ContactInfo) => {
  return prev.firstName !== current.firstName ||
         prev.lastName !== current.lastName ||
         prev.email !== current.email ||
         prev.phone !== current.phone ||
         prev.phonePrefix !== current.phonePrefix;
};

// Check role requirements
export const requiresBusinessLocation = (roles: string[]) => {
  return roles.includes('Kontaktná osoba na prevádzku') || roles.includes('Majiteľ');
};

export const requiresActualOwner = (roles: string[]) => {
  return roles.includes('Majiteľ') || roles.includes('Skutočný majiteľ');
};

export const requiresAuthorizedPerson = (roles: string[]) => {
  return roles.includes('Oprávnená osoba') || roles.includes('Štatutárny orgán');
};

// Auto-fill logic functions
export const getAutoFillUpdates = (contactInfo: ContactInfo, data: OnboardingData) => {
  const updates: Partial<OnboardingData> = {};
  
  // Auto-fill company contact person if technical role is selected
  if (contactInfo.userRoles?.includes('Kontaktná osoba pre technické záležitosti')) {
    updates.companyInfo = {
      ...data.companyInfo,
      contactPerson: {
        ...data.companyInfo.contactPerson,
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        isTechnicalPerson: true
      }
    };
  }

  return updates;
};

export const getAutoFillUpdatesSimplified = (contactInfo: ContactInfo, data: OnboardingData) => {
  const updates: Partial<OnboardingData> = {};
  
  // Simple auto-fill based on basic contact info completion
  if (contactInfo.firstName && contactInfo.lastName && contactInfo.email && contactInfo.phone) {
    updates.companyInfo = {
      ...data.companyInfo,
      contactPerson: {
        ...data.companyInfo.contactPerson,
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone
      }
    };
  }

  return updates;
};
