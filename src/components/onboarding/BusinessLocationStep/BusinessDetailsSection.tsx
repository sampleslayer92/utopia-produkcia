
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Building } from "lucide-react";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import OnboardingTextarea from "../ui/OnboardingTextarea";
import { MCC_CODES } from "../config/mccCodes";
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
  const { t } = useTranslation();
  const [displayValue, setDisplayValue] = useState('');

  const mccOptions = MCC_CODES.map(code => ({
    value: code.value,
    label: code.label
  }));

  // Initialize display value only once
  useEffect(() => {
    if (monthlyTurnover > 0) {
      setDisplayValue(formatTurnoverInput(monthlyTurnover.toString()));
    } else {
      setDisplayValue('');
    }
  }, []); // Only run on mount

  const handleTurnoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers when typing
    const numericOnly = value.replace(/[^0-9]/g, '');
    setDisplayValue(numericOnly);
  };

  const handleTurnoverFocus = () => {
    // If the field is formatted, show only numbers for editing
    if (displayValue.includes('€')) {
      const numericValue = parseTurnoverInput(displayValue);
      setDisplayValue(numericValue > 0 ? numericValue.toString() : '');
    }
  };

  const handleTurnoverBlur = () => {
    // Parse and save the value
    const numericValue = parseTurnoverInput(displayValue);
    onUpdate('monthlyTurnover', numericValue);
    
    // Format for display
    if (numericValue > 0) {
      setDisplayValue(formatTurnoverInput(numericValue.toString()));
    } else {
      setDisplayValue('');
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
        <Building className="h-4 w-4" />
        {t('ui.businessDetails.title')}
      </h4>
      
      <OnboardingTextarea
        label={t('ui.businessDetails.businessSubject')}
        value={businessSubject}
        onChange={(e) => onUpdate('businessSubject', e.target.value)}
        placeholder={t('ui.businessDetails.businessSubjectPlaceholder')}
        rows={3}
      />

      <OnboardingSelect
        label={t('ui.businessDetails.mccCode')}
        placeholder={t('ui.businessDetails.mccCodePlaceholder')}
        value={mccCode}
        onValueChange={(value) => onUpdate('mccCode', value)}
        options={mccOptions}
      />

      <OnboardingInput
        label={t('ui.businessDetails.monthlyTurnover')}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleTurnoverChange}
        onFocus={handleTurnoverFocus}
        onBlur={handleTurnoverBlur}
        placeholder={t('ui.businessDetails.monthlyTurnoverPlaceholder')}
      />
    </div>
  );
};

export default BusinessDetailsSection;
