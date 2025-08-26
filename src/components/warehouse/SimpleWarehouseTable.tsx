import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Edit, MoreHorizontal, Plus, Search, Trash2, Package, Filter, Eye, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWarehouseItems, useDeleteWarehouseItem, type WarehouseItem } from '@/hooks/useWarehouseItems';
import { useCategories } from '@/hooks/useCategories';
import { useItemTypes } from '@/hooks/useItemTypes';
import { useBulkDeleteWarehouseItems, useBulkUpdateWarehouseItems } from '@/hooks/useBulkWarehouseOperations';
import { WarehouseItemModal } from './WarehouseItemModal';
import { EnhancedAddItemForm } from './EnhancedAddItemForm';
import { icons } from 'lucide-react';

interface SimpleWarehouseTableProps {
  showAddForm?: boolean;
}

export const SimpleWarehouseTable = ({ showAddForm }: SimpleWarehouseTableProps) => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<WarehouseItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Fetch data
  const { data: categories = [] } = useCategories(true);
  const { data: itemTypes = [] } = useItemTypes(true);
  
  const { data: items = [], isLoading, error } = useWarehouseItems({
    category_id: categoryFilter || undefined,
    item_type_id: typeFilter || undefined,
    search: search || undefined,
    is_active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
  });

  const deleteMutation = useDeleteWarehouseItem();
  const bulkDeleteMutation = useBulkDeleteWarehouseItems();
  const bulkUpdateMutation = useBulkUpdateWarehouseItems();

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(items.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectionChange = (itemId: string, selected: boolean) => {
    const newSelection = new Set(selectedItems);
    if (selected) {
      newSelection.add(itemId);
    } else {
      newSelection.delete(itemId);
    }
    setSelectedItems(newSelection);
  };

  const handleBulkDelete = () => {
    bulkDeleteMutation.mutate(Array.from(selectedItems));
    setSelectedItems(new Set());
  };

  const handleBulkActivate = () => {
    bulkUpdateMutation.mutate({
      itemIds: Array.from(selectedItems),
      updates: { is_active: true }
    });
    setSelectedItems(new Set());
  };

  const handleBulkDeactivate = () => {
    bulkUpdateMutation.mutate({
      itemIds: Array.from(selectedItems),
      updates: { is_active: false }
    });
    setSelectedItems(new Set());
  };

  // Helper function to render icons
  const renderIcon = (iconName: string | null, iconUrl: string | null, color: string) => {
    if (iconUrl) {
      return <img src={iconUrl} alt="Icon" className="h-4 w-4 object-contain" />;
    }
    if (iconName && icons[iconName as keyof typeof icons]) {
      const IconComponent = icons[iconName as keyof typeof icons];
      return <IconComponent className="h-4 w-4" style={{ color }} />;
    }
    return <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />;
  };

  // Show add form if requested
  if (showAddForm) {
    return <EnhancedAddItemForm />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
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
          <h1 className="text-3xl font-bold">{t('warehouse.items')}</h1>
          <p className="text-muted-foreground">
            {t('warehouse.itemsDescription')}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('warehouse.addItem')}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('warehouse.total')}</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('warehouse.active')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {items.filter(item => item.is_active).length}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('warehouse.devices')}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {items.filter(item => item.item_type === 'device').length}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('warehouse.services')}</p>
                <p className="text-2xl font-bold text-purple-600">
                  {items.filter(item => item.item_type === 'service').length}
                </p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Panel */}
      {selectedItems.size > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {selectedItems.size} {t('warehouse.itemsSelected')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkActivate}
                className="ml-auto"
              >
                <Check className="h-4 w-4 mr-1" />
                {t('warehouse.activate')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDeactivate}
              >
                <X className="h-4 w-4 mr-1" />
                {t('warehouse.deactivate')}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {t('warehouse.delete')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('warehouse.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter || 'all'} onValueChange={(val) => setCategoryFilter(val === 'all' ? '' : val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('warehouse.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('warehouse.allCategories')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {renderIcon(category.icon_name, category.icon_url, category.color)}
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter || 'all'} onValueChange={(val) => setTypeFilter(val === 'all' ? '' : val)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('warehouse.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('warehouse.allTypes')}</SelectItem>
                {itemTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      {renderIcon(type.icon_name, type.icon_url, type.color)}
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter || 'all'} onValueChange={(val) => setStatusFilter(val === 'all' ? '' : val)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t('warehouse.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('warehouse.all')}</SelectItem>
                <SelectItem value="active">{t('warehouse.active')}</SelectItem>
                <SelectItem value="inactive">{t('warehouse.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedItems.size === items.length && items.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>{t('warehouse.name')}</TableHead>
              <TableHead>{t('warehouse.type')}</TableHead>
              <TableHead>{t('warehouse.category')}</TableHead>
              <TableHead>{t('warehouse.monthlyFee')}</TableHead>
              <TableHead>{t('warehouse.setupFee')}</TableHead>
              <TableHead>{t('warehouse.status')}</TableHead>
              <TableHead className="w-[50px]">{t('warehouse.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    {t('warehouse.loading')}
                  </div>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {search || categoryFilter || typeFilter || statusFilter 
                      ? t('warehouse.noItemsFound')
                      : t('warehouse.noItemsYet')
                    }
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/admin/warehouse/items/${item.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={(checked) => handleSelectionChange(item.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium hover:text-primary transition-colors">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.item_types && renderIcon(
                        item.item_types.icon_name, 
                        item.item_types.icon_url, 
                        item.item_types.color
                      )}
                      <span>{item.item_types?.name || item.item_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.categories && renderIcon(
                        item.categories.icon_name, 
                        item.categories.icon_url, 
                        item.categories.color
                      )}
                      <span>{item.categories?.name || item.category}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{item.monthly_fee.toFixed(2)}€</TableCell>
                  <TableCell className="font-mono">{item.setup_fee.toFixed(2)}€</TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? "default" : "secondary"}>
                      {item.is_active ? t('warehouse.active') : t('warehouse.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/warehouse/items/${item.id}`);
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t('warehouse.viewDetail')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/warehouse/items/${item.id}`);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('warehouse.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteItem(item);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('warehouse.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Modal */}
      {showModal && (
        <WarehouseItemModal
          item={selectedItem}
          open={showModal}
          onOpenChange={(open) => {
            setShowModal(open);
            if (!open) handleCloseModal();
          }}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('warehouse.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('warehouse.confirmDeleteDescription', { name: deleteItem?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('warehouse.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItem && handleDelete(deleteItem)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('warehouse.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};