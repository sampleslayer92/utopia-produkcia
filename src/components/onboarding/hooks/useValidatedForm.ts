
import { useState, useEffect } from 'react';
import { z } from 'zod';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  completedFields: Set<string>;
}

export function useValidatedForm<T>(
  schema: z.ZodSchema<T>,
  data: T,
  onUpdate: (field: string, value: any) => void
) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [isValid, setIsValid] = useState(false);

  // Validate specific field
  const validateField = (field: string, value: any) => {
    try {
      // For nested field validation, we need to validate the entire object
      const result = schema.safeParse(data);
      if (result.success) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
        return true;
      } else {
        // Check if this field has an error
        const fieldError = result.error.errors.find(err => 
          err.path.join('.') === field
        );
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [field]: fieldError.message
          }));
          return false;
        }
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [field]: 'Neplatná hodnota'
      }));
      return false;
    }
    return true;
  };

  // Validate entire form
  const validateForm = () => {
    try {
      schema.parse(data);
      setErrors({});
      setIsValid(true);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            const fieldPath = err.path.join('.');
            newErrors[fieldPath] = err.message;
          }
        });
        setErrors(newErrors);
      }
      setIsValid(false);
      return false;
    }
  };

  // Update field with validation
  const updateField = (field: string, value: any) => {
    onUpdate(field, value);
    
    // Validate after update
    setTimeout(() => {
      validateField(field, value);
    }, 0);
  };

  // Track completed fields
  useEffect(() => {
    const newCompleted = new Set<string>();
    
    const checkFieldCompletion = (obj: any, prefix = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const fieldKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          checkFieldCompletion(value, fieldKey);
        } else if (value !== '' && value !== null && value !== undefined) {
          if (typeof value === 'string' && value.trim() !== '') {
            newCompleted.add(fieldKey);
          } else if (typeof value !== 'string') {
            newCompleted.add(fieldKey);
          }
        }
      });
    };

    checkFieldCompletion(data);
    setCompletedFields(newCompleted);
    
    // Validate entire form
    validateForm();
  }, [data, schema]);

  return {
    errors,
    completedFields,
    isValid,
    validateField,
    validateForm,
    updateField
  };
}
