
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from 'react-i18next';
import { SimpleWarehouseTable } from '@/components/warehouse/SimpleWarehouseTable';
import { WarehouseDashboard } from '@/components/warehouse/WarehouseDashboard';
import { SolutionWorkflow } from '@/components/solutions/SolutionWorkflow';
import { VisualBuilder } from '@/components/warehouse/VisualBuilder';
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

  const getTitle = () => {
    if (showAddForm) return "➕ Pridať položku";
    if (showBulkOps) return "🔄 Batch operácie";
    if (showSolutions) return "🎯 Riešenia";
    if (showCategories) return "📁 Kategórie";
    if (showItemTypes) return "🏷️ Typy položiek";
    if (showVisualBuilder) return "🎨 Visual Builder";
    if (showDashboard) return "📊 Dashboard";
    return "📦 " + t('navigation.warehouse');
  };

  const getSubtitle = () => {
    if (showAddForm) return "Pridajte novú položku do skladu";
    if (showBulkOps) return "Hromadné úpravy skladových položiek";
    if (showSolutions) return "Spravujte riešenia a produkty";
    if (showCategories) return "Správa kategórií skladových položiek";
    if (showItemTypes) return "Správa typov skladových položiek";
    if (showVisualBuilder) return "Drag & drop editor pre produkty a riešenia";
    if (showDashboard) return "Prehľad statistík a aktivít";
    return "Prehľadná tabuľka všetkých skladových položiek";
  };

  return (
    <AdminLayout
      title={getTitle()}
      subtitle={getSubtitle()}
    >
      {showAddForm ? (
        <SimpleWarehouseTable showAddForm />
      ) : showBulkOps ? (
        <div className="text-center text-muted-foreground">Hromadné operácie budú implementované v ďalšej verzii</div>
      ) : showSolutions ? (
        <SolutionWorkflow />
      ) : showCategories ? (
        <div className="text-center text-muted-foreground">Správa kategórií bude implementovaná v ďalšej verzii</div>
      ) : showItemTypes ? (
        <div className="text-center text-muted-foreground">Správa typov položiek bude implementovaná v ďalšej verzii</div>
      ) : showVisualBuilder ? (
        <VisualBuilder />
      ) : showDashboard ? (
        <WarehouseDashboard />
      ) : (
        <SimpleWarehouseTable />
      )}
    </AdminLayout>
  );
};

export default WarehousePage;
