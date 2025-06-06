
import { Building } from "lucide-react";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import OnboardingTextarea from "../ui/OnboardingTextarea";
import { MCC_CODES } from "../config/mccCodes";
import { useState, useEffect } from "react";
import { formatCurrencyInput, parseCurrencyInput } from "../utils/formatUtils";

interface BusinessDetailsSectionProps {
  businessSubject: string;
  mccCode: string;
  monthlyTurnover: number;
  onUpdate: (field: string, value: string | number) => void;
}

const BusinessDetailsSection = ({
  businessSubject,
  mccCode,
  monthlyTurnover,
  onUpdate
}: BusinessDetailsSectionProps) => {
  // Local state for turnover input with formatting
  const [turnoverInput, setTurnoverInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const mccOptions = MCC_CODES.map(code => ({
    value: code.value,
    label: code.label
  }));

  // Initialize turnover input when component mounts or value changes externally
  useEffect(() => {
    if (!isFocused) {
      if (monthlyTurnover === 0) {
        setTurnoverInput('');
      } else {
        setTurnoverInput(formatCurrencyInput(monthlyTurnover.toString()));
      }
    }
  }, [monthlyTurnover, isFocused]);

  const handleTurnoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTurnoverInput(value);
    
    // Parse and update parent component
    const numericValue = parseCurrencyInput(value);
    onUpdate('monthlyTurnover', numericValue);
  };

  const handleTurnoverFocus = () => {
    setIsFocused(true);
    // Clear field if it's 0 or show raw number for editing
    if (monthlyTurnover === 0) {
      setTurnoverInput('');
    } else {
      setTurnoverInput(monthlyTurnover.toString());
    }
  };

  const handleTurnoverBlur = () => {
    setIsFocused(false);
    // Format the value for display
    const numericValue = parseCurrencyInput(turnoverInput);
    if (numericValue === 0) {
      setTurnoverInput('');
      onUpdate('monthlyTurnover', 0);
    } else {
      setTurnoverInput(formatCurrencyInput(numericValue.toString()));
      onUpdate('monthlyTurnover', numericValue);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
        <Building className="h-4 w-4" />
        Údaje o podnikaní
      </h4>
      
      <OnboardingTextarea
        label="Predmet podnikania *"
        value={businessSubject}
        onChange={(e) => onUpdate('businessSubject', e.target.value)}
        placeholder="Opíšte hlavné aktivity vašej prevádzky..."
        rows={3}
      />

      <OnboardingSelect
        label="MCC kód *"
        placeholder="Vyberte kategóriu podnikania"
        value={mccCode}
        onValueChange={(value) => onUpdate('mccCode', value)}
        options={mccOptions}
      />

      <OnboardingInput
        label="Odhadovaný obrat (mesačne v EUR) *"
        type="text"
        inputMode="decimal"
        value={turnoverInput}
        onChange={handleTurnoverChange}
        onFocus={handleTurnoverFocus}
        onBlur={handleTurnoverBlur}
        placeholder={isFocused ? "Zadajte číslo" : "napr. 5 000, 12 500, 1 000 000"}
      />
    </div>
  );
};

export default BusinessDetailsSection;
