
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import ORSRSearch from "../ui/ORSRSearch";
import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanyBasicInfoProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
  handleORSRData: (orsrData: any) => void;
}

const CompanyBasicInfo = ({ data, updateCompanyInfo, handleORSRData }: CompanyBasicInfoProps) => {
  const { t } = useTranslation('forms');

  const registryTypeOptions = [
    { value: "public", label: t('companyInfo.registryTypeOptions.public') },
    { value: "business", label: t('companyInfo.registryTypeOptions.business') },
    { value: "other", label: t('companyInfo.registryTypeOptions.other') }
  ];

  return (
    <div className="space-y-6">
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

export default CompanyBasicInfo;
