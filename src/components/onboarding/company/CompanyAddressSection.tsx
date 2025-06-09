
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanyAddressSectionProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyAddressSection = ({ data, updateCompanyInfo }: CompanyAddressSectionProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="space-y-6">
      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" /> 
          {t('companyInfo.addressSection')}
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <OnboardingInput
              label={t('address.labels.streetRequired')}
              value={data.companyInfo.address.street}
              onChange={(e) => updateCompanyInfo('address.street', e.target.value)}
              placeholder={t('address.placeholders.street')}
            />
          </div>
          
          <OnboardingInput
            label={t('address.labels.zipCodeRequired')}
            value={data.companyInfo.address.zipCode}
            onChange={(e) => updateCompanyInfo('address.zipCode', e.target.value)}
            placeholder={t('address.placeholders.zipCode')}
          />
        </div>
        
        <OnboardingInput
          label={t('address.labels.cityRequired')}
          value={data.companyInfo.address.city}
          onChange={(e) => updateCompanyInfo('address.city', e.target.value)}
          placeholder={t('address.placeholders.city')}
        />
      </div>

      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-green-600" />
          {t('companyInfo.contactAddressSection')}
        </h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="contactAddressSameAsMain"
            checked={data.companyInfo.contactAddressSameAsMain}
            onCheckedChange={(checked) => updateCompanyInfo('contactAddressSameAsMain', checked)}
          />
          <label htmlFor="contactAddressSameAsMain" className="text-sm text-slate-700">
            {t('companyInfo.checkboxes.contactAddressSameAsMain')}
          </label>
        </div>

        {!data.companyInfo.contactAddressSameAsMain && (
          <div className="space-y-4">
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
        )}
      </div>
    </div>
  );
};

export default CompanyAddressSection;
