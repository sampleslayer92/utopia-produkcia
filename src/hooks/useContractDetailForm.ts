
import { useState, useCallback, useEffect } from 'react';
import { OnboardingData } from '@/types/onboarding';

export const useContractDetailForm = (initialData: OnboardingData) => {
  const [formData, setFormData] = useState<OnboardingData>({} as OnboardingData);
  const [isDirty, setIsDirty] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form data when initial data is available and not empty
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0 && !isInitialized) {
      console.log('Initializing form data with:', initialData);
      setFormData(initialData);
      setIsInitialized(true);
      setIsDirty(false);
    }
  }, [initialData, isInitialized]);

  const updateField = useCallback((path: string, value: any) => {
    console.log(`Updating field ${path} with value:`, value);
    
    setFormData(prev => {
      const pathParts = path.split('.');
      const newData = { ...prev };
      let current = newData;
      
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

  const updateBusinessLocation = useCallback((index: number, updates: any) => {
    console.log(`Updating business location ${index} with:`, updates);
    
    setFormData(prev => {
      const newData = { ...prev };
      if (!newData.businessLocations) {
        newData.businessLocations = [];
      }
      
      newData.businessLocations = [...newData.businessLocations];
      newData.businessLocations[index] = {
        ...newData.businessLocations[index],
        ...updates
      };
      
      console.log('Updated business locations:', newData.businessLocations);
      return newData;
    });
    
    setIsDirty(true);
  }, []);

  const addBusinessLocation = useCallback((newLocation: any) => {
    console.log('Adding new business location:', newLocation);
    
    setFormData(prev => {
      const newData = { ...prev };
      if (!newData.businessLocations) {
        newData.businessLocations = [];
      }
      
      newData.businessLocations = [...newData.businessLocations, newLocation];
      
      console.log('Updated business locations:', newData.businessLocations);
      return newData;
    });
    
    setIsDirty(true);
  }, []);

  const removeBusinessLocation = useCallback((index: number) => {
    console.log('Removing business location at index:', index);
    
    setFormData(prev => {
      const newData = { ...prev };
      if (!newData.businessLocations) {
        return newData;
      }
      
      newData.businessLocations = newData.businessLocations.filter((_, i) => i !== index);
      
      console.log('Updated business locations:', newData.businessLocations);
      return newData;
    });
    
    setIsDirty(true);
  }, []);

  const resetForm = useCallback((newData: OnboardingData) => {
    console.log('Resetting form with new data:', newData);
    setFormData(newData);
    setIsInitialized(true);
    setIsDirty(false);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  return {
    formData,
    isDirty,
    isInitialized,
    updateField,
    updateBusinessLocation,
    addBusinessLocation,
    removeBusinessLocation,
    resetForm,
    markClean
  };
};
