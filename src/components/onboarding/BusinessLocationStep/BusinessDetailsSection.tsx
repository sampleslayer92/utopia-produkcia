
import { Building } from "lucide-react";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import OnboardingTextarea from "../ui/OnboardingTextarea";
import { MCC_CODES } from "../config/mccCodes";
import { useState, useEffect, useCallback } from "react";

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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [lastSavedValue, setLastSavedValue] = useState(monthlyTurnover);

  const mccOptions = MCC_CODES.map(code => ({
    value: code.value,
    label: code.label
  }));

  // Debounced save function
  const debouncedUpdate = useCallback((value: number) => {
    const timeoutId = setTimeout(() => {
      console.log(`Saving monthly turnover: ${value} EUR`);
      onUpdate('monthlyTurnover', value);
      setLastSavedValue(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [onUpdate]);

  const handleTurnoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTurnoverInput(value);
    
    console.log(`Turnover input changed: "${value}"`);
    
    // Parse and validate
    const numericValue = parseFloat(value.replace(/\s/g, ''));
    if (!isNaN(numericValue) && numericValue >= 0) {
      // Use debounced update for real-time changes
      const cleanup = debouncedUpdate(numericValue);
      return cleanup;
    } else if (value === '' || value === '0') {
      const cleanup = debouncedUpdate(0);
      return cleanup;
    }
  };

  const handleTurnoverFocus = () => {
    setIsInputFocused(true);
    console.log('Turnover input focused');
  };

  const handleTurnoverBlur = () => {
    setIsInputFocused(false);
    console.log('Turnover input blurred, forcing save');
    
    // Force immediate save on blur
    const numericValue = parseFloat(turnoverInput.replace(/\s/g, ''));
    if (isNaN(numericValue) || numericValue < 0) {
      console.log('Invalid value on blur, resetting to 0');
      setTurnoverInput('0');
      onUpdate('monthlyTurnover', 0);
      setLastSavedValue(0);
    } else {
      console.log(`Force saving on blur: ${numericValue} EUR`);
      // Clean format for display
      setTurnoverInput(numericValue.toString());
      onUpdate('monthlyTurnover', numericValue);
      setLastSavedValue(numericValue);
    }
  };

  // Sync local state when prop changes from external source (but not when user is typing)
  useEffect(() => {
    if (!isInputFocused && monthlyTurnover !== lastSavedValue) {
      console.log(`External turnover change detected: ${monthlyTurnover} EUR`);
      setTurnoverInput(monthlyTurnover?.toString() || '0');
      setLastSavedValue(monthlyTurnover);
    }
  }, [monthlyTurnover, isInputFocused, lastSavedValue]);

  // Initialize local state on mount
  useEffect(() => {
    if (turnoverInput === '' && monthlyTurnover) {
      setTurnoverInput(monthlyTurnover.toString());
      setLastSavedValue(monthlyTurnover);
    }
  }, []);

  // Debug logging for data flow
  useEffect(() => {
    console.log('BusinessDetailsSection state:', {
      turnoverInput,
      monthlyTurnover,
      lastSavedValue,
      isInputFocused
    });
  }, [turnoverInput, monthlyTurnover, lastSavedValue, isInputFocused]);

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

      <div className="space-y-2">
        <OnboardingInput
          label="Odhadovaný obrat (mesačne v EUR) *"
          type="number"
          inputMode="decimal"
          value={turnoverInput}
          onChange={handleTurnoverChange}
          onFocus={handleTurnoverFocus}
          onBlur={handleTurnoverBlur}
          placeholder="Zadajte mesačný obrat v EUR (napr. 5000, 12500.50, 1000000)"
          min="0"
          step="any"
        />
        
        {/* Visual indicator for saved state */}
        {lastSavedValue !== undefined && lastSavedValue > 0 && !isInputFocused && (
          <div className="text-xs text-green-600 flex items-center gap-1">
            ✓ Uložené: {lastSavedValue.toLocaleString('sk-SK')} EUR
          </div>
        )}
        
        {lastSavedValue === 0 && !isInputFocused && (
          <div className="text-xs text-amber-600 flex items-center gap-1">
            ⚠️ Obrat nie je zadaný - ovplyvní to kalkuláciu zisku
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDetailsSection;
