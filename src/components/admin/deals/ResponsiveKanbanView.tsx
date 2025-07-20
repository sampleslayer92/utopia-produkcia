
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
import { useResponsiveKanban } from '@/hooks/useResponsiveKanban';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { KanbanColumn as KanbanColumnType } from '@/hooks/useKanbanColumns';
import MobileKanbanView from './MobileKanbanView';
import TabletKanbanView from './TabletKanbanView';
import DesktopKanbanView from './DesktopKanbanView';
import KanbanCard from './KanbanCard';

interface ResponsiveKanbanViewProps {
  contracts: EnhancedContractData[];
  columns: KanbanColumnType[];
  onUpdateColumn: (columnId: string, updates: Partial<KanbanColumnType>) => Promise<any>;
}

const ResponsiveKanbanView = ({ contracts, columns, onUpdateColumn }: ResponsiveKanbanViewProps) => {
  const [activeContract, setActiveContract] = useState<EnhancedContractData | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const updateContractStatus = useContractStatusUpdate();
  const { viewport, config } = useResponsiveKanban();
  
  // Enhanced sensors based on device type
  const mobileTouchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: config.touchSensitivity,
    },
  });

  const desktopMouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(
    viewport.isMobile ? mobileTouchSensor : desktopMouseSensor
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const contract = contracts.find(c => c.id === event.active.id);
    setActiveContract(contract || null);
    setIsDragging(true);
    
    // Enhanced haptic feedback
    if (viewport.isMobile && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [contracts, viewport.isMobile]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    const newOverColumn = over?.id as string || null;
    
    if (newOverColumn !== dragOverColumn) {
      setDragOverColumn(newOverColumn);
      
      if (viewport.isMobile && navigator.vibrate && newOverColumn) {
        navigator.vibrate(25);
      }
    }
  }, [dragOverColumn, viewport.isMobile]);

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
    
    // Success haptic feedback
    if (viewport.isMobile && navigator.vibrate) {
      navigator.vibrate([50, 25, 100]);
    }
    
    updateContractStatus.mutate({
      contractId,
      newStatus: newStatus as any
    });
  }, [columns, viewport.isMobile, updateContractStatus]);

  const getContractsForColumn = useCallback((columnStatuses: string[]) => {
    return contracts.filter(contract => columnStatuses.includes(contract.status));
  }, [contracts]);

  const commonProps = {
    contracts,
    columns,
    onUpdateColumn,
    activeContract,
    dragOverColumn,
    isDragging,
    getContractsForColumn,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    sensors
  };

  return (
    <div className="h-full overflow-hidden">
      <DndContext 
        sensors={sensors}
        collisionDetection={viewport.isMobile ? pointerWithin : closestCorners}
        onDragStart={handleDragStart} 
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {viewport.isMobile && <MobileKanbanView {...commonProps} />}
        {viewport.isTablet && <TabletKanbanView {...commonProps} />}
        {viewport.isDesktop && <DesktopKanbanView {...commonProps} />}

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
                isMobile={viewport.isMobile}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default ResponsiveKanbanView;
