
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanyContactAddressCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyContactAddressCard = ({ data, updateCompanyInfo }: CompanyContactAddressCardProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-medium text-slate-900">{t('companyInfo.contactAddressSection')}</h3>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          {t('companyInfo.messages.contactAddressDifferent')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <OnboardingInput
            label={t('address.labels.streetRequired')}
            value={data.companyInfo.contactAddress?.street || ''}
            onChange={(e) => updateCompanyInfo('contactAddress.street', e.target.value)}
            placeholder={t('address.placeholders.street')}
          />
        </div>
        
        <OnboardingInput
          label={t('address.labels.zipCodeRequired')}
          value={data.companyInfo.contactAddress?.zipCode || ''}
          onChange={(e) => updateCompanyInfo('contactAddress.zipCode', e.target.value)}
          placeholder={t('address.placeholders.zipCode')}
        />
      </div>
      
      <OnboardingInput
        label={t('address.labels.cityRequired')}
        value={data.companyInfo.contactAddress?.city || ''}
        onChange={(e) => updateCompanyInfo('contactAddress.city', e.target.value)}
        placeholder={t('address.placeholders.city')}
      />
    </div>
  );
};

export default CompanyContactAddressCard;
