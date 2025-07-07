import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from 'react-i18next';
import { WarehouseItemsTable } from "@/components/warehouse/WarehouseItemsTable";

const WarehousePage = () => {
  const { t } = useTranslation('admin');

  return (
    <AdminLayout
      title={t('navigation.warehouse')}
      subtitle={t('warehouse.subtitle')}
    >
      <WarehouseItemsTable />
    </AdminLayout>
  );
};

export default WarehousePage;