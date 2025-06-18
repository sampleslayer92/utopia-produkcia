import { useState, useEffect, useCallback } from 'react';
import { OnboardingData } from '@/types/onboarding';

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface StepValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  completionPercentage: number;
  requiredFields: string[];
  missingFields: string[];
}

export const useStepValidation = (
  step: number,
  data: OnboardingData
): StepValidationResult & {
  validateField: (field: string, value: any) => boolean;
  clearFieldError: (field: string) => void;
} => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<ValidationError[]>([]);

  const getRequiredFields = useCallback((stepNumber: number): string[] => {
    switch (stepNumber) {
      case 0: return ['firstName', 'lastName', 'email', 'phone'];
      case 1: return ['ico', 'companyName', 'address', 'contactPerson'];
      case 2: return ['businessLocations']; // Simplified for presentation
      case 3: return ['deviceSelection']; // Simplified for presentation
      case 4: return []; // No required fields for fees
      case 5: return ['authorizedPersons'];
      case 6: return ['actualOwners'];
      case 7: return ['consents.gdpr', 'consents.terms'];
      default: return [];
    }
  }, []);

  const validateContactInfo = useCallback((): ValidationError[] => {
    const validationErrors: ValidationError[] = [];
    const { contactInfo } = data;

    if (!contactInfo.firstName?.trim()) {
      validationErrors.push({ field: 'firstName', message: 'Meno je povinné', severity: 'error' });
    }
    if (!contactInfo.lastName?.trim()) {
      validationErrors.push({ field: 'lastName', message: 'Priezvisko je povinné', severity: 'error' });
    }
    if (!contactInfo.email?.trim()) {
      validationErrors.push({ field: 'email', message: 'Email je povinný', severity: 'error' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      validationErrors.push({ field: 'email', message: 'Neplatný email', severity: 'error' });
    }
    if (!contactInfo.phone?.trim()) {
      validationErrors.push({ field: 'phone', message: 'Telefón je povinný', severity: 'error' });
    }

    return validationErrors;
  }, [data]);

  const validateCompanyInfo = useCallback((): ValidationError[] => {
    const validationErrors: ValidationError[] = [];
    const { companyInfo } = data;

    if (!companyInfo.ico?.trim()) {
      validationErrors.push({ field: 'ico', message: 'IČO je povinné', severity: 'error' });
    }
    if (!companyInfo.companyName?.trim()) {
      validationErrors.push({ field: 'companyName', message: 'Názov spoločnosti je povinný', severity: 'error' });
    }
    if (!companyInfo.address?.street?.trim()) {
      validationErrors.push({ field: 'address.street', message: 'Adresa je povinná', severity: 'error' });
    }
    if (!companyInfo.address?.city?.trim()) {
      validationErrors.push({ field: 'address.city', message: 'Mesto je povinné', severity: 'error' });
    }
    if (!companyInfo.address?.zipCode?.trim()) {
      validationErrors.push({ field: 'address.zipCode', message: 'PSČ je povinné', severity: 'error' });
    }
    if (!companyInfo.contactPerson?.firstName?.trim()) {
      validationErrors.push({ field: 'contactPerson.firstName', message: 'Meno kontaktnej osoby je povinné', severity: 'error' });
    }
    if (!companyInfo.contactPerson?.lastName?.trim()) {
      validationErrors.push({ field: 'contactPerson.lastName', message: 'Priezvisko kontaktnej osoby je povinné', severity: 'error' });
    }
    if (!companyInfo.contactPerson?.email?.trim()) {
      validationErrors.push({ field: 'contactPerson.email', message: 'Email kontaktnej osoby je povinný', severity: 'error' });
    }
    if (!companyInfo.contactPerson?.phone?.trim()) {
      validationErrors.push({ field: 'contactPerson.phone', message: 'Telefón kontaktnej osoby je povinný', severity: 'error' });
    }

    return validationErrors;
  }, [data]);

  const validateBusinessLocations = useCallback((): ValidationError[] => {
    const validationErrors: ValidationError[] = [];
    const { businessLocations } = data;

    // For presentation: simplified validation - only check if at least one location exists with basic info
    if (businessLocations.length === 0) {
      validationErrors.push({ field: 'businessLocations', message: 'Minimálne jedna prevádzka je povinná', severity: 'error' });
      return validationErrors;
    }

    // Check only basic fields for presentation
    businessLocations.forEach((location, index) => {
      if (!location.name?.trim()) {
        validationErrors.push({ field: `businessLocations.${index}.name`, message: 'Názov prevádzky je povinný', severity: 'error' });
      }
      
      if (!location.address?.street?.trim() || !location.address?.city?.trim() || !location.address?.zipCode?.trim()) {
        validationErrors.push({ field: `businessLocations.${index}.address`, message: 'Kompletná adresa je povinná', severity: 'error' });
      }
    });

    return validationErrors;
  }, [data]);

  const validateDeviceSelection = useCallback((): ValidationError[] => {
    const validationErrors: ValidationError[] = [];
    const { deviceSelection } = data;

    // For presentation: simplified validation
    if (deviceSelection.selectedSolutions.length === 0 && deviceSelection.dynamicCards.length === 0) {
      validationErrors.push({ field: 'deviceSelection', message: 'Vyberte aspoň jedno riešenie alebo zariadenie', severity: 'warning' });
    }

    return validationErrors;
  }, [data]);

  const validateStep = useCallback((stepNumber: number): ValidationError[] => {
    switch (stepNumber) {
      case 0: return validateContactInfo();
      case 1: return validateCompanyInfo();
      case 2: return validateBusinessLocations(); // Simplified validation
      case 3: return validateDeviceSelection(); // Simplified validation
      case 4: return []; // Fees - no validation for presentation
      case 5: 
        if (data.authorizedPersons.length === 0) {
          return [{ field: 'authorizedPersons', message: 'Minimálne jedna oprávnená osoba je povinná', severity: 'error' }];
        }
        return [];
      case 6:
        if (data.actualOwners.length === 0) {
          return [{ field: 'actualOwners', message: 'Minimálne jeden skutočný majiteľ je povinný', severity: 'error' }];
        }
        return [];
      case 7:
        const consentErrors: ValidationError[] = [];
        if (!data.consents.gdpr) {
          consentErrors.push({ field: 'consents.gdpr', message: 'GDPR súhlas je povinný', severity: 'error' });
        }
        if (!data.consents.terms) {
          consentErrors.push({ field: 'consents.terms', message: 'Súhlas s podmienkami je povinný', severity: 'error' });
        }
        return consentErrors;
      default: return [];
    }
  }, [validateContactInfo, validateCompanyInfo, validateBusinessLocations, validateDeviceSelection, data]);

  const calculateCompletionPercentage = useCallback((stepNumber: number): number => {
    const currentErrors = validateStep(stepNumber);
    const errorCount = currentErrors.filter(e => e.severity === 'error').length;
    
    // For presentation steps 1, 2 and 3: be more lenient
    if (stepNumber === 1) {
      if (data.companyInfo.companyName?.trim() || data.companyInfo.ico?.trim()) {
        return 100;
      }
      return 0;
    }
    
    if (stepNumber === 2) {
      if (data.businessLocations.length > 0) {
        const hasBasicInfo = data.businessLocations.some(loc => 
          loc.name?.trim() && loc.address?.street?.trim()
        );
        return hasBasicInfo ? 100 : 50;
      }
      return 0;
    }
    
    if (stepNumber === 3) {
      if (data.deviceSelection.selectedSolutions.length > 0 || data.deviceSelection.dynamicCards.length > 0) {
        return 100;
      }
      return 0;
    }
    
    // Base validation on actual step completion
    if (errorCount === 0) {
      return 100;
    }
    
    // Calculate partial completion for other steps
    const totalFields = {
      0: 4, // firstName, lastName, email, phone
      1: 8, // ico, companyName, address fields, contactPerson fields
      2: 1, // businessLocations (simplified)
      3: 1, // deviceSelection (simplified)
      4: 1, // fees
      5: Math.max(1, data.authorizedPersons.length), 
      6: Math.max(1, data.actualOwners.length),
      7: 2  // gdpr, terms
    };

    const total = totalFields[stepNumber as keyof typeof totalFields] || 1;
    return Math.max(0, Math.round(((total - errorCount) / total) * 100));
  }, [validateStep, data]);

  const getMissingFields = useCallback((stepNumber: number): string[] => {
    const validationErrors = validateStep(stepNumber);
    return validationErrors
      .filter(e => e.severity === 'error')
      .map(e => e.field);
  }, [validateStep]);

  // PRESENTATION LOGIC: Force isValid true for steps 1, 2 and 3
  const getStepValidationResult = useCallback((stepNumber: number): boolean => {
    // For presentation steps 1, 2 and 3: always return true regardless of validation
    if (stepNumber === 1 || stepNumber === 2 || stepNumber === 3) {
      console.log(`=== FORCED VALIDATION FOR STEP ${stepNumber} ===`);
      console.log('Forcing isValid: true for presentation step');
      return true;
    }
    
    // For other steps: use normal validation
    const validationErrors = validateStep(stepNumber);
    const hasErrors = validationErrors.filter(e => e.severity === 'error').length > 0;
    return !hasErrors;
  }, [validateStep]);

  useEffect(() => {
    const validationResults = validateStep(step);
    setErrors(validationResults.filter(e => e.severity === 'error'));
    setWarnings(validationResults.filter(e => e.severity === 'warning'));
  }, [step, validateStep]);

  const validateField = useCallback((field: string, value: any): boolean => {
    // Simple field validation - can be expanded
    if (typeof value === 'string' && !value.trim()) {
      return false;
    }
    if (field === 'email' && value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    return true;
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => prev.filter(e => e.field !== field));
    setWarnings(prev => prev.filter(e => e.field !== field));
  }, []);

  const requiredFields = getRequiredFields(step);
  const missingFields = getMissingFields(step);
  const isValid = getStepValidationResult(step);

  // Debug logging for presentation steps
  if (step === 1 || step === 2 || step === 3) {
    console.log(`=== useStepValidation DEBUG: Step ${step} ===`);
    console.log('isValid (forced):', isValid);
    console.log('errors count:', errors.length);
    console.log('missingFields:', missingFields);
    console.log('completionPercentage:', calculateCompletionPercentage(step));
  }

  return {
    isValid,
    errors,
    warnings,
    completionPercentage: calculateCompletionPercentage(step),
    requiredFields,
    missingFields,
    validateField,
    clearFieldError
  };
};
