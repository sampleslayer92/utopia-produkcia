
import { DeviceCard, ServiceCard, AddonCard } from "@/types/onboarding";

interface ProductFormData {
  name: string;
  description: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  customValue: string;
}

interface SaveProductParams {
  formData: ProductFormData;
  selectedAddons: AddonCard[];
  productType: 'device' | 'service';
  mode: 'add' | 'edit';
  product?: any;
  editingCard?: DeviceCard | ServiceCard;
}

const generateUUID = () => {
  return crypto.randomUUID();
};

export const createProductCard = ({
  formData,
  selectedAddons,
  productType,
  mode,
  product,
  editingCard
}: SaveProductParams): DeviceCard | ServiceCard => {
  console.log('Saving product with data:', formData);
  
  const baseCard = {
    name: formData.name,
    description: formData.description,
    count: formData.count,
    monthlyFee: formData.monthlyFee,
    companyCost: formData.companyCost,
    addons: selectedAddons
  };

  if (productType === 'device') {
    return {
      ...baseCard,
      id: mode === 'edit' ? editingCard!.id : generateUUID(),
      type: 'device',
      category: product?.category || editingCard?.category || 'terminal',
      image: product?.image || (editingCard as DeviceCard)?.image,
      catalogId: product?.id || editingCard?.catalogId
    } as DeviceCard;
  } else {
    return {
      ...baseCard,
      id: mode === 'edit' ? editingCard!.id : generateUUID(),
      type: 'service',
      category: product?.category || editingCard?.category || 'software',
      customValue: formData.customValue,
      catalogId: product?.id || editingCard?.catalogId
    } as ServiceCard;
  }
};
