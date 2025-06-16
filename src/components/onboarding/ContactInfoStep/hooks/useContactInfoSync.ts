
import { useEffect } from 'react';
import { usePersonDataSync } from '../../hooks/usePersonDataSync';
import { OnboardingData } from '@/types/onboarding';
import { v4 as uuidv4 } from 'uuid';

interface ContactInfoSyncOptions {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const useContactInfoSync = ({ data, updateData }: ContactInfoSyncOptions) => {
  const personSync = usePersonDataSync({ data, updateData, enableSync: true });

  // Generate stable person ID if not exists
  useEffect(() => {
    if (!data.contactInfo.personId && data.contactInfo.firstName && data.contactInfo.lastName) {
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

  return {
    updateContactInfo,
    ...personSync
  };
};
