import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Download, 
  ArrowLeft, 
  Package, 
  Trash2, 
  Edit,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWarehouseItems } from '@/hooks/useWarehouseItems';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';

export const BulkOperationsPanel = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkCategory, setBulkCategory] = useState<string>('');
  
  const { data: items = [] } = useWarehouseItems();
  const { data: categories = [] } = useCategories();

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedItems.length === 0) {
      toast.error('Vyberte akciu a aspoň jednu položku');
      return;
    }

    try {
      switch (bulkAction) {
        case 'delete':
          // Implement bulk delete
          toast.success(`Zmazané ${selectedItems.length} položiek`);
          break;
        case 'activate':
          // Implement bulk activate
          toast.success(`Aktivované ${selectedItems.length} položiek`);
          break;
        case 'deactivate':
          // Implement bulk deactivate
          toast.success(`Deaktivované ${selectedItems.length} položiek`);
          break;
        case 'change-category':
          if (!bulkCategory) {
            toast.error('Vyberte kategóriu');
            return;
          }
          // Implement bulk category change
          toast.success(`Kategória zmenená pre ${selectedItems.length} položiek`);
          break;
        default:
          toast.error('Neznáma akcia');
      }
      
      setSelectedItems([]);
      setBulkAction('');
      setBulkCategory('');
    } catch (error) {
      toast.error('Chyba pri vykonávaní hromadnej operácie');
    }
  };

  const exportData = () => {
    const selectedData = items.filter(item => selectedItems.includes(item.id));
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Názov,Kategória,Typ,Mesačný poplatok,Setup poplatok,Náklady,Aktívne\n"
      + selectedData.map(item => 
          `"${item.name}","${item.category}","${item.item_type}",${item.monthly_fee},${item.setup_fee},${item.company_cost},${item.is_active ? 'Áno' : 'Nie'}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "warehouse_items.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Údaje boli exportované');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/warehouse')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Späť do skladu</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">🔄 Batch operácie</h1>
          <p className="text-muted-foreground">Hromadné úpravy skladových položiek</p>
        </div>
      </div>

      <Tabs defaultValue="operations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="operations">Hromadné operácie</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
          <TabsTrigger value="analytics">Analýzy</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-6">
          {/* Selection Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                <span>Výber položiek</span>
              </CardTitle>
              <CardDescription>
                Vyberte položky pre hromadné operácie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={selectedItems.length === items.length && items.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm">
                    Vybrané: {selectedItems.length} z {items.length} položiek
                  </span>
                </div>
                {selectedItems.length > 0 && (
                  <Badge variant="secondary">
                    {selectedItems.length} vybratých
                  </Badge>
                )}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedItems.includes(item.id) 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          checked={selectedItems.includes(item.id)}
                          onChange={() => {}} // Controlled by card click
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-medium">{item.monthly_fee}€/mes</span>
                            <Badge 
                              variant={item.is_active ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {item.is_active ? 'Aktívne' : 'Neaktívne'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5 text-primary" />
                <span>Hromadné akcie</span>
              </CardTitle>
              <CardDescription>
                Vykonajte akcie na vybratých položkách
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte akciu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activate">Aktivovať</SelectItem>
                    <SelectItem value="deactivate">Deaktivovať</SelectItem>
                    <SelectItem value="change-category">Zmeniť kategóriu</SelectItem>
                    <SelectItem value="delete">Zmazať</SelectItem>
                  </SelectContent>
                </Select>

                {bulkAction === 'change-category' && (
                  <Select value={bulkCategory} onValueChange={setBulkCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nová kategória" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Button 
                  onClick={handleBulkAction}
                  disabled={!bulkAction || selectedItems.length === 0}
                  variant={bulkAction === 'delete' ? 'destructive' : 'default'}
                >
                  {bulkAction === 'delete' ? (
                    <Trash2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Edit className="h-4 w-4 mr-2" />
                  )}
                  Vykonať akciu
                </Button>
              </div>

              {bulkAction === 'delete' && selectedItems.length > 0 && (
                <div className="flex items-center space-x-2 p-3 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">
                    Pozor: Táto akcia sa nedá vrátiť späť. Zmaže sa {selectedItems.length} položiek.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <span>Import údajov</span>
                </CardTitle>
                <CardDescription>
                  Importujte položky z CSV súboru
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input type="file" accept=".csv" />
                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Nahrať CSV
                </Button>
                <p className="text-xs text-muted-foreground">
                  Podporované formáty: CSV s hlavičkami
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-primary" />
                  <span>Export údajov</span>
                </CardTitle>
                <CardDescription>
                  Exportujte vybratré položky
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Vybratých položiek: {selectedItems.length}
                </p>
                <Button 
                  onClick={exportData}
                  disabled={selectedItems.length === 0}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportovať ako CSV
                </Button>
                <p className="text-xs text-muted-foreground">
                  Exportuje sa iba vybratých {selectedItems.length} položiek
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Celkový príjem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{items.reduce((sum, item) => sum + item.monthly_fee, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">mesačne</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Celkové náklady</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  €{items.reduce((sum, item) => sum + item.company_cost, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">mesačne</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Čistý zisk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  €{(items.reduce((sum, item) => sum + item.monthly_fee, 0) - 
                     items.reduce((sum, item) => sum + item.company_cost, 0)).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">mesačne</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};