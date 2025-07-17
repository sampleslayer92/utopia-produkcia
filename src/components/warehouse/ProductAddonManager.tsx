import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Settings, Package } from "lucide-react";
import { useProductAddonsByParent, useAvailableAddons, useCreateProductAddon, useUpdateProductAddon, useDeleteProductAddon } from "@/hooks/useProductAddons";
import { useWarehouseItems } from "@/hooks/useWarehouseItems";

interface ProductAddonManagerProps {
  parentProductId?: string;
}

const ProductAddonManager = ({ parentProductId }: ProductAddonManagerProps) => {
  const [selectedParentId, setSelectedParentId] = useState(parentProductId || "");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAddonId, setSelectedAddonId] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [isDefaultSelected, setIsDefaultSelected] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);

  const { data: warehouseItems = [] } = useWarehouseItems();
  const { data: addons = [], refetch } = useProductAddonsByParent(selectedParentId);
  const { data: availableAddons = [] } = useAvailableAddons(selectedParentId);
  const createAddon = useCreateProductAddon();
  const updateAddon = useUpdateProductAddon();
  const deleteAddon = useDeleteProductAddon();

  const selectedProduct = warehouseItems.find(item => item.id === selectedParentId);

  const handleCreateAddon = async () => {
    if (!selectedParentId || !selectedAddonId) return;

    await createAddon.mutateAsync({
      parent_product_id: selectedParentId,
      addon_product_id: selectedAddonId,
      is_required: isRequired,
      is_default_selected: isDefaultSelected,
      display_order: displayOrder,
    });

    setIsAddDialogOpen(false);
    setSelectedAddonId("");
    setIsRequired(false);
    setIsDefaultSelected(false);
    setDisplayOrder(0);
  };

  const handleUpdateAddon = async (id: string, field: string, value: boolean | number) => {
    await updateAddon.mutateAsync({
      id,
      [field]: value,
    });
  };

  const handleDeleteAddon = async (id: string) => {
    if (confirm("Naozaj chcete odstrániť tento doplnok?")) {
      await deleteAddon.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Správa doplnkov produktov
          </CardTitle>
          <CardDescription>
            Priraďte doplnky a príslušenstvo k hlavným produktom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parent-product">Vyberte hlavný produkt</Label>
              <Select value={selectedParentId} onValueChange={setSelectedParentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte produkt..." />
                </SelectTrigger>
                <SelectContent>
                  {warehouseItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium">{selectedProduct.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{selectedProduct.category}</Badge>
                  <Badge variant="outline">{selectedProduct.item_type}</Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedParentId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Priradené doplnky</CardTitle>
                <CardDescription>
                  Spravujte doplnky pre vybraný produkt
                </CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Pridať doplnok
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Pridať doplnok</DialogTitle>
                    <DialogDescription>
                      Vyberte produkt ktorý chcete priradiť ako doplnok
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Doplnok</Label>
                      <Select value={selectedAddonId} onValueChange={setSelectedAddonId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte doplnok..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAddons.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} - {item.monthly_fee}€/mes.
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="required"
                          checked={isRequired}
                          onCheckedChange={setIsRequired}
                        />
                        <Label htmlFor="required">Povinný</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="default-selected"
                          checked={isDefaultSelected}
                          onCheckedChange={setIsDefaultSelected}
                        />
                        <Label htmlFor="default-selected">Automaticky vybraný</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order">Poradie zobrazenia</Label>
                      <Input
                        id="order"
                        type="number"
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(Number(e.target.value))}
                        min={0}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Zrušiť
                      </Button>
                      <Button
                        onClick={handleCreateAddon}
                        disabled={!selectedAddonId || createAddon.isPending}
                      >
                        Pridať
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {addons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Žiadne doplnky nie sú priradené</p>
                <p className="text-sm">Pridajte doplnky pomocou tlačidla vyššie</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doplnok</TableHead>
                    <TableHead>Kategória</TableHead>
                    <TableHead>Cena/mesiac</TableHead>
                    <TableHead>Povinný</TableHead>
                    <TableHead>Auto-vybraný</TableHead>
                    <TableHead>Poradie</TableHead>
                    <TableHead>Akcie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addons.map((addon) => (
                    <TableRow key={addon.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {addon.addon_product?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {addon.addon_product?.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {addon.addon_product?.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        €{addon.addon_product?.monthly_fee}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={addon.is_required}
                          onCheckedChange={(checked) =>
                            handleUpdateAddon(addon.id, 'is_required', checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={addon.is_default_selected}
                          onCheckedChange={(checked) =>
                            handleUpdateAddon(addon.id, 'is_default_selected', checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={addon.display_order}
                          onChange={(e) =>
                            handleUpdateAddon(addon.id, 'display_order', Number(e.target.value))
                          }
                          className="w-20"
                          min={0}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAddon(addon.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductAddonManager;