
import { useDroppable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import KanbanCard from './KanbanCard';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';

interface KanbanColumnProps {
  id: string;
  title: string;
  contracts: EnhancedContractData[];
  color: string;
  count: number;
  isDropTarget?: boolean;
}

const KanbanColumn = ({ id, title, contracts, color, count, isDropTarget = false }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <Card 
      ref={setNodeRef}
      className={`
        relative p-4 bg-kanban-column border-kanban-column-border
        ${isOver || isDropTarget ? 'ring-2 ring-kanban-drag-over ring-opacity-70 bg-kanban-drag-over/5' : ''} 
        transition-all duration-300 ease-out
        ${isOver ? 'scale-[1.02] shadow-lg' : 'hover:shadow-md'}
        rounded-xl
      `}
    >
      {/* Drop indicator */}
      {(isOver || isDropTarget) && (
        <div className="absolute inset-0 border-2 border-dashed border-kanban-drag-over rounded-xl opacity-50 animate-pulse-ring pointer-events-none" />
      )}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        <Badge 
          variant="secondary" 
          className="bg-background/80 text-muted-foreground text-xs px-2 py-1 font-medium shadow-sm"
        >
          {count}
        </Badge>
      </div>
      
      <div className="space-y-3 min-h-[500px]">
        {contracts.map((contract, index) => (
          <div
            key={contract.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <KanbanCard 
              contract={contract}
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
            <p className="text-sm font-medium">Žiadne deals</p>
            <p className="text-xs text-center mt-1">Karty presunuté sem sa zobrazia tu</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default KanbanColumn;
