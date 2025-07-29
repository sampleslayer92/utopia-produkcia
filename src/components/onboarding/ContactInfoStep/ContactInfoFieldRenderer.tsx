import React from 'react';
import { useStepConfiguration } from '@/hooks/useOnboardingConfiguration';
import { DynamicFieldRenderer } from '../components/DynamicFieldRenderer';
import { OnboardingData } from '@/types/onboarding';
import ContactInfoForm from './ContactInfoForm';

interface ContactInfoFieldRendererProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const ContactInfoFieldRenderer: React.FC<ContactInfoFieldRendererProps> = ({
  data,
  updateData
}) => {
  // Helper functions for updating data
  const onPersonDataUpdate = (field: string, value: string) => {
    updateData({
      contactInfo: {
        ...data.contactInfo,
        [field]: value
      }
    });
  };

  const onContactInfoUpdate = (field: string, value: string | boolean | string[]) => {
    updateData({
      contactInfo: {
        ...data.contactInfo,
        [field]: value
      }
    });
  };
  const { step, isStepEnabled, fields } = useStepConfiguration('contact_info');

  // If configuration is available and step is disabled, render nothing
  if (step && !isStepEnabled) {
    return null;
  }

  // If no configuration available, render default ContactInfoForm
  if (!step || fields.length === 0) {
    return (
      <ContactInfoForm
        data={data}
        completedFields={new Set()}
        onPersonDataUpdate={onPersonDataUpdate}
        onContactInfoUpdate={onContactInfoUpdate}
      />
    );
  }

  // Render dynamic fields based on configuration
  return (
    <div className="space-y-6">
      {fields.map((field) => {
        // Handle special contact form field
        if (field.field_key === 'contact_form') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <ContactInfoForm
                  data={data}
                  completedFields={new Set()}
                  onPersonDataUpdate={onPersonDataUpdate}
                  onContactInfoUpdate={onContactInfoUpdate}
                />
              )}
            </div>
          );
        }

        // Handle individual dynamic fields
        const fieldValue = (data.contactInfo as any)[field.field_key];
        
        return (
          <div key={field.id}>
            {field.is_enabled && (
              <DynamicFieldRenderer
                field={field}
                value={fieldValue}
                onChange={(value) => onContactInfoUpdate(field.field_key, value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};