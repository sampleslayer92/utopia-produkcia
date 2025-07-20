
import { useState } from 'react';
import { useEnhancedContractsData } from '@/hooks/useEnhancedContractsData';
import { useContractsRealtime } from '@/hooks/useContractsRealtime';
import { useKanbanColumns } from '@/hooks/useKanbanColumns';
import AdvancedKanbanToolbar from './AdvancedKanbanToolbar';
import PipedriveKanbanView from './PipedriveKanbanView';
import TableView from '../deals/TableView';
import AddColumnModal from '../deals/AddColumnModal';
import OverviewStatsPanel from './OverviewStatsPanel';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export interface OverviewFilters {
  entityType: 'requests' | 'contracts' | 'both';
  search: string;
  status: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  valueRange: {
    min: number | null;
    max: number | null;
  };
  merchant: string;
  source: string[];
  preset: string | null;
}

const OverviewKanbanBoard = () => {
  const { t } = useTranslation('admin');
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [filters, setFilters] = useState<OverviewFilters>({
    entityType: 'both',
    search: '',
    status: [],
    dateRange: { from: null, to: null },
    valueRange: { min: null, max: null },
    merchant: 'all',
    source: [],
    preset: null
  });

  const { data: contracts = [], isLoading, error } = useEnhancedContractsData();
  const { 
    columns, 
    preferences, 
    isLoading: columnsLoading,
    updateColumn,
    updatePreferences,
    createColumn,
    resetToDefault
  } = useKanbanColumns();
  
  // Enable real-time updates
  useContractsRealtime();

  const handleAddColumn = async (columnData: any) => {
    const result = await createColumn(columnData);
    if (result.success) {
      toast.success(t('overview.success.columnAdded'));
    } else {
      toast.error(t('overview.errors.addingColumn'));
    }
  };

  const handleResetToDefault = async () => {
    const result = await resetToDefault();
    if (result.success) {
      toast.success(t('overview.success.columnsReset'));
    } else {
      toast.error(t('overview.errors.resettingColumns'));
    }
  };

  // Filter contracts based on current filters
  const filteredContracts = contracts.filter(contract => {
    // Entity type filter
    if (filters.entityType === 'requests' && contract.status === 'signed') return false;
    if (filters.entityType === 'contracts' && contract.status !== 'signed') return false;

    // Search filter
    if (filters.search && !contract.contract_number.toLowerCase().includes(filters.search.toLowerCase()) &&
        !contract.clientName?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(contract.status)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.from && new Date(contract.created_at) < filters.dateRange.from) return false;
    if (filters.dateRange.to && new Date(contract.created_at) > filters.dateRange.to) return false;

    // Value range filter
    if (filters.valueRange.min !== null && contract.contractValue < filters.valueRange.min) return false;
    if (filters.valueRange.max !== null && contract.contractValue > filters.valueRange.max) return false;

    // Merchant filter - using contact email as identifier
    if (filters.merchant !== 'all' && contract.contact_info?.email !== filters.merchant) return false;

    // Source filter
    if (filters.source.length > 0 && contract.source && !filters.source.includes(contract.source)) return false;

    return true;
  });

  // Show table view if preference is set to table
  if (preferences.viewMode === 'table') {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-30 bg-background border-b">
          <AdvancedKanbanToolbar
            preferences={preferences}
            onPreferencesChange={updatePreferences}
            onAddColumn={() => setIsAddColumnModalOpen(true)}
            onResetToDefault={handleResetToDefault}
            contractsCount={filteredContracts.length}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
        <div className="flex-1 overflow-auto">
          <TableView contracts={filteredContracts} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  if (isLoading || columnsLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-30 bg-background border-b">
          <div className="flex items-center justify-between p-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-8 w-24" />
          </div>
          <OverviewStatsPanel contracts={[]} isLoading={true} />
        </div>
        <div className="flex-1 overflow-auto p-3 md:p-6">
          <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-30 bg-background border-b">
          <AdvancedKanbanToolbar
            preferences={preferences}
            onPreferencesChange={updatePreferences}
            onAddColumn={() => setIsAddColumnModalOpen(true)}
            onResetToDefault={handleResetToDefault}
            contractsCount={filteredContracts.length}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
        <div className="flex-1 overflow-auto p-3 md:p-6">
          <Card className="p-8 text-center">
            <p className="text-red-600">{t('overview.errors.loadingDeals', { message: error.message })}</p>
          </Card>
        </div>
      </div>
    );
  }

  // Main kanban view with sticky header
  return (
    <div className="h-full flex flex-col">
      {/* Sticky header container */}
      <div className="sticky top-0 z-30 bg-background border-b">
        <AdvancedKanbanToolbar
          preferences={preferences}
          onPreferencesChange={updatePreferences}
          onAddColumn={() => setIsAddColumnModalOpen(true)}
          onResetToDefault={handleResetToDefault}
          contractsCount={filteredContracts.length}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <OverviewStatsPanel contracts={filteredContracts} />
      </div>
      
      {/* Scrollable kanban content */}
      <div className="flex-1 overflow-hidden">
        <PipedriveKanbanView
          contracts={filteredContracts}
          columns={columns}
          onUpdateColumn={updateColumn}
          filters={filters}
        />
      </div>

      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        onAddColumn={handleAddColumn}
        existingColumns={columns}
      />
    </div>
  );
};

export default OverviewKanbanBoard;
