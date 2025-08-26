
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
    if (showAddForm) return "➕ " + t('navigation.addItem');
    if (showBulkOps) return "🔄 " + t('navigation.bulkOperations');
    if (showSolutions) return "🎯 " + t('navigation.solutions');
    if (showCategories) return "📁 " + t('navigation.categories');
    if (showItemTypes) return "🏷️ " + t('navigation.itemTypes');
    if (showVisualBuilder) return "🎨 " + t('navigation.visualBuilder');
    if (showQuickSale) return "💰 " + t('navigation.quickSale');
    if (showDashboard) return "📊 " + t('navigation.reportsDashboard');
    return "📦 " + t('navigation.warehouse');
  };

  const getSubtitle = () => {
    if (showAddForm) return t('warehouse.subtitles.addItem');
    if (showBulkOps) return t('warehouse.subtitles.bulkOperations');
    if (showSolutions) return t('warehouse.subtitles.solutions');
    if (showCategories) return t('warehouse.subtitles.categories');
    if (showItemTypes) return t('warehouse.subtitles.itemTypes');
    if (showVisualBuilder) return t('warehouse.subtitles.visualBuilder');
    if (showQuickSale) return t('warehouse.subtitles.quickSale');
    if (showDashboard) return t('warehouse.subtitles.dashboard');
    return t('warehouse.subtitles.allItems');
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
        <div className="text-center text-muted-foreground">{t('warehouse.comingSoon.categories')}</div>
      ) : showItemTypes ? (
        <div className="text-center text-muted-foreground">{t('warehouse.comingSoon.itemTypes')}</div>
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
