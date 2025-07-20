
import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { useContractStatusUpdate } from '@/hooks/useContractStatusUpdate';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { KanbanColumn } from '@/hooks/useKanbanColumns';
import PipedriveKanbanColumn from './PipedriveKanbanColumn';
import PipedriveKanbanCard from './PipedriveKanbanCard';
import { OverviewFilters } from './OverviewKanbanBoard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { toast } from 'sonner';

interface PipedriveKanbanViewProps {
  contracts: EnhancedContractData[];
  columns: KanbanColumn[];
  onUpdateColumn: (columnId: string, updates: Partial<KanbanColumn>) => Promise<any>;
  filters: OverviewFilters;
}

const PipedriveKanbanView = ({ 
  contracts, 
  columns,
  onUpdateColumn,
  filters
}: PipedriveKanbanViewProps) => {
  const [activeContract, setActiveContract] = useState<EnhancedContractData | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(new Set());
  
  const updateContractStatus = useContractStatusUpdate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    })
  );

  // Auto-adjust column widths based on content
  useEffect(() => {
    const newWidths: Record<string, number> = {};
    columns.forEach(column => {
      const contractsInColumn = getContractsForColumn(column.statuses);
      const baseWidth = 280;
      const contentWidth = Math.max(baseWidth, Math.min(400, baseWidth + contractsInColumn.length * 5));
      newWidths[column.id] = contentWidth;
    });
    setColumnWidths(newWidths);
  }, [contracts, columns]);

  const handleDragStart = (event: DragStartEvent) => {
    const contract = contracts.find(c => c.id === event.active.id);
    if (contract) {
      setActiveContract(contract);
      setIsDragging(true);
      
      // Haptic feedback on mobile
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setDragOverColumn(over.id as string);
      
      // Light haptic feedback on mobile
      if (isMobile && 'vibrate' in navigator) {
        navigator.vibrate(20);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveContract(null);
    setDragOverColumn(null);
    setIsDragging(false);

    if (!over) return;

    const contractId = active.id as string;
    const columnId = over.id as string;
    
    const targetColumn = columns.find(col => col.id === columnId);
    if (!targetColumn) return;

    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    // Find the new status based on column statuses
    const newStatus = targetColumn.statuses[0]; // Use first status in column
    
    if (contract.status !== newStatus) {
      updateContractStatus.mutate({
        contractId,
        newStatus: newStatus as any
      }, {
        onSuccess: () => {
          toast.success(`Deal moved to ${targetColumn.title}`);
          
          // Success haptic feedback on mobile
          if (isMobile && 'vibrate' in navigator) {
            navigator.vibrate([50, 50, 50]);
          }
        },
        onError: (error) => {
          toast.error('Failed to update deal status');
          console.error('Error updating contract status:', error);
        }
      });
    }
  };

  const getContractsForColumn = (columnStatuses: string[]): EnhancedContractData[] => {
    return contracts.filter(contract => 
      columnStatuses.includes(contract.status)
    );
  };

  const toggleColumnCollapse = (columnId: string) => {
    const newCollapsed = new Set(collapsedColumns);
    if (newCollapsed.has(columnId)) {
      newCollapsed.delete(columnId);
    } else {
      newCollapsed.add(columnId);
    }
    setCollapsedColumns(newCollapsed);
  };

  const getColumnStats = (contracts: EnhancedContractData[]) => {
    const totalValue = contracts.reduce((sum, contract) => sum + (contract.contractValue || 0), 0);
    const count = contracts.length;
    return { count, totalValue };
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Main scrollable container */}
      <div className={`
        h-full overflow-x-auto overflow-y-hidden
        ${isDragging ? 'select-none' : ''}
        p-4
      `}>
        <div className={`
          flex gap-4 h-full pb-4
          ${isMobile ? 'flex-col' : 'flex-row'}
        `}>
          {columns.map((column) => {
            const columnContracts = getContractsForColumn(column.statuses);
            const stats = getColumnStats(columnContracts);
            const isCollapsed = collapsedColumns.has(column.id);
            const width = isMobile ? '100%' : `${columnWidths[column.id] || 280}px`;

            return (
              <PipedriveKanbanColumn
                key={column.id}
                id={column.id}
                column={column}
                contracts={columnContracts}
                isDropTarget={dragOverColumn === column.id}
                onUpdateColumn={onUpdateColumn}
                stats={stats}
                width={width}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => toggleColumnCollapse(column.id)}
                isMobile={isMobile}
                style={{ 
                  minWidth: isCollapsed ? '60px' : (isMobile ? '100%' : '280px'),
                  maxWidth: isMobile ? '100%' : '400px',
                  height: isMobile ? 'auto' : '100%'
                }}
              />
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeContract ? (
          <PipedriveKanbanCard
            contract={activeContract}
            isDragging={true}
            isMobile={isMobile}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default PipedriveKanbanView;
