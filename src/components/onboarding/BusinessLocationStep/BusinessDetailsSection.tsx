
import React, { useState, useEffect } from "react";
import { Building } from "lucide-react";
import { useTranslation } from "react-i18next";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import OnboardingTextarea from "../ui/OnboardingTextarea";
import { MCC_CODES } from "../config/mccCodes";
import { formatTurnoverInput, parseTurnoverInput } from "../utils/formatUtils";
import { OnboardingField } from "@/pages/OnboardingConfigPage";

interface BusinessDetailsSectionProps {
  businessSubject: string;
  mccCode: string;
  monthlyTurnover: number;
  onUpdate: (field: string, value: string | number) => void;
  customFields?: OnboardingField[];
}

const BusinessDetailsSection = ({
  businessSubject,
  mccCode,
  monthlyTurnover,
  onUpdate,
  customFields
}: BusinessDetailsSectionProps) => {
  const { t } = useTranslation('forms');
  
  // Helper function to check if a field is enabled
  const isFieldEnabled = (fieldKey: string): boolean => {
    if (!customFields) return true; // Default behavior if no custom fields
    const field = customFields.find(f => f.fieldKey === fieldKey || f.fieldKey.endsWith(`.${fieldKey}`));
    return field ? field.isEnabled : true;
  };
  // Simple local state for display value
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
        {t('businessLocation.businessDetails.title')}
      </h4>
      
      {isFieldEnabled('businessSubject') && (
        <OnboardingTextarea
          label={t('businessLocation.businessDetails.businessSubjectRequired')}
          value={businessSubject}
          onChange={(e) => onUpdate('businessSubject', e.target.value)}
          placeholder={t('businessLocation.businessDetails.businessSubjectPlaceholder')}
          rows={3}
        />
      )}

      {isFieldEnabled('mccCode') && (
        <OnboardingSelect
          label={t('businessLocation.businessDetails.mccCodeRequired')}
          placeholder={t('businessLocation.businessDetails.mccCodePlaceholder')}
          value={mccCode}
          onValueChange={(value) => onUpdate('mccCode', value)}
          options={mccOptions}
        />
      )}

      {isFieldEnabled('monthlyTurnover') && (
        <OnboardingInput
          label={t('businessLocation.businessDetails.monthlyTurnoverRequired')}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleTurnoverChange}
          onFocus={handleTurnoverFocus}
          onBlur={handleTurnoverBlur}
          placeholder={t('businessLocation.businessDetails.monthlyTurnoverPlaceholder')}
        />
      )}
    </div>
  );
};

export default BusinessDetailsSection;
