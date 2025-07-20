
import { useState } from 'react';
import { useEnhancedContractsData } from '@/hooks/useEnhancedContractsData';
import { useContractsRealtime } from '@/hooks/useContractsRealtime';
import { useKanbanColumns } from '@/hooks/useKanbanColumns';
import KanbanToolbar from './KanbanToolbar';
import KanbanView from './KanbanView';
import TableView from './TableView';
import AddColumnModal from './AddColumnModal';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const DealsKanbanBoard = () => {
  const { t } = useTranslation('admin');
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
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
      toast.success(t('deals.success.columnAdded'));
    } else {
      toast.error(t('deals.errors.addingColumn'));
    }
  };

  const handleResetToDefault = async () => {
    const result = await resetToDefault();
    if (result.success) {
      toast.success(t('deals.success.columnsReset'));
    } else {
      toast.error(t('deals.errors.resettingColumns'));
    }
  };

  // Show table view if preference is set to table
  if (preferences.viewMode === 'table') {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-30 bg-background border-b">
          <KanbanToolbar
            preferences={preferences}
            onPreferencesChange={updatePreferences}
            onAddColumn={() => setIsAddColumnModalOpen(true)}
            onResetToDefault={handleResetToDefault}
            contractsCount={contracts.length}
          />
        </div>
        <div className="flex-1 overflow-auto">
          <TableView contracts={contracts} isLoading={isLoading} />
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
          <KanbanToolbar
            preferences={preferences}
            onPreferencesChange={updatePreferences}
            onAddColumn={() => setIsAddColumnModalOpen(true)}
            onResetToDefault={handleResetToDefault}
            contractsCount={contracts.length}
          />
        </div>
        <div className="flex-1 overflow-auto p-3 md:p-6">
          <Card className="p-8 text-center">
            <p className="text-red-600">{t('deals.errors.loadingDeals', { message: error.message })}</p>
          </Card>
        </div>
      </div>
    );
  }

  // Main kanban view with sticky header
  return (
    <div className="h-full flex flex-col">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-30 bg-background border-b">
        <KanbanToolbar
          preferences={preferences}
          onPreferencesChange={updatePreferences}
          onAddColumn={() => setIsAddColumnModalOpen(true)}
          onResetToDefault={handleResetToDefault}
          contractsCount={contracts.length}
        />
      </div>
      
      {/* Scrollable kanban content */}
      <div className="flex-1 overflow-hidden">
        <KanbanView
          contracts={contracts}
          columns={columns}
          onUpdateColumn={updateColumn}
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

export default DealsKanbanBoard;
