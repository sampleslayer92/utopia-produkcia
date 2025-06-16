
import { usePersonDataSync } from '../../hooks/usePersonDataSync';
import { OnboardingData } from '@/types/onboarding';

interface ContactInfoSyncOptions {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const useContactInfoSync = ({ data, updateData }: ContactInfoSyncOptions) => {
  const personSync = usePersonDataSync({ data, updateData, enableSync: true });

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
