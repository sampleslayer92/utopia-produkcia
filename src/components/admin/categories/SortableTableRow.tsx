import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { Category } from '@/hooks/useCategories';

interface SortableTableRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onToggleActive: (category: Category) => void;
  isSelected: boolean;
  onSelectionChange: (categoryId: string, selected: boolean) => void;
  disabled?: boolean;
}

export const SortableTableRow = ({
  category,
  onEdit,
  onToggleActive,
  isSelected,
  onSelectionChange,
  disabled
}: SortableTableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getTypeFilterBadge = (filter: string) => {
    switch (filter) {
      case 'device':
        return <Badge variant="outline">Zariadenia</Badge>;
      case 'service':
        return <Badge variant="outline">Služby</Badge>;
      case 'both':
        return <Badge variant="outline">Všetko</Badge>;
      default:
        return <Badge variant="outline">{filter}</Badge>;
    }
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={disabled ? 'opacity-50' : ''}>
      <TableCell>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(category.id, !!checked)}
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
          {category.icon_name && (
            <div 
              className="w-8 h-8 rounded flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: category.color }}
            >
              {category.icon_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium">{category.name}</div>
            <div className="text-sm text-muted-foreground">{category.slug}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate" title={category.description}>
          {category.description || '-'}
        </div>
      </TableCell>
      <TableCell>
        {getTypeFilterBadge(category.item_type_filter)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: category.color }}
          />
          <span className="text-sm font-mono">{category.color}</span>
        </div>
      </TableCell>
      <TableCell>{category.position}</TableCell>
      <TableCell>
        <Switch
          checked={category.is_active}
          onCheckedChange={() => onToggleActive(category)}
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
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Edit className="h-4 w-4 mr-2" />
              Upraviť
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};