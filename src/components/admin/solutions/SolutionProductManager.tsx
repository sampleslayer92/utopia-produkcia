import { useState } from 'react';
import { Plus, Search, X, Package, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useSolutionItems, useCreateSolutionItem, useDeleteSolutionItem, useBulkAddSolutionItems, useUpdateSolutionItem } from '@/hooks/useSolutionItems';
import { useWarehouseItems } from '@/hooks/useWarehouseItems';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface SolutionProductManagerProps {
  solutionId: string;
}

const SolutionProductManager = ({ solutionId }: SolutionProductManagerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: solutionItems, isLoading: itemsLoading } = useSolutionItems(solutionId);
  const { data: warehouseItems, isLoading: warehouseLoading } = useWarehouseItems();
  const createSolutionItem = useCreateSolutionItem();
  const deleteSolutionItem = useDeleteSolutionItem();
  const updateSolutionItem = useUpdateSolutionItem();
  const bulkAddItems = useBulkAddSolutionItems();

  const assignedItemIds = solutionItems?.map(item => item.warehouse_item_id) || [];
  const availableItems = warehouseItems?.filter(item => 
    item.is_active && 
    !assignedItemIds.includes(item.id) &&
    (searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleRemoveItem = (itemId: string) => {
    deleteSolutionItem.mutate(itemId);
  };

  const handleBulkAdd = () => {
    if (selectedItems.length === 0) return;

    const itemsToAdd = selectedItems.map((warehouseItemId, index) => ({
      solution_id: solutionId,
      warehouse_item_id: warehouseItemId,
      position: (solutionItems?.length || 0) + index,
    }));

    bulkAddItems.mutate(itemsToAdd, {
      onSuccess: () => {
        setSelectedItems([]);
        setShowAddDialog(false);
      },
    });
  };

  if (itemsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Assigned Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Priradené produkty</CardTitle>
              <CardDescription>
                Produkty ktoré sa zobrazia pre toto riešenie v onboardingu
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Pridať produkty
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {solutionItems && solutionItems.length > 0 ? (
            <div className="space-y-4">
              {solutionItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    {item.warehouse_item?.image_url ? (
                      <img 
                        src={item.warehouse_item.image_url} 
                        alt={item.warehouse_item.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{item.warehouse_item?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.warehouse_item?.description}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">
                          {item.warehouse_item?.category}
                        </Badge>
                        <Badge variant="outline">
                          {item.warehouse_item?.item_type}
                        </Badge>
                        {item.is_featured && (
                          <Badge variant="default">
                            <Star className="h-3 w-3 mr-1" />
                            Odporúčané
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.is_featured}
                      onCheckedChange={(checked) => {
                        updateSolutionItem.mutate({
                          id: item.id,
                          solution_id: item.solution_id,
                          warehouse_item_id: item.warehouse_item_id,
                          position: item.position,
                          is_featured: checked,
                        });
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Zatiaľ nie sú priradené žiadne produkty</p>
              <p className="text-sm">Kliknite na "Pridať produkty" pre začiatok</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Products Dialog */}
      {showAddDialog && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pridať produkty</CardTitle>
                <CardDescription>
                  Vyberte produkty zo skladu na pridanie do riešenia
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hľadať produkty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Available Products */}
              {warehouseLoading ? (
                <LoadingSpinner />
              ) : availableItems.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                      />
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.item_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Žiadne dostupné produkty</p>
                  {searchTerm && (
                    <p className="text-sm">Skúste zmeniť vyhľadávanie</p>
                  )}
                </div>
              )}

              {/* Actions */}
              {selectedItems.length > 0 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    Vybraných: {selectedItems.length} produktov
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedItems([])}
                    >
                      Zrušiť výber
                    </Button>
                    <Button
                      onClick={handleBulkAdd}
                      disabled={bulkAddItems.isPending}
                    >
                      {bulkAddItems.isPending ? 'Pridávam...' : 'Pridať vybrané'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SolutionProductManager;