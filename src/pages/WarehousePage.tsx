
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from 'react-i18next';
import { WarehouseItemsTable } from "@/components/warehouse/WarehouseItemsTable";
import { useEffect } from 'react';

const WarehousePage = () => {
  const { t, i18n } = useTranslation('admin');

  // Debug: Log translation information on page load
  useEffect(() => {
    console.log('🔍 [WarehousePage Debug] Page loaded with language:', i18n.language);
    console.log('🔍 [WarehousePage Debug] Translation test - warehouse:', t('warehouse.title'));
    console.log('🔍 [WarehousePage Debug] Translation test - navigation:', t('navigation.warehouse'));
    console.log('🔍 [WarehousePage Debug] Current namespace:', 'admin');
    
    // Force refresh i18n resources
    i18n.reloadResources().then(() => {
      console.log('🔍 [WarehousePage Debug] Resources reloaded');
    });
  }, [t, i18n]);

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
