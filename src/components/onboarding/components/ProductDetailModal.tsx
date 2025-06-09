
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { DeviceCard, ServiceCard, AddonCard } from "@/types/onboarding";
import { Settings, Package } from "lucide-react";
import QuantityStepper from "./QuantityStepper";
import ProductSpecifications from "./ProductSpecifications";
import EnhancedAddonManager from "./EnhancedAddonManager";
import CostBreakdownSummary from "./CostBreakdownSummary";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation('forms');
  const [formData, setFormData] = useState<any>(null);
  const [pricingMode, setPricingMode] = useState<'rental' | 'purchase'>('rental');

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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {productType === 'device' ? (
              <Package className="h-5 w-5 text-blue-600" />
            ) : (
              <Settings className="h-5 w-5 text-green-600" />
            )}
            {mode === 'add' 
              ? t('deviceSelection.modal.addTitle', { name: formData.name })
              : t('deviceSelection.modal.editTitle', { name: formData.name })
            }
          </DialogTitle>
        </DialogHeader>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-8 py-6">
          {/* LEFT COLUMN - Product Display */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="w-full aspect-square max-w-sm mx-auto bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
              {productType === 'device' && formData.image ? (
                <img 
                  src={formData.image} 
                  alt={formData.name} 
                  className="w-full h-full object-contain hover:scale-105 transition-transform cursor-pointer" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`text-center text-slate-500 ${formData.image ? 'hidden' : ''}`}>
                <Package className="h-16 w-16 mx-auto mb-2 text-slate-400" />
                <span className="text-sm">{formData.name}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{formData.name}</h3>
              <p className="text-slate-600 mb-4">{formData.description}</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                <Badge variant="secondary" className="text-sm">
                  {formData.category}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {productType === 'device' ? 'Zariadenie' : 'Služba'}
                </Badge>
              </div>
            </div>

            {/* Product Specifications */}
            {productType === 'device' && (
              <ProductSpecifications product={formData} />
            )}
          </div>

          {/* RIGHT COLUMN - Configuration */}
          <div className="space-y-6">
            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t('deviceSelection.modal.quantity')}</Label>
              <QuantityStepper
                value={formData.count}
                onChange={(value) => updateField('count', value)}
                min={1}
                max={50}
                className="w-32"
              />
            </div>

            {/* Device specific options */}
            {productType === 'device' && (
              <div className="space-y-3">
                <Label className="text-base font-medium">{t('deviceSelection.modal.pricingMode')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={pricingMode === 'rental' ? 'default' : 'outline'}
                    onClick={() => handlePricingModeChange('rental')}
                    className="text-sm"
                  >
                    {t('deviceSelection.modal.rental')}
                  </Button>
                  <Button
                    variant={pricingMode === 'purchase' ? 'default' : 'outline'}
                    onClick={() => handlePricingModeChange('purchase')}
                    className="text-sm"
                  >
                    {t('deviceSelection.modal.purchase')}
                  </Button>
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly-fee" className="text-base font-medium">
                  {productType === 'device' 
                    ? (pricingMode === 'rental' 
                       ? t('deviceSelection.modal.monthlyFeeDevice')
                       : t('deviceSelection.modal.purchasePriceDevice'))
                    : t('deviceSelection.modal.monthlyFeeService')
                  }
                </Label>
                <Input
                  id="monthly-fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthlyFee}
                  onChange={(e) => updateField('monthlyFee', parseFloat(e.target.value) || 0)}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-cost" className="text-base font-medium">
                  {t('deviceSelection.modal.companyCost')}
                </Label>
                <Input
                  id="company-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.companyCost}
                  onChange={(e) => updateField('companyCost', parseFloat(e.target.value) || 0)}
                  className="text-base"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Custom value for services */}
            {productType === 'service' && formData.name === 'Iný' && (
              <div className="space-y-2">
                <Label htmlFor="custom-value" className="text-base font-medium">
                  {t('deviceSelection.modal.customSpecification')}
                </Label>
                <Textarea
                  id="custom-value"
                  value={formData.customValue || ''}
                  onChange={(e) => updateField('customValue', e.target.value)}
                  className="text-base"
                  placeholder={t('deviceSelection.modal.customSpecificationPlaceholder')}
                  rows={3}
                />
              </div>
            )}

            {/* Enhanced Addons Section */}
            <div className="border-t pt-6">
              <EnhancedAddonManager
                selectedAddons={formData.addons || []}
                onAddAddon={handleAddAddon}
                onRemoveAddon={handleRemoveAddon}
                onUpdateAddon={handleUpdateAddon}
              />
            </div>

            {/* Cost Summary */}
            <div className="border-t pt-6">
              <CostBreakdownSummary
                mainItem={{
                  name: formData.name,
                  count: formData.count,
                  monthlyFee: formData.monthlyFee,
                  companyCost: formData.companyCost
                }}
                addons={formData.addons || []}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            {t('deviceSelection.modal.cancel')}
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {mode === 'add' ? t('deviceSelection.modal.addToCart') : t('deviceSelection.modal.saveChanges')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
