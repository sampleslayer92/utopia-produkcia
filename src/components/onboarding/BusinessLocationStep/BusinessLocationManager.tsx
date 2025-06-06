
import { useState, useEffect } from "react";
import { OnboardingData, BusinessLocation, BankAccount, OpeningHours } from "@/types/onboarding";

export const useBusinessLocationManager = (data: OnboardingData, updateData: (data: Partial<OnboardingData>) => void) => {
  const [expandedLocationId, setExpandedLocationId] = useState<string | null>(null);

  // Check if user has "Kontaktná osoba na prevádzku" role or "Majiteľ" role
  const hasBusinessContactRole = data.contactInfo.userRoles?.includes('Kontaktná osoba na prevádzku') || 
                                data.contactInfo.userRoles?.includes('Majiteľ') || 
                                false;

  const addBusinessLocation = () => {
    const contactPersonData = hasBusinessContactRole ? {
      name: `${data.contactInfo.firstName} ${data.contactInfo.lastName}`,
      email: data.contactInfo.email,
      phone: data.contactInfo.phone
    } : {
      name: '',
      email: '',
      phone: ''
    };

    // Default bank account
    const defaultBankAccount: BankAccount = {
      id: Date.now().toString(),
      format: 'IBAN',
      iban: '',
      mena: 'EUR'
    };

    // Default opening hours (weekdays open, weekends closed)
    const defaultOpeningHours: OpeningHours[] = [
      { day: "Po", open: "09:00", close: "17:00", otvorene: true },
      { day: "Ut", open: "09:00", close: "17:00", otvorene: true },
      { day: "St", open: "09:00", close: "17:00", otvorene: true },
      { day: "Št", open: "09:00", close: "17:00", otvorene: true },
      { day: "Pi", open: "09:00", close: "17:00", otvorene: true },
      { day: "So", open: "09:00", close: "14:00", otvorene: false },
      { day: "Ne", open: "09:00", close: "17:00", otvorene: false }
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

  // Handle bank accounts update
  const updateBankAccounts = (locationId: string, bankAccounts: BankAccount[]) => {
    console.log('=== UPDATE BANK ACCOUNTS ===', { locationId, bankAccounts });
    
    updateBusinessLocation(locationId, 'bankAccounts', bankAccounts);
    
    // Update backward compatibility IBAN field
    if (bankAccounts.length > 0) {
      const firstAccount = bankAccounts[0];
      if (firstAccount.format === 'IBAN' && firstAccount.iban) {
        updateBusinessLocation(locationId, 'iban', firstAccount.iban);
      } else if (firstAccount.format === 'CisloUctuKodBanky' && firstAccount.cisloUctu && firstAccount.kodBanky) {
        updateBusinessLocation(locationId, 'iban', `${firstAccount.cisloUctu}/${firstAccount.kodBanky}`);
      }
    }
  };

  // Handle business details update
  const updateBusinessDetails = (locationId: string, field: string, value: string | number) => {
    console.log('=== UPDATE BUSINESS DETAILS ===', { locationId, field, value });
    
    updateBusinessLocation(locationId, field, value);
    
    // Update backward compatibility fields
    if (field === 'businessSubject') {
      updateBusinessLocation(locationId, 'businessSector', value);
    } else if (field === 'monthlyTurnover') {
      updateBusinessLocation(locationId, 'estimatedTurnover', value);
    }
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
      !location.businessSubject || !location.monthlyTurnover
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
            { day: "Po", open: "09:00", close: "17:00", otvorene: true },
            { day: "Ut", open: "09:00", close: "17:00", otvorene: true },
            { day: "St", open: "09:00", close: "17:00", otvorene: true },
            { day: "Št", open: "09:00", close: "17:00", otvorene: true },
            { day: "Pi", open: "09:00", close: "17:00", otvorene: true },
            { day: "So", open: "09:00", close: "14:00", otvorene: false },
            { day: "Ne", open: "09:00", close: "17:00", otvorene: false }
          ];
        }
        
        // Migrate business details
        if (!migrated.businessSubject) {
          migrated.businessSubject = location.businessSector || '';
        }
        if (!migrated.monthlyTurnover) {
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
