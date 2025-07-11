import { useState, useMemo } from 'react';
import { Database } from '@/integrations/supabase/types';
import { NotificationCategory, getCategoryForType } from '@/components/notifications/NotificationCategories';

type Notification = Database['public']['Tables']['notifications']['Row'];

export interface NotificationFilters {
  category: NotificationCategory;
  priority: string | null;
  isRead: boolean | null;
  search: string;
}

export const useNotificationFilters = (notifications: Notification[]) => {
  const [filters, setFilters] = useState<NotificationFilters>({
    category: 'all',
    priority: null,
    isRead: null,
    search: ''
  });

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      // Category filter
      if (filters.category !== 'all') {
        const notificationCategory = getCategoryForType(notification.type);
        if (notificationCategory !== filters.category) {
          return false;
        }
      }

      // Priority filter
      if (filters.priority && notification.priority !== filters.priority) {
        return false;
      }

      // Read status filter
      if (filters.isRead !== null && notification.is_read !== filters.isRead) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleMatch = notification.title.toLowerCase().includes(searchLower);
        const messageMatch = notification.message.toLowerCase().includes(searchLower);
        if (!titleMatch && !messageMatch) {
          return false;
        }
      }

      return true;
    });
  }, [notifications, filters]);

  const updateFilter = (key: keyof NotificationFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priority: null,
      isRead: null,
      search: ''
    });
  };

  return {
    filters,
    filteredNotifications,
    updateFilter,
    clearFilters
  };
};