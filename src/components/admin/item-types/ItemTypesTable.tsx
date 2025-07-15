import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, MoreHorizontal, Eye, EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUpdateItemType, useDeleteItemType, type ItemType } from '@/hooks/useItemTypes';
import { icons } from 'lucide-react';

interface ItemTypesTableProps {
  itemTypes: ItemType[];
  onEdit: (itemType: ItemType) => void;
}

export const ItemTypesTable = ({ itemTypes, onEdit }: ItemTypesTableProps) => {
  const updateItemType = useUpdateItemType();
  const deleteItemType = useDeleteItemType();

  const toggleActive = (itemType: ItemType) => {
    updateItemType.mutate({
      ...itemType,
      is_active: !itemType.is_active,
    });
  };

  const handleDelete = (itemType: ItemType) => {
    if (confirm('Naozaj chcete zmazať tento typ položky?')) {
      deleteItemType.mutate(itemType.id);
    }
  };

  const renderIcon = (iconName: string | null, iconUrl: string | null, color: string) => {
    if (iconUrl) {
      return (
        <img 
          src={iconUrl} 
          alt="Item type icon" 
          className="h-5 w-5 object-contain"
        />
      );
    }

    if (iconName && icons[iconName as keyof typeof icons]) {
      const IconComponent = icons[iconName as keyof typeof icons];
      return <IconComponent className="h-5 w-5" style={{ color }} />;
    }

    return <div className="h-5 w-5 rounded-full" style={{ backgroundColor: color }} />;
  };

  return (
    <div className="space-y-4">
      {itemTypes.map((itemType) => (
        <Card key={itemType.id} className={!itemType.is_active ? 'opacity-50' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {renderIcon(itemType.icon_name, itemType.icon_url, itemType.color)}
                  <div>
                    <h3 className="font-semibold text-foreground">{itemType.name}</h3>
                    <p className="text-sm text-muted-foreground">{itemType.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Pozícia: {itemType.position}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(itemType)}
                  >
                    {itemType.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onEdit(itemType)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Upraviť
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(itemType)}
                        className="text-destructive"
                      >
                        Zmazať
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {itemTypes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Žiadne typy položiek neboli nájdené.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};