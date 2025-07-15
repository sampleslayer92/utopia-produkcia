
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
import { useCategories } from '@/hooks/useCategories';
import { useItemTypes } from '@/hooks/useItemTypes';
import { WarehouseItemModal } from './WarehouseItemModal';
import { icons } from 'lucide-react';

interface WarehouseItemsTableProps {
  itemType?: 'device' | 'service';
}

export const WarehouseItemsTable = ({ itemType }: WarehouseItemsTableProps) => {
  const { t, i18n } = useTranslation('admin');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<WarehouseItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Fetch reference data
  const { data: categories } = useCategories(true);
  const { data: itemTypes } = useItemTypes(true);

  const { data: items = [], isLoading, error } = useWarehouseItems({
    item_type: itemType,
    category_id: categoryFilter || undefined,
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

  // Get available categories dynamically
  const getAvailableCategories = () => {
    return categories || [];
  };

  // Get category label for display
  const getCategoryLabel = (categoryId: string): string => {
    const category = categories?.find(c => c.id === categoryId);
    return category?.name || 'Neznáma kategória';
  };

  // Group items by item type
  const getItemsByType = (typeSlug: string) => {
    if (!items) return [];
    return items.filter(item => item.item_types?.slug === typeSlug);
  };

  // Group items by category within a type
  const getItemsByTypeAndCategory = (typeSlug: string, categoryId: string) => {
    return getItemsByType(typeSlug).filter(item => item.category_id === categoryId);
  };

  // Render icon helper
  const renderIcon = (iconName: string | null, iconUrl: string | null, color: string) => {
    if (iconUrl) {
      return (
        <img 
          src={iconUrl} 
          alt="Icon" 
          className="h-4 w-4 object-contain"
        />
      );
    }

    if (iconName && icons[iconName as keyof typeof icons]) {
      const IconComponent = icons[iconName as keyof typeof icons];
      return <IconComponent className="h-4 w-4" style={{ color }} />;
    }

    return <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />;
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
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      {renderIcon(category.icon_name, category.icon_url, category.color)}
                      <span>{category.name}</span>
                    </div>
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

      {/* Dynamic tabs by item type */}
      {items && items.length > 0 && itemTypes && itemTypes.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Všetko</TabsTrigger>
            {itemTypes.map((itemType) => (
              <TabsTrigger key={itemType.id} value={itemType.slug}>
                <div className="flex items-center space-x-2">
                  {renderIcon(itemType.icon_name, itemType.icon_url, itemType.color)}
                  <span>{itemType.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('warehouse.table.name')}</TableHead>
                    <TableHead>{t('warehouse.table.type')}</TableHead>
                    <TableHead>{t('warehouse.table.category')}</TableHead>
                    <TableHead>{t('warehouse.table.monthlyFee')}</TableHead>
                    <TableHead>{t('warehouse.table.setupFee')}</TableHead>
                    <TableHead>{t('warehouse.table.status')}</TableHead>
                    <TableHead className="w-[50px]">{t('warehouse.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Načítavam...
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Žiadne položky neboli nájdené
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {item.item_types && renderIcon(item.item_types.icon_name, item.item_types.icon_url, item.item_types.color)}
                            <span>{item.item_types?.name || item.item_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {item.categories && renderIcon(item.categories.icon_name, item.categories.icon_url, item.categories.color)}
                            <span>{item.categories?.name || item.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.monthly_fee}€</TableCell>
                        <TableCell>{item.setup_fee}€</TableCell>
                        <TableCell>
                          <Badge variant={item.is_active ? "default" : "secondary"}>
                            {item.is_active ? 'Aktívne' : 'Neaktívne'}
                          </Badge>
                        </TableCell>
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
                                Upraviť
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => setDeleteItem(item)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Zmazať
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
          </TabsContent>

          {itemTypes.map((itemType) => (
            <TabsContent key={itemType.id} value={itemType.slug} className="space-y-4">
              {categories && categories.length > 0 ? (
                <Accordion type="multiple" className="space-y-2">
                  {categories
                    .filter(category => 
                      category.item_type_filter === 'both' || 
                      category.item_type_filter === itemType.slug
                    )
                    .map((category) => {
                      const categoryItems = getItemsByTypeAndCategory(itemType.slug, category.id);
                      
                      if (categoryItems.length === 0) return null;

                      return (
                        <AccordionItem key={category.id} value={category.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center space-x-3">
                              {renderIcon(category.icon_name, category.icon_url, category.color)}
                              <span className="font-medium">{category.name}</span>
                              <Badge variant="outline">{categoryItems.length}</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                              {categoryItems.map((item) => (
                                <Card key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-medium text-sm">{item.name}</h4>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                            <MoreHorizontal className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                                            <Edit className="mr-2 h-3 w-3" />
                                            Upraviť
                                          </DropdownMenuItem>
                                          <DropdownMenuItem 
                                            onClick={() => setDeleteItem(item)}
                                            className="text-destructive"
                                          >
                                            <Trash2 className="mr-2 h-3 w-3" />
                                            Zmazať
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                    
                                    {item.description && (
                                      <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                                    )}
                                    
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-xs">
                                        <span>Mesačný poplatok:</span>
                                        <span className="font-medium">{item.monthly_fee}€</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span>Nastavenie:</span>
                                        <span className="font-medium">{item.setup_fee}€</span>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-3">
                                      <Badge variant={item.is_active ? "default" : "secondary"} className="text-xs">
                                        {item.is_active ? 'Aktívne' : 'Neaktívne'}
                                      </Badge>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                </Accordion>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Žiadne kategórie neboli nájdené.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : !isLoading && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              {search || categoryFilter || statusFilter
                ? 'Žiadne položky neboli nájdené'
                : 'Žiadne položky v sklade'
              }
            </p>
          </CardContent>
        </Card>
      )}

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
