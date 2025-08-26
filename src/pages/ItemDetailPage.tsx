
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Package, Eye, DollarSign, Users, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import { icons } from 'lucide-react';

const ItemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { data: item, isLoading, error } = useWarehouseItem(id!);
  const { data: categories = [] } = useCategories();
  const { data: itemTypes = [] } = useItemTypes();
  const deleteMutation = useDeleteWarehouseItem();

  if (isLoading) {
    return (
      <AdminLayout title={t('warehouse.itemDetail.loading')} subtitle={t('warehouse.itemDetail.loadingSubtitle')}>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  if (error || !item) {
    return (
      <AdminLayout title={t('warehouse.itemDetail.notFound')} subtitle={t('warehouse.itemDetail.notFoundDescription')}>
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">{t('warehouse.itemDetail.notFound')}</h3>
          <p className="text-muted-foreground mb-6">{t('warehouse.itemDetail.notFoundDescription')}</p>
          <Button onClick={() => navigate('/admin/warehouse')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('warehouse.itemDetail.backToWarehouse')}
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
      subtitle={`${t('warehouse.itemDetail.detailedInfo')} • ${item.item_type === 'device' ? t('warehouse.itemDetail.device') : t('warehouse.itemDetail.service')}`}
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
              {t('warehouse.itemDetail.backToWarehouse')}
            </Button>
            <div className="text-sm text-muted-foreground">
              {t('navigation.warehouse')} → {category?.name || t('warehouse.itemDetail.category')} → {item.name}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {t('warehouse.itemDetail.edit')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('warehouse.itemDetail.delete')}
            </Button>
          </div>
        </div>

        {/* Main Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>{t('warehouse.itemDetail.basicInfo')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.itemDetail.type')}:</span>
                <div className="flex items-center space-x-2">
                  {itemType && renderIcon(itemType.icon_name, itemType.icon_url, itemType.color)}
                  <Badge variant={item.item_type === 'device' ? 'default' : 'secondary'}>
                    {item.item_type === 'device' ? t('warehouse.itemDetail.device') : t('warehouse.itemDetail.service')}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.itemDetail.category')}:</span>
                <div className="flex items-center space-x-2">
                  {category && renderIcon(category.icon_name, category.icon_url, category.color)}
                  <span className="text-sm">{category?.name || t('warehouse.itemDetail.other')}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.itemDetail.status')}:</span>
                <Badge variant={item.is_active ? 'default' : 'destructive'}>
                  {item.is_active ? t('warehouse.itemDetail.active') : t('warehouse.itemDetail.inactive')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>{t('warehouse.itemDetail.pricing')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.itemDetail.monthlyFee')}:</span>
                <span className="font-medium">{formatPrice(item.monthly_fee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.itemDetail.setupFee')}:</span>
                <span className="font-medium">{formatPrice(item.setup_fee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.itemDetail.companyCost')}:</span>
                <span className="font-medium">{formatPrice(item.company_cost)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.itemDetail.margin')}:</span>
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
                <span>{t('warehouse.itemDetail.inventory')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.current_stock !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('warehouse.itemDetail.currentStock')}:</span>
                  <span className={`font-medium ${item.current_stock < 5 ? 'text-destructive' : 'text-success'}`}>
                    {item.current_stock} ks
                  </span>
                </div>
              )}
              {item.min_stock !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('warehouse.itemDetail.minStock')}:</span>
                  <span className="font-medium">{item.min_stock} ks</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('warehouse.itemDetail.created')}:</span>
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
            <CardTitle>{t('warehouse.itemDetail.detailedInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">{t('warehouse.itemDetail.overview')}</TabsTrigger>
                <TabsTrigger value="specifications">{t('warehouse.itemDetail.specifications')}</TabsTrigger>
                <TabsTrigger value="history">{t('warehouse.itemDetail.history')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('warehouse.itemDetail.description')}</h4>
                  <p className="text-muted-foreground">
                    {item.description || t('warehouse.itemDetail.noDescription')}
                  </p>
                </div>
                
                {item.image_url && (
                  <div>
                    <h4 className="font-medium mb-2">{t('warehouse.itemDetail.image')}</h4>
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
                  <h4 className="font-medium mb-2">{t('warehouse.itemDetail.technicalSpecs')}</h4>
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
                    <p className="text-muted-foreground">{t('warehouse.itemDetail.noSpecs')}</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t('warehouse.itemDetail.changeHistory')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{t('warehouse.itemDetail.itemCreated')}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleString('sk-SK')}
                        </p>
                      </div>
                      <Badge variant="outline">{t('warehouse.itemDetail.system')}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{t('warehouse.itemDetail.lastUpdate')}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.updated_at).toLocaleString('sk-SK')}
                        </p>
                      </div>
                      <Badge variant="outline">{t('warehouse.itemDetail.system')}</Badge>
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
            <AlertDialogTitle>{t('warehouse.itemDetail.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('warehouse.itemDetail.confirmDeleteDescription', { name: item.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('warehouse.itemDetail.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('warehouse.itemDetail.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ItemDetailPage;
