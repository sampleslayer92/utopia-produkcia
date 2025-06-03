
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X, Settings } from "lucide-react";
import { ServiceCard } from "@/types/onboarding";

interface EnhancedServiceCardProps {
  service: ServiceCard;
  onUpdate: (service: ServiceCard) => void;
  onRemove: () => void;
}

const EnhancedServiceCard = ({ service, onUpdate, onRemove }: EnhancedServiceCardProps) => {
  const updateField = (field: keyof ServiceCard, value: any) => {
    onUpdate({ ...service, [field]: value });
  };

  const handleCountChange = (value: number[]) => {
    updateField('count', value[0]);
  };

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="relative pb-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onRemove}
          className="absolute top-2 right-2 h-8 w-8 hover:bg-red-50 hover:border-red-300"
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
        
        <div className="flex items-start space-x-4 pr-10">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Settings className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 truncate">{service.name}</h4>
            <p className="text-sm text-slate-600 mt-1">{service.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {service.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {service.count} ks
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Quantity Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Počet kusov</Label>
            <span className="text-sm font-medium text-green-600">{service.count}</span>
          </div>
          <Slider
            value={[service.count]}
            onValueChange={handleCountChange}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`fee-${service.id}`} className="text-sm">Mesačný poplatok (€)</Label>
            <Input
              id={`fee-${service.id}`}
              type="number"
              min="0"
              step="0.01"
              value={service.monthlyFee}
              onChange={(e) => updateField('monthlyFee', parseFloat(e.target.value) || 0)}
              className="text-sm"
            />
          </div>
          
          {service.name === 'Iný' && (
            <div className="space-y-2">
              <Label htmlFor={`custom-${service.id}`} className="text-sm">Špecifikácia</Label>
              <Input
                id={`custom-${service.id}`}
                type="text"
                value={service.customValue || ''}
                onChange={(e) => updateField('customValue', e.target.value)}
                className="text-sm"
                placeholder="Opíšte službu"
              />
            </div>
          )}
        </div>

        {/* Cost Summary */}
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Subtotal:</span>
            <span className="font-medium text-slate-900">
              {(service.count * service.monthlyFee).toFixed(2)} €/mes
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
            <span>Ročne:</span>
            <span>{(service.count * service.monthlyFee * 12).toFixed(2)} €</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedServiceCard;
