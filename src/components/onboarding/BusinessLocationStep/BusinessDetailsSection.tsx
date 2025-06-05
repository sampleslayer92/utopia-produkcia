import { Building } from "lucide-react";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import OnboardingTextarea from "../ui/OnboardingTextarea";
import { MCC_CODES } from "../config/mccCodes";
import { useState } from "react";

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
  // Local state to preserve user input format during typing
  const [turnoverInput, setTurnoverInput] = useState(monthlyTurnover?.toString() || '');

  const mccOptions = MCC_CODES.map(code => ({
    value: code.value,
    label: code.label
  }));

  const handleTurnoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTurnoverInput(value);
    
    // Parse and update parent component with debounced approach
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      onUpdate('monthlyTurnover', numericValue);
    } else if (value === '') {
      onUpdate('monthlyTurnover', 0);
    }
  };

  const handleTurnoverBlur = () => {
    // Final validation and cleanup on blur
    const numericValue = parseFloat(turnoverInput);
    if (isNaN(numericValue) || numericValue < 0) {
      setTurnoverInput('0');
      onUpdate('monthlyTurnover', 0);
    } else {
      // Update input to show clean format if needed
      setTurnoverInput(numericValue.toString());
      onUpdate('monthlyTurnover', numericValue);
    }
  };

  // Sync local state when prop changes from external source
  if (monthlyTurnover?.toString() !== turnoverInput && turnoverInput === '') {
    setTurnoverInput(monthlyTurnover?.toString() || '');
  }

  return (
    <div className="space-y-6">
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
          type="number"
          inputMode="decimal"
          value={turnoverInput}
          onChange={handleTurnoverChange}
          onBlur={handleTurnoverBlur}
          placeholder="Zadajte mesačný obrat v EUR (napr. 5000, 12500.50, 1000000)"
          min="0"
          step="any"
        />
      </div>
    </div>
  );
};

export default BusinessDetailsSection;
