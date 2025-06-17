
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
      case 2: return ['businessLocations'];
      case 3: return ['selectedSolutions', 'dynamicCards'];
      case 4: return []; // fees - optional
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

    return validationErrors;
  }, [data]);

  const validateBusinessLocations = useCallback((): ValidationError[] => {
    const validationErrors: ValidationError[] = [];
    const { businessLocations } = data;

    if (businessLocations.length === 0) {
      validationErrors.push({ field: 'businessLocations', message: 'Minimálne jedna prevádzka je povinná', severity: 'error' });
    }

    businessLocations.forEach((location, index) => {
      if (!location.name?.trim()) {
        validationErrors.push({ field: `businessLocations.${index}.name`, message: 'Názov prevádzky je povinný', severity: 'error' });
      }
      if (!location.bankAccounts || location.bankAccounts.length === 0) {
        validationErrors.push({ field: `businessLocations.${index}.bankAccounts`, message: 'Minimálne jeden bankový účet je povinný', severity: 'error' });
      }
    });

    return validationErrors;
  }, [data]);

  const validateDeviceSelection = useCallback((): ValidationError[] => {
    const validationErrors: ValidationError[] = [];
    const { deviceSelection } = data;

    if (deviceSelection.selectedSolutions.length === 0) {
      validationErrors.push({ field: 'selectedSolutions', message: 'Vyberte aspoň jedno riešenie', severity: 'error' });
    }

    if (deviceSelection.dynamicCards.length === 0) {
      validationErrors.push({ field: 'dynamicCards', message: 'Pridajte aspoň jedno zariadenie alebo službu', severity: 'warning' });
    }

    return validationErrors;
  }, [data]);

  const validateStep = useCallback((stepNumber: number): ValidationError[] => {
    switch (stepNumber) {
      case 0: return validateContactInfo();
      case 1: return validateCompanyInfo();
      case 2: return validateBusinessLocations();
      case 3: return validateDeviceSelection();
      case 4: return []; // Fees - optional
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
    const totalFields = {
      0: 4, // firstName, lastName, email, phone
      1: 4, // ico, companyName, address, contactPerson
      2: Math.max(1, data.businessLocations.length * 3), // name, address, bankAccount per location
      3: 2, // selectedSolutions, dynamicCards
      4: 1, // fees
      5: Math.max(1, data.authorizedPersons.length * 8), // 8 required fields per person
      6: Math.max(1, data.actualOwners.length * 6), // 6 required fields per owner
      7: 2  // gdpr, terms
    };

    const currentErrors = validateStep(stepNumber);
    const errorCount = currentErrors.filter(e => e.severity === 'error').length;
    const total = totalFields[stepNumber as keyof typeof totalFields] || 1;
    
    return Math.max(0, Math.round(((total - errorCount) / total) * 100));
  }, [validateStep, data]);

  const getMissingFields = useCallback((stepNumber: number): string[] => {
    const validationErrors = validateStep(stepNumber);
    return validationErrors
      .filter(e => e.severity === 'error')
      .map(e => e.field);
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

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    completionPercentage: calculateCompletionPercentage(step),
    requiredFields,
    missingFields,
    validateField,
    clearFieldError
  };
};
