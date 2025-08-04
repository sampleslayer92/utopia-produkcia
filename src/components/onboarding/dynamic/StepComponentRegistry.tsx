import { ComponentType } from 'react';
import { OnboardingData } from "@/types/onboarding";
import type { OnboardingStep } from '@/pages/OnboardingConfigPage';

// Import wrapper components that adapt existing step components

// Wrapper components to adapt existing components to new interface
import ContactInfoWrapper from './wrappers/ContactInfoWrapper';
import CompanyInfoWrapper from './wrappers/CompanyInfoWrapper';
import BusinessLocationsWrapper from './wrappers/BusinessLocationsWrapper';
import DeviceSelectionWrapper from './wrappers/DeviceSelectionWrapper';
import FeesWrapper from './wrappers/FeesWrapper';
import PersonsAndOwnersWrapper from './wrappers/PersonsAndOwnersWrapper';
import ConsentsWrapper from './wrappers/ConsentsWrapper';

// Interface for step components
export interface StepComponentProps {
  currentStep: number;
  stepConfig: OnboardingStep;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onSaveSignature: () => void;
  onStepNavigate: (fromStep: number, toStep: number) => void;
}

export type StepComponent = ComponentType<StepComponentProps>;

class StepComponentRegistry {
  private components: Map<string, StepComponent> = new Map();

  register(stepKey: string, component: StepComponent) {
    this.components.set(stepKey, component);
  }

  getComponent(stepKey: string): StepComponent | undefined {
    return this.components.get(stepKey);
  }

  getAllStepKeys(): string[] {
    return Array.from(this.components.keys());
  }

  unregister(stepKey: string) {
    this.components.delete(stepKey);
  }

  clear() {
    this.components.clear();
  }
}

// Create and configure the registry
const stepComponentRegistry = new StepComponentRegistry();

// Register all step components with their keys (using underscores to match database format)
stepComponentRegistry.register('contact_info', ContactInfoWrapper);
stepComponentRegistry.register('company_info', CompanyInfoWrapper);
stepComponentRegistry.register('business_locations', BusinessLocationsWrapper);
stepComponentRegistry.register('device_selection', DeviceSelectionWrapper);
stepComponentRegistry.register('fees', FeesWrapper);
stepComponentRegistry.register('persons_and_owners', PersonsAndOwnersWrapper);
stepComponentRegistry.register('authorized_persons', PersonsAndOwnersWrapper); // Same wrapper
stepComponentRegistry.register('actual_owners', PersonsAndOwnersWrapper); // Same wrapper
stepComponentRegistry.register('consents', ConsentsWrapper);

export { stepComponentRegistry };
export default stepComponentRegistry;