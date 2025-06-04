
import { useState, useCallback } from 'react';
import { ContractSelection } from '@/types/contractTable';

export const useContractSelection = (): ContractSelection => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);

  const selectAll = useCallback(() => {
    setIsAllSelected(true);
  }, []);

  const selectNone = useCallback(() => {
    setSelectedIds(new Set());
    setIsAllSelected(false);
  }, []);

  const toggleContract = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setIsAllSelected(false);
      return newSelected;
    });
  }, []);

  const toggleAll = useCallback((contractIds: string[]) => {
    if (isAllSelected || selectedIds.size === contractIds.length) {
      selectNone();
    } else {
      setSelectedIds(new Set(contractIds));
      setIsAllSelected(true);
    }
  }, [isAllSelected, selectedIds.size, selectNone]);

  return {
    selectedIds,
    isAllSelected,
    selectAll,
    selectNone,
    toggleContract,
    toggleAll,
  };
};
