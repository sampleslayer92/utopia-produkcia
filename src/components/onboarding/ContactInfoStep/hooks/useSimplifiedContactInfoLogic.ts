
import { useState, useEffect, useRef } from "react";
import { OnboardingData } from "@/types/onboarding";
import { getAutoFillUpdatesSimplified, hasContactInfoChanged } from "../../utils/autoFillUtils";

export const useSimplifiedContactInfoLogic = (
  data: OnboardingData,
  updateData: (data: Partial<OnboardingData>) => void
) => {
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [hasAutoFilled, setHasAutoFilled] = useState(false);
  const prevContactInfoRef = useRef(data.contactInfo);

  const updateContactInfo = (field: string, value: string | boolean) => {
    updateData({
      contactInfo: {
        ...data.contactInfo,
        [field]: value
      }
    });
  };

  const handlePersonDataUpdate = (field: string, value: string) => {
    updateContactInfo(field, value);
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Check if basic contact info is complete
  const isBasicInfoComplete = () => {
    return data.contactInfo.firstName && 
           data.contactInfo.lastName && 
           data.contactInfo.email && 
           isEmailValid(data.contactInfo.email) &&
           data.contactInfo.phone;
  };

  // Auto-fill when basic info is complete using our simplified logic
  useEffect(() => {
    if (isBasicInfoComplete()) {
      const autoFillUpdates = getAutoFillUpdatesSimplified(data.contactInfo, data);
      if (Object.keys(autoFillUpdates).length > 0) {
        console.log('Auto-filling with simplified logic:', autoFillUpdates);
        updateData(autoFillUpdates);
        setHasAutoFilled(true);
      }
    }
  }, [data.contactInfo.firstName, data.contactInfo.lastName, data.contactInfo.email, data.contactInfo.phone, data.contactInfo.phonePrefix]);

  // Watch for changes in contact info and propagate to other sections
  useEffect(() => {
    const currentContactInfo = data.contactInfo;
    const prevContactInfo = prevContactInfoRef.current;

    // Only proceed if contact info has actually changed
    if (hasContactInfoChanged(prevContactInfo, currentContactInfo) && isBasicInfoComplete()) {
      console.log('Contact info changed, updating related sections...', {
        prev: prevContactInfo,
        current: currentContactInfo
      });

      const autoFillUpdates = getAutoFillUpdatesSimplified(currentContactInfo, data);
      if (Object.keys(autoFillUpdates).length > 0) {
        updateData(autoFillUpdates);
        setHasAutoFilled(true);
      }
    }

    // Update ref for next comparison
    prevContactInfoRef.current = currentContactInfo;
  }, [data.contactInfo.firstName, data.contactInfo.lastName, data.contactInfo.email, data.contactInfo.phone, data.contactInfo.phonePrefix]);

  // Track completed fields for visual feedback
  useEffect(() => {
    const newCompleted = new Set<string>();
    if (data.contactInfo.salutation) newCompleted.add('salutation');
    if (data.contactInfo.firstName) newCompleted.add('firstName');
    if (data.contactInfo.lastName) newCompleted.add('lastName');
    if (data.contactInfo.email && isEmailValid(data.contactInfo.email)) newCompleted.add('email');
    if (data.contactInfo.phone) newCompleted.add('phone');
    if (data.contactInfo.companyType) newCompleted.add('companyType');
    setCompletedFields(newCompleted);
  }, [data.contactInfo]);

  return {
    completedFields,
    hasAutoFilled,
    updateContactInfo,
    handlePersonDataUpdate,
    isBasicInfoComplete
  };
};
