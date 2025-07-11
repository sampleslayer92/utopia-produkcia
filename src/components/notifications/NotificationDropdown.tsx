import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCheck, Settings, Bell, ExternalLink } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationFilters } from '@/hooks/useNotificationFilters';
import { notificationCategories, NotificationCategory } from './NotificationCategories';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAllAsRead } = useNotifications();
  const { filters, filteredNotifications, updateFilter } = useNotificationFilters(notifications);

  if (loading) {
    return (
      <div className="p-3 text-center text-muted-foreground">
        <div className="text-xs">{t('notifications.loading')}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-3 pb-2">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-semibold text-foreground">
            {t('notifications.title')}
          </h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-6 px-1.5 text-xs hover:bg-accent rounded-sm"
            >
              <CheckCheck className="h-2.5 w-2.5 mr-1" />
              <span className="text-xs">{t('notifications.markAllRead')}</span>
            </Button>
          )}
        </div>
      </div>

      <Separator className="mx-3" />

      {/* Compact Notifications List */}
      <ScrollArea className="h-[320px]">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-medium mb-1">
              {t('notifications.empty')}
            </p>
            <p className="text-xs opacity-75">
              {t('notifications.emptyDescription')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {notifications.slice(0, 8).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                compact={true}
              />
            ))}
            {notifications.length > 8 && (
              <div className="p-2 text-center bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  {t('notifications.showingCount', { 
                    shown: 8, 
                    total: notifications.length 
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Compact Footer */}
      <Separator className="mx-3" />
      <div className="p-2 space-y-0.5">
        {notifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/notifications')}
            className="w-full justify-between h-7 px-2 hover:bg-accent text-xs rounded-sm"
          >
            <div className="flex items-center">
              <ExternalLink className="h-2.5 w-2.5 mr-1.5" />
              {t('notifications.viewAll')}
            </div>
            {notifications.length > 8 && (
              <span className="text-xs text-muted-foreground bg-muted px-1 rounded">
                +{notifications.length - 8}
              </span>
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-7 px-2 hover:bg-accent text-xs rounded-sm"
        >
          <Settings className="h-2.5 w-2.5 mr-1.5" />
          {t('notifications.settings')}
        </Button>
      </div>
    </div>
  );
};