
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Edit2 } from "lucide-react";
import { DeviceCard, AddonCard } from "@/types/onboarding";
import { getAddonIcon } from "../config/addonCatalog";

interface DynamicDeviceCardProps {
  device: DeviceCard;
  onUpdate: (device: DeviceCard) => void;
  onRemove: () => void;
  onEdit?: () => void;
}

const DynamicDeviceCard = ({ device, onUpdate, onRemove, onEdit }: DynamicDeviceCardProps) => {
  const updateField = (field: keyof DeviceCard, value: any) => {
    onUpdate({ ...device, [field]: value });
  };

  const calculateMainItemSubtotal = () => {
    return device.count * device.monthlyFee;
  };

  const calculateAddonsSubtotal = () => {
    return (device.addons || []).reduce((sum, addon) => {
      const quantity = addon.isPerDevice ? device.count : (addon.customQuantity || 1);
      return sum + (quantity * addon.monthlyFee);
    }, 0);
  };

  const calculateTotalSubtotal = () => {
    return calculateMainItemSubtotal() + calculateAddonsSubtotal();
  };

  return (
    <Card className="border-slate-200/60 bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="relative pb-3">
        <div className="absolute top-2 right-2 flex gap-1">
          {onEdit && (
            <Button
              variant="outline"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8 hover:bg-blue-50 hover:border-blue-300"
            >
              <Edit2 className="h-4 w-4 text-blue-500" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 hover:bg-red-50 hover:border-red-300"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
        
        <div className="flex items-start space-x-4 pr-20">
          <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
            {device.image ? (
              <img 
                src={device.image} 
                alt={device.name} 
                className="w-20 h-20 object-contain hover:scale-110 transition-transform cursor-pointer" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={`text-xs text-slate-500 text-center ${device.image ? 'hidden' : ''}`}>
              📦 {device.name}
            </span>
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-900">{device.name}</CardTitle>
            <p className="text-sm text-slate-600 mt-1">{device.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {device.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {device.count} ks
              </Badge>
              {(device.addons?.length || 0) > 0 && (
                <Badge variant="outline" className="text-xs text-green-600">
                  +{device.addons?.length} doplnkov
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Main item pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`count-${device.id}`}>Počet ks</Label>
            <Input
              id={`count-${device.id}`}
              type="number"
              min="1"
              value={device.count}
              onChange={(e) => updateField('count', parseInt(e.target.value) || 1)}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`fee-${device.id}`}>Mesačný poplatok (EUR)</Label>
            <Input
              id={`fee-${device.id}`}
              type="number"
              min="0"
              step="0.01"
              value={device.monthlyFee}
              onChange={(e) => updateField('monthlyFee', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`company-cost-${device.id}`}>Náklad firmy (EUR)</Label>
            <Input
              id={`company-cost-${device.id}`}
              type="number"
              min="0"
              step="0.01"
              value={device.companyCost}
              onChange={(e) => updateField('companyCost', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          {device.simCards !== undefined && (
            <div className="space-y-2">
              <Label htmlFor={`sim-${device.id}`}>SIM karty</Label>
              <Input
                id={`sim-${device.id}`}
                type="number"
                min="0"
                value={device.simCards}
                onChange={(e) => updateField('simCards', parseInt(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Addons display */}
        {device.addons && device.addons.length > 0 && (
          <div className="border-t pt-4">
            <h5 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
              🔧 Doplnky ({device.addons.length})
            </h5>
            <div className="space-y-2">
              {device.addons.map((addon: AddonCard) => {
                const quantity = addon.isPerDevice ? device.count : (addon.customQuantity || 1);
                const subtotal = quantity * addon.monthlyFee;
                
                return (
                  <div key={addon.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getAddonIcon(addon.category)}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{addon.name}</p>
                          <p className="text-xs text-slate-600">
                            {quantity} ks x {addon.monthlyFee.toFixed(2)} €
                            {addon.isPerDevice && (
                              <span className="text-blue-600 ml-1">(automaticky)</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {subtotal.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cost summary */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 border border-blue-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Hlavná položka:</span>
              <span className="font-medium">{calculateMainItemSubtotal().toFixed(2)} €</span>
            </div>
            {calculateAddonsSubtotal() > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Doplnky:</span>
                <span className="font-medium">{calculateAddonsSubtotal().toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t pt-2">
              <span className="font-bold text-slate-900">Celkom:</span>
              <span className="font-bold text-xl text-green-600">
                {calculateTotalSubtotal().toFixed(2)} €/mes
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicDeviceCard;
