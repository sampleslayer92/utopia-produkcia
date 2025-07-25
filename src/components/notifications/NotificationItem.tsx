import { formatDistanceToNow } from 'date-fns';
import { sk, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  UserPlus, 
  AlertTriangle, 
  Settings,
  Bell,
  Check,
  Trash2,
  Eye,
  ExternalLink
} from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { getCategoryConfig, getCategoryForType } from './NotificationCategories';

type Notification = Database['public']['Tables']['notifications']['Row'];

interface NotificationItemProps {
  notification: Notification;
  compact?: boolean;
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
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
    case 'medium':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'low':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getPriorityIconColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'text-red-600 dark:text-red-400';
    case 'high':
      return 'text-orange-600 dark:text-orange-400';
    case 'medium':
      return 'text-blue-600 dark:text-blue-400';
    case 'low':
      return 'text-gray-600 dark:text-gray-400';
    default:
      return 'text-muted-foreground';
  }
};

export const NotificationItem = ({ notification, compact = false }: NotificationItemProps) => {
  const { i18n, t } = useTranslation('admin');
  const { markAsRead } = useNotifications();
  
  const Icon = getNotificationIcon(notification.type);
  const locale = i18n.language === 'sk' ? sk : enUS;
  const categoryConfig = getCategoryConfig(getCategoryForType(notification.type));
  
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale
  });

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(notification.id);
  };

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    // TODO: Navigate to related entity if available
    // if (notification.related_entity_id && notification.entity_type) {
    //   navigate(`/admin/${notification.entity_type}/${notification.related_entity_id}`);
    // }
  };

  if (compact) {
    return (
      <div
        className={cn(
          'group relative p-2 hover:bg-accent/50 cursor-pointer transition-all duration-200',
          !notification.is_read && 'bg-accent/20 border-l border-l-primary'
        )}
        onClick={handleClick}
      >
        <div className="flex gap-2">
          {/* Compact Icon */}
          <div className={cn(
            'flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors',
            getPriorityIconColor(notification.priority),
            notification.priority === 'critical' && 'bg-red-50 dark:bg-red-900/20',
            notification.priority === 'high' && 'bg-orange-50 dark:bg-orange-900/20',
            notification.priority === 'medium' && 'bg-blue-50 dark:bg-blue-900/20',
            notification.priority === 'low' && 'bg-gray-50 dark:bg-gray-900/20'
          )}>
            <Icon className="h-2.5 w-2.5" />
          </div>

          {/* Compact Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1 mb-0.5">
              <h5 className={cn(
                'text-xs font-medium truncate',
                !notification.is_read && 'font-semibold text-foreground'
              )}>
                {notification.title}
              </h5>
              
              {/* Compact Priority Indicator */}
              {(notification.priority === 'high' || notification.priority === 'critical') && (
                <div className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0 mt-0.5',
                  notification.priority === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                )} />
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mb-1 line-clamp-2 leading-tight">
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                <span>{timeAgo}</span>
              </div>
              
              {/* Compact Action */}
              {!notification.is_read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="h-4 w-4 p-0 hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Check className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative p-3 hover:bg-accent/50 cursor-pointer transition-all duration-200',
        !notification.is_read && 'bg-accent/20 border-l-2 border-l-primary'
      )}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* Enhanced Icon with Category Color */}
          <div className={cn(
            'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
            getPriorityIconColor(notification.priority),
            notification.priority === 'critical' && 'bg-red-50 dark:bg-red-900/20',
            notification.priority === 'high' && 'bg-orange-50 dark:bg-orange-900/20',
            notification.priority === 'medium' && 'bg-blue-50 dark:bg-blue-900/20',
            notification.priority === 'low' && 'bg-gray-50 dark:bg-gray-900/20'
          )}>
            <Icon className="h-4 w-4" />
          </div>

        {/* Enhanced Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h5 className={cn(
                'text-sm font-medium truncate',
                !notification.is_read && 'font-semibold text-foreground'
              )}>
                {notification.title}
              </h5>
              <Badge variant="secondary" className={cn(
                'text-xs px-1.5 py-0.5 shrink-0',
                getPriorityColor(notification.priority)
              )}>
                {t(`notifications.priority.${notification.priority}`)}
              </Badge>
            </div>
            {!notification.is_read && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className={cn(categoryConfig.color, "text-xs")}>{categoryConfig.icon}</span>
              <span className="text-xs">{categoryConfig.label}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
            
            {/* Action Buttons - Show on Hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.is_read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="h-6 px-2 text-xs hover:bg-accent"
                >
                  <Check className="h-3 w-3 mr-1" />
                  {t('notifications.markAsRead')}
                </Button>
              )}
              {notification.related_entity_id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs hover:bg-accent"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};