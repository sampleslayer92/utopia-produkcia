
import { isBusinessLocationComplete } from './businessLocationValidation';

// Helper function to get nested object value
export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

export const isFieldComplete = (value: any, fieldPath: string): boolean => {
  if (value === null || value === undefined) return false;
  
  if (typeof value === 'string') {
    const trimmed = value.trim();
    
    // Special validation for email fields
    if (fieldPath.includes('email')) {
      return trimmed !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    }
    
    // Special validation for phone fields
    if (fieldPath.includes('phone')) {
      return trimmed !== '' && trimmed.length >= 9; // Minimum phone length
    }
    
    // Special validation for ICO/DIC
    if (fieldPath.includes('ico') || fieldPath.includes('dic')) {
      return trimmed !== '' && trimmed.length >= 6; // Minimum length for ICO/DIC
    }
    
    return trimmed !== '';
  }
  
  if (typeof value === 'boolean') {
    return true; // Booleans are always considered complete
  }
  
  if (typeof value === 'number') {
    return value >= 0;
  }
  
  if (Array.isArray(value)) {
    // For business locations, check if they have complete data
    if (fieldPath === 'businessLocations') {
      return value.length > 0 && value.every(location => isBusinessLocationComplete(location));
    }
    
    // For device selection, check if devices are properly configured
    if (fieldPath === 'deviceSelection.dynamicCards') {
      return value.length > 0 && value.every(device => device.count > 0 && device.name);
    }
    
    // For authorized persons and actual owners
    if (fieldPath === 'authorizedPersons' || fieldPath === 'actualOwners') {
      return value.length > 0 && value.every(person => 
        person.firstName?.trim() && 
        person.lastName?.trim() && 
        person.email?.trim() && 
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)
      );
    }
    
    return value.length > 0;
  }
  
  if (typeof value === 'object') {
    // For nested address objects
    if (fieldPath.includes('address')) {
      return value.street?.trim() && value.city?.trim() && value.zipCode?.trim();
    }
    
    // For contact person objects
    if (fieldPath.includes('contactPerson')) {
      return value.firstName?.trim() && 
             value.lastName?.trim() && 
             value.email?.trim() && 
             /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) &&
             value.phone?.trim();
    }
    
    // For fees objects
    if (fieldPath.includes('fees')) {
      return typeof value.regulatedCards === 'number' && 
             typeof value.unregulatedCards === 'number' &&
             value.regulatedCards >= 0 && 
             value.unregulatedCards >= 0;
    }
    
    // For consents objects
    if (fieldPath.includes('consents')) {
      return value.gdpr === true && value.terms === true;
    }
    
    return Object.keys(value).length > 0;
  }
  
  return false;
};
