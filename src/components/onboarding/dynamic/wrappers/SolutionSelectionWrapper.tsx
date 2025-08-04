import React from 'react';
import SolutionSelectionSection from '../../device-selection/SolutionSelectionSection';
import { ModuleComponentProps } from '../ModuleComponentRegistry';

const SolutionSelectionWrapper = ({ 
  data, 
  updateData, 
  onNext, 
  configuration = {},
  isReadOnly = false 
}: ModuleComponentProps) => {
  const selectedSolutions = data.deviceSelection?.selectedSolutions || [];

  const handleToggleSolution = (solutionId: string) => {
    if (isReadOnly) return;
    
    const currentSolutions = selectedSolutions.includes(solutionId)
      ? selectedSolutions.filter(id => id !== solutionId)
      : [...selectedSolutions, solutionId];

    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        selectedSolutions: currentSolutions
      }
    });
  };

  return (
    <SolutionSelectionSection
      selectedSolutions={selectedSolutions}
      onToggleSolution={handleToggleSolution}
      onNext={onNext}
      isReadOnly={isReadOnly}
    />
  );
};

export default SolutionSelectionWrapper;