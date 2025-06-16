
import { useEffect } from 'react';
import { usePersonDataSync } from '../../hooks/usePersonDataSync';
import { OnboardingData } from '@/types/onboarding';
import { v4 as uuidv4 } from 'uuid';

interface ContactInfoSyncOptions {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const useContactInfoSync = ({ data, updateData }: ContactInfoSyncOptions) => {
  const personSync = usePersonDataSync({ 
    data, 
    updateData, 
    enableSync: true,
    triggerMode: 'onNavigate' // Consistent with ActualOwnersStep
  });

  // Generate stable person ID only once when both first and last name are available
  useEffect(() => {
    if (!data.contactInfo.personId && 
        data.contactInfo.firstName && 
        data.contactInfo.lastName && 
        data.contactInfo.firstName.trim() !== '' && 
        data.contactInfo.lastName.trim() !== '') {
      const personId = uuidv4();
      updateData({
        contactInfo: {
          ...data.contactInfo,
          personId
        }
      });
    }
  }, [data.contactInfo.firstName, data.contactInfo.lastName, data.contactInfo.personId, updateData]);

  const updateContactInfo = (field: string, value: string) => {
    updateData({
      contactInfo: {
        ...data.contactInfo,
        [field]: value
      }
    });
  };

  const triggerSync = () => {
    personSync.performManualSync();
  };

  return {
    updateContactInfo,
    triggerSync,
    ...personSync
  };
};
