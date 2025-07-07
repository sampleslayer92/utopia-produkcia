import { useState, useCallback, useEffect } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const dragScrollRef = useDragToScroll({ disabled: isDragging });
  const updateContractStatus = useContractStatusUpdate();
  const isMobile = useIsMobile();
  
  // Enhanced mobile touch sensor with better gesture detection
  const mobileTouchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100, // Reduced from 200ms for faster response
      tolerance: 8, // Increased for better touch detection
    },
  });

  const desktopMouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 3,
    },
  });

  // Use different sensors for mobile vs desktop
  const sensors = useSensors(
    isMobile ? mobileTouchSensor : desktopMouseSensor
  );

  // Disable scroll snap during drag operations
  useEffect(() => {
    const scrollContainer = dragScrollRef.current;
    if (!scrollContainer) return;

    if (isDragging) {
      scrollContainer.style.scrollSnapType = 'none';
      scrollContainer.style.overflowX = 'hidden'; // Prevent scroll during drag on mobile
    } else {
      scrollContainer.style.scrollSnapType = isMobile ? 'x mandatory' : 'none';
      scrollContainer.style.overflowX = 'auto';
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.style.scrollSnapType = isMobile ? 'x mandatory' : 'none';
        scrollContainer.style.overflowX = 'auto';
      }
    };
  }, [isDragging, isMobile]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const contract = contracts.find(c => c.id === event.active.id);
    setActiveContract(contract || null);
    setIsDragging(true);
    
    // Enhanced haptic feedback for mobile
    if (isMobile && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [contracts, isMobile]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    const newOverColumn = over?.id as string || null;
    
    if (newOverColumn !== dragOverColumn) {
      setDragOverColumn(newOverColumn);
      
      // Light haptic feedback on column change for mobile
      if (isMobile && navigator.vibrate && newOverColumn) {
        navigator.vibrate(25);
      }
    }
  }, [dragOverColumn, isMobile]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveContract(null);
    setDragOverColumn(null);
    setIsDragging(false);

    if (!over || active.id === over.id) return;

    const contractId = active.id as string;
    const targetColumnId = over.id as string;
    
    const targetColumn = columns.find(col => col.id === targetColumnId);
    if (!targetColumn) return;

    const newStatus = targetColumn.statuses[0];
    
    // Success haptic feedback for mobile
    if (isMobile && navigator.vibrate) {
      navigator.vibrate([50, 25, 100]);
    }
    
    updateContractStatus.mutate({
      contractId,
      newStatus: newStatus as any
    });
  }, [columns, isMobile, updateContractStatus]);

  const getContractsForColumn = useCallback((columnStatuses: string[]) => {
    return contracts.filter(contract => columnStatuses.includes(contract.status));
  }, [contracts]);

  // Mobile layout with horizontal scrolling
  if (isMobile) {
    return (
      <DndContext 
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart} 
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div 
          ref={dragScrollRef}
          className={`
            dnd-context flex gap-3 overflow-x-auto pb-4 scrollbar-hidden snap-x p-3
            ${isDragging ? '' : 'snap-mandatory'}
          `}
          style={{ 
            scrollSnapType: isDragging ? 'none' : 'x mandatory',
            touchAction: isDragging ? 'none' : 'pan-x'
          }}
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

        <DragOverlay 
          dropAnimation={{ 
            duration: 300, 
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' 
          }}
          style={{ zIndex: 9999 }}
        >
          {activeContract ? (
            <div className="animate-kanban-drag pointer-events-none">
              <KanbanCard 
                contract={activeContract} 
                isDragging 
                isMobile
              />
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
        className="dnd-context grid grid-cols-2 lg:grid-cols-5 gap-6 min-h-[600px] overflow-x-auto scrollbar-hidden p-6"
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

      <DragOverlay 
        dropAnimation={{ 
          duration: 300, 
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' 
        }}
        style={{ zIndex: 9999 }}
      >
        {activeContract ? (
          <div className="animate-kanban-drag pointer-events-none">
            <KanbanCard contract={activeContract} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanView;