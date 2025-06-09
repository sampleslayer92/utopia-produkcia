
export interface Addon {
  id: string;
  type?: 'addon';
  category: string;
  name: string;
  description?: string;
  monthlyFee: number;
  companyCost: number;
  isPerDevice: boolean;
  customQuantity?: number;
}

// Export AddonCard as alias for Addon
export type AddonCard = Addon;

export interface DeviceCard {
  id: string;
  type: 'device' | 'service';
  category: string;
  name: string;
  description?: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  addons: Addon[];
  image?: string;
  specifications?: string[];
  simCards?: number;
  customValue?: string;
  catalogId?: string; // Add catalogId property
}

// Export ServiceCard as alias for DeviceCard for backward compatibility
export type ServiceCard = DeviceCard;

// Add DynamicCard as alias for DeviceCard for backward compatibility
export type DynamicCard = DeviceCard;

export interface DeviceSelection {
  selectedSolutions: string[];
  dynamicCards: DeviceCard[];
  note?: string;
}
