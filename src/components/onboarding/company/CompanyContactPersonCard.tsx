
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import PhoneNumberInput from "../ui/PhoneNumberInput";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CompanyContactPersonCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyContactPersonCard = ({ data, updateCompanyInfo }: CompanyContactPersonCardProps) => {
  const { t } = useTranslation('forms');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <User className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-900">{t('companyInfo.contactPersonSection')}</h3>
      </div>

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
      
      <div className="grid md:grid-cols-2 gap-6">
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
      
      <div className="flex items-center space-x-2">
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

export default CompanyContactPersonCard;
