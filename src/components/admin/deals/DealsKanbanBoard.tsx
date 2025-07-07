
import { useState, useRef } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  closestCorners,
  pointerWithin
} from '@dnd-kit/core';
import { useEnhancedContractsData } from '@/hooks/useEnhancedContractsData';
import { useContractStatusUpdate } from '@/hooks/useContractStatusUpdate';
import { useContractsRealtime } from '@/hooks/useContractsRealtime';
import { useIsMobile } from '@/hooks/use-mobile';
import { useKanbanColumns } from '@/hooks/useKanbanColumns';
import { useDragToScroll } from '@/hooks/useDragToScroll';
import KanbanToolbar from './KanbanToolbar';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import AddColumnModal from './AddColumnModal';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';

const DealsKanbanBoard = () => {
  const [activeContract, setActiveContract] = useState<EnhancedContractData | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const dragScrollRef = useDragToScroll();
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
  const updateContractStatus = useContractStatusUpdate();
  const isMobile = useIsMobile();
  
  // Enable real-time updates
  useContractsRealtime();

  // Configure drag sensors with proper touch support
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 3, // 3px of movement required before drag starts
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200, // 200ms delay to distinguish from scroll
      tolerance: 5, // 5px tolerance for slight movements
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const contract = contracts.find(c => c.id === event.active.id);
    setActiveContract(contract || null);
    
    // Add slight haptic feedback on mobile
    if (isMobile && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    const newOverColumn = over?.id as string || null;
    
    if (newOverColumn !== dragOverColumn) {
      setDragOverColumn(newOverColumn);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveContract(null);
    setDragOverColumn(null);

    if (!over || active.id === over.id) return;

    const contractId = active.id as string;
    const targetColumnId = over.id as string;
    
    // Find the target column and get the first status from it
    const targetColumn = columns.find(col => col.id === targetColumnId);
    if (!targetColumn) return;

    const newStatus = targetColumn.statuses[0]; // Use first status of the column
    
    // Add haptic feedback on successful drop (mobile)
    if (isMobile && navigator.vibrate) {
      navigator.vibrate([50, 50, 100]);
    }
    
    updateContractStatus.mutate({
      contractId,
      newStatus: newStatus as any
    });
  };

  const getContractsForColumn = (columnStatuses: string[]) => {
    return contracts.filter(contract => columnStatuses.includes(contract.status));
  };

  const handleAddColumn = async (columnData: any) => {
    const result = await createColumn(columnData);
    if (result.success) {
      toast.success('Stĺpec bol úspešne pridaný');
    } else {
      toast.error('Chyba pri pridávaní stĺpca');
    }
  };

  const handleResetToDefault = async () => {
    const result = await resetToDefault();
    if (result.success) {
      toast.success('Stĺpce boli resetované na predvolené');
    } else {
      toast.error('Chyba pri resetovaní stĺpcov');
    }
  };

  // Show table view if preference is set to table
  if (preferences.viewMode === 'table') {
    return (
      <div className="h-full flex flex-col">
        <KanbanToolbar
          preferences={preferences}
          onPreferencesChange={updatePreferences}
          onAddColumn={() => setIsAddColumnModalOpen(true)}
          onResetToDefault={handleResetToDefault}
          contractsCount={contracts.length}
        />
        <div className="flex-1 p-6">
          <div className="text-center text-muted-foreground">
            <p>Table view coming soon...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || columnsLoading) {
    return (
      <div className="p-3 md:p-6">
        <div className={`grid gap-3 md:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-5'}`}>
          {Array.from({ length: isMobile ? 3 : 5 }).map((_, i) => (
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
    );
  }

  if (error) {
    return (
      <div className="p-3 md:p-6">
        <Card className="p-8 text-center">
          <p className="text-red-600">Chyba pri načítavaní deals: {error.message}</p>
        </Card>
      </div>
    );
  }

  // Mobile layout with horizontal scrolling (Trello-like)
  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        <KanbanToolbar
          preferences={preferences}
          onPreferencesChange={updatePreferences}
          onAddColumn={() => setIsAddColumnModalOpen(true)}
          onResetToDefault={handleResetToDefault}
          contractsCount={contracts.length}
        />
        <div className="flex-1">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart} 
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div 
              ref={dragScrollRef}
              className="flex gap-3 overflow-x-auto pb-4 scrollbar-hidden snap-x snap-mandatory p-3"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {columns.map((column) => {
                const columnContracts = getContractsForColumn(column.statuses);
                const isDropTarget = dragOverColumn === column.id;
                
                return (
                  <div 
                    key={column.id}
                    className="flex-shrink-0 w-80 snap-start"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <KanbanColumn
                      id={column.id}
                      column={column}
                      contracts={columnContracts}
                      isDropTarget={isDropTarget}
                      onUpdateColumn={updateColumn}
                    />
                  </div>
                );
              })}
            </div>

            <DragOverlay dropAnimation={{ duration: 300, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
              {activeContract ? (
                <div className="animate-kanban-drag">
                  <KanbanCard contract={activeContract} isDragging />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    );
  }

  // Desktop layout with drag & drop
  return (
    <div className="h-full flex flex-col">
      <KanbanToolbar
        preferences={preferences}
        onPreferencesChange={updatePreferences}
        onAddColumn={() => setIsAddColumnModalOpen(true)}
        onResetToDefault={handleResetToDefault}
        contractsCount={contracts.length}
      />
      <div className="flex-1">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart} 
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div 
            ref={dragScrollRef}
            className="grid grid-cols-2 lg:grid-cols-5 gap-6 min-h-[600px] overflow-x-auto scrollbar-hidden p-6"
          >
            {columns.map((column) => {
              const columnContracts = getContractsForColumn(column.statuses);
              const isDropTarget = dragOverColumn === column.id;
              
              return (
                <KanbanColumn
                  key={column.id}
                  id={column.id}
                  column={column}
                  contracts={columnContracts}
                  isDropTarget={isDropTarget}
                  onUpdateColumn={updateColumn}
                />
              );
            })}
          </div>

          <DragOverlay dropAnimation={{ duration: 300, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
            {activeContract ? (
              <div className="animate-kanban-drag">
                <KanbanCard contract={activeContract} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
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
