import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Package, Eye, DollarSign, Users, Settings } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useWarehouseItem, useUpdateWarehouseItem, useDeleteWarehouseItem } from '@/hooks/useWarehouseItems';
import { useCategories } from '@/hooks/useCategories';
import { useItemTypes } from '@/hooks/useItemTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { WarehouseItemModal } from '@/components/warehouse/WarehouseItemModal';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useTranslation } from 'react-i18next';
import { icons } from 'lucide-react';

const ItemDetailPage = () => {
  const { t } = useTranslation('admin');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { data: item, isLoading, error } = useWarehouseItem(id!);
  const { data: categories = [] } = useCategories();
  const { data: itemTypes = [] } = useItemTypes();
  const deleteMutation = useDeleteWarehouseItem();

  if (isLoading) {
    return (
      <AdminLayout title={t('warehouse.loading')} subtitle={t('warehouse.loadingItemDetail')}>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  if (error || !item) {
    return (
      <AdminLayout title={t('warehouse.itemNotFound')} subtitle={t('warehouse.requestedItemNotExist')}>
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">{t('warehouse.itemNotFound')}</h3>
          <p className="text-muted-foreground mb-6">{t('warehouse.itemNotFoundDescription')}</p>
          <Button onClick={() => navigate('/admin/warehouse')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('warehouse.backToWarehouse')}
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(item.id);
      navigate('/admin/warehouse');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Helper function to render icons
  const renderIcon = (iconName: string | null, iconUrl: string | null, color: string) => {
    if (iconUrl) {
      return <img src={iconUrl} alt="Icon" className="h-6 w-6 object-contain" />;
    }
    if (iconName && icons[iconName as keyof typeof icons]) {
      const IconComponent = icons[iconName as keyof typeof icons];
      return <IconComponent className="h-6 w-6" style={{ color }} />;
    }
    return <div className="h-6 w-6 rounded-full" style={{ backgroundColor: color }} />;
  };

  const category = categories.find(c => c.id === item.category_id);
  const itemType = itemTypes.find(t => t.id === item.item_type_id);

  return (
    <AdminLayout 
      title={item.name}
      subtitle={`${t('warehouse.itemDetailSubtitle')} • ${item.item_type === 'device' ? t('warehouse.device') : t('warehouse.service')}`}
    >
      <div className="space-y-6">
        {/* Header with navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/warehouse')}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('warehouse.backToWarehouse')}
            </Button>
            <div className="text-sm text-muted-foreground">
              {t('warehouse.breadcrumb', { category: category?.name || t('warehouse.category'), item: item.name })}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {t('warehouse.edit')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('warehouse.delete')}
            </Button>
          </div>
        </div>

        {/* Main Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>{t('warehouse.basicInfo')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.type')}:</span>
                <div className="flex items-center space-x-2">
                  {itemType && renderIcon(itemType.icon_name, itemType.icon_url, itemType.color)}
                  <Badge variant={item.item_type === 'device' ? 'default' : 'secondary'}>
                    {item.item_type === 'device' ? t('warehouse.device') : t('warehouse.service')}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.category')}:</span>
                <div className="flex items-center space-x-2">
                  {category && renderIcon(category.icon_name, category.icon_url, category.color)}
                  <span className="text-sm">{category?.name || t('warehouse.other')}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.status')}:</span>
                <Badge variant={item.is_active ? 'default' : 'destructive'}>
                  {item.is_active ? t('warehouse.active') : t('warehouse.inactive')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>{t('warehouse.pricing')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.monthlyFee')}:</span>
                <span className="font-medium">{formatPrice(item.monthly_fee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.setupFee')}:</span>
                <span className="font-medium">{formatPrice(item.setup_fee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.companyCost')}:</span>
                <span className="font-medium">{formatPrice(item.company_cost)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.margin')}:</span>
                <span className="font-medium text-green-600">
                  {formatPrice(item.monthly_fee - item.company_cost)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>{t('warehouse.inventory')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.current_stock !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('warehouse.currentStock')}:</span>
                  <span className={`font-medium ${item.current_stock < 5 ? 'text-destructive' : 'text-success'}`}>
                    {item.current_stock} {t('warehouse.pieces')}
                  </span>
                </div>
              )}
              {item.min_stock !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('warehouse.minStock')}:</span>
                  <span className="font-medium">{item.min_stock} {t('warehouse.pieces')}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.created')}:</span>
                <span className="text-sm">
                  {new Date(item.created_at).toLocaleDateString('sk-SK')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t('warehouse.detailedInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">{t('warehouse.overview')}</TabsTrigger>
                <TabsTrigger value="specifications">{t('warehouse.specifications')}</TabsTrigger>
                <TabsTrigger value="history">{t('warehouse.history')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('warehouse.description')}</h4>
                  <p className="text-muted-foreground">
                    {item.description || t('warehouse.noDescriptionAvailable')}
                  </p>
                </div>
                
                {item.image_url && (
                  <div>
                    <h4 className="font-medium mb-2">{t('warehouse.image')}</h4>
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="max-w-xs rounded-lg border"
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="specifications" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('warehouse.technicalSpecs')}</h4>
                  {item.specifications && typeof item.specifications === 'object' && Object.keys(item.specifications).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(item.specifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm font-medium">{key}:</span>
                          <span className="text-sm">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{t('warehouse.noSpecificationsDefined')}</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('warehouse.changeHistory')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{t('warehouse.itemCreated')}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleString('sk-SK')}
                        </p>
                      </div>
                      <Badge variant="outline">{t('warehouse.system')}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{t('warehouse.lastUpdate')}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.updated_at).toLocaleString('sk-SK')}
                        </p>
                      </div>
                      <Badge variant="outline">{t('warehouse.system')}</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <WarehouseItemModal
          item={item}
          open={showEditModal}
          onOpenChange={setShowEditModal}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('warehouse.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('warehouse.confirmDeleteDescription', { name: item.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('warehouse.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('warehouse.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ItemDetailPage;