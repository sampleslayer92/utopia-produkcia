
import { useState } from 'react';

export interface BulkSelectionState<T extends { id: string }> {
  selectedItems: Set<string>;
  isItemSelected: (id: string) => boolean;
  selectItem: (id: string) => void;
  selectAll: (items: T[]) => void;
  clearSelection: () => void;
  isAllSelected: boolean;
}

export const useGenericBulkSelection = <T extends { id: string }>(
  items: T[] = []
): BulkSelectionState<T> => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const isItemSelected = (id: string) => selectedItems.has(id);

  const selectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = (itemsToSelect: T[]) => {
    if (selectedItems.size === itemsToSelect.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(itemsToSelect.map(item => item.id)));
    }
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const isAllSelected = selectedItems.size === items.length && items.length > 0;

  return {
    selectedItems,
    isItemSelected,
    selectItem,
    selectAll,
    clearSelection,
    isAllSelected
  };
};
