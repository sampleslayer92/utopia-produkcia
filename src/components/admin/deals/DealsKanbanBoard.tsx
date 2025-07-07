
import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useEnhancedContractsData } from '@/hooks/useEnhancedContractsData';
import { useContractStatusUpdate } from '@/hooks/useContractStatusUpdate';
import { useContractsRealtime } from '@/hooks/useContractsRealtime';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const { data: contracts = [], isLoading, error } = useEnhancedContractsData();
  const updateContractStatus = useContractStatusUpdate();
  const isMobile = useIsMobile();
  
  // Enable real-time updates
  useContractsRealtime();

  const handleDragStart = (event: DragStartEvent) => {
    const contract = contracts.find(c => c.id === event.active.id);
    setActiveContract(contract || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveContract(null);

    if (!over || active.id === over.id) return;

    const contractId = active.id as string;
    const targetColumnId = over.id as string;
    
    // Find the target column and get the first status from it
    const targetColumn = KANBAN_COLUMNS.find(col => col.id === targetColumnId);
    if (!targetColumn) return;

    const newStatus = targetColumn.statuses[0]; // Use first status of the column
    
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

  // Mobile layout with tabs
  if (isMobile) {
    return (
      <div className="p-3">
        <Tabs defaultValue="new_requests" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            {KANBAN_COLUMNS.map((column) => {
              const columnContracts = getContractsForColumn(column.statuses);
              return (
                <TabsTrigger key={column.id} value={column.id} className="flex flex-col items-center gap-1 text-xs">
                  <span className="truncate">{column.title.split(' ')[0]}</span>
                  <Badge variant="secondary" className="text-xs px-1 py-0 min-w-[20px] h-5">
                    {columnContracts.length}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {KANBAN_COLUMNS.map((column) => {
            const columnContracts = getContractsForColumn(column.statuses);
            return (
              <TabsContent key={column.id} value={column.id} className="mt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{column.title}</h3>
                    <Badge variant="secondary">
                      {columnContracts.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {columnContracts.map((contract) => (
                      <KanbanCard 
                        key={contract.id} 
                        contract={contract}
                        isMobile={true}
                      />
                    ))}
                    {columnContracts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Žiadne deals
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    );
  }

  // Desktop layout with drag & drop
  return (
    <div className="p-6">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 min-h-[600px]">
          {KANBAN_COLUMNS.map((column) => {
            const columnContracts = getContractsForColumn(column.statuses);
            
            return (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                contracts={columnContracts}
                color={column.color}
                count={columnContracts.length}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeContract ? (
            <KanbanCard contract={activeContract} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default DealsKanbanBoard;
