
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import { BankAccount } from "@/types/onboarding";

interface BankAccountsSectionProps {
  bankAccounts: BankAccount[];
  onUpdate: (accounts: BankAccount[]) => void;
}

const BankAccountsSection = ({ bankAccounts, onUpdate }: BankAccountsSectionProps) => {
  const { t } = useTranslation();

  const addBankAccount = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      format: 'IBAN',
      iban: '',
      mena: 'EUR'
    };
    onUpdate([...bankAccounts, newAccount]);
  };

  const removeBankAccount = (id: string) => {
    onUpdate(bankAccounts.filter(account => account.id !== id));
  };

  const updateBankAccount = (id: string, field: keyof BankAccount, value: any) => {
    onUpdate(bankAccounts.map(account =>
      account.id === id ? { ...account, [field]: value } : account
    ));
  };

  const formatOptions = [
    { value: 'IBAN', label: t('ui.bankAccounts.iban') },
    { value: 'AccountNumber', label: t('ui.bankAccounts.accountNumber') }
  ];

  const currencyOptions = [
    { value: 'EUR', label: 'EUR' },
    { value: 'CZK', label: 'CZK' },
    { value: 'USD', label: 'USD' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          {t('ui.bankAccounts.title')}
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addBankAccount}
          className="text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          {t('ui.bankAccounts.addAccount')}
        </Button>
      </div>

      {bankAccounts.map((account, index) => (
        <div key={account.id} className="border border-slate-200 rounded-lg p-4 space-y-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              {t('common.account')} {index + 1}
            </span>
            {bankAccounts.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeBankAccount(account.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OnboardingSelect
              label={t('ui.bankAccounts.accountFormat')}
              value={account.format}
              onValueChange={(value) => updateBankAccount(account.id, 'format', value)}
              options={formatOptions}
            />

            <OnboardingInput
              label={account.format === 'IBAN' ? t('ui.bankAccounts.iban') : t('ui.bankAccounts.accountNumber')}
              value={account.iban}
              onChange={(e) => updateBankAccount(account.id, 'iban', e.target.value)}
              placeholder={account.format === 'IBAN' ? 'SK89 0000 0000 0000 0000 0000' : '123456789/0000'}
            />

            <OnboardingSelect
              label={t('ui.bankAccounts.currency')}
              value={account.mena}
              onValueChange={(value) => updateBankAccount(account.id, 'mena', value)}
              options={currencyOptions}
            />
          </div>

          {account.format === 'AccountNumber' && (
            <OnboardingInput
              label={t('ui.bankAccounts.bank')}
              value={account.banka || ''}
              onChange={(e) => updateBankAccount(account.id, 'banka', e.target.value)}
              placeholder="Slovenská sporiteľňa"
            />
          )}
        </div>
      ))}

      {bankAccounts.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
          <CreditCard className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500 mb-4">Zatiaľ žiadne bankové účty</p>
          <Button
            type="button"
            variant="outline"
            onClick={addBankAccount}
            className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('ui.bankAccounts.addAccount')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BankAccountsSection;
