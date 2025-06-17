
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
    
    // Calculate completion for each step
    return steps.map(step => calculateStepCompletion(step, data));
  }, [data]);

  const overallProgress = useMemo(() => {
    return calculateOverallProgress(stepProgress, currentStep);
  }, [stepProgress, currentStep]);

  return {
    stepProgress,
    overallProgress
  };
};

// Re-export types for backward compatibility
export type { StepProgress };
