
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, CreditCard } from "lucide-react";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import { BankAccount } from "@/types/onboarding";
import { formatIBAN, validateIBAN } from "../utils/formatUtils";

interface BankAccountsSectionProps {
  bankAccounts: BankAccount[];
  onUpdateBankAccounts: (accounts: BankAccount[]) => void;
}

const BankAccountsSection = ({ bankAccounts, onUpdateBankAccounts }: BankAccountsSectionProps) => {
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);

  const currencyOptions = [
    { value: "EUR", label: "EUR" },
    { value: "CZK", label: "CZK" },
    { value: "USD", label: "USD" }
  ];

  const formatOptions = [
    { value: "IBAN", label: "IBAN" },
    { value: "CisloUctuKodBanky", label: "Číslo účtu / Kód banky" }
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
        
        // Clear fields based on format selection
        if (field === 'format') {
          if (value === 'IBAN') {
            updatedAccount.cisloUctu = '';
            updatedAccount.kodBanky = '';
          } else {
            updatedAccount.iban = '';
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
    
    // Store the raw value directly without immediate formatting to avoid cursor jumping
    updateBankAccount(id, 'iban', rawValue);
  };

  const handleIBANBlur = (id: string, e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('=== IBAN BLUR ===', { id, value });
    
    // Format IBAN only on blur to avoid cursor issues
    const formattedValue = formatIBAN(value);
    console.log('=== FORMATTED IBAN ON BLUR ===', formattedValue);
    
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
      message: isValid ? '' : 'Neplatný IBAN formát'
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Bankové účty
        </h4>
        <Button
          onClick={addBankAccount}
          variant="outline"
          size="sm"
          className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Pridať účet
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
                    Bankový účet {index + 1}
                  </h5>
                  <p className="text-xs text-slate-500">
                    {account.format === 'IBAN' ? account.iban || 'IBAN nezadaný' : 
                     `${account.cisloUctu || ''}${account.cisloUctu && account.kodBanky ? '/' : ''}${account.kodBanky || ''}` || 'Účet nezadaný'} 
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
                      label="Formát účtu *"
                      value={account.format}
                      onValueChange={(value) => updateBankAccount(account.id, 'format', value)}
                      options={formatOptions}
                    />
                    
                    <OnboardingSelect
                      label="Mena *"
                      value={account.mena}
                      onValueChange={(value) => updateBankAccount(account.id, 'mena', value)}
                      options={currencyOptions}
                    />
                  </div>

                  {account.format === 'IBAN' ? (
                    <div>
                      <OnboardingInput
                        label="IBAN *"
                        value={account.iban || ''}
                        onChange={(e) => handleIBANChange(account.id, e)}
                        onBlur={(e) => handleIBANBlur(account.id, e)}
                        placeholder="SK89 1200 0000 1987 4263 7541"
                        maxLength={29} // Maximum IBAN length with spaces
                      />
                      {!ibanValidation.isValid && account.iban && (
                        <p className="text-xs text-red-600 mt-1">{ibanValidation.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <OnboardingInput
                        label="Číslo účtu *"
                        value={account.cisloUctu || ''}
                        onChange={(e) => updateBankAccount(account.id, 'cisloUctu', e.target.value)}
                        placeholder="1234567890"
                      />
                      <OnboardingInput
                        label="Kód banky *"
                        value={account.kodBanky || ''}
                        onChange={(e) => updateBankAccount(account.id, 'kodBanky', e.target.value)}
                        placeholder="1200"
                      />
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
          * Minimálne jeden bankový účet musí byť zadaný
        </p>
      )}
    </div>
  );
};

export default BankAccountsSection;
