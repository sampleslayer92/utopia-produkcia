
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanyAddressCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
  autoFilledFields?: Set<string>;
}

const CompanyAddressCard = ({ data, updateCompanyInfo, autoFilledFields = new Set() }: CompanyAddressCardProps) => {
  const { t } = useTranslation('forms');

  const getFieldClassName = (fieldName: string) => {
    return autoFilledFields.has(fieldName) ? 'bg-green-50 border-green-200' : '';
  };

  const getFieldIndicator = (fieldName: string) => {
    if (autoFilledFields.has(fieldName)) {
      return (
        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
          <CheckCircle className="h-3 w-3" />
          <span>{t('companyInfo.messages.autoFilledField')}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-900">{t('companyInfo.addressSection')}</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <OnboardingInput
            label={t('address.labels.streetRequired')}
            value={data.companyInfo.address.street}
            onChange={(e) => updateCompanyInfo('address.street', e.target.value)}
            placeholder={t('address.placeholders.street')}
            className={getFieldClassName('address.street')}
          />
          {getFieldIndicator('address.street')}
        </div>
        
        <div className="space-y-2">
          <OnboardingInput
            label={t('address.labels.zipCodeRequired')}
            value={data.companyInfo.address.zipCode}
            onChange={(e) => updateCompanyInfo('address.zipCode', e.target.value)}
            placeholder={t('address.placeholders.zipCode')}
            className={getFieldClassName('address.zipCode')}
          />
          {getFieldIndicator('address.zipCode')}
        </div>
      </div>
      
      <div className="space-y-2">
        <OnboardingInput
          label={t('address.labels.cityRequired')}
          value={data.companyInfo.address.city}
          onChange={(e) => updateCompanyInfo('address.city', e.target.value)}
          placeholder={t('address.placeholders.city')}
          className={getFieldClassName('address.city')}
        />
        {getFieldIndicator('address.city')}
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="contactAddressSameAsMain"
            checked={data.companyInfo.contactAddressSameAsMain}
            onCheckedChange={(checked) => updateCompanyInfo('contactAddressSameAsMain', checked)}
          />
          <label htmlFor="contactAddressSameAsMain" className="text-sm text-slate-700">
            {t('companyInfo.checkboxes.contactAddressSameAsMain')}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="headOfficeEqualsOperatingAddress"
            checked={data.companyInfo.headOfficeEqualsOperatingAddress}
            onCheckedChange={(checked) => updateCompanyInfo('headOfficeEqualsOperatingAddress', checked)}
          />
          <label htmlFor="headOfficeEqualsOperatingAddress" className="text-sm text-slate-700">
            {t('companyInfo.checkboxes.headOfficeEqualsOperatingAddress')}
          </label>
        </div>
      </div>
    </div>
  );
};

export default CompanyAddressCard;
