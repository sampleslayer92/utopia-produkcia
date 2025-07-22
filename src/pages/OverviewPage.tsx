import AdminLayout from "@/components/admin/AdminLayout";
import OverviewKanbanBoard from "@/components/admin/overview/OverviewKanbanBoard";
import { useTranslation } from 'react-i18next';

const OverviewPage = () => {
  const { t } = useTranslation('admin');
  
  return (
    <AdminLayout
      title={t('overview.title')}
      subtitle={t('overview.subtitle')}
    >
      <OverviewKanbanBoard />
    </AdminLayout>
  );
};

export default OverviewPage;