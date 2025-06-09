
export interface ContactInfo {
  salutation?: 'Pan' | 'Pani';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phonePrefix: string;
  salesNote?: string;
  userRole?: string;
  userRoles?: string[]; // Add support for multiple roles
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
  contactAddressSame: boolean; // Keep both for backward compatibility
  contactAddress?: CompanyAddress;
  headOfficeEqualsOperatingAddress: boolean; // New field for operating address sync
  contactPerson: ContactPerson;
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
  open: string;
  close: string;
  otvorene: boolean;
}

export interface BusinessLocation {
  id: string;
  name: string;
  hasPOS: boolean;
  address: CompanyAddress;
  iban: string;
  bankAccounts?: BankAccount[];
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  businessSector: string;
  businessSubject?: string;
  mccCode?: string;
  estimatedTurnover: number;
  monthlyTurnover?: number;
  averageTransaction: number;
  openingHours: string;
  openingHoursDetailed?: OpeningHours[];
  seasonality: 'year-round' | 'seasonal';
  seasonalWeeks?: number;
  assignedPersons?: string[];
}

export interface Addon {
  id: string;
  type?: 'addon';
  category: string;
  name: string;
  description?: string;
  monthlyFee: number;
  companyCost: number;
  isPerDevice: boolean;
  customQuantity?: number;
}

// Export AddonCard as alias for Addon
export type AddonCard = Addon;

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
  image?: string;
  specifications?: string[];
  simCards?: number;
  customValue?: string;
}

// Export ServiceCard as alias for DeviceCard for backward compatibility
export type ServiceCard = DeviceCard;

// Add DynamicCard as alias for DeviceCard for backward compatibility
export type DynamicCard = DeviceCard;

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
  phonePrefix: string; // Add phonePrefix field
  maidenName?: string;
  birthDate: string;
  birthPlace: string;
  birthNumber?: string; // Make optional for backward compatibility
  idNumber?: string; // Add this field for backward compatibility
  permanentAddress?: string; // Make optional for backward compatibility
  address?: CompanyAddress; // Add this field for the new structure
  position?: string; // Make optional for backward compatibility
  documentType?: 'OP' | 'Pas'; // Make optional for backward compatibility
  documentNumber?: string; // Make optional for backward compatibility
  documentValidity?: string; // Make optional for backward compatibility
  documentIssuer?: string; // Make optional for backward compatibility
  documentCountry?: string; // Make optional for backward compatibility
  citizenship?: string; // Make optional for backward compatibility
  isPoliticallyExposed?: boolean; // Make optional for backward compatibility
  isUSCitizen?: boolean; // Make optional for backward compatibility
  documentFrontUrl?: string;
  documentBackUrl?: string;
  authorizations?: any[]; // Add this field
  documents?: any[]; // Add this field
  signature?: string; // Add this field
  isSameAsContact?: boolean; // Add this field
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
  gdpr?: boolean; // Make optional for backward compatibility
  dataProcessing?: boolean; // Add this field
  terms: boolean;
  marketing?: boolean; // Add this field
  electronicCommunication?: boolean; // Make optional for backward compatibility
  signatureDate?: string;
  signingPersonId?: string;
  signatureUrl?: string;
  signature?: string; // Add this field for backward compatibility
}

// Export ItemBreakdown interface for fee calculations
export interface ItemBreakdown {
  id: string;
  name: string;
  count: number;
  unitPrice: number;
  subtotal: number;
  addons?: ItemBreakdown[];
}

export interface OnboardingData {
  contractId?: string;
  contractNumber?: string;
  currentStep?: number;
  visitedSteps: number[]; // Add visitedSteps field
  contactInfo: ContactInfo;
  companyInfo: CompanyInfo;
  businessLocations: BusinessLocation[];
  deviceSelection: DeviceSelection;
  fees: Fees;
  authorizedPersons: AuthorizedPerson[];
  actualOwners: ActualOwner[];
  consents: Consents;
}
