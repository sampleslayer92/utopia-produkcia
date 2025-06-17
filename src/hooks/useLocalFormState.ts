
import { useState, useEffect, useCallback } from 'react';

export const useLocalFormState = <T>(initialData: T | null) => {
  const [localData, setLocalData] = useState<T | null>(null);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize local data only once when initial data is first available
  useEffect(() => {
    if (initialData && !isInitialized) {
      console.log('useLocalFormState: Initializing with data:', initialData);
      setLocalData({ ...initialData });
      setHasLocalChanges(false);
      setIsInitialized(true);
    }
  }, [initialData, isInitialized]);

  const updateLocalField = useCallback((path: string, value: any) => {
    console.log(`useLocalFormState: Updating field ${path} with value:`, value);
    setLocalData(prev => {
      if (!prev) return null;
      
      const pathParts = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      // Navigate to the parent object
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current[part] = { ...current[part] };
        current = current[part];
      }
      
      // Set the final value
      const finalKey = pathParts[pathParts.length - 1];
      current[finalKey] = value;
      
      return newData;
    });
    setHasLocalChanges(true);
  }, []);

  const resetLocalData = useCallback(() => {
    console.log('useLocalFormState: Resetting to initial data');
    if (initialData) {
      setLocalData({ ...initialData });
      setHasLocalChanges(false);
    }
  }, [initialData]);

  const commitLocalChanges = useCallback(() => {
    console.log('useLocalFormState: Committing changes');
    setHasLocalChanges(false);
    return localData;
  }, [localData]);

  const forceReset = useCallback(() => {
    console.log('useLocalFormState: Force reset');
    setIsInitialized(false);
    setHasLocalChanges(false);
    setLocalData(null);
  }, []);

  return {
    localData,
    hasLocalChanges,
    updateLocalField,
    resetLocalData,
    commitLocalChanges,
    forceReset
  };
};
