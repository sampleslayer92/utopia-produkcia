
import { useState, useEffect, useRef } from "react";
import { OnboardingData } from "@/types/onboarding";
import { 
  getAutoFillUpdates, 
  hasContactInfoChanged,
  requiresBusinessLocation,
  requiresActualOwner,
  requiresAuthorizedPerson
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

  const updateContactInfo = (field: string, value: string | boolean | string[]) => {
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

  // Handle roles change with improved auto-fill logic
  const handleRolesChange = (roles: string[]) => {
    console.log('Roles changed to:', roles);
    updateContactInfo('userRoles', roles);
    
    // Also update the legacy userRole field for backward compatibility
    if (roles.length > 0) {
      updateContactInfo('userRole', roles[0]);
    } else {
      updateContactInfo('userRole', '');
    }

    // Apply auto-fill logic immediately if basic info is complete
    if (isBasicInfoComplete()) {
      const autoFillUpdates = getAutoFillUpdates(data.contactInfo, data);
      if (Object.keys(autoFillUpdates).length > 0) {
        console.log('Applying auto-fill updates:', autoFillUpdates);
        updateData(autoFillUpdates);
        setHasAutoFilled(true);
        
        // Update auto-fill status
        setAutoFillStatus({
          actualOwners: requiresActualOwner(roles),
          authorizedPersons: requiresAuthorizedPerson(roles),
          businessLocations: requiresBusinessLocation(roles),
          companyInfo: roles.includes('Kontaktná osoba pre technické záležitosti')
        });
      }
    }
  };

  // Auto-fill when roles and basic info are complete
  useEffect(() => {
    if (data.contactInfo.userRoles && data.contactInfo.userRoles.length > 0 && isBasicInfoComplete()) {
      const autoFillUpdates = getAutoFillUpdates(data.contactInfo, data);
      if (Object.keys(autoFillUpdates).length > 0) {
        console.log('Auto-filling from useEffect:', autoFillUpdates);
        updateData(autoFillUpdates);
        setHasAutoFilled(true);
        
        // Update auto-fill status
        const roles = data.contactInfo.userRoles;
        setAutoFillStatus({
          actualOwners: requiresActualOwner(roles),
          authorizedPersons: requiresAuthorizedPerson(roles),
          businessLocations: requiresBusinessLocation(roles),
          companyInfo: roles.includes('Kontaktná osoba pre technické záležitosti')
        });
      }
    }
  }, [data.contactInfo.userRoles, data.contactInfo.firstName, data.contactInfo.lastName, data.contactInfo.email, data.contactInfo.phone]);

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

      const autoFillUpdates = getAutoFillUpdates(currentContactInfo, data);
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
