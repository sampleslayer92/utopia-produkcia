
import { OnboardingData } from "@/types/onboarding";
import ContactInfoStep from "../ContactInfoStep";
import CompanyInfoStep from "../CompanyInfoStep";
import BusinessLocationStep from "../BusinessLocationStep";
import DeviceSelectionStep from "../DeviceSelectionStep";
import FeesStep from "../FeesStep";
import PersonsAndOwnersStep from "../PersonsAndOwnersStep";
import ConsentsStep from "../ConsentsStep";
import { useCrossStepAutoFill } from "../hooks/useCrossStepAutoFill";
import { useEffect, useCallback } from "react";

interface OnboardingStepRendererProps {
  currentStep: number;
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onSaveSignature?: () => void;
  onStepNavigate?: (fromStep: number, toStep: number) => void;
  customSteps?: Array<{
    id: string;
    stepKey: string;
    title: string;
    description: string;
    position: number;
    isEnabled: boolean;
    isRequired: boolean;
  }>;
}

const OnboardingStepRenderer = ({
  currentStep,
  data,
  updateData,
  onNext,
  onPrev,
  onComplete,
  onSaveSignature,
  onStepNavigate,
  customSteps
}: OnboardingStepRendererProps) => {
  // Initialize cross-step auto-fill logic (disabled for step 0)
  const {
    autoFillAuthorizedPerson,
    autoFillActualOwner,
    autoFillBusinessLocation,
    autoFillSigningPerson
  } = useCrossStepAutoFill({ 
    data, 
    updateData, 
    currentStep,
    enabled: currentStep !== 0 // Disable auto-fill for contact info step
  });

  // Handle step navigation and trigger appropriate auto-fill
  const handleStepNavigation = useCallback((fromStep: number, toStep: number) => {
    console.log('=== Step Navigation Auto-Fill ===', { fromStep, toStep });
    
    // Auto-fill when navigating FROM contact info step (step 0)
    if (fromStep === 0) {
      console.log('Triggering auto-fill from contact info step');
      
      // Check if basic contact info is complete
      const isContactComplete = Boolean(
        data.contactInfo.firstName?.trim() &&
        data.contactInfo.lastName?.trim() &&
        data.contactInfo.email?.trim() &&
        data.contactInfo.phone?.trim()
      );
      
      if (isContactComplete) {
        // Trigger authorized person creation
        console.log('Creating authorized person from contact info');
        autoFillAuthorizedPerson();
        
        // Trigger actual owner creation
        console.log('Creating actual owner from contact info');
        autoFillActualOwner();
        
        // Trigger business location creation if applicable
        if (data.companyInfo.headOfficeEqualsOperatingAddress && data.businessLocations.length === 0) {
          console.log('Creating business location');
          autoFillBusinessLocation();
        }
      }
    }
    
    // Auto-fill when entering specific steps
    if (toStep === 2) { // Business Locations
      autoFillBusinessLocation();
    } else if (toStep === 5) { // Combined Persons and Owners
      autoFillAuthorizedPerson();
      autoFillActualOwner();
    } else if (toStep === 6) { // Consents (previously step 7)
      autoFillSigningPerson();
    }
  }, [data, autoFillAuthorizedPerson, autoFillActualOwner, autoFillBusinessLocation, autoFillSigningPerson]);

  // Register the navigation handler
  useEffect(() => {
    if (onStepNavigate) {
      // This creates a connection between the navigation callback and our auto-fill logic
      window.onboardingStepNavigationHandler = handleStepNavigation;
    }
    
    return () => {
      if (window.onboardingStepNavigationHandler) {
        delete window.onboardingStepNavigationHandler;
      }
    };
  }, [handleStepNavigation, onStepNavigate]);

  // Enhanced onNext that triggers auto-fill before navigation
  const enhancedOnNext = useCallback(() => {
    // Trigger step navigation auto-fill
    if (window.onboardingStepNavigationHandler) {
      window.onboardingStepNavigationHandler(currentStep, currentStep + 1);
    }
    
    // Proceed with normal navigation
    onNext();
  }, [currentStep, onNext]);

  // Get current step key for dynamic mapping
  const getCurrentStepKey = () => {
    if (customSteps && customSteps.length > 0) {
      const enabledSteps = customSteps
        .filter(step => step.isEnabled)
        .sort((a, b) => a.position - b.position);
      
      if (enabledSteps[currentStep]) {
        return enabledSteps[currentStep].stepKey;
      }
    }
    
    // Default mapping for backward compatibility
    const defaultMapping = [
      'contact-info',
      'company-info', 
      'business-locations',
      'device-selection',
      'fees',
      'persons-owners',
      'consents'
    ];
    
    return defaultMapping[currentStep] || null;
  };

  const commonProps = {
    data,
    updateData,
    onNext: enhancedOnNext,
    onPrev
  };

  console.log('=== OnboardingStepRenderer Debug ===', {
    currentStep,
    currentStepKey: getCurrentStepKey(),
    customStepsCount: customSteps?.length || 0,
    enabledStepsCount: customSteps?.filter(step => step.isEnabled).length || 0,
    customSteps: customSteps?.map(step => ({ stepKey: step.stepKey, isEnabled: step.isEnabled, position: step.position })),
    companyName: data.companyInfo?.companyName,
    ico: data.companyInfo?.ico,
    address: data.companyInfo?.address,
    contactPerson: data.companyInfo?.contactPerson,
    headOfficeEqualsOperating: data.companyInfo?.headOfficeEqualsOperatingAddress,
    businessLocationsCount: data.businessLocations?.length || 0,
    authorizedPersonsCount: data.authorizedPersons?.length || 0,
    actualOwnersCount: data.actualOwners?.length || 0,
    userRole: data.contactInfo?.userRole,
    userRoles: data.contactInfo?.userRoles,
    contactPersonId: data.contactInfo?.personId
  });

  const currentStepKey = getCurrentStepKey();

  // Dynamic step rendering based on stepKey
  switch (currentStepKey) {
    case 'contact-info':
      return <ContactInfoStep {...commonProps} />;
    case 'company-info':
      return <CompanyInfoStep {...commonProps} />;
    case 'business-locations':
      return <BusinessLocationStep {...commonProps} />;
    case 'device-selection':
      return <DeviceSelectionStep {...commonProps} />;
    case 'fees':
      return <FeesStep {...commonProps} />;
    case 'persons-owners':
      return <PersonsAndOwnersStep {...commonProps} />;
    case 'consents':
      return <ConsentsStep {...commonProps} onComplete={onComplete} onSaveSignature={onSaveSignature} />;
    default:
      return null;
  }
};

// Add global type definition for the navigation handler
declare global {
  interface Window {
    onboardingStepNavigationHandler?: (fromStep: number, toStep: number) => void;
  }
}

export default OnboardingStepRenderer;
