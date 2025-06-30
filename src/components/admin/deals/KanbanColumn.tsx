
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
}

const KanbanColumn = ({ id, title, contracts, color, count }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <Card 
      ref={setNodeRef}
      className={`p-4 ${color} ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''} transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <Badge variant="secondary" className="bg-white/60">
          {count}
        </Badge>
      </div>
      
      <div className="space-y-3 min-h-[500px]">
        {contracts.map((contract) => (
          <KanbanCard 
            key={contract.id} 
            contract={contract}
          />
        ))}
        
        {contracts.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Žiadne deals
          </div>
        )}
      </div>
    </Card>
  );
};

export default KanbanColumn;
