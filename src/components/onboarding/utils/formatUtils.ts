
// Utility functions for formatting IBAN and currency values

export const formatIBAN = (value: string): string => {
  // Remove all non-alphanumeric characters
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  // Don't format if empty or too short
  if (cleaned.length === 0) {
    return '';
  }
  
  // Add spaces every 4 characters for real-time formatting
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

export const validateIBAN = (iban: string): boolean => {
  // Basic IBAN validation - remove spaces and check length
  const cleaned = iban.replace(/\s/g, '');
  
  // Slovak IBAN should be 24 characters (SK + 22 digits)
  if (cleaned.length !== 24 || !cleaned.startsWith('SK')) {
    return false;
  }
  
  return /^SK\d{22}$/.test(cleaned);
};

export const formatCurrencyInput = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.,]/g, '');
  
  // Replace comma with dot for decimal separator
  const normalized = cleaned.replace(',', '.');
  
  // Parse as number and format
  const num = parseFloat(normalized);
  if (isNaN(num)) return '';
  
  // Format with thousands separators and 2 decimal places
  return new Intl.NumberFormat('sk-SK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatTurnoverInput = (value: string): string => {
  // Remove all non-numeric characters
  const cleaned = value.replace(/[^0-9]/g, '');
  
  if (cleaned === '') return '';
  
  // Parse as number
  const num = parseInt(cleaned, 10);
  if (isNaN(num)) return '';
  
  // Format with commas for thousands and add € symbol
  return `${num.toLocaleString('en-US')} €`;
};

export const parseTurnoverInput = (formattedValue: string): number => {
  // Remove all formatting (commas, €, spaces) and parse as number
  const cleaned = formattedValue.replace(/[^\d]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : num;
};

export const parseCurrencyInput = (formattedValue: string): number => {
  // Remove all formatting and parse as number
  const cleaned = formattedValue.replace(/[^\d.,]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export const formatCurrencyDisplay = (amount: number): string => {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
