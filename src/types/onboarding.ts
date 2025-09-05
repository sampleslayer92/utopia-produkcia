
// Re-export all types from smaller files for backward compatibility
export * from './contact';
export * from './company';
export * from './business';
export * from './consent';
export * from './calculations';
export * from './products';

// Import the types we need for the main interface
import { ContactInfo, AuthorizedPerson, ActualOwner } from './contact';
import { CompanyInfo } from './company';
import { BusinessLocation } from './business';
import { Consents } from './consent';
import { Fees } from './calculations';
import { DeviceCard, ServiceCard, AddonCard, DeviceSelection } from './products';
import { ProgressiveSelectionData } from './selection-flow';
import { PersonWithRoles, PersonRole } from './person';

// Alias types for backward compatibility
export type DynamicCard = DeviceCard | ServiceCard;

// Main onboarding data interface
export interface OnboardingData {
  contractId?: string;
  contractNumber?: string;
  currentStep: number;
  visitedSteps: number[];
  contactInfo: ContactInfo;
  companyInfo: CompanyInfo;
  businessLocations: BusinessLocation[];
  deviceSelection: DeviceSelection;
  devices: DeviceCard[];
  services: ServiceCard[];
  fees: Fees;
  authorizedPersons: AuthorizedPerson[];
  actualOwners: ActualOwner[];
  persons?: PersonWithRoles[]; // New person-role system
  personRoles?: PersonRole[]; // New person-role system
  consents: Consents;
  submittedAt?: string;
  status?: 'draft' | 'request_draft' | 'pending_approval' | 'approved' | 'rejected';
  progressiveSelection?: ProgressiveSelectionData;
}
