
import { useMemo } from 'react';
import { OnboardingData } from '@/types/onboarding';

interface StepProgress {
  stepNumber: number;
  stepName: string;
  isComplete: boolean;
  completionPercentage: number;
  requiredFields: string[];
  completedFields: string[];
}

export const useProgressTracking = (data: OnboardingData, currentStep: number) => {
  const stepProgress = useMemo(() => {
    const steps: StepProgress[] = [
      // Step 0: Contact Info
      {
        stepNumber: 0,
        stepName: 'Kontaktné údaje',
        isComplete: false,
        completionPercentage: 0,
        requiredFields: ['contactInfo.firstName', 'contactInfo.lastName', 'contactInfo.email', 'contactInfo.phone'],
        completedFields: []
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
        completedFields: []
      },
      // Step 2: Business Locations
      {
        stepNumber: 2,
        stepName: 'Miesta podnikania',
        isComplete: false,
        completionPercentage: 0,
        requiredFields: ['businessLocations'],
        completedFields: []
      },
      // Step 3: Device Selection
      {
        stepNumber: 3,
        stepName: 'Výber zariadení',
        isComplete: false,
        completionPercentage: 0,
        requiredFields: ['deviceSelection.dynamicCards'],
        completedFields: []
      },
      // Step 4: Fees
      {
        stepNumber: 4,
        stepName: 'Poplatky',
        isComplete: false,
        completionPercentage: 0,
        requiredFields: ['fees.regulatedCards', 'fees.unregulatedCards'],
        completedFields: []
      },
      // Step 5: Authorized Persons
      {
        stepNumber: 5,
        stepName: 'Oprávnené osoby',
        isComplete: false,
        completionPercentage: 0,
        requiredFields: ['authorizedPersons'],
        completedFields: []
      },
      // Step 6: Actual Owners
      {
        stepNumber: 6,
        stepName: 'Skutoční vlastníci',
        isComplete: false,
        completionPercentage: 0,
        requiredFields: ['actualOwners'],
        completedFields: []
      },
      // Step 7: Consents
      {
        stepNumber: 7,
        stepName: 'Súhlasy',
        isComplete: false,
        completionPercentage: 0,
        requiredFields: ['consents.gdpr', 'consents.terms'],
        completedFields: []
      }
    ];

    // Calculate progress for each step
    steps.forEach(step => {
      const completedFields: string[] = [];
      
      step.requiredFields.forEach(fieldPath => {
        const value = getNestedValue(data, fieldPath);
        if (isFieldComplete(value, fieldPath)) {
          completedFields.push(fieldPath);
        }
      });

      step.completedFields = completedFields;
      step.completionPercentage = step.requiredFields.length > 0 
        ? Math.round((completedFields.length / step.requiredFields.length) * 100)
        : 0;
      step.isComplete = step.completionPercentage === 100;
    });

    return steps;
  }, [data]);

  const overallProgress = useMemo(() => {
    const totalFields = stepProgress.reduce((sum, step) => sum + step.requiredFields.length, 0);
    const completedFields = stepProgress.reduce((sum, step) => sum + step.completedFields.length, 0);
    
    return {
      totalSteps: stepProgress.length,
      completedSteps: stepProgress.filter(step => step.isComplete).length,
      overallPercentage: totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0,
      currentStepProgress: stepProgress[currentStep] || null
    };
  }, [stepProgress, currentStep]);

  return {
    stepProgress,
    overallProgress
  };
};

// Helper function to get nested object value
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

// Helper function to check if a field is complete
const isFieldComplete = (value: any, fieldPath: string): boolean => {
  if (value === null || value === undefined) return false;
  
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  
  if (typeof value === 'boolean') {
    return true; // Booleans are always considered complete
  }
  
  if (typeof value === 'number') {
    return value >= 0;
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  if (typeof value === 'object') {
    // For complex objects, check specific field requirements
    if (fieldPath.includes('address')) {
      return value.street && value.city && value.zipCode;
    }
    if (fieldPath.includes('contactPerson')) {
      return value.firstName && value.lastName && value.email && value.phone;
    }
    return Object.keys(value).length > 0;
  }
  
  return false;
};
