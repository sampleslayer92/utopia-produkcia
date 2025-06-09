
import { useTranslation } from "react-i18next";
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import PhoneNumberInput from "../ui/PhoneNumberInput";
import { User } from "lucide-react";

interface CompanyContactPersonCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const CompanyContactPersonCard = ({ data, updateCompanyInfo }: CompanyContactPersonCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <User className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-medium text-slate-900">{t('steps.companyInfo.contactPerson.title')}</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <OnboardingInput
          label={t('steps.companyInfo.contactPerson.fields.firstName')}
          value={data.companyInfo.contactPerson?.firstName || ''}
          onChange={(e) => updateCompanyInfo('contactPerson.firstName', e.target.value)}
          placeholder={t('steps.companyInfo.contactPerson.placeholders.firstName')}
        />
        
        <OnboardingInput
          label={t('steps.companyInfo.contactPerson.fields.lastName')}
          value={data.companyInfo.contactPerson?.lastName || ''}
          onChange={(e) => updateCompanyInfo('contactPerson.lastName', e.target.value)}
          placeholder={t('steps.companyInfo.contactPerson.placeholders.lastName')}
        />
      </div>
      
      <OnboardingInput
        label={t('steps.companyInfo.contactPerson.fields.email')}
        type="email"
        value={data.companyInfo.contactPerson?.email || ''}
        onChange={(e) => updateCompanyInfo('contactPerson.email', e.target.value)}
        placeholder={t('steps.companyInfo.contactPerson.placeholders.email')}
      />
      
      <PhoneNumberInput
        value={data.companyInfo.contactPerson?.phone || ''}
        onChange={(value) => updateCompanyInfo('contactPerson.phone', value)}
        prefix={data.contactInfo.phonePrefix || '+421'}
        onPrefixChange={(prefix) => updateCompanyInfo('contactPerson.phonePrefix', prefix)}
      />
    </div>
  );
};

export default CompanyContactPersonCard;
