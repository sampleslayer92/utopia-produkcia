
export interface AddonCard {
  id: string;
  category: string;
  name: string;
  description: string;
  monthlyFee: number;
  companyCost: number;
  isPerDevice: boolean;
  customQuantity?: number;
}

export interface DeviceCard {
  id: string;
  type: 'device';
  name: string;
  description: string;
  category: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  image?: string;
  addons?: AddonCard[];
  catalogId?: string;
  warehouseItemId?: string; // Reference to warehouse item
  specifications?: string[];
  simCards?: number;
  locationId?: string; // ID of the business location this device is assigned to
  customFields?: Record<string, any>; // Custom field values
}

export interface ServiceCard {
  id: string;
  type: 'service';
  name: string;
  description: string;
  category: string;
  count: number;
  monthlyFee: number;
  companyCost: number;
  customValue?: string;
  addons?: AddonCard[];
  catalogId?: string;
  warehouseItemId?: string; // Reference to warehouse item
  locationId?: string; // ID of the business location this service is assigned to
  customFields?: Record<string, any>; // Custom field values
}

export interface DeviceSelection {
  selectedSolutions: string[];
  dynamicCards: Array<DeviceCard | ServiceCard>;
  note?: string;
}

// Alias types for backward compatibility
export type DynamicCard = DeviceCard | ServiceCard;
