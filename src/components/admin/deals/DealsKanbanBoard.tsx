
import { useState } from 'react';
import { useEnhancedContractsData } from '@/hooks/useEnhancedContractsData';
import { useContractsRealtime } from '@/hooks/useContractsRealtime';
import { useKanbanColumns } from '@/hooks/useKanbanColumns';
import { useViewport } from '@/hooks/useViewport';
import KanbanToolbar from './KanbanToolbar';
import CompactKanbanToolbar from './CompactKanbanToolbar';
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
  const viewport = useViewport();
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

  // Use compact toolbar for smaller screens
  const useCompactMode = viewport.width <= 1366;
  const ToolbarComponent = useCompactMode ? CompactKanbanToolbar : KanbanToolbar;

  // Show table view if preference is set to table
  if (preferences.viewMode === 'table') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <ToolbarComponent
          preferences={preferences}
          onPreferencesChange={updatePreferences}
          onAddColumn={() => setIsAddColumnModalOpen(true)}
          onResetToDefault={handleResetToDefault}
          contractsCount={contracts.length}
        />
        <div className="flex-1 overflow-hidden">
          <TableView contracts={contracts} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  if (isLoading || columnsLoading) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="sticky top-0 z-30 flex items-center justify-between p-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex-1 p-3 overflow-hidden">
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 h-full">
            {Array.from({ length: useCompactMode ? 3 : 5 }).map((_, i) => (
              <Card key={i} className="p-3">
                <Skeleton className="h-5 w-24 mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
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
      <div className="h-full flex flex-col overflow-hidden">
        <ToolbarComponent
          preferences={preferences}
          onPreferencesChange={updatePreferences}
          onAddColumn={() => setIsAddColumnModalOpen(true)}
          onResetToDefault={handleResetToDefault}
          contractsCount={contracts.length}
        />
        <div className="flex-1 p-3 overflow-hidden">
          <Card className="p-6 text-center">
            <p className="text-red-600">{t('deals.errors.loadingDeals', { message: error.message })}</p>
          </Card>
        </div>
      </div>
    );
  }

  // Main kanban view
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ToolbarComponent
        preferences={preferences}
        onPreferencesChange={updatePreferences}
        onAddColumn={() => setIsAddColumnModalOpen(true)}
        onResetToDefault={handleResetToDefault}
        contractsCount={contracts.length}
      />
      
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
