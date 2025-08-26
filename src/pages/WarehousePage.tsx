
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from 'react-i18next';
import { SimpleWarehouseTable } from '@/components/warehouse/SimpleWarehouseTable';
import { WarehouseDashboard } from '@/components/warehouse/WarehouseDashboard';
import { SolutionWorkflow } from '@/components/solutions/SolutionWorkflow';
import { EnhancedVisualBuilder } from '@/components/warehouse/EnhancedVisualBuilder';
import { BulkOperationsPanel } from '@/components/warehouse/BulkOperationsPanel';
import { QuickSalePage } from './QuickSalePage';
import { useLocation } from 'react-router-dom';

const WarehousePage = () => {
  const { t } = useTranslation('admin');
  const location = useLocation();

  // Show items table on main warehouse page, dashboard in separate section
  const showDashboard = location.pathname === '/admin/warehouse/dashboard';
  const showAddForm = location.pathname === '/admin/warehouse/add-item';
  const showBulkOps = location.pathname === '/admin/warehouse/bulk';
  const showSolutions = location.pathname === '/admin/warehouse/solutions';
  const showCategories = location.pathname === '/admin/warehouse/categories';
  const showItemTypes = location.pathname === '/admin/warehouse/item-types';
  const showVisualBuilder = location.pathname === '/admin/warehouse/visual-builder';
  const showQuickSale = location.pathname === '/admin/warehouse/quick-sale';

  const getTitle = () => {
    if (showAddForm) return t('warehouse.addItemTitle');
    if (showBulkOps) return t('warehouse.bulkOperationsTitle');
    if (showSolutions) return t('warehouse.solutionsTitle');
    if (showCategories) return t('warehouse.categoriesTitle');
    if (showItemTypes) return t('warehouse.itemTypesTitle');
    if (showVisualBuilder) return t('warehouse.visualBuilderTitle');
    if (showQuickSale) return t('warehouse.quickSaleTitle');
    if (showDashboard) return t('warehouse.dashboardTitle');
    return t('warehouse.itemsTitle');
  };

  const getSubtitle = () => {
    if (showAddForm) return t('warehouse.addItemSubtitle');
    if (showBulkOps) return t('warehouse.bulkOperationsSubtitle');
    if (showSolutions) return t('warehouse.solutionsSubtitle');
    if (showCategories) return t('warehouse.categoriesSubtitle');
    if (showItemTypes) return t('warehouse.itemTypesSubtitle');
    if (showVisualBuilder) return t('warehouse.visualBuilderSubtitle');
    if (showQuickSale) return t('warehouse.quickSaleSubtitle');
    if (showDashboard) return t('warehouse.dashboardSubtitle');
    return t('warehouse.itemsSubtitle');
  };

  return (
    <AdminLayout
      title={getTitle()}
      subtitle={getSubtitle()}
    >
      {showAddForm ? (
        <SimpleWarehouseTable showAddForm />
      ) : showBulkOps ? (
        <BulkOperationsPanel />
      ) : showSolutions ? (
        <SolutionWorkflow />
      ) : showCategories ? (
        <div className="text-center text-muted-foreground">{t('warehouse.categoriesSubtitle')}</div>
      ) : showItemTypes ? (
        <div className="text-center text-muted-foreground">{t('warehouse.itemTypesSubtitle')}</div>
      ) : showVisualBuilder ? (
        <EnhancedVisualBuilder />
      ) : showQuickSale ? (
        <QuickSalePage />
      ) : showDashboard ? (
        <WarehouseDashboard />
      ) : (
        <SimpleWarehouseTable />
      )}
    </AdminLayout>
  );
};

export default WarehousePage;
