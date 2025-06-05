
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
  const { errors, completedFields, updateField } = useValidatedForm(
    contactInfoSchema,
    data,
    onUpdate
  );

  const salutationOptions = [
    { value: 'Pan', label: 'Pan' },
    { value: 'Pani', label: 'Pani' }
  ];

  const phonePrefixOptions = [
    { value: '+421', label: '+421', extra: 'SK' },
    { value: '+420', label: '+420', extra: 'CZ' },
    { value: '+43', label: '+43', extra: 'AT' },
    { value: '+49', label: '+49', extra: 'DE' }
  ];

  const companyTypeOptions = [
    { value: 'Živnosť', label: 'Živnosť' },
    { value: 'S.r.o.', label: 'S.r.o.' },
    { value: 'Nezisková organizácia', label: 'Nezisková organizácia' },
    { value: 'Akciová spoločnosť', label: 'Akciová spoločnosť' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          Osobné údaje
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <OnboardingSelect
            label="Oslovenie"
            placeholder="Vyberte oslovenie"
            value={data.salutation || ''}
            onValueChange={(value) => updateField('salutation', value)}
            options={salutationOptions}
            isCompleted={completedFields.has('salutation')}
            error={errors.salutation}
          />

          <OnboardingInput
            label="Meno *"
            icon={<User className="h-4 w-4" />}
            value={data.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="Ján"
            isCompleted={completedFields.has('firstName')}
            error={errors.firstName}
          />

          <OnboardingInput
            label="Priezvisko *"
            value={data.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Novák"
            isCompleted={completedFields.has('lastName')}
            error={errors.lastName}
          />
        </div>

        <OnboardingInput
          label="Email *"
          icon={<Mail className="h-4 w-4" />}
          type="email"
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="jan.novak@firma.sk"
          isCompleted={completedFields.has('email')}
          error={errors.email}
        />

        <div className="grid md:grid-cols-4 gap-4">
          <OnboardingSelect
            label="Predvoľba *"
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
              label="Telefón *"
              icon={<Phone className="h-4 w-4" />}
              value={data.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="123 456 789"
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
          <span className="text-lg font-medium">Typ spoločnosti *</span>
        </div>
        <OnboardingSelect
          placeholder="Vyberte typ spoločnosti"
          value={data.companyType || ''}
          onValueChange={(value) => updateField('companyType', value)}
          options={companyTypeOptions}
          isCompleted={completedFields.has('companyType')}
          error={errors.companyType}
        />
      </div>

      {/* Optional Note */}
      <OnboardingTextarea
        label="Chcete nám niečo odkázať?"
        value={data.salesNote || ''}
        onChange={(e) => updateField('salesNote', e.target.value)}
        placeholder="Napríklad: Najlepší čas na kontakt, preferovaný spôsob komunikácie..."
        rows={4}
      />
    </div>
  );
};

export default ContactInfoFormSimplified;
