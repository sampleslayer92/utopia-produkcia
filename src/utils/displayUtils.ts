
import { useTranslation } from 'react-i18next';

export const formatDisplayValue = (value: any, fallbackKey: string = 'contractActions.notSpecified'): string => {
  if (value === null || value === undefined || value === '' || value === 'null') {
    return fallbackKey;
  }
  return value;
};

export const useDisplayValue = () => {
  const { t } = useTranslation('admin');
  
  return (value: any, fallbackKey: string = 'contractActions.notSpecified'): string => {
    if (value === null || value === undefined || value === '' || value === 'null') {
      return t(fallbackKey);
    }
    return value;
  };
};

export const formatCurrencyValue = (value: any): number => {
  if (value === null || value === undefined || value === '' || value === 'null') {
    return 0;
  }
  return Number(value) || 0;
};

export const formatDateValue = (value: any): string | null => {
  if (value === null || value === undefined || value === '' || value === 'null') {
    return null;
  }
  return value;
};
