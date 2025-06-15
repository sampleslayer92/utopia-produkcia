
import { useEffect, useRef, useState } from 'react';
import { OnboardingData } from '@/types/onboarding';
import { toast } from 'sonner';

interface UseEnhancedAutoSaveOptions {
  delay?: number;
  enabled?: boolean;
  onSave?: (data: OnboardingData) => Promise<void>;
  onError?: (error: Error) => void;
  showToasts?: boolean;
}

export const useEnhancedAutoSave = (
  data: OnboardingData,
  options: UseEnhancedAutoSaveOptions = {}
) => {
  const {
    delay = 3000,
    enabled = true,
    onSave,
    onError,
    showToasts = false
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (!enabled || !onSave) return;

    const currentDataString = JSON.stringify(data);
    
    // Skip if data hasn't changed
    if (currentDataString === previousDataRef.current) return;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSaveStatus('idle');

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      if (isSaving) return;
      
      try {
        setIsSaving(true);
        setSaveStatus('saving');
        
        await onSave(data);
        
        previousDataRef.current = currentDataString;
        setLastSaved(new Date());
        setSaveStatus('saved');
        
        if (showToasts) {
          toast.success('Zmeny uložené', {
            description: 'Vaše údaje boli automaticky uložené'
          });
        }
        
        console.log('Enhanced auto-save completed successfully');
      } catch (error) {
        console.error('Enhanced auto-save failed:', error);
        setSaveStatus('error');
        
        if (onError) {
          onError(error as Error);
        } else if (showToasts) {
          toast.error('Chyba pri ukladaní', {
            description: 'Skúste uložiť zmeny manuálne'
          });
        }
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, onSave, onError, showToasts, isSaving]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const forceSave = async () => {
    if (isSaving || !onSave) return;
    
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      await onSave(data);
      setLastSaved(new Date());
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    lastSaved,
    saveStatus,
    forceSave
  };
};
