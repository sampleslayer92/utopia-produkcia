
import { useState, useEffect, useRef } from "react";
import { OnboardingData } from "@/types/onboarding";
import { getAutoFillUpdatesSimplified } from "../../utils/autoFillUtils";

export const useSimplifiedContactInfoLogic = (
  data: OnboardingData,
  updateData: (data: Partial<OnboardingData>) => void
) => {
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [hasAutoFilled, setHasAutoFilled] = useState(false);
  const hasTriggeredAutoFillRef = useRef(false);

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

  // Manual auto-fill function that can be triggered on navigation
  const triggerAutoFill = () => {
    if (isBasicInfoComplete() && !hasTriggeredAutoFillRef.current) {
      const autoFillUpdates = getAutoFillUpdatesSimplified(data.contactInfo, data);
      if (Object.keys(autoFillUpdates).length > 0) {
        console.log('Auto-filling with simplified logic on navigation:', autoFillUpdates);
        updateData(autoFillUpdates);
        setHasAutoFilled(true);
        hasTriggeredAutoFillRef.current = true;
      }
    }
  };

  // Track completed fields for visual feedback
  useEffect(() => {
    const newCompleted = new Set<string>();
    if (data.contactInfo.salutation) newCompleted.add('salutation');
    if (data.contactInfo.firstName) newCompleted.add('firstName');
    if (data.contactInfo.lastName) newCompleted.add('lastName');
    if (data.contactInfo.email && isEmailValid(data.contactInfo.email)) newCompleted.add('email');
    if (data.contactInfo.phone) newCompleted.add('phone');
    setCompletedFields(newCompleted);
  }, [data.contactInfo]);

  return {
    completedFields,
    hasAutoFilled,
    updateContactInfo,
    handlePersonDataUpdate,
    isBasicInfoComplete,
    triggerAutoFill
  };
};
