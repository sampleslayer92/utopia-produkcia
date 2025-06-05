
import { useCallback, useRef } from 'react';
import { OnboardingData } from '@/types/onboarding';

export const useDataPersistence = () => {
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Enhanced save function with retry logic
  const saveToLocalStorage = useCallback((data: OnboardingData, immediate = false) => {
    const save = () => {
      try {
        const dataToSave = JSON.stringify(data);
        localStorage.setItem('onboardingData', dataToSave);
        console.log('Data successfully saved to localStorage', {
          contractId: data.contractId,
          currentStep: data.currentStep,
          businessLocationsCount: data.businessLocations.length,
          deviceCardsCount: data.deviceSelection.dynamicCards.length
        });
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        // Try to free up space by removing old data
        try {
          localStorage.removeItem('onboardingData_backup');
          localStorage.setItem('onboardingData', JSON.stringify(data));
          console.log('Saved after clearing backup');
        } catch (retryError) {
          console.error('Failed to save even after clearing space:', retryError);
        }
      }
    };

    if (immediate) {
      save();
    } else {
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Debounced save
      saveTimeoutRef.current = setTimeout(save, 500);
    }
  }, []);

  // Load with error handling
  const loadFromLocalStorage = useCallback((): OnboardingData | null => {
    try {
      const data = localStorage.getItem('onboardingData');
      if (data) {
        const parsed = JSON.parse(data);
        console.log('Data loaded from localStorage', {
          contractId: parsed.contractId,
          currentStep: parsed.currentStep,
          businessLocationsCount: parsed.businessLocations?.length || 0
        });
        return parsed;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      // Try to load backup
      try {
        const backup = localStorage.getItem('onboardingData_backup');
        if (backup) {
          return JSON.parse(backup);
        }
      } catch (backupError) {
        console.error('Backup data also corrupted:', backupError);
      }
    }
    return null;
  }, []);

  // Create backup before major operations
  const createBackup = useCallback(() => {
    try {
      const current = localStorage.getItem('onboardingData');
      if (current) {
        localStorage.setItem('onboardingData_backup', current);
        console.log('Backup created');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  }, []);

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    createBackup
  };
};
