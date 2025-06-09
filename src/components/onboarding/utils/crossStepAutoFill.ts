import { OnboardingData, ContactInfo, CompanyInfo, BusinessLocation, BankAccount } from "@/types/onboarding";

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
