
import { useState, useEffect, useCallback } from "react";
import { DeviceCard, ServiceCard, AddonCard } from "@/types/onboarding";

interface ProductFormData {
  name: string;
  description: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  customValue: string;
  locationId: string;
}

interface UseProductFormProps {
  mode: 'add' | 'edit';
  product?: any;
  editingCard?: DeviceCard | ServiceCard;
  isOpen: boolean;
  businessLocations?: Array<{ id: string; name: string }>;
}

export const useProductForm = ({ mode, product, editingCard, isOpen, businessLocations = [] }: UseProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    count: 1,
    monthlyFee: 0,
    companyCost: 0,
    customValue: '',
    locationId: ''
  });
  
  const [selectedAddons, setSelectedAddons] = useState<AddonCard[]>([]);

  useEffect(() => {
    if (mode === 'add' && product) {
      // Auto-assign location if there's only one business location
      const defaultLocationId = businessLocations.length === 1 ? businessLocations[0].id : '';
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        count: 1,
        monthlyFee: product.monthlyFee || 0,
        companyCost: product.companyCost || 0,
        customValue: '',
        locationId: defaultLocationId
      });
      setSelectedAddons([]);
    } else if (mode === 'edit' && editingCard) {
      setFormData({
        name: editingCard.name,
        description: editingCard.description,
        count: editingCard.count,
        monthlyFee: editingCard.monthlyFee,
        companyCost: editingCard.companyCost,
        customValue: (editingCard as ServiceCard).customValue || '',
        locationId: editingCard.locationId || ''
      });
      setSelectedAddons(editingCard.addons || []);
    }
  }, [mode, product, editingCard, isOpen, businessLocations]);

  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddAddon = (addon: AddonCard) => {
    setSelectedAddons(prev => [...prev, addon]);
  };

  const handleRemoveAddon = (addonId: string) => {
    setSelectedAddons(prev => prev.filter(addon => addon.id !== addonId));
  };

  const handleUpdateAddon = (addonId: string, updatedAddon: AddonCard) => {
    setSelectedAddons(prev => 
      prev.map(addon => addon.id === addonId ? updatedAddon : addon)
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
