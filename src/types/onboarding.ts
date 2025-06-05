
export interface ContactInfo {
  salutation?: 'Mr' | 'Ms';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phonePrefix: string;
  companyType?: string;
  salesNote?: string;
  userRole?: string;
}

export interface CompanyAddress {
  street: string;
  city: string;
  zipCode: string;
}

export interface ContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isTechnicalPerson: boolean;
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
  contactPerson: ContactPerson;
}

export interface BusinessLocation {
  id: string;
  name: string;
  hasPOS: boolean;
  address: CompanyAddress;
  iban: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  businessSector: string;
  estimatedTurnover: number;
  averageTransaction: number;
  openingHours: string;
  seasonality: 'year-round' | 'seasonal';
  seasonalWeeks?: number;
}

export interface Addon {
  id: string;
  category: string;
  name: string;
  description?: string;
  monthlyFee: number;
  companyCost: number;
  isPerDevice: boolean;
  customQuantity?: number;
}

export interface DeviceCard {
  id: string;
  type: 'device' | 'service';
  category: string;
  name: string;
  description?: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  addons: Addon[];
}

export interface DeviceSelection {
  selectedSolutions: string[];
  dynamicCards: DeviceCard[];
  note?: string;
}

export interface CalculatorResults {
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
  customerPaymentBreakdown?: any;
  companyCostBreakdown?: any;
}

export interface Fees {
  regulatedCards: number;
  unregulatedCards: number;
  calculatorResults?: CalculatorResults;
}

export interface AuthorizedPerson {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  maidenName?: string;
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
  documentFrontUrl?: string;
  documentBackUrl?: string;
}

export interface ActualOwner {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
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
  signatureDate?: string;
  signingPersonId?: string;
  signatureUrl?: string;
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
}
