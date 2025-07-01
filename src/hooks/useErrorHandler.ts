
import { useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ErrorLogData {
  contractId?: string;
  stepNumber?: number;
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
}

export const useErrorHandler = () => {
  const sessionIdRef = useRef(crypto.randomUUID());

  const logError = useCallback(async (errorData: ErrorLogData) => {
    try {
      await supabase
        .from('error_logs')
        .insert({
          contract_id: errorData.contractId,
          step_number: errorData.stepNumber,
          error_type: errorData.errorType,
          error_message: errorData.errorMessage,
          stack_trace: errorData.stackTrace,
          user_agent: navigator.userAgent,
          session_id: sessionIdRef.current
        });
    } catch (error) {
      console.error('Failed to log error:', error);
    }
  }, []);

  const handleError = useCallback(async (error: Error, context: Omit<ErrorLogData, 'errorType' | 'errorMessage'> = {}) => {
    const errorData: ErrorLogData = {
      ...context,
      errorType: error.name || 'UnknownError',
      errorMessage: error.message,
      stackTrace: error.stack
    };

    await logError(errorData);
    
    // Show user-friendly error message
    toast.error('Nastala chyba', {
      description: 'Problém bol automaticky nahlásený. Skúste znova za chvíľu.'
    });
  }, [logError]);

  const withErrorHandler = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: Omit<ErrorLogData, 'errorType' | 'errorMessage'>
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        await handleError(error as Error, context);
        return null;
      }
    };
  }, [handleError]);

  return {
    logError,
    handleError,
    withErrorHandler,
    sessionId: sessionIdRef.current
  };
};
