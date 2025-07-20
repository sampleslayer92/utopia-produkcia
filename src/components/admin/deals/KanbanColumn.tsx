
import { useDroppable } from '@dnd-kit/core';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import KanbanCard from './KanbanCard';
import EditableKanbanColumnHeader from './EditableKanbanColumnHeader';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { KanbanColumn as KanbanColumnType } from '@/hooks/useKanbanColumns';
import { useViewport } from '@/hooks/useViewport';

interface KanbanColumnProps {
  id: string;
  column: KanbanColumnType;
  contracts: EnhancedContractData[];
  isDropTarget?: boolean;
  onUpdateColumn: (columnId: string, updates: Partial<KanbanColumnType>) => Promise<any>;
}

const KanbanColumn = ({ id, column, contracts, isDropTarget = false, onUpdateColumn }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });
  const viewport = useViewport();

  // Dynamic height calculation for different screen sizes
  const getScrollAreaHeight = () => {
    if (viewport.width <= 1366) return 'h-[calc(100vh-200px)]';
    if (viewport.width <= 1440) return 'h-[calc(100vh-220px)]';
    if (viewport.isMobile) return 'h-[calc(100vh-280px)]';
    if (viewport.isTablet) return 'h-[calc(100vh-240px)]';
    return 'h-[calc(100vh-300px)]';
  };

  const getColumnPadding = () => {
    if (viewport.width <= 1366) return 'p-2';
    return viewport.isMobile ? 'p-3' : 'p-4';
  };

  const getCardSpacing = () => {
    if (viewport.width <= 1366) return 'space-y-2';
    return 'space-y-3';
  };

  return (
    <Card 
      ref={setNodeRef}
      className={`
        relative bg-kanban-column border-kanban-column-border h-full flex flex-col
        ${isOver || isDropTarget ? 'ring-2 ring-kanban-drag-over ring-opacity-70 bg-kanban-drag-over/5' : ''} 
        transition-all duration-300 ease-out
        ${isOver ? 'scale-[1.01] shadow-lg' : 'hover:shadow-md'}
        rounded-xl
        ${getColumnPadding()}
      `}
    >
      {/* Enhanced drop indicator */}
      {(isOver || isDropTarget) && (
        <div className="absolute inset-0 border-2 border-dashed border-kanban-drag-over rounded-xl opacity-50 animate-pulse-ring pointer-events-none" />
      )}
      
      {/* Sticky Header */}
      <CardHeader className="sticky top-0 z-20 bg-kanban-column/95 backdrop-blur-sm rounded-t-xl border-b border-kanban-column-border p-3 pb-2">
        <EditableKanbanColumnHeader
          column={column}
          onUpdate={onUpdateColumn}
          count={contracts.length}
        />
      </CardHeader>
      
      {/* Scrollable Content */}
      <CardContent className="flex-1 p-0 pt-2 overflow-hidden">
        <ScrollArea className={getScrollAreaHeight()}>
          <div className={`${getCardSpacing()} ${viewport.width <= 1366 ? 'pr-1' : viewport.isMobile ? 'pr-2' : 'pr-4'}`}>
            {contracts.map((contract, index) => (
              <div
                key={contract.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <KanbanCard 
                  contract={contract}
                  isMobile={viewport.isMobile}
                  isCompact={viewport.width <= 1366}
                />
              </div>
            ))}
            
            {contracts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <div className={`${viewport.width <= 1366 ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-muted/50 flex items-center justify-center mb-2`}>
                  <svg className={`${viewport.width <= 1366 ? 'w-6 h-6' : 'w-8 h-8'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className={`font-medium ${viewport.width <= 1366 ? 'text-xs' : 'text-sm'}`}>Žiadne deals</p>
                <p className={`text-center mt-1 ${viewport.width <= 1366 ? 'text-[10px]' : 'text-xs'}`}>Karty presunuté sem sa zobrazia tu</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
