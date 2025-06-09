
import { useTranslation } from "react-i18next";
import OnboardingInput from "./OnboardingInput";
import OnboardingSelect from "./OnboardingSelect";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  onPrefixChange?: (prefix: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const PhoneNumberInput = ({
  value,
  onChange,
  prefix = '+421',
  onPrefixChange,
  label,
  placeholder,
  required = false,
  disabled = false
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

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        {displayLabel}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="flex gap-2">
        <div className="w-32">
          <OnboardingSelect
            value={prefix}
            onValueChange={onPrefixChange || (() => {})}
            options={prefixOptions}
            disabled={disabled || !onPrefixChange}
          />
        </div>
        
        <div className="flex-1">
          <OnboardingInput
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || '901 234 567'}
            disabled={disabled}
            hideLabel
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberInput;
