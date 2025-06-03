
export interface ContactInfo {
  salutation: 'Pan' | 'Pani' | '';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phonePrefix: string;
  salesNote?: string;
}

export interface CompanyInfo {
  ico: string;
  dic: string;
  companyName: string;
  registryType: 'public' | 'business' | 'other' | '';
  court: string;
  section: string;
  insertNumber: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    isTechnicalPerson: boolean;
  };
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
  assignedPersons: string[]; // IDs of assigned persons
}

export interface DeviceSelection {
  terminals: {
    paxA920Pro: { count: number; monthlyFee: number; simCards: number };
    paxA80: { count: number; monthlyFee: number };
  };
  tablets: {
    tablet10: { count: number; monthlyFee: number };
    tablet15: { count: number; monthlyFee: number };
    tabletPro15: { count: number; monthlyFee: number };
  };
  softwareLicenses: string[];
  accessories: string[];
  ecommerce: string[];
  technicalService: string[];
  mifFees: {
    regulatedCards: number;
    unregulatedCards: number;
    dccRabat: number;
  };
  transactionTypes: string[];
  note: string;
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
  businessLocations: BusinessLocation[]; // Changed from businessLocation to businessLocations array
  deviceSelection: DeviceSelection;
  authorizedPersons: AuthorizedPerson[];
  actualOwners: ActualOwner[];
  consents: Consents;
  currentStep: number;
}
