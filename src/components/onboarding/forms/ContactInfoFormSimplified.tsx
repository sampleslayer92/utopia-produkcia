
import { useTranslation } from "react-i18next";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import OnboardingTextarea from "../ui/OnboardingTextarea";
import { User, Mail, Phone, Building } from "lucide-react";
import { contactInfoSchema, ContactInfoFormData } from "../validation/schemas";
import { useValidatedForm } from "../hooks/useValidatedForm";

interface ContactInfoFormSimplifiedProps {
  data: ContactInfoFormData;
  onUpdate: (field: string, value: any) => void;
  className?: string;
}

const ContactInfoFormSimplified = ({ data, onUpdate, className = "" }: ContactInfoFormSimplifiedProps) => {
  const { t } = useTranslation('forms');
  const { errors, completedFields, updateField } = useValidatedForm(
    contactInfoSchema,
    data,
    onUpdate
  );

  const salutationOptions = [
    { value: 'Pan', label: t('contactInfo.salutationOptions.pan') },
    { value: 'Pani', label: t('contactInfo.salutationOptions.pani') }
  ];

  const phonePrefixOptions = [
    { value: '+421', label: '+421', extra: 'SK' },
    { value: '+420', label: '+420', extra: 'CZ' },
    { value: '+43', label: '+43', extra: 'AT' },
    { value: '+49', label: '+49', extra: 'DE' }
  ];

  const companyTypeOptions = [
    { value: 'Živnosť', label: t('contactInfo.companyTypeOptions.zivnost') },
    { value: 'S.r.o.', label: t('contactInfo.companyTypeOptions.sro') },
    { value: 'Nezisková organizácia', label: t('contactInfo.companyTypeOptions.neziskova') },
    { value: 'Akciová spoločnosť', label: t('contactInfo.companyTypeOptions.as') }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          {t('contactInfo.personalData')}
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <OnboardingSelect
            label={t('contactInfo.salutation')}
            placeholder={t('contactInfo.placeholders.selectSalutation')}
            value={data.salutation || ''}
            onValueChange={(value) => updateField('salutation', value)}
            options={salutationOptions}
            isCompleted={completedFields.has('salutation')}
            error={errors.salutation}
          />

          <OnboardingInput
            label={`${t('contactInfo.firstName')} *`}
            icon={<User className="h-4 w-4" />}
            value={data.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder={t('contactInfo.placeholders.firstName')}
            isCompleted={completedFields.has('firstName')}
            error={errors.firstName}
          />

          <OnboardingInput
            label={`${t('contactInfo.lastName')} *`}
            value={data.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder={t('contactInfo.placeholders.lastName')}
            isCompleted={completedFields.has('lastName')}
            error={errors.lastName}
          />
        </div>

        <OnboardingInput
          label={`${t('contactInfo.email')} *`}
          icon={<Mail className="h-4 w-4" />}
          type="email"
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder={t('contactInfo.placeholders.email')}
          isCompleted={completedFields.has('email')}
          error={errors.email}
        />

        <div className="grid md:grid-cols-4 gap-4">
          <OnboardingSelect
            label={`${t('contactInfo.phonePrefix')} *`}
            value={data.phonePrefix}
            onValueChange={(value) => updateField('phonePrefix', value)}
            options={phonePrefixOptions}
            isCompleted={completedFields.has('phonePrefix')}
            error={errors.phonePrefix}
            compact={true}
            showTooltip={true}
          />

          <div className="md:col-span-3">
            <OnboardingInput
              label={`${t('contactInfo.phone')} *`}
              icon={<Phone className="h-4 w-4" />}
              value={data.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder={t('contactInfo.placeholders.phone')}
              isCompleted={completedFields.has('phone')}
              error={errors.phone}
            />
          </div>
        </div>
      </div>

      {/* Company Type */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Building className="h-5 w-5 text-blue-500" />
          <span className="text-lg font-medium">{t('contactInfo.companyType')} *</span>
        </div>
        <OnboardingSelect
          placeholder={t('contactInfo.placeholders.selectCompanyType')}
          value={data.companyType || ''}
          onValueChange={(value) => updateField('companyType', value)}
          options={companyTypeOptions}
          isCompleted={completedFields.has('companyType')}
          error={errors.companyType}
        />
      </div>

      {/* Optional Note */}
      <OnboardingTextarea
        label={t('contactInfo.salesNote')}
        value={data.salesNote || ''}
        onChange={(e) => updateField('salesNote', e.target.value)}
        placeholder={t('contactInfo.placeholders.salesNote')}
        rows={4}
      />
    </div>
  );
};

export default ContactInfoFormSimplified;
