
import { useState, useEffect } from "react";
import { Mail, Phone, User } from "lucide-react";
import OnboardingInput from "./OnboardingInput";
import OnboardingSelect from "./OnboardingSelect";
import { ContactPerson } from "@/types/contactPerson";

interface ContactPersonFormProps {
  initialValues: ContactPerson;
  onChange: (values: ContactPerson) => void;
  completedFields?: Set<string>;
  showSalutation?: boolean;
  isAutoFilled?: boolean;
  autoFilledFrom?: string;
  allowReset?: boolean;
  onReset?: () => void;
}

const ContactPersonForm = ({
  initialValues,
  onChange,
  completedFields = new Set(),
  showSalutation = false,
  isAutoFilled = false,
  autoFilledFrom,
  allowReset = false,
  onReset
}: ContactPersonFormProps) => {
  const [formData, setFormData] = useState<ContactPerson>(initialValues);

  const phonePrefixes = [
    { value: '+421', label: '🇸🇰', extra: 'Slovensko', flagUrl: 'https://flagcdn.com/24x18/sk.png' },
    { value: '+420', label: '🇨🇿', extra: 'Česko', flagUrl: 'https://flagcdn.com/24x18/cz.png' },
    { value: '+43', label: '🇦🇹', extra: 'Rakúsko', flagUrl: 'https://flagcdn.com/24x18/at.png' },
    { value: '+36', label: '🇭🇺', extra: 'Maďarsko', flagUrl: 'https://flagcdn.com/24x18/hu.png' },
    { value: '+48', label: '🇵🇱', extra: 'Poľsko', flagUrl: 'https://flagcdn.com/24x18/pl.png' },
    { value: '+49', label: '🇩🇪', extra: 'Nemecko', flagUrl: 'https://flagcdn.com/24x18/de.png' },
    { value: '+44', label: '🇬🇧', extra: 'Británia', flagUrl: 'https://flagcdn.com/24x18/gb.png' }
  ];

  const formatPhoneNumber = (value: string, prefix: string = '+421') => {
    const cleaned = value.replace(/\D/g, '');
    
    if (prefix === '+421' || prefix === '+420') {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3').slice(0, 11);
    }
    return cleaned.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1 $2 $3').slice(0, 13);
  };

  const updateField = (field: keyof ContactPerson, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value, formData.phoneCountryCode);
    updateField('phoneNumber', formatted);
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Sync with initialValues when they change
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  return (
    <div className="space-y-4">
      {isAutoFilled && autoFilledFrom && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Automaticky predvyplnené z: {autoFilledFrom}</span>
            </div>
            {allowReset && onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Resetovať
              </button>
            )}
          </div>
        </div>
      )}

      {/* Name Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <OnboardingInput
            label="Meno *"
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="Vaše meno"
            isCompleted={completedFields.has('firstName')}
          />
        </div>

        <div className="flex-1">
          <OnboardingInput
            label="Priezvisko *"
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Vaše priezvisko"
            isCompleted={completedFields.has('lastName')}
          />
        </div>
      </div>

      {/* Email Section */}
      <OnboardingInput
        type="email"
        label="Email *"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        placeholder="vas.email@priklad.sk"
        icon={<Mail className="h-5 w-5" />}
        isCompleted={completedFields.has('email')}
        error={formData.email && !isEmailValid(formData.email) ? 'Zadajte platnú emailovú adresu' : undefined}
      />

      {/* Phone Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-700">
          <Phone className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">Telefónne číslo *</span>
        </div>
        <div className="flex gap-3">
          <OnboardingSelect
            value={formData.phoneCountryCode}
            onValueChange={(value) => updateField('phoneCountryCode', value)}
            options={phonePrefixes}
            className="w-20"
            compact={true}
            showTooltip={true}
          />
          <div className="flex-1">
            <OnboardingInput
              value={formData.phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="123 456 789"
              className="font-mono"
              isCompleted={completedFields.has('phoneNumber')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPersonForm;
