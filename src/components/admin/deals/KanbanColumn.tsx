
import { useDroppable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
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

  // Dynamic height based on viewport
  const getScrollAreaHeight = () => {
    if (viewport.isMobile) return 'h-[calc(100vh-280px)]';
    if (viewport.isTablet) return 'h-[calc(100vh-240px)]';
    return 'h-[calc(100vh-300px)]';
  };

  return (
    <Card 
      ref={setNodeRef}
      className={`
        relative bg-kanban-column border-kanban-column-border
        ${isOver || isDropTarget ? 'ring-2 ring-kanban-drag-over ring-opacity-70 bg-kanban-drag-over/5' : ''} 
        transition-all duration-300 ease-out
        ${isOver ? 'scale-[1.02] shadow-lg' : 'hover:shadow-md'}
        rounded-xl
        ${viewport.isMobile ? 'p-3' : 'p-4'}
        ${viewport.isMobile ? 'min-h-[60vh]' : ''}
      `}
    >
      {/* Enhanced drop indicator */}
      {(isOver || isDropTarget) && (
        <div className="absolute inset-0 border-2 border-dashed border-kanban-drag-over rounded-xl opacity-50 animate-pulse-ring pointer-events-none" />
      )}
      
      <EditableKanbanColumnHeader
        column={column}
        onUpdate={onUpdateColumn}
        count={contracts.length}
      />
      
      <ScrollArea className={getScrollAreaHeight()}>
        <div className={`space-y-3 ${viewport.isMobile ? 'pr-2' : 'pr-4'}`}>
          {contracts.map((contract, index) => (
            <div
              key={contract.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <KanbanCard 
                contract={contract}
                isMobile={viewport.isMobile}
              />
            </div>
          ))}
          
          {contracts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className={`font-medium ${viewport.isMobile ? 'text-sm' : 'text-sm'}`}>Žiadne deals</p>
              <p className={`text-center mt-1 ${viewport.isMobile ? 'text-xs' : 'text-xs'}`}>Karty presunuté sem sa zobrazia tu</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default KanbanColumn;
