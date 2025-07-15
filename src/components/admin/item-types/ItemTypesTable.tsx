import { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Package, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ItemType, useUpdateItemType } from '@/hooks/useItemTypes';
import { SortableItemTypeRow } from './SortableItemTypeRow';
import { useToast } from '@/hooks/use-toast';

interface ItemTypesTableProps {
  itemTypes: ItemType[];
  onEdit: (itemType: ItemType) => void;
}

export const ItemTypesTable = ({ itemTypes, onEdit }: ItemTypesTableProps) => {
  const updateItemType = useUpdateItemType();
  const { toast } = useToast();
  const [selectedItemTypes, setSelectedItemTypes] = useState<Set<string>>(new Set());
  const [sortedItemTypes, setSortedItemTypes] = useState(itemTypes);

  // Update sorted item types when itemTypes prop changes
  useEffect(() => {
    setSortedItemTypes([...itemTypes].sort((a, b) => a.position - b.position));
  }, [itemTypes]);

  const handleToggleActive = (itemType: ItemType) => {
    updateItemType.mutate({
      ...itemType,
      is_active: !itemType.is_active,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedItemTypes.findIndex((item) => item.id === active.id);
      const newIndex = sortedItemTypes.findIndex((item) => item.id === over.id);
      
      const newOrder = arrayMove(sortedItemTypes, oldIndex, newIndex);
      setSortedItemTypes(newOrder);

      // Update positions in database
      newOrder.forEach((itemType, index) => {
        if (itemType.position !== index) {
          updateItemType.mutate({
            ...itemType,
            position: index,
          });
        }
      });

      toast({
        title: "Poradie aktualizované",
        description: "Pozície typov položiek boli úspešne aktualizované.",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItemTypes(new Set(sortedItemTypes.map(item => item.id)));
    } else {
      setSelectedItemTypes(new Set());
    }
  };

  const handleSelectionChange = (itemTypeId: string, selected: boolean) => {
    const newSelection = new Set(selectedItemTypes);
    if (selected) {
      newSelection.add(itemTypeId);
    } else {
      newSelection.delete(itemTypeId);
    }
    setSelectedItemTypes(newSelection);
  };

  const handleBulkActivate = () => {
    const selectedItems = sortedItemTypes.filter(item => selectedItemTypes.has(item.id));
    selectedItems.forEach(itemType => {
      updateItemType.mutate({
        ...itemType,
        is_active: true,
      });
    });
    setSelectedItemTypes(new Set());
    toast({
      title: "Typy položiek aktivované",
      description: `${selectedItems.length} typov položiek bolo aktivovaných.`,
    });
  };

  const handleBulkDeactivate = () => {
    const selectedItems = sortedItemTypes.filter(item => selectedItemTypes.has(item.id));
    selectedItems.forEach(itemType => {
      updateItemType.mutate({
        ...itemType,
        is_active: false,
      });
    });
    setSelectedItemTypes(new Set());
    toast({
      title: "Typy položiek deaktivované",
      description: `${selectedItems.length} typov položiek bolo deaktivovaných.`,
    });
  };

  const isAllSelected = selectedItemTypes.size === sortedItemTypes.length && sortedItemTypes.length > 0;

  return (
    <div className="space-y-4">
      {selectedItemTypes.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedItemTypes.size} typov položiek vybratých
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkActivate}
            className="ml-auto"
          >
            <Check className="h-4 w-4 mr-1" />
            Aktivovať
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkDeactivate}
          >
            <X className="h-4 w-4 mr-1" />
            Deaktivovať
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Názov</TableHead>
                <TableHead>Popis</TableHead>
                <TableHead>Farba</TableHead>
                <TableHead>Pozícia</TableHead>
                <TableHead>Aktívny</TableHead>
                <TableHead className="w-[100px]">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItemTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Žiadne typy položiek</p>
                    <p className="text-sm">Pridajte svoj prvý typ položky</p>
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext
                  items={sortedItemTypes.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedItemTypes.map((itemType) => (
                    <SortableItemTypeRow
                      key={itemType.id}
                      itemType={itemType}
                      onEdit={onEdit}
                      onToggleActive={handleToggleActive}
                      isSelected={selectedItemTypes.has(itemType.id)}
                      onSelectionChange={handleSelectionChange}
                      disabled={updateItemType.isPending}
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
};