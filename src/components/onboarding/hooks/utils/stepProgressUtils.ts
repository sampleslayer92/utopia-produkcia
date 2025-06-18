
import { OnboardingData } from '@/types/onboarding';
import { getNestedValue, isFieldComplete } from './validationUtils';

export interface StepProgress {
  stepNumber: number;
  stepName: string;
  isComplete: boolean;
  completionPercentage: number;
  requiredFields: string[];
  completedFields: string[];
  isVisited: boolean;
}

export const createStepProgressConfig = (data: OnboardingData): StepProgress[] => {
  return [
    // Step 0: Contact Info
    {
      stepNumber: 0,
      stepName: 'Kontaktné údaje',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: ['contactInfo.firstName', 'contactInfo.lastName', 'contactInfo.email', 'contactInfo.phone'],
      completedFields: [],
      isVisited: true // Always visited as it's the starting step
    },
    // Step 1: Company Info
    {
      stepNumber: 1,
      stepName: 'Údaje o spoločnosti',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: [
        'companyInfo.ico', 'companyInfo.dic', 'companyInfo.companyName', 'companyInfo.registryType',
        'companyInfo.address.street', 'companyInfo.address.city', 'companyInfo.address.zipCode',
        'companyInfo.contactPerson.firstName', 'companyInfo.contactPerson.lastName',
        'companyInfo.contactPerson.email', 'companyInfo.contactPerson.phone'
      ],
      completedFields: [],
      isVisited: data.visitedSteps?.includes(1) || false
    },
    // Step 2: Business Locations - For presentation: allow proceeding without full validation
    {
      stepNumber: 2,
      stepName: 'Miesta podnikania',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: ['businessLocations'],
      completedFields: [],
      isVisited: data.visitedSteps?.includes(2) || false
    },
    // Step 3: Device Selection - For presentation: allow proceeding without full validation
    {
      stepNumber: 3,
      stepName: 'Výber zariadení',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: ['deviceSelection.dynamicCards'],
      completedFields: [],
      isVisited: data.visitedSteps?.includes(3) || false
    },
    // Step 4: Fees - Removed required fields so it won't be green by default
    {
      stepNumber: 4,
      stepName: 'Poplatky',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: [], // Empty array - no required fields for presentation
      completedFields: [],
      isVisited: data.visitedSteps?.includes(4) || false
    },
    // Step 5: Authorized Persons
    {
      stepNumber: 5,
      stepName: 'Oprávnené osoby',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: ['authorizedPersons'],
      completedFields: [],
      isVisited: data.visitedSteps?.includes(5) || false
    },
    // Step 6: Actual Owners
    {
      stepNumber: 6,
      stepName: 'Skutoční vlastníci',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: ['actualOwners'],
      completedFields: [],
      isVisited: data.visitedSteps?.includes(6) || false
    },
    // Step 7: Consents
    {
      stepNumber: 7,
      stepName: 'Súhlasy',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: ['consents.gdpr', 'consents.terms'],
      completedFields: [],
      isVisited: data.visitedSteps?.includes(7) || false
    }
  ];
};

export const calculateStepCompletion = (step: StepProgress, data: OnboardingData): StepProgress => {
  const completedFields: string[] = [];
  
  step.requiredFields.forEach(fieldPath => {
    const value = getNestedValue(data, fieldPath);
    if (isFieldComplete(value, fieldPath)) {
      completedFields.push(fieldPath);
    }
  });

  const updatedStep = { ...step, completedFields };
  
  // For steps with no required fields (like fees), mark as complete only if visited
  if (step.requiredFields.length === 0) {
    updatedStep.isComplete = step.isVisited;
    updatedStep.completionPercentage = step.isVisited ? 100 : 0;
    return updatedStep;
  }
  
  const hasAnyCompletedFields = completedFields.length > 0;
  const allFieldsCompleted = completedFields.length === step.requiredFields.length;
  
  // Standard validation for steps with required fields
  updatedStep.isComplete = allFieldsCompleted;
  updatedStep.completionPercentage = hasAnyCompletedFields ? 
    (allFieldsCompleted ? 100 : Math.round((completedFields.length / step.requiredFields.length) * 100)) : 0;

  return updatedStep;
};

export const calculateOverallProgress = (stepProgress: StepProgress[], currentStep: number) => {
  const totalFields = stepProgress.reduce((sum, step) => sum + step.requiredFields.length, 0);
  const completedFields = stepProgress.reduce((sum, step) => sum + step.completedFields.length, 0);
  
  return {
    totalSteps: stepProgress.length,
    completedSteps: stepProgress.filter(step => step.isComplete).length,
    overallPercentage: totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0,
    currentStepProgress: stepProgress[currentStep] || null
  };
};
