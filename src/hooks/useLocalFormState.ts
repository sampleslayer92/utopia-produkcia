
import { useState, useEffect, useCallback, useRef } from 'react';

export const useLocalFormState = <T>(initialData: T | null) => {
  const [localData, setLocalData] = useState<T | null>(null);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const initialDataRef = useRef<T | null>(null);

  // Initialize local data when initial data changes
  useEffect(() => {
    console.log('useLocalFormState: Initial data changed:', { 
      hasInitialData: !!initialData, 
      isInitialized,
      initialDataKeys: initialData ? Object.keys(initialData) : []
    });
    
    if (initialData && (!isInitialized || initialDataRef.current !== initialData)) {
      console.log('useLocalFormState: Initializing with new data');
      setLocalData(JSON.parse(JSON.stringify(initialData))); // Deep copy
      setHasLocalChanges(false);
      setIsInitialized(true);
      initialDataRef.current = initialData;
    }
  }, [initialData, isInitialized]);

  const updateLocalField = useCallback((path: string, value: any) => {
    console.log(`useLocalFormState: Updating field ${path} with value:`, value);
    
    setLocalData(prev => {
      if (!prev) {
        console.warn('Cannot update field: localData is null');
        return null;
      }
      
      const pathParts = path.split('.');
      const newData = JSON.parse(JSON.stringify(prev)); // Deep copy
      let current: any = newData;
      
      // Navigate to the parent object
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      // Set the final value
      const finalKey = pathParts[pathParts.length - 1];
      current[finalKey] = value;
      
      console.log('useLocalFormState: Updated local data');
      return newData;
    });
    
    setHasLocalChanges(true);
  }, []);

  const resetLocalData = useCallback(() => {
    console.log('useLocalFormState: Resetting to initial data');
    if (initialDataRef.current) {
      setLocalData(JSON.parse(JSON.stringify(initialDataRef.current))); // Deep copy
      setHasLocalChanges(false);
    }
  }, []);

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
    initialDataRef.current = null;
  }, []);

  return {
    localData,
    hasLocalChanges,
    updateLocalField,
    resetLocalData,
    commitLocalChanges,
    forceReset,
    isInitialized
  };
};
