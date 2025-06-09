
import { useTranslation } from "react-i18next";
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import { MapPin } from "lucide-react";

interface CompanyContactAddressCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyContactAddressCard = ({ data, updateCompanyInfo }: CompanyContactAddressCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-medium text-slate-900">{t('steps.companyInfo.contactAddress.title')}</h3>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          Zadávate kontaktnú adresu, ktorá sa líši od sídla spoločnosti.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <OnboardingInput
            label={t('steps.companyInfo.address.street')}
            value={data.companyInfo.contactAddress?.street || ''}
            onChange={(e) => updateCompanyInfo('contactAddress.street', e.target.value)}
            placeholder={t('steps.companyInfo.placeholders.street')}
          />
        </div>
        
        <OnboardingInput
          label={t('steps.companyInfo.address.zipCode')}
          value={data.companyInfo.contactAddress?.zipCode || ''}
          onChange={(e) => updateCompanyInfo('contactAddress.zipCode', e.target.value)}
          placeholder={t('steps.companyInfo.placeholders.zipCode')}
        />
      </div>
      
      <OnboardingInput
        label={t('steps.companyInfo.address.city')}
        value={data.companyInfo.contactAddress?.city || ''}
        onChange={(e) => updateCompanyInfo('contactAddress.city', e.target.value)}
        placeholder={t('steps.companyInfo.placeholders.city')}
      />
    </div>
  );
};

export default CompanyContactAddressCard;
