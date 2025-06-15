
import { DeviceCard, ServiceCard, AddonCard } from '@/types/onboarding';
import { v4 as uuidv4 } from 'uuid';

interface ProductFormData {
  name: string;
  description: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  customValue: string;
}

interface CreateProductCardProps {
  formData: ProductFormData;
  selectedAddons: AddonCard[];
  productType: 'device' | 'service';
  mode: 'add' | 'edit';
  product?: any;
  editingCard?: DeviceCard | ServiceCard;
}

export const createProductCard = ({
  formData,
  selectedAddons,
  productType,
  mode,
  product,
  editingCard
}: CreateProductCardProps): DeviceCard | ServiceCard => {
  const baseCard = {
    id: mode === 'edit' && editingCard ? editingCard.id : uuidv4(),
    name: formData.name,
    description: formData.name === 'Iný' ? formData.customValue : formData.description,
    count: formData.count,
    monthlyFee: formData.monthlyFee,
    companyCost: formData.companyCost,
    addons: selectedAddons,
    type: productType as 'device' | 'service'
  };

  if (productType === 'device') {
    return {
      ...baseCard,
      type: 'device',
      category: product?.category || 'terminals'
    } as DeviceCard;
  } else {
    return {
      ...baseCard,
      type: 'service',
      category: product?.category || 'software'
    } as ServiceCard;
  }
};
