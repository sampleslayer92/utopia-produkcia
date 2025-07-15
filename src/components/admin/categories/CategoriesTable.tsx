import { Edit, Palette, Package, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { Category, useUpdateCategory } from '@/hooks/useCategories';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export const CategoriesTable = ({ categories, onEdit }: CategoriesTableProps) => {
  const updateCategory = useUpdateCategory();

  const handleToggleActive = (category: Category) => {
    updateCategory.mutate({
      ...category,
      is_active: !category.is_active,
    });
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Žiadne kategórie</p>
                <p className="text-sm">Pridajte svoju prvú kategóriu</p>
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
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
                    onCheckedChange={() => handleToggleActive(category)}
                    disabled={updateCategory.isPending}
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};