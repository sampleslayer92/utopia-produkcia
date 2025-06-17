
import { useState, useEffect, useCallback } from 'react';

export const useLocalFormState = <T>(initialData: T | null) => {
  const [localData, setLocalData] = useState<T | null>(null);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  // Initialize local data when initial data changes
  useEffect(() => {
    if (initialData) {
      setLocalData({ ...initialData });
      setHasLocalChanges(false);
    }
  }, [initialData]);

  const updateLocalField = useCallback((path: string, value: any) => {
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
    if (initialData) {
      setLocalData({ ...initialData });
      setHasLocalChanges(false);
    }
  }, [initialData]);

  const commitLocalChanges = useCallback(() => {
    setHasLocalChanges(false);
    return localData;
  }, [localData]);

  return {
    localData,
    hasLocalChanges,
    updateLocalField,
    resetLocalData,
    commitLocalChanges
  };
};
