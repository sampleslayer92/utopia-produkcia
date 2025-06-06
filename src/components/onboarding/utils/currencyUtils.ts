
// Re-export formatting functions for backward compatibility
export { formatCurrencyDisplay as formatCurrency, formatCurrencyInput, parseCurrencyInput } from './formatUtils';

export const formatCurrencyWithColor = (amount: number): { 
  value: string; 
  className: string 
} => {
  return {
    value: new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount),
    className: amount < 0 ? 'text-red-600' : ''
  };
};

export const formatPercentage = (percent: number): string => {
  return percent.toFixed(2) + ' %';
};
