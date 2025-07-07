
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
import { useDragToScroll } from '@/hooks/useDragToScroll';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';

const KANBAN_COLUMNS = [
  {
    id: 'new_requests',
    title: 'Nové žiadosti',
    statuses: ['draft', 'in_progress'],
    color: 'bg-slate-100 border-slate-200'
  },
  {
    id: 'in_processing',
    title: 'V spracovaní',
    statuses: ['sent_to_client', 'email_viewed'],
    color: 'bg-blue-50 border-blue-200'
  },
  {
    id: 'pending_approval',
    title: 'Na schválenie',
    statuses: ['contract_generated', 'waiting_for_signature'],
    color: 'bg-yellow-50 border-yellow-200'
  },
  {
    id: 'completed',
    title: 'Dokončené',
    statuses: ['signed', 'approved'],
    color: 'bg-green-50 border-green-200'
  },
  {
    id: 'stopped',
    title: 'Zastavené',
    statuses: ['lost', 'rejected'],
    color: 'bg-red-50 border-red-200'
  }
];

const DealsKanbanBoard = () => {
  const [activeContract, setActiveContract] = useState<EnhancedContractData | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const dragScrollRef = useDragToScroll();
  const { data: contracts = [], isLoading, error } = useEnhancedContractsData();
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
    const targetColumn = KANBAN_COLUMNS.find(col => col.id === targetColumnId);
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

  if (isLoading) {
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
      <div className="p-3">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart} 
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div 
            ref={dragScrollRef}
            className="flex gap-3 overflow-x-auto pb-4 scrollbar-hidden snap-x snap-mandatory"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {KANBAN_COLUMNS.map((column) => {
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
                    title={column.title}
                    contracts={columnContracts}
                    color={column.color}
                    count={columnContracts.length}
                    isDropTarget={isDropTarget}
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
    );
  }

  // Desktop layout with drag & drop
  return (
    <div className="p-6">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart} 
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div 
          ref={dragScrollRef}
          className="grid grid-cols-2 lg:grid-cols-5 gap-6 min-h-[600px] overflow-x-auto scrollbar-hidden"
        >
          {KANBAN_COLUMNS.map((column) => {
            const columnContracts = getContractsForColumn(column.statuses);
            const isDropTarget = dragOverColumn === column.id;
            
            return (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                contracts={columnContracts}
                color={column.color}
                count={columnContracts.length}
                isDropTarget={isDropTarget}
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
  );
};

export default DealsKanbanBoard;
