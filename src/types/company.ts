
import { ContactPerson } from './contact';

export interface CompanyAddress {
  street: string;
  city: string;
  zipCode: string;
}

export interface RegistrationInfo {
  // For S.r.o./a.s. (Obchodný register)
  court?: string;
  section?: string;
  insertNumber?: string;
  
  // For Živnostník (Živnostenský úrad)
  tradeOffice?: string;
  tradeLicenseNumber?: string;
  
  // For Nezisková organizácia
  registrationAuthority?: string;
  registrationNumber?: string;
  
  // General registration type
  registrationType?: 'commercial_register' | 'trade_license' | 'nonprofit_register' | 'other';
}

export interface CompanyInfo {
  ico: string;
  dic: string;
  companyName: string;
  registryType: 'Živnosť' | 'S.r.o.' | 'Nezisková organizácia' | 'Akciová spoločnosť' | '';
  isVatPayer: boolean;
  vatNumber?: string;
  
  // Legacy fields (kept for backward compatibility)
  court?: string;
  section?: string;
  insertNumber?: string;
  
  // New registration info structure
  registrationInfo?: RegistrationInfo;
  
  address: CompanyAddress;
  contactAddressSameAsMain: boolean;
  contactAddress?: CompanyAddress;
  headOfficeEqualsOperatingAddress: boolean; // New field for operating address sync
  contactPerson: ContactPerson;
}
