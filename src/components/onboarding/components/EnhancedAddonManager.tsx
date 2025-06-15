
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AddonCard } from '@/types/onboarding';
import { v4 as uuidv4 } from 'uuid';

interface EnhancedAddonManagerProps {
  selectedAddons: AddonCard[];
  onAddAddon: (addon: AddonCard) => void;
  onRemoveAddon: (id: string) => void;
  onUpdateAddon: (id: string, addon: AddonCard) => void;
}

const availableAddons = [
  { id: 'receipt-printer', name: 'Tlačiareň účteniek', basePrice: 15, baseCost: 10, category: 'hardware', description: 'Tlačiareň pre účtenky' },
  { id: 'cash-drawer', name: 'Pokladničná zásuvka', basePrice: 20, baseCost: 15, category: 'hardware', description: 'Elektronická pokladničná zásuvka' },
  { id: 'barcode-scanner', name: 'Čítačka čiarových kódov', basePrice: 25, baseCost: 18, category: 'hardware', description: 'Ručná čítačka čiarových kódov' },
  { id: 'installation', name: 'Inštalácia a nastavenie', basePrice: 50, baseCost: 30, category: 'service', description: 'Profesionálna inštalácia zariadenia' },
  { id: 'training', name: 'Školenie personálu', basePrice: 100, baseCost: 60, category: 'service', description: 'Školenie pre používanie systému' }
];

const EnhancedAddonManager = ({
  selectedAddons,
  onAddAddon,
  onRemoveAddon,
  onUpdateAddon
}: EnhancedAddonManagerProps) => {
  const { t } = useTranslation('forms');

  const handleAddAddon = (addonTemplate: typeof availableAddons[0]) => {
    const newAddon: AddonCard = {
      id: `${addonTemplate.id}-${uuidv4()}`,
      name: addonTemplate.name,
      description: addonTemplate.description,
      category: addonTemplate.category,
      monthlyFee: addonTemplate.basePrice,
      companyCost: addonTemplate.baseCost,
      isPerDevice: true,
      customQuantity: 1
    };
    onAddAddon(newAddon);
  };

  const handleUpdateAddon = (id: string, field: string, value: number) => {
    const addon = selectedAddons.find(a => a.id === id);
    if (addon) {
      onUpdateAddon(id, { ...addon, [field]: value });
    }
  };

  const totalSubtotal = selectedAddons.reduce((total, addon) => 
    total + (addon.monthlyFee * (addon.customQuantity || 1)), 0
  );

  const availableToAdd = availableAddons.filter(template => 
    !selectedAddons.some(selected => selected.name === template.name)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t('deviceSelection.addons.title')}
          <Badge variant="outline">
            {selectedAddons.length} {t('deviceSelection.addons.itemsCount')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Add-ons */}
        {selectedAddons.map((addon) => (
          <div key={addon.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{addon.name}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveAddon(addon.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">{t('deviceSelection.addons.quantity')}</Label>
                <Input
                  type="number"
                  min="1"
                  value={addon.customQuantity || 1}
                  onChange={(e) => handleUpdateAddon(addon.id, 'customQuantity', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t('deviceSelection.addons.pricePerUnit')}</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={addon.monthlyFee}
                  onChange={(e) => handleUpdateAddon(addon.id, 'monthlyFee', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t('deviceSelection.addons.companyCostPerUnit')}</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={addon.companyCost}
                  onChange={(e) => handleUpdateAddon(addon.id, 'companyCost', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-600 text-right">
              {t('deviceSelection.addons.subtotal')}: €{(addon.monthlyFee * (addon.customQuantity || 1)).toFixed(2)} {t('deviceSelection.addons.perUnit')}
            </div>
          </div>
        ))}

        {/* Add New Add-on */}
        {availableToAdd.length > 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-3">{t('deviceSelection.addons.addAddon')}:</div>
            <div className="flex flex-wrap gap-2">
              {availableToAdd.map((addon) => (
                <Button
                  key={addon.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddAddon(addon)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-3 w-3" />
                  {addon.name}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-4">
            {t('deviceSelection.addons.allAddonsAdded')}
          </div>
        )}

        {/* Total */}
        {selectedAddons.length > 0 && (
          <div className="border-t pt-3">
            <div className="text-right font-semibold">
              {t('deviceSelection.addons.subtotal')}: €{totalSubtotal.toFixed(2)}/mesiac
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAddonManager;
