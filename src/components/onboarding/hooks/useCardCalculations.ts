
import { DeviceCard, ServiceCard, AddonCard } from "@/types/onboarding";

export const useCardCalculations = (card: DeviceCard | ServiceCard) => {
  const calculateMainItemSubtotal = () => {
    // Ensure we have valid numbers
    const count = Number(card.count) || 0;
    const monthlyFee = Number(card.monthlyFee) || 0;
    return count * monthlyFee;
  };

  const calculateAddonsSubtotal = () => {
    if (!card.addons || !Array.isArray(card.addons)) {
      return 0;
    }

    return card.addons.reduce((sum, addon) => {
      try {
        const quantity = addon.isPerDevice ? Number(card.count) : (Number(addon.customQuantity) || 1);
        const addonFee = Number(addon.monthlyFee) || 0;
        return sum + (quantity * addonFee);
      } catch (error) {
        console.error('Error calculating addon subtotal:', error, addon);
        return sum; // Continue with other addons
      }
    }, 0);
  };

  const calculateTotalSubtotal = () => {
    try {
      return calculateMainItemSubtotal() + calculateAddonsSubtotal();
    } catch (error) {
      console.error('Error calculating total subtotal:', error);
      return 0;
    }
  };

  const getAddonQuantityAndSubtotal = (addon: AddonCard) => {
    try {
      const quantity = addon.isPerDevice ? Number(card.count) : (Number(addon.customQuantity) || 1);
      const subtotal = quantity * (Number(addon.monthlyFee) || 0);
      return { quantity, subtotal };
    } catch (error) {
      console.error('Error calculating addon quantity and subtotal:', error, addon);
      return { quantity: 0, subtotal: 0 };
    }
  };

  return {
    mainSubtotal: calculateMainItemSubtotal(),
    addonsSubtotal: calculateAddonsSubtotal(),
    totalSubtotal: calculateTotalSubtotal(),
    getAddonQuantityAndSubtotal
  };
};
