
import { OnboardingData } from "@/types/onboarding";
import { v4 as uuidv4 } from "uuid";

export const createDefaultBusinessLocation = (contactInfo: OnboardingData['contactInfo'], shouldAutoFillContact: boolean) => ({
  id: uuidv4(),
  name: '',
  hasPOS: false,
  address: { 
    street: '', 
    city: '', 
    zipCode: '' 
  },
  iban: '',
  contactPerson: shouldAutoFillContact ? {
    name: `${contactInfo.firstName} ${contactInfo.lastName}`,
    email: contactInfo.email,
    phone: contactInfo.phone
  } : {
    name: '',
    email: '',
    phone: ''
  },
  businessSector: '',
  estimatedTurnover: 0,
  averageTransaction: 0,
  openingHours: '',
  seasonality: 'year-round' as const,
  assignedPersons: []
});

export const updateBusinessLocationsContactPerson = (
  businessLocations: OnboardingData['businessLocations'], 
  contactInfo: OnboardingData['contactInfo'],
  role: string
) => {
  // Iba ak má rolu "Kontaktná osoba na prevádzku" alebo "Konateľ"
  const hasBusinessContactRole = role === 'Kontaktná osoba na prevádzku' || role === 'Konateľ';
  
  if (!hasBusinessContactRole) {
    return businessLocations;
  }

  return businessLocations.map(location => {
    // Only auto-fill if contact person is empty or matches the previous contact info
    const shouldUpdate = !location.contactPerson.name || 
                        location.contactPerson.email === contactInfo.email ||
                        location.contactPerson.name === `${contactInfo.firstName} ${contactInfo.lastName}`;

    if (shouldUpdate) {
      return {
        ...location,
        contactPerson: {
          name: `${contactInfo.firstName} ${contactInfo.lastName}`,
          email: contactInfo.email,
          phone: contactInfo.phone
        }
      };
    }
    
    return location;
  });
};
