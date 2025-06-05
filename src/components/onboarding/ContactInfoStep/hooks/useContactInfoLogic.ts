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
  const applyAutoFill = useCallback((role: string, contactInfo: OnboardingData['contactInfo']) => {
    if (!isBasicInfoComplete()) {
      console.log('Basic info not complete, skipping auto-fill');
      return;
    }

    const autoFillUpdates = getAutoFillUpdates(role, contactInfo, data);
    if (Object.keys(autoFillUpdates).length > 0) {
      console.log('Applying auto-fill updates:', Object.keys(autoFillUpdates));
      updateData(autoFillUpdates);
      setHasAutoFilled(true);
      
      // Update auto-fill status
      setAutoFillStatus({
        actualOwners: requiresActualOwner(role),
        authorizedPersons: requiresAuthorizedPerson(role),
        businessLocations: requiresBusinessLocation(role),
        companyInfo: requiresTechnicalPerson(role)
      });
    }
  }, [data, updateData, isBasicInfoComplete]);

  // Handle roles change - prevent state updates during render
  const handleRolesChange = useCallback((roles: string[]) => {
    console.log('Roles changed to:', roles);
    
    // Update roles immediately (keep array for backward compatibility)
    updateContactInfo('userRoles', roles);
    
    // Also update the legacy userRole field for backward compatibility
    const selectedRole = roles.length > 0 ? roles[0] : '';
    updateContactInfo('userRole', selectedRole);

    // Schedule auto-fill for next tick to avoid state updates during render
    setTimeout(() => {
      applyAutoFill(selectedRole, data.contactInfo);
    }, 0);
  }, [updateContactInfo, applyAutoFill, data.contactInfo]);

  // Auto-fill when role and basic info are complete - use useEffect to avoid render issues
  useEffect(() => {
    const currentRoles = data.contactInfo.userRoles;
    const currentRole = currentRoles && currentRoles.length > 0 ? currentRoles[0] : '';
    if (currentRole && isBasicInfoComplete()) {
      applyAutoFill(currentRole, data.contactInfo);
    }
  }, [data.contactInfo.userRoles, data.contactInfo.firstName, data.contactInfo.lastName, data.contactInfo.email, data.contactInfo.phone, applyAutoFill, isBasicInfoComplete]);

  // Watch for changes in contact info and propagate to other sections
  useEffect(() => {
    const currentContactInfo = data.contactInfo;
    const prevContactInfo = prevContactInfoRef.current;

    // Only proceed if contact info has actually changed and user has a role
    if (hasContactInfoChanged(prevContactInfo, currentContactInfo) && 
        currentContactInfo.userRoles && 
        currentContactInfo.userRoles.length > 0 &&
        isBasicInfoComplete()) {
      
      const currentRole = currentContactInfo.userRoles[0];
      console.log('Contact info changed, updating related sections...', {
        prev: prevContactInfo,
        current: currentContactInfo,
        role: currentRole
      });

      applyAutoFill(currentRole, currentContactInfo);
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
