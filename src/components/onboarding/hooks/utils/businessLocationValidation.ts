
export const isBusinessLocationComplete = (location: any): boolean => {
  if (!location) return false;
  
  // Check if required fields are actually filled, not just defaults
  const hasName = location.name?.trim() && location.name !== '';
  
  const hasValidAddress = location.address?.street?.trim() && 
                         location.address?.city?.trim() && 
                         location.address?.zipCode && String(location.address.zipCode).trim();
                         
  // Fixed: Check firstName and lastName instead of name, and made phone optional
  const hasValidContactPerson = location.contactPerson?.firstName?.trim() && 
                               location.contactPerson?.lastName?.trim() &&
                               location.contactPerson?.email?.trim() &&
                               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(location.contactPerson.email);
                          
  // Fixed: Made mena field optional and simplified bank account validation
  const hasValidBankAccounts = location.bankAccounts && 
                              location.bankAccounts.length > 0 && 
                              location.bankAccounts.every((account: any) => 
                                account.iban?.trim() && account.iban !== ''
                              );
  
  const hasBusinessSubject = location.businessSubject?.trim() && location.businessSubject !== '';
  
  const hasMonthlyTurnover = typeof location.monthlyTurnover === 'number' && location.monthlyTurnover > 0;
  
  const hasAverageTransaction = typeof location.averageTransaction === 'number' && location.averageTransaction > 0;
  
  return hasName && hasValidAddress && hasValidContactPerson && hasValidBankAccounts && 
         hasBusinessSubject && hasMonthlyTurnover && hasAverageTransaction;
};
