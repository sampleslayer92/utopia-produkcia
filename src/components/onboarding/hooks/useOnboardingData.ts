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
    regulatedCards: 0.90,
    unregulatedCards: 0.90
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
  currentStep: 0,
  contractId: undefined,
  contractNumber: undefined
};

export const useOnboardingData = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem('onboarding_data');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Ensure the data has the new structure
        if (!parsedData.fees) {
          parsedData.fees = initialData.fees;
        }
        if (!parsedData.deviceSelection.selectedSolutions) {
          parsedData.deviceSelection = initialData.deviceSelection;
        }
        if (!parsedData.companyInfo.contactPerson.firstName) {
          // Migrate old name field to firstName/lastName
          const fullName = parsedData.companyInfo.contactPerson.name || '';
          const nameParts = fullName.split(' ');
          parsedData.companyInfo.contactPerson.firstName = nameParts[0] || '';
          parsedData.companyInfo.contactPerson.lastName = nameParts.slice(1).join(' ') || '';
        }
        if (parsedData.companyInfo.isVatPayer === undefined) {
          parsedData.companyInfo.isVatPayer = false;
          parsedData.companyInfo.vatNumber = '';
        }
        
        // Migrate existing dynamic cards to include companyCost and addons fields
        if (parsedData.deviceSelection.dynamicCards) {
          parsedData.deviceSelection.dynamicCards = parsedData.deviceSelection.dynamicCards.map((card: any) => ({
            ...card,
            companyCost: card.companyCost || 0,
            addons: card.addons || []
          }));
        }

        // Ensure userRole is present in contactInfo
        if (!parsedData.contactInfo.userRole) {
          parsedData.contactInfo.userRole = '';
        }
        
        return parsedData;
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
