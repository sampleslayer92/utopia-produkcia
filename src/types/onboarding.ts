export interface ContactInfo {
  salutation: 'Pan' | 'Pani' | '';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phonePrefix: string;
  salesNote?: string;
  companyType?: 'Živnosť' | 'S.r.o.' | 'Nezisková organizácia' | 'Akciová spoločnosť' | '';
  userRoles?: ('Majiteľ' | 'Konateľ' | 'Kontaktná osoba na prevádzku' | 'Kontaktná osoba pre technické záležitosti')[]; // Keep for backward compatibility
  userRole?: 'Majiteľ' | 'Konateľ' | 'Prevádzkar' | ''; // Keep for backward compatibility
}

export interface CompanyInfo {
  ico: string;
  dic: string;
  companyName: string;
  registryType: 'public' | 'business' | 'other' | '';
  isVatPayer: boolean;
  vatNumber: string;
  court: string;
  section: string;
  insertNumber: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  contactAddress?: {
    street: string;
    city: string;
    zipCode: string;
  };
  contactAddressSameAsMain: boolean;
  contactPerson: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isTechnicalPerson: boolean;
  };
}

export interface BankAccount {
  id: string;
  format: 'IBAN' | 'CisloUctuKodBanky';
  iban?: string;
  cisloUctu?: string;
  kodBanky?: string;
  mena: 'EUR' | 'CZK' | 'USD';
}

export interface OpeningHours {
  day: 'Po' | 'Ut' | 'St' | 'Št' | 'Pi' | 'So' | 'Ne';
  open: string; // 08:00
  close: string; // 17:00
  otvorene: boolean;
}

export interface BusinessLocation {
  id: string;
  name: string;
  hasPOS: boolean;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  iban: string; // Keep for backward compatibility
  bankAccounts: BankAccount[];
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  businessSector: string; // Keep for backward compatibility
  businessSubject: string;
  mccCode: string;
  estimatedTurnover: number; // Keep for backward compatibility
  monthlyTurnover: number;
  averageTransaction: number;
  openingHours: string; // Keep for backward compatibility
  openingHoursDetailed: OpeningHours[];
  seasonality: 'year-round' | 'seasonal';
  seasonalWeeks?: number;
  assignedPersons: string[];
}

export interface AddonCard {
  id: string;
  type: 'addon';
  category: 'sim' | 'docking' | 'case' | 'backup' | 'printer' | 'drawer';
  name: string;
  description: string;
  monthlyFee: number;
  companyCost: number;
  isPerDevice: boolean;
  customQuantity?: number;
}

export interface DeviceCard {
  id: string;
  type: 'device';
  category: string;
  name: string;
  description: string;
  image?: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  simCards?: number;
  specifications: string[];
  addons: AddonCard[];
}

export interface ServiceCard {
  id: string;
  type: 'service';
  category: string;
  name: string;
  description: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  customValue?: string;
  addons: AddonCard[];
}

export type DynamicCard = DeviceCard | ServiceCard;

export interface DeviceSelection {
  selectedSolutions: string[];
  dynamicCards: Array<DeviceCard | ServiceCard>;
  note: string;
}

export interface ItemBreakdown {
  id: string;
  name: string;
  count: number;
  unitPrice: number;
  subtotal: number;
  addons?: ItemBreakdown[];
}

export interface Fees {
  regulatedCards: number;
  unregulatedCards: number;
  calculatorResults?: {
    monthlyTurnover: number;
    totalCustomerPayments: number;
    totalCompanyCosts: number;
    effectiveRegulated: number;
    effectiveUnregulated: number;
    regulatedFee: number;
    unregulatedFee: number;
    transactionMargin: number;
    serviceMargin: number;
    totalMonthlyProfit: number;
    customerPaymentBreakdown: ItemBreakdown[];
    companyCostBreakdown: ItemBreakdown[];
  };
}

export interface AuthorizedPerson {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  maidenName: string;
  birthDate: string;
  birthPlace: string;
  birthNumber: string;
  permanentAddress: string;
  position: string;
  documentType: 'OP' | 'Pas';
  documentNumber: string;
  documentValidity: string;
  documentIssuer: string;
  documentCountry: string;
  citizenship: string;
  isPoliticallyExposed: boolean;
  isUSCitizen: boolean;
}

export interface ActualOwner {
  id: string;
  firstName: string;
  lastName: string;
  maidenName: string;
  birthDate: string;
  birthPlace: string;
  birthNumber: string;
  citizenship: string;
  permanentAddress: string;
  isPoliticallyExposed: boolean;
}

export interface Consents {
  gdpr: boolean;
  terms: boolean;
  electronicCommunication: boolean;
  signatureDate: string;
  signingPersonId: string;
}

export interface OnboardingData {
  contactInfo: ContactInfo;
  companyInfo: CompanyInfo;
  businessLocations: BusinessLocation[];
  deviceSelection: DeviceSelection;
  fees: Fees;
  authorizedPersons: AuthorizedPerson[];
  actualOwners: ActualOwner[];
  consents: Consents;
  currentStep: number;
  contractId?: string;
  contractNumber?: string;
  contractItems?: DynamicCard[];
}
