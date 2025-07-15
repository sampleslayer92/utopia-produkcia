import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, MoreHorizontal, Eye, EyeOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUpdateCategory, useDeleteCategory, type Category } from '@/hooks/useCategories';
import { icons } from 'lucide-react';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export const CategoriesTable = ({ categories, onEdit }: CategoriesTableProps) => {
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const toggleActive = (category: Category) => {
    updateCategory.mutate({
      ...category,
      is_active: !category.is_active,
    });
  };

  const handleDelete = (category: Category) => {
    if (confirm('Naozaj chcete zmazať túto kategóriu?')) {
      deleteCategory.mutate(category.id);
    }
  };

  const renderIcon = (iconName: string | null, iconUrl: string | null, color: string) => {
    if (iconUrl) {
      return (
        <img 
          src={iconUrl} 
          alt="Category icon" 
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

  const getTypeFilterBadge = (filter: string) => {
    switch (filter) {
      case 'device':
        return <Badge variant="outline">Zariadenia</Badge>;
      case 'service':
        return <Badge variant="outline">Služby</Badge>;
      case 'both':
        return <Badge variant="outline">Oboje</Badge>;
      default:
        return <Badge variant="outline">{filter}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <Card key={category.id} className={!category.is_active ? 'opacity-50' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {renderIcon(category.icon_name, category.icon_url, category.color)}
                  <div>
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Pozícia: {category.position}</div>
                  {getTypeFilterBadge(category.item_type_filter)}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(category)}
                  >
                    {category.is_active ? (
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
                      <DropdownMenuItem onClick={() => onEdit(category)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Upraviť
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(category)}
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

      {categories.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Žiadne kategórie neboli nájdené.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};