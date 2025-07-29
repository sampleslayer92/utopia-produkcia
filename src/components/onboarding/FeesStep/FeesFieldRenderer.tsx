import React from 'react';
import { useStepConfiguration } from '@/hooks/useOnboardingConfiguration';
import { DynamicFieldRenderer } from '../components/DynamicFieldRenderer';
import { OnboardingData } from '@/types/onboarding';
import RealTimeProfitCalculator from '../fees/RealTimeProfitCalculator';

interface FeesFieldRendererProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const FeesFieldRenderer: React.FC<FeesFieldRendererProps> = ({
  data,
  updateData
}) => {
  const { step, isStepEnabled, fields } = useStepConfiguration('fees');

  // If configuration is available and step is disabled, render nothing
  if (step && !isStepEnabled) {
    return null;
  }

  // If no configuration available, render default fees calculator
  if (!step || fields.length === 0) {
    return (
      <RealTimeProfitCalculator data={data} updateData={updateData} />
    );
  }

  // Render dynamic fields based on configuration
  return (
    <div className="space-y-6">
      {fields.map((field) => {
        // Handle special fees calculator
        if (field.field_key === 'profit_calculator') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <RealTimeProfitCalculator data={data} updateData={updateData} />
              )}
            </div>
          );
        }

        // Handle individual dynamic fields
        const fieldValue = (data.fees as any)[field.field_key];
        
        return (
          <div key={field.id}>
            {field.is_enabled && (
              <DynamicFieldRenderer
                field={field}
                value={fieldValue}
                onChange={(value) => {
                  updateData({
                    fees: {
                      ...data.fees,
                      [field.field_key]: value
                    }
                  });
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};