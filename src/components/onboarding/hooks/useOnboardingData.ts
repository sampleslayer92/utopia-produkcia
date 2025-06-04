
import { useState, useEffect } from "react";
import { OnboardingData } from "@/types/onboarding";

const getInitialData = (): OnboardingData => ({
  contactInfo: {
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phonePrefix: '+421',
    salesNote: '',
    userRole: ''
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
    regulatedCards: 0.2,
    unregulatedCards: 1.15
  },
  authorizedPersons: [],
  actualOwners: [],
  consents: {
    gdpr: false,
    terms: false,
    electronicCommunication: false,
    signatureDate: '',
    signingPersonId: '',
    isSigned: false
  },
  currentStep: 0,
  contractId: undefined,
  contractNumber: undefined
});

export const useOnboardingData = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('onboarding_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure new fields exist
        return {
          ...getInitialData(),
          ...parsed,
          contactInfo: {
            ...getInitialData().contactInfo,
            ...parsed.contactInfo
          },
          consents: {
            ...getInitialData().consents,
            ...parsed.consents
          }
        };
      } catch {
        return getInitialData();
      }
    }
    return getInitialData();
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('onboarding_data', JSON.stringify(onboardingData));
  }, [onboardingData]);

  const updateData = (newData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const clearData = () => {
    localStorage.removeItem('onboarding_data');
    setOnboardingData(getInitialData());
  };

  return {
    onboardingData,
    updateData,
    clearData
  };
};
