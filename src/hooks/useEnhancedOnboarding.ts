
import { useCallback } from 'react';
import { useStepAnalytics } from './useStepAnalytics';
import { useErrorHandler } from './useErrorHandler';
import { useRealTimeCollaboration } from './useRealTimeCollaboration';

interface UseEnhancedOnboardingProps {
  contractId: string;
  userEmail: string;
  userName: string;
}

export const useEnhancedOnboarding = ({ 
  contractId, 
  userEmail, 
  userName 
}: UseEnhancedOnboardingProps) => {
  const { startStep, completeStep } = useStepAnalytics(contractId);
  const { handleError, withErrorHandler } = useErrorHandler();
  const { updateCurrentStep, activeSessions, conflicts } = useRealTimeCollaboration(
    contractId, 
    userEmail, 
    userName
  );

  const navigateToStep = useCallback(async (stepNumber: number, stepName: string) => {
    try {
      await startStep(stepNumber, stepName);
      updateCurrentStep(stepNumber);
    } catch (error) {
      await handleError(error as Error, { contractId, stepNumber });
    }
  }, [contractId, startStep, updateCurrentStep, handleError]);

  const completeCurrentStep = useCallback(async () => {
    try {
      await completeStep();
    } catch (error) {
      await handleError(error as Error, { contractId });
    }
  }, [completeStep, handleError, contractId]);

  const safeExecute = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    stepNumber?: number
  ) => {
    return withErrorHandler(fn, { contractId, stepNumber });
  }, [withErrorHandler, contractId]);

  return {
    navigateToStep,
    completeCurrentStep,
    safeExecute,
    activeSessions,
    conflicts,
    hasConflicts: conflicts.length > 0
  };
};
