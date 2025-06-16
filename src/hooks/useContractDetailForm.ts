
import { useState, useCallback, useEffect } from 'react';
import { OnboardingData } from '@/types/onboarding';

export const useContractDetailForm = (initialData?: OnboardingData) => {
  const [formData, setFormData] = useState<OnboardingData | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form data when initial data is provided
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('Initializing form data with initial data:', initialData);
      setFormData(initialData);
      setIsDirty(false);
    }
  }, [initialData]);

  const updateField = useCallback((path: string, value: any) => {
    console.log(`Updating field ${path} with value:`, value);
    
    setFormData(prev => {
      if (!prev) {
        console.warn('Cannot update field: formData is null');
        return prev;
      }
      
      const pathParts = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      // Navigate to the parent object
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
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

  const updateSection = useCallback((sectionPath: string, sectionData: any) => {
    console.log(`Updating section ${sectionPath} with data:`, sectionData);
    
    setFormData(prev => {
      if (!prev) {
        console.warn('Cannot update section: formData is null');
        return prev;
      }
      
      const newData = { ...prev };
      const pathParts = sectionPath.split('.');
      let current: any = newData;
      
      // Navigate to the parent
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current[part] = { ...current[part] };
        current = current[part];
      }
      
      // Set the section data
      const finalKey = pathParts[pathParts.length - 1];
      current[finalKey] = { ...current[finalKey], ...sectionData };
      
      console.log('Updated section data:', newData);
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

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  return {
    formData,
    isDirty,
    updateField,
    updateSection,
    resetForm,
    markClean,
    markDirty
  };
};
