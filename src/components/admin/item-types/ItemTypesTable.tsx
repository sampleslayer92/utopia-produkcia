import { Edit, Package, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ItemType, useUpdateItemType } from '@/hooks/useItemTypes';

interface ItemTypesTableProps {
  itemTypes: ItemType[];
  onEdit: (itemType: ItemType) => void;
}

export const ItemTypesTable = ({ itemTypes, onEdit }: ItemTypesTableProps) => {
  const updateItemType = useUpdateItemType();

  const handleToggleActive = (itemType: ItemType) => {
    updateItemType.mutate({
      ...itemType,
      is_active: !itemType.is_active,
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Názov</TableHead>
            <TableHead>Popis</TableHead>
            <TableHead>Farba</TableHead>
            <TableHead>Pozícia</TableHead>
            <TableHead>Aktívny</TableHead>
            <TableHead className="w-[100px]">Akcie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Žiadne typy položiek</p>
                <p className="text-sm">Pridajte svoj prvý typ položky</p>
              </TableCell>
            </TableRow>
          ) : (
            itemTypes.map((itemType) => (
              <TableRow key={itemType.id}>
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
                    onCheckedChange={() => handleToggleActive(itemType)}
                    disabled={updateItemType.isPending}
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};