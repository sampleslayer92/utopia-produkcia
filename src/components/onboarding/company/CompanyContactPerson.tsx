
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "lucide-react";

interface CompanyContactPersonProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyContactPerson = ({ data, updateCompanyInfo }: CompanyContactPersonProps) => {
  return (
    <div className="border-t border-slate-100 pt-6">
      <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
        <User className="h-4 w-4 text-blue-600" />
        Kontaktná osoba
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        <OnboardingInput
          label="Meno a priezvisko *"
          value={data.companyInfo.contactPerson.name}
          onChange={(e) => updateCompanyInfo('contactPerson.name', e.target.value)}
          placeholder="Ján Novák"
        />
        
        <OnboardingInput
          label="Email *"
          type="email"
          value={data.companyInfo.contactPerson.email}
          onChange={(e) => updateCompanyInfo('contactPerson.email', e.target.value)}
          placeholder="jan.novak@firma.sk"
        />
        
        <OnboardingInput
          label="Telefón *"
          value={data.companyInfo.contactPerson.phone}
          onChange={(e) => updateCompanyInfo('contactPerson.phone', e.target.value)}
          placeholder="+421 123 456 789"
        />
      </div>
      
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox
          id="isTechnicalPerson"
          checked={data.companyInfo.contactPerson.isTechnicalPerson}
          onCheckedChange={(checked) => updateCompanyInfo('contactPerson.isTechnicalPerson', checked)}
        />
        <label htmlFor="isTechnicalPerson" className="text-sm text-slate-700">
          Je zároveň technická osoba
        </label>
      </div>
    </div>
  );
};

export default CompanyContactPerson;
