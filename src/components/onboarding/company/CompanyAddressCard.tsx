
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import { MapPin } from "lucide-react";

interface CompanyAddressCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyAddressCard = ({ data, updateCompanyInfo }: CompanyAddressCardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-900">Sídlo spoločnosti</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <OnboardingInput
            label="Ulica a číslo *"
            value={data.companyInfo.address.street}
            onChange={(e) => updateCompanyInfo('address.street', e.target.value)}
            placeholder="Hlavná ulica 123"
          />
        </div>
        
        <OnboardingInput
          label="PSČ *"
          value={data.companyInfo.address.zipCode}
          onChange={(e) => updateCompanyInfo('address.zipCode', e.target.value)}
          placeholder="01001"
        />
      </div>
      
      <OnboardingInput
        label="Mesto *"
        value={data.companyInfo.address.city}
        onChange={(e) => updateCompanyInfo('address.city', e.target.value)}
        placeholder="Bratislava"
      />
    </div>
  );
};

export default CompanyAddressCard;
