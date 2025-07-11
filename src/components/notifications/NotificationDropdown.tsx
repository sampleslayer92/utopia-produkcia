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
      <div className="p-4 text-center text-muted-foreground">
        {t('notifications.loading')}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">
            {t('notifications.title')}
          </h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 px-2 text-xs hover:bg-accent"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              {t('notifications.markAllRead')}
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Notifications List */}
      <ScrollArea className="h-[350px]">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium mb-1">
              {t('notifications.empty')}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.slice(0, 8).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
            {notifications.length > 8 && (
              <div className="p-3 text-center border-t bg-muted/20">
                <p className="text-xs text-muted-foreground mb-2">
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

      {/* Enhanced Footer */}
      <Separator />
      <div className="p-2 space-y-1">
        {notifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/notifications')}
            className="w-full justify-between h-auto p-2 hover:bg-accent"
          >
            <div className="flex items-center">
              <ExternalLink className="h-3 w-3 mr-2" />
              {t('notifications.viewAll')}
            </div>
            {notifications.length > 8 && (
              <span className="text-xs text-muted-foreground">
                +{notifications.length - 8}
              </span>
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-auto p-2 hover:bg-accent"
        >
          <Settings className="h-3 w-3 mr-2" />
          {t('notifications.settings')}
        </Button>
      </div>
    </div>
  );
};