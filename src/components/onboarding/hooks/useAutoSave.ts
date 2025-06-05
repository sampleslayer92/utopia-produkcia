
import { useEffect, useRef } from 'react';
import { OnboardingData } from '@/types/onboarding';
import { toast } from 'sonner';

interface UseAutoSaveOptions {
  delay?: number;
  enabled?: boolean;
  onSave?: (data: OnboardingData) => Promise<void>;
  onError?: (error: Error) => void;
}

export const useAutoSave = (
  data: OnboardingData,
  options: UseAutoSaveOptions = {}
) => {
  const {
    delay = 2000,
    enabled = true,
    onSave,
    onError
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<string>('');
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (!enabled || !onSave) return;

    const currentDataString = JSON.stringify(data);
    
    // Skip if data hasn't changed
    if (currentDataString === previousDataRef.current) return;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      if (isSavingRef.current) return;
      
      try {
        isSavingRef.current = true;
        await onSave(data);
        previousDataRef.current = currentDataString;
        console.log('Auto-save completed successfully');
      } catch (error) {
        console.error('Auto-save failed:', error);
        if (onError) {
          onError(error as Error);
        } else {
          toast.error('Automatické uloženie zlyhalo');
        }
      } finally {
        isSavingRef.current = false;
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, onSave, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving: isSavingRef.current
  };
};
