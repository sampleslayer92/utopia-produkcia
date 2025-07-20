
import { useRef, useState } from 'react';
import { SensorDescriptor } from '@dnd-kit/core';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { KanbanColumn as KanbanColumnType } from '@/hooks/useKanbanColumns';
import KanbanColumn from './KanbanColumn';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface DesktopKanbanViewProps {
  contracts: EnhancedContractData[];
  columns: KanbanColumnType[];
  onUpdateColumn: (columnId: string, updates: Partial<KanbanColumnType>) => Promise<any>;
  dragOverColumn: string | null;
  isDragging: boolean;
  getContractsForColumn: (statuses: string[]) => EnhancedContractData[];
  sensors: SensorDescriptor<any>[];
}

const DesktopKanbanView = ({ 
  columns, 
  onUpdateColumn, 
  dragOverColumn, 
  isDragging,
  getContractsForColumn 
}: DesktopKanbanViewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.7));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Desktop Controls */}
      <div className="flex items-center justify-end gap-2 p-2 bg-background border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoomLevel <= 0.7}
          className="h-7 px-2"
        >
          <ZoomOut className="h-3 w-3" />
        </Button>
        <span className="text-xs text-muted-foreground min-w-12 text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoomLevel >= 1.5}
          className="h-7 px-2"
        >
          <ZoomIn className="h-3 w-3" />
        </Button>
      </div>

      {/* Scrollable Board */}
      <div 
        ref={scrollRef}
        className="flex-1 flex gap-6 overflow-x-auto overflow-y-hidden p-6 scrollbar-hidden"
        style={{ 
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          minWidth: `${100 / zoomLevel}%`
        }}
      >
        {columns.map((column) => {
          const columnContracts = getContractsForColumn(column.statuses);
          const isDropTarget = dragOverColumn === column.id;
          
          return (
            <div key={column.id} className="flex-shrink-0 w-80">
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

      {/* Desktop Status Bar */}
      <div className="flex items-center justify-between p-2 bg-background border-t text-xs text-muted-foreground">
        <div>
          {columns.length} kolumn • {columns.reduce((acc, col) => acc + getContractsForColumn(col.statuses).length, 0)} deals
        </div>
        <div>
          Drag & Drop • Klavesove skratky: ←→ navigacia, Space výber
        </div>
      </div>
    </div>
  );
};

export default DesktopKanbanView;
