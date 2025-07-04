
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeviceCard, ServiceCard } from "@/types/onboarding";
import { useTranslation } from "react-i18next";
import EnhancedAddonManager from "./EnhancedAddonManager";
import ProductForm from "./ProductDetailModal/ProductForm";
import ProductModalActions from "./ProductDetailModal/ProductModalActions";
import { useProductForm } from "./ProductDetailModal/hooks/useProductForm";
import { createProductCard } from "./ProductDetailModal/utils/productSaveUtils";

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
  
  const {
    formData,
    selectedAddons,
    updateField,
    handleAddAddon,
    handleRemoveAddon,
    handleUpdateAddon
  } = useProductForm({ mode, product, editingCard, isOpen });

  const handleSave = () => {
    try {
      const savedCard = createProductCard({
        formData,
        selectedAddons,
        productType,
        mode,
        product,
        editingCard
      });

      console.log('Generated card with UUID:', savedCard.id);
      onSave(savedCard);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      // TODO: Add toast notification for error
    }
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
          <ProductForm formData={formData} onUpdateField={updateField} />

          <EnhancedAddonManager
            selectedAddons={selectedAddons}
            onAddAddon={handleAddAddon}
            onRemoveAddon={handleRemoveAddon}
            onUpdateAddon={handleUpdateAddon}
          />

          <ProductModalActions
            mode={mode}
            onSave={handleSave}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
