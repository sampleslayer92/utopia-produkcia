
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { DeviceCard, ServiceCard, AddonCard } from "@/types/onboarding";
import { Settings, Package } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AddonSelector from "./AddonSelector";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  productType: 'device' | 'service';
  product: any;
  editingCard?: DeviceCard | ServiceCard;
  onSave: (card: DeviceCard | ServiceCard) => void;
}

const ProductDetailModal = ({
  isOpen,
  onClose,
  mode,
  productType,
  product,
  editingCard,
  onSave
}: ProductDetailModalProps) => {
  const [formData, setFormData] = useState<any>(null);
  const [pricingMode, setPricingMode] = useState<'rental' | 'purchase'>('rental');
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && editingCard) {
      setFormData(editingCard);
    } else if (mode === 'add' && product) {
      if (productType === 'device') {
        const deviceData = {
          ...product,
          id: `${product.id}-${Date.now()}`,
          type: 'device' as const,
          count: 1,
          monthlyFee: product.rentalPrice || 0,
          companyCost: 0,
          simCards: product.simCards || 0,
          addons: []
        };
        setFormData(deviceData);
      } else {
        const serviceData = {
          id: `${product.id}-${Date.now()}`,
          type: 'service' as const,
          category: product.category || 'software',
          name: product.name,
          description: product.description,
          count: 1,
          monthlyFee: 0,
          companyCost: 0,
          customValue: product.name === 'Iný' ? '' : undefined,
          addons: []
        };
        setFormData(serviceData);
      }
    }
  }, [isOpen, mode, product, editingCard, productType]);

  if (!isOpen || !formData) {
    return null;
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddAddon = (addon: AddonCard) => {
    setFormData((prev: any) => ({
      ...prev,
      addons: [...(prev.addons || []), addon]
    }));
  };

  const handleRemoveAddon = (addonId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      addons: (prev.addons || []).filter((addon: AddonCard) => addon.id !== addonId)
    }));
  };

  const handleUpdateAddon = (addonId: string, updatedAddon: AddonCard) => {
    setFormData((prev: any) => ({
      ...prev,
      addons: (prev.addons || []).map((addon: AddonCard) => 
        addon.id === addonId ? updatedAddon : addon
      )
    }));
  };

  const calculateMainItemSubtotal = () => {
    return formData.count * formData.monthlyFee;
  };

  const calculateAddonsSubtotal = () => {
    return (formData.addons || []).reduce((sum: number, addon: AddonCard) => {
      const quantity = addon.isPerDevice ? formData.count : (addon.customQuantity || 1);
      return sum + (quantity * addon.monthlyFee);
    }, 0);
  };

  const calculateTotalCost = () => {
    return calculateMainItemSubtotal() + calculateAddonsSubtotal();
  };

  const calculateCompanyCost = () => {
    const mainCost = formData.count * formData.companyCost;
    const addonsCost = (formData.addons || []).reduce((sum: number, addon: AddonCard) => {
      const quantity = addon.isPerDevice ? formData.count : (addon.customQuantity || 1);
      return sum + (quantity * addon.companyCost);
    }, 0);
    return mainCost + addonsCost;
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handlePricingModeChange = (mode: 'rental' | 'purchase') => {
    setPricingMode(mode);
    if (productType === 'device' && product) {
      if (mode === 'rental') {
        updateField('monthlyFee', product.rentalPrice || 0);
      } else {
        updateField('monthlyFee', product.purchasePrice || 0);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {productType === 'device' ? (
              <Package className="h-5 w-5 text-blue-600" />
            ) : (
              <Settings className="h-5 w-5 text-green-600" />
            )}
            {mode === 'add' ? 'Pridať' : 'Upraviť'} - {formData.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Info */}
          <div className="flex items-start space-x-4">
            {productType === 'device' && formData.image && (
              <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src={formData.image} 
                  alt={formData.name} 
                  className="w-18 h-18 object-contain" 
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-900">{formData.name}</h3>
              <p className="text-slate-600 mt-1">{formData.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {productType === 'device' ? formData.category : formData.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Počet kusov</Label>
              <span className="text-sm font-medium text-blue-600">{formData.count}</span>
            </div>
            <Slider
              value={[formData.count]}
              onValueChange={(value) => updateField('count', value[0])}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Device specific options */}
          {productType === 'device' && (
            <>
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

              {/* SIM Cards */}
              {formData.simCards !== undefined && (
                <div className="space-y-2">
                  <Label htmlFor="sim-cards" className="text-sm">Počet SIM kariet</Label>
                  <Input
                    id="sim-cards"
                    type="number"
                    min="0"
                    value={formData.simCards}
                    onChange={(e) => updateField('simCards', parseInt(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
              )}
            </>
          )}

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-fee" className="text-sm">
                {productType === 'device' 
                  ? (pricingMode === 'rental' ? 'Mesačný poplatok (€)' : 'Jednorázová cena (€)')
                  : 'Mesačný poplatok (€)'
                }
              </Label>
              <Input
                id="monthly-fee"
                type="number"
                min="0"
                step="0.01"
                value={formData.monthlyFee}
                onChange={(e) => updateField('monthlyFee', parseFloat(e.target.value) || 0)}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-cost" className="text-sm font-medium">
                Mesačný náklad pre firmu (€)
              </Label>
              <Input
                id="company-cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.companyCost}
                onChange={(e) => updateField('companyCost', parseFloat(e.target.value) || 0)}
                className="text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Custom value for services */}
          {productType === 'service' && formData.name === 'Iný' && (
            <div className="space-y-2">
              <Label htmlFor="custom-value" className="text-sm">Špecifikácia služby</Label>
              <Textarea
                id="custom-value"
                value={formData.customValue || ''}
                onChange={(e) => updateField('customValue', e.target.value)}
                className="text-sm"
                placeholder="Opíšte službu..."
                rows={3}
              />
            </div>
          )}

          <Separator />

          {/* Addons Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-slate-900">Doplnky a príslušenstvo</h4>
              <Badge variant="outline" className="text-xs">
                {(formData.addons || []).length} položiek
              </Badge>
            </div>
            
            <AddonSelector
              selectedAddons={formData.addons || []}
              parentCount={formData.count}
              onAddAddon={handleAddAddon}
              onRemoveAddon={handleRemoveAddon}
              onUpdateAddon={handleUpdateAddon}
            />
          </div>

          <Separator />

          {/* Cost Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-slate-900 mb-3">Súhrn nákladov</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Hlavná položka ({formData.count} ks x {formData.monthlyFee.toFixed(2)} €):</span>
                <span className="font-medium">{calculateMainItemSubtotal().toFixed(2)} €</span>
              </div>
              
              {(formData.addons || []).length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Doplnky:</span>
                  <span className="font-medium">{calculateAddonsSubtotal().toFixed(2)} €</span>
                </div>
              )}
              
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium text-slate-900">Subtotal zákazník:</span>
                <span className="font-bold text-blue-600">
                  {calculateTotalCost().toFixed(2)} €/mes
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-900">Náklad firmy:</span>
                <span className="font-bold text-red-600">
                  {calculateCompanyCost().toFixed(2)} €/mes
                </span>
              </div>
              
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-bold text-slate-900">Marža:</span>
                <span className="font-bold text-green-600">
                  {(calculateTotalCost() - calculateCompanyCost()).toFixed(2)} €/mes
                </span>
              </div>
            </div>
          </div>

          {/* Specifications for devices */}
          {productType === 'device' && formData.specifications?.length > 0 && (
            <Collapsible open={isSpecsOpen} onOpenChange={setIsSpecsOpen}>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Špecifikácie</Label>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  {formData.specifications.map((spec: string, index: number) => (
                    <p key={index} className="text-xs text-slate-600 flex items-start">
                      <span className="text-blue-500 mr-2 mt-0.5">•</span>
                      <span>{spec}</span>
                    </p>
                  ))}
                </div>
              </div>
            </Collapsible>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Zrušiť
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {mode === 'add' ? 'Pridať do košíka' : 'Uložiť zmeny'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
