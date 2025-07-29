import React from 'react';
import { useStepConfiguration } from '@/hooks/useOnboardingConfiguration';
import { DynamicFieldRenderer } from '../components/DynamicFieldRenderer';
import { OnboardingData } from '@/types/onboarding';
import BusinessLocationCard from './BusinessLocationCard';
import EmptyState from './EmptyState';
import { useBusinessLocationManager } from './BusinessLocationManager';

interface BusinessLocationFieldRendererProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  selectedLocationId: string | null;
  isOpeningHoursModalOpen: boolean;
  onOpeningHoursEdit: (locationId: string) => void;
  onOpeningHoursSave: (locationId: string, hours: any[]) => void;
}

export const BusinessLocationFieldRenderer: React.FC<BusinessLocationFieldRendererProps> = ({
  data,
  updateData,
  selectedLocationId,
  isOpeningHoursModalOpen,
  onOpeningHoursEdit,
  onOpeningHoursSave
}) => {
  const { step, isStepEnabled, fields } = useStepConfiguration('business_locations');
  const { 
    expandedLocationId,
    addBusinessLocation, 
    removeBusinessLocation, 
    updateBusinessLocation,
    updateBankAccounts,
    updateBusinessDetails
  } = useBusinessLocationManager(data, updateData);

  // If configuration is available and step is disabled, render nothing
  if (step && !isStepEnabled) {
    return null;
  }

  // If no configuration available, render default business location management
  if (!step || fields.length === 0) {
    return (
      <div className="space-y-4">
        {data.businessLocations.length === 0 ? (
          <EmptyState onAddLocation={addBusinessLocation} />
        ) : (
          data.businessLocations.map((location, index) => (
            <BusinessLocationCard
              key={location.id}
              location={location}
              index={index}
              data={data}
              isExpanded={expandedLocationId === location.id}
              onToggle={() => {/* Set expansion logic */}}
              onUpdate={(field, value) => updateBusinessLocation(location.id, field, value)}
              onBankAccountsUpdate={(accounts) => updateBankAccounts(location.id, accounts)}
              onBusinessDetailsUpdate={(field, value) => updateBusinessDetails(location.id, field, value)}
              onRemove={() => removeBusinessLocation(location.id)}
              onOpeningHoursEdit={() => onOpeningHoursEdit(location.id)}
            />
          ))
        )}
      </div>
    );
  }

  // Render dynamic fields based on configuration
  return (
    <div className="space-y-6">
      {fields.map((field) => {
        // Handle special business location management
        if (field.field_key === 'business_location_manager') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <div className="space-y-4">
                  {data.businessLocations.length === 0 ? (
                    <EmptyState onAddLocation={addBusinessLocation} />
                  ) : (
                    data.businessLocations.map((location, index) => (
                      <BusinessLocationCard
                        key={location.id}
                        location={location}
                        index={index}
                        data={data}
                        isExpanded={expandedLocationId === location.id}
                        onToggle={() => {/* Set expansion logic */}}
                        onUpdate={(field, value) => updateBusinessLocation(location.id, field, value)}
                        onBankAccountsUpdate={(accounts) => updateBankAccounts(location.id, accounts)}
                        onBusinessDetailsUpdate={(field, value) => updateBusinessDetails(location.id, field, value)}
                        onRemove={() => removeBusinessLocation(location.id)}
                        onOpeningHoursEdit={() => onOpeningHoursEdit(location.id)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        }

        // Handle individual dynamic fields
        const fieldValue = (data.businessLocations[0] as any)?.[field.field_key];
        
        return (
          <div key={field.id}>
            {field.is_enabled && (
              <DynamicFieldRenderer
                field={field}
                value={fieldValue}
                onChange={(value) => {
                  if (data.businessLocations.length > 0) {
                    updateBusinessLocation(data.businessLocations[0].id, field.field_key, value);
                  }
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};