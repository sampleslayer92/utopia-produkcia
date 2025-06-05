
import OnboardingInput from "./OnboardingInput";
import OnboardingSelect from "./OnboardingSelect";
import CountryFlagSelect from "./CountryFlagSelect";
import { User, Phone, Mail } from "lucide-react";

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
  const salutationOptions = [
    { value: 'Mr', label: 'Pán' },
    { value: 'Ms', label: 'Pani' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-700 mb-4">
        <User className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-medium">Osobné údaje *</span>
      </div>

      {showSalutation && (
        <OnboardingSelect
          label="Oslovenie *"
          placeholder="Vyberte oslovenie"
          value={data.salutation || ''}
          onValueChange={(value) => onUpdate('salutation', value)}
          options={salutationOptions}
          isCompleted={completedFields.has('salutation')}
        />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <OnboardingInput
          label="Meno *"
          value={data.firstName}
          onChange={(e) => onUpdate('firstName', e.target.value)}
          placeholder="Vaše meno"
          isCompleted={completedFields.has('firstName')}
        />

        <OnboardingInput
          label="Priezvisko *"
          value={data.lastName}
          onChange={(e) => onUpdate('lastName', e.target.value)}
          placeholder="Vaše priezvisko"
          isCompleted={completedFields.has('lastName')}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-700">
          <Mail className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Email *</span>
        </div>
        <OnboardingInput
          type="email"
          value={data.email}
          onChange={(e) => onUpdate('email', e.target.value)}
          placeholder="vas@email.sk"
          isCompleted={completedFields.has('email')}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-700">
          <Phone className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Telefónne číslo *</span>
        </div>
        <div className="flex gap-2">
          {forceShowPhonePrefix && (
            <CountryFlagSelect
              value={data.phonePrefix || '+421'}
              onValueChange={(value) => onUpdate('phonePrefix', value)}
            />
          )}
          <OnboardingInput
            value={data.phone}
            onChange={(e) => onUpdate('phone', e.target.value)}
            placeholder="123 456 789"
            isCompleted={completedFields.has('phone')}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonInputGroup;
