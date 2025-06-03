
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, Settings, Eye, EyeOff } from "lucide-react";
import { DeviceCard } from "@/types/onboarding";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EnhancedDeviceCardProps {
  device: DeviceCard;
  onUpdate: (device: DeviceCard) => void;
  onRemove: () => void;
}

const EnhancedDeviceCard = ({ device, onUpdate, onRemove }: EnhancedDeviceCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [pricingMode, setPricingMode] = useState<'rental' | 'purchase'>('rental');

  const updateField = (field: keyof DeviceCard, value: any) => {
    onUpdate({ ...device, [field]: value });
  };

  const handleCountChange = (value: number[]) => {
    updateField('count', value[0]);
  };

  const handlePricingModeChange = (mode: 'rental' | 'purchase') => {
    setPricingMode(mode);
    if (mode === 'rental') {
      updateField('monthlyFee', device.name === 'PAX A920 PRO' ? 25 : 20);
    } else {
      updateField('monthlyFee', 0);
    }
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
          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            {device.image ? (
              <img 
                src={device.image} 
                alt={device.name} 
                className="w-14 h-14 object-contain" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={`text-xs text-slate-500 text-center ${device.image ? 'hidden' : ''}`}>
              {device.name}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 truncate">{device.name}</h4>
            <p className="text-sm text-slate-600 mt-1">{device.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {device.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {device.count} ks
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
            <span className="text-sm font-medium text-blue-600">{device.count}</span>
          </div>
          <Slider
            value={[device.count]}
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

        {/* Pricing Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Spôsob platby</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={pricingMode === 'rental' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePricingModeChange('rental')}
              className="text-xs"
            >
              Prenájom
            </Button>
            <Button
              variant={pricingMode === 'purchase' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePricingModeChange('purchase')}
              className="text-xs"
            >
              Kúpa
            </Button>
          </div>
        </div>

        {/* Monthly Fee Input */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`fee-${device.id}`} className="text-sm">
              {pricingMode === 'rental' ? 'Mesačný poplatok' : 'Jednorázová cena'} (€)
            </Label>
            <Input
              id={`fee-${device.id}`}
              type="number"
              min="0"
              step="0.01"
              value={device.monthlyFee}
              onChange={(e) => updateField('monthlyFee', parseFloat(e.target.value) || 0)}
              className="text-sm"
            />
          </div>
          
          {device.simCards !== undefined && (
            <div className="space-y-2">
              <Label htmlFor={`sim-${device.id}`} className="text-sm">SIM karty</Label>
              <Input
                id={`sim-${device.id}`}
                type="number"
                min="0"
                value={device.simCards}
                onChange={(e) => updateField('simCards', parseInt(e.target.value) || 0)}
                className="text-sm"
              />
            </div>
          )}
        </div>

        {/* Cost Summary */}
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Subtotal:</span>
            <span className="font-medium text-slate-900">
              {(device.count * device.monthlyFee).toFixed(2)} €
              {pricingMode === 'rental' && '/mes'}
            </span>
          </div>
          {pricingMode === 'rental' && (
            <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
              <span>Ročne:</span>
              <span>{(device.count * device.monthlyFee * 12).toFixed(2)} €</span>
            </div>
          )}
        </div>

        {/* Specifications Toggle */}
        {device.specifications.length > 0 && (
          <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-between h-auto p-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-3 w-3" />
                  <span>Špecifikácie</span>
                </div>
                {isDetailsOpen ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="bg-slate-50 rounded-md p-3 mt-2 space-y-1">
                {device.specifications.map((spec, index) => (
                  <p key={index} className="text-xs text-slate-600 flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    <span>{spec}</span>
                  </p>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedDeviceCard;
