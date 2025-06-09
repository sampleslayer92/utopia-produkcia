
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DeviceCard, ServiceCard, AddonCard } from "@/types/onboarding";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import EnhancedAddonManager from "./EnhancedAddonManager";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  productType: 'device' | 'service';
  product?: any;
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
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    count: 1,
    monthlyFee: 0,
    companyCost: 0,
    customValue: ''
  });
  
  const [selectedAddons, setSelectedAddons] = useState<AddonCard[]>([]);

  // Generate proper UUID for new products
  const generateUUID = () => {
    return crypto.randomUUID();
  };

  useEffect(() => {
    if (mode === 'add' && product) {
      // For new products, use the template but generate new UUID
      setFormData({
        name: product.name || '',
        description: product.description || '',
        count: 1,
        monthlyFee: product.monthlyFee || 0,
        companyCost: product.companyCost || 0,
        customValue: ''
      });
      setSelectedAddons([]);
    } else if (mode === 'edit' && editingCard) {
      // For editing, preserve existing data
      setFormData({
        name: editingCard.name,
        description: editingCard.description,
        count: editingCard.count,
        monthlyFee: editingCard.monthlyFee,
        companyCost: editingCard.companyCost,
        customValue: (editingCard as ServiceCard).customValue || ''
      });
      setSelectedAddons(editingCard.addons || []);
    }
  }, [mode, product, editingCard, isOpen]);

  const handleSave = () => {
    console.log('Saving product with data:', formData);
    
    try {
      const baseCard = {
        name: formData.name,
        description: formData.description,
        count: formData.count,
        monthlyFee: formData.monthlyFee,
        companyCost: formData.companyCost,
        addons: selectedAddons
      };

      let savedCard: DeviceCard | ServiceCard;

      if (productType === 'device') {
        savedCard = {
          ...baseCard,
          id: mode === 'edit' ? editingCard!.id : generateUUID(),
          type: 'device',
          category: product?.category || editingCard?.category || 'terminal',
          image: product?.image || (editingCard as DeviceCard)?.image,
          catalogId: product?.id || (editingCard as DeviceCard)?.catalogId // Keep reference to original catalog item
        } as DeviceCard;
      } else {
        savedCard = {
          ...baseCard,
          id: mode === 'edit' ? editingCard!.id : generateUUID(),
          type: 'service',
          category: product?.category || editingCard?.category || 'software',
          customValue: formData.customValue,
          catalogId: product?.id || (editingCard as ServiceCard)?.catalogId // Keep reference to original catalog item
        } as ServiceCard;
      }

      console.log('Generated card with UUID:', savedCard.id);
      onSave(savedCard);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      // TODO: Add toast notification for error
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? t('deviceSelection.modal.addTitle') : t('deviceSelection.modal.editTitle')} {formData.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('deviceSelection.modal.quantity')}</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.count}
                  onChange={(e) => updateField('count', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('deviceSelection.modal.monthlyFee')}</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthlyFee}
                  onChange={(e) => updateField('monthlyFee', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('deviceSelection.modal.companyCost')}</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.companyCost}
                onChange={(e) => updateField('companyCost', parseFloat(e.target.value) || 0)}
              />
            </div>

            {formData.name === 'Iný' && (
              <div className="space-y-2">
                <Label>{t('deviceSelection.modal.customSpecification')}</Label>
                <Textarea
                  value={formData.customValue}
                  onChange={(e) => updateField('customValue', e.target.value)}
                  placeholder={t('deviceSelection.modal.customSpecificationPlaceholder')}
                />
              </div>
            )}
          </div>

          {/* Addons Section */}
          <EnhancedAddonManager
            selectedAddons={selectedAddons}
            onAddonsChange={setSelectedAddons}
            deviceCount={formData.count}
          />

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              {t('deviceSelection.modal.cancel')}
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {mode === 'add' ? t('deviceSelection.modal.add') : t('deviceSelection.modal.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
