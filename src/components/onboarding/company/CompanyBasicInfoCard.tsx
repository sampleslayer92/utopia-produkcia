
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import ORSRSearch from "../ui/ORSRSearch";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2 } from "lucide-react";

interface CompanyBasicInfoCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
  handleORSRData: (orsrData: any) => void;
}

const CompanyBasicInfoCard = ({ data, updateCompanyInfo, handleORSRData }: CompanyBasicInfoCardProps) => {
  const registryTypeOptions = [
    { value: "public", label: "Verejný register" },
    { value: "business", label: "Živnostenský register" },
    { value: "other", label: "Iný" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Building2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-900">Základné údaje o spoločnosti</h3>
      </div>

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

      {/* VAT Payer Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isVatPayer"
            checked={data.companyInfo.isVatPayer}
            onCheckedChange={(checked) => updateCompanyInfo('isVatPayer', checked)}
          />
          <label htmlFor="isVatPayer" className="text-sm font-medium text-slate-700">
            Je platcom DPH
          </label>
        </div>

        {data.companyInfo.isVatPayer && (
          <OnboardingInput
            label="IČ DPH *"
            value={data.companyInfo.vatNumber}
            onChange={(e) => updateCompanyInfo('vatNumber', e.target.value)}
            placeholder="SK2012345678"
          />
        )}
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

export default CompanyBasicInfoCard;
