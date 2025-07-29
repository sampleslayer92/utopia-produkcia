import React from 'react';
import { useStepConfiguration } from '@/hooks/useOnboardingConfiguration';
import { DynamicFieldRenderer } from '../components/DynamicFieldRenderer';
import { OnboardingData, DeviceCard, ServiceCard } from '@/types/onboarding';
import SolutionSelectionSection from '../device-selection/SolutionSelectionSection';
import DynamicDeviceCatalogPanel from '../device-selection/DynamicDeviceCatalogPanel';
import LivePreviewPanel from '../device-selection/LivePreviewPanel';

interface DeviceSelectionFieldRendererProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  selectedSolutions: string[];
  onToggleSolution: (solutionId: string) => void;
  onAddDevice: (deviceTemplate: any) => void;
  onAddService: (serviceTemplate: any, category: string) => void;
  onUpdateCard: (cardId: string, updatedCard: DeviceCard | ServiceCard) => void;
  onRemoveCard: (cardId: string) => void;
  onClearAll: () => void;
  onEditCard: (card: DeviceCard | ServiceCard) => void;
}

export const DeviceSelectionFieldRenderer: React.FC<DeviceSelectionFieldRendererProps> = ({
  data,
  updateData,
  selectedSolutions,
  onToggleSolution,
  onAddDevice,
  onAddService,
  onUpdateCard,
  onRemoveCard,
  onClearAll,
  onEditCard
}) => {
  const { step, isStepEnabled, fields } = useStepConfiguration('device_selection');

  // If configuration is available and step is disabled, render nothing
  if (step && !isStepEnabled) {
    return null;
  }

  // If no configuration available, render default device selection components
  if (!step || fields.length === 0) {
    // Show solution selection if no solutions are selected
    if (selectedSolutions.length === 0) {
      return (
        <SolutionSelectionSection
          selectedSolutions={selectedSolutions}
          onToggleSolution={onToggleSolution}
          onNext={() => {}}
        />
      );
    }

    // Show device catalog and preview
    return (
      <div className="grid lg:grid-cols-2 gap-6 min-h-[600px]">
        <DynamicDeviceCatalogPanel
          selectedSolutions={selectedSolutions}
          onAddDevice={onAddDevice}
          onAddService={onAddService}
          businessLocations={data.businessLocations}
        />
        
        <LivePreviewPanel
          dynamicCards={data.deviceSelection.dynamicCards}
          onUpdateCard={onUpdateCard}
          onRemoveCard={onRemoveCard}
          onClearAll={onClearAll}
          onEditCard={onEditCard}
          businessLocations={data.businessLocations.map(loc => ({ id: loc.id, name: loc.name }))}
        />
      </div>
    );
  }

  // Render dynamic fields based on configuration
  return (
    <div className="space-y-6">
      {fields.map((field) => {
        // Handle special device selection components
        if (field.field_key === 'solution_selection') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <SolutionSelectionSection
                  selectedSolutions={selectedSolutions}
                  onToggleSolution={onToggleSolution}
                  onNext={() => {}}
                />
              )}
            </div>
          );
        }

        if (field.field_key === 'device_catalog') {
          return (
            <div key={field.id}>
              {field.is_enabled && selectedSolutions.length > 0 && (
                <DynamicDeviceCatalogPanel
                  selectedSolutions={selectedSolutions}
                  onAddDevice={onAddDevice}
                  onAddService={onAddService}
                  businessLocations={data.businessLocations}
                />
              )}
            </div>
          );
        }

        if (field.field_key === 'device_preview') {
          return (
            <div key={field.id}>
              {field.is_enabled && selectedSolutions.length > 0 && (
                <LivePreviewPanel
                  dynamicCards={data.deviceSelection.dynamicCards}
                  onUpdateCard={onUpdateCard}
                  onRemoveCard={onRemoveCard}
                  onClearAll={onClearAll}
                  onEditCard={onEditCard}
                  businessLocations={data.businessLocations.map(loc => ({ id: loc.id, name: loc.name }))}
                />
              )}
            </div>
          );
        }

        // Handle individual dynamic fields
        const fieldValue = (data.deviceSelection as any)[field.field_key];
        
        return (
          <div key={field.id}>
            {field.is_enabled && (
              <DynamicFieldRenderer
                field={field}
                value={fieldValue}
                onChange={(value) => {
                  updateData({
                    deviceSelection: {
                      ...data.deviceSelection,
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