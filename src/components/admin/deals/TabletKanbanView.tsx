
import { useRef } from 'react';
import { SensorDescriptor } from '@dnd-kit/core';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { KanbanColumn as KanbanColumnType } from '@/hooks/useKanbanColumns';
import { useResponsiveKanban } from '@/hooks/useResponsiveKanban';
import KanbanColumn from './KanbanColumn';

interface TabletKanbanViewProps {
  contracts: EnhancedContractData[];
  columns: KanbanColumnType[];
  onUpdateColumn: (columnId: string, updates: Partial<KanbanColumnType>) => Promise<any>;
  dragOverColumn: string | null;
  isDragging: boolean;
  getContractsForColumn: (statuses: string[]) => EnhancedContractData[];
  sensors: SensorDescriptor<any>[];
}

const TabletKanbanView = ({ 
  columns, 
  onUpdateColumn, 
  dragOverColumn, 
  isDragging,
  getContractsForColumn 
}: TabletKanbanViewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getColumnWidth, viewport } = useResponsiveKanban();

  // Calculate how many columns fit in viewport
  const columnsPerView = viewport.orientation === 'landscape' ? 3 : 2;
  const columnWidth = getColumnWidth(columns.length);

  return (
    <div className="h-full flex flex-col">
      <div 
        ref={scrollRef}
        className={`
          flex-1 flex gap-4 overflow-x-auto overflow-y-hidden p-4
          scrollbar-hidden
          ${isDragging ? '' : 'snap-x snap-proximity'}
        `}
        style={{ 
          scrollSnapType: isDragging ? 'none' : 'x proximity',
          touchAction: isDragging ? 'none' : 'pan-x'
        }}
      >
        {columns.map((column) => {
          const columnContracts = getContractsForColumn(column.statuses);
          const isDropTarget = dragOverColumn === column.id;
          
          return (
            <div 
              key={column.id}
              className="flex-shrink-0 snap-start"
              style={{ width: columnWidth }}
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

      {/* Tablet-specific footer with column count */}
      <div className="p-3 bg-background border-t text-center text-sm text-muted-foreground">
        {columns.length} kolumn • Potiahni karty pre presun
      </div>
    </div>
  );
};

export default TabletKanbanView;
