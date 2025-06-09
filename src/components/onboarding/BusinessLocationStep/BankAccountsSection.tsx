
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import { BankAccount } from "@/types/onboarding";

interface BankAccountsSectionProps {
  bankAccounts: BankAccount[];
  onUpdateBankAccounts: (accounts: BankAccount[]) => void;
}

const BankAccountsSection = ({
  bankAccounts,
  onUpdateBankAccounts
}: BankAccountsSectionProps) => {
  const { t } = useTranslation();

  const accountTypeOptions = [
    { value: "IBAN", label: t('businessLocation.bankAccounts.types.iban') },
    { value: "CisloUctuKodBanky", label: t('businessLocation.bankAccounts.types.accountNumber') }
  ];

  const onUpdateBankAccount = (index: number, field: keyof BankAccount, value: string) => {
    const updatedAccounts = bankAccounts.map((account, i) => {
      if (i === index) {
        return { ...account, [field]: value };
      }
      return account;
    });
    onUpdateBankAccounts(updatedAccounts);
  };

  const onAddBankAccount = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      typ: 'IBAN',
      iban: '',
      mena: 'EUR'
    };
    onUpdateBankAccounts([...bankAccounts, newAccount]);
  };

  const onRemoveBankAccount = (index: number) => {
    const updatedAccounts = bankAccounts.filter((_, i) => i !== index);
    onUpdateBankAccounts(updatedAccounts);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-slate-700">
          {t('businessLocation.bankAccounts.title')}
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddBankAccount}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('businessLocation.bankAccounts.add')}
        </Button>
      </div>

      {bankAccounts.map((account, index) => (
        <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-slate-700">
              {t('businessLocation.bankAccounts.account')} {index + 1}
            </h5>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveBankAccount(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <OnboardingSelect
              label={t('businessLocation.bankAccounts.type')}
              value={account.typ || ''}
              onValueChange={(value) => onUpdateBankAccount(index, 'typ', value)}
              options={accountTypeOptions}
              placeholder={t('businessLocation.bankAccounts.selectType')}
            />

            {account.typ === "IBAN" ? (
              <OnboardingInput
                label={t('businessLocation.bankAccounts.iban')}
                value={account.iban || ''}
                onChange={(e) => onUpdateBankAccount(index, 'iban', e.target.value)}
                placeholder="SK89 0000 0000 0000 0000 0000"
              />
            ) : account.typ === "CisloUctuKodBanky" ? (
              <>
                <OnboardingInput
                  label={t('businessLocation.bankAccounts.accountNumber')}
                  value={account.cisloUctu || ''}
                  onChange={(e) => onUpdateBankAccount(index, 'cisloUctu', e.target.value)}
                  placeholder="1234567890"
                />
                <OnboardingInput
                  label={t('businessLocation.bankAccounts.bankCode')}
                  value={account.kodBanky || ''}
                  onChange={(e) => onUpdateBankAccount(index, 'kodBanky', e.target.value)}
                  placeholder="0900"
                />
              </>
            ) : null}
          </div>
        </div>
      ))}

      {bankAccounts.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>{t('businessLocation.bankAccounts.empty')}</p>
        </div>
      )}
    </div>
  );
};

export default BankAccountsSection;
