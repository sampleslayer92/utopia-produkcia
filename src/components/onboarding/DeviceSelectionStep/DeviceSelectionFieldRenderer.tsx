import React from 'react';
import { useStepConfiguration } from '@/hooks/useOnboardingConfiguration';
import { DynamicFieldRenderer } from '../components/DynamicFieldRenderer';
import { OnboardingData } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DeviceSelectionFieldRendererProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const DeviceSelectionFieldRenderer: React.FC<DeviceSelectionFieldRendererProps> = ({
  data,
  updateData
}) => {
  const { step, isStepEnabled, fields } = useStepConfiguration('device_selection');

  // If configuration is available and step is disabled, render nothing
  if (step && !isStepEnabled) {
    return null;
  }

  // If no configuration available, render default device selection
  if (!step || fields.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Device Selection</h3>
            <p className="text-muted-foreground mb-4">Select devices and services for your contract</p>
            <Button>Open Device Catalog</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render dynamic fields based on configuration
  return (
    <div className="space-y-6">
      {fields.map((field) => {
        // Handle special device selector component
        if (field.field_key === 'device_selector') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">{field.field_label}</h3>
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">Device selection interface will be loaded here</p>
                      <Button>Open Device Catalog</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        }

        // Handle MIF cards fields - these don't exist in DeviceSelection type, so we'll extend it
        if (field.field_key === 'mif_regulated_cards') {
          const currentValue = (data.deviceSelection as any).mifRegulatedCards || 0;
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <DynamicFieldRenderer
                  field={field}
                  value={currentValue}
                  onChange={(value) => updateData({
                    deviceSelection: {
                      ...data.deviceSelection,
                      mifRegulatedCards: parseFloat(value) || 0
                    } as any
                  })}
                />
              )}
            </div>
          );
        }

        if (field.field_key === 'mif_unregulated_cards') {
          const currentValue = (data.deviceSelection as any).mifUnregulatedCards || 0;
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <DynamicFieldRenderer
                  field={field}
                  value={currentValue}
                  onChange={(value) => updateData({
                    deviceSelection: {
                      ...data.deviceSelection,
                      mifUnregulatedCards: parseFloat(value) || 0
                    } as any
                  })}
                />
              )}
            </div>
          );
        }

        if (field.field_key === 'transaction_types') {
          const currentValue = (data.deviceSelection as any).transactionTypes || [];
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <DynamicFieldRenderer
                  field={field}
                  value={currentValue}
                  onChange={(value) => updateData({
                    deviceSelection: {
                      ...data.deviceSelection,
                      transactionTypes: Array.isArray(value) ? value : [value]
                    } as any
                  })}
                />
              )}
            </div>
          );
        }

        // Handle individual dynamic fields for device selection
        const fieldValue = (data.deviceSelection as any)[field.field_key];
        
        return (
          <div key={field.id}>
            {field.is_enabled && (
              <DynamicFieldRenderer
                field={field}
                value={fieldValue}
                onChange={(value) => updateData({
                  deviceSelection: {
                    ...data.deviceSelection,
                    [field.field_key]: value
                  }
                })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};