import { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Package, Check, X, Trash2 } from 'lucide-react';
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
import { Category, useUpdateCategory } from '@/hooks/useCategories';
import { SortableTableRow } from './SortableTableRow';
import { useToast } from '@/hooks/use-toast';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export const CategoriesTable = ({ categories, onEdit }: CategoriesTableProps) => {
  const updateCategory = useUpdateCategory();
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [sortedCategories, setSortedCategories] = useState(categories);

  // Update sorted categories when categories prop changes
  useEffect(() => {
    setSortedCategories([...categories].sort((a, b) => a.position - b.position));
  }, [categories]);

  const handleToggleActive = (category: Category) => {
    updateCategory.mutate({
      ...category,
      is_active: !category.is_active,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedCategories.findIndex((item) => item.id === active.id);
      const newIndex = sortedCategories.findIndex((item) => item.id === over.id);
      
      const newOrder = arrayMove(sortedCategories, oldIndex, newIndex);
      setSortedCategories(newOrder);

      // Update positions in database
      newOrder.forEach((category, index) => {
        if (category.position !== index) {
          updateCategory.mutate({
            ...category,
            position: index,
          });
        }
      });

      toast({
        title: "Poradie aktualizované",
        description: "Pozície kategórií boli úspešne aktualizované.",
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(new Set(sortedCategories.map(cat => cat.id)));
    } else {
      setSelectedCategories(new Set());
    }
  };

  const handleSelectionChange = (categoryId: string, selected: boolean) => {
    const newSelection = new Set(selectedCategories);
    if (selected) {
      newSelection.add(categoryId);
    } else {
      newSelection.delete(categoryId);
    }
    setSelectedCategories(newSelection);
  };

  const handleBulkActivate = () => {
    const selectedCats = sortedCategories.filter(cat => selectedCategories.has(cat.id));
    selectedCats.forEach(category => {
      updateCategory.mutate({
        ...category,
        is_active: true,
      });
    });
    setSelectedCategories(new Set());
    toast({
      title: "Kategórie aktivované",
      description: `${selectedCats.length} kategórií bolo aktivovaných.`,
    });
  };

  const handleBulkDeactivate = () => {
    const selectedCats = sortedCategories.filter(cat => selectedCategories.has(cat.id));
    selectedCats.forEach(category => {
      updateCategory.mutate({
        ...category,
        is_active: false,
      });
    });
    setSelectedCategories(new Set());
    toast({
      title: "Kategórie deaktivované",
      description: `${selectedCats.length} kategórií bolo deaktivovaných.`,
    });
  };

  const isAllSelected = selectedCategories.size === sortedCategories.length && sortedCategories.length > 0;
  const isPartiallySelected = selectedCategories.size > 0 && selectedCategories.size < sortedCategories.length;

  return (
    <div className="space-y-4">
      {selectedCategories.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedCategories.size} kategórií vybratých
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
                <TableHead>Typ filtra</TableHead>
                <TableHead>Farba</TableHead>
                <TableHead>Pozícia</TableHead>
                <TableHead>Aktívna</TableHead>
                <TableHead className="w-[100px]">Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Žiadne kategórie</p>
                    <p className="text-sm">Pridajte svoju prvú kategóriu</p>
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext
                  items={sortedCategories.map(cat => cat.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedCategories.map((category) => (
                    <SortableTableRow
                      key={category.id}
                      category={category}
                      onEdit={onEdit}
                      onToggleActive={handleToggleActive}
                      isSelected={selectedCategories.has(category.id)}
                      onSelectionChange={handleSelectionChange}
                      disabled={updateCategory.isPending}
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