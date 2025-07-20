
import ResponsiveKanbanView from './ResponsiveKanbanView';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { KanbanColumn as KanbanColumnType } from '@/hooks/useKanbanColumns';

interface KanbanViewProps {
  contracts: EnhancedContractData[];
  columns: KanbanColumnType[];
  onUpdateColumn: (columnId: string, updates: Partial<KanbanColumnType>) => Promise<any>;
}

const KanbanView = ({ contracts, columns, onUpdateColumn }: KanbanViewProps) => {
  return (
    <ResponsiveKanbanView
      contracts={contracts}
      columns={columns}
      onUpdateColumn={onUpdateColumn}
    />
  );
};

export default KanbanView;
