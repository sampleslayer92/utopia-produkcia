
import { useRef, useEffect } from 'react';
import { SensorDescriptor } from '@dnd-kit/core';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { KanbanColumn as KanbanColumnType } from '@/hooks/useKanbanColumns';
import { useResponsiveKanban } from '@/hooks/useResponsiveKanban';
import KanbanColumn from './KanbanColumn';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileKanbanViewProps {
  contracts: EnhancedContractData[];
  columns: KanbanColumnType[];
  onUpdateColumn: (columnId: string, updates: Partial<KanbanColumnType>) => Promise<any>;
  dragOverColumn: string | null;
  isDragging: boolean;
  getContractsForColumn: (statuses: string[]) => EnhancedContractData[];
  sensors: SensorDescriptor<any>[];
}

const MobileKanbanView = ({ 
  columns, 
  onUpdateColumn, 
  dragOverColumn, 
  isDragging,
  getContractsForColumn 
}: MobileKanbanViewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeColumnIndex, navigateToColumn, getColumnWidth } = useResponsiveKanban();

  // Auto-scroll to active column
  useEffect(() => {
    if (scrollRef.current) {
      const columnWidth = getColumnWidth(columns.length);
      const scrollPosition = activeColumnIndex * (columnWidth + 24); // 24px gap
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [activeColumnIndex, getColumnWidth, columns.length]);

  const handlePrevColumn = () => {
    if (activeColumnIndex > 0) {
      navigateToColumn(activeColumnIndex - 1);
    }
  };

  const handleNextColumn = () => {
    if (activeColumnIndex < columns.length - 1) {
      navigateToColumn(activeColumnIndex + 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Navigation */}
      <div className="flex items-center justify-between p-3 bg-background border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevColumn}
          disabled={activeColumnIndex === 0}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          {columns.map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToColumn(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeColumnIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextColumn}
          disabled={activeColumnIndex === columns.length - 1}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Columns */}
      <div 
        ref={scrollRef}
        className={`
          flex-1 flex overflow-x-auto overflow-y-hidden
          scrollbar-hidden snap-x snap-mandatory
          ${isDragging ? 'scroll-snap-type-none' : ''}
        `}
        style={{ 
          scrollSnapType: isDragging ? 'none' : 'x mandatory',
          touchAction: isDragging ? 'none' : 'pan-x'
        }}
      >
        {columns.map((column, index) => {
          const columnContracts = getContractsForColumn(column.statuses);
          const isDropTarget = dragOverColumn === column.id;
          const columnWidth = getColumnWidth(columns.length);
          
          return (
            <div 
              key={column.id}
              className="flex-shrink-0 snap-start p-3"
              style={{ width: columnWidth + 24 }} // Include padding
            >
              <div style={{ width: columnWidth }}>
                <KanbanColumn
                  id={column.id}
                  column={column}
                  contracts={columnContracts}
                  isDropTarget={isDropTarget}
                  onUpdateColumn={onUpdateColumn}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Column Indicator */}
      <div className="p-2 text-center text-sm text-muted-foreground bg-background border-t">
        {activeColumnIndex + 1} / {columns.length} - {columns[activeColumnIndex]?.title}
      </div>
    </div>
  );
};

export default MobileKanbanView;
