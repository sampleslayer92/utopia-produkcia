
import { useTranslation } from "react-i18next";
import OnboardingInput from "./OnboardingInput";
import OnboardingSelect from "./OnboardingSelect";

interface PhoneNumberInputProps {
  value?: string;
  phoneValue?: string; // Add support for phoneValue prop
  onChange?: (value: string) => void;
  onPhoneChange?: (value: string) => void; // Add support for onPhoneChange prop
  prefix?: string;
  prefixValue?: string; // Add support for prefixValue prop
  onPrefixChange?: (prefix: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  isCompleted?: boolean;
  error?: string;
}

const PhoneNumberInput = ({
  value,
  phoneValue,
  onChange,
  onPhoneChange,
  prefix = '+421',
  prefixValue,
  onPrefixChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  isCompleted = false,
  error
}: PhoneNumberInputProps) => {
  const { t } = useTranslation();

  const prefixOptions = [
    { value: '+421', label: '+421 (SK)' },
    { value: '+420', label: '+420 (CZ)' },
    { value: '+43', label: '+43 (AT)' },
    { value: '+49', label: '+49 (DE)' },
    { value: '+1', label: '+1 (US)' }
  ];

  const displayLabel = label || t('ui.phoneNumber.phoneNumber');
  
  // Use phoneValue if provided, otherwise use value
  const phoneVal = phoneValue !== undefined ? phoneValue : value || '';
  // Use prefixValue if provided, otherwise use prefix
  const prefixVal = prefixValue !== undefined ? prefixValue : prefix;
  // Use onPhoneChange if provided, otherwise use onChange
  const handlePhoneChange = onPhoneChange || onChange || (() => {});

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        {displayLabel}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="flex gap-2">
        <div className="w-32">
          <OnboardingSelect
            value={prefixVal}
            onValueChange={onPrefixChange || (() => {})}
            options={prefixOptions}
          />
        </div>
        
        <div className="flex-1">
          <OnboardingInput
            value={phoneVal}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder={placeholder || '901 234 567'}
            disabled={disabled}
            hideLabel
            isCompleted={isCompleted}
            error={error}
          />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneNumberInput;
