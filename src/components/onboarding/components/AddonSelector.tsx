
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Edit2, Check } from "lucide-react";
import { AddonCard } from "@/types/onboarding";
import { ADDON_CATALOG, getAddonIcon } from "../config/addonCatalog";
import { formatCurrencyWithColor } from "../utils/currencyUtils";
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
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);

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

  const handleUpdateAddon = (addonId: string, field: keyof AddonCard, value: any) => {
    const addon = selectedAddons.find(a => a.id === addonId);
    if (addon) {
      onUpdateAddon(addonId, { ...addon, [field]: value });
    }
  };

  const startEditing = (addonId: string) => {
    setEditingAddonId(addonId);
  };

  const stopEditing = () => {
    setEditingAddonId(null);
  };

  return (
    <div className="space-y-3">
      {/* Selected addons */}
      {selectedAddons.map((addon) => {
        const subtotal = getSubtotal(addon);
        const subtotalFormatted = formatCurrencyWithColor(subtotal);
        const isEditing = editingAddonId === addon.id;

        return (
          <Card key={addon.id} className="border-slate-200 bg-slate-50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-lg mt-1">{getAddonIcon(addon.category)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium text-slate-900">{addon.name}</h5>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => isEditing ? stopEditing() : startEditing(addon.id)}
                        className="h-6 w-6 hover:bg-blue-50 hover:border-blue-300"
                      >
                        {isEditing ? (
                          <Check className="h-3 w-3 text-blue-500" />
                        ) : (
                          <Edit2 className="h-3 w-3 text-blue-500" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{addon.description}</p>
                    
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Počet ks</Label>
                          <Input
                            type="number"
                            min="1"
                            value={addon.isPerDevice ? parentCount : (addon.customQuantity || 1)}
                            onChange={(e) => {
                              if (!addon.isPerDevice) {
                                handleUpdateAddon(addon.id, 'customQuantity', parseInt(e.target.value) || 1);
                              }
                            }}
                            disabled={addon.isPerDevice}
                            className="text-sm h-8"
                          />
                          {addon.isPerDevice && (
                            <p className="text-xs text-blue-600">Automaticky podľa zariadenia</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Cena za kus (€)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={addon.monthlyFee}
                            onChange={(e) => handleUpdateAddon(addon.id, 'monthlyFee', parseFloat(e.target.value) || 0)}
                            className="text-sm h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Firemný náklad (€)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={addon.companyCost}
                            onChange={(e) => handleUpdateAddon(addon.id, 'companyCost', parseFloat(e.target.value) || 0)}
                            className="text-sm h-8"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getEffectiveQuantity(addon)} ks
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {addon.monthlyFee.toFixed(2)} €/ks
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Náklad: {addon.companyCost.toFixed(2)} €/ks
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${subtotalFormatted.className}`}>
                    {subtotalFormatted.value}
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
            </CardContent>
          </Card>
        );
      })}

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
