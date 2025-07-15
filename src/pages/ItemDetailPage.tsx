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
import { icons } from 'lucide-react';

const ItemDetailPage = () => {
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
      <AdminLayout title="Načítavam..." subtitle="Načítavam detail položky">
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  if (error || !item) {
    return (
      <AdminLayout title="Položka nenájdená" subtitle="Požadovaná položka neexistuje">
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Položka nenájdená</h3>
          <p className="text-muted-foreground mb-6">Požadovaná položka neexistuje alebo bola zmazaná.</p>
          <Button onClick={() => navigate('/admin/warehouse')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Späť na sklad
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
      subtitle={`Detail skladovej položky • ${item.item_type === 'device' ? 'Zariadenie' : 'Služba'}`}
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
              Späť na sklad
            </Button>
            <div className="text-sm text-muted-foreground">
              Sklad → {category?.name || 'Kategória'} → {item.name}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Upraviť
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Zmazať
            </Button>
          </div>
        </div>

        {/* Main Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Základné informácie</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Typ:</span>
                <div className="flex items-center space-x-2">
                  {itemType && renderIcon(itemType.icon_name, itemType.icon_url, itemType.color)}
                  <Badge variant={item.item_type === 'device' ? 'default' : 'secondary'}>
                    {item.item_type === 'device' ? 'Zariadenie' : 'Služba'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Kategória:</span>
                <div className="flex items-center space-x-2">
                  {category && renderIcon(category.icon_name, category.icon_url, category.color)}
                  <span className="text-sm">{category?.name || 'Iné'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stav:</span>
                <Badge variant={item.is_active ? 'default' : 'destructive'}>
                  {item.is_active ? 'Aktívne' : 'Neaktívne'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Cenník</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mesačný poplatok:</span>
                <span className="font-medium">{formatPrice(item.monthly_fee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Jednorazový poplatok:</span>
                <span className="font-medium">{formatPrice(item.setup_fee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Náklady firmy:</span>
                <span className="font-medium">{formatPrice(item.company_cost)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Marža:</span>
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
                <span>Skladové hospodárstvo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.current_stock !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Aktuálny stav:</span>
                  <span className={`font-medium ${item.current_stock < 5 ? 'text-destructive' : 'text-success'}`}>
                    {item.current_stock} ks
                  </span>
                </div>
              )}
              {item.min_stock !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Minimálny stav:</span>
                  <span className="font-medium">{item.min_stock} ks</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vytvorené:</span>
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
            <CardTitle>Detailné informácie</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Prehľad</TabsTrigger>
                <TabsTrigger value="specifications">Špecifikácie</TabsTrigger>
                <TabsTrigger value="history">História</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Popis</h4>
                  <p className="text-muted-foreground">
                    {item.description || 'Žiadny popis nie je k dispozícii.'}
                  </p>
                </div>
                
                {item.image_url && (
                  <div>
                    <h4 className="font-medium mb-2">Obrázok</h4>
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
                  <h4 className="font-medium mb-2">Technické špecifikácie</h4>
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
                    <p className="text-muted-foreground">Žiadne špecifikácie nie sú definované.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">História zmien</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Položka vytvorená</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleString('sk-SK')}
                        </p>
                      </div>
                      <Badge variant="outline">Systém</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Posledná aktualizácia</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.updated_at).toLocaleString('sk-SK')}
                        </p>
                      </div>
                      <Badge variant="outline">Systém</Badge>
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
            <AlertDialogTitle>Potvrdiť vymazanie</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete vymazať položku "{item.name}"? Táto akcia sa nedá vrátiť späť.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Vymazať
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ItemDetailPage;