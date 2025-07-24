import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, ArrowLeft, Package } from 'lucide-react';
import { useWarehouseItems } from '@/hooks/useWarehouseItems';
import { useSolutionCategories } from '@/hooks/useSolutionCategories';
import { SystemSelection } from '@/types/selection-flow';
import CompactProductCard from './CompactProductCard';

interface SystemSelectionStepProps {
  selectedSystem: string | null;
  onSystemChange: (systemId: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface ProductQuantity {
  [productId: string]: number;
}

const SystemSelectionStep = ({ selectedSystem, onSystemChange, onNext, onPrev }: SystemSelectionStepProps) => {
  // Get categories assigned to the "Pokladňa" solution
  const pokladnaUuid = 'ee043a8f-3699-4c0e-8d21-b71eca1720f0';
  const { data: solutionCategories = [] } = useSolutionCategories(pokladnaUuid);
  
  // Find "Pokladničný systém" category from solution categories
  const systemsCategory = solutionCategories.find(sc => 
    sc.category?.name === 'Pokladničný systém'
  );
  
  const { data: warehouseItems, isLoading } = useWarehouseItems({
    category_id: systemsCategory?.category_id || undefined,
    is_active: true
  });

  const [systems, setSystems] = useState<SystemSelection[]>([]);
  const [productQuantities, setProductQuantities] = useState<ProductQuantity>({});

  useEffect(() => {
    if (warehouseItems && warehouseItems.length > 0) {
      const systemOptions = warehouseItems.map(item => ({
        id: item.id,
        name: item.name,
        selected: selectedSystem === item.id,
        monthlyFee: Number(item.monthly_fee),
        companyCost: Number(item.company_cost)
      }));
      setSystems(systemOptions);
    }
  }, [warehouseItems, selectedSystem]);

  const handleSystemSelect = (systemId: string) => {
    onSystemChange(systemId);
  };

  const selectedSystemData = systems.find(s => s.id === selectedSystem);

  // Get all product categories (except system and modules) for the selected solution
  const productCategories = solutionCategories.filter(sc => 
    sc.category?.name !== 'Pokladničný systém' && 
    sc.category?.name !== 'Moduly'
  );

  // Get all products from these categories
  const categoryIds = productCategories.map(sc => sc.category_id).filter(Boolean);
  const { data: allProducts = [] } = useWarehouseItems({
    category_id: categoryIds.length > 0 ? categoryIds[0] : undefined, // For now, just use first category
    is_active: true
  });

  const handleProductQuantityChange = (productId: string, quantity: number) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const totalSelectedProducts = Object.values(productQuantities).reduce((sum, qty) => sum + qty, 0);
  const totalProductCost = allProducts.reduce((sum, product) => {
    const quantity = productQuantities[product.id] || 0;
    return sum + (quantity * Number(product.monthly_fee));
  }, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Výber systému a produktov</h2>
        <p className="text-muted-foreground text-lg">
          Dokončite konfiguráciu výberom systému a doplnkových produktov
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {selectedSystemData && (
            <Badge variant="secondary" className="text-sm">
              Systém: {selectedSystemData.name} • {selectedSystemData.monthlyFee.toFixed(2)}€/mesiac
            </Badge>
          )}
          {totalSelectedProducts > 0 && (
            <Badge variant="outline" className="text-sm">
              {totalSelectedProducts} produktov • {totalProductCost.toFixed(2)}€/mesiac
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* System Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Check className="h-5 w-5" />
            1. Pokladničný systém
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systems.map((system) => (
              <Card 
                key={system.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedSystem === system.id ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => handleSystemSelect(system.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{system.name}</CardTitle>
                    {selectedSystem === system.id && (
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {system.monthlyFee.toFixed(2)}€
                    </span>
                    <span className="text-sm text-muted-foreground">/mesiac</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Products Selection */}
        {allProducts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Package className="h-5 w-5" />
              2. Doplnkové produkty (voliteľné)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allProducts.map((product) => (
                <CompactProductCard
                  key={product.id}
                  product={product}
                  quantity={productQuantities[product.id] || 0}
                  onQuantityChange={handleProductQuantityChange}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Späť na moduly
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!selectedSystem}
          className="flex items-center gap-2"
        >
          Dokončiť konfiguráciu
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SystemSelectionStep;