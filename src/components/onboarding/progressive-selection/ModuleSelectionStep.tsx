import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWarehouseItems } from '@/hooks/useWarehouseItems';
import { useSolutionCategories } from '@/hooks/useSolutionCategories';
import { ModuleSelection } from '@/types/selection-flow';

interface ModuleSelectionStepProps {
  selectedModules: ModuleSelection[];
  onModulesChange: (modules: ModuleSelection[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ModuleSelectionStep = ({ selectedModules, onModulesChange, onNext, onPrev }: ModuleSelectionStepProps) => {
  // Get categories assigned to the "Pokladňa" solution
  const pokladnaUuid = 'ee043a8f-3699-4c0e-8d21-b71eca1720f0';
  const { data: solutionCategories = [] } = useSolutionCategories(pokladnaUuid);
  
  // Find "Moduly" category from solution categories
  const modulesCategory = solutionCategories.find(sc => 
    sc.category?.name === 'Moduly'
  );
  
  const { data: warehouseItems, isLoading } = useWarehouseItems({
    category_id: modulesCategory?.category_id || undefined,
    is_active: true
  });

  const [modules, setModules] = useState<ModuleSelection[]>([]);

  useEffect(() => {
    if (warehouseItems && warehouseItems.length > 0) {
      const moduleOptions = warehouseItems.map(item => ({
        id: item.id,
        name: item.name,
        selected: selectedModules.some(m => m.id === item.id),
        monthlyFee: Number(item.monthly_fee),
        companyCost: Number(item.company_cost)
      }));
      setModules(moduleOptions);
    }
  }, [warehouseItems, selectedModules]);

  const handleModuleToggle = (moduleId: string) => {
    const updatedModules = modules.map(module => 
      module.id === moduleId 
        ? { ...module, selected: !module.selected }
        : module
    );
    setModules(updatedModules);
    onModulesChange(updatedModules.filter(m => m.selected));
  };

  const selectedCount = modules.filter(m => m.selected).length;
  const totalMonthlyFee = modules.filter(m => m.selected).reduce((sum, m) => sum + m.monthlyFee, 0);

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
        <h2 className="text-3xl font-bold text-foreground">Výber modulov a nastavení</h2>
        <p className="text-muted-foreground text-lg">
          Vyberte si moduly a základné nastavenia pre váš pokladničný systém
        </p>
        {selectedCount > 0 && (
          <Badge variant="secondary" className="text-sm">
            {selectedCount} vybraných modulov • {totalMonthlyFee.toFixed(2)}€/mesiac
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <Card 
            key={module.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              module.selected ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => handleModuleToggle(module.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">{module.name}</CardTitle>
                <Checkbox 
                  checked={module.selected}
                  onChange={() => handleModuleToggle(module.id)}
                  className="mt-1"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {module.monthlyFee.toFixed(2)}€
                </span>
                <span className="text-sm text-muted-foreground">/mesiac</span>
              </div>
              {module.selected && (
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  Vybratý
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Späť na riešenia
        </Button>
        <Button 
          onClick={onNext} 
          disabled={selectedCount === 0}
          className="flex items-center gap-2"
        >
          Pokračovať na výber systému
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ModuleSelectionStep;