import { formatDistanceToNow } from 'date-fns';
import { sk, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  FileText, 
  UserPlus, 
  AlertTriangle, 
  Settings,
  Bell
} from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Notification = Database['public']['Tables']['notifications']['Row'];

interface NotificationItemProps {
  notification: Notification;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'contract_created':
    case 'contract_status_changed':
      return FileText;
    case 'merchant_registered':
      return UserPlus;
    case 'error_occurred':
      return AlertTriangle;
    case 'system_alert':
      return Settings;
    default:
      return Bell;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'text-red-500';
    case 'high':
      return 'text-orange-500';
    case 'medium':
      return 'text-blue-500';
    case 'low':
      return 'text-gray-500';
    default:
      return 'text-muted-foreground';
  }
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { i18n } = useTranslation();
  const { markAsRead } = useNotifications();
  
  const Icon = getNotificationIcon(notification.type);
  const locale = i18n.language === 'sk' ? sk : enUS;
  
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale
  });

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div
      className={cn(
        'p-3 hover:bg-muted/50 cursor-pointer transition-colors',
        !notification.is_read && 'bg-muted/20'
      )}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          getPriorityColor(notification.priority),
          notification.priority === 'critical' && 'bg-red-50',
          notification.priority === 'high' && 'bg-orange-50',
          notification.priority === 'medium' && 'bg-blue-50',
          notification.priority === 'low' && 'bg-gray-50'
        )}>
          <Icon className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h5 className={cn(
              'text-sm font-medium truncate',
              !notification.is_read && 'font-semibold'
            )}>
              {notification.title}
            </h5>
            {!notification.is_read && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          
          <p className="text-xs text-muted-foreground mt-2">
            {timeAgo}
          </p>
        </div>
      </div>
    </div>
  );
};