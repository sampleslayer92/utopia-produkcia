
import { useState } from "react";
import { OnboardingData, BankAccount, OpeningHours } from "@/types/onboarding";

const initialData: OnboardingData = {
  contactInfo: {
    salutation: undefined,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phonePrefix: '+421',
    salesNote: '',
    companyType: '',
    userRoles: [],
    userRole: '' // Keep for backward compatibility
  },
  companyInfo: {
    ico: '',
    dic: '',
    companyName: '',
    registryType: 'Živnosť',
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

        // Migrate userRole to userRoles if needed
        if (!parsedData.contactInfo.userRoles && parsedData.contactInfo.userRole) {
          parsedData.contactInfo.userRoles = [parsedData.contactInfo.userRole];
        }
        
        // Ensure new fields are present
        if (!parsedData.contactInfo.companyType) {
          parsedData.contactInfo.companyType = '';
        }
        if (!parsedData.contactInfo.userRoles) {
          parsedData.contactInfo.userRoles = [];
        }

        // Migrate business locations to new structure
        if (parsedData.businessLocations) {
          parsedData.businessLocations = parsedData.businessLocations.map((location: any) => {
            const migratedLocation = { ...location };
            
            // Migrate bank accounts
            if (!migratedLocation.bankAccounts) {
              const defaultBankAccount: BankAccount = {
                id: Date.now().toString(),
                format: 'IBAN',
                iban: location.iban || '',
                mena: 'EUR'
              };
              migratedLocation.bankAccounts = [defaultBankAccount];
            }
            
            // Migrate opening hours
            if (!migratedLocation.openingHoursDetailed) {
              const defaultOpeningHours: OpeningHours[] = [
                { day: "Po", open: "09:00", close: "17:00", otvorene: true },
                { day: "Ut", open: "09:00", close: "17:00", otvorene: true },
                { day: "St", open: "09:00", close: "17:00", otvorene: true },
                { day: "Št", open: "09:00", close: "17:00", otvorene: true },
                { day: "Pi", open: "09:00", close: "17:00", otvorene: true },
                { day: "So", open: "09:00", close: "14:00", otvorene: false },
                { day: "Ne", open: "09:00", close: "17:00", otvorene: false }
              ];
              migratedLocation.openingHoursDetailed = defaultOpeningHours;
            }
            
            // Migrate business details
            if (!migratedLocation.businessSubject) {
              migratedLocation.businessSubject = location.businessSector || '';
            }
            if (!migratedLocation.monthlyTurnover) {
              migratedLocation.monthlyTurnover = location.estimatedTurnover || 0;
            }
            if (!migratedLocation.mccCode) {
              migratedLocation.mccCode = '';
            }
            
            return migratedLocation;
          });
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
