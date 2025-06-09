import { OnboardingData, BankAccount } from "@/types/onboarding";

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
