import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  CheckCheck, 
  Trash2, 
  Download,
  Settings,
  Bell,
  RefreshCw
} from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationFilters } from '@/hooks/useNotificationFilters';
import { notificationCategories, NotificationCategory } from './NotificationCategories';

export const NotificationCenter = () => {
  const { t } = useTranslation('admin');
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAllAsRead, 
    refetch 
  } = useNotifications();
  
  const { 
    filters, 
    filteredNotifications, 
    updateFilter, 
    clearFilters 
  } = useNotificationFilters(notifications);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getCategoryStats = () => {
    return notificationCategories.map(category => ({
      ...category,
      count: category.id === 'all' 
        ? notifications.length 
        : notifications.filter(n => category.types.includes(n.type)).length,
      unreadCount: category.id === 'all'
        ? notifications.filter(n => !n.is_read).length
        : notifications.filter(n => !n.is_read && category.types.includes(n.type)).length
    }));
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">{t('notifications.loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('notifications.center.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('notifications.center.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t('common.export')}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            {t('notifications.settings')}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {getCategoryStats().map((category) => (
          <div 
            key={category.id}
            className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => updateFilter('category', category.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{category.icon}</span>
              {category.unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {category.unreadCount}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-sm">{category.label}</h3>
            <p className="text-2xl font-bold">{category.count}</p>
            <p className="text-xs text-muted-foreground">
              {category.id === 'all' ? t('notifications.total') : t('notifications.category')}
            </p>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/20 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('notifications.search')}
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Priority Filter */}
          <Select 
            value={filters.priority || 'all'} 
            onValueChange={(value) => updateFilter('priority', value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t('notifications.priority')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('notifications.allPriorities')}</SelectItem>
              <SelectItem value="critical">{t('notifications.critical')}</SelectItem>
              <SelectItem value="high">{t('notifications.high')}</SelectItem>
              <SelectItem value="medium">{t('notifications.medium')}</SelectItem>
              <SelectItem value="low">{t('notifications.low')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Read Status Filter */}
          <Select 
            value={filters.isRead === null ? 'all' : (filters.isRead ? 'read' : 'unread')} 
            onValueChange={(value) => updateFilter('isRead', value === 'all' ? null : value === 'read')}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t('notifications.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('notifications.allStatus')}</SelectItem>
              <SelectItem value="unread">{t('notifications.unread')}</SelectItem>
              <SelectItem value="read">{t('notifications.read')}</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            {t('notifications.clearFilters')}
          </Button>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              {t('notifications.markAllRead')} ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={filters.category} onValueChange={(value) => updateFilter('category', value as NotificationCategory)}>
        <TabsList className="grid w-full grid-cols-4">
          {notificationCategories.map((category) => {
            const categoryStats = getCategoryStats().find(c => c.id === category.id);
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                <span className="hidden sm:inline">{category.label}</span>
                {categoryStats && categoryStats.count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {categoryStats.count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Notifications List */}
        <div className="mt-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                {filters.category === 'all' 
                  ? t('notifications.empty') 
                  : t('notifications.noCategoryNotifications')
                }
              </h3>
              <p className="text-muted-foreground">
                {filters.category !== 'all' && t('notifications.tryDifferentCategory')}
              </p>
            </div>
          ) : (
            <div className="space-y-0 border rounded-lg overflow-hidden bg-card">
              {filteredNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <NotificationItem notification={notification} />
                  {index < filteredNotifications.length - 1 && (
                    <div className="border-b border-border/50" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};