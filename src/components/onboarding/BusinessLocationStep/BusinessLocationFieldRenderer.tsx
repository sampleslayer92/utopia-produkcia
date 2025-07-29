import React, { useState } from 'react';
import { useStepConfiguration } from '@/hooks/useOnboardingConfiguration';
import { DynamicFieldRenderer } from '../components/DynamicFieldRenderer';
import { OnboardingData } from '@/types/onboarding';
import BusinessLocationCard from './BusinessLocationCard';
import EmptyState from './EmptyState';
import { useBusinessLocationManager } from './BusinessLocationManager';

interface BusinessLocationFieldRendererProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const BusinessLocationFieldRenderer: React.FC<BusinessLocationFieldRendererProps> = ({
  data,
  updateData
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isOpeningHoursModalOpen, setIsOpeningHoursModalOpen] = useState(false);
  
  // Helper functions for managing opening hours
  const onOpeningHoursEdit = (locationId: string) => {
    setSelectedLocationId(locationId);
    setIsOpeningHoursModalOpen(true);
  };

  const onOpeningHoursSave = (locationId: string, hours: any[]) => {
    // Update business location opening hours - convert hours array to string
    const hoursString = JSON.stringify(hours);
    const updatedLocations = data.businessLocations.map(location =>
      location.id === locationId ? { ...location, openingHours: hoursString } : location
    );
    updateData({ businessLocations: updatedLocations });
    setIsOpeningHoursModalOpen(false);
  };
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