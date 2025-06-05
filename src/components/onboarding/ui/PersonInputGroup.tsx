
import { Mail, Phone, User } from "lucide-react";
import OnboardingInput from "./OnboardingInput";
import OnboardingSelect from "./OnboardingSelect";

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
  onUpdate: (field: keyof PersonData, value: string) => void;
  showSalutation?: boolean;
  showPhonePrefix?: boolean;
  completedFields?: Set<string>;
  emailValidation?: boolean;
  isAutoFilled?: boolean;
  autoFilledFrom?: string;
}

const PersonInputGroup = ({
  data,
  onUpdate,
  showSalutation = true,
  showPhonePrefix = true,
  completedFields = new Set(),
  emailValidation = true,
  isAutoFilled = false,
  autoFilledFrom
}: PersonInputGroupProps) => {
  const phonePrefixes = [
    { value: '+421', label: '+421', extra: '🇸🇰 Slovensko' },
    { value: '+420', label: '+420', extra: '🇨🇿 Česko' },
    { value: '+43', label: '+43', extra: '🇦🇹 Rakúsko' },
    { value: '+36', label: '+36', extra: '🇭🇺 Maďarsko' },
    { value: '+48', label: '+48', extra: '🇵🇱 Poľsko' },
    { value: '+49', label: '+49', extra: '🇩🇪 Nemecko' },
    { value: '+44', label: '+44', extra: '🇬🇧 Británia' }
  ];

  const salutationOptions = [
    { value: 'Pan', label: 'Pan' },
    { value: 'Pani', label: 'Pani' }
  ];

  const formatPhoneNumber = (value: string, prefix: string = '+421') => {
    const cleaned = value.replace(/\D/g, '');
    
    if (prefix === '+421' || prefix === '+420') {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').slice(0, 11);
    }
    return cleaned.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1 $2 $3').slice(0, 13);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value, data.phonePrefix || '+421');
    onUpdate('phone', formatted);
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="space-y-4">
      {isAutoFilled && autoFilledFrom && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium">Automaticky predvyplnené z: {autoFilledFrom}</span>
          </div>
        </div>
      )}

      {/* Name Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        {showSalutation && (
          <div className="sm:w-32">
            <OnboardingSelect
              label="Oslovenie"
              placeholder="Vyberte"
              value={data.salutation || ''}
              onValueChange={(value) => onUpdate('salutation', value)}
              options={salutationOptions}
              isCompleted={completedFields.has('salutation')}
            />
          </div>
        )}

        <div className="flex-1">
          <OnboardingInput
            label="Meno *"
            value={data.firstName}
            onChange={(e) => onUpdate('firstName', e.target.value)}
            placeholder="Vaše meno"
            isCompleted={completedFields.has('firstName')}
          />
        </div>

        <div className="flex-1">
          <OnboardingInput
            label="Priezvisko *"
            value={data.lastName}
            onChange={(e) => onUpdate('lastName', e.target.value)}
            placeholder="Vaše priezvisko"
            isCompleted={completedFields.has('lastName')}
          />
        </div>
      </div>

      {/* Email Section */}
      <OnboardingInput
        type="email"
        label="Email *"
        value={data.email}
        onChange={(e) => onUpdate('email', e.target.value)}
        placeholder="vas.email@priklad.sk"
        icon={<Mail className="h-5 w-5" />}
        isCompleted={completedFields.has('email')}
        error={emailValidation && data.email && !isEmailValid(data.email) ? 'Zadajte platnú emailovú adresu' : undefined}
      />

      {/* Phone Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-700">
          <Phone className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">Telefónne číslo *</span>
        </div>
        <div className="flex gap-3">
          {showPhonePrefix && (
            <OnboardingSelect
              value={data.phonePrefix || '+421'}
              onValueChange={(value) => onUpdate('phonePrefix', value)}
              options={phonePrefixes}
              className="w-44"
            />
          )}
          <div className="flex-1">
            <OnboardingInput
              value={data.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="123 456 789"
              className="font-mono"
              isCompleted={completedFields.has('phone')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonInputGroup;
