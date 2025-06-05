
import { OnboardingData } from "@/types/onboarding";

export const shouldAutoFillBasedOnRole = (role: string, contactInfo: OnboardingData['contactInfo']) => {
  return role && 
         contactInfo.firstName && 
         contactInfo.lastName && 
         contactInfo.email && 
         contactInfo.phone &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email);
};

// Helper function to check if contact info has changed significantly
export const hasContactInfoChanged = (
  prev: OnboardingData['contactInfo'], 
  current: OnboardingData['contactInfo']
) => {
  return prev.firstName !== current.firstName ||
         prev.lastName !== current.lastName ||
         prev.email !== current.email ||
         prev.phone !== current.phone ||
         prev.phonePrefix !== current.phonePrefix;
};

// Helper function to format phone number consistently
export const formatPhoneForDisplay = (phone: string, prefix: string = '+421') => {
  if (!phone) return '';
  
  // Remove any existing formatting
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on prefix
  if (prefix === '+421' || prefix === '+420') {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').slice(0, 11);
  }
  return cleaned.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1 $2 $3').slice(0, 13);
};

// Helper functions to check role requirements
export const requiresBusinessLocation = (role: string) => {
  return role === 'Kontaktná osoba na prevádzku' || role === 'Konateľ';
};

export const requiresActualOwner = (role: string) => {
  return role === 'Majiteľ';
};

export const requiresAuthorizedPerson = (role: string) => {
  return role === 'Konateľ';
};

export const requiresTechnicalPerson = (role: string) => {
  return role === 'Kontaktná osoba pre technické záležitosti' || role === 'Konateľ';
};
