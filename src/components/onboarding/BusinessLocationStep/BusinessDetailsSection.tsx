import { Building } from "lucide-react";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import OnboardingTextarea from "../ui/OnboardingTextarea";
import { MCC_CODES } from "../config/mccCodes";
import { useState, useEffect } from "react";
import { formatTurnoverInput, parseTurnoverInput } from "../utils/formatUtils";

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

  // Initialize turnover input - only format if there's an actual value and not focused
  useEffect(() => {
    console.log('=== BUSINESS DETAILS: Turnover effect ===', { 
      monthlyTurnover, 
      isFocused,
      currentInput: turnoverInput 
    });
    
    if (!isFocused) {
      // Only show formatted value if there's actually a value greater than 0
      if (monthlyTurnover > 0) {
        setTurnoverInput(formatTurnoverInput(monthlyTurnover.toString()));
      } else {
        // Keep field empty if no value or value is 0
        setTurnoverInput('');
      }
    }
  }, [monthlyTurnover, isFocused]);

  const handleTurnoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('=== TURNOVER CHANGE ===', { value });
    
    // Allow only numbers when typing
    const numericOnly = value.replace(/[^0-9]/g, '');
    setTurnoverInput(numericOnly);
  };

  const handleTurnoverFocus = () => {
    console.log('=== TURNOVER FOCUS ===', { monthlyTurnover });
    setIsFocused(true);
    // Show raw number for editing, or empty string if zero/empty
    if (monthlyTurnover > 0) {
      setTurnoverInput(monthlyTurnover.toString());
    } else {
      setTurnoverInput('');
    }
  };

  const handleTurnoverBlur = () => {
    console.log('=== TURNOVER BLUR ===', { turnoverInput });
    setIsFocused(false);
    
    // Parse the current input value
    const numericValue = parseTurnoverInput(turnoverInput);
    console.log('=== TURNOVER BLUR PARSED ===', numericValue);
    
    // Always update the parent with the final value
    onUpdate('monthlyTurnover', numericValue);
    
    // Format the display value with € symbol and commas
    if (numericValue > 0) {
      setTurnoverInput(formatTurnoverInput(numericValue.toString()));
    } else {
      setTurnoverInput('');
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
        inputMode="numeric"
        value={turnoverInput}
        onChange={handleTurnoverChange}
        onFocus={handleTurnoverFocus}
        onBlur={handleTurnoverBlur}
        placeholder={isFocused ? "Zadajte číslo" : "napr. 5,000 €, 12,500 €, 1,000,000 €"}
      />
    </div>
  );
};

export default BusinessDetailsSection;
