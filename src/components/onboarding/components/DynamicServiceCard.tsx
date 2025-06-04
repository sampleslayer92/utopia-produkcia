
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Edit2 } from "lucide-react";
import { ServiceCard, AddonCard } from "@/types/onboarding";
import { getAddonIcon } from "../config/addonCatalog";
import { formatCurrencyWithColor } from "../utils/currencyUtils";

interface DynamicServiceCardProps {
  service: ServiceCard;
  onUpdate: (service: ServiceCard) => void;
  onRemove: () => void;
  onEdit?: () => void;
}

const DynamicServiceCard = ({ service, onUpdate, onRemove, onEdit }: DynamicServiceCardProps) => {
  const updateField = (field: keyof ServiceCard, value: any) => {
    onUpdate({ ...service, [field]: value });
  };

  const calculateMainItemSubtotal = () => {
    return service.count * service.monthlyFee;
  };

  const calculateAddonsSubtotal = () => {
    return (service.addons || []).reduce((sum, addon) => {
      const quantity = addon.isPerDevice ? service.count : (addon.customQuantity || 1);
      return sum + (quantity * addon.monthlyFee);
    }, 0);
  };

  const calculateTotalSubtotal = () => {
    return calculateMainItemSubtotal() + calculateAddonsSubtotal();
  };

  const mainSubtotal = calculateMainItemSubtotal();
  const addonsSubtotal = calculateAddonsSubtotal();
  const totalSubtotal = calculateTotalSubtotal();

  const mainSubtotalFormatted = formatCurrencyWithColor(mainSubtotal);
  const addonsSubtotalFormatted = formatCurrencyWithColor(addonsSubtotal);
  const totalSubtotalFormatted = formatCurrencyWithColor(totalSubtotal);

  return (
    <Card className="border-slate-200/60 bg-white shadow-md">
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
          <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
            <span className="text-xs text-slate-500 text-center">⚙️ {service.name}</span>
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-900">{service.name}</CardTitle>
            <p className="text-sm text-slate-600 mt-1">{service.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {service.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {service.count} ks
              </Badge>
              {(service.addons?.length || 0) > 0 && (
                <Badge variant="outline" className="text-xs text-green-600">
                  +{service.addons?.length} doplnkov
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`count-${service.id}`}>Počet ks</Label>
            <Input
              id={`count-${service.id}`}
              type="number"
              min="1"
              value={service.count}
              onChange={(e) => updateField('count', parseInt(e.target.value) || 1)}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`fee-${service.id}`}>Mesačný poplatok (EUR)</Label>
            <Input
              id={`fee-${service.id}`}
              type="number"
              min="0"
              step="0.01"
              value={service.monthlyFee}
              onChange={(e) => updateField('monthlyFee', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`company-cost-${service.id}`}>Náklad firmy (EUR)</Label>
            <Input
              id={`company-cost-${service.id}`}
              type="number"
              min="0"
              step="0.01"
              value={service.companyCost}
              onChange={(e) => updateField('companyCost', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          {service.name === 'Iný' && (
            <div className="space-y-2">
              <Label htmlFor={`custom-${service.id}`}>Špecifikácia</Label>
              <Input
                id={`custom-${service.id}`}
                type="text"
                value={service.customValue || ''}
                onChange={(e) => updateField('customValue', e.target.value)}
                className="border-slate-300 focus:border-blue-500"
                placeholder="Opíšte službu"
              />
            </div>
          )}
        </div>

        {/* Addons display */}
        {service.addons && service.addons.length > 0 && (
          <div className="border-t pt-4">
            <h5 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
              🔧 Doplnky ({service.addons.length})
            </h5>
            <div className="space-y-2">
              {service.addons.map((addon: AddonCard) => {
                const quantity = addon.isPerDevice ? service.count : (addon.customQuantity || 1);
                const subtotal = quantity * addon.monthlyFee;
                const subtotalFormatted = formatCurrencyWithColor(subtotal);
                
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
                      <span className={`text-sm font-medium ${subtotalFormatted.className || 'text-green-600'}`}>
                        {subtotalFormatted.value}
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
              <span className={`font-medium ${mainSubtotalFormatted.className}`}>
                {mainSubtotalFormatted.value}
              </span>
            </div>
            {addonsSubtotal > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Doplnky:</span>
                <span className={`font-medium ${addonsSubtotalFormatted.className}`}>
                  {addonsSubtotalFormatted.value}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center border-t pt-2">
              <span className="font-bold text-slate-900">Celkom:</span>
              <span className={`font-bold text-xl ${totalSubtotalFormatted.className || 'text-green-600'}`}>
                {totalSubtotalFormatted.value}/mes
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicServiceCard;
