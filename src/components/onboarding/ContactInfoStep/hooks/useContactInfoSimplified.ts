
import { useState, useEffect, useCallback } from 'react';
import { OnboardingData } from '@/types/onboarding';

export const useContactInfoSimplified = (data: OnboardingData, updateData: (data: Partial<OnboardingData>) => void) => {
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());

  // Track which fields are completed
  useEffect(() => {
    const completed = new Set<string>();
    
    if (data.contactInfo.firstName) completed.add('firstName');
    if (data.contactInfo.lastName) completed.add('lastName');
    if (data.contactInfo.email) completed.add('email');
    if (data.contactInfo.phone) completed.add('phone');
    if (data.contactInfo.companyType) completed.add('companyType');
    
    setCompletedFields(completed);
  }, [data.contactInfo]);

  // Check if basic info is complete for auto-filling
  const isBasicInfoComplete = useCallback(() => {
    return Boolean(
      data.contactInfo.firstName && 
      data.contactInfo.lastName && 
      data.contactInfo.email && 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactInfo.email) &&
      data.contactInfo.phone &&
      data.contactInfo.companyType
    );
  }, [data.contactInfo]);

  // Update contact info
  const updateContactInfo = useCallback((field: string, value: string) => {
    console.log(`Updating contact info: ${field} = ${value}`);
    
    updateData({
      contactInfo: {
        ...data.contactInfo,
        [field]: value
      }
    });
    
    // Force save to localStorage for critical fields
    if (['firstName', 'lastName', 'email', 'phone'].includes(field)) {
      setTimeout(() => {
        try {
          const currentData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
          currentData.contactInfo = { ...currentData.contactInfo, [field]: value };
          localStorage.setItem('onboardingData', JSON.stringify(currentData));
          console.log(`Contact info ${field} saved to localStorage`);
        } catch (error) {
          console.error('Error saving contact info to localStorage:', error);
        }
      }, 100);
    }
  }, [data.contactInfo, updateData]);

  // Handle person data update (for compatibility with PersonInputGroup)
  const handlePersonDataUpdate = useCallback((field: string, value: string) => {
    if (field === 'phonePrefix') {
      updateContactInfo('phonePrefix', value);
    } else {
      updateContactInfo(field, value);
    }
  }, [updateContactInfo]);

  return {
    completedFields,
    isBasicInfoComplete: isBasicInfoComplete(),
    updateContactInfo,
    handlePersonDataUpdate
  };
};
