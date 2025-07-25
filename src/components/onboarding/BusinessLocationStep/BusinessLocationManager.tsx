
import { useState, useEffect } from "react";
import { OnboardingData, BusinessLocation, BankAccount, OpeningHours } from "@/types/onboarding";

export const useBusinessLocationManager = (data: OnboardingData, updateData: (data: Partial<OnboardingData>) => void) => {
  const [expandedLocationId, setExpandedLocationId] = useState<string | null>(null);

  // Check if user has "Kontaktná osoba na prevádzku" role or "Majiteľ" role
  const hasBusinessContactRole = data.contactInfo.userRoles?.includes('Kontaktná osoba na prevádzku') || 
                                data.contactInfo.userRoles?.includes('Majiteľ') || 
                                false;

  const addBusinessLocation = () => {
    // Only pre-fill contact person data if user explicitly has the business contact role
    const contactPersonData = hasBusinessContactRole ? {
      name: `${data.contactInfo.firstName} ${data.contactInfo.lastName}`,
      email: data.contactInfo.email,
      phone: data.contactInfo.phone
    } : {
      name: '',
      email: '',
      phone: ''
    };

    // Start with empty bank account
    const defaultBankAccount: BankAccount = {
      id: Date.now().toString(),
      format: 'IBAN',
      iban: '',
      mena: 'EUR'
    };

    // Empty opening hours - user needs to set them explicitly
    const defaultOpeningHours: OpeningHours[] = [
      { day: "Po", open: "", close: "", otvorene: false },
      { day: "Ut", open: "", close: "", otvorene: false },
      { day: "St", open: "", close: "", otvorene: false },
      { day: "Št", open: "", close: "", otvorene: false },
      { day: "Pi", open: "", close: "", otvorene: false },
      { day: "So", open: "", close: "", otvorene: false },
      { day: "Ne", open: "", close: "", otvorene: false }
    ];

    // Use head office address if checkbox is checked and this is the first location
    const shouldUseHeadOfficeAddress = data.companyInfo.headOfficeEqualsOperatingAddress && data.businessLocations.length === 0;
    const addressData = shouldUseHeadOfficeAddress ? {
      street: data.companyInfo.address.street,
      city: data.companyInfo.address.city,
      zipCode: data.companyInfo.address.zipCode
    } : {
      street: '',
      city: '',
      zipCode: ''
    };

    const newLocation: BusinessLocation = {
      id: Date.now().toString(),
      name: '',
      hasPOS: false,
      address: addressData,
      iban: '', // Keep for backward compatibility
      bankAccounts: [defaultBankAccount],
      contactPerson: contactPersonData,
      businessSector: '', // Keep for backward compatibility
      businessSubject: '',
      mccCode: '',
      estimatedTurnover: 0, // Keep for backward compatibility
      monthlyTurnover: 0,
      averageTransaction: 0,
      openingHours: '', // Keep for backward compatibility
      openingHoursDetailed: defaultOpeningHours,
      seasonality: 'year-round',
      assignedPersons: []
    };

    updateData({
      businessLocations: [...data.businessLocations, newLocation]
    });
    
    // Automatically expand the new location
    setExpandedLocationId(newLocation.id);
  };

  const removeBusinessLocation = (id: string) => {
    updateData({
      businessLocations: data.businessLocations.filter(location => location.id !== id)
    });
    if (expandedLocationId === id) {
      setExpandedLocationId(null);
    }
  };

  const updateBusinessLocation = (id: string, field: string, value: any) => {
    console.log('=== UPDATE BUSINESS LOCATION ===', { id, field, value });
    
    // Prevent updating first location's address if head office sync is enabled
    if (field.startsWith('address.') && data.companyInfo.headOfficeEqualsOperatingAddress) {
      const firstLocationId = data.businessLocations[0]?.id;
      if (id === firstLocationId) {
        console.log('Address update blocked - head office sync is enabled');
        return;
      }
    }

    const updatedLocations = data.businessLocations.map(location => {
      if (location.id !== id) return location;
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...location,
          [parent]: {
            ...(location[parent as keyof BusinessLocation] as any),
            [child]: value
          }
        };
      } else {
        return {
          ...location,
          [field]: value
        };
      }
    });

    console.log('=== UPDATED LOCATIONS ===', updatedLocations);
    
    updateData({
      businessLocations: updatedLocations
    });
  };

  // Handle bank accounts update - simplified to avoid duplicate IBAN updates
  const updateBankAccounts = (locationId: string, bankAccounts: BankAccount[]) => {
    console.log('=== UPDATE BANK ACCOUNTS ===', { locationId, bankAccounts });
    
    // Update only bankAccounts, don't update backward compatibility IBAN field here
    // to avoid conflicts with direct IBAN input
    updateBusinessLocation(locationId, 'bankAccounts', bankAccounts);
  };

  // Handle business details update - FIXED to properly update and trigger re-renders
  const updateBusinessDetails = (locationId: string, field: string, value: string | number) => {
    console.log('=== UPDATE BUSINESS DETAILS ===', { locationId, field, value });
    
    // Update the main field first
    updateBusinessLocation(locationId, field, value);
    
    // Update backward compatibility fields immediately after main update
    const updatedLocations = data.businessLocations.map(location => {
      if (location.id !== locationId) return location;
      
      const updated = { ...location, [field]: value };
      
      // Update backward compatibility fields
      if (field === 'businessSubject') {
        updated.businessSector = value as string;
      } else if (field === 'monthlyTurnover') {
        updated.estimatedTurnover = value as number;
      }
      
      return updated;
    });
    
    console.log('=== BUSINESS DETAILS UPDATED LOCATIONS ===', updatedLocations);
    
    // Force update with the new data to trigger re-renders in all dependent components
    updateData({
      businessLocations: updatedLocations
    });
  };

  // Handle opening hours update via modal
  const updateOpeningHours = (locationId: string, openingHours: OpeningHours[]) => {
    updateBusinessLocation(locationId, 'openingHoursDetailed', openingHours);
    
    // Update backward compatibility openingHours field
    const hoursText = openingHours
      .filter(h => h.otvorene)
      .map(h => `${h.day}: ${h.open}-${h.close}`)
      .join(', ');
    updateBusinessLocation(locationId, 'openingHours', hoursText || 'Nie sú zadané');
  };

  const toggleLocation = (id: string) => {
    setExpandedLocationId(expandedLocationId === id ? null : id);
  };

  // Migrate existing locations to have bankAccounts and openingHoursDetailed
  useEffect(() => {
    const locationsNeedMigration = data.businessLocations.some(location => 
      !location.bankAccounts || !location.openingHoursDetailed || 
      !location.businessSubject === undefined || !location.monthlyTurnover === undefined
    );

    if (locationsNeedMigration) {
      const migratedLocations = data.businessLocations.map(location => {
        const migrated = { ...location };
        
        // Migrate bank accounts
        if (!migrated.bankAccounts) {
          migrated.bankAccounts = [{
            id: Date.now().toString(),
            format: 'IBAN' as const,
            iban: location.iban || '',
            mena: 'EUR' as const
          }];
        }
        
        // Migrate opening hours
        if (!migrated.openingHoursDetailed) {
          migrated.openingHoursDetailed = [
            { day: "Po", open: "", close: "", otvorene: false },
            { day: "Ut", open: "", close: "", otvorene: false },
            { day: "St", open: "", close: "", otvorene: false },
            { day: "Št", open: "", close: "", otvorene: false },
            { day: "Pi", open: "", close: "", otvorene: false },
            { day: "So", open: "", close: "", otvorene: false },
            { day: "Ne", open: "", close: "", otvorene: false }
          ];
        }
        
        // Migrate business details
        if (migrated.businessSubject === undefined) {
          migrated.businessSubject = location.businessSector || '';
        }
        if (migrated.monthlyTurnover === undefined) {
          migrated.monthlyTurnover = location.estimatedTurnover || 0;
        }
        if (!migrated.mccCode) {
          migrated.mccCode = '';
        }
        
        return migrated;
      });
      
      updateData({ businessLocations: migratedLocations });
    }
  }, []);

  return {
    expandedLocationId,
    hasBusinessContactRole,
    addBusinessLocation,
    removeBusinessLocation,
    updateBusinessLocation,
    updateBankAccounts,
    updateBusinessDetails,
    updateOpeningHours,
    toggleLocation
  };
};
