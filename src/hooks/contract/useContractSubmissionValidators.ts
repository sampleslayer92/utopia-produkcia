
export const safeString = (value: string | undefined, defaultValue: string = '') => 
  value && value.trim() ? value : defaultValue;

export const safeEmail = (value: string | undefined) => 
  value && value.trim() && value.includes('@') ? value : 'test@test.sk';

export const validateRegistryType = (registryType: string | undefined): 'public' | 'business' | 'other' => {
  if (!registryType || registryType.trim() === '') {
    return 'other';
  }
  
  const normalized = registryType.trim().toLowerCase();
  if (normalized === 'public' || normalized === 'business' || normalized === 'other') {
    return normalized as 'public' | 'business' | 'other';
  }
  
  return 'other';
};

export const validateSalutation = (salutation: string | undefined): 'Pan' | 'Pani' | null => {
  if (!salutation || salutation.trim() === '') {
    return null;
  }
  
  const normalized = salutation.trim();
  if (normalized === 'Pan' || normalized === 'Pani') {
    return normalized as 'Pan' | 'Pani';
  }
  
  return null;
};

export const validateDocumentType = (documentType: string | undefined): 'OP' | 'Pas' => {
  if (!documentType || documentType.trim() === '') {
    return 'OP';
  }
  
  const normalized = documentType.trim();
  if (normalized === 'OP' || normalized === 'Pas') {
    return normalized as 'OP' | 'Pas';
  }
  
  return 'OP';
};

export const validateSeasonality = (seasonality: string | undefined): 'year-round' | 'seasonal' => {
  if (!seasonality || seasonality.trim() === '') {
    return 'year-round';
  }
  
  const normalized = seasonality.trim();
  if (normalized === 'year-round' || normalized === 'seasonal') {
    return normalized as 'year-round' | 'seasonal';
  }
  
  return 'year-round';
};
