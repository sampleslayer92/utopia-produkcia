
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
      isVisited: true
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
      isVisited: true
    },
    // Step 2: Business Locations
    {
      stepNumber: 2,
      stepName: 'Miesta podnikania',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: ['businessLocations'],
      completedFields: [],
      isVisited: true
    },
    // Step 3: Device Selection
    {
      stepNumber: 3,
      stepName: 'Výber zariadení',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: ['deviceSelection.dynamicCards'],
      completedFields: [],
      isVisited: true
    },
    // Step 4: Fees
    {
      stepNumber: 4,
      stepName: 'Poplatky',
      isComplete: false,
      completionPercentage: 0,
      requiredFields: ['fees.regulatedCards', 'fees.unregulatedCards'],
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
  
  const hasAnyCompletedFields = completedFields.length > 0;
  const allFieldsCompleted = completedFields.length === step.requiredFields.length;
  
  // For steps 4-7: Only mark as complete if visited AND all fields are valid
  if (step.stepNumber >= 4) {
    updatedStep.isComplete = step.isVisited && allFieldsCompleted;
    updatedStep.completionPercentage = step.isVisited && hasAnyCompletedFields ? 
      (allFieldsCompleted ? 100 : 50) : 0;
  } else {
    // For steps 0-3: Use standard validation
    updatedStep.isComplete = allFieldsCompleted;
    updatedStep.completionPercentage = hasAnyCompletedFields ? 
      (allFieldsCompleted ? 100 : 50) : 0;
  }

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
