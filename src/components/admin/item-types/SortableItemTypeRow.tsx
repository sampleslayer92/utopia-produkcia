import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ItemType } from '@/hooks/useItemTypes';

interface SortableItemTypeRowProps {
  itemType: ItemType;
  onEdit: (itemType: ItemType) => void;
  onToggleActive: (itemType: ItemType) => void;
  isSelected: boolean;
  onSelectionChange: (itemTypeId: string, selected: boolean) => void;
  disabled?: boolean;
}

export const SortableItemTypeRow = ({
  itemType,
  onEdit,
  onToggleActive,
  isSelected,
  onSelectionChange,
  disabled
}: SortableItemTypeRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: itemType.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={disabled ? 'opacity-50' : ''}>
      <TableCell>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(itemType.id, !!checked)}
          />
          <Button
            variant="ghost"
            size="sm"
            className="cursor-grab active:cursor-grabbing p-1"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {itemType.icon_name && (
            <div 
              className="w-8 h-8 rounded flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: itemType.color }}
            >
              {itemType.icon_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium">{itemType.name}</div>
            <div className="text-sm text-muted-foreground">{itemType.slug}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate" title={itemType.description}>
          {itemType.description || '-'}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: itemType.color }}
          />
          <span className="text-sm font-mono">{itemType.color}</span>
        </div>
      </TableCell>
      <TableCell>{itemType.position}</TableCell>
      <TableCell>
        <Switch
          checked={itemType.is_active}
          onCheckedChange={() => onToggleActive(itemType)}
          disabled={disabled}
        />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(itemType)}>
              <Edit className="h-4 w-4 mr-2" />
              Upraviť
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};