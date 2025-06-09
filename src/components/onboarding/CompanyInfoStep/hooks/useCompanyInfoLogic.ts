
import { useState, useCallback } from 'react';
import { OnboardingData } from '@/types/onboarding';

export const useCompanyInfoLogic = (
  data: OnboardingData,
  updateData: (data: Partial<OnboardingData>) => void
) => {
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());

  const updateCompanyInfo = useCallback((field: string, value: any) => {
    const fieldPath = field.split('.');
    
    if (fieldPath.length > 1) {
      // Handle nested fields like "address.street"
      const [section, subField] = fieldPath;
      const currentCompanyInfo = data.companyInfo || {};
      const currentSection = currentCompanyInfo[section as keyof typeof currentCompanyInfo] || {};
      
      updateData({
        companyInfo: {
          ...currentCompanyInfo,
          [section]: {
            ...currentSection,
            [subField]: value
          }
        }
      });
    } else {
      // Handle direct fields
      updateData({
        companyInfo: {
          ...(data.companyInfo || {}),
          [field]: value
        }
      });
    }
  }, [data.companyInfo, updateData]);

  const handleORSRData = useCallback((orsrData: any) => {
    if (orsrData) {
      // Auto-fill company data from ORSR
      const updatedFields = new Set<string>();
      
      if (orsrData.companyName) {
        updateCompanyInfo('companyName', orsrData.companyName);
        updatedFields.add('companyName');
      }
      
      if (orsrData.address) {
        updateCompanyInfo('address', orsrData.address);
        updatedFields.add('address');
      }
      
      setAutoFilledFields(prev => new Set([...prev, ...updatedFields]));
    }
  }, [updateCompanyInfo]);

  return {
    updateCompanyInfo,
    autoFilledFields,
    setAutoFilledFields,
    handleORSRData
  };
};
