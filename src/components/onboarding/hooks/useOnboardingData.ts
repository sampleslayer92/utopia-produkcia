
import { useState } from "react";
import { OnboardingData } from "@/types/onboarding";

const initialData: OnboardingData = {
  contactInfo: {
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phonePrefix: '+421',
    salesNote: ''
  },
  companyInfo: {
    ico: '',
    dic: '',
    companyName: '',
    registryType: '',
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
      name: '',
      email: '',
      phone: '',
      isTechnicalPerson: false
    }
  },
  businessLocations: [],
  deviceSelection: {
    terminals: {
      paxA920Pro: { count: 0, monthlyFee: 0, simCards: 0 },
      paxA80: { count: 0, monthlyFee: 0 }
    },
    tablets: {
      tablet10: { count: 0, monthlyFee: 0 },
      tablet15: { count: 0, monthlyFee: 0 },
      tabletPro15: { count: 0, monthlyFee: 0 }
    },
    softwareLicenses: [],
    accessories: [],
    ecommerce: [],
    technicalService: [],
    mifFees: {
      regulatedCards: 0,
      unregulatedCards: 0,
      dccRabat: 0
    },
    transactionTypes: [],
    note: ''
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
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem('onboarding_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved onboarding data:', error);
        return initialData;
      }
    }
    return initialData;
  });

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('onboarding_data', JSON.stringify(updated));
      return updated;
    });
  };

  const clearData = () => {
    localStorage.removeItem('onboarding_data');
    setOnboardingData(initialData);
  };

  return {
    onboardingData,
    updateData,
    clearData
  };
};
