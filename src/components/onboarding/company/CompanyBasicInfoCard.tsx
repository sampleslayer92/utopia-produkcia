
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import ORSRSearch from "../ui/ORSRSearch";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanyBasicInfoCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
  handleORSRData: (orsrData: any) => void;
}

const CompanyBasicInfoCard = ({ data, updateCompanyInfo, handleORSRData }: CompanyBasicInfoCardProps) => {
  const { t } = useTranslation('forms');

  const registryTypeOptions = [
    { value: "public", label: t('companyInfo.registryTypeOptions.public') },
    { value: "business", label: t('companyInfo.registryTypeOptions.business') },
    { value: "other", label: t('companyInfo.registryTypeOptions.other') }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Building2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-900">{t('companyInfo.basicInfo')}</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <OnboardingInput
            label={t('companyInfo.labels.icoRequired')}
            value={data.companyInfo.ico}
            onChange={(e) => updateCompanyInfo('ico', e.target.value)}
            placeholder={t('companyInfo.placeholders.ico')}
            icon={<Building2 className="h-4 w-4" />}
          />
          <ORSRSearch
            ico={data.companyInfo.ico}
            onDataFound={handleORSRData}
          />
        </div>
        
        <OnboardingInput
          label={t('companyInfo.labels.dicRequired')}
          value={data.companyInfo.dic}
          onChange={(e) => updateCompanyInfo('dic', e.target.value)}
          placeholder={t('companyInfo.placeholders.dic')}
        />
      </div>

      {/* VAT Payer Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isVatPayer"
            checked={data.companyInfo.isVatPayer}
            onCheckedChange={(checked) => updateCompanyInfo('isVatPayer', checked)}
          />
          <label htmlFor="isVatPayer" className="text-sm font-medium text-slate-700">
            {t('companyInfo.checkboxes.isVatPayer')}
          </label>
        </div>

        {data.companyInfo.isVatPayer && (
          <OnboardingInput
            label={t('companyInfo.labels.vatNumberRequired')}
            value={data.companyInfo.vatNumber}
            onChange={(e) => updateCompanyInfo('vatNumber', e.target.value)}
            placeholder={t('companyInfo.placeholders.vatNumber')}
          />
        )}
      </div>

      <OnboardingInput
        label={t('companyInfo.labels.companyNameRequired')}
        value={data.companyInfo.companyName}
        onChange={(e) => updateCompanyInfo('companyName', e.target.value)}
        placeholder={t('companyInfo.placeholders.companyName')}
      />

      <OnboardingSelect
        label={t('companyInfo.labels.registryTypeRequired')}
        value={data.companyInfo.registryType}
        onValueChange={(value) => updateCompanyInfo('registryType', value)}
        options={registryTypeOptions}
        placeholder={t('companyInfo.placeholders.selectRegistryType')}
      />
    </div>
  );
};

export default CompanyBasicInfoCard;
