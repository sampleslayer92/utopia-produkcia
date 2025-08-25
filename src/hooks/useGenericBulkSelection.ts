
import { useState } from 'react';

export interface BulkSelectionState<T extends { id: string }> {
  selectedItems: string[];
  isItemSelected: (id: string) => boolean;
  selectItem: (id: string) => void;
  selectAll: (items: T[]) => void;
  clearSelection: () => void;
  isAllSelected: boolean;
}

export const useGenericBulkSelection = <T extends { id: string }>(
  items: T[] = []
): BulkSelectionState<T> => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const isItemSelected = (id: string) => selectedItems.includes(id);

  const selectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const selectAll = (itemsToSelect: T[]) => {
    if (selectedItems.length === itemsToSelect.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(itemsToSelect.map(item => item.id));
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const isAllSelected = selectedItems.length === items.length && items.length > 0;

  return {
    selectedItems,
    isItemSelected,
    selectItem,
    selectAll,
    clearSelection,
    isAllSelected
  };
};
