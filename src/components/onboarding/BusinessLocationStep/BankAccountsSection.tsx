
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import { BankAccount } from "@/types/onboarding";
import { formatIBAN, validateIBAN, convertIbanToAccountNumber, convertAccountNumberToIban } from "../utils/formatUtils";
import BankSelect from "../ui/BankSelect";

interface BankAccountsSectionProps {
  bankAccounts: BankAccount[];
  onUpdateBankAccounts: (accounts: BankAccount[]) => void;
}

const BankAccountsSection = ({ bankAccounts, onUpdateBankAccounts }: BankAccountsSectionProps) => {
  const { t } = useTranslation('forms');
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);

  const currencyOptions = [
    { value: "EUR", label: t('businessLocation.bankAccounts.currencyOptions.eur') },
    { value: "CZK", label: t('businessLocation.bankAccounts.currencyOptions.czk') },
    { value: "USD", label: t('businessLocation.bankAccounts.currencyOptions.usd') }
  ];

  const formatOptions = [
    { value: "IBAN", label: t('businessLocation.bankAccounts.formatOptions.iban') },
    { value: "CisloUctuKodBanky", label: t('businessLocation.bankAccounts.formatOptions.accountNumber') }
  ];

  const addBankAccount = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      format: "IBAN",
      iban: "",
      mena: "EUR"
    };
    onUpdateBankAccounts([...bankAccounts, newAccount]);
    setExpandedAccountId(newAccount.id);
  };

  const removeBankAccount = (id: string) => {
    if (bankAccounts.length > 1) {
      const updated = bankAccounts.filter(account => account.id !== id);
      onUpdateBankAccounts(updated);
      if (expandedAccountId === id) {
        setExpandedAccountId(null);
      }
    }
  };

  const updateBankAccount = (id: string, field: keyof BankAccount, value: any) => {
    console.log('=== BANK ACCOUNT UPDATE ===', { id, field, value });
    const updated = bankAccounts.map(account => {
      if (account.id === id) {
        const updatedAccount = { ...account, [field]: value };
        
        // Handle format conversion when format changes
        if (field === 'format') {
          if (value === 'IBAN' && account.cisloUctu && account.kodBanky) {
            // Convert from account number to IBAN
            const convertedIban = convertAccountNumberToIban(account.cisloUctu, account.kodBanky);
            if (convertedIban) {
              updatedAccount.iban = convertedIban;
            }
            // Clear account number and bank code fields
            updatedAccount.cisloUctu = '';
            updatedAccount.kodBanky = '';
          } else if (value === 'CisloUctuKodBanky' && account.iban) {
            // Convert from IBAN to account number
            const convertedAccount = convertIbanToAccountNumber(account.iban);
            if (convertedAccount) {
              updatedAccount.cisloUctu = convertedAccount.cisloUctu;
              updatedAccount.kodBanky = convertedAccount.kodBanky;
            }
            // Clear IBAN field
            updatedAccount.iban = '';
          } else {
            // No conversion possible, just clear opposite fields
            if (value === 'IBAN') {
              updatedAccount.cisloUctu = '';
              updatedAccount.kodBanky = '';
            } else {
              updatedAccount.iban = '';
            }
          }
        }
        
        console.log('=== UPDATED ACCOUNT ===', updatedAccount);
        return updatedAccount;
      }
      return account;
    });
    console.log('=== ALL ACCOUNTS AFTER UPDATE ===', updated);
    onUpdateBankAccounts(updated);
  };

  const handleIBANChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    console.log('=== IBAN INPUT CHANGE ===', { id, rawValue });
    
    // Format IBAN in real-time while typing
    const formattedValue = formatIBAN(rawValue);
    console.log('=== REAL-TIME FORMATTED IBAN ===', formattedValue);
    
    updateBankAccount(id, 'iban', formattedValue);
  };

  const toggleAccount = (id: string) => {
    setExpandedAccountId(expandedAccountId === id ? null : id);
  };

  const getIBANValidationStatus = (iban: string): { isValid: boolean; message: string } => {
    if (!iban) return { isValid: true, message: '' };
    
    const isValid = validateIBAN(iban);
    return {
      isValid,
      message: isValid ? '' : t('businessLocation.bankAccounts.ibanInvalid')
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          {t('businessLocation.bankAccounts.title')}
        </h4>
        <Button
          onClick={addBankAccount}
          variant="outline"
          size="sm"
          className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('businessLocation.bankAccounts.addButton')}
        </Button>
      </div>

      {bankAccounts.map((account, index) => {
        const ibanValidation = getIBANValidationStatus(account.iban || '');
        
        return (
          <div key={account.id} className="border border-slate-200 rounded-lg bg-white shadow-sm">
            <div 
              onClick={() => toggleAccount(account.id)}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 ${
                expandedAccountId === account.id ? 'bg-slate-50 border-b border-slate-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-slate-900">
                    {t('businessLocation.bankAccounts.accountTitle')} {index + 1}
                  </h5>
                  <p className="text-xs text-slate-500">
                    {account.format === 'IBAN' ? 
                      account.iban || t('businessLocation.bankAccounts.accountNotSet') : 
                      `${account.cisloUctu || ''}${account.cisloUctu && account.kodBanky ? '/' : ''}${account.kodBanky || ''}` || 
                      t('businessLocation.bankAccounts.accountNumberNotSet')} 
                    • {account.mena}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBankAccount(account.id);
                  }}
                  disabled={bankAccounts.length === 1}
                  className={`p-2 rounded-full transition-colors mr-2 ${
                    bankAccounts.length === 1 
                      ? 'text-slate-300 cursor-not-allowed' 
                      : 'hover:bg-red-50 text-red-600'
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="w-6 text-slate-400 transition-transform duration-200 transform">
                  {expandedAccountId === account.id ? '▲' : '▼'}
                </div>
              </div>
            </div>

            {expandedAccountId === account.id && (
              <div className="p-4 animate-fade-in">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <OnboardingSelect
                      label={t('businessLocation.bankAccounts.formatRequired')}
                      value={account.format}
                      onValueChange={(value) => updateBankAccount(account.id, 'format', value)}
                      options={formatOptions}
                    />
                    
                    <OnboardingSelect
                      label={t('businessLocation.bankAccounts.currencyRequired')}
                      value={account.mena}
                      onValueChange={(value) => updateBankAccount(account.id, 'mena', value)}
                      options={currencyOptions}
                    />
                  </div>

                  {account.format === 'IBAN' ? (
                    <div>
                      <OnboardingInput
                        label={t('businessLocation.bankAccounts.ibanRequired')}
                        value={account.iban || ''}
                        onChange={(e) => handleIBANChange(account.id, e)}
                        placeholder={t('businessLocation.bankAccounts.ibanPlaceholder')}
                        maxLength={29} // Maximum IBAN length with spaces
                      />
                      {!ibanValidation.isValid && account.iban && (
                        <p className="text-xs text-red-600 mt-1">{ibanValidation.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <OnboardingInput
                        label={t('businessLocation.bankAccounts.accountNumberRequired')}
                        value={account.cisloUctu || ''}
                        onChange={(e) => updateBankAccount(account.id, 'cisloUctu', e.target.value)}
                        placeholder={t('businessLocation.bankAccounts.accountNumberPlaceholder')}
                      />
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {t('businessLocation.bankAccounts.bankCodeRequired')}
                        </label>
                        <BankSelect
                          value={account.kodBanky || ''}
                          onValueChange={(value) => updateBankAccount(account.id, 'kodBanky', value)}
                          placeholder={t('businessLocation.bankAccounts.bankCodePlaceholder')}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {bankAccounts.length === 1 && (
        <p className="text-xs text-slate-500 italic">
          {t('businessLocation.bankAccounts.minimumAccountNote')}
        </p>
      )}
    </div>
  );
};

export default BankAccountsSection;
