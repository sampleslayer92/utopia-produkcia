import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from 'react-i18next';

export default function NotificationCenterPage() {
  const { t } = useTranslation('admin');
  
  return (
    <AdminLayout
      title={t('notifications.title')}
      subtitle={t('notifications.subtitle')}
    >
      <NotificationCenter />
    </AdminLayout>
  );
}