
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
  contactAddress?: {
    street: string;
    city: string;
    zipCode: string;
  };
  contactAddressSameAsMain: boolean;
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
  assignedPersons: string[];
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
  simCards?: number;
  specifications: string[];
}

export interface ServiceCard {
  id: string;
  type: 'service';
  category: string;
  name: string;
  description: string;
  count: number;
  monthlyFee: number;
  customValue?: string;
}

export interface DeviceSelection {
  selectedSolutions: string[];
  dynamicCards: Array<DeviceCard | ServiceCard>;
  note: string;
}

export interface Fees {
  regulatedCards: number;
  unregulatedCards: number;
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
}
