
import { useState, useEffect } from 'react';
import { DeviceCard, ServiceCard, AddonCard } from '@/types/onboarding';

interface ProductFormData {
  name: string;
  description: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  customValue: string;
}

interface UseProductFormProps {
  mode: 'add' | 'edit';
  product?: any;
  editingCard?: DeviceCard | ServiceCard;
  isOpen: boolean;
}

export const useProductForm = ({ mode, product, editingCard, isOpen }: UseProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    count: 1,
    monthlyFee: 0,
    companyCost: 0,
    customValue: ''
  });

  const [selectedAddons, setSelectedAddons] = useState<AddonCard[]>([]);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && editingCard) {
        setFormData({
          name: editingCard.name,
          description: editingCard.description || '',
          count: editingCard.count,
          monthlyFee: editingCard.monthlyFee,
          companyCost: editingCard.companyCost,
          customValue: editingCard.name === 'Iný' ? editingCard.description || '' : ''
        });
        setSelectedAddons(editingCard.addons || []);
      } else if (mode === 'add' && product) {
        setFormData({
          name: product.name,
          description: product.description || '',
          count: 1,
          monthlyFee: product.monthlyFee || 0,
          companyCost: product.companyCost || 0,
          customValue: ''
        });
        setSelectedAddons([]);
      }
    }
  }, [mode, product, editingCard, isOpen]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddAddon = (addon: AddonCard) => {
    setSelectedAddons(prev => [...prev, addon]);
  };

  const handleRemoveAddon = (id: string) => {
    setSelectedAddons(prev => prev.filter(addon => addon.id !== id));
  };

  const handleUpdateAddon = (id: string, updatedAddon: AddonCard) => {
    setSelectedAddons(prev => 
      prev.map(addon => addon.id === id ? updatedAddon : addon)
    );
  };

  return {
    formData,
    selectedAddons,
    updateField,
    handleAddAddon,
    handleRemoveAddon,
    handleUpdateAddon
  };
};
