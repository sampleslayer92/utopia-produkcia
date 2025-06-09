
import { useTranslation } from "react-i18next";
import OnboardingInput from "./OnboardingInput";
import OnboardingSelect from "./OnboardingSelect";
import PhoneNumberInput from "./PhoneNumberInput";
import { User, Mail } from "lucide-react";

interface PersonData {
  salutation?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phonePrefix?: string;
}

interface PersonInputGroupProps {
  data: PersonData;
  onUpdate: (field: string, value: string) => void;
  completedFields: Set<string>;
  forceShowPhonePrefix?: boolean;
  showSalutation?: boolean;
}

const PersonInputGroup = ({ 
  data, 
  onUpdate, 
  completedFields, 
  forceShowPhonePrefix = false,
  showSalutation = true 
}: PersonInputGroupProps) => {
  const { t } = useTranslation();
  
  const salutationOptions = [
    { value: 'Pan', label: t('ui.personalInfo.options.mr') },
    { value: 'Pani', label: t('ui.personalInfo.options.mrs') }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-700 mb-4">
        <User className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-medium">{t('ui.personalInfo.required')}</span>
      </div>

      {showSalutation && (
        <OnboardingSelect
          label={t('ui.personalInfo.salutationRequired')}
          placeholder={t('ui.personalInfo.selectSalutation')}
          value={data.salutation || ''}
          onValueChange={(value) => onUpdate('salutation', value)}
          options={salutationOptions}
          isCompleted={completedFields.has('salutation')}
        />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <OnboardingInput
          label={t('ui.personalInfo.firstNameRequired')}
          value={data.firstName}
          onChange={(e) => onUpdate('firstName', e.target.value)}
          placeholder={t('ui.personalInfo.firstNamePlaceholder')}
          isCompleted={completedFields.has('firstName')}
        />

        <OnboardingInput
          label={t('ui.personalInfo.lastNameRequired')}
          value={data.lastName}
          onChange={(e) => onUpdate('lastName', e.target.value)}
          placeholder={t('ui.personalInfo.lastNamePlaceholder')}
          isCompleted={completedFields.has('lastName')}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-700">
          <Mail className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">{t('ui.personalInfo.emailRequired')}</span>
        </div>
        <OnboardingInput
          type="email"
          value={data.email}
          onChange={(e) => onUpdate('email', e.target.value)}
          placeholder={t('ui.personalInfo.emailPlaceholder')}
          isCompleted={completedFields.has('email')}
        />
      </div>

      <PhoneNumberInput
        phoneValue={data.phone}
        prefixValue={data.phonePrefix || '+421'}
        onPhoneChange={(value) => onUpdate('phone', value)}
        onPrefixChange={(value) => onUpdate('phonePrefix', value)}
        isCompleted={completedFields.has('phone')}
        required={true}
      />
    </div>
  );
};

export default PersonInputGroup;
