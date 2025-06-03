
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import ORSRSearch from "../ui/ORSRSearch";
import { Building2 } from "lucide-react";

interface CompanyBasicInfoProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
  handleORSRData: (orsrData: any) => void;
}

const CompanyBasicInfo = ({ data, updateCompanyInfo, handleORSRData }: CompanyBasicInfoProps) => {
  const registryTypeOptions = [
    { value: "public", label: "Verejný register" },
    { value: "business", label: "Živnostenský register" },
    { value: "other", label: "Iný" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <OnboardingInput
            label="IČO *"
            value={data.companyInfo.ico}
            onChange={(e) => updateCompanyInfo('ico', e.target.value)}
            placeholder="12345678"
            icon={<Building2 className="h-4 w-4" />}
          />
          <ORSRSearch
            ico={data.companyInfo.ico}
            onDataFound={handleORSRData}
          />
        </div>
        
        <OnboardingInput
          label="DIČ *"
          value={data.companyInfo.dic}
          onChange={(e) => updateCompanyInfo('dic', e.target.value)}
          placeholder="SK2012345678"
        />
      </div>

      <OnboardingInput
        label="Obchodné meno spoločnosti *"
        value={data.companyInfo.companyName}
        onChange={(e) => updateCompanyInfo('companyName', e.target.value)}
        placeholder="Zadajte obchodné meno"
      />

      <OnboardingSelect
        label="Zápis v obchodnom registri *"
        value={data.companyInfo.registryType}
        onValueChange={(value) => updateCompanyInfo('registryType', value)}
        options={registryTypeOptions}
        placeholder="Vyberte typ registra"
      />
    </div>
  );
};

export default CompanyBasicInfo;
