import { useState } from 'react';
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
  closestCorners
} from '@dnd-kit/core';
import { useContractStatusUpdate } from '@/hooks/useContractStatusUpdate';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDragToScroll } from '@/hooks/useDragToScroll';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { KanbanColumn as KanbanColumnType } from '@/hooks/useKanbanColumns';

interface KanbanViewProps {
  contracts: EnhancedContractData[];
  columns: KanbanColumnType[];
  onUpdateColumn: (columnId: string, updates: Partial<KanbanColumnType>) => Promise<any>;
}

const KanbanView = ({ contracts, columns, onUpdateColumn }: KanbanViewProps) => {
  const [activeContract, setActiveContract] = useState<EnhancedContractData | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const dragScrollRef = useDragToScroll();
  const updateContractStatus = useContractStatusUpdate();
  const isMobile = useIsMobile();
  
  // Configure drag sensors with proper touch support
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 3,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const contract = contracts.find(c => c.id === event.active.id);
    setActiveContract(contract || null);
    
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
    
    const targetColumn = columns.find(col => col.id === targetColumnId);
    if (!targetColumn) return;

    const newStatus = targetColumn.statuses[0];
    
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

  // Mobile layout with horizontal scrolling
  if (isMobile) {
    return (
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
                  onUpdateColumn={onUpdateColumn}
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
    );
  }

  // Desktop layout
  return (
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
              onUpdateColumn={onUpdateColumn}
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
  );
};

export default KanbanView;