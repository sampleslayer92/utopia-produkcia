
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
      <div className="grid md:grid-cols-2 gap-6">
        <OnboardingInput
          label="Meno *"
          value={data.companyInfo.contactPerson.firstName}
          onChange={(e) => updateCompanyInfo('contactPerson.firstName', e.target.value)}
          placeholder="Ján"
        />
        
        <OnboardingInput
          label="Priezvisko *"
          value={data.companyInfo.contactPerson.lastName}
          onChange={(e) => updateCompanyInfo('contactPerson.lastName', e.target.value)}
          placeholder="Novák"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-4">
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
