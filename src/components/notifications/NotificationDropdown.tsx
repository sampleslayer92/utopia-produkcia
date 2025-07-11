import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckCheck, Settings, Bell } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationDropdown = () => {
  const { t } = useTranslation('admin');
  const { notifications, unreadCount, loading, markAllAsRead } = useNotifications();

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {t('notifications.loading')}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <h4 className="text-sm font-semibold">
          {t('notifications.title')}
        </h4>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="h-auto p-1 text-xs"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      <Separator />

      {/* Notifications List */}
      <ScrollArea className="h-[400px]">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('notifications.empty')}</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <>
          <Separator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-auto p-2"
            >
              <Settings className="h-3 w-3 mr-2" />
              {t('notifications.settings')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};