
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { AddonCard } from "@/types/onboarding";
import { ADDON_CATALOG, getAddonIcon } from "../config/addonCatalog";
import QuantityStepper from "./QuantityStepper";
import { formatCurrency } from "../utils/currencyUtils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface EnhancedAddonManagerProps {
  selectedAddons: AddonCard[];
  onAddAddon: (addon: AddonCard) => void;
  onRemoveAddon: (addonId: string) => void;
  onUpdateAddon: (addonId: string, updatedAddon: AddonCard) => void;
}

const EnhancedAddonManager = ({ 
  selectedAddons, 
  onAddAddon, 
  onRemoveAddon,
  onUpdateAddon 
}: EnhancedAddonManagerProps) => {
  const [isAddingAddon, setIsAddingAddon] = useState(false);

  const availableAddons = ADDON_CATALOG.filter(
    addon => !selectedAddons.some(selected => selected.category === addon.category)
  );

  const handleAddAddon = (addonTemplate: typeof ADDON_CATALOG[0]) => {
    const newAddon: AddonCard = {
      ...addonTemplate,
      id: `addon-${addonTemplate.category}-${Date.now()}`,
      customQuantity: 1,
      isPerDevice: false // Remove auto-binding behavior
    };
    onAddAddon(newAddon);
    setIsAddingAddon(false);
  };

  const updateAddonField = (addonId: string, field: keyof AddonCard, value: any) => {
    const addon = selectedAddons.find(a => a.id === addonId);
    if (addon) {
      onUpdateAddon(addonId, { ...addon, [field]: value });
    }
  };

  const calculateAddonSubtotal = (addon: AddonCard) => {
    const quantity = addon.customQuantity || 1;
    return quantity * addon.monthlyFee;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-slate-900">Doplnky a príslušenstvo</h4>
        {selectedAddons.length > 0 && (
          <span className="text-sm text-slate-600">
            {selectedAddons.length} položiek
          </span>
        )}
      </div>

      {/* Selected addons */}
      <div className="space-y-3">
        {selectedAddons.map((addon) => {
          const subtotal = calculateAddonSubtotal(addon);
          
          return (
            <Card key={addon.id} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getAddonIcon(addon.category)}</span>
                    <div>
                      <h5 className="font-medium text-slate-900">{addon.name}</h5>
                      <p className="text-sm text-slate-600">{addon.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRemoveAddon(addon.id)}
                    className="h-8 w-8 hover:bg-red-50 hover:border-red-300 flex-shrink-0"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Počet ks</Label>
                    <QuantityStepper
                      value={addon.customQuantity || 1}
                      onChange={(value) => updateAddonField(addon.id, 'customQuantity', value)}
                      min={1}
                      max={50}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Cena za kus (€)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={addon.monthlyFee}
                      onChange={(e) => updateAddonField(addon.id, 'monthlyFee', parseFloat(e.target.value) || 0)}
                      className="text-sm h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Firemný náklad za kus (€)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={addon.companyCost}
                      onChange={(e) => updateAddonField(addon.id, 'companyCost', parseFloat(e.target.value) || 0)}
                      className="text-sm h-9"
                    />
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-600 mb-1">Subtotal</div>
                    <div className="font-medium text-green-600">
                      {formatCurrency(subtotal)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add addon section */}
      <Collapsible open={isAddingAddon} onOpenChange={setIsAddingAddon}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Pridať doplnok
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          {availableAddons.map((addon) => (
            <Card 
              key={addon.category}
              className="border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => handleAddAddon(addon)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getAddonIcon(addon.category)}</span>
                  <div className="flex-1">
                    <h6 className="font-medium text-slate-900">{addon.name}</h6>
                    <p className="text-xs text-slate-600">{addon.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{formatCurrency(addon.monthlyFee)}</p>
                    <p className="text-xs text-slate-500">za kus</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {availableAddons.length === 0 && (
            <p className="text-center text-slate-500 py-4 text-sm">
              Všetky dostupné doplnky už boli pridané
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default EnhancedAddonManager;
