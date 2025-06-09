
import { DeviceCard, ServiceCard, AddonCard } from "@/types/onboarding";

export const useCardCalculations = (card: DeviceCard | ServiceCard) => {
  const calculateMainItemSubtotal = () => {
    return card.count * card.monthlyFee;
  };

  const calculateAddonsSubtotal = () => {
    return (card.addons || []).reduce((sum, addon) => {
      const quantity = addon.isPerDevice ? card.count : (addon.customQuantity || 1);
      return sum + (quantity * addon.monthlyFee);
    }, 0);
  };

  const calculateTotalSubtotal = () => {
    return calculateMainItemSubtotal() + calculateAddonsSubtotal();
  };

  const getAddonQuantityAndSubtotal = (addon: AddonCard) => {
    const quantity = addon.isPerDevice ? card.count : (addon.customQuantity || 1);
    const subtotal = quantity * addon.monthlyFee;
    return { quantity, subtotal };
  };

  return {
    mainSubtotal: calculateMainItemSubtotal(),
    addonsSubtotal: calculateAddonsSubtotal(),
    totalSubtotal: calculateTotalSubtotal(),
    getAddonQuantityAndSubtotal
  };
};
