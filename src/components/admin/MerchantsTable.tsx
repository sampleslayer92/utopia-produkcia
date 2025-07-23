import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Mail, User, Euro, FileText, MapPin, TrendingUp } from "lucide-react";
import { useMerchantsData, Merchant } from "@/hooks/useMerchantsData";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { DataTable, DataTableColumn } from "@/components/ui/data-table";
import { useGenericBulkSelection } from "@/hooks/useGenericBulkSelection";
import { useBulkMerchantActions } from "@/hooks/useBulkMerchantActions";
import { GenericBulkActionsPanel } from "@/components/admin/shared/GenericBulkActionsPanel";
import MerchantCard from "./MerchantCard";

interface MerchantsTableProps {
  key?: number;
  filters?: {
    search: string;
    city: string;
    hasContracts: string;
    profitRange: string;
  };
}

const MerchantsTable = ({ key, filters }: MerchantsTableProps) => {
  const { t } = useTranslation('admin');
  const { data: merchants, isLoading, error, refetch } = useMerchantsData(filters);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Bulk selection state
  const {
    selectedItems,
    isAllSelected,
    selectItem,
    selectAll,
    clearSelection,
    isItemSelected
  } = useGenericBulkSelection(merchants);

  // Bulk actions
  const { bulkDelete, bulkExport, isLoading: isBulkLoading } = useBulkMerchantActions();

  const handleRowClick = (merchant: Merchant) => {
    navigate(`/admin/merchant/${merchant.id}/view`);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    bulkDelete(selectedItems);
    clearSelection();
  };

  const handleBulkExport = () => {
    if (selectedItems.length === 0) return;
    bulkExport(selectedItems);
  };

  const cities = [
    'Bratislava',
    'Košice', 
    'Prešov',
    'Žilina',
    'Banská Bystrica',
    'Nitra',
    'Trnava',
    'Trenčín'
  ];

  const contractOptions = [
    { value: 'true', label: t('merchants.filters.withContracts') },
    { value: 'false', label: t('merchants.filters.withoutContracts') }
  ];

  const profitRangeOptions = [
    { value: '0-100', label: '€0 - €100' },
    { value: '100-500', label: '€100 - €500' },
    { value: '500-1000', label: '€500 - €1000' },
    { value: '1000+', label: '€1000+' }
  ];

  const columns: DataTableColumn<Merchant>[] = [
    {
      key: 'company',
      header: t('merchants.table.company'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">{merchant.company_name}</p>
            {merchant.address_city && (
              <div className="flex items-center text-sm text-slate-500 mt-0.5">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{merchant.address_city}</span>
              </div>
            )}
          </div>
        </div>
      ),
      filter: {
        type: 'text',
        placeholder: t('merchants.filters.searchPlaceholder')
      }
    },
    {
      key: 'contact',
      header: t('merchants.table.contactPerson'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
            <User className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{merchant.contact_person_name}</p>
            <div className="flex items-center text-sm text-slate-500 mt-0.5">
              <Mail className="h-3 w-3 mr-1" />
              <span className="hover:text-blue-600 transition-colors cursor-pointer">{merchant.contact_person_email}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'city',
      header: t('merchants.table.city'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span className="text-slate-700 font-medium">{merchant.address_city || 'N/A'}</span>
        </div>
      ),
      filter: {
        type: 'select',
        options: cities.map(city => ({ value: city, label: city })),
        placeholder: t('merchants.filters.allCities')
      }
    },
    {
      key: 'ico',
      header: t('table.columns.ico'),
      accessor: (merchant) => (
        <span className="font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded text-sm">
          {merchant.ico || 'N/A'}
        </span>
      ),
      className: "text-slate-700"
    },
    {
      key: 'contracts',
      header: t('merchants.table.contracts'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
            <FileText className="h-3 w-3 text-blue-600" />
          </div>
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200 font-medium"
          >
            {merchant.contract_count || 0}
          </Badge>
        </div>
      ),
      filter: {
        type: 'select',
        options: contractOptions,
        placeholder: t('merchants.filters.allMerchants')
      }
    },
    {
      key: 'profit',
      header: t('merchants.table.monthlyProfit'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200">
            <TrendingUp className="h-3 w-3 text-emerald-600" />
          </div>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 border border-emerald-200">
            <span className="font-semibold text-emerald-800">
              €{(merchant.total_monthly_profit || 0).toFixed(2)}
            </span>
          </div>
        </div>
      ),
      filter: {
        type: 'select',
        options: profitRangeOptions,
        placeholder: t('merchants.filters.allValues')
      }
    },
    {
      key: 'created',
      header: t('merchants.table.created'),
      accessor: (merchant) => (
        <div className="flex items-center space-x-2 text-slate-600">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium">
            {format(new Date(merchant.created_at), 'dd.MM.yyyy')}
          </span>
        </div>
      )
    }
  ];

  // Mobile Card Layout
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t('merchants.table.title')}</h2>
          <p className="text-sm text-slate-600 bg-gradient-to-r from-slate-100 to-blue-100 px-3 py-2 rounded-lg border border-slate-200">
            {t('merchants.table.overview', { count: merchants?.length || 0 })}
          </p>
        </div>
        <div className="space-y-4">
          {merchants?.map((merchant: Merchant) => (
            <MerchantCard
              key={merchant.id}
              merchant={merchant}
              onClick={handleRowClick}
            />
          )) || []}
        </div>
      </div>
    );
  }

  // Desktop Table Layout with Bulk Operations
  return (
    <DataTable
      data={merchants || []}
      columns={columns}
      title={t('merchants.table.title')}
      subtitle={t('merchants.table.overview', { count: merchants?.length || 0 })}
      isLoading={isLoading}
      error={error}
      onRowClick={handleRowClick}
      emptyMessage={t('table.emptyMessage')}
      emptyIcon={<Building2 className="h-12 w-12 text-slate-400" />}
      selectable={true}
      selectedItems={selectedItems}
      onSelectionChange={(selectedIds) => {
        // Update selection through individual select calls
        const currentSet = new Set(selectedItems);
        const newSet = new Set(selectedIds);
        
        // Find added and removed items
        const added = selectedIds.filter(id => !currentSet.has(id));
        const removed = selectedItems.filter(id => !newSet.has(id));
        
        // Apply changes
        added.forEach(id => selectItem(id));
        removed.forEach(id => selectItem(id));
      }}
      onSelectAll={() => selectAll(merchants || [])}
      bulkActions={
        <GenericBulkActionsPanel
          selectedCount={selectedItems.length}
          entityName="obchodníka"
          entityNamePlural="obchodníkov"
          onClearSelection={clearSelection}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
          isLoading={isBulkLoading}
        />
      }
    />
  );
};

export default MerchantsTable;
