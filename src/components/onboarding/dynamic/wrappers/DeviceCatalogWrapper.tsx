import React from 'react';
import DynamicDeviceCatalogPanel from '../../device-selection/DynamicDeviceCatalogPanel';
import { ModuleComponentProps } from '../ModuleComponentRegistry';

const DeviceCatalogWrapper = ({ 
  data, 
  updateData, 
  configuration = {},
  isReadOnly = false 
}: ModuleComponentProps) => {
  const selectedSolutions = data.deviceSelection?.selectedSolutions || [];
  const businessLocations = data.businessLocations || [];

  const handleAddDevice = (deviceTemplate: any) => {
    if (isReadOnly) return;
    // Handle device addition logic here
    console.log('Adding device:', deviceTemplate);
  };

  const handleAddService = (serviceTemplate: any, category: string) => {
    if (isReadOnly) return;
    // Handle service addition logic here
    console.log('Adding service:', serviceTemplate, category);
  };

  return (
    <DynamicDeviceCatalogPanel
      selectedSolutions={selectedSolutions}
      onAddDevice={handleAddDevice}
      onAddService={handleAddService}
      businessLocations={businessLocations}
    />
  );
};

export default DeviceCatalogWrapper;