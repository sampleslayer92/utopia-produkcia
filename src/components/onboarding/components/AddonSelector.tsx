
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { AddonCard } from "@/types/onboarding";
import { ADDON_CATALOG, getAddonIcon } from "../config/addonCatalog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AddonSelectorProps {
  selectedAddons: AddonCard[];
  parentCount: number;
  onAddAddon: (addon: AddonCard) => void;
  onRemoveAddon: (addonId: string) => void;
  onUpdateAddon: (addonId: string, updatedAddon: AddonCard) => void;
}

const AddonSelector = ({ 
  selectedAddons, 
  parentCount,
  onAddAddon, 
  onRemoveAddon,
  onUpdateAddon 
}: AddonSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const availableAddons = ADDON_CATALOG.filter(
    addon => !selectedAddons.some(selected => selected.category === addon.category)
  );

  const handleAddAddon = (addonTemplate: typeof ADDON_CATALOG[0]) => {
    const newAddon: AddonCard = {
      ...addonTemplate,
      id: `addon-${addonTemplate.category}-${Date.now()}`,
      customQuantity: addonTemplate.isPerDevice ? parentCount : (addonTemplate.customQuantity || 1)
    };
    onAddAddon(newAddon);
    setIsOpen(false);
  };

  const getEffectiveQuantity = (addon: AddonCard) => {
    return addon.isPerDevice ? parentCount : (addon.customQuantity || 1);
  };

  const getSubtotal = (addon: AddonCard) => {
    return getEffectiveQuantity(addon) * addon.monthlyFee;
  };

  return (
    <div className="space-y-3">
      {/* Selected addons */}
      {selectedAddons.map((addon) => (
        <Card key={addon.id} className="border-slate-200 bg-slate-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getAddonIcon(addon.category)}</span>
                <div>
                  <h5 className="font-medium text-slate-900">{addon.name}</h5>
                  <p className="text-sm text-slate-600">{addon.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {getEffectiveQuantity(addon)} ks
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {addon.monthlyFee.toFixed(2)} €/ks
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-green-600">
                  {getSubtotal(addon).toFixed(2)} €
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onRemoveAddon(addon.id)}
                  className="h-8 w-8 hover:bg-red-50 hover:border-red-300"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            {addon.isPerDevice && (
              <p className="text-xs text-blue-600 mt-2">
                * Množstvo automaticky nastavené podľa hlavnej položky
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add addon button */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Pridať doplnok
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          {availableAddons.map((addon) => (
            <Card 
              key={addon.category}
              className="border-slate-200 hover:bg-slate-50 cursor-pointer"
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
                    <p className="font-medium text-green-600">{addon.monthlyFee.toFixed(2)} €</p>
                    <p className="text-xs text-slate-500">
                      {addon.isPerDevice ? `${parentCount} ks` : `${addon.customQuantity || 1} ks`}
                    </p>
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

export default AddonSelector;
