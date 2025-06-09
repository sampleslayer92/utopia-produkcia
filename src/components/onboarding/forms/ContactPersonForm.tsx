
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import PhoneNumberInput from "../ui/PhoneNumberInput";
import { User, Mail } from "lucide-react";
import { contactPersonSchema } from "../validation/schemas";
import { useValidatedForm } from "../hooks/useValidatedForm";

interface ContactPersonFormProps {
  data: {
    salutation?: 'Pan' | 'Pani' | '';
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    phonePrefix?: string;
    isTechnicalPerson?: boolean;
  };
  onUpdate: (field: string, value: any) => void;
  title?: string;
  showTechnicalPersonOption?: boolean;
  className?: string;
}

const ContactPersonForm = ({ 
  data, 
  onUpdate, 
  title = "Kontaktná osoba",
  showTechnicalPersonOption = false,
  className = "" 
}: ContactPersonFormProps) => {
  const { errors, completedFields, updateField } = useValidatedForm(
    contactPersonSchema,
    data,
    onUpdate
  );

  const salutationOptions = [
    { value: 'Pan', label: 'Pan' },
    { value: 'Pani', label: 'Pani' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
        <User className="h-4 w-4" />
        {title}
      </h4>

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

      <div className="grid md:grid-cols-2 gap-4">
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

        <PhoneNumberInput
          phoneValue={data.phone}
          prefixValue={data.phonePrefix || '+421'}
          onPhoneChange={(value) => updateField('phone', value)}
          onPrefixChange={(value) => updateField('phonePrefix', value)}
          isCompleted={completedFields.has('phone')}
          error={errors.phone}
          required={true}
        />
      </div>

      {showTechnicalPersonOption && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isTechnicalPerson"
            checked={data.isTechnicalPerson || false}
            onChange={(e) => updateField('isTechnicalPerson', e.target.checked)}
            className="rounded border-slate-300"
          />
          <label htmlFor="isTechnicalPerson" className="text-sm text-slate-700">
            Je zároveň technická osoba
          </label>
        </div>
      )}
    </div>
  );
};

export default ContactPersonForm;
