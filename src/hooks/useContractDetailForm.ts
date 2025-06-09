
import { useState, useCallback } from 'react';
import { OnboardingData } from '@/types/onboarding';

export const useContractDetailForm = (initialData: OnboardingData) => {
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback((path: string, value: any) => {
    console.log(`Updating field ${path} with value:`, value);
    
    setFormData(prev => {
      const pathParts = path.split('.');
      const newData = { ...prev };
      let current = newData;
      
      // Navigate to the parent object
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        current[part] = { ...current[part] };
        current = current[part];
      }
      
      // Set the final value
      const finalKey = pathParts[pathParts.length - 1];
      current[finalKey] = value;
      
      console.log('Updated form data:', newData);
      return newData;
    });
    
    setIsDirty(true);
  }, []);

  const resetForm = useCallback((newData: OnboardingData) => {
    console.log('Resetting form with new data:', newData);
    setFormData(newData);
    setIsDirty(false);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  return {
    formData,
    isDirty,
    updateField,
    resetForm,
    markClean
  };
};
