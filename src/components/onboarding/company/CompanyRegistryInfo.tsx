
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";

interface CompanyRegistryInfoProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyRegistryInfo = ({ data, updateCompanyInfo }: CompanyRegistryInfoProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <OnboardingInput
        label="Súd"
        value={data.companyInfo.court}
        onChange={(e) => updateCompanyInfo('court', e.target.value)}
        placeholder="Okresný súd"
      />
      
      <OnboardingInput
        label="Oddiel"
        value={data.companyInfo.section}
        onChange={(e) => updateCompanyInfo('section', e.target.value)}
        placeholder="Sro"
      />
      
      <OnboardingInput
        label="Vložka"
        value={data.companyInfo.insertNumber}
        onChange={(e) => updateCompanyInfo('insertNumber', e.target.value)}
        placeholder="12345/B"
      />
    </div>
  );
};

export default CompanyRegistryInfo;
