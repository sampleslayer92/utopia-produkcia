
import { useState, useEffect } from "react";
import { OnboardingData } from "@/types/onboarding";
import { toast } from "sonner";

const initialOnboardingData: OnboardingData = {
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
    address: { street: '', city: '', zipCode: '' },
    contactAddress: { street: '', city: '', zipCode: '' },
    contactAddressSameAsMain: true,
    contactPerson: { name: '', email: '', phone: '', isTechnicalPerson: false }
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
    mifFees: { regulatedCards: 0, unregulatedCards: 0, dccRabat: 0 },
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
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData);

  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const safeData = {
          ...parsed,
          businessLocations: parsed.businessLocations || [],
          authorizedPersons: parsed.authorizedPersons || [],
          actualOwners: parsed.actualOwners || [],
          deviceSelection: {
            ...parsed.deviceSelection,
            softwareLicenses: parsed.deviceSelection?.softwareLicenses || [],
            accessories: parsed.deviceSelection?.accessories || [],
            ecommerce: parsed.deviceSelection?.ecommerce || [],
            technicalService: parsed.deviceSelection?.technicalService || [],
            transactionTypes: parsed.deviceSelection?.transactionTypes || []
          }
        };
        setOnboardingData(safeData);
        setCurrentStep(parsed.currentStep || 0);
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = { ...onboardingData, currentStep };
    localStorage.setItem('onboarding_data', JSON.stringify(dataToSave));
  }, [onboardingData, currentStep]);

  const updateData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  return {
    currentStep,
    setCurrentStep,
    onboardingData,
    updateData
  };
};
