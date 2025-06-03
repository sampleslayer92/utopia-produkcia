
export const safeString = (value: string | undefined, defaultValue: string) => 
  value && value.trim() ? value : defaultValue;

export const safeEmail = (value: string | undefined) => 
  value && value.trim() && value.includes('@') ? value : 'test@test.sk';

export const validateRegistryType = (registryType: string) => {
  return registryType === 'public' || registryType === 'business' || registryType === 'other' 
    ? registryType 
    : 'other';
};
