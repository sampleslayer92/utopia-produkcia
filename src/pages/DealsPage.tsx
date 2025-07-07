
import AdminLayout from "@/components/admin/AdminLayout";
import DealsKanbanBoard from "@/components/admin/deals/DealsKanbanBoard";
import { useTranslation } from 'react-i18next';

const DealsPage = () => {
  const { t } = useTranslation('admin');
  
  return (
    <AdminLayout
      title={t('deals.title')}
      subtitle={t('deals.subtitle')}
    >
      <DealsKanbanBoard />
    </AdminLayout>
  );
};

export default DealsPage;
