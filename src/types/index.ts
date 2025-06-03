
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'partner' | 'merchant';
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  ein: string;
  dba?: string;
  industry: string;
  website?: string;
  yearEstablished: number;
  businessType: 'corporation' | 'llc' | 'partnership' | 'sole_proprietorship';
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  companyId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isHeadquarters: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  locationId: string;
  serialNumber: string;
  model: string;
  type: 'terminal' | 'gateway' | 'mobile';
  status: 'active' | 'inactive' | 'maintenance';
  installDate: string;
  lastMaintenance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePlan {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  monthlyFee: number;
  transactionFee: number;
  features: string[];
  isActive: boolean;
}

export interface Owner {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ssn: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  ownershipPercentage: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingInfo {
  id: string;
  companyId: string;
  accountType: 'checking' | 'savings';
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  accountHolderName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  companyId: string;
  servicePlanId: string;
  status: 'draft' | 'pending' | 'signed' | 'cancelled';
  signedDate?: string;
  effectiveDate: string;
  expirationDate?: string;
  terms: string;
  digitalSignature?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  deviceId: string;
  amount: number;
  type: 'sale' | 'refund' | 'void';
  status: 'pending' | 'approved' | 'declined';
  cardType: string;
  lastFour: string;
  authCode?: string;
  timestamp: string;
  createdAt: string;
}

export interface OnboardingData {
  company: Partial<Company>;
  locations: Partial<Location>[];
  devices: Partial<Device>[];
  servicePlan: string;
  owners: Partial<Owner>[];
  billing: Partial<BillingInfo>;
  contract: Partial<Contract>;
  currentStep: number;
}
