
import { useTranslation } from "react-i18next";
import OnboardingInput from "./OnboardingInput";
import OnboardingSelect from "./OnboardingSelect";
import PhoneNumberInput from "./PhoneNumberInput";
import { User, Mail, Globe } from "lucide-react";
import CountryFlagSelect from "./CountryFlagSelect";

interface PersonData {
  country?: string;
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
  customFields?: Array<{
    id?: string;
    fieldKey: string;
    fieldLabel: string;
    fieldType: string;
    isRequired: boolean;
    isEnabled: boolean;
    position?: number;
    fieldOptions?: any;
  }>;
}

const PersonInputGroup = ({ 
  data, 
  onUpdate, 
  completedFields, 
  forceShowPhonePrefix = false,
  showSalutation = true,
  customFields
}: PersonInputGroupProps) => {
  const { t } = useTranslation('forms');

  // Check if field is enabled in customFields configuration
  const isFieldEnabled = (fieldKey: string) => {
    if (!customFields) return true; // Default to enabled if no custom config
    const field = customFields.find(f => f.fieldKey === fieldKey);
    return field ? field.isEnabled : false;
  };

  // Check which fields should be shown
  const showCountryField = isFieldEnabled('country');
  const showSalutationField = showSalutation && isFieldEnabled('salutation');
  const showFirstNameField = isFieldEnabled('firstName');
  const showLastNameField = isFieldEnabled('lastName');
  const showEmailField = isFieldEnabled('email');
  const showPhoneField = isFieldEnabled('phone');

  const salutationOptions = [
    { value: 'Pan', label: t('contactInfo.salutationOptions.pan') },
    { value: 'Pani', label: t('contactInfo.salutationOptions.pani') }
  ];

  const countryOptions = [
    { value: 'SK', label: 'Slovensko' },
    { value: 'CZ', label: 'Česká republika' },
    { value: 'AT', label: 'Rakúsko' },
    { value: 'HU', label: 'Maďarsko' },
    { value: 'PL', label: 'Poľsko' },
    { value: 'DE', label: 'Nemecko' },
    { value: 'GB', label: 'Veľká Británia' },
    { value: 'FR', label: 'Francúzsko' },
    { value: 'IT', label: 'Taliansko' },
    { value: 'ES', label: 'Španielsko' }
  ];

  return (
    <div className="space-y-4">
      {showCountryField && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700">
            <Globe className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Krajina *</span>
          </div>
          <OnboardingSelect
            label=""
            placeholder="Vyberte krajinu"
            value={data.country || ''}
            onValueChange={(value) => onUpdate('country', value)}
            options={countryOptions}
            isCompleted={completedFields.has('country')}
          />
        </div>
      )}
      
      <div className="flex items-center gap-2 text-slate-700 mb-4">
        <User className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-medium">{t('contactInfo.personalData')} *</span>
      </div>

      {showSalutationField && (
        <OnboardingSelect
          label={`${t('contactInfo.salutation')} *`}
          placeholder={t('contactInfo.placeholders.selectSalutation')}
          value={data.salutation || ''}
          onValueChange={(value) => onUpdate('salutation', value)}
          options={salutationOptions}
          isCompleted={completedFields.has('salutation')}
        />
      )}

      {(showFirstNameField || showLastNameField) && (
        <div className="grid md:grid-cols-2 gap-4">
          {showFirstNameField && (
            <OnboardingInput
              label={`${t('contactInfo.firstName')} *`}
              value={data.firstName}
              onChange={(e) => onUpdate('firstName', e.target.value)}
              placeholder={t('contactInfo.placeholders.firstName')}
              isCompleted={completedFields.has('firstName')}
            />
          )}

          {showLastNameField && (
            <OnboardingInput
              label={`${t('contactInfo.lastName')} *`}
              value={data.lastName}
              onChange={(e) => onUpdate('lastName', e.target.value)}
              placeholder={t('contactInfo.placeholders.lastName')}
              isCompleted={completedFields.has('lastName')}
            />
          )}
        </div>
      )}

      {showEmailField && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700">
            <Mail className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">{t('contactInfo.email')} *</span>
          </div>
          <OnboardingInput
            type="email"
            value={data.email}
            onChange={(e) => onUpdate('email', e.target.value)}
            placeholder={t('contactInfo.placeholders.email')}
            isCompleted={completedFields.has('email')}
          />
        </div>
      )}

      {showPhoneField && (
        <PhoneNumberInput
          label={`${t('contactInfo.phone')} *`}
          phoneValue={data.phone}
          prefixValue={data.phonePrefix || '+421'}
          onPhoneChange={(value) => onUpdate('phone', value)}
          onPrefixChange={(value) => onUpdate('phonePrefix', value)}
          isCompleted={completedFields.has('phone')}
          placeholder={t('contactInfo.placeholders.phone')}
          required={true}
        />
      )}
    </div>
  );
};

export default PersonInputGroup;
