
import { useState, useEffect, useRef, useCallback } from "react";
import { OnboardingData } from "@/types/onboarding";
import { 
  getAutoFillUpdates, 
  hasContactInfoChanged,
  requiresBusinessLocation,
  requiresActualOwner,
  requiresAuthorizedPerson,
  requiresTechnicalPerson
} from "../../utils/autoFillUtils";

export const useContactInfoLogic = (
  data: OnboardingData,
  updateData: (data: Partial<OnboardingData>) => void
) => {
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [hasAutoFilled, setHasAutoFilled] = useState(false);
  const [autoFillStatus, setAutoFillStatus] = useState<{
    actualOwners: boolean;
    authorizedPersons: boolean;
    businessLocations: boolean;
    companyInfo: boolean;
  }>({
    actualOwners: false,
    authorizedPersons: false,
    businessLocations: false,
    companyInfo: false
  });
  const prevContactInfoRef = useRef(data.contactInfo);

  // Memoize updateContactInfo to prevent unnecessary re-renders
  const updateContactInfo = useCallback((field: string, value: string | boolean | string[]) => {
    console.log('Updating contact info:', { field, value });
    updateData({
      contactInfo: {
        ...data.contactInfo,
        [field]: value
      }
    });
  }, [data.contactInfo, updateData]);

  const handlePersonDataUpdate = useCallback((field: string, value: string) => {
    updateContactInfo(field, value);
  }, [updateContactInfo]);

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Check if basic contact info is complete
  const isBasicInfoComplete = useCallback(() => {
    return data.contactInfo.firstName && 
           data.contactInfo.lastName && 
           data.contactInfo.email && 
           isEmailValid(data.contactInfo.email) &&
           data.contactInfo.phone;
  }, [data.contactInfo.firstName, data.contactInfo.lastName, data.contactInfo.email, data.contactInfo.phone]);

  // Separate auto-fill logic to prevent state updates during render
  const applyAutoFill = useCallback((roles: string[], contactInfo: OnboardingData['contactInfo']) => {
    if (!isBasicInfoComplete()) {
      console.log('Basic info not complete, skipping auto-fill');
      return;
    }

    const autoFillUpdates = getAutoFillUpdates(roles, contactInfo, data);
    if (Object.keys(autoFillUpdates).length > 0) {
      console.log('Applying auto-fill updates:', Object.keys(autoFillUpdates));
      updateData(autoFillUpdates);
      setHasAutoFilled(true);
      
      // Update auto-fill status
      setAutoFillStatus({
        actualOwners: requiresActualOwner(roles),
        authorizedPersons: requiresAuthorizedPerson(roles),
        businessLocations: requiresBusinessLocation(roles),
        companyInfo: requiresTechnicalPerson(roles)
      });
    }
  }, [data, updateData, isBasicInfoComplete]);

  // Handle roles change - prevent state updates during render
  const handleRolesChange = useCallback((roles: string[]) => {
    console.log('Roles changed to:', roles);
    
    // Update roles immediately
    updateContactInfo('userRoles', roles);
    
    // Also update the legacy userRole field for backward compatibility
    if (roles.length > 0) {
      updateContactInfo('userRole', roles[0]);
    } else {
      updateContactInfo('userRole', '');
    }

    // Schedule auto-fill for next tick to avoid state updates during render
    setTimeout(() => {
      applyAutoFill(roles, data.contactInfo);
    }, 0);
  }, [updateContactInfo, applyAutoFill, data.contactInfo]);

  // Auto-fill when roles and basic info are complete - use useEffect to avoid render issues
  useEffect(() => {
    const currentRoles = data.contactInfo.userRoles;
    if (currentRoles && currentRoles.length > 0 && isBasicInfoComplete()) {
      applyAutoFill(currentRoles, data.contactInfo);
    }
  }, [data.contactInfo.userRoles, data.contactInfo.firstName, data.contactInfo.lastName, data.contactInfo.email, data.contactInfo.phone, applyAutoFill, isBasicInfoComplete]);

  // Watch for changes in contact info and propagate to other sections
  useEffect(() => {
    const currentContactInfo = data.contactInfo;
    const prevContactInfo = prevContactInfoRef.current;

    // Only proceed if contact info has actually changed and user has roles
    if (hasContactInfoChanged(prevContactInfo, currentContactInfo) && 
        currentContactInfo.userRoles && 
        currentContactInfo.userRoles.length > 0 &&
        isBasicInfoComplete()) {
      
      console.log('Contact info changed, updating related sections...', {
        prev: prevContactInfo,
        current: currentContactInfo,
        roles: currentContactInfo.userRoles
      });

      applyAutoFill(currentContactInfo.userRoles, currentContactInfo);
    }

    // Update ref for next comparison
    prevContactInfoRef.current = currentContactInfo;
  }, [data.contactInfo.firstName, data.contactInfo.lastName, data.contactInfo.email, data.contactInfo.phone, data.contactInfo.phonePrefix, applyAutoFill, isBasicInfoComplete]);

  // Track completed fields for visual feedback
  useEffect(() => {
    const newCompleted = new Set<string>();
    if (data.contactInfo.salutation) newCompleted.add('salutation');
    if (data.contactInfo.firstName) newCompleted.add('firstName');
    if (data.contactInfo.lastName) newCompleted.add('lastName');
    if (data.contactInfo.email && isEmailValid(data.contactInfo.email)) newCompleted.add('email');
    if (data.contactInfo.phone) newCompleted.add('phone');
    if (data.contactInfo.companyType) newCompleted.add('companyType');
    if (data.contactInfo.userRoles && data.contactInfo.userRoles.length > 0) newCompleted.add('userRoles');
    setCompletedFields(newCompleted);
  }, [data.contactInfo]);

  return {
    completedFields,
    hasAutoFilled,
    autoFillStatus,
    updateContactInfo,
    handlePersonDataUpdate,
    handleRolesChange,
    isBasicInfoComplete
  };
};
