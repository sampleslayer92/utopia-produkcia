
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import { MapPin, CheckCircle } from "lucide-react";

interface CompanyAddressCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
  autoFilledFields: Set<string>;
}

const CompanyAddressCard = ({ data, updateCompanyInfo, autoFilledFields }: CompanyAddressCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-medium text-slate-900">{t('steps.companyInfo.address.title')}</h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <OnboardingInput
            label={t('steps.companyInfo.address.street')}
            value={data.companyInfo.address?.street || ''}
            onChange={(e) => updateCompanyInfo('address.street', e.target.value)}
            placeholder={t('steps.companyInfo.placeholders.street')}
            className={autoFilledFields.has('address.street') ? 'bg-green-50 border-green-200' : ''}
            suffix={autoFilledFields.has('address.street') ? <CheckCircle className="h-4 w-4 text-green-600" /> : undefined}
          />
        </div>
        
        <OnboardingInput
          label={t('steps.companyInfo.address.zipCode')}
          value={data.companyInfo.address?.zipCode || ''}
          onChange={(e) => updateCompanyInfo('address.zipCode', e.target.value)}
          placeholder={t('steps.companyInfo.placeholders.zipCode')}
          className={autoFilledFields.has('address.zipCode') ? 'bg-green-50 border-green-200' : ''}
          suffix={autoFilledFields.has('address.zipCode') ? <CheckCircle className="h-4 w-4 text-green-600" /> : undefined}
        />
      </div>
      
      <OnboardingInput
        label={t('steps.companyInfo.address.city')}
        value={data.companyInfo.address?.city || ''}
        onChange={(e) => updateCompanyInfo('address.city', e.target.value)}
        placeholder={t('steps.companyInfo.placeholders.city')}
        className={autoFilledFields.has('address.city') ? 'bg-green-50 border-green-200' : ''}
        suffix={autoFilledFields.has('address.city') ? <CheckCircle className="h-4 w-4 text-green-600" /> : undefined}
      />

      {/* Contact Address Checkbox */}
      <div className="border-t border-slate-200 pt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="contactAddressSameAsMain"
            checked={data.companyInfo.contactAddressSameAsMain || false}
            onCheckedChange={(checked) => updateCompanyInfo('contactAddressSameAsMain', checked)}
          />
          <label htmlFor="contactAddressSameAsMain" className="text-sm font-medium text-slate-700">
            {t('steps.companyInfo.contactAddress.sameAsMain')}
          </label>
        </div>
      </div>

      {/* Head Office = Operating Location Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="headOfficeEqualsOperatingAddress"
          checked={data.companyInfo.headOfficeEqualsOperatingAddress || false}
          onCheckedChange={(checked) => updateCompanyInfo('headOfficeEqualsOperatingAddress', checked)}
        />
        <label htmlFor="headOfficeEqualsOperatingAddress" className="text-sm font-medium text-slate-700">
          {t('steps.companyInfo.contactPerson.headOfficeEquals')}
        </label>
      </div>
    </div>
  );
};

export default CompanyAddressCard;
