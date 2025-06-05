
import { useState, useEffect, useCallback } from 'react';
import { OnboardingData } from '@/types/onboarding';
import { useDataPersistence } from './useDataPersistence';

const defaultOnboardingData: OnboardingData = {
  contactInfo: {
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phonePrefix: '+421',
    companyType: '',
    salesNote: ''
  },
  companyInfo: {
    ico: '',
    dic: '',
    companyName: '',
    registryType: '',
    isVatPayer: false,
    vatNumber: '',
    court: '',
    section: '',
    insertNumber: '',
    address: {
      street: '',
      city: '',
      zipCode: ''
    },
    contactAddress: {
      street: '',
      city: '',
      zipCode: ''
    },
    contactAddressSameAsMain: true,
    contactPerson: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      isTechnicalPerson: false
    }
  },
  businessLocations: [],
  deviceSelection: {
    selectedSolutions: [],
    dynamicCards: [],
    note: ''
  },
  fees: {
    regulatedCards: 0.9,
    unregulatedCards: 1.5
  },
  authorizedPersons: [],
  actualOwners: [],
  consents: {
    gdpr: false,
    terms: false,
    electronicCommunication: false,
    signatureDate: '',
    signingPersonId: ''
  },
  currentStep: 0
};

export const useOnboardingData = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);
  const { saveToLocalStorage, loadFromLocalStorage, createBackup } = useDataPersistence();

  // Load data on mount
  useEffect(() => {
    const loadedData = loadFromLocalStorage();
    if (loadedData) {
      // Ensure all required fields exist (migration)
      const migratedData = {
        ...defaultOnboardingData,
        ...loadedData,
        fees: {
          regulatedCards: 0.9,
          unregulatedCards: 1.5,
          ...loadedData.fees
        }
      };
      setOnboardingData(migratedData);
    }
  }, [loadFromLocalStorage]);

  // Enhanced update function with immediate persistence for critical data
  const updateData = useCallback((newData: Partial<OnboardingData>) => {
    setOnboardingData(prevData => {
      const updatedData = { ...prevData, ...newData };
      
      // Determine if this is a critical update that needs immediate save
      const isCriticalUpdate = !!(
        newData.contactInfo ||
        newData.businessLocations ||
        newData.deviceSelection ||
        newData.contractId ||
        newData.fees
      );
      
      // Save to localStorage
      saveToLocalStorage(updatedData, isCriticalUpdate);
      
      return updatedData;
    });
  }, [saveToLocalStorage]);

  // Clear all data
  const clearData = useCallback(() => {
    createBackup(); // Create backup before clearing
    setOnboardingData(defaultOnboardingData);
    localStorage.removeItem('onboardingData');
    console.log('Onboarding data cleared');
  }, [createBackup]);

  return {
    onboardingData,
    updateData,
    clearData
  };
};
