
import { useState } from 'react';

export interface BulkSelectionState<T> {
  selectedItems: string[];
  isAllSelected: boolean;
  selectItem: (itemId: string) => void;
  selectAll: (items: T[]) => void;
  clearSelection: () => void;
  isItemSelected: (itemId: string) => boolean;
}

export const useGenericBulkSelection = <T extends { id: string }>(
  items: T[] = []
): BulkSelectionState<T> => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const selectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAll = (items: T[]) => {
    const allItemIds = items.map(item => item.id);
    if (selectedItems.length === allItemIds.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allItemIds);
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const isItemSelected = (itemId: string) => {
    return selectedItems.includes(itemId);
  };

  const isAllSelected = selectedItems.length === items.length && items.length > 0;

  return {
    selectedItems,
    isAllSelected,
    selectItem,
    selectAll,
    clearSelection,
    isItemSelected
  };
};
