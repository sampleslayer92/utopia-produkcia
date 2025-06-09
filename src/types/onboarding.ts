
// Re-export all types from smaller files for backward compatibility
export * from './contact';
export * from './company';
export * from './business';
export * from './consent';
export * from './calculations';

// Products types
export interface AddonCard {
  id: string;
  category: string;
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
  name: string;
  description: string;
  category: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  image?: string;
  addons?: AddonCard[];
  catalogId?: string;
}

export interface ServiceCard {
  id: string;
  type: 'service';
  name: string;
  description: string;
  category: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  customValue?: string;
  addons?: AddonCard[];
  catalogId?: string;
}

// Main onboarding data interface
export interface OnboardingData {
  contractId?: string;
  contractNumber?: string;
  contactInfo: ContactInfo;
  companyInfo: CompanyInfo;
  businessLocations: BusinessLocation[];
  devices: DeviceCard[];
  services: ServiceCard[];
  fees: Fees;
  authorizedPersons: AuthorizedPerson[];
  actualOwners: ActualOwner[];
  consents: Consents;
  submittedAt?: string;
  status?: 'draft' | 'submitted' | 'approved' | 'rejected';
}
