
import { useMemo } from 'react';
import { OnboardingData } from '@/types/onboarding';
import { 
  createStepProgressConfig, 
  calculateStepCompletion, 
  calculateOverallProgress,
  type StepProgress 
} from './utils/stepProgressUtils';

export const useProgressTracking = (data: OnboardingData, currentStep: number) => {
  const stepProgress = useMemo(() => {
    const steps = createStepProgressConfig(data);
    
    // Calculate completion for each step and return as object indexed by step number
    const progressArray = steps.map(step => calculateStepCompletion(step, data));
    
    // Convert array to object for easier access
    const progressObject: { [key: number]: StepProgress } = {};
    progressArray.forEach(step => {
      progressObject[step.stepNumber] = step;
    });
    
    return progressObject;
  }, [data]);

  const overallProgress = useMemo(() => {
    // Convert object back to array for overall progress calculation
    const progressArray = Object.values(stepProgress);
    return calculateOverallProgress(progressArray, currentStep);
  }, [stepProgress, currentStep]);

  return {
    stepProgress,
    overallProgress
  };
};

// Re-export types for backward compatibility
export type { StepProgress };
