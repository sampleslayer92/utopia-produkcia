
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanyAddressCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyAddressCard = ({ data, updateCompanyInfo }: CompanyAddressCardProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-medium text-slate-900">{t('onboarding.companyInfo.address')}</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <OnboardingInput
            label={`${t('onboarding.companyInfo.street')} *`}
            value={data.companyInfo.address?.street || ''}
            onChange={(e) => updateCompanyInfo('address.street', e.target.value)}
            placeholder={t('onboarding.companyInfo.street')}
          />
        </div>
        
        <OnboardingInput
          label={`${t('onboarding.companyInfo.zipCode')} *`}
          value={data.companyInfo.address?.zipCode || ''}
          onChange={(e) => updateCompanyInfo('address.zipCode', e.target.value)}
          placeholder="01001"
        />
      </div>
      
      <OnboardingInput
        label={`${t('onboarding.companyInfo.city')} *`}
        value={data.companyInfo.address?.city || ''}
        onChange={(e) => updateCompanyInfo('address.city', e.target.value)}
        placeholder={t('onboarding.companyInfo.city')}
      />

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="contactAddressSame"
            checked={data.companyInfo.contactAddressSame}
            onCheckedChange={(checked) => updateCompanyInfo('contactAddressSame', checked)}
          />
          <label htmlFor="contactAddressSame" className="text-sm text-slate-700">
            {t('onboarding.companyInfo.contactAddressSame')}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="headOfficeEqualsOperating"
            checked={data.companyInfo.headOfficeEqualsOperatingAddress}
            onCheckedChange={(checked) => updateCompanyInfo('headOfficeEqualsOperatingAddress', checked)}
          />
          <label htmlFor="headOfficeEqualsOperating" className="text-sm text-slate-700">
            {t('onboarding.companyInfo.headOfficeEqualsOperating')}
          </label>
        </div>
      </div>
    </div>
  );
};

export default CompanyAddressCard;
