
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import PhoneNumberInput from "../ui/PhoneNumberInput";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanyContactPersonProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyContactPerson = ({ data, updateCompanyInfo }: CompanyContactPersonProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="border-t border-slate-100 pt-6">
      <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
        <User className="h-4 w-4 text-blue-600" />
        {t('companyInfo.contactPersonSection')}
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        <OnboardingInput
          label={t('companyInfo.labels.firstNameRequired')}
          value={data.companyInfo.contactPerson.firstName}
          onChange={(e) => updateCompanyInfo('contactPerson.firstName', e.target.value)}
          placeholder={t('companyInfo.placeholders.firstName')}
        />
        
        <OnboardingInput
          label={t('companyInfo.labels.lastNameRequired')}
          value={data.companyInfo.contactPerson.lastName}
          onChange={(e) => updateCompanyInfo('contactPerson.lastName', e.target.value)}
          placeholder={t('companyInfo.placeholders.lastName')}
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <OnboardingInput
          label={t('companyInfo.labels.emailRequired')}
          type="email"
          value={data.companyInfo.contactPerson.email}
          onChange={(e) => updateCompanyInfo('contactPerson.email', e.target.value)}
          placeholder={t('companyInfo.placeholders.email')}
        />
        
        <PhoneNumberInput
          phoneValue={data.companyInfo.contactPerson.phone}
          prefixValue="+421"
          onPhoneChange={(value) => updateCompanyInfo('contactPerson.phone', value)}
          onPrefixChange={() => {}} // Contact person phone doesn't need prefix changes for now
          required={true}
        />
      </div>
      
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox
          id="isTechnicalPerson"
          checked={data.companyInfo.contactPerson.isTechnicalPerson}
          onCheckedChange={(checked) => updateCompanyInfo('contactPerson.isTechnicalPerson', checked)}
        />
        <label htmlFor="isTechnicalPerson" className="text-sm text-slate-700">
          {t('companyInfo.checkboxes.isTechnicalPerson')}
        </label>
      </div>
    </div>
  );
};

export default CompanyContactPerson;
