
import { useState, useCallback, useEffect } from 'react';
import { OnboardingData } from '@/types/onboarding';

export const useContractDetailForm = (initialData?: OnboardingData) => {
  const [formData, setFormData] = useState<OnboardingData | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form data when initial data is provided or changes
  useEffect(() => {
    console.log('useContractDetailForm effect triggered with:', { 
      hasInitialData: !!initialData, 
      initialDataKeys: initialData ? Object.keys(initialData) : [],
      currentFormData: !!formData
    });
    
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('Setting form data from initial data:', initialData);
      setFormData({ ...initialData });
      setIsDirty(false);
    } else if (!initialData && formData) {
      // If initialData becomes null/undefined, clear form data
      console.log('Clearing form data because initialData is null/undefined');
      setFormData(null);
      setIsDirty(false);
    }
  }, [initialData]);

  const updateField = useCallback((path: string, value: any) => {
    console.log(`Updating field ${path} with value:`, value);
    
    setFormData(prev => {
      if (!prev) {
        console.warn('Cannot update field: formData is null. Creating new form data.');
        // If formData is null, create a minimal structure
        const newData: any = {};
        const pathParts = path.split('.');
        let current = newData;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          current[part] = {};
          current = current[part];
        }
        
        const finalKey = pathParts[pathParts.length - 1];
        current[finalKey] = value;
        
        console.log('Created new form data structure:', newData);
        return newData as OnboardingData;
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
        console.warn('Cannot update section: formData is null. Creating new form data.');
        // If formData is null, create a minimal structure
        const newData: any = {};
        const pathParts = sectionPath.split('.');
        let current = newData;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          current[part] = {};
          current = current[part];
        }
        
        const finalKey = pathParts[pathParts.length - 1];
        current[finalKey] = { ...sectionData };
        
        console.log('Created new form data structure for section:', newData);
        return newData as OnboardingData;
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
    setFormData(newData ? { ...newData } : null);
    setIsDirty(false);
  }, []);

  const markClean = useCallback(() => {
    console.log('Marking form as clean');
    setIsDirty(false);
  }, []);

  const markDirty = useCallback(() => {
    console.log('Marking form as dirty');
    setIsDirty(true);
  }, []);

  // Force initialize with provided data immediately if available
  const forceInitialize = useCallback((data: OnboardingData) => {
    console.log('Force initializing form with data:', data);
    setFormData({ ...data });
    setIsDirty(false);
  }, []);

  return {
    formData,
    isDirty,
    updateField,
    updateSection,
    resetForm,
    markClean,
    markDirty,
    forceInitialize
  };
};
