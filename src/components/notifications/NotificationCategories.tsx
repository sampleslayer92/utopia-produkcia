export type NotificationCategory = 'all' | 'contracts' | 'merchants' | 'system';

export interface CategoryConfig {
  id: NotificationCategory;
  label: string;
  icon: string;
  color: string;
  types: string[];
}

export const notificationCategories: CategoryConfig[] = [
  {
    id: 'all',
    label: 'Všetky',
    icon: '🔔',
    color: 'text-foreground',
    types: []
  },
  {
    id: 'contracts',
    label: 'Zmluvy',
    icon: '📄',
    color: 'text-blue-600 dark:text-blue-400',
    types: ['contract_created', 'contract_status_changed']
  },
  {
    id: 'merchants',
    label: 'Merchanti',
    icon: '👥',
    color: 'text-green-600 dark:text-green-400',
    types: ['merchant_registered']
  },
  {
    id: 'system',
    label: 'Systém',
    icon: '⚠️',
    color: 'text-orange-600 dark:text-orange-400',
    types: ['error_occurred', 'system_alert']
  }
];

export const getCategoryForType = (type: string): NotificationCategory => {
  for (const category of notificationCategories) {
    if (category.types.includes(type)) {
      return category.id;
    }
  }
  return 'system';
};

export const getCategoryConfig = (categoryId: NotificationCategory): CategoryConfig => {
  return notificationCategories.find(cat => cat.id === categoryId) || notificationCategories[0];
};