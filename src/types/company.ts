
import { ContactPerson } from './contact';

export interface CompanyAddress {
  street: string;
  city: string;
  zipCode: string;
}

export interface CompanyInfo {
  ico: string;
  dic: string;
  companyName: string;
  registryType: 'Živnosť' | 'S.r.o.' | 'Nezisková organizácia' | 'Akciová spoločnosť';
  isVatPayer: boolean;
  vatNumber?: string;
  court?: string;
  section?: string;
  insertNumber?: string;
  address: CompanyAddress;
  contactAddressSameAsMain: boolean;
  contactAddress?: CompanyAddress;
  headOfficeEqualsOperatingAddress: boolean; // New field for operating address sync
  contactPerson: ContactPerson;
}
