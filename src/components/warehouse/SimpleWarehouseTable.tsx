
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWarehouseItems } from '@/hooks/useWarehouseItems';
import { useCategories } from '@/hooks/useCategories';
import { useItemTypes } from '@/hooks/useItemTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Package, Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { WarehouseItemModal } from './WarehouseItemModal';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface SimpleWarehouseTableProps {
  showAddForm?: boolean;
}

export const SimpleWarehouseTable = ({ showAddForm = false }: SimpleWarehouseTableProps) => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(showAddForm);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Filters for the API query
  const filters = useMemo(() => {
    const apiFilters: any = {};
    
    if (selectedCategory !== 'all') {
      apiFilters.category_id = selectedCategory;
    }
    
    if (selectedType !== 'all') {
      apiFilters.item_type_id = selectedType;
    }
    
    if (selectedStatus !== 'all') {
      apiFilters.is_active = selectedStatus === 'active';
    }
    
    if (searchTerm.trim()) {
      apiFilters.search = searchTerm.trim();
    }
    
    return apiFilters;
  }, [selectedCategory, selectedType, selectedStatus, searchTerm]);

  const { data: items = [], isLoading, error } = useWarehouseItems(filters);
  const { data: categories = [] } = useCategories();
  const { data: itemTypes = [] } = useItemTypes();

  const stats = useMemo(() => {
    if (!items.length) return { total: 0, active: 0, devices: 0, services: 0 };
    
    return {
      total: items.length,
      active: items.filter(item => item.is_active).length,
      devices: items.filter(item => item.item_type === 'device').length,
      services: items.filter(item => item.item_type === 'service').length,
    };
  }, [items]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">{t('warehouse.table.empty.title')}</h3>
        <p className="text-muted-foreground mb-6">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('warehouse.title')}</h1>
          <p className="text-muted-foreground">{t('warehouse.subtitle')}</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('warehouse.addItem')}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('warehouse.stats.total')}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('warehouse.stats.active')}</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('warehouse.stats.devices')}</p>
                <p className="text-2xl font-bold">{stats.devices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('warehouse.stats.services')}</p>
                <p className="text-2xl font-bold">{stats.services}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>{t('warehouse.table.filters.search')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('warehouse.table.filters.search')}</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('warehouse.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('warehouse.table.filters.category')}</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('warehouse.allCategories')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('warehouse.allCategories')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('warehouse.table.filters.type')}</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('warehouse.allTypes')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('warehouse.allTypes')}</SelectItem>
                  {itemTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('warehouse.table.filters.status')}</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t('warehouse.table.filters.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('overview.filter.all')}</SelectItem>
                  <SelectItem value="active">{t('warehouse.itemDetail.active')}</SelectItem>
                  <SelectItem value="inactive">{t('warehouse.itemDetail.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">{t('warehouse.table.empty.title')}</h3>
              <p className="text-muted-foreground mb-6">{t('warehouse.table.empty.description')}</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('warehouse.table.empty.addFirst')}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('warehouse.table.headers.name')}</TableHead>
                  <TableHead>{t('warehouse.table.headers.category')}</TableHead>
                  <TableHead>{t('warehouse.table.headers.type')}</TableHead>
                  <TableHead>{t('warehouse.table.headers.monthlyFee')}</TableHead>
                  <TableHead>{t('warehouse.table.headers.setupFee')}</TableHead>
                  <TableHead>{t('warehouse.table.headers.status')}</TableHead>
                  <TableHead className="w-[70px]">{t('warehouse.table.headers.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {categories.find(c => c.id === item.category_id)?.name || t('warehouse.itemDetail.other')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.item_type === 'device' ? 'default' : 'secondary'}>
                        {item.item_type === 'device' ? t('warehouse.itemDetail.device') : t('warehouse.itemDetail.service')}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPrice(item.monthly_fee)}</TableCell>
                    <TableCell>{formatPrice(item.setup_fee)}</TableCell>
                    <TableCell>
                      <Badge variant={item.is_active ? 'default' : 'destructive'}>
                        {item.is_active ? t('warehouse.itemDetail.active') : t('warehouse.itemDetail.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/warehouse/items/${item.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t('warehouse.table.actions.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingItem(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('warehouse.table.actions.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('warehouse.table.actions.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <WarehouseItemModal
          item={editingItem}
          open={showAddModal || !!editingItem}
          onOpenChange={(open) => {
            if (!open) {
              setShowAddModal(false);
              setEditingItem(null);
            }
          }}
        />
      )}
    </div>
  );
};
