import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Package, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useCategory } from '@/hooks/useCategories';
import { useDeleteWarehouseItem } from '@/hooks/useWarehouseItems';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface WarehouseItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  item_type: string;
  monthly_fee: number;
  setup_fee: number;
  company_cost: number;
  is_active: boolean;
  current_stock: number | null;
  image_url: string | null;
}

const CategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteItem, setDeleteItem] = useState<WarehouseItem | null>(null);
  const { data: category, isLoading: categoryLoading } = useCategory(id!);
  const deleteMutation = useDeleteWarehouseItem();
  
  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['warehouse-items', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warehouse_items')
        .select('*')
        .eq('category_id', id)
        .order('name');
      
      if (error) throw error;
      return data as WarehouseItem[];
    },
    enabled: !!id,
  });

  if (categoryLoading || itemsLoading) {
    return (
      <AdminLayout title="Kategória" subtitle="Načítavam...">
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  if (!category) {
    return (
      <AdminLayout title="Kategória nenájdená" subtitle="Kategória neexistuje">
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Kategória nenájdená</h3>
          <p className="text-muted-foreground mb-6">Požadovaná kategória neexistuje.</p>
          <Button onClick={() => navigate('/admin/warehouse/categories')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Späť na kategórie
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleDelete = async (item: WarehouseItem) => {
    try {
      await deleteMutation.mutateAsync(item.id);
      setDeleteItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <AdminLayout 
      title={category.name} 
      subtitle={`Produkty a služby v kategórii ${category.name}`}
    >
      <div className="space-y-6">
        {/* Header with navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/warehouse/categories')}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na kategórie
            </Button>
            <div className="text-sm text-muted-foreground">
              Sklad → Kategórie → {category.name}
            </div>
          </div>
          <Button onClick={() => navigate('/admin/warehouse/add-item', { 
            state: { selectedCategory: category.id } 
          })}>
            <Plus className="h-4 w-4 mr-2" />
            Pridať položku
          </Button>
        </div>

        {/* Category Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                  <Badge variant={category.is_active ? 'default' : 'secondary'}>
                    {category.is_active ? 'Aktívna' : 'Neaktívna'}
                  </Badge>
                </CardTitle>
                {category.description && (
                  <p className="text-muted-foreground mt-2">{category.description}</p>
                )}
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Upraviť kategóriu
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Typ filtra:</span>
                <Badge variant="outline" className="ml-2">
                  {category.item_type_filter === 'both' ? 'Všetko' :
                   category.item_type_filter === 'device' ? 'Zariadenia' : 'Služby'}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Počet položiek:</span>
                <span className="ml-2">{items?.length || 0}</span>
              </div>
              <div>
                <span className="font-medium">Pozícia:</span>
                <span className="ml-2">{category.position}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Items Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Položky v kategórii ({items?.length || 0})
          </h3>
          
          {!items || items.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h4 className="text-lg font-semibold mb-2">Žiadne položky</h4>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  V tejto kategórii sa zatiaľ nenachádzajú žiadne produkty ani služby. 
                  Pridajte prvú položku.
                </p>
                <Button onClick={() => navigate('/admin/warehouse/add-item', { 
                  state: { selectedCategory: category.id } 
                })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať prvú položku
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => navigate(`/admin/warehouse/items/${item.id}`)}
                      >
                        <CardTitle className="text-base hover:text-primary transition-colors">
                          {item.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={item.item_type === 'device' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.item_type === 'device' ? 'Zariadenie' : 'Služba'}
                          </Badge>
                          <Badge variant={item.is_active ? 'default' : 'destructive'}>
                            {item.is_active ? 'Aktívne' : 'Neaktívne'}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/warehouse/items/${item.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Zobraziť detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/warehouse/items/${item.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Upraviť
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteItem(item)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Zmazať
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent 
                    className="cursor-pointer"
                    onClick={() => navigate(`/admin/warehouse/items/${item.id}`)}
                  >
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Mesačný poplatok:</span>
                        <span className="font-medium">{formatPrice(item.monthly_fee)}</span>
                      </div>
                      {item.setup_fee > 0 && (
                        <div className="flex justify-between">
                          <span>Inštalácia:</span>
                          <span className="font-medium">{formatPrice(item.setup_fee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Náklady firmy:</span>
                        <span className="font-medium">{formatPrice(item.company_cost)}</span>
                      </div>
                      {item.current_stock !== null && (
                        <div className="flex justify-between">
                          <span>Sklad:</span>
                          <span className={`font-medium ${item.current_stock < 5 ? 'text-destructive' : ''}`}>
                            {item.current_stock} ks
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrdiť vymazanie</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete vymazať položku "{deleteItem?.name}"? Táto akcia sa nedá vrátiť späť.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItem && handleDelete(deleteItem)}
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

export default CategoryDetailPage;