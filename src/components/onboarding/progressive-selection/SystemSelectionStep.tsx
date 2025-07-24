import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWarehouseItems } from '@/hooks/useWarehouseItems';
import { SystemSelection } from '@/types/selection-flow';

interface SystemSelectionStepProps {
  selectedSystem: string | null;
  onSystemChange: (systemId: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SystemSelectionStep = ({ selectedSystem, onSystemChange, onNext, onPrev }: SystemSelectionStepProps) => {
  const { data: warehouseItems, isLoading } = useWarehouseItems({
    category: 'Pokladničný systém',
    is_active: true
  });

  const [systems, setSystems] = useState<SystemSelection[]>([]);

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
        <h2 className="text-3xl font-bold text-foreground">Výber pokladničného systému</h2>
        <p className="text-muted-foreground text-lg">
          Vyberte si pokladničný systém, ktorý najlepšie vyhovuje vašim potrebám
        </p>
        {selectedSystemData && (
          <Badge variant="secondary" className="text-sm">
            Vybraný systém: {selectedSystemData.name} • {selectedSystemData.monthlyFee.toFixed(2)}€/mesiac
          </Badge>
        )}
      </div>

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
                <CardTitle className="text-xl">{system.name}</CardTitle>
                {selectedSystem === system.id && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary">
                    {system.monthlyFee.toFixed(2)}€
                  </span>
                  <span className="text-sm text-muted-foreground">/mesiac</span>
                </div>
                
                {selectedSystem === system.id && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                    <Check className="h-4 w-4" />
                    Vybraný systém
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
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
          Pokračovať na produkty
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SystemSelectionStep;