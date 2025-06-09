
import { AddonCard } from "@/types/onboarding";

export const ADDON_CATALOG: Omit<AddonCard, 'id'>[] = [
  {
    type: 'addon',
    category: 'sim',
    name: 'SIM karta',
    description: 'Mobilná SIM karta pre terminál',
    monthlyFee: 2.00,
    companyCost: 1.20,
    isPerDevice: true
  },
  {
    type: 'addon',
    category: 'docking',
    name: 'Dokovacia stanica',
    description: 'Nabíjacia dokovacia stanica',
    monthlyFee: 3.00,
    companyCost: 1.80,
    isPerDevice: false,
    customQuantity: 1
  },
  {
    type: 'addon',
    category: 'case',
    name: 'Obal na terminál',
    description: 'Ochranný obal pre terminál',
    monthlyFee: 1.00,
    companyCost: 0.50,
    isPerDevice: true
  },
  {
    type: 'addon',
    category: 'backup',
    name: 'CHDÚ',
    description: 'Centrálna hlasovania a dátová jednotka',
    monthlyFee: 15.00,
    companyCost: 8.00,
    isPerDevice: false,
    customQuantity: 1
  },
  {
    type: 'addon',
    category: 'printer',
    name: 'Tlačiareň',
    description: 'Bonovacia tlačiareň',
    monthlyFee: 5.00,
    companyCost: 3.00,
    isPerDevice: false,
    customQuantity: 1
  },
  {
    type: 'addon',
    category: 'drawer',
    name: 'Zásuvka',
    description: 'Peňažná zásuvka',
    monthlyFee: 4.00,
    companyCost: 2.50,
    isPerDevice: false,
    customQuantity: 1
  }
];

export const getAddonIcon = (category: string): string => {
  switch (category) {
    case 'sim': return '📱';
    case 'docking': return '🔌';
    case 'case': return '🛡️';
    case 'backup': return '💾';
    case 'printer': return '🖨️';
    case 'drawer': return '💰';
    default: return '🔧';
  }
};
