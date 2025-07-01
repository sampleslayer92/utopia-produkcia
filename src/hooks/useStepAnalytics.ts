
import { useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useStepAnalytics = (contractId: string) => {
  const sessionIdRef = useRef(crypto.randomUUID());
  const currentStepRef = useRef<{
    stepNumber: number;
    stepName: string;
    startTime: Date;
  } | null>(null);

  const startStep = useCallback(async (stepNumber: number, stepName: string) => {
    // Complete previous step if it exists
    if (currentStepRef.current) {
      await completeStep();
    }

    const startTime = new Date();
    currentStepRef.current = { stepNumber, stepName, startTime };

    try {
      await supabase
        .from('step_analytics')
        .insert({
          contract_id: contractId,
          step_number: stepNumber,
          step_name: stepName,
          started_at: startTime.toISOString(),
          user_agent: navigator.userAgent,
          session_id: sessionIdRef.current
        });
    } catch (error) {
      console.error('Failed to track step start:', error);
    }
  }, [contractId]);

  const completeStep = useCallback(async () => {
    if (!currentStepRef.current) return;

    const { stepNumber, stepName, startTime } = currentStepRef.current;
    const completedAt = new Date();
    const durationSeconds = Math.floor((completedAt.getTime() - startTime.getTime()) / 1000);

    try {
      await supabase
        .from('step_analytics')
        .update({
          completed_at: completedAt.toISOString(),
          duration_seconds: durationSeconds
        })
        .eq('contract_id', contractId)
        .eq('step_number', stepNumber)
        .eq('session_id', sessionIdRef.current)
        .is('completed_at', null);

      currentStepRef.current = null;
    } catch (error) {
      console.error('Failed to complete step tracking:', error);
    }
  }, [contractId]);

  // Auto-complete step on unmount
  useEffect(() => {
    return () => {
      if (currentStepRef.current) {
        completeStep();
      }
    };
  }, [completeStep]);

  return {
    startStep,
    completeStep,
    sessionId: sessionIdRef.current
  };
};
