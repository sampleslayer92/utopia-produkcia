
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import { Building2 } from "lucide-react";

interface CompanyRegistryInfoProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyRegistryInfo = ({ data, updateCompanyInfo }: CompanyRegistryInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-900">Údaje v obchodnom registri</h3>
      </div>
      
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
    </div>
  );
};

export default CompanyRegistryInfo;
