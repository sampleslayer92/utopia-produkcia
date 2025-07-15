
import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from 'react-i18next';
import { WarehouseItemsTable } from "@/components/warehouse/WarehouseItemsTable";
import { WarehouseDashboard } from "@/components/warehouse/WarehouseDashboard";
import { useLocation } from 'react-router-dom';

const WarehousePage = () => {
  const { t } = useTranslation('admin');
  const location = useLocation();

  // Show dashboard on main warehouse page, form for add-item, table for bulk operations
  const showDashboard = location.pathname === '/admin/warehouse';
  const showAddForm = location.pathname === '/admin/warehouse/add-item';
  const showBulkOps = location.pathname === '/admin/warehouse/bulk';

  const getTitle = () => {
    if (showAddForm) return "➕ Pridať položku";
    if (showBulkOps) return "🔄 Batch operácie";
    return "📦 " + t('navigation.warehouse');
  };

  const getSubtitle = () => {
    if (showAddForm) return "Pridajte novú položku do skladu";
    if (showBulkOps) return "Hromadné úpravy skladových položiek";
    return t('warehouse.subtitle');
  };

  return (
    <AdminLayout
      title={getTitle()}
      subtitle={getSubtitle()}
    >
      {showDashboard ? (
        <WarehouseDashboard />
      ) : showAddForm ? (
        <WarehouseItemsTable showAddForm />
      ) : showBulkOps ? (
        <WarehouseItemsTable showBulkOps />
      ) : (
        <WarehouseItemsTable />
      )}
    </AdminLayout>
  );
};

export default WarehousePage;
