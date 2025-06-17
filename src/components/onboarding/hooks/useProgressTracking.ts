import { useMemo } from 'react';
import { OnboardingData } from '@/types/onboarding';

interface StepProgress {
  stepNumber: number;
  stepName: string;
  isComplete: boolean;
  completionPercentage: number;
  requiredFields: string[];
  completedFields: string[];
  isVisited: boolean;
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

    // Simplified progress calculation - only for completion status, not detailed percentages
    steps.forEach(step => {
      const completedFields: string[] = [];
      
      // Quick validation for completion status only
      step.requiredFields.forEach(fieldPath => {
        const value = getNestedValue(data, fieldPath);
        if (isFieldComplete(value, fieldPath)) {
          completedFields.push(fieldPath);
        }
      });

      step.completedFields = completedFields;
      
      // Simplified completion calculation
      const hasAnyCompletedFields = completedFields.length > 0;
      const allFieldsCompleted = completedFields.length === step.requiredFields.length;
      
      // For steps 4-7: Only mark as complete if visited AND all fields are valid
      if (step.stepNumber >= 4) {
        step.isComplete = step.isVisited && allFieldsCompleted;
        step.completionPercentage = step.isVisited && hasAnyCompletedFields ? 
          (allFieldsCompleted ? 100 : 50) : 0;
      } else {
        // For steps 0-3: Use standard validation
        step.isComplete = allFieldsCompleted;
        step.completionPercentage = hasAnyCompletedFields ? 
          (allFieldsCompleted ? 100 : 50) : 0;
      }
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

const isFieldComplete = (value: any, fieldPath: string): boolean => {
  if (value === null || value === undefined) return false;
  
  if (typeof value === 'string') {
    const trimmed = value.trim();
    
    // Special validation for email fields
    if (fieldPath.includes('email')) {
      return trimmed !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    }
    
    // Special validation for phone fields
    if (fieldPath.includes('phone')) {
      return trimmed !== '' && trimmed.length >= 9; // Minimum phone length
    }
    
    // Special validation for ICO/DIC
    if (fieldPath.includes('ico') || fieldPath.includes('dic')) {
      return trimmed !== '' && trimmed.length >= 6; // Minimum length for ICO/DIC
    }
    
    return trimmed !== '';
  }
  
  if (typeof value === 'boolean') {
    return true; // Booleans are always considered complete
  }
  
  if (typeof value === 'number') {
    return value >= 0;
  }
  
  if (Array.isArray(value)) {
    // For business locations, check if they have complete data
    if (fieldPath === 'businessLocations') {
      return value.length > 0 && value.every(location => isBusinessLocationComplete(location));
    }
    
    // For device selection, check if devices are properly configured
    if (fieldPath === 'deviceSelection.dynamicCards') {
      return value.length > 0 && value.every(device => device.count > 0 && device.name);
    }
    
    // For authorized persons and actual owners
    if (fieldPath === 'authorizedPersons' || fieldPath === 'actualOwners') {
      return value.length > 0 && value.every(person => 
        person.firstName?.trim() && 
        person.lastName?.trim() && 
        person.email?.trim() && 
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)
      );
    }
    
    return value.length > 0;
  }
  
  if (typeof value === 'object') {
    // For nested address objects
    if (fieldPath.includes('address')) {
      return value.street?.trim() && value.city?.trim() && value.zipCode?.trim();
    }
    
    // For contact person objects
    if (fieldPath.includes('contactPerson')) {
      return value.firstName?.trim() && 
             value.lastName?.trim() && 
             value.email?.trim() && 
             /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) &&
             value.phone?.trim();
    }
    
    // For fees objects
    if (fieldPath.includes('fees')) {
      return typeof value.regulatedCards === 'number' && 
             typeof value.unregulatedCards === 'number' &&
             value.regulatedCards >= 0 && 
             value.unregulatedCards >= 0;
    }
    
    // For consents objects
    if (fieldPath.includes('consents')) {
      return value.gdpr === true && value.terms === true;
    }
    
    return Object.keys(value).length > 0;
  }
  
  return false;
};

const isBusinessLocationComplete = (location: any): boolean => {
  if (!location) return false;
  
  const hasBasicInfo = location.businessName?.trim() && 
                      location.address?.street?.trim() && 
                      location.address?.city?.trim() && 
                      location.address?.zipCode?.trim();
                      
  const hasContactPerson = location.contactPerson?.firstName?.trim() && 
                          location.contactPerson?.lastName?.trim() && 
                          location.contactPerson?.email?.trim() &&
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(location.contactPerson.email);
                          
  const hasBankAccount = location.bankAccounts && 
                        location.bankAccounts.length > 0 && 
                        location.bankAccounts.every((account: any) => 
                          account.iban?.trim() && account.currency
                        );
  
  return hasBasicInfo && hasContactPerson && hasBankAccount;
};
