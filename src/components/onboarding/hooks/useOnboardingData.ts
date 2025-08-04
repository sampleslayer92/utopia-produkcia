
import { useState, useEffect } from "react";
import { OnboardingData, BankAccount, OpeningHours } from "@/types/onboarding";
import { useContractCopy } from "@/hooks/useContractCopy";
import { useAdminAutoSave } from "@/hooks/useAdminAutoSave";
import { useContractData } from "@/hooks/useContractData";

const initialData: OnboardingData = {
  contactInfo: {
    salutation: undefined,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phonePrefix: '+421',
    salesNote: '',
    userRoles: [],
    userRole: '' // Keep for backward compatibility
  },
  companyInfo: {
    ico: '',
    dic: '',
    companyName: '',
    registryType: '', // Changed from 'Živnosť' to empty string
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
    headOfficeEqualsOperatingAddress: false,
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
  devices: [], // Add missing devices array
  services: [], // Add missing services array
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
  visitedSteps: [], // New field to track visited steps
  currentStep: 0,
  contractId: undefined,
  contractNumber: undefined
};

export const useOnboardingData = (isAdminMode = false, urlContractId?: string) => {
  const { applyContractCopy } = useContractCopy();
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
        
        // Clean up registry type if it has the old default value
        if (parsedData.companyInfo.registryType === 'Živnosť') {
          parsedData.companyInfo.registryType = '';
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
        if (!parsedData.contactInfo.userRoles) {
          parsedData.contactInfo.userRoles = [];
        }

        // Initialize visitedSteps if not present - only mark step 0 as visited by default
        if (!parsedData.visitedSteps) {
          parsedData.visitedSteps = [];
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

  // Initialize auto-save for admin mode
  const autoSave = useAdminAutoSave({ 
    enabled: isAdminMode,
    delay: 2000 
  });

  // Set contractId immediately if provided via URL
  useEffect(() => {
    if (urlContractId && !onboardingData.contractId) {
      console.log('🔗 Setting contractId from URL immediately:', urlContractId);
      setOnboardingData(prev => {
        const updated = { ...prev, contractId: urlContractId };
        localStorage.setItem('onboarding_data', JSON.stringify(updated));
        return updated;
      });
    }
  }, [urlContractId, onboardingData.contractId]);

  // Load data from database if contract ID exists (prioritize urlContractId for shared links)
  const contractDataQuery = useContractData(urlContractId || onboardingData.contractId || '');

  // Merge database data with localStorage data when available
  useEffect(() => {
    if (contractDataQuery.data && !contractDataQuery.isLoading) {
      console.log('🔄 Loading contract data from database for contract:', contractDataQuery.data.onboardingData.contractId);
      const dbData = contractDataQuery.data.onboardingData;
      
      // Only merge if we have meaningful database data
      if (dbData.contractId && (
        dbData.contactInfo.firstName || 
        dbData.companyInfo.companyName || 
        dbData.businessLocations.length > 0 ||
        dbData.authorizedPersons.length > 0 ||
        dbData.actualOwners.length > 0
      )) {
        setOnboardingData(prev => {
          // For shared links (urlContractId exists): Always prioritize database data over localStorage
          // For admin mode: merge database data as base, but keep localStorage changes for unsaved edits
          const isSharedLink = Boolean(urlContractId);
          
          const merged = (isAdminMode && !isSharedLink) ? {
            ...dbData,        // Base: database data
            ...prev,          // Override: localStorage data (admin's current unsaved changes)
            contractId: dbData.contractId || prev.contractId,
            contractNumber: dbData.contractNumber || prev.contractNumber,
            visitedSteps: dbData.visitedSteps || prev.visitedSteps // Always use latest visited steps from DB
          } : {
            ...prev,          // Base: localStorage data (minimal for shared links)
            ...dbData,        // Override: database data (complete data for shared links)
            contractId: dbData.contractId || prev.contractId,
            contractNumber: dbData.contractNumber || prev.contractNumber,
            visitedSteps: dbData.visitedSteps || prev.visitedSteps // Use database visited steps
          };
          
          console.log('📊 Data merge strategy:', isSharedLink ? 'Shared link - database priority' : (isAdminMode ? 'Admin mode - localStorage priority' : 'Database priority'));
          console.log('📊 Merged data preview:', {
            contractId: merged.contractId,
            contactName: `${merged.contactInfo.firstName} ${merged.contactInfo.lastName}`,
            companyName: merged.companyInfo.companyName,
            businessLocationsCount: merged.businessLocations.length,
            authorizedPersonsCount: merged.authorizedPersons.length,
            actualOwnersCount: merged.actualOwners.length,
            visitedStepsCount: merged.visitedSteps.length
          });
          
          // Save merged data to localStorage
          localStorage.setItem('onboarding_data', JSON.stringify(merged));
          return merged;
        });
      }
    }
  }, [contractDataQuery.data, contractDataQuery.isLoading, isAdminMode, urlContractId]);

  // Apply contract copy data on mount if available
  useEffect(() => {
    const applyCopyData = async () => {
      const copyData = await applyContractCopy();
      if (copyData) {
        setOnboardingData(prev => ({ ...prev, ...copyData }));
      }
    };
    applyCopyData();
  }, [applyContractCopy]);

  const updateData = (data: Partial<OnboardingData>) => {
    console.log('🔄 Updating onboarding data:', data);
    
    setOnboardingData(prev => {
      // Deep merge for nested objects like deviceSelection
      const updated = {
        ...prev,
        ...data,
        deviceSelection: data.deviceSelection 
          ? { 
              ...prev.deviceSelection, 
              ...data.deviceSelection,
              // Ensure dynamicCards is properly merged 
              dynamicCards: data.deviceSelection.dynamicCards || prev.deviceSelection.dynamicCards
            }
          : prev.deviceSelection
      };
      
      console.log('💾 Saving to localStorage:', updated);
      console.log('📦 Cart items count before save:', prev.deviceSelection.dynamicCards.length);
      console.log('📦 Cart items count after save:', updated.deviceSelection.dynamicCards.length);
      console.log('📦 Latest cart contents:', updated.deviceSelection.dynamicCards.map(c => ({ id: c.id, name: c.name, locationId: c.locationId })));
      localStorage.setItem('onboarding_data', JSON.stringify(updated));
      
      // Trigger auto-save in admin mode
      if (isAdminMode) {
        autoSave.scheduleAutoSave(updated);
      }
      
      return updated;
    });
  };

  const markStepAsVisited = (stepNumber: number) => {
    setOnboardingData(prev => {
      const visitedSteps = [...prev.visitedSteps];
      if (!visitedSteps.includes(stepNumber)) {
        visitedSteps.push(stepNumber);
      }
      const updated = { ...prev, visitedSteps };
      localStorage.setItem('onboarding_data', JSON.stringify(updated));
      
      // Trigger auto-save immediately in admin mode for visited steps
      if (isAdminMode) {
        autoSave.forceSave(updated);
      }
      
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
    markStepAsVisited,
    clearData,
    forceSave: autoSave.forceSave,
    isAutoSaving: autoSave.isSaving
  };
};
