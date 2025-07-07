import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, MoreHorizontal, Plus, Search, Trash2, Package } from 'lucide-react';
import { useWarehouseItems, useDeleteWarehouseItem, type WarehouseItem } from '@/hooks/useWarehouseItems';
import { WarehouseItemModal } from './WarehouseItemModal';

interface WarehouseItemsTableProps {
  itemType?: 'device' | 'service';
}

export const WarehouseItemsTable = ({ itemType }: WarehouseItemsTableProps) => {
  const { t } = useTranslation('admin');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<WarehouseItem | null>(null);

  const { data: items = [], isLoading, error } = useWarehouseItems({
    item_type: itemType,
    category: categoryFilter || undefined,
    search: search || undefined,
    is_active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
  });

  const deleteMutation = useDeleteWarehouseItem();

  const handleEdit = (item: WarehouseItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = async (item: WarehouseItem) => {
    try {
      await deleteMutation.mutateAsync(item.id);
      setDeleteItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(undefined);
  };

  const getAvailableCategories = () => {
    const allCategories = [
      'payment_cards',
      'pos_terminals', 
      'software',
      'hardware',
      'accessories',
      'other'
    ];
    
    if (!itemType) return allCategories;
    
    if (itemType === 'device') {
      return ['pos_terminals', 'hardware', 'accessories', 'other'];
    } else {
      return ['software', 'payment_cards', 'other'];
    }
  };

  const getCategoryLabel = (category: string) => {
    return t(`warehouse.categories.${category}`) || category;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            {t('warehouse.errorLoading')}: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {itemType === 'device' 
              ? t('warehouse.devices') 
              : itemType === 'service' 
                ? t('warehouse.services') 
                : t('warehouse.allItems')
            }
          </h2>
          <p className="text-muted-foreground">
            {t('warehouse.subtitle')}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('warehouse.addItem')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('warehouse.searchItems')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter || 'all'} onValueChange={(val) => setCategoryFilter(val === 'all' ? '' : val)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('warehouse.filters.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('warehouse.filters.all')}</SelectItem>
                {getAvailableCategories().map((category) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryLabel(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter || 'all'} onValueChange={(val) => setStatusFilter(val === 'all' ? '' : val)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('warehouse.filters.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('warehouse.filters.all')}</SelectItem>
                <SelectItem value="active">{t('warehouse.active')}</SelectItem>
                <SelectItem value="inactive">{t('warehouse.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('warehouse.totalItems')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('warehouse.active')}</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {items.filter(item => item.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('warehouse.devices')}</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {items.filter(item => item.item_type === 'device').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('warehouse.services')}</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {items.filter(item => item.item_type === 'service').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('warehouse.table.name')}</TableHead>
                <TableHead>{t('warehouse.table.type')}</TableHead>
                <TableHead>{t('warehouse.table.category')}</TableHead>
                <TableHead>{t('warehouse.table.monthlyFee')}</TableHead>
                <TableHead>{t('warehouse.table.setupFee')}</TableHead>
                <TableHead>{t('warehouse.table.status')}</TableHead>
                {itemType === 'device' && <TableHead>{t('warehouse.table.stock')}</TableHead>}
                <TableHead className="w-[50px]">{t('warehouse.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    {t('warehouse.loading')}
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    {t('warehouse.noItemsFound')}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.item_type === 'device' ? 'default' : 'secondary'}>
                        {item.item_type === 'device' ? t('warehouse.device') : t('warehouse.service')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getCategoryLabel(item.category)}
                    </TableCell>
                    <TableCell>{item.monthly_fee}€</TableCell>
                    <TableCell>{item.setup_fee}€</TableCell>
                    <TableCell>
                      <Badge variant={item.is_active ? 'default' : 'secondary'}>
                        {item.is_active ? t('warehouse.active') : t('warehouse.inactive')}
                      </Badge>
                    </TableCell>
                    {itemType === 'device' && (
                      <TableCell>
                        <span className={item.current_stock! < (item.min_stock || 0) ? 'text-red-600' : ''}>
                          {item.current_stock || 0}
                        </span>
                      </TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('warehouse.editItem')}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteItem(item)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('warehouse.deleteItem')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <WarehouseItemModal
        open={showModal}
        onOpenChange={handleCloseModal}
        item={selectedItem}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('warehouse.deleteItem')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('warehouse.confirmDeleteMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItem && handleDelete(deleteItem)}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('warehouse.deleteItem')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};